import { MdChecklist, MdDelete } from 'react-icons/md';
import Button from '../Button';

interface IProps {
  title: string;
}
const ChecklistHeader = ({ title }: IProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="flex gap-5 items-center text-white w-fit justify-between font-bold text-lg mb-2">
        <MdChecklist />
        <span>{title}</span>
      </p>
      <Button className="h-8 px-2!" variant="outlined" color="danger">
        <MdDelete />
        Delete
      </Button>
    </div>
  );
};

export default ChecklistHeader;
