import { AnButton } from '@components/Button';
import AnCard from '@components/Card';
import { AnInput } from '@components/Input';
import { AnItem } from '@components/List/Item';
import { Trans } from '@lingui/react';
import { getContract } from '@utils/index';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export type ABIProps = {
  inputs: { [key: string]: string }[];
  name: string;
  outputs: { [key: string]: string }[];
  stateMutability: string;
  type: string;
};

export function ContractFnItem({
  data,
  contractAddress,
  contractAbi,
}: {
  data: ABIProps;
  contractAddress: string;
  contractAbi: ABIProps[];
}) {
  const { provider, account } = useWeb3React();

  const isQuery =
    data.stateMutability && ['view', 'pure'].includes(data.stateMutability as string)
      ? true
      : false;

  const contractHelper = useCallback(() => {
    if (provider) {
      return getContract(contractAddress, contractAbi, provider, account);
    }
    return undefined;
  }, [account, provider, contractAbi, contractAddress]);

  return (
    <AnItem label={<p className="text-theme-900">{data.name}</p>}>
      <AnCard className="!p-[2rem] bg-theme-50 w-full">
        <div className="w-full">
          {data.inputs.map((inputItem, index) => (
            <div key={'read' + data.name + inputItem.name + index} className="mb-[1rem]">
              <AnItem label={`${inputItem.name}(${inputItem.type})`}>
                <AnInput full value={''} placeholder={inputItem.type} size="medium"></AnInput>
              </AnItem>
            </div>
          ))}
          <AnButton
            full
            size="medium"
            onClick={async () => {
              if (provider) {
                const res = await contractHelper()?.queryDreamVouchers({
                  voucher: '0xbabB1b3163606431CeFB236BcEaB91c4dCf4dD39',
                  owner: account,
                });
                console.log('[Tip] res ===> ', res);
              }
            }}
          >
            {isQuery ? <Trans id="Query"></Trans> : <Trans id="Write"></Trans>}
          </AnButton>
          <AnCard className="mt-[1rem]">Result: --</AnCard>
        </div>
      </AnCard>
    </AnItem>
  );
}
