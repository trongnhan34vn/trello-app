import { baseApi, buildUrl, HttpMethod, WORKSPACE_CATEGORY_ENDPOINT } from '.';
import type { WorkspaceCategory } from '../types/workspace.category.type';

export const workspaceCategoryService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWorkspaceCategory: builder.query<WorkspaceCategory, void>({
      query: () => ({
        url: buildUrl({ path: WORKSPACE_CATEGORY_ENDPOINT.LIST }),
        method: HttpMethod.GET,
      }),
    }),
  }),
});

export const { useListWorkspaceCategoryQuery } = workspaceCategoryService;
