import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useRef, useState } from 'react';
import { CardConst, ListConst } from '../../constants';
import type { Card, CardCreateForm, DragUpdateCard } from '../../types/card.type';
import type { List, ListCreateForm } from '../../types/list.type';
import Column from './Column';
import { Item } from './Item';

interface IProps {
  items: Card[];
  columns: List[];
  boardId: string;
  onCreateList: (payload: ListCreateForm) => Promise<List | null>;
  onCreateCard: (payload: CardCreateForm) => Promise<Card | null>;
  onDragCard: (payload: DragUpdateCard) => void;
}

const KanbanBoard = ({
  items: propCards = [],
  columns: propLists = [],
  boardId,
  onCreateList,
  onCreateCard,
  onDragCard,
}: IProps) => {
  const defaultList = {
    id: ListConst.DEFAULT_ID,
    name: 'Create new list',
  };

  const defaultCard = {
    id: ListConst.DEFAULT_ID,
    title: 'Create new card',
  };

  const getDefaultCardId = (listId: string) => `${CardConst.DEFAULT_ID}_${listId}`;
  const isDefaultCardId = (cardId: string) => cardId.startsWith(`${CardConst.DEFAULT_ID}_`);
  const getListIdFromDropZone = (targetId: string) =>
    targetId.startsWith('dropzone_') ? targetId.replace('dropzone_', '') : undefined;

  const REAL_LISTS = (lists: List[]) => lists.filter((l) => l.id !== ListConst.DEFAULT_ID);
  const REAL_CARDS = (cards: Card[]) => cards.filter((c) => !isDefaultCardId(c.id));
  const getRenderColumnOrder = (order: string[]) => [...order, ListConst.DEFAULT_ID];

  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const cardsRef = useRef<Card[]>([]);

  useEffect(() => {
    const hydratedLists = REAL_LISTS(propLists).map((list) => ({
      ...list,
    }));
    setLists(hydratedLists);
    setColumnOrder(hydratedLists.map((l) => l.id));
  }, [propLists]);

  useEffect(() => {
    const nextCards = REAL_CARDS(propCards);
    cardsRef.current = nextCards;
    setCards(nextCards);
  }, [propCards]);

  const previousLists = useRef(lists);

  const getCardsByList = (listId: string) => {
    return [
      ...cards.filter((c) => c.listId === listId),
      { ...defaultCard, id: getDefaultCardId(listId) },
    ];
  };

  // Create List
  const [isOpenCreateListForm, setOpenCreateListForm] = useState(false);
  const listCreateDefaultValues: ListCreateForm = {
    name: '',
    boardId,
    position: 0,
  };

  const handleCreateListSubmit = async (data: ListCreateForm) => {
    const refList = REAL_LISTS(lists);
    const lastPosition = (refList?.[refList?.length - 1]?.position as number | undefined) ?? 0;

    const newList = await onCreateList({ ...data, position: lastPosition + 1 });
    if (!newList) return;

    setLists((prev) => [...REAL_LISTS(prev), newList]);
    setColumnOrder((prev) => [...prev, newList.id]);
    setOpenCreateListForm(false);
  };

  // create Card
  const [isOpenCreateCardForm, setOpenCreateCardForm] = useState({
    state: false,
    listId: '',
  });

  const handleOpenCreateCardForm = (listId: string) => {
    setOpenCreateCardForm({
      listId,
      state: true,
    });
  };

  const handleCloseCreateCardForm = (listId: string) => {
    setOpenCreateCardForm({
      listId,
      state: false,
    });
  };

  const cardCreateFormDefaultValues: CardCreateForm = {
    title: '',
    listId: '',
    position: 0,
  };

  const handleSubmitCreateCard = async (data: CardCreateForm) => {
    const refCards = cards.filter((c) => c.listId === data.listId);
    const lastPosition = (refCards?.[refCards?.length - 1]?.position as number | undefined) ?? 0;

    const newCard = await onCreateCard({
      ...data,
      position: refCards.length === 0 ? 1 : lastPosition + 1,
    });
    if (!newCard) return;

    setCards((prev) => {
      const next = [...prev, newCard];
      cardsRef.current = next;
      return next;
    });
    setOpenCreateCardForm((prev) => ({ ...prev, state: false }));
  };

  return (
    <DragDropProvider
      onDragStart={() => {
        previousLists.current = lists;
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;
        if (!source || !target) return;
        if (source.type !== 'item') return;
        if (isDefaultCardId(String(source.id))) return;

        setCards((prev) => {
          const next = move(prev, event);

          const targetId = String(target.id);
          const targetListId =
            lists.find((l) => l.id === targetId)?.id ||
            prev.find((c) => c.id === targetId)?.listId ||
            getListIdFromDropZone(targetId) ||
            (isDefaultCardId(targetId)
              ? targetId.replace(`${CardConst.DEFAULT_ID}_`, '')
              : undefined);

          if (!targetListId) return prev;

          const nextCards = next.map((c) =>
            c.id === source.id ? { ...c, listId: targetListId } : c
          );
          cardsRef.current = nextCards;
          return nextCards;
        });
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;
        if (!source) return;
        if (event.canceled) {
          if (source.type === 'item') {
            setLists(previousLists.current);
          }
          return;
        }

        if (source.type === 'item') {
          const draggedCardId = String(source.id);
          const finalCards = cardsRef.current;
          const draggedCard = finalCards.find((card) => card.id === draggedCardId);
          if (!draggedCard?.listId) return;

          const cardsInTargetList = finalCards.filter((card) => card.listId === draggedCard.listId);
          const newIndex = cardsInTargetList.findIndex((card) => card.id === draggedCardId);
          if (newIndex < 0) return;

          onDragCard({
            id: draggedCardId,
            listId: draggedCard.listId,
            position: newIndex + 1,
          });
        }

        if (source.type === 'column') {
          if (
            String(source.id) === ListConst.DEFAULT_ID ||
            String(event.operation.target?.id) === ListConst.DEFAULT_ID
          ) {
            return;
          }
          setColumnOrder((columns) => move(columns, event));
        }
      }}
    >
      <div className="inline-flex h-full w-max min-w-0 max-w-none flex-nowrap items-stretch gap-4 p-2">
        {getRenderColumnOrder(columnOrder).map((column, columnIndex) => {
          const list =
            column === ListConst.DEFAULT_ID ? defaultList : lists.find((l) => l.id == column);
          return (
            <Column
              boardId={boardId || ''}
              isOpenCreateListForm={isOpenCreateListForm}
              onCloseCreateListForm={() => setOpenCreateListForm(false)}
              onOpenCreateListForm={() => setOpenCreateListForm(true)}
              listCreateDefaultValues={listCreateDefaultValues}
              onCreateListSubmit={handleCreateListSubmit}
              title={list?.name || ''}
              key={column}
              id={column}
              itemDropZoneId={column === ListConst.DEFAULT_ID ? '' : `dropzone_${column}`}
              index={columnIndex}
            >
              {column !== ListConst.DEFAULT_ID &&
                getCardsByList(list?.id ?? '').map((card, cardIndex) => (
                  <Item
                    title={card.title}
                    key={card.id}
                    listId={list?.id ?? ''}
                    id={card.id}
                    index={cardIndex}
                    column={column}
                    isOpenCreateCardForm={isOpenCreateCardForm}
                    onCloseCreateCardForm={handleCloseCreateCardForm}
                    onOpenCreateCardForm={handleOpenCreateCardForm}
                    cardCreateFormDefaultValues={cardCreateFormDefaultValues}
                    onSubmitCreateCard={handleSubmitCreateCard}
                  />
                ))}
            </Column>
          );
        })}
      </div>
    </DragDropProvider>
  );
};

export default KanbanBoard;
