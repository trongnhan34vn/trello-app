import { Dialog, Transition } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';
import Button from './Button';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

const SideModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
}: SideModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={`pointer-events-auto w-screen ${maxWidth}`}>
                  <div className="flex h-full flex-col bg-bg-secondary shadow-2xl">
                    {/* Header */}
                    <div className="px-5 pt-4 flex items-center justify-between">
                      <Dialog.Title className="text-lg font-bold text-white tracking-tight">
                        {title}
                      </Dialog.Title>
                      <Button
                        className="hover:text-white! hover:bg-bg-surface rounded-full p-0! w-10 h-10"
                        color="disabled"
                        onClick={onClose}
                        variant="text"
                      >
                        <IoClose size={18} />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-5 text-white text-sm">
                      {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                      <div className="px-5 py-4 bg-bg-secondary/20 flex items-center justify-between">
                        {footer}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SideModal;
