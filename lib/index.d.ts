/// <reference types="node" />
import { BIP32Interface } from 'bip32';
import { ECPairInterface } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
export declare const bitcoin_lib: typeof bitcoin;
type WalletResponse = {
    mnemonic: Array<string>;
    shuffleMnemonic: Array<string>;
    address: string;
    publicKey?: string;
    privateKey?: string;
    xpriv?: string;
    xpub?: string;
    WIF?: string;
};
type RedeemType = 'p2sh' | 'p2wsh' | 'p2sh-p2wsh' | '';
type PaymentType = 'p2wpkh' | 'p2pkh' | 'p2wsh-p2pk' | 'p2sh-p2wpkh' | 'p2sh-p2ms(2 of 2)' | 'p2sh-p2ms(2 of 4)' | 'p2sh-p2wsh-p2ms(3 of 4)';
export declare function getBitcoinAddress(publicKey: Buffer | string, network: bitcoin.networks.Network, bip: number): string;
export declare function createWallet(password: string, path?: string, seedByte?: number, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<WalletResponse>;
export declare function importMnemonic(mnemonic: string, password?: string, path?: string, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<WalletResponse>;
export declare function importWIF(wif: string, path?: string, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needWIF?: boolean): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>>;
export declare function importXpriv(xpriv: string, path?: string, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>>;
export declare function getBitcoinNodeFromMnemonic(mnemonic: string, password?: string, path?: string, network?: bitcoin.networks.Network): BIP32Interface;
export declare function getBitcoinNodeFromWIF(wif: string, network?: bitcoin.networks.Network): ECPairInterface;
export declare function getBitcoinNodeFromXpriv(xpriv: string, network?: bitcoin.networks.Network): BIP32Interface;
export declare function createPayment(_type: PaymentType, myKeys: any[], network?: bitcoin.networks.Network): {
    payment: bitcoin.payments.Payment | undefined;
    keys: any[];
};
export declare function getInputData(txId: string, vout: number, isSegwit: boolean, utx: {
    txHex?: string;
    script: string;
    value: any;
}, redeemType?: RedeemType, payment?: bitcoin.payments.Payment): any;
export declare function toPaddedHexString(num: bigint | number, len: number): string;
export declare function shuffleArray(array: Array<any>): Array<any>;
export {};
