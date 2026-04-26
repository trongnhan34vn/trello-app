import { useTranslation } from 'react-i18next';
import Modal, { ModalSize } from '../components/Modal';
import CreateWorkspaceForm from '../forms/workspace/CreateWorkspaceForm';
import type { WorkspaceCreateForm } from '../types/workspace.type';

interface IProps {
  open: boolean;
  onClose: () => void;
  defaultValues: WorkspaceCreateForm;
  onSubmit: (data: WorkspaceCreateForm) => void;
}
const CreateWorkspaceModal = ({ open, onClose, defaultValues, onSubmit }: IProps) => {
  const { t } = useTranslation();
  return (
    <Modal size={ModalSize.LG} hasXMark open={open} onClose={onClose}>
      <Modal.Header>{t('dashboard:workspace_create_form.title')}</Modal.Header>
      <Modal.Body>
        <CreateWorkspaceForm defaultValues={defaultValues} onSubmit={onSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default CreateWorkspaceModal;
