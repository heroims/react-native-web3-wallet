import './ethers_shim';
import { HDNodeWallet, ethers } from 'ethers';
type WalletResponse = {
    mnemonic: Array<string>;
    shuffleMnemonic: Array<string>;
    address: string;
    publicKey?: string;
    privateKey?: string;
    keystore?: any;
};
export declare function createWallet(password: string, path?: string, seedByte?: number, needPrivateKey?: boolean, needPublicKey?: boolean, needKeystore?: boolean, mnemonicPassword?: string): Promise<WalletResponse>;
export declare function exportPrivateKeyFromMnemonic(mnemonic: string, path?: string, password?: string): Promise<string>;
export declare function exportPrivateKeyFromKeystore(keystore: string, password: string): Promise<string>;
export declare function exportMnemonicFromKeystore(keystore: string, password: string): Promise<WalletResponse>;
export declare function exportMnemonic(mnemonic: string, address: string, path?: string, password?: string): Promise<WalletResponse>;
export declare function exportKeystore(keystore: string, password: string): Promise<string>;
export declare function exportKeystoreFromMnemonic(password: string, mnemonic: string, address: string, path?: string, mnemonicPassword?: string): Promise<string>;
export declare function importPrivateKey(privateKey: string, password: string, needPrivateKey?: boolean, needPublicKey?: boolean): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>>;
export declare function importMnemonic(mnemonic: string, password: string, path?: string, needPrivateKey?: boolean, needPublicKey?: boolean, needKeystore?: boolean, mnemonicPassword?: string): Promise<WalletResponse>;
export declare function importKeystore(keystore: string, password: string, needPrivateKey?: boolean, needPublicKey?: boolean): Promise<WalletResponse>;
export declare function getBalance(network: string | ethers.FetchRequest, address: string, network_detail?: ethers.Networkish): Promise<bigint>;
export declare function getContractNfts(network: string | ethers.FetchRequest, contractAddress: string, contractAbi: ethers.InterfaceAbi, address: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<Set<string>>;
export declare function getGasPrice(network: string | ethers.FetchRequest, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.FeeData>;
export declare function getGasLimit(network: string | ethers.FetchRequest, fromAddress: string, toAddress: string, amount: string, data: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<bigint>;
export declare function getNonce(network: string | ethers.FetchRequest, address: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}, blockTag?: string): Promise<number>;
export declare function waitForTransaction(network: string | ethers.FetchRequest, transactionHash: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.TransactionReceipt | null>;
export declare function sendTransaction(network: string | ethers.FetchRequest, signedTransaction: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.TransactionResponse>;
export declare function signTransaction(keystore: string, password: string, nonce: number, gasLimit: ethers.BigNumberish, gasPrice: ethers.BigNumberish, toAddress: string, chainId: number, amount: string, data: string): Promise<string>;
export declare function signMessage(keystore: string, password: string, message: string): Promise<string>;
export declare function signTypedData(keystore: string, password: string, domain: ethers.TypedDataDomain, types: Record<string, ethers.TypedDataField[]>, value: Record<string, any>): Promise<string>;
export declare function getContractGasLimit(network: string | ethers.FetchRequest, contractAddress: string, contractAbi: ethers.InterfaceAbi, keystore: string, password: string, toAddress: string, amount: string, decims: number, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<bigint>;
export declare function waitForContractTransaction(tx: ethers.TransactionResponse): Promise<ethers.TransactionReceipt | null>;
export declare function contractTransaction(network: string | ethers.FetchRequest, contractAddress: string, contractAbi: ethers.InterfaceAbi, keystore: string, password: string, nonce: number, gasLimit: ethers.BigNumberish, gasPrice: ethers.BigNumberish, toAddress: string, amount: string, decims: number, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.TransactionResponse>;
export declare function getContract(network: string | ethers.FetchRequest, contractAddress: string, contractAbi: ethers.InterfaceAbi, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): ethers.Contract | null;
export declare function getSignerContract(network: string | ethers.FetchRequest, contractAddress: string, contractAbi: ethers.InterfaceAbi, keystore: string, password: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.Contract>;
export declare function getSignerContractWithWalletProvider(contractAddress: string, contractAbi: ethers.InterfaceAbi, walletWithSigner: ethers.ContractRunner): ethers.Contract;
export declare function getWalletSigner(network: string | ethers.FetchRequest, keystore: string, password: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.Wallet | HDNodeWallet>;
export declare function getWalletSignerWithMnemonic(network: string | ethers.FetchRequest, mnemonic: string, address?: string, path?: string, password?: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<HDNodeWallet>;
export declare function getWalletSignerWithPrivateKey(network: string | ethers.FetchRequest, privateKey: string, address?: string, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): Promise<ethers.Wallet>;
export declare function getProvider(network: string | ethers.FetchRequest, network_detail?: {
    name: string;
    chainId: number;
    ensAddress: string;
}): ethers.Provider | null;
export declare function shuffleArray(origin: Array<any>): Array<any>;
export declare function bigNumberFormatUnits(value: ethers.BigNumberish, decims?: string | ethers.Numeric): string;
export declare function bigNumberParseUnits(value: string, decims?: string | ethers.Numeric): bigint;
export declare function getEventNameID(eventName: string): string;
export declare function hexZeroPad(value: ethers.BytesLike, length: number): string;
export declare function hexString(value: ethers.BytesLike | ethers.BigNumberish): string;
export declare function arrayify(value: ethers.BytesLike, name?: string | undefined): Uint8Array;
export declare function hexlify(value: ethers.BigNumberish, _width?: ethers.Numeric | undefined): string;
export declare function encodeABI(types: [], values: []): string;
export declare function decodeABI(types: [], data: ethers.BytesLike): ethers.Result;
export declare function createBigNumber(value: string): bigint;
export declare function getCheckSumAddress(value: string): string;
export {};
