import CetusClmmSDK, { adjustForSlippage, d, Percentage, printTransaction } from "@cetusprotocol/cetus-sui-clmm-sdk"
import BN from 'bn.js'
import { DEV_ADDR, GetMainKeyPair } from "./config";

export async function swap(sdk: CetusClmmSDK, poolId: string) {
    const a2b = false
    const pool = await sdk.Pool.getPool(poolId)
    const byAmountIn = true
    const amount = new BN(8000)
  
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
  
    const keypair = GetMainKeyPair();
    sdk.senderAddress = DEV_ADDR;

    console.log("Amount", amount.toString());
    console.log("AmountLimit", amountLimit.toString());
  
    const swapPayload = await sdk.Swap.createSwapTransactionPayload(
      {
        pool_id: pool.poolAddress,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        a2b: a2b,
        by_amount_in: byAmountIn,
        amount: res.amount.toString(),
        amount_limit: amountLimit.toString(),
      },
    )
  
    printTransaction(swapPayload)
    const transferTxn = await sdk.fullClient.sendTransaction(keypair, swapPayload)
    console.log('swap: ', transferTxn)
  }
  