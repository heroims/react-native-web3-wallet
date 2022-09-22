import { BIP32Interface } from 'bip32';
import bitcoin from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import { IPayments, IWallet, PaymentType, RedeemType } from './interface';

/**
 *
 *
 * @export
 * @param {string} password
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {number} [seedByte=16]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',mnemonic:[],WIF:'',xpriv:'',xpub:'',shuffleMnemonic:[],publicKey:'',privateKey:''}>} 
 */
export declare function createWallet(password: string, path?: string, seedByte?: number, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<IWallet>;

/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} [password='']
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:'',mnemonic:[],shuffleMnemonic[]}>} 
 */
export declare function importMnemonic(mnemonic: string, password?: string, path?: string, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<IWallet>;

/**
 *
 *
 * @export
 * @param {string} wif
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:''}>} 
 */
 export declare function importWIF(wif: string, path?: string, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<Omit<IWallet, 'mnemonic' | 'shuffleMnemonic'>>;

 /**
 *
 *
 * @export
 * @param {string} xpriv
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:''}>} 
 */
export declare function importXpriv(xpriv: string, path?: string, network?: bitcoin.networks.Network, needPrivateKey?: boolean, needPublicKey?: boolean, needXpriv?: boolean, needXpub?: boolean, needWIF?: boolean): Promise<Omit<IWallet, 'mnemonic' | 'shuffleMnemonic'>>;
 
/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} [password='']
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @return {import('bip32').BIP32Interface} 
 */
 export declare function getBitcoinNodeFromMnemonic(mnemonic: string, password?: string, path?: string): BIP32Interface;

/**
 *
 *
 * @export
 * @param {string} wif
 * @return {import('ecpair').ECPairInterface} 
 */
export declare function getBitcoinNodeFromWIF(wif: string): ECPairInterface;

/**
 *
 *
 * @export
 * @param {string} xpriv
 * @return {import('bip32').BIP32Interface} 
 */
export declare function getBitcoinNodeFromXpriv(xpriv: string): BIP32Interface;

/**
 *
 *
 * @export
 * @param {Buffer|string} publicKey
 * @param {bitcoin.networks.Network} network
 * @param {Number} bip
 * @return {string} 
 */
export declare function getBitcoinAddress(publicKey: Buffer | string, network: bitcoin.networks.Network, bip: Number): string;

/**
 * 
 * @param {PaymentType} _type 
 * @param {BIP32Interface[] | ECPairInterface[]} myKeys 
 * @param {bitcoin.networks.Network} network 
 * @return {{payment:{},keys:[]}}
 */
export declare function createPayment(_type: PaymentType, myKeys: BIP32Interface[] | ECPairInterface[], network: bitcoin.networks.Network):IPayments;

/**
 *
 *
 * @export
 * @param {*} utx
 * @param {bitcoin.payments.Payment} payment
 * @param {boolean} isSegwit
 * @param {string} redeemType
 * @return {*}  
 */
export declare function getInputData(payment: bitcoin.payments.Payment, utx: any, isSegwit: boolean, redeemType: RedeemType): any;