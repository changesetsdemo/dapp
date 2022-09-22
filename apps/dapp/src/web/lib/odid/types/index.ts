export type OdidAccount = {
  odid: string;
  name: string;
  chain: number;
  figure: string;
  ipfsHash: string;
  lessee: string;
  member: string;
  owner: string;
  valid: boolean;
};

export type MintOdidParams = {
  odid: string;
  name?: string;
  account?: string;
  figure?: string;
  ipfsHash?: string;
};
