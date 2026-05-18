import toast from 'react-hot-toast';
import Modal, { ModalSize } from '../../components/Modal';
import ChangePasswordForm from '../../forms/user/ChangePasswordForm';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { useChangePasswordMutation } from '../../services/auth.service';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [changePassword] = useChangePasswordMutation();
  const { handle } = useMutationHandler();

  const handleSubmit = (data: any) => {
    const { currentPassword, newPassword } = data;

    handle(() => changePassword({ currentPassword, newPassword }), {
      onSuccess: (res: any) => {
        toast.success(res?.message || 'Password changed successfully!');
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to change password.');
      },
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose} size={ModalSize.MD} hasXMark>
      <Modal.Header>Change Password</Modal.Header>
      <Modal.Body>
        <ChangePasswordForm onSubmit={handleSubmit} onCancel={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
