// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";

//Fisher–Yates shuffle
Array.prototype.shuffle = function () {
    var array = this;
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
            let shuffleMnemonicArr = mnemonicArr.slice().shuffle();

            wallet.encrypt(password).then(res=>{
                end = performance.now();
                let jsonObj = JSON.parse(res);
                delete jsonObj['x-ethers'];
                
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

export function getBalance(network, address){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getContractBalance(network, contractAddress, contractAbi, address){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getContractNfts(network, contractAddress, contractAbi, address){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function importPrivateKey(privateKey, password, needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        try {
            var realPrivatekey = privateKey;
            if(privateKey.substring(0,2) !== '0x'){
                realPrivatekey = '0x' + privateKey;
            }
            console.log('privatekey', realPrivatekey)
            let wallet = new ethers.Wallet(realPrivatekey);
            wallet.encrypt(password).then(res=>{
                let jsonObj = JSON.parse(res);
                delete jsonObj['x-ethers'];

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

export function importMnemonic(mnemonic, password, path = "m/44'/60'/0'/0/0", needPrivateKey = false, needPublicKey = false){
    return new Promise((fulfill, reject)=>{
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
            wallet.encrypt(password).then(res=>{
                let jsonObj = JSON.parse(res);
                delete jsonObj['x-ethers'];

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

export function getGasPrice(network){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getGasLimit(network, fromAddress, toAddress, amount, data){
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

export function bigNumberFormatUnits(value , decims = 18){
    return ethers.utils.formatUnits(value, decims);
}

export function bigNumberParseUnits(value , decims = 18){
    return ethers.utils.parseUnits(value, decims);
}

export function getNonce(network, address, blockTag = 'pending'){
    return new Promise((fulfill, reject)=>{
        let provider;
        if(network==='' || network===undefined){
            provider = new ethers.providers.getDefaultProvider();
        }
        else{
            provider = new ethers.providers.JsonRpcProvider(network);
        }
        
        provider.getTransactionCount(address, blockTag).then(nonce=>{
            fulfill(nonce);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

export function waitForTransaction(network, transactionHash){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function sendTransaction(network, signedTransaction){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getContractGasLimit(network, contractAddress, contractAbi, keystore, password, toAddress, amount, decims){
    return new Promise((fulfill, reject)=>{
        try {
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function contractTransaction(network, contractAddress, contractAbi, keystore, password, nonce, gasLimit, gasPrice, toAddress, amount, decims){
    return new Promise((fulfill, reject)=>{
        try {

            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getContract(network, contractAddress, contractAbi){
    try {
        var start = performance.now();

        let provider;
        if(network==='' || network===undefined){
            provider = new ethers.providers.getDefaultProvider();
        }
        else{
            provider = new ethers.providers.JsonRpcProvider(network);
        }

        end = performance.now();
        console.log('provider init', `${end - start}ms\n`);

        let contract = new ethers.Contract(contractAddress, contractAbi, provider);
        return contract;
    } catch (error) {
        return undefined;
    }
}

export function getSignerContract(network, contractAddress, contractAbi, keystore, password){
    return new Promise((fulfill, reject)=>{
        try {    
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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

export function getSignerContractWithWallet(contractAddress, contractAbi, walletWithSigner){
    let contractWithSigner = new ethers.Contract(contractAddress, contractAbi, walletWithSigner);
    return contractWithSigner;
}

export function getWalletSigner(network, keystore, password){
    return new Promise((fulfill, reject)=>{
        try {    
            let provider;
            if(network==='' || network===undefined){
                provider = new ethers.providers.getDefaultProvider();
            }
            else{
                provider = new ethers.providers.JsonRpcProvider(network);
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