import Form from '..';
import Button from '../../components/Button';
import TextEditorField from '../../components/form/TextEditorField';
import { UpdateCardField, useUpdateCard } from '../../hooks/useUpdateCard';

interface IProps {
  closeOnEditDescription: () => void;
  cardId: string;
  defaultValues: any;
}
const EditDescriptionCardForm = ({ cardId, closeOnEditDescription, defaultValues }: IProps) => {
  const { onSubmit } = useUpdateCard(cardId, UpdateCardField.DESCRIPTION);

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={(data: any) => {
        closeOnEditDescription();
        onSubmit(data);
      }}
    >
      <TextEditorField name="description" rules={{ required: 'Enter description...' }} />
      <div className="flex items-center justify-end">
        <Button type="submit">Save</Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            closeOnEditDescription();
          }}
          type="button"
          variant="text"
          className="text-text-secondary hover:text-red-500"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditDescriptionCardForm;
