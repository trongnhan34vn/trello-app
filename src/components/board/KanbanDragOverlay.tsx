import type { Card } from '../../types/card.type';
import type { List } from '../../types/list.type';

interface KanbanDragOverlayProps {
  activeId: string | null;
  cards: Card[];
  lists: List[];
}

const KanbanDragOverlay = ({ activeId, cards, lists }: KanbanDragOverlayProps) => {
  if (!activeId) return null;

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
};

export default KanbanDragOverlay;
