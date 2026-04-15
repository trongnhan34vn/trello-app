import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

export const ReducerPath = {
  AUTH: 'auth',
};

export const PREFIX_ENDPOINT = '/api/v1';

export const AUTH_ENDPOINT = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  RESEND_CODE: '/auth/resend-code',
  CONFIRM_SIGN_UP: '/auth/confirm-sign-up',
};

export const USER_ENDPOINT = {
  ME: '/users/me'
}

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL + PREFIX_ENDPOINT,
  credentials: 'include',
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}), // empty base
});

const buildEndpoint = (path: string, params: Record<string, string | number>) => {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(String(value)));
    });
  }
  return url;
};

const buildQuery = (query?: Record<string, any>) => {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const buildUrl = ({
  path,
  params,
  query,
}: {
  path: string;
  params?: Record<string, string | number>;
  query?: Record<string, any>;
}) => {
  return buildEndpoint(path, params) + buildQuery(query);
};
