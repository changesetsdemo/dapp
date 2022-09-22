import CloseICON from '@assets/svg/close.svg';
import { messageAtom } from '@states/message';
import classNames from 'classnames';
import { useImmerAtom } from 'jotai/immer';
import { memo, ReactNode, useEffect } from 'react';

type AnMessageProps = { children?: ReactNode };

let timeoutMessageEntry: NodeJS.Timeout;

function AnMessageContent({ children }: AnMessageProps) {
  const [messageData, setMessageAtom] = useImmerAtom(messageAtom);

  useEffect(() => {
    clearTimeout(timeoutMessageEntry);
    timeoutMessageEntry = setTimeout(() => {
      setMessageAtom(draft => {
        draft.type = 'info';
        draft.show = false;
        draft.message = '';
      });
    }, messageData.delay || 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames('fixed right-[2rem] top-[12%] z-[1999]')}>
      <div
        className={classNames(
          'max-w-[34rem] min-h-[4rem] px-[1.5rem] py-[1rem] bg-[#ffffff] border-[#eeeeee] border border-solid rounded-[4px] shadow-md',
          {
            '!border-[#e19d37]': messageData.type === 'warn',
            '!border-[#e83939]': messageData.type === 'error',
            '!border-[#2ba92b]': messageData.type === 'success',
          }
        )}
      >
        <div className={classNames('flex items-center justify-between')}>
          <div className="flex-1">
            {children ? (
              children
            ) : (
              <div className="flex flex-wrap leading-[1.4] text-[#565656]">
                {messageData.message}
              </div>
            )}
          </div>

          <img
            src={CloseICON}
            className="w-[1.6rem] h-[1.6rem] ml-[2rem] cursor-pointer"
            alt=""
            onClick={() => {
              setMessageAtom(draft => {
                draft.show = false;
                draft.message = '';
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

const AnMessageMemo = memo(AnMessageContent);

export function AnMessage(props: AnMessageProps) {
  const [message] = useImmerAtom(messageAtom);

  return <>{message.show && <AnMessageMemo {...props} />}</>;
}
