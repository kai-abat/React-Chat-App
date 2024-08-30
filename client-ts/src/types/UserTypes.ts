export interface RegisterFormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export interface RegisterUserBodyType {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserBodyType {
  email: string;
  password: string;
}

export interface UserInfoType {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserPublicInfoType {
  _id: string;
  name: string;
  email: string;
}

export interface OnlineUsersType {
  user: UserInfoType;
  socketId: string;
}
