import "react-native-get-random-values";
import "@ethersproject/shims";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { IContractABI, ITransaction, IWallet } from "./interface"

/**
 *
 *
 * @export
 * @param {string} password
 * @param {string} [path="m/44'/60'/0'/0/0"]
 * @param {number} [seedByte=16]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @return {Promise<{mnemonic:[],keystore:{},shuffleMnemonic:[],publicKey:'',privateKey:''}>}
 */
export declare function createWallet(password: string, path?: string, seedByte?: number, needPrivateKey?: boolean, needPublicKey?: boolean): IWallet;

/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} path
 * @return {Promise<string>}
 */
export declare function exportPrivateKeyFromMnemonic(mnemonic: string, path: string): string;

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>}
 */
export declare function exportPrivateKeyFromKeystore(keystore: string, password: string): string;

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>}
 */
export declare function exportMnemonicFromKeystore(keystore: string, password: string): string;

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>}
 */
export declare function exportKeystore(keystore: string, password: string): string;

/**
 *
 *
 * @export
 * @param {string} privateKey
 * @param {string} password
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @return {Promise<{keystore:{},publicKey:'',privateKey:''}>}
 */
export declare function importPrivateKey(privateKey: string, password: string, needPrivateKey?: boolean, needPublicKey?: boolean): Omit<IWallet, 'mnemonic' | 'shuffleMnemonic'>;

/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} password
 * @param {string} [path="m/44'/60'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @return {Promise<{keystore:{},publicKey:'',privateKey:''}>}
 */
export declare function importMnemonic(mnemonic: string, password: string, path?: string, needPrivateKey?: boolean, needPublicKey?: boolean): Omit<IWallet, 'mnemonic' | 'shuffleMnemonic'>;

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @return {Promise<{keystore:{},publicKey:'',privateKey:''}>}
 */
export declare function importKeystore(keystore: string, password: string, needPrivateKey?: boolean, needPublicKey?: boolean): Omit<IWallet, 'mnemonic' | 'shuffleMnemonic'>;

export declare function getBalance(network: string, address: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): any;

export declare function getContractBalance(network: string, contractAddress: string, contractAbi: IContractABI, address: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): BigNumberish;

export declare function getContractNfts(network: string, contractAddress: string, contractAbi: IContractABI, address: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): any;

export declare function getGasPrice(network: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): BigNumberish;

export declare function getGasLimit(network: string, fromaddress: string, toaddress: string, amount: number, data: any, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): BigNumberish;

export declare function getNonce(network: string, address: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}, blockTag?: string): number;

export declare function waitForTransaction(network: string, transactionHash: any, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): ITransaction;

export declare function sendTransaction(network: string, signedTransaction: any, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): any;

export declare function signTransaction(keystore: string, password: string, nonce: any, gasLimit: any, gasPrice: any, toaddress: string, chainId: any, amount: number, data: any): any;

export declare function signMessage(keystore: string, password: string, message: any): any;

export declare function signTypedData(keystore: string, password: string, domain: any, types: any, value: any): any;

export declare function getContractGasLimit(network: string, contractAddress: string, contractAbi: IContractABI, keystore: string, password: string, toaddress: string, amount: number, decims: any, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): any;

export declare function waitForContractTransaction(tx: any): any;

export declare function contractTransaction(network: string, contractAddress: string, contractAbi: IContractABI, keystore: string, password: string, nonce: any, gasLimit: any, gasPrice: any, toaddress: string, amount: number, decims: any, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): any;

/**
 *
 *
 * @export
 * @param {string|ethers.utils.ConnectionInfo} network
 * @param {*} contractAddress
 * @param {{}|ethers.ContractInterface} contractAbi
 * @param {{name:'', chainId:'',ensAddress:''}|ethers.providers.Networkish} [network_detail={name:'', chainId:'',ensAddress:''}]
 * @return
 */
export declare function getContract(network: string, contractAddress: string, contractAbi: IContractABI, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): ethers.Contract;

/**
 *
 *
 * @export
 * @param {string|ethers.utils.ConnectionInfo} network
 * @param {string} contractAddress
 * @param {{}|ethers.ContractInterface} contractAbi
 * @param {string} keystore
 * @param {string} password
 * @param {{name:'', chainId:'',ensAddress:''}|ethers.providers.Networkish} [network_detail={name:'', chainId:'',ensAddress:''}]
 * @return {Promise<ethers.Contract>}
 */
export declare function getSignerContract(network: string, contractAddress: string, contractAbi: IContractABI, keystore: string, password: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): Promise<ethers.Contract>;

/**
 *
 * @param {string} contractAddress
 * @param {{}|ethers.ContractInterface} contractAbi
 * @param {ethers.providers.Provider|ethers.Signer} walletWithSigner
 * @returns
 */
export declare function getSignerContractWithWalletProvider(contractAddress: string, contractAbi: IContractABI, walletWithSigner: ethers.providers.Provider | ethers.Signer): ethers.Contract;

/**
 *
 *
 * @export
 * @param {string|ethers.utils.ConnectionInfo} network
 * @param {string} keystore
 * @param {string} password
 * @param {{name:'', chainId:'',ensAddress:''}|ethers.providers.Networkish} [network_detail={name:'', chainId:'',ensAddress:''}]
 * @return {Promise<ethers.Wallet>}
 */
export declare function getWalletSigner(network: string, keystore: string, password: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): Promise<ethers.Wallet>;

/**
 *
 *
 * @export
 * @param {string} network
 * @param {{name:'', chainId:'',ensAddress:''}|ethers.providers.Networkish} [network_detail={name:'', chainId:'',ensAddress:''}]
 * @return {ethers.providers.Provider|undefined}
 */
export declare function getProvider(network: string, network_detail?: {
  name: string;
  chainId: number;
  ensAddress: string;
}): ethers.providers.Provider | undefined;

/**
 * Fisher–Yates shuffle
 *
 * @export
 * @param {[]} origin
 * @return {[]}
 */
export declare function shuffleArray(origin: any): any[];

export declare function bigNumberFormatUnits(value: any, decims?: number): string;

export declare function bigNumberParseUnits(value: any, decims?: number): BigNumber;

export declare function getEventNameID(eventName: any): string;

export declare function hexZeroPad(value: any, length: any): string;

export declare function hexString(value: any): string;

export declare function arrayify(value: any): Uint8Array;

export declare function hexlify(value: any): string;

export declare function createBigNumber(value: any): BigNumber;
