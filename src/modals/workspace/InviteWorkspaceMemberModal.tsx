import toast from 'react-hot-toast';
import Button from '../../components/Button';
import SelectField from '../../components/form/SelectField';
import Modal from '../../components/Modal';
import UserCard from '../../components/UserCard';
import Form from '../../forms';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { buildUrl, http, USER_ENDPOINT } from '../../services';
import { useCreateWorkspaceMemberMutation } from '../../services/workspace.member.service';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';
import type { User } from '../../types/user.type';
import type {
  CreateWorkspaceMemberForm,
  CreateWorkspaceMemberPayload,
  WorkspaceMember,
} from '../../types/workspace.member.type';

interface IProps {
  open: boolean;
  close: () => void;
  workspaceMembers: WorkspaceMember[];
  workspaceId: string;
}
const InviteWorkspaceMemberModal = ({ open, close, workspaceMembers, workspaceId }: IProps) => {
  const { handle } = useMutationHandler();
  const fetchUsers = async (search: string) => {
    const res = await http().get(buildUrl({ path: USER_ENDPOINT.LIST, query: { search } }));
    const users = res.data?.data;

    return users.map((u: User) => {
      return {
        label: <UserCard image={u.avatarUrl} name={u.fullName} email={u.email} />,
        value: u.id,
        isDisabled: workspaceMembers.find((wm) => wm.userId == u.id),
      };
    });
  };

  const [create] = useCreateWorkspaceMemberMutation();

  const defaultVaues: CreateWorkspaceMemberForm = {
    userOptions: [],
    roleId: 2,
    workspaceId,
  };

  const handleCreateWorkspaceMemberSuccess = (
    data: SuccessResponse<WorkspaceMember>,
    methods: any,
  ) => {
    toast.success(data.message);
    methods.reset();
    close();
  };

  const handleCreateWorkspaceMemberError = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleSubmit = (data: CreateWorkspaceMemberForm, methods: any) => {
    const payload: CreateWorkspaceMemberPayload = {
      ...data,
      userIds: data.userOptions.map((uo) => uo.value as string),
    };

    handle(() => create(payload), {
      onSuccess: (data: any) => handleCreateWorkspaceMemberSuccess(data, methods),
      onError: handleCreateWorkspaceMemberError,
    });
  };

  return (
    <Modal hasXMark open={open} onClose={close}>
      <Modal.Header>Invite Member</Modal.Header>
      <Modal.Body>
        <Form defaultValues={defaultVaues} onSubmit={handleSubmit}>
          <div className="w-full items-start flex gap-2">
            <div className="flex-1">
              <SelectField
                containerClassName="mb-0!"
                isMulti
                isSearchable
                name="userOptions"
                options={fetchUsers}
                rules={{
                  required: "Select your members"
                }}
              />
            </div>
            <div className="flex items-start">
              <Button className="">Send</Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InviteWorkspaceMemberModal;
