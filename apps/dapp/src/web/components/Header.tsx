import LogoICON from '@assets/svg/logo.svg';
import { useAdaptive } from '@hooks/useAdaptive';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ConnectWallet } from './ConnectWallet';

export function Header() {
  const navigate = useNavigate();

  const { isMobile, adaptive } = useAdaptive();

  return (
    <>
      <div
        className={classNames(
          'w-full h-[5rem]',
          'backdrop-blur-[8px] shadow-[0_1px_2px_0_rgba(67,67,87,30%)]',
          'fixed top-0'
        )}
        style={{ borderBottomStyle: 'solid' }}
      >
        <div className="w-full h-full flex justify-between items-center">
          <div
            className={classNames('cursor-pointer flex items-center w-[16.25rem]', 'px-[2rem]', {
              'text-[1.2rem]': isMobile,
            })}
            onClick={() => {
              navigate('/');
            }}
          >
            <img
              src={LogoICON}
              className={classNames('w-[2.2rem] mr-[0.6rem] ', {
                'w-[1.6rem] h-[1.6rem]': adaptive.xs,
              })}
            />
            <span className="font-medium text-purple-500 text-[1.3rem]">SOLV BUILDER</span>
          </div>
          <div className="flex flex-1 items-center justify-between px-[2rem] xs:px-[1rem]">
            <div className="flex flex-1 items-center justify-center px-[4rem]">
              {/* nav menu */}
            </div>
            <div className={classNames('ml-[3rem] flex items-center', { 'ml-0': adaptive.xs })}>
              <div className="flex items-center">
                <ConnectWallet></ConnectWallet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
