import { baseApi, buildUrl, CHECKLIST_ENDPOINT, HttpMethod } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Checklist } from '../types/checklist.type';

export const checklistService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listChecklist: builder.query<SuccessResponse<Checklist[]>, any>({
      query: (params) => ({
        url: buildUrl({ path: CHECKLIST_ENDPOINT.LIST, query: { cardId: params.cardId } }),
        method: HttpMethod.GET,
      }),
      providesTags: ['Checklist']
    }),
    createChecklist: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: CHECKLIST_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Checklist']
    }),
    updateChecklist: builder.mutation({
      query: (param) => ({
        url: buildUrl({ path: CHECKLIST_ENDPOINT.UPDATE, params: { id: param.id } }),
        method: HttpMethod.PATCH,
        body: param,
      }),
    }),
  }),
});

export const { useCreateChecklistMutation, useListChecklistQuery, useUpdateChecklistMutation } =
  checklistService;
