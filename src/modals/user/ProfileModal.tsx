import { useState } from 'react';
import { FaAddressCard, FaPhone, FaUser } from 'react-icons/fa';
import { MdAlternateEmail, MdDescription, MdEdit, MdVpnKey } from 'react-icons/md';
import userPlaceholder from '../../assets/user.png';
import Button from '../../components/Button';
import Form from '../../forms';
import type { User } from '../../types/user.type';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

interface ProfileModalProps {
  user: User | null;
}

const ProfileModal = ({ user }: ProfileModalProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div>
      <div className="flex mb-2 justify-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
          <img
            className="w-full h-full object-cover"
            src={user?.avatarUrl || userPlaceholder}
            alt={user?.fullName || 'User'}
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="font-bold text-2xl text-center text-white tracking-tight">
          {user?.fullName || ''}
        </p>
        <p className="text-center mt-1 italic text-text-secondary text-sm">{user?.email}</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button
            onClick={() => setIsEditOpen(true)}
            variant="outlined"
            className="flex items-center gap-2 px-4 py-2 border-white/20 transition-all duration-300"
          >
            <MdEdit size={16} />
            <span className="text-sm font-semibold">Edit profile</span>
          </Button>
          <Button
            onClick={() => setIsChangePasswordOpen(true)}
            variant="outlined"
            className="flex items-center gap-2 px-4 py-2 border-white/20 transition-all duration-300"
          >
            <MdVpnKey size={16} />
            <span className="text-sm font-semibold">Change password</span>
          </Button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Form
        defaultValues={{
          fullName: user?.fullName,
          email: user?.email || '',
        }}
        onSubmit={() => { }}
      >
        {/* Profile Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <FaUser className="text-primary" size={14} />
            <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">
              Profile Information
            </h3>
          </div>

          <div className="space-y-4 px-2">
            <div className="flex items-start">
              <div className="flex w-1/4 items-center gap-2 text-text-secondary">
                <MdAlternateEmail size={16} />
                <p className="font-medium text-xs">Email</p>
              </div>
              <p className="flex-1 text-white text-sm">{user?.email || 'Not provided'}</p>
            </div>

            <div className="flex items-start">
              <div className="flex w-1/4 items-center gap-2 text-text-secondary">
                <FaPhone size={14} />
                <p className="font-medium text-xs">Phone</p>
              </div>
              <p className="flex-1 text-white text-sm">{user?.phone || 'Not provided'}</p>
            </div>

            <div className="flex items-start">
              <div className="flex w-1/4 items-center gap-2 text-text-secondary">
                <FaAddressCard size={16} />
                <p className="font-medium text-xs">Address</p>
              </div>
              <p className="flex-1 text-white text-sm">{user?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        {user?.bio?.trim() && (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <MdDescription className="text-primary" size={16} />
              <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">About Me</h3>
            </div>
            <div className="px-2">
              <p className="text-justify text-text-secondary text-sm leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default ProfileModal;
