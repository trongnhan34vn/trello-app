import { baseApi, buildUrl, USER_ENDPOINT } from '.';
import type { User } from '../types/user.type';

export const userSerivce = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => buildUrl({path: USER_ENDPOINT.ME}),
    }),
  }),
});

export const { useMeQuery } = userSerivce;
