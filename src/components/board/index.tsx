import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { ListConst } from '../../constants';
import Column from './Column';
import { Item } from './Item';
import KanbanDragOverlay from './KanbanDragOverlay';
import type { KanbanBoardProps } from './board.types';
import { DEFAULT_LIST, getRenderColumnOrder } from './board.utils';
import { useKanbanCreateForms } from './useKanbanCreateForms';
import { useKanbanDrag } from './useKanbanDrag';
import { useKanbanState } from './useKanbanState';

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
}: KanbanBoardProps) => {
  const {
    lists,
    setLists,
    cards,
    setCards,
    cardsRef,
    columnOrder,
    setColumnOrder,
    getCardsByList,
  } = useKanbanState(propLists, propCards);

  const {
    isOpenCreateListForm,
    setOpenCreateListForm,
    isOpenCreateCardForm,
    listCreateDefaultValues,
    cardCreateFormDefaultValues,
    handleCreateListSubmit,
    handleOpenCreateCardForm,
    handleCloseCreateCardForm,
    handleSubmitCreateCard,
  } = useKanbanCreateForms({
    boardId,
    lists,
    cards,
    onCreateList,
    onCreateCard,
    setLists,
    setCards,
    setColumnOrder,
  });

  const { activeId, handleDragStart, handleDragOver, handleDragEndCleanup } = useKanbanDrag({
    propLists,
    cardsRef,
    columnOrder,
    setColumnOrder,
    setCards,
    onDragCard,
    onDragList,
  });

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEndCleanup}
    >
      <div className="inline-flex h-full w-max min-w-0 max-w-none flex-nowrap items-stretch gap-4 p-2">
        {getRenderColumnOrder(columnOrder).map((columnId, columnIndex) => {
          const list =
            columnId === ListConst.DEFAULT_ID ? DEFAULT_LIST : lists.find((l) => l.id === columnId);

          return (
            <Column
              key={columnId}
              id={columnId}
              index={columnIndex}
              boardId={boardId}
              title={list?.name ?? ''}
              isOpenCreateListForm={isOpenCreateListForm}
              listCreateDefaultValues={listCreateDefaultValues}
              onOpenCreateListForm={() => setOpenCreateListForm(true)}
              onCloseCreateListForm={() => setOpenCreateListForm(false)}
              onCreateListSubmit={handleCreateListSubmit}
              onDeleteList={onDeleteList}
              onRenameList={onRenameList}
            >
              {columnId !== ListConst.DEFAULT_ID &&
                getCardsByList(list?.id ?? '').map((card, cardIndex) => (
                  <Item
                    key={card.id}
                    id={card.id}
                    index={cardIndex}
                    column={columnId}
                    listId={list?.id ?? ''}
                    title={card.title}
                    isOpenCreateCardForm={isOpenCreateCardForm}
                    onOpenCreateCardForm={handleOpenCreateCardForm}
                    onCloseCreateCardForm={handleCloseCreateCardForm}
                    cardCreateFormDefaultValues={cardCreateFormDefaultValues}
                    onSubmitCreateCard={handleSubmitCreateCard}
                    onDeleteCard={onDeleteCard}
                  />
                ))}
            </Column>
          );
        })}
      </div>

      <DragOverlay>
        <KanbanDragOverlay activeId={activeId} cards={cards} lists={lists} />
      </DragOverlay>
    </DragDropProvider>
  );
};

export default KanbanBoard;
