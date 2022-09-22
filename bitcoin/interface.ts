import bitcoin from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';
import { ECPairInterface } from 'ecpair';

export type RedeemType = 'p2sh' | 'p2wsh' | 'p2sh-p2wsh';
export type PaymentType = 'p2wpkh' | 'p2pkh' | 'p2wsh-p2pk' | 'p2sh-p2wpkh' | 'p2sh-p2ms(2 of 2)' | 'p2sh-p2ms(2 of 4)' | 'p2sh-p2wsh-p2ms(3 of 4)';

export interface IWallet {
    address?: string
    mnemonic: string[]
    shuffleMnemonic: string[]
    publicKey?: string
    privateKey?: string
    xpriv?: string
    WIF?: string
    xpub?: string
}
export interface IPayments{
    payment:bitcoin.payments.Payment
    keys: ECPairInterface[] | BIP32Interface[]
}
