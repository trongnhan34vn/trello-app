import { useSortable } from '@dnd-kit/react/sortable';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { IoOpenOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import 'react-quill/dist/quill.snow.css';
import { CardConst } from '../../constants';
import CreateCardForm from '../../forms/card/CreateCardForm';
import DeleteCardModal from '../../modals/card/DeleteCardModal';
import DetailCardModal from '../../modals/card/DetailCardModal';
import type { CardCreateForm } from '../../types/card.type';
import Dropdown, { DropdownAnchor, DropdownMenuSize } from '../Dropdown';

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
        className="bg-bg-tertiary cursor-pointer flex items-center gap-2 text-text-secondary hover:text-white hover:border-primary transition-all duration-150 ease-in border-2 border-transparent drop-shadow-2xl rounded-md px-3.5 py-2 active:cursor-grabbing select-none"
      >
        <FaPlus />
        {title}
      </div>
    );
  }

  // ~~~ Handle Edit Item ~~~
  const [isOnDelete, setOnDelete] = useState(false);
  const [isOnDetail, setOnDetail] = useState(false);
  
  return (
    <>
      <div
        onClick={() => setOnDetail(true)}
        ref={ref}
        className="bg-bg-tertiary flex items-center hover:border-primary transition-all duration-150 ease-in border-2 border-transparent drop-shadow-2xl rounded-md px-3.5 py-2 cursor-grab active:cursor-grabbing select-none"
        data-dragging={isDragging}
      >
        <div className="w-full">
          <span>{title}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Button className="p-1 rounded-full hover:bg-white/25 cursor-pointer transition-all duration-100 ease-in">
              <BsThreeDotsVertical className="text-text-secondary hover:text-white " />
            </Dropdown.Button>
            <Dropdown.Items anchor={DropdownAnchor.BOTTOM_START} size={DropdownMenuSize.SM}>
              <Dropdown.Item onClick={() => setOnDetail(true)}>
                <IoOpenOutline />
                <p>Open Card</p>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setOnDelete(true)}
                className="text-red-400! hover:text-red-500!"
              >
                <MdDelete />
                <p>Delete</p>
              </Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
        </div>
      </div>

      {/* ~~~ Modal Delete Item ~~~ */}
      <DeleteCardModal open={isOnDelete} close={() => setOnDelete(false)} id={id} title={title} />

      {/* ~~~ Modal Detail Item ~~~ */}
      <DetailCardModal open={isOnDetail} id={id} title={title} close={() => setOnDetail(false)} />
    </>
  );
}

export default Item;
