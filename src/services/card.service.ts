import { baseApi, buildUrl, CARD_ENDPOINT, HttpMethod } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Card } from '../types/card.type';

export const cardService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCard: builder.query<SuccessResponse<Card[]>, string>({
      query: (params) => ({
        url: buildUrl({ path: CARD_ENDPOINT.LIST, query: { boardId: params } }),
        method: HttpMethod.GET,
      }),
    }),
    createCard: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: CARD_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Card'],
    }),
    updateCard: builder.mutation({
      query: (param) => ({
        url: buildUrl({ path: CARD_ENDPOINT.UPDATE, params: { id: param.id } }),
        method: HttpMethod.PATCH,
        body: param,
      }),
      invalidatesTags: ['Card'],
    }),
    detailCard: builder.query({
      query: (param) => ({
        url: buildUrl({ path: CARD_ENDPOINT.DETAIL, params: { id: param.id } }),
      }),
      providesTags: ['Card'],
    }),
  }),
});

export const {
  useListCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDetailCardQuery,
} = cardService;
