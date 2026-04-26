import type { Card } from "./card.type";

export type List = {
    id: string;
    name: string;
    boardId?: string;
    position?: number;
    cards?: Card[];
}

export type ListCreateForm = Pick<List, 'name' | 'boardId' | 'position'>