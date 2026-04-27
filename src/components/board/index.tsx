import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useRef, useState } from 'react';
import { generateKeyBetween } from 'fractional-indexing';
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

  // Sort helper — fractional-index keys sort correctly as plain strings
  const byPosition = (a: Card, b: Card) => {
    const pa = a.position ?? '';
    const pb = b.position ?? '';
    return pa < pb ? -1 : pa > pb ? 1 : 0;
  };

  useEffect(() => {
    const nextCards = REAL_CARDS(propCards).sort(byPosition);
    cardsRef.current = nextCards;
    setCards(nextCards);
  }, [propCards]);

  const getCardsByList = (listId: string) => {
    return [
      ...cards.filter((c) => c.listId === listId).sort(byPosition),
      { ...defaultCard, id: getDefaultCardId(listId) },
    ];
  };

  // ─── Create List ───────────────────────────────────────────────────────────
  const [isOpenCreateListForm, setOpenCreateListForm] = useState(false);
  const listCreateDefaultValues: ListCreateForm = {
    name: '',
    boardId,
    position: '',
  };

  const handleCreateListSubmit = async (data: ListCreateForm) => {
    const refList = REAL_LISTS(lists);
    const lastPosition = (refList?.[refList?.length - 1]?.position) ?? null;

    const newList = await onCreateList({ ...data, position: lastPosition });
    if (!newList) return;

    setLists((prev) => [...REAL_LISTS(prev), newList]);
    setColumnOrder((prev) => [...prev, newList.id]);
    setOpenCreateListForm(false);
  };

  // ─── Create Card ───────────────────────────────────────────────────────────
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
    position: '',
  };

  const handleSubmitCreateCard = async (data: CardCreateForm) => {
    const refCards = cards.filter((c) => c.listId === data.listId);
    const lastPosition = (refCards?.[refCards?.length - 1]?.position) ?? null;

    const newCard = await onCreateCard({
      ...data,
      position: lastPosition,
    });
    if (!newCard) return;

    setCards((prev) => {
      const next = [...prev, newCard];
      cardsRef.current = next;
      return next;
    });
    setOpenCreateCardForm((prev) => ({ ...prev, state: false }));
  };

  // ─── Drag handlers ───────────────────────────────────────────────────────────

  /**
   * Resolve which listId and insert-before card ID to use from a drag target.
   */
  const resolveTarget = (
    target: any,
    current: Card[],
    draggedId?: string,
  ): { targetListId: string; targetIndex: number | null } | null => {
    if (!target) return null;
    if (draggedId && target.id === draggedId) return null;

    // 1. Dropping into the bottom area of a column (High Priority)
    if (target.type === 'item-dropzone') {
      const listId = (target.id as string).replace('dropzone_', '');
      if (!listId || listId === ListConst.DEFAULT_ID) return null;
      return { targetListId: listId, targetIndex: null }; // null means end of list
    }

    // 2. Hovering over a specific Item
    if (target.type === 'item') {
      const targetId = target.id as string;
      if (isDefaultCardId(targetId)) {
        const listId = targetId.replace(`${CardConst.DEFAULT_ID}_`, '');
        return { targetListId: listId, targetIndex: null };
      }

      const targetCard = current.find((c) => c.id === targetId);
      if (!targetCard?.listId) return null;

      // Use the index provided by @dnd-kit if available, otherwise fallback to finding it
      const index = typeof target.index === 'number' ? target.index : null;
      return { targetListId: targetCard.listId, targetIndex: index };
    }

    // 3. Hovering over the Column background (Low Priority)
    if (target.type === 'column') {
      const listId = target.id as string;
      if (listId === ListConst.DEFAULT_ID) return null;
      return { targetListId: listId, targetIndex: null };
    }

    return null;
  };

  /**
   * onDragOver — optimistically move the dragged card so the UI
   * reflects the new position immediately while dragging.
   */
  const handleDragOver = (event: any) => {
    const { source, target } = event.operation ?? {};
    if (!source || !target) return;
    if (source.type !== 'item') return;

    const draggedId = source.id as string;
    if (isDefaultCardId(draggedId)) return; // never move the placeholder

    const current = cardsRef.current;
    const draggedCard = current.find((c) => c.id === draggedId);
    if (!draggedCard) return;

    const resolved = resolveTarget(target, current, draggedId);
    if (!resolved) return;
    const { targetListId, targetIndex } = resolved;

    // Build the new list order for the target column
    const withoutDragged = current.filter((c) => c.id !== draggedId);
    const targetListCards = withoutDragged
      .filter((c) => c.listId === targetListId && !isDefaultCardId(c.id))
      .sort(byPosition);

    const insertIdx = targetIndex !== null ? Math.max(0, targetIndex) : targetListCards.length;

    const movedCard: Card = { ...draggedCard, listId: targetListId };
    const newTargetCards = [
      ...targetListCards.slice(0, insertIdx),
      movedCard,
      ...targetListCards.slice(insertIdx),
    ];

    const updatedCards = [
      ...withoutDragged.filter((c) => c.listId !== targetListId || isDefaultCardId(c.id)),
      ...newTargetCards,
    ];

    cardsRef.current = updatedCards;
    setCards(updatedCards);
  };

  /**
   * onDragEnd — position is computed using:
   *   1. The FINAL drop target from the event (not accumulated optimistic state).
   *   2. propCards — server-synced positions, always reliable.
   * This is intentionally decoupled from cardsRef/optimistic state.
   */
  const handleDragEnd = (event: any) => {
    const { source, target } = event.operation ?? {};
    if (!source || !target) return;

    if (source.type === 'column') return;
    if (source.type !== 'item') return;

    const draggedId = source.id as string;
    if (isDefaultCardId(draggedId)) return;

    const serverCards = REAL_CARDS(propCards);
    const optimisticCards = cardsRef.current;

    // ── Resolve final position ────────────────────────────────────────────────
    let targetListId: string;
    let finalIndex: number | null = null;

    const resolved = resolveTarget(target, serverCards, draggedId);

    if (resolved) {
      targetListId = resolved.targetListId;
      finalIndex = resolved.targetIndex;
    } else {
      const movedCard = optimisticCards.find((c) => c.id === draggedId);
      if (!movedCard?.listId) return;
      targetListId = movedCard.listId;
      finalIndex = optimisticCards
        .filter((c) => c.listId === targetListId && !isDefaultCardId(c.id))
        .findIndex((c) => c.id === draggedId);
    }

    const dbTargetCards = serverCards
      .filter((c) => c.listId === targetListId && c.id !== draggedId)
      .sort(byPosition);

    const insertIdx = finalIndex !== null ? Math.max(0, finalIndex) : dbTargetCards.length;

    const before = dbTargetCards[insertIdx - 1]?.position ?? null;
    const after = dbTargetCards[insertIdx]?.position ?? null;

    let newPosition: string;
    let posError: any = null;
    try {
      newPosition = generateKeyBetween(before, after);
    } catch (err) {
      posError = err;
      newPosition = generateKeyBetween(null, null);
    }

    // ── Debug log ─────────────────────────────────────────────────────────────
    console.group('[DragEnd] position debug');
    console.log('draggedId    :', draggedId);
    console.log('targetListId :', targetListId);
    console.log('resolvedVia  :', resolved ? 'eventTarget' : 'optimisticFallback');
    console.log('dbTargetCards:', dbTargetCards.map((c, i) => `[${i}] ${c.id} → "${c.position}"`));
    console.log('before       :', before);
    console.log('after        :', after);
    if (posError) console.warn('generateKeyBetween error (fallback):', posError);
    console.log('newPosition  :', newPosition);
    console.log('payload      :', { id: draggedId, listId: targetListId, position: newPosition });
    console.groupEnd();
    // ─────────────────────────────────────────────────────────────────────────

    TODO: onDragCard({ id: draggedId, listId: targetListId, position: newPosition });
  };

  return (
    <DragDropProvider
      onDragStart={() => { }}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
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
