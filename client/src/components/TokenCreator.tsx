import { useWallet } from "@solana/wallet-adapter-react";
import { createToken } from "../services/tokenService";

export function TokenCreator() {
  const wallet = useWallet();

  const handleCreateToken = async (formData: TokenCreationParams) => {
    try {
      if (!wallet.connected) {
        alert("Please connect your wallet first");
        return;
      }

      const result = await createToken(formData, wallet);
      
      console.log("Token created successfully!", result);
      console.log("View token at:", result.url);
      
    } catch (error) {
      console.error("Failed to create token:", error);
    }
  };

  return (
    <div>
      {/* Your form components here */}
      <button 
        onClick={() => handleCreateToken({
          name: "Test Token",
          symbol: "TEST",
          description: "My test token",
          unitLimit: 250000,
          unitPrice: 250000,
          initialBuyAmount: 0.0001,
        })}
        disabled={!wallet.connected}
      >
        Create Token
      </button>
    </div>
  );
} 