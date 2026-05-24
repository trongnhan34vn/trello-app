import toast from 'react-hot-toast';
import Modal, { ModalSize } from '../../components/Modal';
import EditProfileForm from '../../forms/user/EditProfileForm';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { useUpdateProfileMutation } from '../../services/user.service';
import type { User } from '../../types/user.type';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const EditProfileModal = ({ isOpen, onClose, user }: EditProfileModalProps) => {
  const [updateProfile] = useUpdateProfileMutation();
  const { handle } = useMutationHandler();

  const handleSubmit = (data: any) => {
    handle(() => updateProfile(data), {
      onSuccess: (res: any) => {
        toast.success(res?.message || 'Profile updated successfully!');
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to update profile.');
      },
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose} size={ModalSize.MD} hasXMark>
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Body>
        <EditProfileForm user={user} onSubmit={handleSubmit} onCancel={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
