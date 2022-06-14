// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";

export function createWallet(password, path){
    return new Promise((fulfill, reject)=>{
        try {
            console.log('create begin');

            var start = performance.now();
        
            let privateSeed = ethers.utils.randomBytes(16);
            //2048 words
            let mnemonic = ethers.utils.entropyToMnemonic(privateSeed);
    
            var end = performance.now();
            console.log('mnemonic done', `${end - start}ms\n`);
        
            let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        
            end = performance.now();
            console.log('wallet init', `${end - start}ms\n`);
        
            wallet.encrypt(password).then(res=>{
                end = performance.now();
                let jsonObj = JSON.parse(res);
                delete jsonObj['x-ethers'];
                fulfill({
                    mnemonic : mnemonic, 
                    keystore : jsonObj
                })
                console.log(`${end - start}ms\n`,res);
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
            
            provider.getBalance(address).then(res=>{
                let balance = ethers.utils.formatUnits(res);
    
                end = performance.now();
                console.log('balance', balance, `${end - start}ms\n`);
                fulfill(balance);
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
            
            end = performance.now();
            console.log('contract init', `${end - start}ms\n`);

            contract.balanceOf(address).then(res=>{
                let balance = ethers.utils.formatUnits(res);

                end = performance.now();
                console.log('contract balance', balance, `${end - start}ms\n`);
                fulfill(balance);
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

export function importPrivateKey(privateKey, password){
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
                fulfill(jsonObj);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
        
    });
}

export function importMnemonic(mnemonic, password){
    return new Promise((fulfill, reject)=>{
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic);
            wallet.encrypt(password).then(res=>{
                let jsonObj = JSON.parse(res);
                delete jsonObj['x-ethers'];
                fulfill(jsonObj);
            })
            .catch(err=>{
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function importKeystore(keystore, password){
    return new Promise((fulfill, reject)=>{
        ethers.Wallet.fromEncryptedJson(keystore,password)
        .then(res=>{
            fulfill(keystore);
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

export function formatBignumber(value){
    return ethers.utils.formatUnits(value);
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