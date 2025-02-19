import { DEFAULT_DECIMALS, PumpFunSDK } from "./src";
import { getSPLBalance } from "./example/util";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


export async function runAntiSniper(
  mintWallet: Keypair,
  devWallet: Keypair,
  additionalWallets: Array<string>,
  connection: Connection,
  sdk: PumpFunSDK,
  SLIPPAGE_BASIS_POINTS: bigint,
  initialBuyAmount: number
) {
  console.log("Running anti-sniper script...");

  // Step 1: Sell on the dev wallet
  let currentSPLBalance = await getSPLBalance(
    connection,
    devWallet.publicKey,
    mintWallet.publicKey
  );
  console.log("currentSPLBalance for the dev wallet", currentSPLBalance);
  if (currentSPLBalance) {

    let sellResults = await sdk.sell(
      devWallet,
      mintWallet.publicKey,
      BigInt(currentSPLBalance * Math.pow(10, DEFAULT_DECIMALS)),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    // Take every wallet available after the first wallet and buy
    const walletsToBuy = additionalWallets.slice(1);
    for (const walletString of walletsToBuy) {
      // Parse the wallet string into an object
      const wallet = JSON.parse(walletString);
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
      const buyAmount = BigInt(wallet.buyAmount * LAMPORTS_PER_SOL);
      await sdk.buy(walletKeypair, mintWallet.publicKey, buyAmount, SLIPPAGE_BASIS_POINTS, {
        unitLimit: 250000,
        unitPrice: 250000,
      });
    }
    // Step 3: Buy back the dev wallet
    await sdk.buy(devWallet, mintWallet.publicKey, BigInt(initialBuyAmount * Math.pow(10, DEFAULT_DECIMALS)), SLIPPAGE_BASIS_POINTS, {
      unitLimit: 250000,
      unitPrice: 250000,
    });

    console.log("Anti-sniper script completed successfully.");
  }
}

module.exports = { runAntiSniper };
