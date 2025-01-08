import CetusClmmSDK, { adjustForSlippage, d, initCetusSDK, Percentage, printTransaction } from '@cetusprotocol/cetus-sui-clmm-sdk'
import BN from 'bn.js'

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import * as bip39 from 'bip39';

const network = "mainnet";
const fullNodeUrl = "https://fullnode.mainnet.sui.io:443"
const simulationAccount = "0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766"
const TestnetSDK = initCetusSDK({ network, fullNodeUrl, simulationAccount })

async function getPositions() {
  console.log('get positions of one pool by owner address')
  const res = await TestnetSDK.Position.getPositionList(simulationAccount, [
    '0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2',
  ], false)
  console.log('get positions of one pool by owner address', res)
}

async function getRewardListOfOnePool() {
  console.log('retrieva reward list of one pool')
  const res = await TestnetSDK.Pool.fetchPositionRewardList({
    pool_id: "0x603311f22851b47f78ffe7c1f38edb06efb0b03338ef0d8bd5ac3c9b77ce4b1b",
    coinTypeA: "deeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP",
    coinTypeB: "0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  })
  console.log('retrieva reward list of one pool', res)
}

async function getPositionRewardAmount() {
  //const pool = await TestnetSDK.Pool.getPool('0x83c101a55563b037f4cd25e5b326b26ae6537dc8048004c1408079f7578dd160')

  const posRewardersAmount = await TestnetSDK.Rewarder.batchFetchPositionRewarders(
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

async function preswap(sdk: CetusClmmSDK) {
  const a2b = false
  const pool = await sdk.Pool.getPool('0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2')
  const byAmountIn = false
  const amount = new BN(80000)

  const swapTicks = await sdk.Pool.fetchTicks({
    pool_id: pool.poolAddress,
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB
  })

  console.log("swapTicks length: ", swapTicks.length);

  const res = sdk.Swap.calculateRates({
    decimalsA: 6,
    decimalsB: 6,
    a2b,
    byAmountIn,
    amount,
    swapTicks,
    currentPool: pool
  })

  console.log('calculateRates###res###', {
    estimatedAmountIn: res.estimatedAmountIn.toString(),
    estimatedAmountOut: res.estimatedAmountOut.toString(),
    estimatedEndSqrtPrice: res.estimatedEndSqrtPrice.toString(),
    estimatedFeeAmount: res.estimatedFeeAmount.toString(),
    isExceed: res.isExceed,
    extraComputeLimit: res.extraComputeLimit,
    amount: res.amount.toString(),
    aToB: res.aToB,
    byAmountIn: res.byAmountIn,
  })

  const slippage = Percentage.fromDecimal(d(5))
  const toAmount = byAmountIn ? res.estimatedAmountOut : res.estimatedAmountIn
  const amountLimit = adjustForSlippage(toAmount, slippage, !byAmountIn)


  console.log("keypair: ", keypair);

  sdk.senderAddress = "0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766";


  // build swap Payload
  const swapPayload = await sdk.Swap.createSwapTransactionPayload(
    {
      pool_id: pool.poolAddress,
      coinTypeA: pool.coinTypeA,
      coinTypeB: pool.coinTypeB,
      a2b: a2b,
      by_amount_in: byAmountIn,
      amount: res.amount.toString(),
      amount_limit: amountLimit.toString(),
      //swap_partner: partner,
    },
  )



  printTransaction(swapPayload)
  const transferTxn = await sdk.fullClient.sendTransaction(keypair, swapPayload)
  console.log('swap: ', transferTxn)  

  //console.log('swap: ', transferTxn)
}
//getPositions()

//getPositionRewardAmount();

preswap(TestnetSDK)


/*
    pos_object_id: '0x603311f22851b47f78ffe7c1f38edb06efb0b03338ef0d8bd5ac3c9b77ce4b1b',
    owner: '0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766',
    type: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position',
    liquidity: '1073486866',
    coin_type_a: 'deeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
    coin_type_b: '0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
    tick_lower_index: 34680,
    tick_upper_index: 36720,
    index: '529333',
    pool: '0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2',
*/

// getRewardListOfOnePool()


