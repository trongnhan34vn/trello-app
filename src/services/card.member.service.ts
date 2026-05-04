import { baseApi, buildUrl, CARD_MEMBER_ENDPOINT, HttpMethod } from '.';
import { type SuccessResponse } from '../types/api.type';
import type { CardMember } from '../types/card.member.type';

export const cardMemberService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCardMember: builder.query<SuccessResponse<CardMember[]>, { cardId: string }>({
      query: (params) => ({
        url: buildUrl({
          path: CARD_MEMBER_ENDPOINT.LIST,
          query: { cardId: params.cardId ?? '' },
        }),
        method: HttpMethod.GET,
      }),
      providesTags: ['CardMember'],
    }),

    createCardMember: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: CARD_MEMBER_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['CardMember'],
    }),

    deleteCardMember: builder.mutation({
      query: (param) => ({
        url: buildUrl({ path: CARD_MEMBER_ENDPOINT.DELETE, params: { id: param.id } }),
        method: HttpMethod.DELETE,
      }),
      invalidatesTags: ['CardMember'],
    }),
  }),
});

export const { useListCardMemberQuery, useCreateCardMemberMutation, useDeleteCardMemberMutation } = cardMemberService;
