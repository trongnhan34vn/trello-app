import { useEffect, useRef, useState } from 'react';
import type { Card } from '../../types/card.type';
import type { List } from '../../types/list.type';
import {
  DEFAULT_CARD,
  filterRealCards,
  filterRealLists,
  getDefaultCardId,
  sortCardsByPosition,
  sortListsByPosition,
} from './board.utils';

export const useKanbanState = (propLists: List[], propCards: Card[]) => {
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const cardsRef = useRef<Card[]>([]);

  useEffect(() => {
    const hydratedLists = sortListsByPosition(filterRealLists(propLists));
    setLists(hydratedLists);
    setColumnOrder(hydratedLists.map((list) => list.id));
  }, [propLists]);

  useEffect(() => {
    const nextCards = sortCardsByPosition(filterRealCards(propCards));
    cardsRef.current = nextCards;
    setCards(nextCards);
  }, [propCards]);

  const setCardsWithRef = (updater: Card[] | ((prev: Card[]) => Card[])) => {
    setCards((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      cardsRef.current = next;
      return next;
    });
  };

  const getCardsByList = (listId: string): Card[] => [
    ...sortCardsByPosition(cards.filter((card) => card.listId === listId)),
    { ...DEFAULT_CARD, id: getDefaultCardId(listId) },
  ];

  return {
    lists,
    setLists,
    cards,
    setCards: setCardsWithRef,
    cardsRef,
    columnOrder,
    setColumnOrder,
    getCardsByList,
  };
};
