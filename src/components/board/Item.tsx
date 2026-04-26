import { useSortable } from '@dnd-kit/react/sortable';
import { FaPlus } from 'react-icons/fa6';
import { CardConst } from '../../constants';
import CreateCardForm from '../../forms/card/CreateCardForm';
import type { CardCreateForm } from '../../types/card.type';
interface IProps {
  id: any;
  index: number;
  listId: string;
  column: string;
  title: string;
  isOpenCreateCardForm: any;
  onOpenCreateCardForm: (listId: string) => void;
  onCloseCreateCardForm: (listId: string) => void;
  cardCreateFormDefaultValues: CardCreateForm;
  onSubmitCreateCard: (data: CardCreateForm) => void;
}
export function Item({
  id,
  index,
  column,
  title,
  isOpenCreateCardForm,
  onCloseCreateCardForm,
  onOpenCreateCardForm,
  listId,
  cardCreateFormDefaultValues,
  onSubmitCreateCard,
}: IProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  if (id == `${CardConst.DEFAULT_ID}_${listId}`) {
    if (isOpenCreateCardForm.state && isOpenCreateCardForm.listId == listId)
      return (
        <div className="relative">
          <CreateCardForm
            listId={listId}
            defaultValues={cardCreateFormDefaultValues}
            onSubmit={onSubmitCreateCard}
            onCloseCreateCard={() => onCloseCreateCardForm(listId)}
          />
        </div>
      );
    return (
      <div
        // default card stays fixed at bottom, so do not attach sortable ref
        data-dragging={isDragging}
        onClick={() => onOpenCreateCardForm(listId)}
        className="bg-bg-tertiary cursor-pointer flex items-center gap-2 text-text-secondary hover:text-white hover:border-primary transition-all duration-150 ease-in border-2 border-transparent drop-shadow-2xl rounded-md px-3.5 py-2.5 active:cursor-grabbing select-none"
      >
        <FaPlus />
        {title}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-bg-tertiary hover:border-primary transition-all duration-150 ease-in border-2 border-transparent drop-shadow-2xl rounded-md px-3.5 py-2.5 cursor-grab active:cursor-grabbing select-none"
      data-dragging={isDragging}
    >
      {title}
    </div>
  );
}

export default Item;
