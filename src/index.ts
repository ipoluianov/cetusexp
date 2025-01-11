import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

async function tohex(bs : Uint8Array) {
    return Array.prototype.map.call(bs, x => ('00' + x.toString(16)).slice(-2)).join('');
}

async function process() {
    console.log("STARTED");
    const keypair = new Ed25519Keypair();
    const client = new SuiClient({
        url: getFullnodeUrl('mainnet'),
    });

    const packageObjectId = '0xbe66e3956632c8b8cb90211ecb329b9bb03afef9ba5d72472a7c240d3afe19fd'; // замените на ваш PACKAGE_ID
    const tx = new Transaction();
    tx.setSender("0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766");
    // 0x261fb14f034bf488b8bfdeb263f081b5073883269368e258852f34deeae205d2 - fund
    tx.moveCall({
        target: `${packageObjectId}::fund::ex2`,
        arguments: [
            tx.object('0x261fb14f034bf488b8bfdeb263f081b5073883269368e258852f34deeae205d2'), // замените на ваш аргумент
        ],
    });

    let txBytes = await tx.build({
        client,
    });

    let txBytesHex = tohex(txBytes);

    console.log("STOPPED", txBytesHex);
}

process();
