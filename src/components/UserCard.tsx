import userImg from '../assets/user.png';

interface IProps {
  image: string;
  name: string;
  email: string;
}
const UserCard = ({ image, name, email }: IProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9">
        <img src={image || userImg} alt="" />
      </div>
      <div>
        <p className="text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">{email}</p>
      </div>
    </div>
  );
};

export default UserCard;
