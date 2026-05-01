import userImg from '../assets/user.png';
import { useGetRole } from '../hooks/useGetRole';
import Select from './Select';
interface IProps {
  image: string;
  name: string;
  email: string;
  roleId: number;
}
const MemberCard = ({ image, name, email, roleId }: IProps) => {
  const { options: roleOptions } = useGetRole();
  const defaultRole = roleOptions.find((r) => String(r.value) === String(roleId));
  const isAdmin = roleId == 1;
  return (
    <div className="flex justify-between items-center transition-all duration-150 ease-in hover:bg-bg-tertiary p-2 rounded cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9">
          <img src={image || userImg} alt="" />
        </div>
        <div>
          <p className="text-text-primary">{name}</p>
          <p className="text-xs text-text-secondary">{email}</p>
        </div>
      </div>
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
};

export default MemberCard;
