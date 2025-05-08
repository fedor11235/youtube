export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  url?: string
}