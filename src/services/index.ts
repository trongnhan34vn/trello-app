import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import axios from 'axios';

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

export const WORKSPACE_CATEGORY_ENDPOINT = {
  LIST: '/workspace-categories'
}

export const IMAGE_ENDPOINT = {
  LIST: '/images'
}

export const ROLE_ENDPOINT = {
  LIST: '/roles'
}

export const WORKSPACE_ENDPOINT = {
  CREATE: '/workspaces',
  LIST: '/workspaces',
  DETAIL: '/workspaces/:id'
}

export const BOARD_ENDPOINT = {
  CREATE: '/boards',
  DETAIL: '/boards/:id'
}

export const LIST_ENDPOINT = {
  LIST: '/lists',
  CREATE: '/lists'
}

export const CARD_ENDPOINT = {
  LIST: '/cards',
  CREATE: '/cards',
  UPDATE: '/cards/:id'
}

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL + PREFIX_ENDPOINT,
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const isConfirmEmailPage = window.location.pathname.includes('/confirm') || window.location.pathname.includes('/');

  if (result.error?.status == 401 && !isConfirmEmailPage) {
    window.location.href = '/';
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workspace', 'User', 'Auth', 'Board', 'List', 'Card'],
  endpoints: () => ({}), // empty base
});

const buildEndpoint = (path: string, params: Record<string, string | number> | undefined) => {
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

export const http = () => {
  return axios.create({
    baseURL: BASE_URL + PREFIX_ENDPOINT,
    withCredentials: true
  })
}