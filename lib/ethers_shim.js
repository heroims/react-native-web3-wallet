"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("react-native-get-random-values");
const ethers_1 = require("ethers");
const react_native_scrypt_1 = __importDefault(require("react-native-scrypt"));
const react_native_aes_crypto_1 = __importDefault(require("react-native-aes-crypto"));
const buffer_1 = require("buffer");
ethers_1.ethers.pbkdf2.register((pwd, salt, iterations, keylen, algo) => {
    return buffer_1.Buffer.from(react_native_aes_crypto_1.default.pbkdf2Sync((0, ethers_1.toUtf8String)(pwd), (0, ethers_1.toUtf8String)(salt), iterations, keylen, algo));
});
ethers_1.ethers.scrypt.register((passwd, salt, N, r, p, dkLen, progress) => {
    return react_native_scrypt_1.default.scrypt(passwd, salt, N, r, p, dkLen, progress);
});
ethers_1.ethers.scryptSync.register((passwd, salt, N, r, p, dkLen) => {
    return react_native_scrypt_1.default.syncScrypt(passwd, salt, N, r, p, dkLen);
});
