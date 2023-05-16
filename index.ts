import BIP32Factory, {BIP32Interface} from 'bip32';
import ECPairFactory, {ECPairInterface} from 'ecpair';
import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import {randomBytes as _randomBytes} from 'crypto';
import * as bitcoin from 'bitcoinjs-lib';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);
export const bitcoin_lib = bitcoin;
type WalletResponse = {
  mnemonic: Array<string>;
  shuffleMnemonic: Array<string>;
  address: string;
  publicKey?: string;
  privateKey?: string;
  xpriv?: string;
  xpub?: string;
  WIF?: string;
};

type RedeemType = 'p2sh' | 'p2wsh' | 'p2sh-p2wsh' | '';
type PaymentType =
  | 'p2wpkh'
  | 'p2pkh'
  | 'p2wsh-p2pk'
  | 'p2sh-p2wpkh'
  | 'p2sh-p2ms(2 of 2)'
  | 'p2sh-p2ms(2 of 4)'
  | 'p2sh-p2wsh-p2ms(3 of 4)';

export function getBitcoinAddress(
  publicKey: Buffer | string,
  network: bitcoin.networks.Network,
  bip: number,
): string {
  let tmpPublicKey: Buffer;
  if (!Buffer.isBuffer(publicKey)) {
    tmpPublicKey = Buffer.from(publicKey, 'hex');
  } else {
    tmpPublicKey = publicKey;
  }
  if (bip === 49) {
    const {address} = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: tmpPublicKey,
        network: network,
      }),
      network: network,
    });
    return address ?? '';
  } else if (bip === 84) {
    const {address} = bitcoin.payments.p2wpkh({
      pubkey: tmpPublicKey,
      network: network,
    });
    return address ?? '';
  } else if (bip === 86) {
    const {address} = bitcoin.payments.p2tr({
      pubkey: tmpPublicKey,
      network: network,
    });
    return address ?? '';
  } else {
    const {address} = bitcoin.payments.p2pkh({
      pubkey: tmpPublicKey,
      network: network,
    });
    return address ?? '';
  }
}

export function createWallet(
  password: string,
  path = "m/44'/0'/0'/0/0",
  seedByte = 16,
  network = bitcoin.networks.bitcoin,
  needPrivateKey = false,
  needPublicKey = false,
  needXpriv = false,
  needXpub = false,
  needWIF = true,
): Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    try {
      //16-12words 20-15words 24-18words 28-21words 32-24words
      let privateSeed = _randomBytes(seedByte);
      //2048 words
      let mnemonic = bip39.entropyToMnemonic(privateSeed);

      password = password ? password : '';

      let seed = bip39.mnemonicToSeedSync(mnemonic, password);
      let node = bip32.fromSeed(seed, network);

      let hdnode = node.derivePath(path);

      let mnemonicArr = mnemonic.split(' ');
      let shuffleMnemonicArr = shuffleArray(mnemonicArr);

      let bipNumberStr: string = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
      let bitcoinAddress = getBitcoinAddress(
        hdnode.publicKey,
        network,
        parseInt(bipNumberStr, 10),
      );
      let response: WalletResponse = {
        mnemonic: mnemonicArr,
        shuffleMnemonic: shuffleMnemonicArr,
        address: bitcoinAddress,
      };
      if (needPublicKey) {
        response.publicKey = hdnode.publicKey.toString('hex');
      }
      if (needPrivateKey) {
        response.privateKey = hdnode.privateKey?.toString('hex');
      }
      if (needXpriv) {
        response.xpriv = hdnode.toBase58();
      }
      if (needXpub) {
        response.xpub = hdnode.neutered().toBase58();
      }
      if (needWIF) {
        response.WIF = hdnode.toWIF();
      }
      fulfill(response);
    } catch (error) {
      reject(error);
    }
  });
}

export function importMnemonic(
  mnemonic: string,
  password = '',
  path = "m/44'/0'/0'/0/0",
  network = bitcoin.networks.bitcoin,
  needPrivateKey = false,
  needPublicKey = false,
  needXpriv = false,
  needXpub = false,
  needWIF = true,
): Promise<WalletResponse> {
  return new Promise((fulfill, reject) => {
    try {
      password = password ? password : '';
      let seed = bip39.mnemonicToSeedSync(mnemonic, password);
      let node = bip32.fromSeed(seed, network);
      let hdnode = node.derivePath(path);
      let mnemonicArr = mnemonic.split(' ');
      let shuffleMnemonicArr = shuffleArray(mnemonicArr);

      let bipNumberStr: string = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
      let bitcoinAddress = getBitcoinAddress(
        hdnode.publicKey,
        network,
        parseInt(bipNumberStr, 10),
      );
      let response: WalletResponse = {
        mnemonic: mnemonicArr,
        shuffleMnemonic: shuffleMnemonicArr,
        address: bitcoinAddress,
      };

      if (needPublicKey) {
        response.publicKey = hdnode.publicKey.toString('hex');
      }
      if (needPrivateKey) {
        response.privateKey = hdnode.privateKey?.toString('hex');
      }
      if (needXpriv) {
        response.xpriv = hdnode.toBase58();
      }
      if (needXpub) {
        response.xpub = hdnode.neutered().toBase58();
      }
      if (needWIF) {
        response.WIF = hdnode.toWIF();
      }
      fulfill(response);
    } catch (error) {
      reject(error);
    }
  });
}

