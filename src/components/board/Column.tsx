import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { clsx } from 'clsx';
import { useState, type ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { ListConst } from '../../constants';
import CreateListForm from '../../forms/list/CreateListForm';
import type { ListCreateForm } from '../../types/list.type';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Dropdown, { DropdownAnchor, DropdownMenuSize } from '../Dropdown';
import { BiRename } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Input from '../Input';
import Button from '../Button';
import { IoClose } from 'react-icons/io5';
import Form from '../../forms';
import TextField from '../form/TextField';
import Modal from '../Modal';

interface IProps {
  id: any;
  index: number;
  children: ReactNode;
  title: string;
  boardId: string;
  listCreateDefaultValues: ListCreateForm;
  onCreateListSubmit: (data: ListCreateForm) => void;
  isOpenCreateListForm: boolean;
  onOpenCreateListForm: () => void;
  onCloseCreateListForm: () => void;
}
const Column = ({
  id,
  index,
  children,
  title,
  boardId,
  listCreateDefaultValues,
  onCreateListSubmit,
  isOpenCreateListForm,
  onOpenCreateListForm,
  onCloseCreateListForm,
}: IProps) => {
  const { ref: dropRef } = useDroppable({
    id,
    type: 'column',
    accept: ['item'],
    collisionPriority: CollisionPriority.Low,
  });

  const { ref: sortRef } = useSortable({
    id,
    index,
    type: 'column',
    accept: ['column'],
  });

  const { ref: itemDropZoneRef } = useDroppable({
    id: `dropzone_${String(id)}`,
    type: 'item-dropzone',
    accept: ['item'],
    collisionPriority: CollisionPriority.High,
  });

  const setRef = (el: any) => {
    dropRef(el);
    sortRef(el);
  };

  const baseColumnClass = 'bg-bg-surface flex shrink-0 flex-col gap-2 rounded-lg p-3';
  const baseDefaultColumnClass =
    'bg-bg-surface flex h-fit min-h-12 w-[280px] shrink-0 items-center gap-2 rounded-lg p-3 transition-all duration-150 ease-in';

  if (id == ListConst.DEFAULT_ID) {
    if (!isOpenCreateListForm)
      return (
        <div
          onClick={onOpenCreateListForm}
          className={clsx(
            baseDefaultColumnClass,
            'cursor-pointer text-text-secondary hover:bg-bg-card hover:text-white',
          )}
        >
          <FaPlus />
          <div className="font-semibold text-sm">{title}</div>
        </div>
      );

    return (
      <div className={clsx(baseDefaultColumnClass, 'w-[280px]')}>
        <div className="w-full relative">
          <CreateListForm
            boardId={boardId}
            defaultValues={listCreateDefaultValues}
            onSubmit={onCreateListSubmit}
            onCloseCreateList={onCloseCreateListForm}
          />
        </div>
      </div>
    );
  }

  // -- Handle Edit List --
  const [isOnRename, setOnRename] = useState(false);
  const [isOnDelete, setOnDelete] = useState(false);

  return (
    <div ref={setRef} className={clsx(baseColumnClass, 'h-fit min-h-0 w-[280px]')}>
      <div className="font-semibold w-full gap-4 text-base mb-2 flex items-center justify-between">
        <div className="w-full">
          {isOnRename ? (
            <div className="relative w-full">
              <Form defaultValues={{ rename: title }} onSubmit={() => { }}>
                <TextField name="rename" containerClassName="mb-0! w-full" />
                <div className="absolute top-1/2 -translate-y-1/2 right-1">
                  <Button
                    type="button"
                    variant="text"
                    className="text-text-muted! hover:text-white! hover:bg-white/5 p-1! rounded-full"
                    onClick={() => setOnRename(false)}
                  >
                    <IoClose />
                  </Button>
                </div>
              </Form>
            </div>
          ) : (
            <span>{title}</span>
          )}
        </div>
        <Dropdown>
          <Dropdown.Button className="p-1 rounded-full hover:bg-white/25 cursor-pointer transition-all duration-100 ease-in">
            <BsThreeDotsVertical className="text-text-secondary hover:text-white " />
          </Dropdown.Button>
          <Dropdown.Items anchor={DropdownAnchor.BOTTOM_START} size={DropdownMenuSize.SM}>
            <Dropdown.Item onClick={() => setOnRename(true)}>
              <BiRename />
              <p>Rename</p>
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
      {/* ~4 cards visible, then scroll */}
      <div ref={itemDropZoneRef} className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-104">
        {children}
      </div>
      <Modal open={isOnDelete} onClose={() => setOnDelete(false)}>
        <Modal.Header>Delete list {title}?</Modal.Header>
        <Modal.Body>
          <Form defaultValues={{}} onSubmit={() => { }}>
            <p className="text-white/80 mb-1">
              Are you sure you want to delete list {title}? This action cannot be undone.
            </p>
            <p className="text-white/80 mb-2">
              Please enter <strong className="text-red-500">{title}</strong> to confirm:
            </p>
            <TextField name="delete" />
            <div className="flex items-center float-right gap-2">
              <Button type="submit" variant="contained" color="danger">
                Delete
              </Button>
              <Button
                type="button"
                className="text-text-secondary"
                variant="text"
                onClick={() => setOnDelete(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Column;
