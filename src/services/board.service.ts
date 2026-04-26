import { baseApi, BOARD_ENDPOINT, buildUrl, HttpMethod } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Board } from '../types/board.type';

export const boardService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBoard: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: BOARD_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Workspace', 'Board'],
    }),
    detailBoard: builder.query<SuccessResponse<Board>, string>({
      query: (params) => ({
        url: buildUrl({ path: BOARD_ENDPOINT.DETAIL, params: { id: params } }),
        method: HttpMethod.GET,
      }),
    }),
  }),
});

export const { useCreateBoardMutation, useDetailBoardQuery } = boardService;
