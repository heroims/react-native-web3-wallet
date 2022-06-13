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
                fulfill({
                    mnemonic : mnemonic, 
                    keystore :JSON.parse(res)
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

            let provider = new ethers.providers.JsonRpcProvider(network);
           
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

            let provider = new ethers.providers.JsonRpcProvider(network);

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

export function importMnemonic(mnemonic, password){
    return new Promise((fulfill, reject)=>{
        try {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic);
            wallet.encrypt(password).then(res=>{
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