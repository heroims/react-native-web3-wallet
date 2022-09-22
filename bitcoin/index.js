import BIP32Factory from 'bip32';
import ECPairFactory from 'ecpair';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { randomBytes as _randomBytes } from "crypto";

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);
export const bitcoin = require('bitcoinjs-lib');

/**
 *
 *
 * @export
 * @param {string} password
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {number} [seedByte=16]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',mnemonic:[],WIF:'',xpriv:'',xpub:'',shuffleMnemonic:[],publicKey:'',privateKey:''}>} 
 */
export function createWallet(password, path = "m/44'/0'/0'/0/0", seedByte = 16, network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true){
    return new Promise((fulfill, reject)=>{
        try {
            //16-12words 20-15words 24-18words 28-21words 32-24words
            let privateSeed = _randomBytes(seedByte);
            //2048 words
            let mnemonic = bip39.entropyToMnemonic(privateSeed);
            
            password = password ? password : '';

            let seed = bip39.mnemonicToSeedSync(mnemonic, password);
            let node = bip32.fromSeed(seed);

            let hdnode = node.derivePath(path);

            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffled(mnemonicArr);

            let bitcoinAddress = getBitcoinAddress(hdnode, network, path.match(/(?<=\/)(\d*)/g)[0].toNumber());
            let response = {
                mnemonic : mnemonicArr, 
                shuffleMnemonic : shuffleMnemonicArr,
                address : bitcoinAddress,
            };
            if(needPublicKey){
                response.publicKey=hdnode.publicKey.toString('hex');
            }
            if(needPrivateKey){
                response.privateKey=hdnode.privateKey.toString('hex');
            }
            if(needXpriv){
                response.xpriv=hdnode.toBase58();
            }
            if(needXpub){
                response.xpub=hdnode.neutered().toBase58();
            }
            if(needWIF){
                response.WIF = hdnode.toWIF();
            }
            fulfill(response) 
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
 * @param {string} [password='']
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:'',mnemonic:[],shuffleMnemonic[]}>} 
 */
export function importMnemonic(mnemonic, password = '', path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true){
    return new Promise((fulfill, reject)=>{
        try {
            password = password ? password : '';
            let seed = bip39.mnemonicToSeedSync(mnemonic, password);
            let node = bip32.fromSeed(seed);
            let hdnode = node.derivePath(path);
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);

            let bitcoinAddress = getBitcoinAddress(hdnode.publicKey, network, path.match(/(?<=\/)(\d*)/g)[0].toNumber());
            let response = {
                mnemonic : mnemonicArr, 
                shuffleMnemonic : shuffleMnemonicArr,
                address : bitcoinAddress,
            };

            if(needPublicKey){
                response.publicKey=hdnode.publicKey.toString('hex');
            }
            if(needPrivateKey){
                response.privateKey=hdnode.privateKey.toString('hex');
            }
            if(needXpriv){
                response.xpriv=hdnode.toBase58();
            }
            if(needXpub){
                response.xpub=hdnode.neutered().toBase58();
            }
            if(needWIF){
                response.WIF = hdnode.toWIF();
            }
            fulfill(response);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *
 *
 * @export
 * @param {string} wif
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:''}>} 
 */
export function importWIF(wif, path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true){
    return new Promise((fulfill, reject)=>{
        try {
            let keyPair = ECPair.fromWIF(wif);

            let bitcoinAddress = getBitcoinAddress(keyPair.publicKey, network, path.match(/(?<=\/)(\d*)/g)[0].toNumber());
            let response = {
                address : bitcoinAddress,
            };

            if(needPublicKey){
                response.publicKey=keyPair.publicKey.toString('hex');
            }
            if(needPrivateKey){
                response.privateKey=keyPair.privateKey.toString('hex');
            }
            if(needXpriv){
                response.xpriv=keyPair.toBase58();
            }
            if(needXpub){
                response.xpub=keyPair.neutered().toBase58();
            }
            if(needWIF){
                response.WIF = keyPair.toWIF();
            }
            fulfill(response);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *
 *
 * @export
 * @param {string} xpriv
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needWIF=true]
 * @param {boolean} [needXpriv=false]
 * @param {boolean} [needXpub=false]
 * @param {bitcoin.networks.Network} network
 * @return {Promise<{address:'',WIF:'',xpriv:'',xpub:'',publicKey:'',privateKey:''}>} 
 */
export function importXpriv(xpriv, path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true){
    return new Promise((fulfill, reject)=>{
        try {
            const node = bip32.fromBase58(xpriv, network);
            let bitcoinAddress = getBitcoinAddress(node.publicKey, network, path.match(/(?<=\/)(\d*)/g)[0].toNumber());
            let response = {
                address : bitcoinAddress,
            };

            if(needPublicKey){
                response.publicKey=node.publicKey.toString('hex');
            }
            if(needPrivateKey){
                response.privateKey=node.privateKey.toString('hex');
            }
            if(needXpriv){
                response.xpriv=node.toBase58();
            }
            if(needXpub){
                response.xpub=node.neutered().toBase58();
            }
            if(needWIF){
                response.WIF = node.toWIF();
            }
            fulfill(response);
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
 * @param {string} [password='']
 * @param {string} [path="m/44'/0'/0'/0/0"]
 * @return {import('bip32').BIP32Interface} 
 */
export function getBitcoinNodeFromMnemonic(mnemonic, password = '', path = "m/44'/0'/0'/0/0"){
    password = password ? password : '';
    let seed = bip39.mnemonicToSeedSync(mnemonic, password);
    let node = bip32.fromSeed(seed);
    let hdnode = node.derivePath(path);
    return hdnode;
}

/**
 *
 *
 * @export
 * @param {string} wif
 * @return {import('ecpair').ECPairInterface} 
 */
export function getBitcoinNodeFromWIF(wif){
    let keyPair = ECPair.fromWIF(wif);
    return keyPair;
}

/**
 *
 *
 * @export
 * @param {string} xpriv
 * @return {import('bip32').BIP32Interface} 
 */
export function getBitcoinNodeFromXpriv(xpriv){
    let node = bip32.fromBase58(xpriv, network);
    return node;
}

/**
 * 
 * @param {string} _type 
 * @param {*} myKeys 
 * @param {bitcoin.networks.Network} network 
 * @return {{payment:{},keys[]}}
 */
export function createPayment(_type, myKeys, network) {
    network = network || regtest;
    const splitType = _type.split('-').reverse();
    const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
    const keys = myKeys || [];
    let m;
    if (isMultisig) {
      const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
      m = parseInt(match[1], 10);
      let n = parseInt(match[2], 10);
      if (keys.length > 0 && keys.length !== n) {
        throw new Error('Need n keys for multisig');
      }
      while (!myKeys && n > 1) {
        keys.push(ECPair.makeRandom({ network }));
        n--;
      }
    }
    if (!myKeys) keys.push(ECPair.makeRandom({ network }));
  
    let payment;
    splitType.forEach(type => {
      if (type.slice(0, 4) === 'p2ms') {
        payment = bitcoin.payments.p2ms({
          m,
          pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
          network,
        });
      } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
        payment = (bitcoin.payments)[type]({
          redeem: payment,
          network,
        });
      } else {
        payment = (bitcoin.payments)[type]({
          pubkey: keys[0].publicKey,
          network,
        });
      }
    });
  
    return {
      payment,
      keys,
    };
}

/**
 *
 *
 * @export
 * @param {Buffer|string} publicKey
 * @param {bitcoin.networks.Network} network
 * @param {Number} bip
 * @return {string} 
 */
export function getBitcoinAddress(publicKey, network, bip) {
    let tmpPublicKey = publicKey;
    if (!Buffer.isBuffer(publicKey)) {
        tmpPublicKey = Buffer.from(publicKey, 'hex');
    }
    if (bip === 49) {
      const {address} = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: tmpPublicKey,
          network: network,
        }),
        network: network,
      });
      return address;
    } else if (bip === 84) {
      const {address} = bitcoin.payments.p2wpkh({
        pubkey: tmpPublicKey,
        network: network,
      });
      return address;
    } else {
      const {address} = bitcoin.payments.p2pkh({
        pubkey: tmpPublicKey,
        network: network,
      });
      return address;
    }
}

function getWitnessUtxo(out) {
    delete out.address;
    out.script = Buffer.from(out.script, 'hex');
    return out;
}

/**
 *
 *
 * @export
 * @param {number} amount
 * @param {*} payment
 * @param {boolean} isSegwit
 * @param {string} redeemType
 * @return {Promise}  
 */
export function getInputData(
    payment,
    utx,
    isSegwit,
    redeemType,
  ) {
    // for non segwit inputs, you must pass the full transaction buffer
    const nonWitnessUtxo = Buffer.from(utx.txHex, 'hex');
    // for segwit inputs, you only need the output script and value as an object.
    const witnessUtxo = getWitnessUtxo(utx.outs[unspent.vout]);
    const mixin = isSegwit ? { witnessUtxo } : { nonWitnessUtxo };
    const mixin2 = {};
    switch (redeemType) {
      case 'p2sh':
        mixin2.redeemScript = payment.redeem.output;
        break;
      case 'p2wsh':
        mixin2.witnessScript = payment.redeem.output;
        break;
      case 'p2sh-p2wsh':
        mixin2.witnessScript = payment.redeem.redeem.output;
        mixin2.redeemScript = payment.redeem.output;
        break;
    }
    return {
      hash: unspent.txId,
      index: unspent.vout,
      ...mixin,
      ...mixin2,
    };
}

function shuffled(array){
    array = array.slice();

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }

    return array;
}