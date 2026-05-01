import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react';


import { clsx } from 'clsx';
import { Children, isValidElement, type ReactNode } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { Fragment } from 'react';

export enum ModalSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  _XL = 'xl',
  FULL = 'full',
}

interface IProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  hasXMark?: boolean;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full h-full',
};

const Modal = ({ open, onClose, children, size = ModalSize.MD, hasXMark, className }: IProps) => {
  let header, body, footer;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Modal.Header) header = child;
    if (child.type === Modal.Body) body = child;
    if (child.type === Modal.Footer) footer = child;
  });

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative max-h-5/6 text-white z-10 focus:outline-none"
        onClose={onClose}
      >
        {/* overlay */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/20 backdrop-blur-xs transition duration-300 ease-out data-closed:opacity-0"
        />

        <div className={clsx(className, 'fixed z-10 top-0 bottom-0 left-0 right-0 w-screen')}>
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className={clsx(
                'w-full relative rounded-xl p-4 bg-bg-secondary/80 backdrop-blur-xl duration-300 shadow-xl border border-white/10 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0',
                sizeMap[size],
              )}
            >
              {hasXMark && (
                <div
                  onClick={onClose}
                  className="absolute top-2 right-2 text-text-secondary p-2 hover:text-white cursor-pointer transition-all duration-150 ease-in hover:bg-white/5 w-10 h-10 flex items-center justify-center rounded-full"
                >
                  <FaXmark />
                </div>
              )}
              {header}
              {body}
              {footer}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};


export default Modal;

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

Modal.Header = function Header({ children, className }: HeaderProps) {
  return <div className={clsx('mb-4 text-lg font-semibold', className)}>{children}</div>;
};

interface BodyProps {
  children: ReactNode;
  className?: string;
}

Modal.Body = function Body({ children, className }: BodyProps) {
  return <div className={clsx('text-sm text-gray-600', className)}>{children}</div>;
};

interface FooterProps {
  children: ReactNode;
  className?: string;
}

Modal.Footer = function Footer({ children, className }: FooterProps) {
  return <div className={clsx('mt-6 flex justify-end gap-2', className)}>{children}</div>;
};
