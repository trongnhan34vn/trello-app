import type { Option } from './select.type';

export type WorkspaceMember = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  userId: string;
  workspaceId: string;
  roleId: number;
};

export type CreateWorkspaceMemberForm = {
  userOptions: Option[];
  roleId: number;
  workspaceId: string;
};

export type CreateWorkspaceMemberPayload = {
  userIds: string[];
  roleId: number;
  workspaceId: string;
};
