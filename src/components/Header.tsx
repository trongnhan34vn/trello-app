import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import user from '../assets/user.png';
import logo from '../assets/vite.svg';
import Input from './Input';
import Button from './Button';
import { AiOutlineHome } from 'react-icons/ai';
import { AiFillHome } from 'react-icons/ai';

const Header = () => {
  return (
    <div className="p-3 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <img className="w-8 h-8" src={logo} alt="" />
        <p className="text-xl font-bold">Trello</p>
      </div>
      <div className="w-1/3 flex items-center gap-5">
        <Button variant="text" className='text-white hover:bg-bg-tertiary p-2! rounded-full'>
          <AiFillHome size={24} />
        </Button>
        <Input leftIcon={<IoSearchSharp size={18} />} name="search" placeholder="Search..." />
      </div>
      <div className="flex items-center gap-5">
        <div>
          <IoIosNotificationsOutline size={24} className="text-text-muted cursor-not-allowed" />
        </div>
        <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer border-3 border-transparent hover:border-border">
          <img src={user} className="w-full h-full object-contain" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
