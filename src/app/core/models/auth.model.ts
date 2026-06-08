export interface IUser {
  id: number | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  author_name: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  author_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse extends AuthTokens {
  user?: IUser;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  password: string;
}

export interface ApiMessageResponse {
  detail: string;
}
