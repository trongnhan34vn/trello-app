import Form from '..';
import userImg from '../../assets/user.png';
import TextField from '../../components/form/TextField';
import MemberCard from '../../components/MemberCard';
import type { BoardMember } from '../../types/board.member.type';

interface IProps {
  members: BoardMember[];
}
const AddMemberForm = ({ members }: IProps) => {
  return (
    <>
      <Form defaultValues={{}} onSubmit={() => {}}>
        <TextField name="search" placeholder="Search member..." />
        <p className="text-text-secondary text-sm font-bold mb-1">Board Members</p>
        {/* Members */}
        <div>
          {/* Member */}
          {members?.map((m) => {
            return (
              <MemberCard
                key={m.id}
                image={m.avatarUrl || userImg}
                name={m.fullName}
                email={m.email}
                roleId={m.roleId}
              />
            );
          })}
        </div>
      </Form>
    </>
  );
};

export default AddMemberForm;