export function importWIF(
  wif: string,
  path = "m/44'/0'/0'/0/0",
  network = bitcoin.networks.bitcoin,
  needPrivateKey = false,
  needPublicKey = false,
  needWIF = true,
): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>> {
  return new Promise((fulfill, reject) => {
    try {
      let keyPair = ECPair.fromWIF(wif, network);
      let bipNumberStr: string = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';

      let bitcoinAddress = getBitcoinAddress(
        keyPair.publicKey,
        network,
        parseInt(bipNumberStr, 10),
      );
      let response: Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'> = {
        address: bitcoinAddress,
      };

      if (needPublicKey) {
        response.publicKey = keyPair.publicKey.toString('hex');
      }
      if (needPrivateKey) {
        response.privateKey = keyPair.privateKey?.toString('hex');
      }
      if (needWIF) {
        response.WIF = keyPair.toWIF();
      }
      fulfill(response);
    } catch (error) {
      reject(error);
    }
  });
}

export function importXpriv(
  xpriv: string,
  path = "m/44'/0'/0'/0/0",
  network = bitcoin.networks.bitcoin,
  needPrivateKey = false,
  needPublicKey = false,
  needXpriv = false,
  needXpub = false,
  needWIF = true,
): Promise<Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'>> {
  return new Promise((fulfill, reject) => {
    try {
      const node = bip32.fromBase58(xpriv, network);
      let bipNumberStr: string = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';

      let bitcoinAddress = getBitcoinAddress(
        node.publicKey,
        network,
        parseInt(bipNumberStr, 10),
      );
      let response: Omit<WalletResponse, 'shuffleMnemonic' | 'mnemonic'> = {
        address: bitcoinAddress,
      };

      if (needPublicKey) {
        response.publicKey = node.publicKey.toString('hex');
      }
      if (needPrivateKey) {
        response.privateKey = node.privateKey?.toString('hex');
      }
      if (needXpriv) {
        response.xpriv = node.toBase58();
      }
      if (needXpub) {
        response.xpub = node.neutered().toBase58();
      }
      if (needWIF) {
        response.WIF = node.toWIF();
      }
      fulfill(response);
    } catch (error) {
      reject(error);
    }
  });
}

export function getBitcoinNodeFromMnemonic(
  mnemonic: string,
  password = '',
  path = "m/44'/0'/0'/0/0",
  network = bitcoin.networks.bitcoin,
): BIP32Interface {
  password = password ? password : '';
  let seed = bip39.mnemonicToSeedSync(mnemonic, password);
  let node = bip32.fromSeed(seed, network);
  let hdnode = node.derivePath(path);
  return hdnode;
}

export function getBitcoinNodeFromWIF(
  wif: string,
  network = bitcoin.networks.bitcoin,
): ECPairInterface {
  let keyPair = ECPair.fromWIF(wif, network);
  return keyPair;
}

export function getBitcoinNodeFromXpriv(
  xpriv: string,
  network = bitcoin.networks.bitcoin,
): BIP32Interface {
  let node = bip32.fromBase58(xpriv, network);
  return node;
}

export function createPayment(
  _type: PaymentType,
  myKeys: any[],
  network: bitcoin.networks.Network = bitcoin.networks.bitcoin,
): {payment: bitcoin.payments.Payment | undefined; keys: any[]} {
  network = network;
  const splitType = _type.split('-').reverse();
  const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
  const keys = myKeys || [];
  let m: number;
  if (isMultisig) {
    const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
    m = parseInt((match ?? [])[1], 10);
    let n = parseInt((match ?? [])[2], 10);
    if (keys.length > 0 && keys.length !== n) {
      throw new Error('Need n keys for multisig');
    }
    while (!myKeys && n > 1) {
      keys.push(ECPair.makeRandom({network}));
      n--;
    }
  }
  if (!myKeys) {
    keys.push(ECPair.makeRandom({network}));
  }

  let payment: bitcoin.payments.Payment | undefined;
  splitType.forEach(type => {
    if (type.slice(0, 4) === 'p2ms') {
      payment = bitcoin.payments.p2ms({
        m,
        pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
        network,
      });
    } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
      payment = (bitcoin.payments as any)[type]({
        redeem: payment,
        network,
      });
    } else {
      payment = (bitcoin.payments as any)[type]({
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

export function getInputData(
  txId: string,
  vout: number,
  isSegwit: boolean,
  utx: {txHex?: string; script: string; value: any},
  redeemType: RedeemType = '',
  payment?: bitcoin.payments.Payment,
) {
  if (!isSegwit && !utx?.txHex) {
    throw new Error('nonWitnessUtxo need txHex');
  }

  // for non segwit inputs, you must pass the full transaction buffer
  const nonWitnessUtxo = Buffer.from(utx.txHex ?? '', 'hex');
  // for segwit inputs, you only need the output script and value as an object.
  const witnessUtxo = {
    script: Buffer.from(utx.script ?? '', 'hex'),
    value: utx.value,
  };
  const mixin = isSegwit ? {witnessUtxo} : {nonWitnessUtxo};
  const mixin2: any = {};
  switch (redeemType) {
    case 'p2sh':
      mixin2.redeemScript = payment?.redeem?.output;
      break;
    case 'p2wsh':
      mixin2.witnessScript = payment?.redeem?.output;
      break;
    case 'p2sh-p2wsh':
      mixin2.witnessScript = payment?.redeem?.redeem?.output;
      mixin2.redeemScript = payment?.redeem?.output;
      break;
  }
  return {
    hash: txId,
    index: vout,
    ...mixin,
    ...mixin2,
  };
}

export function toPaddedHexString(num: bigint | number, len: number): string {
  const str = num.toString(16);
  return '0'.repeat(len - str.length) + str;
}

export function shuffleArray(array: Array<any>): Array<any> {
  array = array.slice();

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  return array;
}
