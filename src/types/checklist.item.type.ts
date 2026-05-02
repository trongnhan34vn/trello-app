export type ChecklistItem = {
  id: string;
  name: string;
  checklistId: string;
  position: string;
  isCompleted: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type ChecklistItemCreatePayload = {
  name: string;
  position: string;
  checklistId: string;
  dueDate: string;
}