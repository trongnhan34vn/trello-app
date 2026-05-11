import { AUTH_ENDPOINT, baseApi, buildUrl, HttpMethod } from '.';

export const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: AUTH_ENDPOINT.SIGN_IN }),
        method: HttpMethod.POST,
        body,
      }),
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
  }),
});

export const { useSignInMutation, useSignUpMutation, useResendCodeMutation, useConfirmMutation } = authService;
