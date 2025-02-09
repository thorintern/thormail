"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSwapKit } from "../lib/swapkit";
import { WalletConnectDialog } from "./WalletConnectDialog";
import { WalletDrawer } from "./WalletDrawer";

import { Toaster } from "sonner";

export function WalletButton() {
  const { isWalletConnected } = useSwapKit();
  const [connectOpen, setConnectOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {isWalletConnected ? (
        <Button onClick={() => setDrawerOpen(true)} className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm hover:bg-pink-200 transition-colors">My Wallet</Button>
      ) : (
        <Button 
          onClick={() => setConnectOpen(true)} 
          className="connect-wallet-btn bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm hover:bg-pink-200 transition-colors"
        >
          Connect Wallet
        </Button>
      )}

      <WalletConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
      <WalletDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <Toaster position="top-center" richColors expand={false} />
    </>
  );
}
