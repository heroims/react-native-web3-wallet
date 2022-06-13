
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";

export function createWallet(nickname, password){
    console.log('开始创建');

    var start = performance.now();

    var privateSeed = ethers.utils.randomBytes(16);
    var mnemonic = ethers.utils.entropyToMnemonic(privateSeed);
    var wallet = ethers.Wallet.fromMnemonic(mnemonic);
     
    wallet.encrypt(password).then(res=>{
        var end = performance.now();

        console.log(`${end - start}ms\n`,res);

    });
};

