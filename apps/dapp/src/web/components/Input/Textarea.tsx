import classNames from 'classnames';
import { ChangeEvent, ReactNode } from 'react';

type AnInputProps = {
  value: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  rows?: number;
  border?: boolean;
  placeholder?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export function AnTextarea({
  prefix,
  suffix,
  onChange,
  rows = 3,
  value,
  placeholder,
  border = true,
}: AnInputProps) {
  return (
    <div
      className={classNames('min-w-[120px] flex items-center bg-theme-50', 'p-[0.75rem]', {
        'border border-solid border-theme-400 rounded-[4px]': border,
      })}
    >
      {prefix && <div className="h-full pr-[0.75rem] flex items-center">{prefix}</div>}
      <textarea
        className="flex-1 outline-none border-none bg-transparent"
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onChange?.(event?.target?.value || '', event);
        }}
      />
      {suffix && <div className="h-full pl-[0.75rem] flex items-center">{suffix}</div>}
    </div>
  );
}
