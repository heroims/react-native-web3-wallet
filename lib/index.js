"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = exports.toPaddedHexString = exports.getInputData = exports.createPayment = exports.getBitcoinNodeFromXpriv = exports.getBitcoinNodeFromWIF = exports.getBitcoinNodeFromMnemonic = exports.importXpriv = exports.importWIF = exports.importMnemonic = exports.createWallet = exports.getBitcoinAddress = exports.bitcoin_lib = void 0;
const bip32_1 = require("bip32");
const ecpair_1 = require("ecpair");
const bip39 = require("bip39");
const ecc = require("@bitcoinerlab/secp256k1");
const crypto_1 = require("crypto");
const bitcoin = require("bitcoinjs-lib");
const bip32 = (0, bip32_1.default)(ecc);
const ECPair = (0, ecpair_1.default)(ecc);
exports.bitcoin_lib = bitcoin;
function getBitcoinAddress(publicKey, network, bip) {
    let tmpPublicKey;
    if (!Buffer.isBuffer(publicKey)) {
        tmpPublicKey = Buffer.from(publicKey, 'hex');
    }
    else {
        tmpPublicKey = publicKey;
    }
    if (bip === 49) {
        const { address } = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: tmpPublicKey,
                network: network,
            }),
            network: network,
        });
        return address ?? '';
    }
    else if (bip === 84) {
        const { address } = bitcoin.payments.p2wpkh({
            pubkey: tmpPublicKey,
            network: network,
        });
        return address ?? '';
    }
    else if (bip === 86) {
        const { address } = bitcoin.payments.p2tr({
            pubkey: tmpPublicKey,
            network: network,
        });
        return address ?? '';
    }
    else {
        const { address } = bitcoin.payments.p2pkh({
            pubkey: tmpPublicKey,
            network: network,
        });
        return address ?? '';
    }
}
exports.getBitcoinAddress = getBitcoinAddress;
function createWallet(password, path = "m/44'/0'/0'/0/0", seedByte = 16, network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true) {
    return new Promise((fulfill, reject) => {
        try {
            //16-12words 20-15words 24-18words 28-21words 32-24words
            let privateSeed = (0, crypto_1.randomBytes)(seedByte);
            //2048 words
            let mnemonic = bip39.entropyToMnemonic(privateSeed);
            password = password ? password : '';
            let seed = bip39.mnemonicToSeedSync(mnemonic, password);
            let node = bip32.fromSeed(seed, network);
            let hdnode = node.derivePath(path);
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            let bipNumberStr = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
            let bitcoinAddress = getBitcoinAddress(hdnode.publicKey, network, parseInt(bipNumberStr, 10));
            let response = {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.createWallet = createWallet;
function importMnemonic(mnemonic, password = '', path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true) {
    return new Promise((fulfill, reject) => {
        try {
            password = password ? password : '';
            let seed = bip39.mnemonicToSeedSync(mnemonic, password);
            let node = bip32.fromSeed(seed, network);
            let hdnode = node.derivePath(path);
            let mnemonicArr = mnemonic.split(' ');
            let shuffleMnemonicArr = shuffleArray(mnemonicArr);
            let bipNumberStr = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
            let bitcoinAddress = getBitcoinAddress(hdnode.publicKey, network, parseInt(bipNumberStr, 10));
            let response = {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.importMnemonic = importMnemonic;
function importWIF(wif, path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needWIF = true) {
    return new Promise((fulfill, reject) => {
        try {
            let keyPair = ECPair.fromWIF(wif, network);
            let bipNumberStr = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
            let bitcoinAddress = getBitcoinAddress(keyPair.publicKey, network, parseInt(bipNumberStr, 10));
            let response = {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.importWIF = importWIF;
function importXpriv(xpriv, path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin, needPrivateKey = false, needPublicKey = false, needXpriv = false, needXpub = false, needWIF = true) {
    return new Promise((fulfill, reject) => {
        try {
            const node = bip32.fromBase58(xpriv, network);
            let bipNumberStr = (path.match(/(?<=\/)(\d*)/g) ?? [])[0] ?? '';
            let bitcoinAddress = getBitcoinAddress(node.publicKey, network, parseInt(bipNumberStr, 10));
            let response = {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.importXpriv = importXpriv;
function getBitcoinNodeFromMnemonic(mnemonic, password = '', path = "m/44'/0'/0'/0/0", network = bitcoin.networks.bitcoin) {
    password = password ? password : '';
    let seed = bip39.mnemonicToSeedSync(mnemonic, password);
    let node = bip32.fromSeed(seed, network);
    let hdnode = node.derivePath(path);
    return hdnode;
}
exports.getBitcoinNodeFromMnemonic = getBitcoinNodeFromMnemonic;
function getBitcoinNodeFromWIF(wif, network = bitcoin.networks.bitcoin) {
    let keyPair = ECPair.fromWIF(wif, network);
    return keyPair;
}
exports.getBitcoinNodeFromWIF = getBitcoinNodeFromWIF;
function getBitcoinNodeFromXpriv(xpriv, network = bitcoin.networks.bitcoin) {
    let node = bip32.fromBase58(xpriv, network);
    return node;
}
exports.getBitcoinNodeFromXpriv = getBitcoinNodeFromXpriv;
function createPayment(_type, myKeys, network = bitcoin.networks.bitcoin) {
    network = network;
    const splitType = _type.split('-').reverse();
    const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
    const keys = myKeys || [];
    let m;
    if (isMultisig) {
        const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
        m = parseInt((match ?? [])[1], 10);
        let n = parseInt((match ?? [])[2], 10);
        if (keys.length > 0 && keys.length !== n) {
            throw new Error('Need n keys for multisig');
        }
        while (!myKeys && n > 1) {
            keys.push(ECPair.makeRandom({ network }));
            n--;
        }
    }
    if (!myKeys) {
        keys.push(ECPair.makeRandom({ network }));
    }
    let payment;
    splitType.forEach(type => {
        if (type.slice(0, 4) === 'p2ms') {
            payment = bitcoin.payments.p2ms({
                m,
                pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
                network,
            });
        }
        else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
            payment = bitcoin.payments[type]({
                redeem: payment,
                network,
            });
        }
        else {
            payment = bitcoin.payments[type]({
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
exports.createPayment = createPayment;
function getInputData(txId, vout, isSegwit, utx, redeemType = '', payment) {
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
    const mixin = isSegwit ? { witnessUtxo } : { nonWitnessUtxo };
    const mixin2 = {};
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
exports.getInputData = getInputData;
function toPaddedHexString(num, len) {
    const str = num.toString(16);
    return '0'.repeat(len - str.length) + str;
}
exports.toPaddedHexString = toPaddedHexString;
function shuffleArray(array) {
    array = array.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
exports.shuffleArray = shuffleArray;
