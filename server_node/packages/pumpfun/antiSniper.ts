import { DEFAULT_DECIMALS, PumpFunSDK } from "./src";
import { getSPLBalance } from "./example/util";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


export async function runAntiSniper(
  mintWallet: Keypair,
  devWallet: Keypair,
  additionalWallets: Array<any>,
  connection: Connection,
  sdk: PumpFunSDK,
  SLIPPAGE_BASIS_POINTS: bigint,
  initialBuyAmount: number
) {
  console.log("[antiSniper] - Running anti-sniper script...");
  let additionaWalletSlippage = 500n;

  try {
    // Step 1: Sell on the dev wallet
    await new Promise(resolve => setTimeout(resolve, 5000));
    let currentSPLBalance = await getSPLBalance(
      connection,
      mintWallet.publicKey,
      devWallet.publicKey
    );
    console.log("[antiSniper] - currentSPLBalance for the dev wallet", currentSPLBalance);

    if (currentSPLBalance) {
      try {
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
        console.log("[antiSniper] - dev wallet sellResults", sellResults);
      } catch (error) {
        console.error("[antiSniper] - Error during dev wallet sell:", error);
      }

      // Take every wallet available after the first wallet and buy
      console.log("[antiSniper] - walletsToBuy", additionalWallets);
      for (let i = 1; i < additionalWallets.length; i++) {
        try {
          const wallet = additionalWallets[i];
          const walletKeypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
          const buyAmount = BigInt(wallet.buyAmount * LAMPORTS_PER_SOL);
          console.log("[antiSniper] - Buying from wallet", walletKeypair.publicKey);

          // Capture and log the result of each buy operation
          const buyResult = await sdk.buy(walletKeypair, mintWallet.publicKey, buyAmount, additionaWalletSlippage, {
            unitLimit: 250000,
            unitPrice: 250000,
          });
          console.log("[antiSniper] - Buy result for wallet", walletKeypair.publicKey.toBase58(), buyResult);
        } catch (error) {
          console.error("[antiSniper] - Error during buy for wallet", additionalWallets[i], error);
        }
      }

      // Step 3: Buy back the dev wallet
      try {
        console.log("[antiSniper] - Buying back the dev wallet");
        const devBuyResult = await sdk.buy(devWallet, mintWallet.publicKey, BigInt(initialBuyAmount * Math.pow(10, DEFAULT_DECIMALS)), SLIPPAGE_BASIS_POINTS, {
          unitLimit: 250000,
          unitPrice: 250000,
        });
        console.log("[antiSniper] - Buy result for dev wallet", devWallet.publicKey.toBase58(), devBuyResult);
      } catch (error) {
        console.error("[antiSniper] - Error during buy back for dev wallet:", error);
      }

      console.log("[antiSniper] - Anti-sniper script completed successfully.");
      return true;
    }
  } catch (error) {
    console.error("[antiSniper] - Error during anti-sniper execution:", error);
    return false;
  }

  return false;
}

module.exports = { runAntiSniper };
