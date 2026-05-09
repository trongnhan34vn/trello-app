import { baseApi, buildUrl, HttpMethod, LIST_ENDPOINT } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { List } from '../types/list.type';

export const listService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listList: builder.query<SuccessResponse<List[]>, string>({
      query: (params) => ({
        url: buildUrl({ path: LIST_ENDPOINT.LIST, query: { boardId: params } }),
        method: HttpMethod.GET,
      }),
      providesTags: ['List'],
    }),
    createList: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: LIST_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
    }),
    updateList: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: LIST_ENDPOINT.UPDATE, params: { id: body.id } }),
        method: HttpMethod.PATCH,
        body,
      }),
      invalidatesTags: ['List'],
    }),
    updatePosList: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: LIST_ENDPOINT.UPDATE, params: { id: body.id } }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    deleteList: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: LIST_ENDPOINT.UPDATE, params: { id: body.id } }),
        method: HttpMethod.DELETE,
      }),
      invalidatesTags: ['List'],
    }),
  }),
});

export const {
  useListListQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useUpdatePosListMutation
} = listService;
