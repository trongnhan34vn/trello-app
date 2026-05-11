import { Popover, Transition } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';

const PopoverBox = ({
  children,
  className,
}: {
  children: ReactNode | ((props: { open: boolean; close: () => void }) => ReactNode);
  className?: string;
}) => {
  return (
    <Popover className={clsx('relative', className)}>
      {(props) => <>{typeof children === 'function' ? children(props) : children}</>}
    </Popover>
  );
};

export default PopoverBox;

import { clsx } from 'clsx';

PopoverBox.Button = function Button({
  children,
  className,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Popover.Button
      as={'div'}
      disabled={disabled}
      className={clsx('whitespace-nowrap', className, disabled ? 'cursor-not-allowed' : '')}
    >
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

export enum PopoverSize {
  XS = 'xs', // cực nhỏ (icon tooltip)
  SM = 'sm', // nhỏ (simple dropdown)
  MD = 'md', // mặc định
  LG = 'lg', // lớn hơn
  XL = 'xl', // khá lớn
  XXL = '2xl', // rất lớn

  FULL = 'full', // full width
  AUTO = 'auto', // theo content
  FIT = 'fit', // fit-content
  CONTENT = 'content', // alias cho fit-content

  SCREEN_SM = 'screen-sm', // responsive
  SCREEN_MD = 'screen-md',
  SCREEN_LG = 'screen-lg',
}

PopoverBox.Panel = function Panel({
  children,
  className,
  anchor = PopoverAnchor.BOTTOM,
  size = PopoverSize.MD,
}: {
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  className?: string;
  anchor?: PopoverAnchor;
  size?: PopoverSize;
}) {
  const POPOVER_SIZE_MAP: Record<PopoverSize, string> = {
    xs: 'w-40',
    sm: 'w-56',
    md: 'w-72',
    lg: 'w-96',
    xl: 'w-[28rem]',
    '2xl': 'w-[32rem]',

    full: 'w-full',
    auto: 'w-auto',
    fit: 'w-fit',
    content: 'w-fit',

    'screen-sm': 'max-w-sm w-full',
    'screen-md': 'max-w-md w-full',
    'screen-lg': 'max-w-lg w-full',
  };
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="opacity-0 scale-95 translate-y-1"
      enterTo="opacity-100 scale-100 translate-y-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 scale-100 translate-y-0"
      leaveTo="opacity-0 scale-95 translate-y-1"
    >
      <Popover.Panel
        anchor={anchor as any}
        className={clsx(
          'absolute z-90 mt-2 rounded-xl',
          'bg-bg-secondary/80 backdrop-blur-xl border border-white/10',
          'text-sm text-white shadow-lg drop-shadow-xl',
          'p-3 space-y-3',
          'transition duration-150 ease-out',
          'data-closed:opacity-0 data-closed:scale-95',
          'max-h-[80vh] overflow-hidden flex flex-col',
          POPOVER_SIZE_MAP[size],
          className,
        )}
      >
        {(props) => <>{typeof children === 'function' ? children(props) : children}</>}
      </Popover.Panel>
    </Transition>
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
