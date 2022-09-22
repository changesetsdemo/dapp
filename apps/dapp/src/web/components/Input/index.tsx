import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

export type InputChangeEvent = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type AnInputProps = {
  mode?: 'integer' | 'decimal' | 'text';
  maxLength?: number;
  decimals?: number;
  value: string;
  type?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  border?: boolean;
  warn?: boolean;
  placeholder?: string;
  className?: string;
  full?: boolean;
  size?: 'ledger' | 'default' | 'medium' | 'small';
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
};

const handleIntegerValue = (value: string) => {
  if (value === 'NaN' || !value) {
    return '';
  }
  value = value.replace(/[^0-9]/g, '');
  const res: string = value ? new BigNumber(value).toString(10) : '';
  return res;
};

const roundList: Array<number | string> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const handleDecimalValue = (value: string, round: number, decimals: number) => {
  value = value.replace(/。/, '.');
  value = value.replace(/[^\d.]/g, '');
  value = value.replace(/^\./g, '');
  value = value.replace(/\.{4,}/g, '.');
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

  if (value.indexOf('.') > -1 && roundList.includes(round)) {
    if (value.split('.')[1] && value.split('.')[1].length > decimals) {
      value = new BigNumber(value).toFixed(decimals, 1);
    }
  } else {
    value = value.replace(
      new RegExp(`^(\\-)*(\\d+)\\.(${'\\d'.repeat(Number(decimals))}).*$`, 'g'),
      '$1$2.$3'
    );
  }
  return value;
};

export function AnInput<E extends HTMLInputElement>({
  type = 'text',
  mode,
  maxLength,
  decimals,
  prefix,
  suffix,
  onChange,
  value,
  warn,
  placeholder,
  className,
  full,
  size = 'default',
  border = true,
}: AnInputProps) {
  let saveValue = '';

  const inputEl = useRef(null);
  const [showCleartext, setShowCleartext] = useState(false);

  const handleChange = (event: ChangeEvent<E>) => {
    if (mode === 'integer') {
      event.target.value = handleIntegerValue(event.target.value);
    }
    if (mode === 'decimal') {
      event.target.value = handleDecimalValue(event.target.value, 1, decimals || 0);
    }

    if (maxLength) {
      event.target.value = event.target.value.substring(0, maxLength);
    }

    if (saveValue != event.target.value || !event.target.value) {
      onChange?.(event.target.value, event);
    }
    saveValue = event.target.value;
  };

  useEffect(() => {
    setShowCleartext(value ? true : false);
  }, [value]);

  return (
    <div
      className={classNames(
        'min-w-[120px] flex items-center',
        'p-[0.75rem] bg-theme-50',
        {
          'border border-solid border-theme-400 rounded-[4px]': border,
          '!border-[#e83939]': warn,
        },
        { 'w-full': full },
        {
          'h-[3.75rem]': size === 'default',
          'h-[2.8rem] text-[0.8rem]': size === 'medium',
          'h-[2rem] text-[0.8rem]': size === 'small',
        },
        className
      )}
    >
      {prefix && <div className="h-full pr-[0.75rem] flex items-start">{prefix}</div>}
      <input
        className="w-full flex-1 outline-none border-none bg-transparent placeholder-gray-400"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputEl}
      />
      {showCleartext && (
        <div
          onClick={() => {
            if (inputEl.current) {
              (inputEl.current as { value: string }).value = '';
              onChange?.('');
            }
          }}
          className={classNames('opacity-[0.6] hover:opacity-[1] z-[-1] pl-[0.6rem]')}
        >
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2373"
            width="14"
            height="14"
          >
            <path
              d="M512 83.2c-234.666667 0-426.666667 192-426.666667 426.666667s192 426.666667 426.666667 426.666666 426.666667-192 426.666667-426.666666-192-426.666667-426.666667-426.666667z m0 810.666667c-211.2 0-384-172.8-384-384s172.8-384 384-384 384 172.8 384 384c0 213.333333-172.8 384-384 384z"
              p-id="2374"
            ></path>
            <path
              d="M674.133333 345.6c-8.533333-8.533333-21.333333-8.533333-29.866666 0l-134.4 134.4-134.4-134.4c-8.533333-8.533333-21.333333-8.533333-29.866667 0-8.533333 8.533333-8.533333 21.333333 0 29.866667l134.4 134.4-134.4 134.4c-8.533333 8.533333-8.533333 21.333333 0 29.866666 4.266667 4.266667 10.666667 6.4 14.933333 6.4 6.4 0 10.666667-2.133333 14.933334-6.4l136.533333-134.4 134.4 134.4c4.266667 4.266667 10.666667 6.4 14.933333 6.4 6.4 0 10.666667-2.133333 14.933334-6.4 8.533333-8.533333 8.533333-21.333333 0-29.866666l-134.4-134.4 134.4-134.4c6.4-8.533333 6.4-21.333333-2.133334-29.866667z"
              p-id="2375"
            ></path>
          </svg>
        </div>
      )}
      {suffix && <div className="h-full pl-[0.75rem] flex items-center">{suffix}</div>}
    </div>
  );
}
