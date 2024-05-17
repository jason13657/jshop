import { createContext, createRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import AuthService from "../service/auth";
import { AuthT, LoginAuthT, SignUpAuthT } from "../model/auth";
import AuthErrorEventBus from "../utils/auth_error";

//Web client does not need to store jwt auth token.

type Props = {
  children: JSX.Element;
  authService: AuthService;
};

type CSRFHandle = {
  getToken: () => string | undefined;
};

type AuthController = {
  signUp: (auth: SignUpAuthT) => Promise<void>;
  login: (auth: LoginAuthT) => Promise<void>;
  signout: () => Promise<any>;
};

const AuthContext = createContext<(AuthController & { auth: AuthT | undefined }) | undefined>(undefined);

const csrfRef = createRef<CSRFHandle>();

export default function AuthProvider({ children, authService }: Props) {
  const [auth, setAuth] = useState<AuthT>();
  const [csrf, setCSRF] = useState<string>();

  //this hook is for exporting token.
  useImperativeHandle<CSRFHandle, CSRFHandle>(csrfRef, () => ({
    getToken: () => csrf,
  }));

  useEffect(() => {
    authService.me().then(setAuth).catch(console.error);
    AuthErrorEventBus.getInstance().listen((err) => {
      console.error(err);
      setAuth(undefined);
    });
  }, [authService]);

  useEffect(() => {
    authService
      .csrf()
      .then((data) => {
        setCSRF(data.csrfToken);
      })
      .catch(console.error);
  }, [authService]);

  const signUp = useCallback(
    (auth: SignUpAuthT) => {
      return authService.signup(auth).then(setAuth);
    },
    [authService]
  );

  const login = useCallback((auth: LoginAuthT) => {
    return authService.login(auth).then(setAuth);
  }, []);

  const signout = useCallback(() => {
    return authService.signout();
  }, []);

  return <AuthContext.Provider value={{ signout, login, signUp, auth }}>{children}</AuthContext.Provider>;
}

export const getCSRFToken = () => csrfRef.current?.getToken();
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === undefined) {
    throw Error("No value in Auth context.");
  }
  return value;
};
