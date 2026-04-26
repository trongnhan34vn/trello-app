import { baseApi, buildUrl, ROLE_ENDPOINT } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Role } from '../types/role.type';

export const roleService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listRole: builder.query<SuccessResponse<Role[]>, void>({
      query: () => buildUrl({ path: ROLE_ENDPOINT.LIST }),
    }),
  }),
});

export const { useListRoleQuery } = roleService;
