import { useState, type ReactNode } from 'react';
import WorkspaceThumbnail from '../components/WorkspaceThumbnail';
import Button from '../components/Button';
import { MdGroupAdd } from 'react-icons/md';
import Modal from '../components/Modal';
import Form from '../forms';
import Select from '../components/Select';

interface IProps {
  index: string;
  children: ReactNode;
  name: string;
  title: string;
  isWorkspaceMember?: boolean;
}
const WorkspaceLayout = ({ index, children, name, title, isWorkspaceMember = false }: IProps) => {
  const [isOpenInviteMemberModal, setOpenInviteMemberModal] = useState(false);
  return (
    <div className="p-4">
      <WorkspaceThumbnail name={name} index={Number(index) || 0} />
      <div className="border border-border my-4" />
      <div>
        <div className="flex justify-between items-center mb-5">
          <p className="text-text-secondary font-bold">{title}</p>
          {isWorkspaceMember && (
            <Button onClick={() => setOpenInviteMemberModal(true)}>
              <MdGroupAdd size={18} />
              <span>Invite member</span>
            </Button>
          )}
        </div>
        {children}
      </div>
      <Modal
        hasXMark
        open={isOpenInviteMemberModal}
        onClose={() => setOpenInviteMemberModal(false)}
      >
        <Modal.Header>Invite Member</Modal.Header>
        <Modal.Body>
          <Form defaultValues={{}} onSubmit={() => { }}>
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <Select isMulti isSearchable name="member" options={async () => []} />
              </div>
              <Button className="">Send</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WorkspaceLayout;
