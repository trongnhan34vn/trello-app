import { baseApi, buildUrl, CHECKLIST_ITEM_ENDPOINT, HttpMethod } from '.';

export const checklistItemService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChecklistItem: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: CHECKLIST_ITEM_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Checklist'],
    }),
    updateChecklistItem: builder.mutation({
      query: (param) => ({
        url: buildUrl({ path: CHECKLIST_ITEM_ENDPOINT.UPDATE, params: { id: param.id } }),
        method: HttpMethod.PATCH,
        body: param,
      }),
      invalidatesTags: ['Checklist'],
    }),
  }),
});

export const { useCreateChecklistItemMutation, useUpdateChecklistItemMutation } =
  checklistItemService;
