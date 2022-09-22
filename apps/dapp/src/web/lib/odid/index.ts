import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { ContractOptions, odidContract } from './functions/odidContract';
import { MintOdidParams, OdidAccount } from './types';

export default class Odid {
  private rpcUrl = 'https://rinkeby.arbitrum.io/rpc';

  private chainOptions: ContractOptions;

  constructor(options: ContractOptions, rpcUrl?: string) {
    // ...
    if (rpcUrl) {
      this.rpcUrl = rpcUrl;
    }
    this.chainOptions = options;
  }

  private get provider() {
    if (this.chainOptions.provider) {
      return this.chainOptions.provider;
    }
    return new JsonRpcProvider(this.rpcUrl);
  }

  public contract() {
    return odidContract({ ...this.chainOptions, provider: this.provider });
  }

  public async mintOdid(params: MintOdidParams) {
    const { odid, name, account, figure, ipfsHash } = params;
    if (!odid) return;
    const ouidVal = ethers.utils.toUtf8Bytes(odid.replace(/\s/g, '') || '');
    const ipfsHashVal = ethers.utils.toUtf8Bytes(ipfsHash?.replace(/\s/g, '') || '');
    const res = await this.contract()?.mintOdid(
      ouidVal,
      account ? account : this.chainOptions.account,
      name || '',
      figure || '',
      ipfsHashVal
    );
    return res;
  }

  public async getOdidAccount(odid: string): Promise<OdidAccount> {
    const id = ethers.utils.toUtf8Bytes(odid);
    const res: OdidAccount = await this.contract()?.getOdidAccount(id);
    return res;
  }

  public async getMemberAccount(account?: string): Promise<OdidAccount> {
    const res: OdidAccount = await this.contract()?.getMemberAccount(
      account ? account : this.chainOptions.account
    );
    return res;
  }
}
