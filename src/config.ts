import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const DEV_PK = "suiprivkey1qp3vz93sd9dvua9pd8henst3q0mkymw2r3rec7ua9pfasdd77px0xcsxjty";
export const DEV_ADDR = "0x24789498deeb4b84c73e58554a73912a2c6a2358905903ac68f9a72818c64766"
export const POOL_DEEP_SUI = "0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2"

export function GetMainKeyPair() {
  return Ed25519Keypair.fromSecretKey(DEV_PK);
}
