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
  address?: string
  mnemonic: string[]
  keystore?: IKeystore
  shuffleMnemonic: string[]
  publicKey?: string
  privateKey?: string
}

export type IContractABI = string | ReadonlyArray<Fragment | JsonFragment | string>