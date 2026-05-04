import { Popover, Portal, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import userImg from '../../assets/user.png';
import { type BoardMember } from '../../types/board.member.type';
import type { CardMember } from '../../types/card.member.type';

interface UserHoverCardProps {
  member: BoardMember | CardMember;
  children: React.ReactNode;
}

const UserHoverCard = ({ member, children }: UserHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasRole = 'roleId' in member;

  return (
    <Popover className="relative group inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center"
      >
        <Popover.Button as="div" className="outline-none cursor-pointer">
          {children}
        </Popover.Button>

        <Portal>
          <Transition
            show={isOpen}
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              static
              anchor="bottom"
              className="z-[100] mt-2 outline-none"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="bg-bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl w-64">
                <div className="flex flex-col items-center text-center gap-3">
                  {/* Large Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg bg-bg-tertiary">
                    <img
                      src={member.avatarUrl || userImg}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* User Info */}
                  <div className="space-y-1 w-full overflow-hidden">
                    <h4 className="text-white font-bold text-lg leading-tight truncate px-1">
                      {member.fullName}
                    </h4>
                    <p className="text-text-secondary text-xs truncate px-1 italic">
                      {member.email}
                    </p>
                  </div>

                  {/* Footer/Role - Only show if roleId exists */}
                  {hasRole && (
                    <>
                      {/* Divider */}
                      <div className="w-full h-px bg-white/10 my-1"></div>
                      <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-wider text-text-muted px-1">
                        <span>Member Status</span>
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                          {(member as BoardMember).roleId === 1 ? 'Admin' : 'Member'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Subtle Arrow */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-secondary rotate-45 border-l border-t border-white/10"></div>
              </div>
            </Popover.Panel>
          </Transition>
        </Portal>
      </div>
    </Popover>
  );
};

export default UserHoverCard;
