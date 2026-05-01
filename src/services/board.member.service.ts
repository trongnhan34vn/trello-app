import { baseApi, BOARD_MEMBER_ENDPOINT, buildUrl, HttpMethod } from '.';
import { type SuccessResponse } from '../types/api.type';
import { type BoardMember } from '../types/board.member.type';

export const boardMemberService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBoardMember: builder.query<
      SuccessResponse<BoardMember[]>,
      { boardId: string; search?: string }
    >({
      query: (params) => ({
        url: buildUrl({
          path: BOARD_MEMBER_ENDPOINT.LIST,
          query: { boardId: params.boardId ?? '', search: params.search ?? '' },
        }),
        method: HttpMethod.GET,
      }),
      providesTags: ['BoardMember']
    }),
    
    createBoardMember: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: BOARD_MEMBER_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['BoardMember'],
    }),
  }),
});

export const { useListBoardMemberQuery, useCreateBoardMemberMutation } = boardMemberService;
