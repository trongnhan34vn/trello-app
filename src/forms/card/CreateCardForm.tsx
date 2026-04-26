import { IoClose } from 'react-icons/io5';
import Form from '..';
import Button from '../../components/Button';
import TextField from '../../components/form/TextField';

interface IProps {
  listId: string;
  defaultValues: any;
  onSubmit: (data: any) => void;
  onCloseCreateCard: () => void;
}
const CreateCardForm = ({
  defaultValues,
  onSubmit,
  onCloseCreateCard,
  listId,
}: IProps) => {
  const handleSubmit = (data: any) => {
    onSubmit?.({
      title: data.title,
      listId,
    });
  };
  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
      <TextField
        rules={{
          required: 'Card name is required',
        }}
        name="title"
        placeholder="Card name..."
      />

      <Button type="submit">Create Card</Button>
      <Button
        type="button"
        onClick={onCloseCreateCard}
        variant="text"
        className="text-text-muted! hover:text-white! absolute -right-5"
      >
        <IoClose size={22} />
      </Button>
    </Form>
  );
};

export default CreateCardForm;
