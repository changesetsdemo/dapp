import { atomWithImmer } from 'jotai/immer';

export type ABIParserStoreItem = { abi: string; address: string };

export const abiParserStoreAtom = atomWithImmer<ABIParserStoreItem[]>([]);
