// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { BigNumber, ethers } from "ethers";

/**
 * Fisher–Yates shuffle
 *
 * @export
 * @param {[]} origin
 * @return {[]} 
 */
export function shuffleArray(origin) {
    var array = origin.slice();
    var m = array.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
};

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
export function createWallet(password, path = "m/44'/60'/0'/0/0", seedByte = 16, needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        try {
            console.log('create begin');

            var start = performance.now();
            //16-12words 20-15words 24-18words 28-21words 32-24words
            let privateSeed = ethers.utils.randomBytes(seedByte);
            //2048 words
            let mnemonic = ethers.utils.entropyToMnemonic(privateSeed);
    
            var end = performance.now();
            console.log('mnemonic done', `${end - start}ms\n`);
        
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        
            end = performance.now();
            console.log('wallet init', `${end - start}ms\n`);
            
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);

            wallet.encrypt(password).then(res=>{
                end = performance.now();
                let jsonObj = JSON.parse(res);
                
                let response = {
                    mnemonic : mnemonicArr, 
                    keystore : jsonObj,
                    shuffleMnemonic : shuffleMnemonicArr,
                };
                if(needPublicKey){
                    response.publicKey=wallet.publicKey;
                }
                if(needPrivateKey){
                    response.privateKey=wallet.privateKey;
                }

                fulfill(response)
            })
            .catch(err=>{
                reject(err);
            }); 
        } catch (error) {
            reject(error);
        }
    });
};

/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} path
 * @return {Promise<string>} 
 */
