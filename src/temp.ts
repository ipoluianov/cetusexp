import CetusClmmSDK, { adjustForSlippage, d, initCetusSDK, Percentage, printTransaction } from '@cetusprotocol/cetus-sui-clmm-sdk'
import BN from 'bn.js'

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import * as bip39 from 'bip39';

async function getPositions(sdk: CetusClmmSDK) {
    console.log('get positions of one pool by owner address')
    const res = await sdk.Position.getPositionList("0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766", [
      '0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2',
    ], false)
    console.log('get positions of one pool by owner address', res)
  }
  
  async function getRewardListOfOnePool(sdk: CetusClmmSDK) {
    console.log('retrieva reward list of one pool')
    const res = await sdk.Pool.fetchPositionRewardList({
      pool_id: "0x603311f22851b47f78ffe7c1f38edb06efb0b03338ef0d8bd5ac3c9b77ce4b1b",
      coinTypeA: "deeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP",
      coinTypeB: "0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    })
    console.log('retrieva reward list of one pool', res)
  }
  
  async function getPositionRewardAmount(sdk: CetusClmmSDK) {
    //const pool = await TestnetSDK.Pool.getPool('0x83c101a55563b037f4cd25e5b326b26ae6537dc8048004c1408079f7578dd160')
  
    const posRewardersAmount = await sdk.Rewarder.batchFetchPositionRewarders(
      ['0x603311f22851b47f78ffe7c1f38edb06efb0b03338ef0d8bd5ac3c9b77ce4b1b']
    )
  
    posRewardersAmount['0x603311f22851b47f78ffe7c1f38edb06efb0b03338ef0d8bd5ac3c9b77ce4b1b'].forEach((pos) => {
      console.log('pos', pos.amount_owed)
    });
  
    //console.log(posRewardersAmount)
  }
  
  export async function getKeypairFromMnemonic(mnemonic: string): Promise<Ed25519Keypair> {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }
  
    const seed = await bip39.mnemonicToSeed(mnemonic);
  
  
    return Ed25519Keypair.deriveKeypair(seed.toString('hex'));
  }
  