import Form from '..';
import Button from '../../components/Button';
import TextField from '../../components/form/TextField';

interface IProps {
  close: () => void;
  defaultValues: any;
  onSubmit: (data: any) => void;
}
const CreateCheckListForm = ({ close, defaultValues, onSubmit }: IProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    close();
  };

  return (
    <>
      <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Title"
          placeholder="Checklist"
          rules={{ required: "Enter checklist's title" }}
        />
        <Button className="w-full">Add Checklist</Button>
      </Form>
    </>
  );
};

export default CreateCheckListForm;
