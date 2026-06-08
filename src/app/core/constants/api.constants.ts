import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const AUTH_API = {
  register: `${API_BASE_URL}/users/register/`,
  login: `${API_BASE_URL}/users/login/`,
  refresh: `${API_BASE_URL}/users/token/refresh/`,
  profile: `${API_BASE_URL}/users/profile/`,
  avatar: `${API_BASE_URL}/users/profile/avatar/`,
  dashboard: `${API_BASE_URL}/users/profile/dashboard/`,
  favorites: `${API_BASE_URL}/users/favorites/`,
  favoriteAuthors: `${API_BASE_URL}/users/favorite-authors/`,
  news: `${API_BASE_URL}/users/news/`,
  passwordReset: `${API_BASE_URL}/users/password-reset/`,
  passwordResetConfirm: `${API_BASE_URL}/users/password-reset/confirm/`,
};

export const WRITINGS_API = `${API_BASE_URL}/writings/`;

export const WRITING_ASSIST_API = `${API_BASE_URL}/writings/assist/`;

export const COMMENTS_API = `${API_BASE_URL}/comments/`;

export const TOKEN_STORAGE_KEYS = {
  access: 'storyteller_access_token',
  refresh: 'storyteller_refresh_token',
};
