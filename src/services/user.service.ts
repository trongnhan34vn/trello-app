import { baseApi, buildUrl, HttpMethod, USER_ENDPOINT } from '.';
import { type SuccessResponse } from '../types/api.type';
import type { User } from '../types/user.type';

export const userSerivce = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<SuccessResponse<User>, void>({
      query: () => buildUrl({ path: USER_ENDPOINT.ME }),
    }),
    updateProfile: builder.mutation({
      query: (body: any) => ({
        url: buildUrl({ path: USER_ENDPOINT.UPDATE, params: { id: body.id } }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
  }),
});

export const { useMeQuery } = userSerivce;