export function exportPrivateKeyFromMnemonic(mnemonic, path){
    return new Promise((fulfill, reject)=>{
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
            fulfill(wallet.privateKey);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>} 
 */
export function exportPrivateKeyFromKeystore(keystore, password){
    return new Promise((fulfill, reject)=>{
        ethers.Wallet.fromEncryptedJson(keystore,password).then(res=>{
            fulfill(res.privateKey);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>} 
 */
export function exportMnemonicFromKeystore(keystore, password){
    return new Promise((fulfill, reject)=>{
        ethers.Wallet.fromEncryptedJson(keystore,password).then(res=>{
        	let mnemonicArr = res.mnemonic.phrase.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            fulfill({
                mnemonic : mnemonicArr, 
                shuffleMnemonic : shuffleMnemonicArr,     
            });
        })
        .catch(err=>{
            reject(err);
        });
    });
}

/**
 *
 *
 * @export
 * @param {string} keystore
 * @param {string} password
 * @return {Promise<string>} 
 */
export function exportKeystore(keystore, password){
    return new Promise((fulfill, reject)=>{
        ethers.Wallet.fromEncryptedJson(keystore,password).then(res=>{
            fulfill(keystore);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

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
export function importPrivateKey(privateKey, password, needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        try {
            var realPrivatekey = privateKey;
            if(privateKey.substring(0,2) !== '0x'){
                realPrivatekey = '0x' + privateKey;
            }

            let wallet = new ethers.Wallet(realPrivatekey);
            wallet.encrypt(password).then(res=>{
                let jsonObj = JSON.parse(res);

                let response = {
                    keystore : jsonObj,
                };
                if(needPublicKey){
                    response.publicKey=res.publicKey;
                }
                if(needPrivateKey){
                    response.privateKey=res.privateKey;
                }
                fulfill(response);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
        
    });
}

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
export function importMnemonic(mnemonic, password, path = "m/44'/60'/0'/0/0", needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
            wallet.encrypt(password).then(res=>{
                let jsonObj = JSON.parse(res);

                let response = {
                    keystore : jsonObj,
                };
                if(needPublicKey){
                    response.publicKey=res.publicKey;
                }
                if(needPrivateKey){
                    response.privateKey=res.privateKey;
                }
                fulfill(response);
            })
            .catch(err=>{
                reject(err);importMnemonic()
            });
        } catch (error) {
            reject(error);
        }
    });
}

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
export function importKeystore(keystore, password, needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        ethers.Wallet.fromEncryptedJson(keystore,password)
        .then(res=>{
            let response = {
                keystore : keystore,
            };
            if(needPublicKey){
                response.publicKey=res.publicKey;
            }
            if(needPrivateKey){
                response.privateKey=res.privateKey;
            }
            fulfill(response);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

export function getBalance(network, address, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }
            
            provider.getBalance(address).then(res=>{    
                fulfill(res);
            })
            .catch(err=>{
                reject(err);
            }); 
        } catch (error) {
            reject(error);
        }
    });
}

export function getContractBalance(network, contractAddress, contractAbi, address, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            let contract = new ethers.Contract(contractAddress, contractAbi, provider);
            
            contract.balanceOf(address).then(res=>{
                fulfill(res);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
        
    });
}

export function getContractNfts(network, contractAddress, contractAbi, address, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            let contract = new ethers.Contract(contractAddress, contractAbi, provider);
            
            contract.queryFilter(contract.filters.Transfer(address, null)).then(sentLogs=>{
                contract.queryFilter(contract.filters.Transfer(null, address)).then(receivedLogs=>{
                    const logs = sentLogs.concat(receivedLogs)
                    .sort(
                      (a, b) =>
                        a.blockNumber - b.blockNumber ||
                        a.transactionIndex - b.TransactionIndex,
                    );

                    const owned = new Set();

                    function addressEqual(arg1, arg2) {
                        return arg1.replace('0x','').toLowerCase() == arg2.replace('0x','').toLowerCase();
                    }
                    for (const log of logs) {
                        const { from, to, tokenId } = log.args;
                        if (addressEqual(to, address)) {
                        owned.add(tokenId.toString());
                        } else if (addressEqual(from, address)) {
                        owned.delete(tokenId.toString());
                        }
                    }
                    fulfill(owned);
                })
                .catch(err=>{
                    reject(err);
                });
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
        
    });
}

export function getGasPrice(network, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            provider.getGasPrice().then(res=>{
                fulfill(res);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function getGasLimit(network, fromAddress, toAddress, amount, data, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
            }
            let realAmount = ethers.utils.parseEther(amount);

            let tx = {
                to: toAddress, 
                data: data, 
                from: fromAddress, 
                value: realAmount
            }
            provider.estimateGas(tx).then(res=>{
                fulfill(res);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function getNonce(network, address, network_detail = {name:'', chainId:'',ensAddress:''}, blockTag = 'pending'){
    return new Promise((fulfill, reject)=>{
        let provider;
        if(network==='' || network===undefined){
            provider = new ethers.providers.getDefaultProvider();
        }
        else{
            if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                provider = new ethers.providers.JsonRpcProvider(network);
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network, network_detail);
            }
        }
        
        provider.getTransactionCount(address, blockTag).then(nonce=>{
            fulfill(nonce);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

export function waitForTransaction(network, transactionHash, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            provider.waitForTransaction(transactionHash).then(res=>{
                fulfill(res)
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function sendTransaction(network, signedTransaction, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            provider.sendTransaction(signedTransaction).then(res=>{
                fulfill(res)
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function signTransaction(keystore, password, nonce, gasLimit, gasPrice, toAddress, chainId, amount, data){
    return new Promise((fulfill, reject)=>{
        try {
            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;
                let realAmount = ethers.utils.parseEther(amount);

                let tx = {
                    nonce: nonce,
                    gasLimit: gasLimit,
                    gasPrice: gasPrice,
                    to: toAddress,
                    chainId: chainId,
                    value: realAmount,
                    data: data
                };
                wallet.signTransaction(tx).then(res=>{
                    fulfill(res);
                })
                .catch(err=>{
                    reject(err);
                });
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });

}

export function signMessage(keystore, password, message){
    return new Promise((fulfill, reject)=>{
        try {
            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;

                wallet.signMessage(message).then(res=>{
                    fulfill(res);
                })
                .catch(err=>{
                    reject(err);
                });
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });

}

export function signTypedData(keystore, password, domain, types, value){
    return new Promise((fulfill, reject)=>{
        try {
            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;

                wallet._signTypedData(domain, types, value).then(res=>{
                    fulfill(res);
                })
                .catch(err=>{
                    reject(err);
                });
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });

}

export function getContractGasLimit(network, contractAddress, contractAbi, keystore, password, toAddress, amount, decims, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }

            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;
                let realAmount = ethers.utils.parseUnits(amount, decims);

                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers.Contract(contractAddress, contractAbi, walletWithSigner);

                contractWithSigner.estimateGas.transfer(toAddress, realAmount).then(gas=>{
                    fulfill(gas);
                })
                .catch(err=>{
                    reject(err);
                });
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function waitForContractTransaction(tx){
    return tx.wait();
}

export function contractTransaction(network, contractAddress, contractAbi, keystore, password, nonce, gasLimit, gasPrice, toAddress, amount, decims, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {

            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }


            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;
                let realAmount = ethers.utils.parseUnits(amount, decims);

                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers.Contract(contractAddress, contractAbi, walletWithSigner);
                
                function realTransfer(){
                    let tx = {
                        nonce: nonce,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice,
                    };

                    contractWithSigner.transfer(toAddress, realAmount, tx).then(res=>{
                        fulfill(res);
                    })
                    .catch(err=>{
                        reject(err);
                    });
                }

                if(gasLimit === 0){
                    contractWithSigner.estimateGas.transfer(toAddress, realAmount).then(gas=>{
                        gasLimit = gas;
                        realTransfer();
                    })
                    .catch(err=>{
                        reject(err);
                    });
                }
                else{
                    realTransfer();
                }
                
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });

}

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
export function getContract(network, contractAddress, contractAbi, network_detail = {name:'', chainId:'',ensAddress:''}){
    try {
        let provider;
        if(network==='' || network===undefined){
            provider = new ethers.providers.getDefaultProvider();
        }
        else{
            if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                provider = new ethers.providers.JsonRpcProvider(network);
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network, network_detail);
            }
        }

        let contract = new ethers.Contract(contractAddress, contractAbi, provider);
        return contract;
    } catch (error) {
        return undefined;
    }
}

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
export function getSignerContract(network, contractAddress, contractAbi, keystore, password, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {    
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }
    
            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;
    
                let walletWithSigner = wallet.connect(provider);
                let contractWithSigner = new ethers.Contract(contractAddress, contractAbi, walletWithSigner);
                fulfill(contractWithSigner);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 
 * @param {string} contractAddress 
 * @param {{}|ethers.ContractInterface} contractAbi 
 * @param {ethers.providers.Provider|ethers.Signer} walletWithSigner 
 * @returns 
 */
export function getSignerContractWithWalletProvider(contractAddress, contractAbi, walletWithSigner){
    let contractWithSigner = new ethers.Contract(contractAddress, contractAbi, walletWithSigner);
    return contractWithSigner;
}

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
export function getWalletSigner(network, keystore, password, network_detail = {name:'', chainId:'',ensAddress:''}){
    return new Promise((fulfill, reject)=>{
        try {    
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                    provider = new ethers.providers.JsonRpcProvider(network);
                }
                else{
                    provider = new ethers.providers.JsonRpcProvider(network, network_detail);
                }
            }
    
            ethers.Wallet.fromEncryptedJson(keystore, password).then(res=>{
                let wallet = res;
    
                let walletWithSigner = wallet.connect(provider);
                fulfill(walletWithSigner);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *
 *
 * @export
 * @param {string} network
 * @param {{name:'', chainId:'',ensAddress:''}|ethers.providers.Networkish} [network_detail={name:'', chainId:'',ensAddress:''}]
 * @return {ethers.providers.Provider|undefined} 
 */
export function getProvider(network, network_detail = {name:'', chainId:'',ensAddress:''}){
    try {
        let provider;
        if(network==='' || network===undefined){
            provider = new ethers.providers.getDefaultProvider();
        }
        else{
            if(JSON.stringify(network_detail)===JSON.stringify({name:'', chainId:'',ensAddress:''})){
                provider = new ethers.providers.JsonRpcProvider(network);
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network, network_detail);
            }
        }

        return provider;
    } catch (error) {
        return undefined;
    }
}

export function bigNumberFormatUnits(value , decims = 18){
    return ethers.utils.formatUnits(value, decims);
}

export function bigNumberParseUnits(value , decims = 18){
    return ethers.utils.parseUnits(value, decims);
}

export function getEventNameID(eventName){
    return ethers.utils.id(eventName);
}

export function hexZeroPad(value, length){
    return ethers.utils.hexZeroPad(value, length);
}

export function hexString(value){
    return ethers.utils.hexValue(value);
}

export function arrayify(value){
    return ethers.utils.arrayify(value);
}

export function hexlify(value){
    return ethers.utils.hexlify(value);
}

export function createBigNumber(value){
    return BigNumber.from(value);
}