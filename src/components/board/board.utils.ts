import { generateKeyBetween } from 'fractional-indexing';
import { CardConst, ListConst } from '../../constants';
import type { Card } from '../../types/card.type';
import type { List } from '../../types/list.type';
import type { DndEntity, LastCardDrop, ResolvedDropTarget } from './board.types';

export const DEFAULT_LIST = {
  id: ListConst.DEFAULT_ID,
  name: 'Create new list',
} as const;

export const DEFAULT_CARD = {
  id: CardConst.DEFAULT_ID,
  title: 'Create new card',
} as const;

export const getDefaultCardId = (listId: string) => `${CardConst.DEFAULT_ID}_${listId}`;

export const isDefaultCardId = (cardId: string) =>
  cardId.startsWith(`${CardConst.DEFAULT_ID}_`);

export const filterRealLists = (lists: List[]) =>
  lists.filter((list) => list.id !== ListConst.DEFAULT_ID);

export const filterRealCards = (cards: Card[]) =>
  cards.filter((card) => !isDefaultCardId(card.id));

export const getRenderColumnOrder = (order: string[]) => [...order, ListConst.DEFAULT_ID];

export const compareByPosition = (a: Card | List, b: Card | List) => {
  const pa = a.position ?? '';
  const pb = b.position ?? '';
  return pa < pb ? -1 : pa > pb ? 1 : 0;
};

export const sortCardsByPosition = (cards: Card[]) => [...cards].sort(compareByPosition);

export const sortListsByPosition = (lists: List[]) => [...lists].sort(compareByPosition);

export const getCardsInList = (cards: Card[], listId: string) =>
  sortCardsByPosition(cards.filter((card) => card.listId === listId));

export const resolveDropTarget = (
  target: DndEntity | undefined,
  current: Card[],
  draggedId?: string,
): ResolvedDropTarget | null => {
  if (!target) return null;
  if (draggedId && target.id === draggedId) return null;

  if (target.type === 'item-dropzone') {
    const listId = String(target.id).replace('dropzone_', '');
    if (!listId || listId === ListConst.DEFAULT_ID) return null;
    return { targetListId: listId, targetIndex: null };
  }

  if (target.type === 'item') {
    const targetId = String(target.id);

    if (isDefaultCardId(targetId)) {
      const listId = targetId.replace(`${CardConst.DEFAULT_ID}_`, '');
      return { targetListId: listId, targetIndex: null };
    }

    const targetCard = current.find((card) => card.id === targetId);
    if (!targetCard?.listId) return null;

    const targetCards = getCardsInList(current, targetCard.listId);
    const index = targetCards.findIndex((card) => card.id === targetId);

    return {
      targetListId: targetCard.listId,
      targetIndex: index >= 0 ? index : null,
    };
  }

  if (target.type === 'column') {
    const listId = String(target.id);
    if (listId === ListConst.DEFAULT_ID) return null;
    return { targetListId: listId, targetIndex: null };
  }

  return null;
};

export const computeInsertIndex = (
  targetIndex: number | null,
  targetCardsLength: number,
) => {
  const raw = targetIndex !== null ? targetIndex : targetCardsLength;
  return Math.max(0, Math.min(raw, targetCardsLength));
};

export const insertCardIntoList = (
  cards: Card[],
  movedCard: Card,
  targetListId: string,
  insertIndex: number,
) => {
  const globalInsertIndex = cards.findIndex((_, idx) => {
    const listCardsBefore = cards.slice(0, idx).filter((card) => card.listId === targetListId);
    return listCardsBefore.length === insertIndex;
  });

  if (globalInsertIndex === -1) {
    cards.push(movedCard);
  } else {
    cards.splice(globalInsertIndex, 0, movedCard);
  }
};

export const generatePositionBetween = (
  before: string | null | undefined,
  after: string | null | undefined,
) => {
  try {
    return generateKeyBetween(before ?? null, after ?? null);
  } catch {
    return generateKeyBetween(null, null);
  }
};

export const buildLastCardDropFromCard = (cards: Card[], card: Card): LastCardDrop | null => {
  if (!card.listId) return null;

  const listCards = getCardsInList(cards, card.listId);
  const insertIndex = listCards.findIndex((c) => c.id === card.id);

  return {
    draggedId: card.id,
    targetListId: card.listId,
    insertIndex: insertIndex >= 0 ? insertIndex : listCards.length,
    position: card.position ?? generateKeyBetween(null, null),
  };
};
