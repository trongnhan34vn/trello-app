import Button from '../components/Button';
import TextField from '../components/form/TextField';
import Modal from '../components/Modal';
import Form from '../forms';

interface IProps {
  open: boolean;
  close: () => void;
  id: string;
  title: string;
  type: string;
  onDelete: (data: any) => void
}
const DeleteModal = ({ id, title, open, close, type, onDelete }: IProps) => {
  const handleDelete = () => {
    const payload = {
      id
    }
    onDelete(payload);
    close();
  }
  return (
    <Modal open={open} onClose={close}>
      <Modal.Header>
        Delete {type} <strong className="text-red-500">{title}</strong>?
      </Modal.Header>
      <Modal.Body>
        <Form defaultValues={{ name: '' }} onSubmit={handleDelete}>
          <p className="text-white/80 mb-1">
            Are you sure you want to delete {type} {title}? This action cannot be undone.
          </p>
          <p className="text-white/80 mb-2">
            Please enter <strong className="text-red-500">{title}</strong> to confirm:
          </p>
          <TextField
            name="name"
            rules={{
              required: 'Confirmation is required.',
              validate: (value: string) =>
                value === title || 'The confirmation text does not match.',
            }}
          />
          <div className="flex items-center float-right gap-2">
            <Button type="submit" variant="contained" color="danger">
              Delete
            </Button>
            <Button type="button" className="text-text-secondary" variant="text" onClick={close}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
