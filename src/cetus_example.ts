import CetusClmmSDK, { adjustForSlippage, d, initCetusSDK, Percentage, printTransaction } from '@cetusprotocol/cetus-sui-clmm-sdk'
import { DEV_ADDR, POOL_DEEP_SUI } from './config';
import { swap } from './swap';

/*const network = "mainnet";
const fullNodeUrl = "https://fullnode.mainnet.sui.io:443"
const simulationAccount = DEV_ADDR
const sdk = initCetusSDK({ network, fullNodeUrl, simulationAccount })
sdk.senderAddress = DEV_ADDR;

swap(sdk, POOL_DEEP_SUI);

console.log('swap done');
*/

