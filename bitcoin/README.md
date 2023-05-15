# React Native Web3 Wallet
Web3 Wallet in React Native (use bitcoinjs-lib)
## Welcome

This is a safe web3 wallet tools, to help with develop wallet applications quickly. 

## Installation

```bash
npm install react-native-web3-wallet-bitcoin --save
npm install rn-nodeify  --save
```
`npm install`(at this point the `postinstall` does `rn-nodeify --install buffer,stream,assert,events,crypto,vm,process --hack`)
`npx pod-install`


## Usage

### Import

```javascript
import {
  bitcoin_lib,
  createWallet,
  importMnemonic,
  importWIF,
  importXpriv,
  getBitcoinNodeFromMnemonic,
  getBitcoinNodeFromWIF,
  getBitcoinNodeFromXpriv,
  getBitcoinAddress,
  createPayment,
  getInputData,
  toPaddedHexString,
} from '@react-native-web3-wallet/bitcoin';
```


### Wallet

#### Create Wallet

```javascript
/**
 * 
 * 0 BTC 
 * 
 * Legacy            "m/44'/0'/0'/0/0"
 * Change            "m/44'/0'/0'/1/0"
 * SegwitCompatible  "m/49'/0'/0'/0/0"
 * SegwitNative      "m/84'/0'/0'/0/0"
 * Taproot           "m/86'/0'/0'/0/0"
 *
 * */  
createWallet('password', "m/44'/0'/0'/0/0")
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
  "address": ..., 
  "mnemonic": ...,
  "shuffleMnemonic": ...,
  "privateKey" : ...,//option
  "publicKey" : ...,//option  
  "WIF" : ...,//option  
  "xpriv" : ...,//option 
  "xpub" : ...,//option
}
```

#### Get Bitcoin Node
```javascript
getBitcoinNodeFromMnemonic('mnemonic', 'password', "m/44'/0'/0'/0/0")

getBitcoinNodeFromWIF('wif')

getBitcoinNodeFromXpriv('xpriv')
```

#### Get Address

```javascript
console.log(
  'Legacy',
  getBitcoinAddress(node.publicKey, bitcoin.networks.bitcoin, 44),
);

console.log(
  'SegwitCompatible',
  getBitcoinAddress(node.publicKey, bitcoin.networks.bitcoin, 49),
);

console.log(
  'SegwitNative',
  getBitcoinAddress(node.publicKey, bitcoin.networks.bitcoin, 84),
);

```
Print Address string
#### Transcation
Rough logic reference [bitcoinjs](https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/transactions.spec.ts)

``` javascript
const feeValue = 5000; //Please calculate by yourself

const amount = 0.01;
const amountSatoshis = amount * 1e8;

const changeAddress = walletAddress;

const keyPair = getBitcoinNodeFromWIF(
  ownerWIF,
  bitcoin_lib.networks.testnet,
);
const psbt = new bitcoin_lib.Psbt({
  network: bitcoin_lib.networks.testnet,
});
fetch(
  `https://api.blockcypher.com/v1/btc/${chainName}/addrs/${walletAddress}?includeScript=true&token=${blockcypherToken}`,
)
  .then(response => response.json())
  .then(async data => {
    console.log(data);
    const utxos = data.txrefs;
    let use_utxos_values = 0;
    for (let index = 0; index < utxos.length; index++) {
      const utxo = utxos[index];
      use_utxos_values += utxo.value;
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/${chainName}/txs/${utxo.tx_hash}/?includeHex=true&token=${blockcypherToken}`,
      );
      const txs = await response.json();
      const inputData = getInputData(
        utxo.tx_hash,
        utxo.tx_output_n,
        false,
        {
          script: utxo.script,
          value: utxo.value,
          txHex: txs.hex,
        },
      );
      // const inputData = getInputData(
      //   utxo.tx_hash,
      //   utxo.tx_output_n,
      //   true,
      //   {script: utxo.script, value: utxo.value},
      // );
      psbt.addInput(inputData);
      if (use_utxos_values > amountSatoshis + feeValue) {
        break;
      }
    }
    psbt.addOutput({
      address: targetAddress,
      value: amountSatoshis,
    });
    psbt.addOutput({
      address: changeAddress,
      value: use_utxos_values - amountSatoshis,
    });

    psbt.data.inputs.forEach((value, index) => {
      psbt.signInput(index, keyPair);
    });

    psbt.finalizeAllInputs();
    const txHex = psbt.extractTransaction().toHex();
    console.log('txHex', txHex);
    fetch(
      `https://api.blockcypher.com/v1/btc/${chainName}/txs/push?token=${blockcypherToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: txHex,
        }),
      },
    )
      .then(response => response.json())
      .then(txData => console.log(txData))
      .catch(error => console.error(error));
});
```
##### Omni USDT
```javascript
const amount = 10;
const feeValue = 5000; //Please calculate by yourself

const fundValue = 546; //minimum transfer number
const changeAddress = walletAddress;

const keyPair = getBitcoinNodeFromWIF(
  ownerWIF,
  bitcoin_lib.networks.testnet,
);
const psbt = new bitcoin_lib.Psbt({
  network: bitcoin_lib.networks.testnet,
});
fetch(
  `https://api.blockcypher.com/v1/btc/${chainName}/addrs/${walletAddress}?includeScript=true&token=${blockcypherToken}`,
)
  .then(response => response.json())
  .then(async data => {
    console.log(data);
    const utxos = data.txrefs;
    let use_utxos_values = 0;
    for (let index = 0; index < utxos.length; index++) {
      const utxo = utxos[index];
      use_utxos_values += utxo.value;
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/${chainName}/txs/${utxo.tx_hash}/?includeHex=true&token=${blockcypherToken}`,
      );
      const txs = await response.json();
      const inputData = getInputData(
        utxo.tx_hash,
        utxo.tx_output_n,
        false,
        {
          script: utxo.script,
          value: utxo.value,
          txHex: txs.hex,
        },
      );
      // const inputData = getInputData(
      //   utxo.tx_hash,
      //   utxo.tx_output_n,
      //   true,
      //   {script: utxo.script, value: utxo.value},
      // );
      psbt.addInput(inputData);
      if (use_utxos_values > fundValue + feeValue) {
        break;
      }
    }
    psbt.addOutput({
      address: targetAddress,
      value: fundValue,
    });

    const simple_send = [
      '6f6d6e69', // omni
      '0000', // version
      toPaddedHexString(31, 8), //Property ID: 31 for Tether Property
      toPaddedHexString(amount, 16), // amount
    ].join('');

    const omniData = [Buffer.from(simple_send, 'hex')];

    const omniOutput = bitcoin_lib.payments.embed({
      data: omniData,
    }).output;
    psbt.addOutput({
      script: omniOutput!,
      value: 0,
    });
    psbt.addOutput({
      address: changeAddress,
      value: use_utxos_values - fundValue,
    });

    psbt.data.inputs.forEach((value, index) => {
      psbt.signInput(index, keyPair);
    });

    psbt.finalizeAllInputs();
    const txHex = psbt.extractTransaction().toHex();
    console.log('txHex', txHex);
    fetch(
      `https://api.blockcypher.com/v1/btc/${chainName}/txs/push?token=${blockcypherToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: txHex,
        }),
      },
    )
      .then(response => response.json())
      .then(txData => console.log(txData))
      .catch(error => console.error(error));
  });
```
