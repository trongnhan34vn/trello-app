import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { ListConst } from '../../constants';
import CreateListForm from '../../forms/list/CreateListForm';
import type { ListCreateForm } from '../../types/list.type';

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
  // handle dnd
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

  // state form
  const baseColumnClass = 'bg-bg-surface flex shrink-0 flex-col gap-2 rounded-lg p-3';
  const baseDefaultColumnClass =
    'bg-bg-surface flex h-fit min-h-12 w-[280px] shrink-0 items-center gap-2 rounded-lg p-3 transition-all duration-150 ease-in';

  if (id == ListConst.DEFAULT_ID) {
    if (!isOpenCreateListForm)
      return (
        <div
          // ref={setRef}
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
      <div className={baseDefaultColumnClass}>
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

  return (
    <div
      ref={setRef}
      className={clsx(baseColumnClass, 'h-fit min-h-0 w-[280px]')}
    >
      <div className="font-semibold text-base mb-2">{title}</div>
      {/* ~4 cards visible, then scroll */}
      <div
        ref={itemDropZoneRef}
        className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-104"
      >
        {children}
      </div>
    </div>
  );
};

export default Column;
