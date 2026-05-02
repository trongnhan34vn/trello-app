import { MdChecklist, MdDelete } from 'react-icons/md';
import Button from '../Button';
import { MdModeEdit } from 'react-icons/md';
import { useState } from 'react';
import Form from '../../forms';
import TextField from '../form/TextField';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

interface IProps {
  title: string;
}
const ChecklistHeader = ({ title }: IProps) => {
  const [isOnEditChecklistName, setOnEditChecklistName] = useState(false);
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-5 items-center text-white w-fit justify-between font-bold text-lg mb-2">
        <MdChecklist />
        {isOnEditChecklistName ? (
          <Form defaultValues={{ name: title }} onSubmit={() => {}}>
            <div className="flex gap-2 items-center">
              <TextField containerClassName="!mb-0" name="name" />

              <Button className="px-2!" variant="text">
                <FaCheck />
              </Button>
              <Button
                type='button'
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
          <span>{title}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOnEditChecklistName(true)}
          className="h-8 px-2! gap-0! group"
          variant="text"
        >
          <MdModeEdit className="text-lg" />
          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            Edit
          </span>
        </Button>
        <Button className="h-8 px-2! gap-0! group" variant="text" color="danger">
          <MdDelete className="text-lg" />
          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            Delete
          </span>
        </Button>
      </div>

    </div>
  );
};

export default ChecklistHeader;
