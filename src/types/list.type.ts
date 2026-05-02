import type { Card } from "./card.type";

export type List = {
    id: string;
    name: string;
    boardId?: string;
    position?: string | null;
    cards?: Card[];
}

export type ListCreateForm = Pick<List, 'name' | 'boardId' | 'position'>

export type DragUpdateList = Pick<List, 'id' | 'position'>;