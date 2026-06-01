import { AUTH_ENDPOINT, baseApi, buildUrl, HttpMethod } from '.';

export const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.SIGN_IN }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['User'],
    }),
    signUp: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.SIGN_UP }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    resendCode: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.RESEND_CODE }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    confirm: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.CONFIRM_SIGN_UP }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.REFRESH_TOKEN }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body: any) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.CHANGE_PASSWORD }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: buildUrl({ path: AUTH_ENDPOINT.SIGN_OUT }),
        method: HttpMethod.POST,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          // keep cache if sign-out failed
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useResendCodeMutation,
  useConfirmMutation,
  useChangePasswordMutation,
  useSignOutMutation
} = authService;
