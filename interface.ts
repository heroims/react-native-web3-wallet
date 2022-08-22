import { Fragment, JsonFragment } from "@ethersproject/abi/src.ts/fragments";

export interface ICrypto {
  cipher: string
  cipherparams: {
    iv: string
  }
  ciphertext: string
  kdf: string
  kdfparams: {
    salt: string
    n: number
    dklen: number
    p: number
    r: number
  }
  mac: string
}

export interface IKeystore {
  address: string
  id: string
  version: number
  Crypto: ICrypto
}

export interface IWallet {
  mnemonic: string[]
  keystore: IKeystore
  shuffleMnemonic: string[]
  publicKey?: string
  privateKey?: string
}

export type IContractABI = string | ReadonlyArray<Fragment | JsonFragment | string>

export interface ITransaction {
  blockHash: string;
  blockNumber: number;
  byzantium: boolean;
  confirmations: number;
  contractAddress?: any;
  cumulativeGasUsed: {
    hex: string;
    type: string;
  };
  from: string;
  gasUsed: {
    hex: string;
    type: string;
  };
  logs: any[];
  logsBloom: string;
  status: number;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: number;
}
