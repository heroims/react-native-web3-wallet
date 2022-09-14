# React Native Web3 Wallet
Web3 Wallet in React Native (use ethers.js)
## Welcome

This is a safe web3 wallet tools, to help with develop wallet applications quickly. 

This wallet module does not expose the private key, and only advocates storing the keystore or the mnemonic with the password authentication locally, and does not activate the wallet except for write operations. 

## Installation

```bash
npm install github:heroims/react-native-web3-wallet --save
npm install @ethersproject/shims --save
npm install react-native-get-random-values --save
npx pod-install
```

### fix React Native so slow
```bash
npm install react-native-scrypt
npm install react-native-aes-crypto
```
move `patches` finder to your root directory, and execute command `npx patch-package`


## Usage

### Import

```javascript
import {
  contractTransaction,
  createWallet,
  exportKeystore,
  exportMnemonicFromKeystore,
  exportPrivateKeyFromKeystore,
  exportMnemonic,
  exportKeystoreFromMnemonic,
  exportPrivateKeyFromMnemonic,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  getBalance,
  getContractBalance,
  getContractGasLimit,
  getContractNfts,
  getGasLimit,
  getGasPrice,
  getNonce,
  sendTransaction,
  signTransaction,
  signMessage,
  signTypedData,
  waitForContractTransaction,
  waitForTransaction,
  getContract,
  getSignerContract,
  getWalletSigner,
  getWalletSignerWithMnemonic,
  getWalletSignerWithPrivateKey,
  getSignerContractWithWalletProvider,
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
```


### Wallet

#### Create Wallet

```javascript
//0 BTC    60 ETH
createWallet('password', "m/44'/60'/0'/0/0")
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```
Print Results
```
{
  "keystore": ..., 
  "mnemonic": ...,
  "shuffleMnemonic": ...,
  "privateKey" : ...,//option
  "publicKey" : ...,//option  
}
```
The mnemonic and private keys are not recommended to be stored locally and are only used to verify that the user has made a record.

#### Export keystore
The json object of the keystore is stored locally by default.
```javascript
exportKeystore(JSON.stringify(keystore), 'password')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

exportKeystoreFromMnemonic('password','mnemonic string','address',"m/44'/60'/0'/0/0",'mnemonicPassword')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```
Print Keystore json object
#### Export privateKey
```javascript
exportPrivateKeyFromKeystore(JSON.stringify(keystore), 'password')
  .then(res => {
    console.log('privateKey export', res);
  })
  .catch(err => {
    console.log(err);
  });

exportPrivateKeyFromMnemonic(
  mnemonicString,
  "m/44'/60'/0'/0/0",
)
  .then(res => {
    console.log('privateKey export', res);
  })
  .catch(err => {
    console.log(err);
  });
```
Print privateKey 
#### Export Mnemonic
```javascript
exportMnemonicFromKeystore(JSON.stringify(keystore), 'password')
  .then(res => {
    console.log('mnemonic export', res);
  })
  .catch(err => {
    console.log(err);
  });

exportMnemonic('mnemonic', 'address', "m/44'/60'/0'/0/0", 'password')
  .then(res => {
    console.log('mnemonic export', res);
  })
  .catch(err => {
    console.log(err);
  });
```
Print mnemonic
``` 
{
  mnemonic : mnemonicArr, 
  shuffleMnemonic : shuffleMnemonicArr,     
}
```
#### Import Wallet
```javascript
importKeystore(JSON.stringify(keystore), 'password')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

importMnemonic(
  mnemonicString,
  'password',
)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

importPrivateKey(
  '0x00000000000000000000000000000000000',
  'password',
)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```
Print Results
```
{
  "keystore": ..., 
  "privateKey" : ...,//option
  "publicKey" : ...,//option 
}
```
#### Singer
```javascript
getWalletSigner(
  rpcURL,
  'keystore',
  'password',
)
  .then(walletSigner => {
    console.log('walletSigner', walletSigner);
  })
  .catch(err => {
    console.log(err);
  });

getWalletSignerWithMnemonic(
  rpcURL,
  'mnemonic',
  'address',
  "m/44'/60'/0'/0/0",
  'password',
)
  .then(walletSigner => {
    console.log('walletSigner', walletSigner);
  })
  .catch(err => {
    console.log(err);
  });

getWalletSignerWithPrivateKey(
  rpcURL,
  'privateKey',
)
  .then(walletSigner => {
    console.log('walletSigner', walletSigner);
  })
  .catch(err => {
    console.log(err);
  });

getSignerContractWithWalletProvider(
  contractAddress,
  contractAbi,
  walletSigner,
)
  .then(contractSigner => {
    console.log('contractSigner', contractSigner);
  })
  .catch(err => {
    console.log(err);
  });
```

