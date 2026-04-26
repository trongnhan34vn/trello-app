import { baseApi, buildUrl, HttpMethod, WORKSPACE_ENDPOINT } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Workspace } from '../types/workspace.type';

export const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: WORKSPACE_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Workspace'],
    }),
    listWorkspace: builder.query<SuccessResponse<Workspace[]>, any>({
      query: (params?: any) => ({
        url: buildUrl({ path: WORKSPACE_ENDPOINT.LIST, query: { search: params } }),
        method: HttpMethod.GET,
      }),
      providesTags: ['Workspace'],
    }),
    detailWorkspace: builder.query<SuccessResponse<Workspace>, any>({
      query: (params?: any) => ({
        url: buildUrl({ path: WORKSPACE_ENDPOINT.DETAIL, params: { id: params } }),
        method: HttpMethod.GET,
      }),
      providesTags: ['Workspace'],
    }),
  }),
});

export const { useCreateWorkspaceMutation, useListWorkspaceQuery, useDetailWorkspaceQuery } =
  authService;
