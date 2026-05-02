import { clsx } from 'clsx';
import { useParams } from 'react-router-dom';
import userImg from '../../assets/user.png';
import Select from '../../components/Select';
import { useGetRole } from '../../hooks/useGetRole';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { useDetailWorkspaceQuery } from '../../services/workspace.service';

const WorkspaceMemberPage = () => {
  const { id, index } = useParams();

  const { data: workspaceApiRes } = useDetailWorkspaceQuery(id);
  const workspace = workspaceApiRes ? workspaceApiRes.data : null;
  const members = workspace?.members ?? [];

  const { options: roleOptions } = useGetRole();

  const isReady = roleOptions.length > 0;

  return (
    <WorkspaceLayout
      workspaceId={id}
      workspaceMembers={members}
      title={'List workspace members'}
      index={index || '0'}
      name={workspace?.name || ''}
      isWorkspaceMember
    >
      {isReady && (
        <div>
          {members.map((m) => {
            const defaultRole = roleOptions.find((r) => String(r.value) === String(m.roleId));
            const isAdmin = m.roleId == 1;
            return (
              <div
                key={m.id}
                className={clsx('flex items-center justify-between p-2 border-b border-border')}
              >
                {/* info */}
                <div className="flex items-center gap-2">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={m.avatarUrl && m.avatarUrl != '' ? m.avatarUrl : userImg}
                    alt=""
                  />
                  <div>
                    <p className="text-sm">{m.fullName}</p>
                    <p className="text-xs text-text-secondary">{m.email}</p>
                  </div>
                </div>
                {/* action */}
                <div>
                  <Select
                    disabled={isAdmin}
                    name="role"
                    options={async () => roleOptions}
                    defaultValue={defaultRole}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WorkspaceLayout>
  );
};

export default WorkspaceMemberPage;
