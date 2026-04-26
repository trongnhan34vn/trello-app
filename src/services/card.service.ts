import method from 'lodash/method';
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
    }),
    updateCard: builder.mutation({
      query: (param) => ({
        url: buildUrl({ path: CARD_ENDPOINT.UPDATE, params: { id: param.id } }),
        method: HttpMethod.PATCH,
        body: param,
      }),
    }),
  }),
});

export const { useListCardQuery, useCreateCardMutation, useUpdateCardMutation } = cardService;
