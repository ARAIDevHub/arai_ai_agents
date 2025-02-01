import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { sha256 } from "js-sha256";

import fs from "fs";

export const getOrCreateKeypair = (folder: string, name: string): Keypair => {
  const path = `${folder}/${name}.json`;
  
  if (fs.existsSync(path)) {
    const keypairString = fs.readFileSync(path, 'utf-8');
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(keypairString)));
  }
  
  const keypair = Keypair.generate();
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  fs.writeFileSync(path, JSON.stringify(Array.from(keypair.secretKey)));
  return keypair;
};

export const getSPLBalance = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<number> => {
  const accounts = await connection.getTokenAccountsByOwner(owner, { mint });
  if (accounts.value.length === 0) return 0;
  const balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey);
  return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
};

export const printSOLBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  label: string
) => {
  const balance = await connection.getBalance(publicKey);
  console.log(`${label} SOL balance:`, balance / 1e9);
};

export const printSPLBalance = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  label: string = "SPL Token"
) => {
  const balance = await getSPLBalance(connection, mint, owner);
  console.log(`${label} balance:`, balance);
};

export const baseToValue = (base: number, decimals: number): number => {
  return base * Math.pow(10, decimals);
};

export const valueToBase = (value: number, decimals: number): number => {
  return value / Math.pow(10, decimals);
};

//i.e. account:BondingCurve
export function getDiscriminator(name: string) {
  return sha256.digest(name).slice(0, 8);
}