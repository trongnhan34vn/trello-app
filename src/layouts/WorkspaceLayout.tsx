import { useState, type ReactNode } from 'react';
import { MdGroupAdd } from 'react-icons/md';
import Button from '../components/Button';
import WorkspaceThumbnail from '../components/WorkspaceThumbnail';
import InviteWorkspaceMemberModal from '../modals/workspace/InviteWorkspaceMemberModal';
import type { WorkspaceMember } from '../types/workspace.member.type';

interface IProps {
  index: string;
  children: ReactNode;
  name: string;
  title: string;
  isWorkspaceMember?: boolean;
  workspaceMembers?: WorkspaceMember[];
  workspaceId?: string;
}
const WorkspaceLayout = ({
  index,
  children,
  name,
  title,
  isWorkspaceMember = false,
  workspaceMembers,
  workspaceId,
}: IProps) => {
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
      <InviteWorkspaceMemberModal
        workspaceId={workspaceId}
        workspaceMembers={workspaceMembers}
        open={isOpenInviteMemberModal}
        close={() => setOpenInviteMemberModal(false)}
      />
    </div>
  );
};

export default WorkspaceLayout;
