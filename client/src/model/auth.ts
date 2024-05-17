export type AuthT = {
  token: string;
  username: string;
  admin: boolean;
};

export type SignUpAuthT = {
  username: string;
  password: string;
  name: string;
  email: string;
  admin: string;
};

export type LoginAuthT = {
  username: string;
  password: string;
};
