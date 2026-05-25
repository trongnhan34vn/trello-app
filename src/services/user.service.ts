import { baseApi, buildUrl, HttpMethod, USER_ENDPOINT } from '.';
import { type SuccessResponse } from '../types/api.type';
import type { User } from '../types/user.type';

export const userSerivce = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<SuccessResponse<User>, void>({
      query: () => buildUrl({ path: USER_ENDPOINT.ME }),
      providesTags: ['User'],
      keepUnusedDataFor: 0,
    }),
    updateProfile: builder.mutation({
      query: (body: any) => ({
        url: buildUrl({ path: USER_ENDPOINT.UPDATE }),
        method: HttpMethod.PUT,
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useMeQuery, useUpdateProfileMutation } = userSerivce;
