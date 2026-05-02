export type Card = {
    id: string;
    title: string;
    listId?: string;
    dueDate?: string;
    startDate?: string;
    description?: string;
    position?: string | null;
    completed?: boolean
}

export type CardCreateForm = Pick<Card, 'title' | 'listId' | 'position'>

export type DragUpdateCard = Pick<Card, 'id' | 'listId' | 'position'>

