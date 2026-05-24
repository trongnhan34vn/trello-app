import type { Card, CardCreateForm, DragUpdateCard } from '../../types/card.type';
import type { DragUpdateList, List, ListCreateForm } from '../../types/list.type';

export interface KanbanBoardProps {
  items: Card[];
  columns: List[];
  boardId: string;
  onCreateList: (payload: ListCreateForm) => Promise<List | null>;
  onCreateCard: (payload: CardCreateForm) => Promise<Card | null>;
  onDragCard: (payload: DragUpdateCard) => void;
  onDragList: (payload: DragUpdateList) => void;
  onDeleteList: (payload: unknown) => void;
  onDeleteCard: (payload: unknown) => void;
  onRenameList: (payload: unknown) => Promise<boolean>;
}

export interface CreateCardFormState {
  state: boolean;
  listId: string;
}

export interface LastCardDrop {
  draggedId: string;
  targetListId: string;
  insertIndex: number;
  position: string;
}

export interface ResolvedDropTarget {
  targetListId: string;
  targetIndex: number | null;
}

export interface DndEntity {
  id: unknown;
  type?: unknown;
}