#### Sign Message
```javascript
signMessage(
  JSON.stringify(keystore),
  'password',
  message,
)
  .then(signedMs => {
    console.log('signedMs', signedMs);
  })
  .catch(err => {
    console.log(err);
  });

```
#### Sign TypedData
```javascript
// All properties on a domain are optional
const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

// The named list of all type definitions
const types = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
    ]
};

// The data to sign
const value = {
    from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
};
signTypedData(
  JSON.stringify(keystore),
  'password',
  domain,
  types,
  value,
)
  .then(signedTx => {
    console.log('signedTx', signedTx);
  })
  .catch(err => {
    console.log(err);
  });
```
#### Sign Transaction
```javascript
signTransaction(
  JSON.stringify(keystore),
  'password',
  nonce,
  gasLimit,
  gasPrice,
  toAddress,
  chainId,
  amount,
  data,
)
  .then(signedTx => {
    console.log('signedTx', signedTx);
  })
  .catch(err => {
    console.log(err);
  });
```
### Provider
#### Get Balance
```javascript
getBalance(
  'https://bsc-dataseed1.binance.org/',
  '0x00000000000000000000000000',
)
  .then(res => {
    console.log(bigNumberFormatUnits(res, 18));
  })
  .catch(err => {
    console.log(err);
  });
```
Print BigNumberish
#### Transcation
```javascript
let data = '0x' +
  Buffer.from('hello world').toString(
    'hex',
  );
let amount = '0.02';
let rpcURL = 'https://ropsten.infura.io/v3/';
let chainId = 3

getGasPrice(rpcURL)
  .then(gasPrice => {
    console.log('gasPrice', gasPrice.toString());
    getGasLimit(
      rpcURL,
      fromAddress,
      toAddress,
      amount,
      data,
    )
      .then(gasLimit => {
        console.log('gasLimit', gasLimit.toString());
        console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

        getNonce(
          rpcURL,
          fromAddress,
        )
          .then(nonce => {
            console.log('nonce', nonce);
            signTransaction(
              JSON.stringify(keystore),
              'password',
              nonce,
              gasLimit,
              gasPrice,
              toAddress,
              chainId,
              amount,
              data,
            )
              .then(signedTx => {
                console.log('signedTx', signedTx);
                sendTransaction(rpcURL, signedTx)
                  .then(resTx => {
                    console.log(resTx);
                    waitForTransaction(
                      rpcURL,
                      resTx.hash,
                    )
                      .then(res => {
                        console.log(res);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```
