import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useEffect, useRef, useState } from 'react';
import { generateKeyBetween } from 'fractional-indexing';
import { CardConst, ListConst } from '../../constants';
import type { Card, CardCreateForm, DragUpdateCard } from '../../types/card.type';
import type { DragUpdateList, List, ListCreateForm } from '../../types/list.type';
import Column from './Column';
import { Item } from './Item';

interface IProps {
  items: Card[];
  columns: List[];
  boardId: string;
  onCreateList: (payload: ListCreateForm) => Promise<List | null>;
  onCreateCard: (payload: CardCreateForm) => Promise<Card | null>;
  onDragCard: (payload: DragUpdateCard) => void;
  onDragList: (payload: DragUpdateList) => void;
  onDeleteList: (payload: any) => void;
  onDeleteCard: (payload: any) => void;
  onRenameList: (payload: any) => Promise<boolean>;
}

const KanbanBoard = ({
  items: propCards = [],
  columns: propLists = [],
  boardId,
  onCreateList,
  onCreateCard,
  onDragCard,
  onDragList,
  onDeleteCard,
  onDeleteList,
  onRenameList,
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

  // Sort helper — fractional-index keys sort correctly as plain strings
  const byPosition = (a: Card | List, b: Card | List) => {
    const pa = a.position ?? '';
    const pb = b.position ?? '';
    return pa < pb ? -1 : pa > pb ? 1 : 0;
  };

  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const cardsRef = useRef<Card[]>([]);

  useEffect(() => {
    const hydratedLists = REAL_LISTS(propLists)
      .map((list) => ({
        ...list,
      }))
      .sort(byPosition);
    setLists(hydratedLists);
    setColumnOrder(hydratedLists.map((l) => l.id));
  }, [propLists]);

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
    position: null,
  };

  const handleCreateListSubmit = async (data: ListCreateForm) => {
    const refList = REAL_LISTS(lists);
    const lastPosition = refList?.[refList?.length - 1]?.position ?? null;

    const position = generateKeyBetween(lastPosition, null);

    const newList = await onCreateList({ ...data, position: position });
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
    position: null,
  };

  const handleSubmitCreateCard = async (data: CardCreateForm) => {
    const refCards = cards.filter((c) => c.listId === data.listId);
    const lastPosition = refCards?.[refCards?.length - 1]?.position ?? null;

    const position = generateKeyBetween(lastPosition, null);

    const newCard = await onCreateCard({
      ...data,
      position: position,
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
        return {
          targetListId: listId,
          targetIndex: null,
        };
      }

      const targetCard = current.find((c) => c.id === targetId);

      if (!targetCard?.listId) return null;

      // IMPORTANT:
      // derive index from CURRENT STATE
      const targetCards = current
        .filter((c) => c.listId === targetCard.listId && !isDefaultCardId(c.id))
        .sort(byPosition);

      const index = targetCards.findIndex((c) => c.id === targetId);

      return {
        targetListId: targetCard.listId,
        targetIndex: index >= 0 ? index : null,
      };
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

    // ── Handle Column Drag Over ──────────────────────────────────────────────
    if (source.type === 'column') {
      const draggedId = source.id as string;
      if (draggedId === ListConst.DEFAULT_ID) return;

      const targetId = target.id as string;
      if (targetId === ListConst.DEFAULT_ID || draggedId === targetId) return;

      const oldIndex = columnOrder.indexOf(draggedId);
      const newIndex = columnOrder.indexOf(targetId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrder = [...columnOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, draggedId);
        setColumnOrder(newOrder);
      }
      return;
    }

    // ── Handle Item Drag Over ────────────────────────────────────────────────
    if (source.type !== 'item') return;

    const draggedId = source.id as string;

    if (isDefaultCardId(draggedId)) return;

    const current = [...cardsRef.current];

    const draggedIndex = current.findIndex((c) => c.id === draggedId);

    if (draggedIndex === -1) return;

    const draggedCard = current[draggedIndex];

    const resolved = resolveTarget(target, current, draggedId);

    if (!resolved) return;

    const { targetListId, targetIndex } = resolved;

    // remove dragged card first
    current.splice(draggedIndex, 1);

    // cards of target list AFTER removal
    const targetCards = current.filter((c) => c.listId === targetListId).sort(byPosition);

    // calculate insert position
    let insertIndex = targetIndex !== null ? targetIndex : targetCards.length;

    // normalize insert index
    insertIndex = Math.max(0, Math.min(insertIndex, targetCards.length));

    // anti-loop guard
    const sameList = draggedCard.listId === targetListId;

    if (sameList) {
      const oldIndex = cardsRef.current
        .filter((c) => c.listId === targetListId)
        .sort(byPosition)
        .findIndex((c) => c.id === draggedId);

      const normalizedInsert = oldIndex < insertIndex ? insertIndex - 1 : insertIndex;

      if (oldIndex === normalizedInsert) {
        return;
      }
    }

    // calculate optimistic position
    const before = targetCards[insertIndex - 1]?.position ?? null;

    const after = targetCards[insertIndex]?.position ?? null;

    const movedCard: Card = {
      ...draggedCard,
      listId: targetListId,
      position: generateKeyBetween(before, after),
    };

    // find actual global insert position
    const globalInsertIndex = current.findIndex((_, idx) => {
      const listCardsBefore = current.slice(0, idx).filter((x) => x.listId === targetListId);

      return listCardsBefore.length === insertIndex;
    });

    if (globalInsertIndex === -1) {
      current.push(movedCard);
    } else {
      current.splice(globalInsertIndex, 0, movedCard);
    }

    cardsRef.current = current;
    setCards(current);
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
    // handle column drag
    if (source.type === 'column') {
      const draggedId = source.id as string;
      if (draggedId === ListConst.DEFAULT_ID) return;

      // Current column order from state (optimistically updated in dragOver)
      const currentOrder = columnOrder;
      const movedIdx = currentOrder.indexOf(draggedId);
      if (movedIdx === -1) return;

      // Get real lists (server truth) sorted by position to find neighbours
      const serverLists = REAL_LISTS(propLists).sort(byPosition);
      const listMap = new Map(serverLists.map((l) => [l.id, l]));

      // Get positions of neighbours in the new order
      const beforeId = currentOrder[movedIdx - 1];
      const afterId = currentOrder[movedIdx + 1];

      const beforePos = listMap.get(beforeId)?.position ?? null;
      const afterPos = listMap.get(afterId)?.position ?? null;

      let newPosition: string;
      try {
        newPosition = generateKeyBetween(beforePos, afterPos);
      } catch (err) {
        newPosition = generateKeyBetween(null, null);
      }

      // ── Debug log (Column) ──────────────────────────────────────────────────
      console.group('[DragEnd-Column] position debug');
      console.log('draggedId    :', draggedId);
      console.log('beforePos    :', beforePos);
      console.log('afterPos     :', afterPos);
      console.log('newPosition  :', newPosition);
      console.log('payload      :', { id: draggedId, position: newPosition });
      console.groupEnd();
      // ─────────────────────────────────────────────────────────────────────────

      onDragList({ id: draggedId, position: newPosition });
      return;
    }
    // handle item drag
    if (source.type === 'item') {
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

      // ── Debug log (Card) ─────────────────────────────────────────────────────────────
      console.group('[DragEnd] position debug');
      console.log('draggedId    :', draggedId);
      console.log('targetListId :', targetListId);
      console.log('resolvedVia  :', resolved ? 'eventTarget' : 'optimisticFallback');
      console.log(
        'dbTargetCards:',
        dbTargetCards.map((c, i) => `[${i}] ${c.id} → "${c.position}"`),
      );
      console.log('before       :', before);
      console.log('after        :', after);
      if (posError) console.warn('generateKeyBetween error (fallback):', posError);
      console.log('newPosition  :', newPosition);
      console.log('payload      :', { id: draggedId, listId: targetListId, position: newPosition });
      console.groupEnd();
      // ─────────────────────────────────────────────────────────────────────────

      onDragCard({ id: draggedId, listId: targetListId, position: newPosition });
    }
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DragDropProvider
      onDragStart={(event) => {
        setActiveId(event.operation.source?.id as string);
      }}
      onDragOver={handleDragOver}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveId(null);
      }}
    >
      <div className="inline-flex h-full w-max min-w-0 max-w-none flex-nowrap items-stretch gap-4 p-2">
        {getRenderColumnOrder(columnOrder).map((column, columnIndex) => {
          const list =
            column === ListConst.DEFAULT_ID ? defaultList : lists.find((l) => l.id == column);
          return (
            <Column
              onDeleteList={onDeleteList}
              boardId={boardId || ''}
              isOpenCreateListForm={isOpenCreateListForm}
              onCloseCreateListForm={() => setOpenCreateListForm(false)}
              onOpenCreateListForm={() => setOpenCreateListForm(true)}
              listCreateDefaultValues={listCreateDefaultValues}
              onCreateListSubmit={handleCreateListSubmit}
              title={list?.name || ''}
              onRenameList={onRenameList}
              key={column}
              id={column}
              index={columnIndex}
            >
              {column !== ListConst.DEFAULT_ID &&
                getCardsByList(list?.id ?? '').map((card, cardIndex) => (
                  <Item
                    onDeleteCard={onDeleteCard}
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
      <DragOverlay>
        {activeId
          ? (() => {
            const card = cards.find((c) => c.id === activeId);
            if (card) {
              return (
                <div className="trello-card trello-drag-overlay px-3.5 py-2 text-sm font-medium w-[256px]">
                  {card.title}
                </div>
              );
            }
            const list = lists.find((l) => l.id === activeId);
            if (list) {
              return (
                <div className="trello-column trello-drag-overlay p-3 w-[280px] h-fit">
                  <div className="font-semibold mb-2">{list.name}</div>
                </div>
              );
            }
            return null;
          })()
          : null}
      </DragOverlay>
    </DragDropProvider>
  );
};

export default KanbanBoard;
