import { generateKeyBetween } from 'fractional-indexing';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Card, CardCreateForm } from '../../types/card.type';
import type { List, ListCreateForm } from '../../types/list.type';
import type { CreateCardFormState, KanbanBoardProps } from './board.types';
import { filterRealLists, getCardsInList } from './board.utils';

type CreateHandlers = Pick<KanbanBoardProps, 'onCreateList' | 'onCreateCard' | 'boardId'>;

interface UseKanbanCreateFormsParams extends CreateHandlers {
  lists: List[];
  cards: Card[];
  setLists: Dispatch<SetStateAction<List[]>>;
  setCards: (updater: Card[] | ((prev: Card[]) => Card[])) => void;
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
}

export const useKanbanCreateForms = ({
  boardId,
  lists,
  cards,
  onCreateList,
  onCreateCard,
  setLists,
  setCards,
  setColumnOrder,
}: UseKanbanCreateFormsParams) => {
  const [isOpenCreateListForm, setOpenCreateListForm] = useState(false);
  const [isOpenCreateCardForm, setOpenCreateCardForm] = useState<CreateCardFormState>({
    state: false,
    listId: '',
  });

  const listCreateDefaultValues: ListCreateForm = {
    name: '',
    boardId,
    position: null,
  };

  const cardCreateFormDefaultValues: CardCreateForm = {
    title: '',
    listId: '',
    position: null,
  };

  const handleCreateListSubmit = async (data: ListCreateForm) => {
    const realLists = filterRealLists(lists);
    const lastPosition = realLists.at(-1)?.position ?? null;
    const position = generateKeyBetween(lastPosition, null);

    const newList = await onCreateList({ ...data, position });
    if (!newList) return;

    setLists((prev) => [...filterRealLists(prev), newList]);
    setColumnOrder((prev) => [...prev, newList.id]);
    setOpenCreateListForm(false);
  };

  const handleOpenCreateCardForm = (listId: string) => {
    setOpenCreateCardForm({ listId, state: true });
  };

  const handleCloseCreateCardForm = (_listId: string) => {
    setOpenCreateCardForm((prev) => ({ ...prev, state: false }));
  };

  const handleSubmitCreateCard = async (data: CardCreateForm) => {
    const listCards = getCardsInList(cards, data.listId as string);
    const lastPosition = listCards.at(-1)?.position ?? null;
    const position = generateKeyBetween(lastPosition, null);

    const newCard = await onCreateCard({ ...data, position });
    if (!newCard) return;

    setCards((prev) => [...prev, newCard]);
    setOpenCreateCardForm((prev) => ({ ...prev, state: false }));
  };

  return {
    isOpenCreateListForm,
    setOpenCreateListForm,
    isOpenCreateCardForm,
    listCreateDefaultValues,
    cardCreateFormDefaultValues,
    handleCreateListSubmit,
    handleOpenCreateCardForm,
    handleCloseCreateCardForm,
    handleSubmitCreateCard,
  };
};
