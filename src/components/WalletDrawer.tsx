"use client";
import type { Chain } from "@swapkit/helpers";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { ChainIcon } from "./ui/chain-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useSwapKit } from "../lib/swapkit";
import { TokenBalance } from "./TokenBalance";
import { TruncatedAddress } from "./TruncatedAddress";

interface WalletDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletDrawer({ open, onOpenChange }: WalletDrawerProps) {
  const { balances, walletType, disconnectWallet } = useSwapKit();

  const connectedChains = useMemo(() => {
    const uniqueChains = new Set<Chain>();
    for (const balance of balances) {
      uniqueChains.add(balance.chain);
    }
    return Array.from(uniqueChains);
  }, [balances]);

  const chainAddresses = useMemo(() => {
    const addresses = new Map<Chain, string>();
    for (const balance of balances) {
      if (!addresses.has(balance.chain)) {
        addresses.set(balance.chain, balance.address || "");
      }
    }
    return addresses;
  }, [balances]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-pink-50/50 backdrop-blur">
        <SheetHeader>
          <SheetTitle>Connected Wallets</SheetTitle>
          <SheetDescription>
            {walletType} connected to {connectedChains.length} chain
            {connectedChains.length !== 1 ? "s" : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-16">
          {connectedChains.map((chain) => {
            const chainBalances = balances.filter((b) => b.chain === chain);
            const address = chainAddresses.get(chain);
            const gasAsset = chainBalances.find((b) => b.isGasAsset);
            const otherBalances = chainBalances.filter((b) => !b.isGasAsset);

            return (
              <div key={chain} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChainIcon chain={chain} className="h-6 w-6" />
                    <h3 className="font-semibold">{chain}</h3>
                  </div>
                  {address && <TruncatedAddress address={address} />}
                </div>
                <div className="space-y-2">
                  {gasAsset && (
                    <div className="mb-2">
                      <TokenBalance balance={gasAsset} />
                    </div>
                  )}
                  {otherBalances.map((balance) => (
                    <TokenBalance
                      key={`${balance.chain}-${balance.ticker || balance.symbol}`}
                      balance={balance}
                    />
                  ))}
                  {chainBalances.length === 0 && (
                    <div className="text-sm text-muted-foreground">No balances found</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              disconnectWallet();
              onOpenChange(false);
            }}
          >
            Disconnect
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
