import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import 'tippy.js/dist/tippy.css'; // optional

type MenuData = {
  label: string | ReactNode;
  value: string;
  isActive?: boolean;
};

type AnDownMenuProps = {
  label?: string | ReactNode;
  data: MenuData[];
  optionNode?: ReactNode;
  childrem?: ReactNode;
};

export function AnDownMenu({ label, data, optionNode, childrem }: AnDownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <Tippy
      className="bg-white shadow-md border-solid border border-theme-300"
      content={
        <div className="text-theme-900">
          {data.map((item, index) => (
            <div
              key={item.value + index}
              className="hover:shadow-md hover:bg-purple-50/50 px-[2rem] py-[1rem] border-b border-b-theme-300"
              onClick={() => {
                console.log('[Tip] item.value ===> ', item.value);
                close();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      }
      visible={isOpen}
      interactive={true}
      arrow={false}
      onClickOutside={close}
      placement="bottom-start"
    >
      <button
        className={classNames(
          'flex items-center justify-center',
          'bg-transparent',
          'border-none p-0',
          'h-auto w-full'
        )}
        onClick={open}
      >
        <span className="w-full">{label}</span>
      </button>
    </Tippy>
  );
}
