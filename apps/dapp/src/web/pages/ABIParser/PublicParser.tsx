import AnCard from '@components/Card';
import { AnTextarea } from '@components/Input/Textarea';
import { AnList } from '@components/List';
import { AnItem } from '@components/List/Item';
import { NavMenu, NavMenuModule } from '@components/wrapper/CommonWrapper';
import { useABIParser } from '@hooks/useABIParser';
import { Trans } from '@lingui/react';
import classNames from 'classnames';
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useImmer } from '../../hooks/useImmer';

import { ABIProps, ContractFnItem } from '@components/ABIParser/ContractFnItem';

export default function PublicParser() {
  const { abiParserStore, setABIParserStore } = useABIParser();

  const [currentType, setCurrentType] = useState('read');

  const [selectedContract, setSelectedContract] = useImmer<{
    abi: ABIProps[] | undefined;
    address: string;
  }>({
    abi: undefined,
    address: '',
  });

  const [menus, setMenus] = useImmer<{ data: NavMenu[] }>({ data: [] });

  const handleMenus = useCallback(() => {
    setMenus(draft => {
      draft.data = [];
    });
    if (abiParserStore && abiParserStore.length > 0) {
      setMenus(draft => {
        draft.data.push({
          label: <Trans id="Add ABI Parser"></Trans>,
          key: 'add-abi-data',
          type: 'menu',
          path: '',
          isActive: false,
          onTap: () => {
            console.log('[Tip] ===> Add ABI');
          },
        });
        abiParserStore.forEach(item => {
          draft.data.push({
            label: 'Voucher 合约',
            key: item.address,
            type: 'menu',
            path: '',
            value: JSON.stringify(item),
            isActive: false,
            onTap: data => {
              console.log('[Tip] ===> onTap');
              setSelectedContract(draftValue => {
                draftValue.abi = JSON.parse(data).abi;
                draftValue.address = JSON.parse(data).address;
              });
              console.log('[Tip]  ===> ', JSON.parse(data).abi);
            },
            onClose: () => {
              console.log('[Tip] ===> onClose');
            },
          });
        });
      });
    }
  }, [abiParserStore, setMenus, setSelectedContract]);

  useEffect(() => {
    handleMenus();
  }, [handleMenus]);

  useEffect(() => {
    setSelectedContract(draft => {
      draft.abi = menus.data[1] && menus.data[1].value ? JSON.parse(menus.data[1].value).abi : '';
      draft.address =
        menus.data[1] && menus.data[1].value ? JSON.parse(menus.data[1].value).address : '';
    });
  }, [menus.data, setSelectedContract]);

  const formatABI = useCallback(() => {
    console.log('[Tip] selectedContract.abi ===> ', selectedContract.abi);
    if (!selectedContract.abi) return;
    const readNodeList: ReactNode[] = [];
    const writeNodeList: ReactNode[] = [];

    for (const abiItem of selectedContract.abi) {
      const itemValue = abiItem;
      const fnType = itemValue.type;

      if (fnType != 'event') {
        const isQuery =
          itemValue.stateMutability &&
          ['view', 'pure'].includes(itemValue.stateMutability as string)
            ? true
            : false;
        (isQuery ? readNodeList : writeNodeList).push([
          <ContractFnItem
            data={abiItem}
            contractAddress={selectedContract.address}
            contractAbi={selectedContract.abi}
            key={'read' + itemValue.name}
          ></ContractFnItem>,
        ]);
      }
    }
    const res = { read: readNodeList, write: writeNodeList };
    console.log('[Tip] nodeList res ===> ', res);
    return res;
  }, [selectedContract.abi, selectedContract.address]);

  const abiNodeList = useMemo(() => {
    return selectedContract.address ? formatABI() : { read: [], write: [] };
  }, [formatABI, selectedContract.address]);

  return (
    <>
      <NavMenuModule menus={menus.data} active={selectedContract.address}></NavMenuModule>
      <div className="flex">
        <div
          className={classNames('mr-[2rem] text-theme-500 hover:text-purple-500', {
            '!text-purple-500': currentType === 'read',
          })}
          onClick={() => setCurrentType('read')}
        >
          <Trans id="Read"></Trans>
        </div>
        <div
          className={classNames('text-theme-500 hover:text-purple-500', {
            'text-purple-500': currentType === 'write',
          })}
          onClick={() => setCurrentType('write')}
        >
          <Trans id="Write"></Trans>
        </div>
      </div>
      <AnCard className="w-full mt-[2rem] flex bg-theme-50 p-[2rem] shadow-sm">
        <AnList className="flex-1 pr-[2rem]">
          {(currentType === 'read' ? abiNodeList?.read || [] : abiNodeList?.write || []).map(
            (node, index) => (
              <Fragment key={'read-node' + index}>{node}</Fragment>
            )
          )}
          {currentType === 'read' && abiNodeList?.read.length == 0 && (
            <span className="text-theme-400">
              <Trans id="No Function"></Trans> ~
            </span>
          )}
          {currentType === 'write' && abiNodeList?.write.length == 0 && (
            <span className="text-theme-400">
              <Trans id="No Function"></Trans> ~
            </span>
          )}
        </AnList>
        <div className="w-[36%] pl-[2rem] border-l border-l-theme-300">
          <AnTextarea value={JSON.stringify(selectedContract.abi)} rows={12}></AnTextarea>
          <AnItem label={<Trans id="Contract Address"></Trans>} className="mt-[2rem]">
            <AnCard>{selectedContract.address}</AnCard>
          </AnItem>
        </div>
      </AnCard>
    </>
  );
}
