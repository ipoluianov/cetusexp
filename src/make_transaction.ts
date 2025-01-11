import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

export function makeTransaction() {

    const keypair = new Ed25519Keypair();
    const client = new SuiClient({
        url: getFullnodeUrl('mainnet'),
    });

    const packageObjectId = '0xbe66e3956632c8b8cb90211ecb329b9bb03afef9ba5d72472a7c240d3afe19fd';
    const tx = new Transaction();
    tx.moveCall({
        target: `${packageObjectId}::example::ex1`,
        arguments: [],
    });

    let txBytes = tx.build();

    console.log({ txBytes });


}