| Method| return| 
|--|--|
|getGasPrice| BigNumberish|
|getGasLimit|BigNumberish|
|getNonce| number|
|signTransaction| String|
sendTransaction Print 
```
{"chainId": 999, "confirmations": 0, "data": "0x", "from": "0x000000000000000000000", "gasLimit": {"hex": "0x5208", "type": "BigNumber"}, "gasPrice": {"hex": "0x0430e23400", "type": "BigNumber"}, "hash": "0x181ab94b9fe7b032d2fc9f47ce794fd26dfd39f1cdd28cce03ee353f79dd396d", "nonce": 6, "r": "0xc42d9808612967fb25c136f8c4ea352e334124f09eda02a6d81e3154c8411599", "s": "0x436749faf39974940687e53223a776d339f61e48e4b782124964e75e4d843d22", "to": "0x0000000000000000000000000", "type": null, "v": 40360896, "value": {"hex": "0x470de4df820000", "type": "BigNumber"}, "wait": [Function anonymous]}
```
waitForTransaction Print 
```
{"blockHash": "0x35b818367ce9a14917cf9e2423b0d71c8343e78e0210388918b607f7170e3274", "blockNumber": 9243147, "byzantium": true, "confirmations": 1, "contractAddress": null, "cumulativeGasUsed": {"hex": "0x5208", "type": "BigNumber"}, "from": "0x0000000000000000000000000000", "gasUsed": {"hex": "0x5208", "type": "BigNumber"}, "logs": [], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": 1, "to": "0x000000000000000000000000000", "transactionHash": "0x00000000000000000000000000000000000000", "transactionIndex": 1, "type": 0}
```
#### Listen Transaction
``` javascript
let provider = getProvider('https://bsc-dataseed1.binance.org/');
let rxHash =
  '0x0000000000000000000000000000000';
provider.on(rxHash, res => {
  if (res.confirmations > 22) {
    provider.removeAllListeners(rxHash);
  }
});
```
Listen Transaction Print
```
{"to":"0xA27F8f580C01Db0682Ce185209FFb84121a2F711","from":"0xC8B6B589256f79ee6cDefC6034CD5805dDa060B2","contractAddress":null,"transactionIndex":1,"gasUsed":{"type":"BigNumber","hex":"0x5b11"},"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000080000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000001000010000000000000000000000000000000000000000000000000000000000000000080100000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000004000000000000000000000000040000000000000000000000080000000000000000000000000","blockHash":"0xec167635c0616f13936ff26a073c1be355fd9838550780222e14c27fd6b4b5b9","transactionHash":"0x2818970ff2d7e0e35396a7501fd79cab039c6d4ff6058bf6004895556f74a4d0","logs":[{"transactionIndex":1,"blockNumber":9423310,"transactionHash":"0x2818970ff2d7e0e35396a7501fd79cab039c6d4ff6058bf6004895556f74a4d0","address":"0xA27F8f580C01Db0682Ce185209FFb84121a2F711","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000c8b6b589256f79ee6cdefc6034cd5805dda060b2","0x0000000000000000000000006025b091c6ab619f8e2f75170eb69dc57040dc6e"],"data":"0x00000000000000000000000000000000000000000000006c6b935b8bbd400000","logIndex":0,"blockHash":"0xec167635c0616f13936ff26a073c1be355fd9838550780222e14c27fd6b4b5b9"}],"blockNumber":9423310,"confirmations":4063,"cumulativeGasUsed":{"type":"BigNumber","hex":"0x5b11"},"status":1,"type":0,"byzantium":true}
```
### Contract 
#### Get Contract Balance
```javascript
getContractBalance(
  rpcURL,
  contractAddress,
  erc20ABI,
  ownAddress,
)
  .then(res => {
    console.log(bigNumberFormatUnits(res));
  })
  .catch(err => {
    console.log(err);
  });
```
| Method| return| 
|--|--|
|getContractBalance| BigNumberish|
#### Get Contract to Call balanceOf Method
```javascript
let contract = getContract(rpcURL, contractAddress, erc20ABI);
contract.balanceOf(ownAddress)
  .then(res => {
    console.log(bigNumberFormatUnits(res));
  })
  .catch(err => {
    console.log(err);
  });


getSignerContract(
  rpcURL,
  contractAddress,
  erc20ABI,
  JSON.stringify(keystore),
  'password',
)
  .then(contract => {
    contract
      .balanceOf(ownAddress)
      .then(res => {
        console.log(bigNumberFormatUnits(res));
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```

| Method| return| 
|--|--|
|getContract|Contract|
|getSignerContract| Contract|

