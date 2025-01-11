import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';


async function process() {
    console.log("STARTED");
    const keypair = new Ed25519Keypair();
    const client = new SuiClient({
        url: getFullnodeUrl('mainnet'), // или 'mainnet', в зависимости от вашей среды
    });

    const packageObjectId = '0xbe66e3956632c8b8cb90211ecb329b9bb03afef9ba5d72472a7c240d3afe19fd'; // замените на ваш PACKAGE_ID
    const tx = new Transaction();
    tx.setSender("0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766");
    tx.moveCall({
        target: `${packageObjectId}::example::ex1`, // замените на ваш модуль и функцию
        arguments: [], // замените на ваши аргументы
    });

    let txBytes = await tx.build({
        client,
    });

    console.log("STOPPED", txBytes);
}

process();
