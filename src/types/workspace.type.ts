import type { Board } from './board.type';
import type { WorkspaceCategory } from './workspace.category.type';
import type { WorkspaceMember } from './workspace.member.type';

export type Workspace = {
  id: string;
  name: string;
  category: WorkspaceCategory | null;
  boards?: Board[] | null;
  members?: WorkspaceMember[] | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceCreateForm = {
  name: string;
  category: { label: string; value: number } | null;
  description: string;
};