#### Contract Transcation
```javascript
getGasPrice(rpcURL)
  .then(gasPrice => {
    console.log('gasPrice', gasPrice.toString());
    getNonce(
      rpcURL,
      fromAddress,
    )
      .then(nonce => {
        console.log('nonce', nonce);
        contractTransaction(
          rpcURL,
          contractAddress,
          erc20ABI,
          JSON.stringify(keystore),
          'password',
          nonce,
          gasLimit,
          gasPrice,
          toAddress,
          amount,
          contractDecmis,
        )
          .then(tx => {
            console.log(tx);
            waitForContractTransaction(tx)
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```
contractTransaction Print 
```
{"chainId": 20180430, "confirmations": 0, "data": "0xa9059cbb0000000000000000000000006025b091c6ab619f8e2f75170eb69dc57040dc6e0000000000000000000000000000000000000000000000000de0b6b3a7640000", "from": "0x000000000000000000000000", "gasLimit": {"hex": "0x9569", "type": "BigNumber"}, "gasPrice": {"hex": "0x0430e23400", "type": "BigNumber"}, "hash": "0xce39d74dac6606ffa8e74a7987dd4f9c5b268884fd72527ae386d5886868700d", "nonce": 7, "r": "0x07842ad39d3136e4729e5faeed002a7868782b7d0330222db82c427af18dda5e", "s": "0x1f83d27c87db5fa250ee81ea7092c0220bedd46056316d929e3f5403ab9d600e", "to": "0x00000000000000000000", "type": null, "v": 40360896, "value": {"hex": "0x00", "type": "BigNumber"}, "wait": [Function anonymous]}
```
waitForContractTransaction Print
```
{"blockHash": "0x43498f57fbbd0ff6b6150a590e495e6f067de47c9ae837cd876c2600deb46e48", "blockNumber": 9243425, "byzantium": true, "confirmations": 1, "contractAddress": null, "cumulativeGasUsed": {"hex": "0x9569", "type": "BigNumber"}, "events": [{"address": "0xA27F8f580C01Db0682Ce185209FFb84121a2F711", "args": [Array], "blockHash": "0x43498f57fbbd0ff6b6150a590e495e6f067de47c9ae837cd876c2600deb46e48", "blockNumber": 9243425, "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", "decode": [Function anonymous], "event": "Transfer", "eventSignature": "Transfer(address,address,uint256)", "getBlock": [Function anonymous], "getTransaction": [Function anonymous], "getTransactionReceipt": [Function anonymous], "logIndex": 0, "removeListener": [Function anonymous], "topics": [Array], "transactionHash": "0xce39d74dac6606ffa8e74a7987dd4f9c5b268884fd72527ae386d5886868700d", "transactionIndex": 1}], "from": "0x0000000000000000000", "gasUsed": {"hex": "0x9569", "type": "BigNumber"}, "logs": [{"address": "0xA27F8f580C01Db0682Ce185209FFb84121a2F711", "blockHash": "0x43498f57fbbd0ff6b6150a590e495e6f067de47c9ae837cd876c2600deb46e48", "blockNumber": 9243425, "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", "logIndex": 0, "topics": [Array], "transactionHash": "0xce39d74dac6606ffa8e74a7987dd4f9c5b268884fd72527ae386d5886868700d", "transactionIndex": 1}], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000010000000000000000002000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000200000000000000002000000000000000000000000000000000000000000404000000000000000000000000040000000000000000000000080000000000000000000000000", "status": 1, "to": "0x00000000000000000000000", "transactionHash": "0xce39d74dac6606ffa8e74a7987dd4f9c5b268884fd72527ae386d5886868700d", "transactionIndex": 1, "type": 0}
```
#### Get Contract to Call transaction Method
```javascript
getSignerContract(
  rpcURL,
  contractAddress,
  erc20ABI,
  JSON.stringify(keystore),
  'password',
)
  .then(contract => {
    let realAmount = bigNumberParseUnits(amount);

    contract.estimateGas
    .transfer(toAddress, realAmount)
    .then(gasLimit => {
      let tx = {
        nonce: nonce,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      };

      contract
      .transfer(toAddress, realAmount, tx)
      .then(res => {
        fulfill(res);
      })
      .catch(err => {
        reject(err);
      });
    })
    .catch(err => {
      reject(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
```
#### Listen Contract Transcation
```javascript
let contract = getContract(
  rpcURL,
  contractAddress,
  erc20ABI,
);
let filterTo = contract.filters.Transfer(
  null,
  ownAddress,
);
contract.on(filterTo, (from, to, amount, event) => {
  console.log(bigNumberFormatUnits(amount));
  event.getTransactionReceipt(event.transactionHash).then(console.log);
  event.getBlock(event.blockNumber).then(res => {
    let date = new Date(res.timestamp * 1000);
    console.log(date);
  });
  contract.provider.on(event.transactionHash, res => {
    console.log(JSON.stringify(res));
    if (res.confirmations > 21) {
      contract.provider.removeAllListeners(event.transactionHash);
    }
  });
});
```
event Print
```
{"address": "0xA27F8f580C01Db0682Ce185209FFb84121a2F711", "args": ["0x6025B091C6AB619F8e2F75170EB69dc57040dc6e", "0xaEE480Af938234865e4719119c29188eF4053e38", [Object]], "blockHash": "0x8747bb4712910057daea326c0d2baef80dc198be0df2d18e8f0777ba78db8925", "blockNumber": 9429388, "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", "decode": [Function anonymous], "event": "Transfer", "eventSignature": "Transfer(address,address,uint256)", "getBlock": [Function anonymous], "getTransaction": [Function anonymous], "getTransactionReceipt": [Function anonymous], "logIndex": 0, "removeListener": [Function anonymous], "removed": false, "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x0000000000000000000000006025b091c6ab619f8e2f75170eb69dc57040dc6e", "0x000000000000000000000000aee480af938234865e4719119c29188ef4053e38"], "transactionHash": "0xc6765aa805ed8c5d846f2f70dc7344348a8b7c44d537ef92eee89e57fff1a1b3", "transactionIndex": 1}
```
getTransactionReceipt Print
```
{"blockHash": "0xfa7a938b5f9908ac1a06ed11ed2bd346ba963916ab6740f0d198cdbfeba8aee6", "blockNumber": 9429342, "byzantium": true, "confirmations": 1, "contractAddress": null, "cumulativeGasUsed": {"hex": "0xd001", "type": "BigNumber"}, "from": "0x6025B091C6AB619F8e2F75170EB69dc57040dc6e", "gasUsed": {"hex": "0xd001", "type": "BigNumber"}, "logs": [{"address": "0xA27F8f580C01Db0682Ce185209FFb84121a2F711", "blockHash": "0xfa7a938b5f9908ac1a06ed11ed2bd346ba963916ab6740f0d198cdbfeba8aee6", "blockNumber": 9429342, "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", "logIndex": 0, "topics": [Array], "transactionHash": "0xef37fa6f7ce519f2d0564b31cb31991d2b951df67b0aad01c473fd1ee705e37e", "transactionIndex": 1}], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000002000000080000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000010000000000000000000080000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000004000000000000000000000000040000000000000000000000080000000000000000000000000", "status": 1, "to": "0xA27F8f580C01Db0682Ce185209FFb84121a2F711", "transactionHash": "0xef37fa6f7ce519f2d0564b31cb31991d2b951df67b0aad01c473fd1ee705e37e", "transactionIndex": 1, "type": 0}
```
getBlock Print
```
{"_difficulty": {"hex": "0x06", "type": "BigNumber"}, "difficulty": 6, "extraData": "0x29afa5018b3d9a5099d0ab5077c5ab321b50b802ddc4e9ca6c5e28915ce1afea6e4f857dfbef3a036e8625006c745a8613399329c418a67e3e3e16ef9e5f39c5ecadd80fc33501ef78155cfe9fbf481ed2b385fde38ec13b2d61d5fa14ec059f04c4aece002d81e8327380a1d8f253cf2a1a108293169cde61f1d129e07bcc0ecf05cdef9a4ab1eed385e211905ec9477630cd6b07827485263f75a11bbbf1b23dcfd1a5980ca5f12d803850a5b12f5f074b2cdfffeee323fc30c6e2b3bdecc15c599b368f3625fe58a99e14eeab533714e577159a3a78ff7750d2ddcca9db7e7100", "gasLimit": {"hex": "0x02625a00", "type": "BigNumber"}, "gasUsed": {"hex": "0x9569", "type": "BigNumber"}, "hash": "0x8747bb4712910057daea326c0d2baef80dc198be0df2d18e8f0777ba78db8925", "miner": "0xaCfa98C108D540a5b04Ca3a11B5073C3D6F0b812", "nonce": "0x0000000000000000", "number": 9429388, "parentHash": "0xd133b174187c07aa5a8b92063f6e9994cdb231ba394afaec9c9280b866293392", "timestamp": 1657903483, "transactions": ["0xc6765aa805ed8c5d846f2f70dc7344348a8b7c44d537ef92eee89e57fff1a1b3"]}
```

