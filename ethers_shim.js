import {ethers, toUtf8String} from 'ethers';
import Scrypt from 'react-native-scrypt';
import Aes from 'react-native-aes-crypto';
import {createHmac} from 'crypto';
import {Buffer} from 'buffer';

ethers.pbkdf2.register((pwd, salt, iterations, keylen, algo) => {
  return Buffer.from(
    Aes.pbkdf2Sync(
      toUtf8String(pwd),
      toUtf8String(salt),
      iterations,
      keylen,
      algo,
    ),
  );
});
ethers.scrypt.register((passwd, salt, N, r, p, dkLen, progress) => {
  return Scrypt.scrypt(passwd, salt, N, r, p, dkLen, progress);
});
ethers.scryptSync.register((passwd, salt, N, r, p, dkLen) => {
  return Scrypt.syncScrypt(passwd, salt, N, r, p, dkLen);
});
ethers.computeHmac.register((algorithm, key, data) => {
  return createHmac(algorithm, Buffer.from(key))
    .update(Buffer.from(data))
    .digest();
});
