type AuthT = {
  token: string;
  username: string;
  admin: boolean;
};

type SignUpAuthT = {
  username: string;
  password: string;
  name: string;
  email: string;
  admin: string;
};

type LoginAuthT = {
  username: string;
  password: string;
};
