# React Native Web3 Wallet
Web3 Wallet in React Native (use bitcoinjs-lib)
## Welcome

This is a safe web3 wallet tools, to help with develop wallet applications quickly. 

## Installation

```bash
npm install react-native-web3-wallet-bitcoin --save
npm install react-native-get-random-values react-native-crypto rn-nodeify  --save
```
`npm install`(at this point the `post-install` does `rn-nodeify --install fs,dgram,process,path,console --hack`)
`npx pod-install`



## Usage

### Import

```javascript
import {
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

##### Omni USDT
```javascript
const fetchUnspents = (address) =>
  axios.get(`${API}/addr/${address}/utxo/`,{
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })

// *NEW need full raw tx for all non-segwit inputs (to verify the value before signing)
const getRawTx = (txid) =>
  axios.get(`${API}/rawtx/${txid}/`,{
    headers: {
      Accept: 'application/json',
      'X-Accept-Version': '2.0.0',
      'Content-Type': 'application/json',
    }
  }).then(data => Buffer.from(data.rawtx, 'hex'))

const broadcastTx = (txRaw) =>
  axios.post(`${API}/tx/send`,
    {
      rawtx: txRaw,
    },
    {
      headers: {
        Accept: 'application/json',
        'X-Accept-Version': '2.0.0',
        'Content-Type': 'application/json',
      }
    })


const createSimpleSend = async (fetchUnspents, alice_pair, recipient_address/*, amount = 10*/) => {

  // *NEW PSBT class
  const psbt = new bitcoin.Psbt({ network: net })

  const alice_p2pkh = bitcoin.payments.p2pkh({
    pubkey: alice_pair.publicKey,
    network: net
  }).address
  const unspents = await fetchUnspents(alice_p2pkh)

  const fundValue     = 546 // dust
  const feeValue      = 5000
  const totalUnspent  = unspents.reduce((summ, { satoshis }) => summ + satoshis, 0)
  const skipValue     = totalUnspent - fundValue - feeValue

  if (totalUnspent < feeValue + fundValue) {
    throw new Error(`Total less than fee: ${totalUnspent} < ${feeValue} + ${fundValue}`)
  }

  for (let i = 0; i < unspents.length; i++) {
    const nonWitnessUtxo = await getRawTx(unspents[i].txid)
    psbt.addInput({
      hash: unspents[i].txid,
      index: unspents[i].vout,
      sequence: 0xfffffffe,
      nonWitnessUtxo, // *NEW This will allow us to verify you are signing the correct values for inputs
    })
  }

  const simple_send = [
    "6f6d6e69", // omni
    "0000",     // version
    "00000000001f", // 31 for Tether
    "000000003B9ACA00" // amount = 10 * 100 000 000 in HEX
  ].join('')

  const data = [ Buffer.from(simple_send, "hex") ]

  const omniOutput = bitcoin.payments.embed({ data }).output

  psbt.addOutput({ address: recipient_address, value: fundValue }) // should be first!
  psbt.addOutput({ script: omniOutput, value: 0 })

  psbt.addOutput({ address: alice_p2pkh, value: skipValue })

  // *NEW sign all inputs with one method call
  psbt.signAllInputs(alice_pair)

  return psbt
}


// Construct tx
const alice = getBitcoinNodeFromWIF(ALICE_WIF)
const bobby = getBitcoinNodeFromWIF(BOBBY_WIF)
const amount = null // not used

const omni_tx = createSimpleSend(fetchUnspents, alice, bitcoin.payments.p2pkh({ pubkey: bobby.publicKey, network: net }).address, amount)

const auto_send = false

omni_tx.then(psbt => {
  // *NEW must finalize before TX extraction. (this helps for multisig)
  const txRaw = psbt.finalizeAllInputs().extractTransaction()

  console.log('hash', txRaw.getId())

  console.log(`"${txRaw.toHex()}"`)
  console.log(txRaw)

  if (auto_send) {
    broadcastTx(txRaw.toHex())
  }
})
```
