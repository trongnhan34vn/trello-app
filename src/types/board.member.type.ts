import type { Option } from './select.type';

export type BoardMember = {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  roleId: number;
  boardId: string;
  userId: string;
};

export type CreateBoardMemberForm = {
  users: Option[];
  boardId: string;
  roleId: number;
};

export type CreateBoardMemberPayload = {
  userIds: string[];
  boardId: string;
  roleId: number;
};
