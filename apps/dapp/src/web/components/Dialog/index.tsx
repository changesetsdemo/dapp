import { AnButton } from '@components/Button';
import { useAdaptive } from '@hooks/useAdaptive';
import { I18nProvider } from '@lib/i18n';
import { Trans } from '@lingui/react';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

type AnDialogProps = {
  visible?: boolean;
  title?: string | ReactNode;
  center?: boolean;
  width?: string;
  children: ReactNode;
  footer?: boolean;
  top?: string;
  disabledConfirm?: boolean;
  confirmText?: string | ReactNode;
  confirm?: () => void;
  close: () => void;
};

export function AnDialogContent({
  title,
  width,
  children,
  confirmText,
  disabledConfirm,
  top,
  confirm,
  close,
  footer = true,
  center = true,
}: AnDialogProps) {
  const { isMobile } = useAdaptive();

  return (
    <div className="fixed z-[999] top-0 left-0">
      <div className={classNames('w-[100vw] h-[100vh] relative')}>
        <div className="absolute top-0 left-0 w-full h-full bg-[#000]/60 z-[1000]"></div>
        <div
          className={classNames('w-full h-full overflow-auto scroll-wrapper', 'absolute z-[1001]', {
            'flex justify-center items-center': center,
            'py-[3rem] relative': !center,
          })}
          style={{ paddingTop: top }}
        >
          <div
            className={classNames(
              'bg-[#ffffff] rounded-[4px] p-[2rem]',
              'absolute left-[50%] translate-x-[-50%]',
              'min-w-[20rem]'
            )}
            style={{ width: isMobile ? '92%' : width }}
          >
            <div className="flex justify-between items-center">
              <div className="text-[1.2rem]">{title}</div>
              <div
                className="cursor-pointer text-[#868686]/80 hover:text-[#333333]"
                onClick={() => {
                  close?.();
                  closeModal();
                }}
              >
                Close
              </div>
            </div>
            <div className="pt-[2rem]">{children}</div>
            {footer && (
              <div className="mt-[2rem]">
                <AnButton
                  full
                  disabled={disabledConfirm}
                  onClick={() => {
                    confirm?.();
                  }}
                >
                  {confirmText ? confirmText : <Trans id="Confirm"></Trans>}
                </AnButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AnDialogContentMemo = memo(AnDialogContent);

export function AnDialog(props: AnDialogProps) {
  const { visible = true } = props;
  return <>{visible && <AnDialogContentMemo {...props} />}</>;
}

export function showModal(props: AnDialogProps) {
  const div_wrap = document.createElement('div');
  div_wrap.id = 'an-modal';
  document.body.appendChild(div_wrap);

  const container = document.getElementById('an-modal');
  const root = createRoot(container!); // createRoot(container!) if you use TypeScript
  root.render(
    <I18nProvider>
      <AnDialogContentMemo {...props}></AnDialogContentMemo>
    </I18nProvider>
  );
}

export function closeModal() {
  const container = document.getElementById('an-modal');
  container && document.body.removeChild(container!);
}
