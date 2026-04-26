import { Popover, Portal } from '@headlessui/react';
import { type ReactNode } from 'react';

const PopoverBox = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <Popover className={clsx('relative', className)}>{children}</Popover>;
};

export default PopoverBox;

import { clsx } from 'clsx';

PopoverBox.Button = function Button({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Popover.Button as={'div'} className={clsx('whitespace-nowrap', className)}>
      {children}
    </Popover.Button>
  );
};

export enum PopoverAnchor {
  TOP = 'top',
  TOP_START = 'top-start',
  TOP_END = 'top-end',

  BOTTOM = 'bottom',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',

  LEFT = 'left',
  LEFT_START = 'left-start',
  LEFT_END = 'left-end',

  RIGHT = 'right',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
}

PopoverBox.Panel = function Panel({
  children,
  className,
  anchor = PopoverAnchor.BOTTOM,
}: {
  children: ReactNode;
  className?: string;
  anchor?: PopoverAnchor;
}) {
  return (
    <Popover.Panel
      anchor={anchor as any}
      className={clsx(
        'absolute z-10 mt-2 w-96 rounded-xl',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        'text-sm text-white shadow-lg',
        'p-3 space-y-3',
        'transition duration-150 ease-out',
        'data-closed:opacity-0 data-closed:scale-95',
        'max-h-[80vh] overflow-hidden flex flex-col', // ← thêm dòng này

        className,
      )}
    >
      {children}
    </Popover.Panel>
  );
};

PopoverBox.Header = function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-center font-bold text-sm text-text-secondary', className)}>
      {children}
    </div>
  );
};

PopoverBox.Body = function Body({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('pr-1', className)}>{children}</div>;
};
