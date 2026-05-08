import { IoClose } from 'react-icons/io5';
import userImg from '../assets/user.png';
import { useGetRole } from '../hooks/useGetRole';
import Button from './Button';
import Select from './Select';
interface IProps {
  image: string;
  name: string;
  email: string;
  userId: string;
  roleId?: number;
  hasShowRole?: boolean;
  onSelect?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}
const MemberCard = ({
  image,
  name,
  email,
  roleId,
  hasShowRole,
  userId,
  onSelect,
  onDelete,
}: IProps) => {
  const { options: roleOptions } = useGetRole();
  const defaultRole = roleOptions.find((r) => String(r.value) === String(roleId));
  const isAdmin = roleId == 1;
  return (
    <div
      onClick={() => onSelect?.(userId)}
      className="relative flex group justify-between items-center transition-all duration-150 ease-in hover:bg-bg-tertiary p-2 rounded cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <div className="w-9 h-9">
          <img src={image || userImg} alt="" />
        </div>
        <div>
          <p className="text-text-primary">{name}</p>
          <p className="text-xs text-text-secondary">{email}</p>
        </div>
      </div>
      {hasShowRole && (
          <Select
            disabled={isAdmin}
            name="role"
            options={async () => roleOptions}
            defaultValue={defaultRole}
          />
      )}
      {onDelete && (
        <Button
          onClick={onDelete}
          className="p-1! absolute right-2 group-hover:block! transition-all duration-150 ease-in hidden! opacity-0  items-center hover:bg-bg-card rounded justify-center hover:text-white! text-text-muted! group-hover:opacity-85 hover:opacity-100 -translate-y-1/2 top-1/2"
          variant="text"
        >
          <IoClose />
        </Button>
      )}
    </div>
  );
};

export default MemberCard;
