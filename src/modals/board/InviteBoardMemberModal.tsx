import toast from 'react-hot-toast';
import Button from '../../components/Button';
import SelectField from '../../components/form/SelectField';
import MemberCard from '../../components/MemberCard';
import Modal from '../../components/Modal';
import UserCard from '../../components/UserCard';
import Form from '../../forms';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { buildUrl, http, USER_ENDPOINT } from '../../services';
import { useCreateBoardMemberMutation } from '../../services/board.member.service';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';
import type {
  BoardMember,
  CreateBoardMemberForm,
  CreateBoardMemberPayload,
} from '../../types/board.member.type';
import type { User } from '../../types/user.type';

interface IProps {
  open: boolean;
  close: () => void;
  boardMembers: BoardMember[];
  boardId: string;
}
const InviteBoardMemberModal = ({ open, close, boardId, boardMembers }: IProps) => {
  const fetchUsers = async (search: string) => {
    const res = await http().get(buildUrl({ path: USER_ENDPOINT.LIST, query: { search } }));
    const users = res.data?.data;

    return users.map((u: User) => {

      return {
        label: <UserCard image={u.avatarUrl} name={u.fullName} email={u.email} />,
        value: u.id,
        isDisabled: boardMembers.find(bm => bm.userId == u.id)
      };
    });
  };

  const [createBoardMember] = useCreateBoardMemberMutation();
  const { handle } = useMutationHandler();

  const defaultValue: CreateBoardMemberForm = {
    boardId,
    roleId: 2,
    users: [],
  };

  const handleCreateBoardMemberSuccess = (data: SuccessResponse<BoardMember>, methods: any) => {
    methods.reset();
    toast.success(data.message);
  };

  const handleCreateBoardMemberError = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleSubmit = (data: CreateBoardMemberForm, methods: any) => {
    const payload: CreateBoardMemberPayload = {
      ...data,
      userIds: data.users.map((o) => o.value as string),
    };

    handle(() => createBoardMember(payload), {
      onSuccess: (data: SuccessResponse<BoardMember>) =>
        handleCreateBoardMemberSuccess(data, methods),
      onError: handleCreateBoardMemberError,
    });
  };

  return (
    <Modal hasXMark open={open} onClose={close}>
      <Modal.Header>Invite Member</Modal.Header>
      <Modal.Body>
        <Form defaultValues={defaultValue} onSubmit={handleSubmit}>
          <div className="w-full items-start flex gap-2">
            <div className="flex-1">
              <SelectField
                containerClassName="mb-0!"
                isMulti
                isSearchable
                name="users"
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
        <div>
          <p className="mt-5 text-text-secondary font-bold">Board Members</p>
          <div>
            {boardMembers?.map((bm) => {
              return (
                <MemberCard
                  key={bm.id}
                  name={bm.fullName}
                  email={bm.email}
                  image={bm.avatarUrl}
                  roleId={bm.roleId}
                />
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InviteBoardMemberModal;