#### Get Contract Nfts tokenIds
```javascript
getContractNfts(
  rpcURL,
  contractAddress,
  erc721ABI,
  ownAddress,
)
  .then(nfts => {
    console.log(nfts);
  })
  .catch(err => {
    console.log(err);
  });
```
### Get Contract to call nftInfos
```javascript
async function getNFTInfos(ownAddress = undefined, page = 0, limit = 0) {
  const contract = getContract(
    rpcURL,
    contractAddress,
    ERC721EnumerableAbi,
  );
  var nftCount;
  if (ownAddress === undefined) {
    nftCount = await contract.totalSupply();
  } else {
    nftCount = await contract.balanceOf(ownAddress);
  }

  let token_idxs = [...Array(nftCount.toNumber()).keys()];

  if (limit === 0) {
    limit = token_idxs.length;
  }
  let lastPage = Math.ceil(token_idxs / limit);
  if (page >= 0 && page < lastPage) {
    token_idxs = token_idxs.slice(page * limit, page * limit + limit);
  }
  let nftInfos = [];

  for await (const idx of token_idxs) {
    var token_id;
    if (ownAddress === undefined) {
      token_id = (await contract.tokenByIndex(idx)).toNumber();
    } else {
      token_id = (await contract.tokenOfOwnerByIndex(ownAddress, idx)).toNumber();
    }

    let token_uri = await contract.tokenURI(token_id);

    let nftInfo = {
      id: token_id,
      uri: token_uri,
    };

    if (ownAddress === undefined) {
      let ownerOf = await contract.ownerOf(token_id);
      nftInfo.ownerOf = ownerOf;
    }
    nftInfos.push(nftInfo);
  }
  return nftInfos;
}
```
