import Form from '..';
import userImg from '../../assets/user.png';
import TextField from '../../components/form/TextField';
import MemberCard from '../../components/MemberCard';
import type { BoardMember } from '../../types/board.member.type';
import type { CardMember } from '../../types/card.member.type';

interface IProps {
  boardMembers: BoardMember[];
  cardMembers: CardMember[];
  onSelect: (payload: any) => void;
  onDeleteCardMember: (payload: any) => void;
}
const AddMemberForm = ({ boardMembers, cardMembers, onSelect, onDeleteCardMember }: IProps) => {
  return (
    <>
      <Form defaultValues={{}} onSubmit={() => {}}>
        <TextField name="search" placeholder="Search member..." />
        {cardMembers && cardMembers.length > 0 && (
          <div className="mb-5">
            <p className="text-text-secondary text-sm font-bold mb-1">Card Members</p>
            {/* Members */}
            <div>
              {/* Member */}
              {cardMembers?.map((m) => {
                return (
                  <MemberCard
                    userId={m.userId}
                    key={m.id}
                    image={m.avatarUrl || userImg}
                    name={m.fullName}
                    email={m.email}
                    hasShowRole={false}
                    onDelete={() => onDeleteCardMember(m.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {boardMembers && boardMembers.length > 0 && (
          <div>
            <p className="text-text-secondary text-sm font-bold mb-1">Board Members</p>
            {/* Members */}
            <div>
              {/* Member */}
              {boardMembers?.map((m) => {
                return (
                  <MemberCard
                    userId={m.userId}
                    key={m.id}
                    image={m.avatarUrl || userImg}
                    name={m.fullName}
                    email={m.email}
                    hasShowRole={false}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Form>
    </>
  );
};

export default AddMemberForm;
