"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBigNumber = exports.decodeABI = exports.encodeABI = exports.hexlify = exports.arrayify = exports.hexString = exports.hexZeroPad = exports.getEventNameID = exports.bigNumberParseUnits = exports.bigNumberFormatUnits = exports.shuffleArray = exports.getProvider = exports.getWalletSignerWithPrivateKey = exports.getWalletSignerWithMnemonic = exports.getWalletSigner = exports.getSignerContractWithWalletProvider = exports.getSignerContract = exports.getContract = exports.contractTransaction = exports.waitForContractTransaction = exports.getContractGasLimit = exports.signTypedData = exports.signMessage = exports.signTransaction = exports.sendTransaction = exports.waitForTransaction = exports.getNonce = exports.getGasLimit = exports.getGasPrice = exports.getContractNfts = exports.getBalance = exports.importKeystore = exports.importMnemonic = exports.importPrivateKey = exports.exportKeystoreFromMnemonic = exports.exportKeystore = exports.exportMnemonic = exports.exportMnemonicFromKeystore = exports.exportPrivateKeyFromKeystore = exports.exportPrivateKeyFromMnemonic = exports.createWallet = void 0;
const ethers_1 = require("ethers");
function createWallet(password, path = "m/44'/60'/0'/0/0", seedByte = 16, needPrivateKey = false, needPublicKey = false, needKeystore = true, mnemonicPassword = '') {
    return new Promise((fulfill, reject) => {
        try {
            let start = performance.now();
            //16-12words 20-15words 24-18words 28-21words 32-24words
            let privateSeed = ethers_1.ethers.randomBytes(seedByte);
            var end = performance.now();
            console.log(`privateSeed ${end - start}ms`, privateSeed);
            start = performance.now();
            //2048 words
            let mnemonic = ethers_1.ethers.Mnemonic.entropyToPhrase(privateSeed);
            end = performance.now();
            console.log(`mnemonic ${end - start}ms`, mnemonic);
            start = performance.now();
            mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';
            let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, mnemonicPassword, path);
            end = performance.now();
            console.log(`hdnode ${end - start}ms`, hdnode);
            start = performance.now();
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            let response = {
                mnemonic: mnemonicArr,
                shuffleMnemonic: shuffleMnemonicArr,
                address: hdnode.address,
            };
            if (needPublicKey) {
                response.publicKey = hdnode.publicKey;
            }
            if (needPrivateKey) {
                response.privateKey = hdnode.privateKey;
            }
            if (needKeystore) {
                hdnode
                    .encrypt(password)
                    .then(res => {
                    let jsonObj = JSON.parse(res);
                    end = performance.now();
                    console.log(`keystore ${end - start}ms`, res);
                    start = performance.now();
                    response.keystore = jsonObj;
                    fulfill(response);
                })
                    .catch(err => {
                    reject(err);
                });
            }
            else {
                fulfill(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.createWallet = createWallet;
function exportPrivateKeyFromMnemonic(mnemonic, path = "m/44'/60'/0'/0/0", password = '') {
    return new Promise((fulfill, reject) => {
        try {
            password = password ? password : '';
            let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);
            fulfill(hdnode.privateKey);
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.exportPrivateKeyFromMnemonic = exportPrivateKeyFromMnemonic;
function exportPrivateKeyFromKeystore(keystore, password) {
    return new Promise((fulfill, reject) => {
        ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
            .then(res => {
            fulfill(res.privateKey);
        })
            .catch(err => {
            reject(err);
        });
    });
}
exports.exportPrivateKeyFromKeystore = exportPrivateKeyFromKeystore;
function exportMnemonicFromKeystore(keystore, password) {
    return new Promise((fulfill, reject) => {
        ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
            .then(res => {
            let hdnode = res;
            let mnemonicArr = hdnode.mnemonic?.phrase?.split(' ') ?? [];
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            fulfill({
                address: hdnode.address,
                mnemonic: mnemonicArr,
                shuffleMnemonic: shuffleMnemonicArr,
            });
        })
            .catch(err => {
            reject(err);
        });
    });
}
exports.exportMnemonicFromKeystore = exportMnemonicFromKeystore;
function exportMnemonic(mnemonic, address, path = "m/44'/60'/0'/0/0", password = '') {
    return new Promise((fulfill, reject) => {
        password = password ? password : '';
        let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);
        let passwordError = false;
        if (address) {
            if (address.toLowerCase() !== hdnode.address.toLowerCase()) {
                passwordError = true;
            }
        }
        if (!passwordError) {
            let mnemonicArr = hdnode.mnemonic?.phrase?.split(' ') ?? [];
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            fulfill({
                address: hdnode.address,
                mnemonic: mnemonicArr,
                shuffleMnemonic: shuffleMnemonicArr,
            });
        }
        else {
            reject('password is wrong');
        }
    });
}
exports.exportMnemonic = exportMnemonic;
function exportKeystore(keystore, password) {
    return new Promise((fulfill, reject) => {
        ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
            .then(() => {
            fulfill(keystore);
        })
            .catch(err => {
            reject(err);
        });
    });
}
exports.exportKeystore = exportKeystore;
function exportKeystoreFromMnemonic(password, mnemonic, address, path = "m/44'/60'/0'/0/0", mnemonicPassword = '') {
    return new Promise((fulfill, reject) => {
        mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';
        let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, mnemonicPassword, path);
        if (address.toLowerCase() === hdnode.address.toLowerCase()) {
            hdnode
                .encrypt(password)
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        else {
            reject('password is wrong');
        }
    });
}
exports.exportKeystoreFromMnemonic = exportKeystoreFromMnemonic;
function importPrivateKey(privateKey, password, needPrivateKey = false, needPublicKey = false) {
    return new Promise((fulfill, reject) => {
        try {
            let realPrivatekey = privateKey;
            if (privateKey.substring(0, 2) !== '0x') {
                realPrivatekey = '0x' + privateKey;
            }
            let wallet = new ethers_1.ethers.Wallet(realPrivatekey);
            wallet
                .encrypt(password)
                .then(res => {
                let jsonObj = JSON.parse(res);
                let response = {
                    keystore: jsonObj,
                    address: wallet.address,
                };
                if (needPublicKey) {
                    response.publicKey = jsonObj.publicKey;
                }
                if (needPrivateKey) {
                    response.privateKey = jsonObj.privateKey;
                }
                fulfill(response);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.importPrivateKey = importPrivateKey;
function importMnemonic(mnemonic, password, path = "m/44'/60'/0'/0/0", needPrivateKey = false, needPublicKey = false, needKeystore = true, mnemonicPassword = '') {
    return new Promise((fulfill, reject) => {
        try {
            mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';
            let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, mnemonicPassword, path);
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            let response = {
                mnemonic: mnemonicArr,
                shuffleMnemonic: shuffleMnemonicArr,
                address: hdnode.address,
            };
            if (needPublicKey) {
                response.publicKey = hdnode.publicKey;
            }
            if (needPrivateKey) {
                response.privateKey = hdnode.privateKey;
            }
            if (needKeystore) {
                hdnode
                    .encrypt(password)
                    .then(res => {
                    let jsonObj = JSON.parse(res);
                    response.keystore = jsonObj;
                    fulfill(response);
                })
                    .catch(err => {
                    reject(err);
                });
            }
            else {
                fulfill(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.importMnemonic = importMnemonic;
function importKeystore(keystore, password, needPrivateKey = false, needPublicKey = false) {
    return new Promise((fulfill, reject) => {
        ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
            .then(res => {
            let response = {
                address: res.address,
                keystore: keystore,
                mnemonic: [],
                shuffleMnemonic: []
            };
            if (needPublicKey) {
                response.publicKey = res.publicKey;
            }
            if (needPrivateKey) {
                response.privateKey = res.privateKey;
            }
            let mnemonic = res.mnemonic;
            if (mnemonic) {
                let mnemonicArr = mnemonic.phrase.split(' ');
                let shuffleMnemonicArr = shuffleArray(mnemonicArr);
                response.mnemonic = mnemonicArr;
                response.shuffleMnemonic = shuffleMnemonicArr;
            }
            fulfill(response);
        })
            .catch(err => {
            reject(err);
        });
    });
}
exports.importKeystore = importKeystore;
function getBalance(network, address, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            provider
                .getBalance(address)
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getBalance = getBalance;
function getContractNfts(network, contractAddress, contractAbi, address, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            let contract = new ethers_1.ethers.Contract(contractAddress, contractAbi, provider);
            contract
                .queryFilter(contract.filters.Transfer(address, null))
                .then(sentLogs => {
                contract
                    .queryFilter(contract.filters.Transfer(null, address))
                    .then(receivedLogs => {
                    const logs = sentLogs
                        .concat(receivedLogs)
                        .sort((a, b) => a.blockNumber - b.blockNumber ||
                        a.transactionIndex - b.transactionIndex);
                    const owned = new Set();
                    function addressEqual(arg1, arg2) {
                        return (arg1.replace('0x', '').toLowerCase() ===
                            arg2.replace('0x', '').toLowerCase());
                    }
                    for (const log of logs) {
                        const { from, to, tokenId } = log.args;
                        if (addressEqual(to, address)) {
                            owned.add(tokenId.toString());
                        }
                        else if (addressEqual(from, address)) {
                            owned.delete(tokenId.toString());
                        }
                    }
                    fulfill(owned);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getContractNfts = getContractNfts;
function getGasPrice(network, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            provider
                .getFeeData()
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getGasPrice = getGasPrice;
function getGasLimit(network, fromAddress, toAddress, amount, data, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            let realAmount = ethers_1.ethers.parseEther(amount);
            let tx = {
                to: toAddress,
                data: data,
                from: fromAddress,
                value: realAmount,
            };
            provider
                .estimateGas(tx)
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getGasLimit = getGasLimit;
function getNonce(network, address, network_detail = { name: '', chainId: 1, ensAddress: '' }, blockTag = 'pending') {
    return new Promise((fulfill, reject) => {
        let provider;
        if (network === '' || network === undefined) {
            provider = ethers_1.ethers.getDefaultProvider('homestead');
        }
        else {
            if (JSON.stringify(network_detail) ===
                JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                provider = new ethers_1.ethers.JsonRpcProvider(network);
            }
            else {
                provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
            }
        }
        provider
            .getTransactionCount(address, blockTag)
            .then(nonce => {
            fulfill(nonce);
        })
            .catch(err => {
            reject(err);
        });
    });
}
exports.getNonce = getNonce;
function waitForTransaction(network, transactionHash, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            provider
                .waitForTransaction(transactionHash)
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.waitForTransaction = waitForTransaction;
function sendTransaction(network, signedTransaction, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            provider
                .broadcastTransaction(signedTransaction)
                .then(res => {
                fulfill(res);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.sendTransaction = sendTransaction;
function signTransaction(keystore, password, nonce, gasLimit, gasPrice, toAddress, chainId, amount, data) {
    return new Promise((fulfill, reject) => {
        try {
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                let realAmount = ethers_1.ethers.parseEther(amount);
                let tx = {
                    nonce: nonce,
                    gasLimit: gasLimit,
                    gasPrice: gasPrice,
                    to: toAddress,
                    chainId: chainId,
                    value: realAmount,
                    data: data,
                };
                wallet
                    .signTransaction(tx)
                    .then(signString => {
                    fulfill(signString);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.signTransaction = signTransaction;
function signMessage(keystore, password, message) {
    return new Promise((fulfill, reject) => {
        try {
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                wallet
                    .signMessage(message)
                    .then(signString => {
                    fulfill(signString);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.signMessage = signMessage;
function signTypedData(keystore, password, domain, types, value) {
    return new Promise((fulfill, reject) => {
        try {
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                wallet
                    .signTypedData(domain, types, value)
                    .then(signString => {
                    fulfill(signString);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.signTypedData = signTypedData;
function getContractGasLimit(network, contractAddress, contractAbi, keystore, password, toAddress, amount, decims, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                let realAmount = ethers_1.ethers.parseUnits(amount, decims);
                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers_1.ethers.Contract(contractAddress, contractAbi, walletWithSigner);
                contractWithSigner.transfer
                    .estimateGas(toAddress, realAmount)
                    .then(gas => {
                    fulfill(gas);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getContractGasLimit = getContractGasLimit;
function waitForContractTransaction(tx) {
    return tx.wait();
}
exports.waitForContractTransaction = waitForContractTransaction;
function contractTransaction(network, contractAddress, contractAbi, keystore, password, nonce, gasLimit, gasPrice, toAddress, amount, decims, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                let realAmount = ethers_1.ethers.parseUnits(amount, decims);
                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers_1.ethers.Contract(contractAddress, contractAbi, walletWithSigner);
                function realTransfer() {
                    let tx = {
                        nonce: nonce,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice,
                    };
                    contractWithSigner
                        .transfer(toAddress, realAmount, tx)
                        .then(txres => {
                        fulfill(txres);
                    })
                        .catch(err => {
                        reject(err);
                    });
                }
                if (gasLimit === 0) {
                    contractWithSigner.transfer
                        .estimateGas(toAddress, realAmount)
                        .then(gas => {
                        gasLimit = gas;
                        realTransfer();
                    })
                        .catch(err => {
                        reject(err);
                    });
                }
                else {
                    realTransfer();
                }
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.contractTransaction = contractTransaction;
function getContract(network, contractAddress, contractAbi, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    try {
        let provider;
        if (network === '' || network === undefined) {
            provider = ethers_1.ethers.getDefaultProvider('homestead');
        }
        else {
            if (JSON.stringify(network_detail) ===
                JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                provider = new ethers_1.ethers.JsonRpcProvider(network);
            }
            else {
                provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
            }
        }
        let contract = new ethers_1.ethers.Contract(contractAddress, contractAbi, provider);
        return contract;
    }
    catch (error) {
        return null;
    }
}
exports.getContract = getContract;
function getSignerContract(network, contractAddress, contractAbi, keystore, password, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers_1.ethers.Contract(contractAddress, contractAbi, walletWithSigner);
                fulfill(contractWithSigner);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getSignerContract = getSignerContract;
function getSignerContractWithWalletProvider(contractAddress, contractAbi, walletWithSigner) {
    let contractWithSigner = new ethers_1.ethers.Contract(contractAddress, contractAbi, walletWithSigner);
    return contractWithSigner;
}
exports.getSignerContractWithWalletProvider = getSignerContractWithWalletProvider;
function getWalletSigner(network, keystore, password, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            ethers_1.ethers.Wallet.fromEncryptedJson(keystore, password)
                .then(res => {
                let wallet = res;
                let walletWithSigner = wallet.connect(provider);
                fulfill(walletWithSigner);
            })
                .catch(err => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getWalletSigner = getWalletSigner;
function getWalletSignerWithMnemonic(network, mnemonic, address = '', path = "m/44'/60'/0'/0/0", password = '', network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            password = password ? password : '';
            let hdnode = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);
            let passwordError = false;
            if (address) {
                if (address.toLowerCase() !== hdnode.address.toLowerCase()) {
                    passwordError = true;
                }
            }
            if (!passwordError) {
                let walletWithSigner = hdnode.connect(provider);
                fulfill(walletWithSigner);
            }
            else {
                reject('password is wrong');
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getWalletSignerWithMnemonic = getWalletSignerWithMnemonic;
function getWalletSignerWithPrivateKey(network, privateKey, address = '', network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    return new Promise((fulfill, reject) => {
        try {
            let provider;
            if (network === '' || network === undefined) {
                provider = ethers_1.ethers.getDefaultProvider('homestead');
            }
            else {
                if (JSON.stringify(network_detail) ===
                    JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                    provider = new ethers_1.ethers.JsonRpcProvider(network);
                }
                else {
                    provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
                }
            }
            let wallet = new ethers_1.ethers.Wallet(privateKey);
            let passwordError = false;
            if (address) {
                if (address.toLowerCase() !== wallet.address.toLowerCase()) {
                    passwordError = true;
                }
            }
            if (!passwordError) {
                let walletWithSigner = wallet.connect(provider);
                fulfill(walletWithSigner);
            }
            else {
                reject('password is wrong');
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getWalletSignerWithPrivateKey = getWalletSignerWithPrivateKey;
function getProvider(network, network_detail = { name: '', chainId: 1, ensAddress: '' }) {
    try {
        let provider;
        if (network === '' || network === undefined) {
            provider = ethers_1.ethers.getDefaultProvider('homestead');
        }
        else {
            if (JSON.stringify(network_detail) ===
                JSON.stringify({ name: '', chainId: 1, ensAddress: '' })) {
                provider = new ethers_1.ethers.JsonRpcProvider(network);
            }
            else {
                provider = new ethers_1.ethers.JsonRpcProvider(network, network_detail);
            }
        }
        return provider;
    }
    catch (error) {
        return null;
    }
}
exports.getProvider = getProvider;
function shuffleArray(origin) {
    let array = origin.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
exports.shuffleArray = shuffleArray;
function bigNumberFormatUnits(value, decims = 18) {
    return ethers_1.ethers.formatUnits(value, decims);
}
exports.bigNumberFormatUnits = bigNumberFormatUnits;
function bigNumberParseUnits(value, decims = 18) {
    return ethers_1.ethers.parseUnits(value, decims);
}
exports.bigNumberParseUnits = bigNumberParseUnits;
function getEventNameID(eventName) {
    return ethers_1.ethers.id(eventName);
}
exports.getEventNameID = getEventNameID;
function hexZeroPad(value, length) {
    return ethers_1.ethers.zeroPadValue(value, length);
}
exports.hexZeroPad = hexZeroPad;
function hexString(value) {
    return ethers_1.ethers.toQuantity(value);
}
exports.hexString = hexString;
function arrayify(value, name) {
    return ethers_1.ethers.getBytes(value, name);
}
exports.arrayify = arrayify;
function hexlify(value, _width) {
    return ethers_1.ethers.toBeHex(value, _width);
}
exports.hexlify = hexlify;
function encodeABI(types, values) {
    return ethers_1.ethers.AbiCoder.defaultAbiCoder().encode(types, values);
}
exports.encodeABI = encodeABI;
function decodeABI(types, data) {
    return ethers_1.ethers.AbiCoder.defaultAbiCoder().decode(types, data);
}
exports.decodeABI = decodeABI;
function createBigNumber(value) {
    return BigInt(value);
}
exports.createBigNumber = createBigNumber;
