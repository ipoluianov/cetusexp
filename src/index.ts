import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

import CetusClmmSDK, { adjustForSlippage, d, initCetusSDK, Percentage, printTransaction, RewarderAmountOwed } from '@cetusprotocol/cetus-sui-clmm-sdk'
import { DEV_ADDR, POOL_DEEP_SUI } from './config';
import { swap } from './swap';

async function tohex(bs : Uint8Array) {
    return Array.prototype.map.call(bs, x => ('00' + x.toString(16)).slice(-2)).join('');
}

// 2025-02-01 00:00:00.123
// 4+2+2+2+2+2+3 = 17 
const POOL_ID = "0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2"
const POS_ID = "0xdd3b8a9759e049eed8d0547fc005547c9a7f48f0270741e32c4e36ea0b043312"
//const POS_ID = "0x8d117d05348291a0d0c7e42bf9ccaf0dfcaa40c2a3f31b477d92734a9653e633"


function toDollars(coinName : string, amount : number) : number {
    if (coinName.indexOf("::SUI") != -1) {
        let sui = amount / 1000000000 * 3.5;
        return sui;
    }

    if (coinName.indexOf("::DEEP") != -1) {
        let deep = amount / 1000000 * 0.18;
        return deep;
    }

    return -1;
}

async function process() {
    //console.log("STARTED");
    
    const network = "mainnet";
    const fullNodeUrl = "https://fullnode.mainnet.sui.io:443"
    const simulationAccount = DEV_ADDR
    const sdk = initCetusSDK({ network, fullNodeUrl, simulationAccount })
    sdk.senderAddress = DEV_ADDR;

    const pool = await sdk.Pool.getPool(POOL_ID)

    //console.log("pool", JSON.stringify(pool, null, 2))
    //console.log("coinTypeA", pool.coinTypeA)
    //console.log("coinTypeB", pool.coinTypeB)

    for (let i = 0; i < 1000000; i++) {
        const posRewardersAmount = await sdk.Rewarder.batchFetchPositionRewarders([POS_ID])
        const fees = await sdk.Position.batchFetchPositionFees([POS_ID])

        //console.log("posRewardersAmount", JSON.stringify(posRewardersAmount, null, 2))
        //console.log("fees", JSON.stringify(fees, null, 2))

        let item1 = posRewardersAmount[POS_ID][0];
        let item2 = posRewardersAmount[POS_ID][1];
        let itemFeeA = fees[POS_ID].feeOwedA;
        let itemFeeB = fees[POS_ID].feeOwedB;

        let rewards1 = toDollars(item1.coin_address, item1.amount_owed.toNumber());
        let rewards2 = toDollars(item2.coin_address, item2.amount_owed.toNumber());
        let feesA = toDollars(pool.coinTypeA, itemFeeA.toNumber());
        let feesB = toDollars(pool.coinTypeB, itemFeeB.toNumber());

        /*console.log("Item", item1.coin_address, item1.amount_owed.toNumber(), rewards1);
        console.log("Item", item2.coin_address, item2.amount_owed.toNumber(), rewards2);
        console.log("Item", pool.coinTypeA, itemFeeA.toNumber(), feesA);
        console.log("Item", pool.coinTypeB, itemFeeB.toNumber(), feesB);*/

        let totalYield = rewards1 + rewards2 + feesA + feesB;
        console.log(totalYield.toFixed(4));

        // write value to file
        let fs = require('fs');
        fs.writeFileSync('totalYield.txt', totalYield.toFixed(4));

        await new Promise(r => setTimeout(r, 3000));
    }

    //console.log("STOPPED1");
}

process();
