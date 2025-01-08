import CetusClmmSDK, { adjustForSlippage, d, initCetusSDK, Percentage, printTransaction } from '@cetusprotocol/cetus-sui-clmm-sdk'
import { DEV_ADDR } from './config';
import { swap } from './swap';

const network = "mainnet";
const fullNodeUrl = "https://fullnode.mainnet.sui.io:443"
const simulationAccount = DEV_ADDR
const sdk = initCetusSDK({ network, fullNodeUrl, simulationAccount })
sdk.senderAddress = DEV_ADDR;

swap(sdk);

console.log('swap done');
