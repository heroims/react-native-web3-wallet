import './ethers_shim'
import {HDNodeWallet, ethers} from 'ethers';

type WalletResponse = {
  mnemonic: Array<string>;
  shuffleMnemonic: Array<string>;
  address: string;
  publicKey?: string;
  privateKey?: string;
  keystore?: any;
};

export function createWallet(
  password: string,
  path: string = "m/44'/60'/0'/0/0",
  seedByte: number = 16,
  needPrivateKey: boolean = false,
  needPublicKey: boolean = false,
  needKeystore: boolean = true,
  mnemonicPassword: string = '',
): Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    try {
      let start = performance.now();

      //16-12words 20-15words 24-18words 28-21words 32-24words
      let privateSeed = ethers.randomBytes(seedByte);
      var end = performance.now();
      console.log(`privateSeed ${end - start}ms`, privateSeed);
      start = performance.now();

      //2048 words
      let mnemonic = ethers.Mnemonic.entropyToPhrase(privateSeed);
      end = performance.now();
      console.log(`mnemonic ${end - start}ms`, mnemonic);
      start = performance.now();

      mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';

      let hdnode = ethers.HDNodeWallet.fromPhrase(
        mnemonic,
        mnemonicPassword,
        path,
      );
      end = performance.now();
      console.log(`hdnode ${end - start}ms`, hdnode);
      start = performance.now();

      let mnemonicArr = mnemonic.split(' ');
      let shuffleMnemonicArr = shuffleArray(mnemonicArr);
      let response: WalletResponse = {
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
      } else {
        fulfill(response);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function exportPrivateKeyFromMnemonic(
  mnemonic: string,
  path: string = "m/44'/60'/0'/0/0",
  password: string = '',
): Promise<string> {
  return new Promise((fulfill, reject) => {
    try {
      password = password ? password : '';
      let hdnode = ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);
      fulfill(hdnode.privateKey);
    } catch (error) {
      reject(error);
    }
  });
}

export function exportPrivateKeyFromKeystore(
  keystore: string,
  password: string,
): Promise<string> {
  return new Promise((fulfill, reject) => {
    ethers.Wallet.fromEncryptedJson(keystore, password)
      .then(res => {
        fulfill(res.privateKey);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function exportMnemonicFromKeystore(keystore: string, password: string): Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    ethers.Wallet.fromEncryptedJson(keystore, password)
      .then(res => {
        let hdnode = res as HDNodeWallet;
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

export function exportMnemonic(
  mnemonic: string,
  address: string,
  path = "m/44'/60'/0'/0/0",
  password = '',
): Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    password = password ? password : '';
    let hdnode = ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);
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
    } else {
      reject('password is wrong');
    }
  });
}

export function exportKeystore(keystore: string, password: string): Promise<string> {
  return new Promise((fulfill, reject) => {
    ethers.Wallet.fromEncryptedJson(keystore, password)
      .then(() => {
        fulfill(keystore);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function exportKeystoreFromMnemonic(
  password: string,
  mnemonic: string,
  address: string,
  path = "m/44'/60'/0'/0/0",
  mnemonicPassword = '',
): Promise<string> {
  return new Promise((fulfill, reject) => {
    mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';
    let hdnode = ethers.HDNodeWallet.fromPhrase(
      mnemonic,
      mnemonicPassword,
      path,
    );
    if (address.toLowerCase() === hdnode.address.toLowerCase()) {
      hdnode
        .encrypt(password)
        .then(res => {
          fulfill(res);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      reject('password is wrong');
    }
  });
}

export function importPrivateKey(
  privateKey: string,
  password: string,
  needPrivateKey = false,
  needPublicKey = false,
): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>> {
  return new Promise((fulfill, reject) => {
    try {
      let realPrivatekey = privateKey;
      if (privateKey.substring(0, 2) !== '0x') {
        realPrivatekey = '0x' + privateKey;
      }

      let wallet = new ethers.Wallet(realPrivatekey);
      wallet
        .encrypt(password)
        .then(res => {
          let jsonObj = JSON.parse(res);

          let response: Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'> = {
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
    } catch (error) {
      reject(error);
    }
  });
}

export function importMnemonic(
  mnemonic: string,
  password: string,
  path = "m/44'/60'/0'/0/0",
  needPrivateKey = false,
  needPublicKey = false,
  needKeystore = true,
  mnemonicPassword = '',
): Promise<WalletResponse>  {
  return new Promise((fulfill, reject) => {
    try {
      mnemonicPassword = mnemonicPassword ? mnemonicPassword : '';
      let hdnode = ethers.HDNodeWallet.fromPhrase(
        mnemonic,
        mnemonicPassword,
        path,
      );
      let mnemonicArr = mnemonic.split(' ');
      let shuffleMnemonicArr = shuffleArray(mnemonicArr);
      let response: WalletResponse = {
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
      } else {
        fulfill(response);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function importKeystore(
  keystore: string,
  password: string,
  needPrivateKey = false,
  needPublicKey = false,
):Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    ethers.Wallet.fromEncryptedJson(keystore, password)
      .then(res => {
        let response: WalletResponse = {
          address: res.address,
          keystore: keystore,
          mnemonic: [],
          shuffleMnemonic: []
        };
        if (needPublicKey) {
          response.publicKey = (res as HDNodeWallet).publicKey;
        }
        if (needPrivateKey) {
          response.privateKey = res.privateKey;
        }
        let mnemonic = (res as HDNodeWallet).mnemonic;
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

export function getBalance(
  network: string | ethers.FetchRequest,
  address: string,
  network_detail: ethers.Networkish = {name: '', chainId: 1, ensAddress: ''},
):Promise<bigint> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
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
    } catch (error) {
      reject(error);
    }
  });
}

export function getContractNfts(
  network: string | ethers.FetchRequest,
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  address: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<Set<string>> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }

      let contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider,
      );

      contract
        .queryFilter(contract.filters.Transfer(address, null))
        .then(sentLogs => {
          contract
            .queryFilter(contract.filters.Transfer(null, address))
            .then(receivedLogs => {
              const logs = sentLogs
                .concat(receivedLogs)
                .sort(
                  (a, b) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
                );

              const owned: Set<string> = new Set();

              function addressEqual(arg1: string, arg2: string) {
                return (
                  arg1.replace('0x', '').toLowerCase() ===
                  arg2.replace('0x', '').toLowerCase()
                );
              }
              for (const log of logs) {
                const {from, to, tokenId} = (log as ethers.EventLog).args;
                if (addressEqual(to, address)) {
                  owned.add(tokenId.toString());
                } else if (addressEqual(from, address)) {
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
    } catch (error) {
      reject(error);
    }
  });
}

export function getGasPrice(
  network: string | ethers.FetchRequest,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
):Promise<ethers.FeeData> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
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
    } catch (error) {
      reject(error);
    }
  });
}

export function getGasLimit(
  network: string | ethers.FetchRequest,
  fromAddress: string,
  toAddress: string,
  amount: string,
  data: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<bigint> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }
      let realAmount = ethers.parseEther(amount);

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
    } catch (error) {
      reject(error);
    }
  });
}

export function getNonce(
  network: string | ethers.FetchRequest,
  address: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
  blockTag = 'pending',
): Promise<number> {
  return new Promise((fulfill, reject) => {
    let provider: ethers.Provider;
    if (network === '' || network === undefined) {
      provider = ethers.getDefaultProvider('homestead');
    } else {
      if (
        JSON.stringify(network_detail) ===
        JSON.stringify({name: '', chainId: 1, ensAddress: ''})
      ) {
        provider = new ethers.JsonRpcProvider(network);
      } else {
        provider = new ethers.JsonRpcProvider(network, network_detail);
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

export function waitForTransaction(
  network: string | ethers.FetchRequest,
  transactionHash: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<ethers.TransactionReceipt|null> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
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
    } catch (error) {
      reject(error);
    }
  });
}

export function sendTransaction(
  network: string | ethers.FetchRequest,
  signedTransaction: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<ethers.TransactionResponse> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
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
    } catch (error) {
      reject(error);
    }
  });
}

export function signTransaction(
  keystore: string,
  password: string,
  nonce: number,
  gasLimit: ethers.BigNumberish,
  gasPrice: ethers.BigNumberish,
  toAddress: string,
  chainId: number,
  amount: string,
  data: string,
): Promise<string> {
  return new Promise((fulfill, reject) => {
    try {
      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then(res => {
          let wallet = res;
          let realAmount = ethers.parseEther(amount);

          let tx: ethers.TransactionRequest = {
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
    } catch (error) {
      reject(error);
    }
  });
}

export function signMessage(
  keystore: string,
  password: string,
  message: string,
): Promise<string> {
  return new Promise((fulfill, reject) => {
    try {
      ethers.Wallet.fromEncryptedJson(keystore, password)
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
    } catch (error) {
      reject(error);
    }
  });
}

export function signTypedData(
  keystore: string,
  password: string,
  domain: ethers.TypedDataDomain,
  types: Record<string, ethers.TypedDataField[]>,
  value: Record<string, any>,
): Promise<string> {
  return new Promise((fulfill, reject) => {
    try {
      ethers.Wallet.fromEncryptedJson(keystore, password)
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
    } catch (error) {
      reject(error);
    }
  });
}

export function getContractGasLimit(
  network: string | ethers.FetchRequest,
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  keystore: string,
  password: string,
  toAddress: string,
  amount: string,
  decims: number,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<bigint> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }

      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then(res => {
          let wallet = res;
          let realAmount = ethers.parseUnits(amount, decims);

          let walletWithSigner = wallet.connect(provider);
          let contractWithSigner = new ethers.Contract(
            contractAddress,
            contractAbi,
            walletWithSigner,
          );

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
    } catch (error) {
      reject(error);
    }
  });
}

export function waitForContractTransaction(tx: ethers.TransactionResponse): Promise<ethers.TransactionReceipt|null> {
  return tx.wait();
}

export function contractTransaction(
  network: string | ethers.FetchRequest,
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  keystore: string,
  password: string,
  nonce: number,
  gasLimit: ethers.BigNumberish,
  gasPrice: ethers.BigNumberish,
  toAddress: string,
  amount: string,
  decims: number,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<ethers.TransactionResponse> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }

      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then(res => {
          let wallet = res;
          let realAmount = ethers.parseUnits(amount, decims);

          let walletWithSigner = wallet.connect(provider);
          let contractWithSigner = new ethers.Contract(
            contractAddress,
            contractAbi,
            walletWithSigner,
          );

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
          } else {
            realTransfer();
          }
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function getContract(
  network: string | ethers.FetchRequest,
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): ethers.Contract | null {
  try {
    let provider: ethers.Provider;
    if (network === '' || network === undefined) {
      provider = ethers.getDefaultProvider('homestead');
    } else {
      if (
        JSON.stringify(network_detail) ===
        JSON.stringify({name: '', chainId: 1, ensAddress: ''})
      ) {
        provider = new ethers.JsonRpcProvider(network);
      } else {
        provider = new ethers.JsonRpcProvider(network, network_detail);
      }
    }

    let contract = new ethers.Contract(contractAddress, contractAbi, provider);
    return contract;
  } catch (error) {
    return null;
  }
}

export function getSignerContract(
  network: string | ethers.FetchRequest,
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  keystore: string,
  password: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
):Promise<ethers.Contract> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }

      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then(res => {
          let wallet = res;

          let walletWithSigner = wallet.connect(provider);
          let contractWithSigner = new ethers.Contract(
            contractAddress,
            contractAbi,
            walletWithSigner,
          );
          fulfill(contractWithSigner);
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function getSignerContractWithWalletProvider(
  contractAddress: string,
  contractAbi: ethers.InterfaceAbi,
  walletWithSigner: ethers.ContractRunner,
): ethers.Contract {
  let contractWithSigner = new ethers.Contract(
    contractAddress,
    contractAbi,
    walletWithSigner,
  );
  return contractWithSigner;
}

export function getWalletSigner(
  network: string | ethers.FetchRequest,
  keystore: string,
  password: string,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<ethers.Wallet | HDNodeWallet> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }

      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then(res => {
          let wallet = res;

          let walletWithSigner = wallet.connect(provider);
          fulfill(walletWithSigner);
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function getWalletSignerWithMnemonic(
  network: string | ethers.FetchRequest,
  mnemonic: string,
  address = '',
  path = "m/44'/60'/0'/0/0",
  password = '',
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<HDNodeWallet> {
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.Provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }
      password = password ? password : '';
      let hdnode = ethers.HDNodeWallet.fromPhrase(mnemonic, password, path);

      let passwordError = false;
      if (address) {
        if (address.toLowerCase() !== hdnode.address.toLowerCase()) {
          passwordError = true;
        }
      }

      if (!passwordError) {
        let walletWithSigner = hdnode.connect(provider);
        fulfill(walletWithSigner);
      } else {
        reject('password is wrong');
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getWalletSignerWithPrivateKey(
  network: string | ethers.FetchRequest,
  privateKey: string,
  address = '',
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): Promise<ethers.Wallet> {
  return new Promise((fulfill, reject) => {
    try {
      let provider;
      if (network === '' || network === undefined) {
        provider = ethers.getDefaultProvider('homestead');
      } else {
        if (
          JSON.stringify(network_detail) ===
          JSON.stringify({name: '', chainId: 1, ensAddress: ''})
        ) {
          provider = new ethers.JsonRpcProvider(network);
        } else {
          provider = new ethers.JsonRpcProvider(network, network_detail);
        }
      }
      let wallet = new ethers.Wallet(privateKey);
      let passwordError = false;
      if (address) {
        if (address.toLowerCase() !== wallet.address.toLowerCase()) {
          passwordError = true;
        }
      }

      if (!passwordError) {
        let walletWithSigner = wallet.connect(provider);
        fulfill(walletWithSigner);
      } else {
        reject('password is wrong');
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getProvider(
  network: string | ethers.FetchRequest,
  network_detail = {name: '', chainId: 1, ensAddress: ''},
): ethers.Provider | null {
  try {
    let provider: ethers.Provider;
    if (network === '' || network === undefined) {
      provider = ethers.getDefaultProvider('homestead');
    } else {
      if (
        JSON.stringify(network_detail) ===
        JSON.stringify({name: '', chainId: 1, ensAddress: ''})
      ) {
        provider = new ethers.JsonRpcProvider(network);
      } else {
        provider = new ethers.JsonRpcProvider(network, network_detail);
      }
    }

    return provider;
  } catch (error) {
    return null;
  }
}

export function shuffleArray(origin: Array<any>): Array<any> {
  let array = origin.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  return array;
}

export function bigNumberFormatUnits(value: ethers.BigNumberish, decims: string|ethers.Numeric = 18): string {
  return ethers.formatUnits(value, decims);
}

export function bigNumberParseUnits(value: string, decims: string|ethers.Numeric = 18): bigint {
  return ethers.parseUnits(value, decims);
}

export function getEventNameID(eventName: string): string {
  return ethers.id(eventName);
}

export function hexZeroPad(value: ethers.BytesLike, length: number): string {
  return ethers.zeroPadValue(value, length);
}

export function hexString(value: ethers.BytesLike | ethers.BigNumberish): string {
  return ethers.toQuantity(value);
}

export function arrayify(value: ethers.BytesLike, name?: string|undefined): Uint8Array {
  return ethers.getBytes(value, name);
}

export function hexlify(value: ethers.BigNumberish, _width?: ethers.Numeric|undefined): string {
  return ethers.toBeHex(value, _width);
}

export function encodeABI(types: [], values: []): string {
  return ethers.AbiCoder.defaultAbiCoder().encode(types, values);
}

export function decodeABI(types: [], data: ethers.BytesLike): ethers.Result {
  return ethers.AbiCoder.defaultAbiCoder().decode(types, data);
}

export function createBigNumber(value: string): bigint {
  return BigInt(value);
}