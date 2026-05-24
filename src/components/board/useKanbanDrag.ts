import { useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import { ListConst } from '../../constants';
import type { Card } from '../../types/card.type';
import type { List } from '../../types/list.type';
import type { DndEntity, KanbanBoardProps, LastCardDrop } from './board.types';
import {
  buildLastCardDropFromCard,
  computeInsertIndex,
  filterRealLists,
  generatePositionBetween,
  insertCardIntoList,
  isDefaultCardId,
  resolveDropTarget,
  sortCardsByPosition,
  sortListsByPosition,
} from './board.utils';

interface UseKanbanDragParams {
  propLists: List[];
  cardsRef: MutableRefObject<Card[]>;
  columnOrder: string[];
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
  setCards: (updater: Card[] | ((prev: Card[]) => Card[])) => void;
  onDragCard: KanbanBoardProps['onDragCard'];
  onDragList: KanbanBoardProps['onDragList'];
}

export const useKanbanDrag = ({
  propLists,
  cardsRef,
  columnOrder,
  setColumnOrder,
  setCards,
  onDragCard,
  onDragList,
}: UseKanbanDragParams) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastCardDragRef = useRef<LastCardDrop | null>(null);

  const handleColumnDragOver = (draggedId: string, targetId: string) => {
    if (targetId === ListConst.DEFAULT_ID || draggedId === targetId) return;

    const oldIndex = columnOrder.indexOf(draggedId);
    const newIndex = columnOrder.indexOf(targetId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const newOrder = [...columnOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, draggedId);
    setColumnOrder(newOrder);
  };

  const handleCardDragOver = (draggedId: string, target: DndEntity | undefined) => {
    const current = [...cardsRef.current];
    const draggedIndex = current.findIndex((card) => card.id === draggedId);
    if (draggedIndex === -1) return;

    const draggedCard = current[draggedIndex];
    const resolved = resolveDropTarget(target, current, draggedId);
    if (!resolved) return;

    const { targetListId, targetIndex } = resolved;
    current.splice(draggedIndex, 1);

    const targetCards = sortCardsByPosition(
      current.filter((card) => card.listId === targetListId),
    );

    const insertIndex = computeInsertIndex(targetIndex, targetCards.length);

    if (draggedCard.listId === targetListId) {
      const oldIndex = sortCardsByPosition(
        cardsRef.current.filter((card) => card.listId === targetListId),
      ).findIndex((card) => card.id === draggedId);

      if (oldIndex === insertIndex) return;
    }

    const position = generatePositionBetween(
      targetCards[insertIndex - 1]?.position,
      targetCards[insertIndex]?.position,
    );

    const movedCard: Card = { ...draggedCard, listId: targetListId, position };
    insertCardIntoList(current, movedCard, targetListId, insertIndex);

    cardsRef.current = current;
    setCards(current);

    lastCardDragRef.current = { draggedId, targetListId, insertIndex, position };
  };

  const handleDragOver = (event: { operation?: { source?: DndEntity; target?: DndEntity } }) => {
    const { source, target } = event.operation ?? {};
    if (!source || !target) return;

    if (source.type === 'column') {
      const draggedId = String(source.id);
      if (draggedId === ListConst.DEFAULT_ID) return;
      handleColumnDragOver(draggedId, String(target.id));
      return;
    }

    if (source.type !== 'item') return;

    const draggedId = String(source.id);
    if (isDefaultCardId(draggedId)) return;

    handleCardDragOver(draggedId, target);
  };

  const handleColumnDragEnd = (draggedId: string) => {
    const movedIdx = columnOrder.indexOf(draggedId);
    if (movedIdx === -1) return;

    const listMap = new Map(
      sortListsByPosition(filterRealLists(propLists)).map((list) => [list.id, list]),
    );

    const beforePos = listMap.get(columnOrder[movedIdx - 1])?.position ?? null;
    const afterPos = listMap.get(columnOrder[movedIdx + 1])?.position ?? null;
    const newPosition = generatePositionBetween(beforePos, afterPos);

    onDragList({ id: draggedId, position: newPosition });
  };

  const handleCardDragEnd = (draggedId: string) => {
    const lastDrop = lastCardDragRef.current;
    if (!lastDrop || lastDrop.draggedId !== draggedId) return;

    onDragCard({
      id: draggedId,
      listId: lastDrop.targetListId,
      position: lastDrop.position,
    });
  };

  const handleDragEnd = (event: { operation?: { source?: DndEntity; target?: DndEntity } }) => {
    const { source, target } = event.operation ?? {};
    if (!source || !target) return;

    if (source.type === 'column') {
      const draggedId = String(source.id);
      if (draggedId === ListConst.DEFAULT_ID) return;
      handleColumnDragEnd(draggedId);
      return;
    }

    if (source.type === 'item') {
      const draggedId = String(source.id);
      if (isDefaultCardId(draggedId)) return;
      handleCardDragEnd(draggedId);
    }
  };

  const handleDragStart = (event: { operation?: { source?: DndEntity } }) => {
    const source = event.operation?.source;
    const draggedId = source?.id != null ? String(source.id) : undefined;

    setActiveId(draggedId ?? null);
    lastCardDragRef.current = null;

    if (source?.type !== 'item' || !draggedId || isDefaultCardId(draggedId)) return;

    const card = cardsRef.current.find((c) => c.id === draggedId);
    if (!card) return;

    lastCardDragRef.current = buildLastCardDropFromCard(cardsRef.current, card);
  };

  const handleDragEndCleanup = (event: { operation?: { source?: DndEntity; target?: DndEntity } }) => {
    handleDragEnd(event);
    lastCardDragRef.current = null;
    setActiveId(null);
  };

  return {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEndCleanup,
  };
};
