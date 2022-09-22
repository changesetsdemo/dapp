import { AnDialog } from '@components/Dialog';
import { AnInput } from '@components/Input';
import Odid from '@lib/odid';
import { MintOdidParams } from '@lib/odid/types';
import { Trans } from '@lingui/react';
import { messageAtom } from '@states/message';
import { useWeb3React } from '@web3-react/core';
import { useImmerAtom } from 'jotai/immer';
import { memo, useCallback, useMemo, useState } from 'react';
import { useImmer } from '../../hooks/useImmer';

type CreateOdidProps = {
  visible: boolean;
  close: () => void;
};

export function CreateOdidContent({ close }: CreateOdidProps) {
  const { account, chainId, provider: library, isActive } = useWeb3React();
  const [, setMessageAtom] = useImmerAtom(messageAtom);

  const [odidForm, setOdidForm] = useImmer<MintOdidParams>({
    odid: '',
    figure: '',
    ipfsHash: '',
  });
  const [laodMint, setLoadMint] = useState(false);

  const odidHelper = useMemo(() => {
    return isActive && account && chainId && library
      ? new Odid({
          chainId: Number(chainId),
          account: account || '',
          provider: library,
        })
      : undefined;
  }, [account, chainId, isActive, library]);

  const bindMintOdid = useCallback(async () => {
    if (!odidHelper) return;
    setLoadMint(true);
    try {
      const res = await odidHelper.mintOdid({
        odid: odidForm.odid.replace(/\s/g, ''),
        figure: odidForm.figure?.replace(/\s/g, '') || '',
        ipfsHash: odidForm.ipfsHash?.replace(/\s/g, '') || '',
      });
      await res.wait();
      setLoadMint(false);
      setMessageAtom(draft => {
        draft.show = true;
        draft.message = <Trans id="Create odid success!"></Trans>;
      });
      close?.();
    } catch (error) {
      console.log('[Tip] error ===> ', error);
      setLoadMint(false);
    }
  }, [close, odidForm.figure, odidForm.ipfsHash, odidForm.odid, odidHelper, setMessageAtom]);

  return (
    <AnDialog
      title={<Trans id="Add Tube Type"></Trans>}
      width="30rem"
      confirm={bindMintOdid}
      disabledConfirm={laodMint || !odidForm.odid}
      close={() => {
        close?.();
      }}
      center={true}
    >
      <div className="mt-[0.5rem]">
        <Trans id="Odid"></Trans>
        <div className="mt-[1rem]">
          <AnInput
            value={odidForm.odid}
            onChange={value => {
              setOdidForm(draft => {
                draft.odid = value;
              });
            }}
            placeholder={'Odid'}
          ></AnInput>
        </div>
        <div className="mt-[1rem]">
          <AnInput
            value={odidForm.figure || ''}
            onChange={value => {
              setOdidForm(draft => {
                draft.figure = value;
              });
            }}
            placeholder={'Figure'}
          ></AnInput>
        </div>
        <div className="mt-[1rem]">
          <AnInput
            value={odidForm.ipfsHash || ''}
            onChange={value => {
              setOdidForm(draft => {
                draft.ipfsHash = value;
              });
            }}
            placeholder={'Ipfs hash'}
          ></AnInput>
        </div>
      </div>
    </AnDialog>
  );
}

const CreateOdidMemo = memo(CreateOdidContent);

export function CreateOdid(props: CreateOdidProps) {
  return <>{props.visible && <CreateOdidMemo {...props} />}</>;
}
