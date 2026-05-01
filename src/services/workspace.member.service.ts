import { baseApi, buildUrl, HttpMethod, WORKSPACE_MEMBER_ENDPOINT } from '.';

export const boardMemberService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // listBoardMember: builder.query<
    //   SuccessResponse<BoardMember[]>,
    //   { boardId: string; search?: string }
    // >({
    //   query: (params) => ({
    //     url: buildUrl({
    //       path: BOARD_MEMBER_ENDPOINT.LIST,
    //       query: { boardId: params.boardId ?? '', search: params.search ?? '' },
    //     }),
    //     method: HttpMethod.GET,
    //   }),
    //   providesTags: ['BoardMember']
    // }),
    
    createWorkspaceMember: builder.mutation({
      query: (body) => ({
        url: buildUrl({ path: WORKSPACE_MEMBER_ENDPOINT.CREATE }),
        method: HttpMethod.POST,
        body,
      }),
      invalidatesTags: ['Workspace'],
    }),
  }),
});

export const { useCreateWorkspaceMemberMutation } = boardMemberService;
