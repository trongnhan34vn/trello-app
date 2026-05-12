import { Menu } from '@headlessui/react';
import type { ReactNode } from 'react';

import { MenuButton } from '@headlessui/react';
import { clsx } from 'clsx';

const Dropdown = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Menu as="div" className={clsx("relative inline-block", className)}>
      {children}
    </Menu>
  );
};

export default Dropdown;

Dropdown.Button = function Button({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <MenuButton className={clsx(className)}>{children}</MenuButton>;
};

import { MenuItems } from '@headlessui/react';
export enum DropdownAnchor {
  BOTTOM_START = 'bottom start',
  BOTTOM_END = 'bottom end',
  TOP_START = 'top start',
  TOP_END = 'top end',
}

export enum DropdownMenuSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

const sizeMap: Record<DropdownMenuSize, string> = {
  sm: 'w-40',
  md: 'w-52',
  lg: 'w-64',
  xl: 'w-80',
  xxl: 'w-96',
};

Dropdown.Items = function Items({
  children,
  className,
  anchor = DropdownAnchor.BOTTOM_END,
  size = DropdownMenuSize.MD,
}: {
  children: ReactNode;
  className?: string;
  anchor?: DropdownAnchor;
  size?: DropdownMenuSize;
}) {
  return (
    <MenuItems
      anchor={anchor}
      transition
      className={clsx(
        'absolute z-70 mt-2 origin-top-right rounded-lg',
        'bg-bg-secondary backdrop-blur-xl border border-white/10 p-1',
        'text-sm text-white shadow-lg',
        'transition duration-150 ease-out',
        'data-[closed]:scale-95 data-[closed]:opacity-0',
        sizeMap[size],
        className,
      )}
    >
      {children}
    </MenuItems>
  );
};

import { MenuItem } from '@headlessui/react';

Dropdown.Item = function Item({ children, onClick, className, disabled }: any) {
  return (
    <MenuItem disabled={disabled}>
      <div
        onClick={onClick}
        className={clsx(
          'group flex w-full text-white/85 items-center text-sm gap-2 rounded-md px-3 py-2 text-left ',
          className,
          disabled
            ? ''
            : 'hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-150 ease-in',
        )}
      >
        {children}
      </div>
    </MenuItem>
  );
};

Dropdown.Separator = function Separator() {
  return <div className="my-1 h-px bg-white/10" />;
};

Dropdown.Header = function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('px-3 py-2 text-xs text-white/50', className)}>{children}</div>;
};
