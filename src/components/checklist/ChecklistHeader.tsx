import { MdChecklist, MdDelete } from 'react-icons/md';
import Button from '../Button';
import { MdModeEdit } from 'react-icons/md';
import { useState } from 'react';
import Form from '../../forms';
import TextField from '../form/TextField';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import type { Checklist } from '../../types/checklist.type';
import DeleteModal from '../../modals/DeleteModal';

interface IProps {
  checklist: Checklist;
  onUpdateChecklistName: (payload: any) => void;
  onDeleteChecklist: (payload: any) => void;
}
const ChecklistHeader = ({ checklist, onUpdateChecklistName, onDeleteChecklist }: IProps) => {
  if (!checklist) return;
  const [isOnEditChecklistName, setOnEditChecklistName] = useState(false);
  const [isOnDeleteChecklist, setOnDeleteChecklist] = useState(false);

  const handleUpdateChecklistName = (data: any) => {
    const payload = {
      id: checklist.id,
      name: data.name,
    };
    // not thing change
    if (payload.name == checklist.name) {
      return;
    }

    onUpdateChecklistName(payload);
    setOnEditChecklistName(false);
  };

  const handleDeleteChecklist = () => {
    const payload = {
      id: checklist.id
    }

    onDeleteChecklist(payload);
    setOnDeleteChecklist(false);
  }
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-5 items-center text-white w-fit justify-between font-bold text-lg mb-2">
        <MdChecklist />
        {isOnEditChecklistName ? (
          <Form defaultValues={{ name: checklist.name }} onSubmit={handleUpdateChecklistName}>
            <div className="flex gap-2 items-center">
              <TextField containerClassName="!mb-0" name="name" />

              <Button className="px-2!" variant="text">
                <FaCheck />
              </Button>
              <Button
                type="button"
                variant="text"
                className="text-red-500!"
                onClick={() => {
                  setOnEditChecklistName(false);
                }}
              >
                <IoClose />
              </Button>
            </div>
          </Form>
        ) : (
          <span>{checklist.name}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOnEditChecklistName(true)}
          className="h-8 px-2! gap-0! group"
          variant="text"
          type="button"
        >
          <MdModeEdit className="text-lg" />
          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            Edit
          </span>
        </Button>
        <Button
          onClick={() => setOnDeleteChecklist(true)}
          type="button"
          className="h-8 px-2! gap-0! group"
          variant="text"
          color="danger"
        >
          <MdDelete className="text-lg" />
          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            Delete
          </span>
        </Button>
      </div>
      <DeleteModal 
        open={isOnDeleteChecklist}
        close={() => setOnDeleteChecklist(false)}
        title={checklist.name}
        onDelete={handleDeleteChecklist}
        id={checklist.id}
        type={'checklist'}
      />
    </div>
  );
};

export default ChecklistHeader;
