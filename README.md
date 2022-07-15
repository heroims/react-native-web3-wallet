# React Native Web3 Wallet
Web3 Wallet in React Native (use ethers.js)
## Welcome

This is a safe web3 wallet tools, to help with develop wallet applications quickly. 

This wallet module does not expose the private key, and only advocates storing the keystore locally, and does not activate the wallet except for write operations. 

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
  exportPrivateKeyFromKeystore,
  exportPrivateKeyFromMnemonic,
  bigNumberFormatUnits,
  bigNumberParseUnits,
  getBalance,
  getContractBalance,
  getContractGasLimit,
  getContractNfts,
  getGasLimit,
  getGasPrice,
  getNonce,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  sendTransaction,
  signTransaction,
  waitForContractTransaction,
  waitForTransaction,
  getContract,
  getSignerContract,
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
    network,
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
