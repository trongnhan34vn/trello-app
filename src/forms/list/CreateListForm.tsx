import { IoClose } from 'react-icons/io5';
import Form from '..';
import Button from '../../components/Button';
import TextField from '../../components/form/TextField';
import type { ListCreateForm } from '../../types/list.type';

interface IProps {
  boardId: string;
  defaultValues: ListCreateForm;
  onSubmit: (data: ListCreateForm) => void;
  onCloseCreateList: () => void;
}

const CreateListForm = ({ defaultValues, onSubmit, onCloseCreateList, boardId }: IProps) => {
  const handleSubmit = (data: ListCreateForm) => {
    onSubmit?.(
      {...data, boardId}
    )
  }
  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
      <TextField
        rules={{
          required: 'List name is required',
        }}
        name="name"
        placeholder="List name..."
      />

      <Button type="submit">Create List</Button>
      <Button
        type="button"
        onClick={onCloseCreateList}
        variant="text"
        className="text-text-muted! hover:text-white! absolute -right-5"
      >
        <IoClose size={22} />
      </Button>
    </Form>
  );
};

export default CreateListForm;
