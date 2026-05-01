import { Checkbox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/16/solid/CheckIcon';
import dayjs from 'dayjs';
import { FaRegClock } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import type { ChecklistItem } from '../../types/checklist.item.type';
import Button from '../Button';
import { useEffect, useState } from 'react';

interface IProps {
  checklistItem: ChecklistItem;
  onUpdateCompletedStateChecklistItem: (value: any) => void;
}
const ChecklistItemComponent = ({ checklistItem, onUpdateCompletedStateChecklistItem }: IProps) => {
  const isOverdue = new Date(checklistItem?.dueDate) < new Date();

  const [isCompleted, setCompleted] = useState(false);

  useEffect(() => {
    if (!checklistItem) return;
    setCompleted(!!checklistItem?.isCompleted);
  }, [checklistItem]);

  const handleChangeCompleted = (value: boolean) => {
    onUpdateCompletedStateChecklistItem({
      id: checklistItem.id,
      isCompleted: value,
    });
    setCompleted(value);
  };

  return (
    <div className="mt-2 mb-5 flex items-center w-full justify-between">
      <div className="flex gap-3 items-center px-2  ">
        <Checkbox
          checked={isCompleted}
          onChange={handleChangeCompleted}
          className="group size-5 rounded-md bg-bg-card p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
        >
          <CheckIcon className="hidden size-3 fill-black group-data-checked:block" />
        </Checkbox>
        <p className="text-text-secondary">{checklistItem?.name}</p>
      </div>

      <div className="flex gap-3">
        {checklistItem?.dueDate && (
          <div className="text-text-secondary flex items-center gap-2 transition-all duration-150 ease-in hover:text-white px-2 py-1 bg-bg-card w-fit rounded cursor-pointer">
            {dayjs(checklistItem?.dueDate).format('DD/MM/YYYY HH:mm:ss')}
            {isOverdue && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-black text-[10px] font-bold bg-red-500 uppercase tracking-wider">
                Overdue
              </span>
            )}
          </div>
        )}
        <Button
          className="text-text-muted! hover:text-white! px-1!"
          variant="text"
          color="disabled"
        >
          <FaRegClock />
        </Button>
        <Button
          className="text-text-muted! hover:text-red-500! px-1!"
          variant="text"
          color="disabled"
        >
          <MdDelete />
        </Button>
      </div>
    </div>
  );
};

export default ChecklistItemComponent;
