import type { ChecklistItem } from "./checklist.item.type";

export type Checklist = {
  id: string;
  name: string;
  cardId: string;
  position: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  checklistItems: ChecklistItem[]
}

export type ChecklistCreatePayload = {
  name: string;
  cardId: string;
  position: string;
}