import { UserStatus } from '../../shared/models/enums';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  userLevel?: string | null;
  roles?: readonly string[];
  permissions?: readonly string[];
  status?: UserStatus;
}

export interface AuthSession {
  accessToken: string;
  tokenType?: string;
  expiresIn: number;
  csrfToken?: string;
  user: AuthenticatedUser;
}

export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  currentUser: '/auth/me',
} as const;

export const AUTH_BEARER_SKIP_ENDPOINTS: readonly string[] = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.refresh,
  AUTH_ENDPOINTS.logout,
];
