import classNames from 'classnames';
import { ReactNode, useCallback } from 'react';

type AnButtonProps = {
  type?: 'link' | 'button';
  children: ReactNode;
  full?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'ledger' | 'default' | 'medium' | 'small';
  onClick?: () => void;
};

export function AnButton({
  type = 'button',
  children,
  full,
  disabled,
  onClick,
  className,
  size = 'default',
}: AnButtonProps) {
  const onTap = useCallback(() => {
    !disabled && onClick?.();
  }, [disabled, onClick]);

  return (
    <button
      className={classNames(
        'flex items-center justify-center z-[0]',
        'bg-[#ffffff]',
        'border border-solid border-theme-400 px-[.625rem] py-[4px] rounded-[4px]',
        { 'hover:border-[#4c4c8f] hover:shadow-md': !disabled },
        {
          'w-full': full,
        },
        {
          ' cursor-not-allowed': disabled, // border-theme-300 text-theme-300
        },
        {
          'h-[3.75rem]': size === 'default',
          'h-[2.8rem] text-[0.8rem]': size === 'medium',
          'h-[2rem] text-[0.8rem]': size === 'small',
        },
        className
      )}
      onClick={onTap}
    >
      {children}
    </button>
  );
}
