"use client";

import { X } from "lucide-react";

import { Chain, EVMChains, WalletOption } from "@swapkit/helpers";
import { BITGET_SUPPORTED_CHAINS } from "@swapkit/wallet-bitget";
import { PHANTOM_SUPPORTED_CHAINS } from "@swapkit/wallet-phantom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { WalletIcon } from "./ui/wallet-icon";
import { useWalletConnect } from "../hooks/useWalletConnect";

import { useSwapKit } from "../lib/swapkit";
import { triggerKeystoreFileSelect } from "./GlobalKeystoreDialog";

// const CHAIN_GROUPS: Record<string, Chain[]> = {
//   "EVM Chains": [
//     Chain.Ethereum,
//     Chain.BinanceSmartChain,
//     Chain.Avalanche,
//     Chain.Polygon,
//     Chain.Arbitrum,
//     Chain.Optimism,
//     Chain.Base,
//   ],
//   "UTXO Chains": [Chain.Bitcoin, Chain.BitcoinCash, Chain.Litecoin, Chain.Dogecoin, Chain.Dash],
//   "Cosmos Chains": [Chain.Cosmos, Chain.Kujira, Chain.Maya, Chain.THORChain],
//   "Other Chains": [Chain.Solana, Chain.Polkadot, Chain.Radix, Chain.Chainflip],
// };

const WALLET_GROUPS = {
  "Hardware Wallets": [
    WalletOption.LEDGER,
    // WalletOption.LEDGER_LIVE,
    WalletOption.TREZOR,
    WalletOption.KEEPKEY,
    // WalletOption.KEEPKEY_BEX,
  ],
  "Browser Extensions": [
    // WalletOption.METAMASK,
    // WalletOption.PHANTOM,
    WalletOption.KEPLR,
    // WalletOption.EXODUS,
    // WalletOption.BRAVE,
    // WalletOption.OKX,
    WalletOption.LEAP,
    // WalletOption.POLKADOT_JS,
    // WalletOption.TALISMAN,
    WalletOption.EIP6963,
  ],
  "Mobile Wallets": [
    // WalletOption.WALLETCONNECT,
    // WalletOption.COINBASE_WEB,
    // WalletOption.COINBASE_MOBILE,
    WalletOption.TRUSTWALLET_WEB,
    // WalletOption.OKX_MOBILE,
    // WalletOption.BITGET,
  ],
  Other: [WalletOption.KEYSTORE, WalletOption.CTRL, /*WalletOption.RADIX_WALLET*/],
};

const AllChainsSupported = [
  // Chain.Arbitrum,
  // Chain.Avalanche,
  // Chain.Base,
  // Chain.BinanceSmartChain,
  // Chain.Bitcoin,
  // Chain.BitcoinCash,
  // Chain.Cosmos,
  // Chain.Dash,
  // Chain.Dogecoin,
  // Chain.Ethereum,
  // Chain.Litecoin,
  // Chain.Optimism,
  // Chain.Polygon,
  // Chain.Polkadot,
  // Chain.Maya,
  // Chain.Kujira,
  Chain.THORChain,
  // Chain.Solana,
];

export const availableChainsByWallet = {
  [WalletOption.BITGET]: BITGET_SUPPORTED_CHAINS,
  [WalletOption.BRAVE]: EVMChains,
  [WalletOption.COINBASE_MOBILE]: EVMChains,
  [WalletOption.COINBASE_WEB]: EVMChains,
  [WalletOption.EIP6963]: EVMChains,
  [WalletOption.KEPLR]: [Chain.Cosmos, Chain.Kujira],
  [WalletOption.LEAP]: [Chain.Cosmos, Chain.Kujira],
  [WalletOption.LEDGER]: AllChainsSupported,
  [WalletOption.METAMASK]: EVMChains,
  [WalletOption.OKX_MOBILE]: EVMChains,
  [WalletOption.PHANTOM]: PHANTOM_SUPPORTED_CHAINS,
  [WalletOption.POLKADOT_JS]: [Chain.Polkadot],
  [WalletOption.TRUSTWALLET_WEB]: EVMChains,
  [WalletOption.CTRL]: AllChainsSupported,
  [WalletOption.KEYSTORE]: [...AllChainsSupported, Chain.Polkadot],
  [WalletOption.KEEPKEY]: [
    Chain.Arbitrum,
    Chain.Avalanche,
    Chain.BinanceSmartChain,
    Chain.Bitcoin,
    Chain.BitcoinCash,
    Chain.Cosmos,
    Chain.Dash,
    Chain.Dogecoin,
    Chain.Ethereum,
    Chain.Litecoin,
    Chain.Optimism,
    Chain.Polygon,
    Chain.THORChain,
    Chain.Maya,
  ],
  [WalletOption.KEEPKEY_BEX]: [
    Chain.Arbitrum,
    Chain.Avalanche,
    Chain.BinanceSmartChain,
    Chain.Bitcoin,
    Chain.BitcoinCash,
    Chain.Base,
    Chain.Cosmos,
    Chain.Dash,
    Chain.Dogecoin,
    Chain.Ethereum,
    Chain.Litecoin,
    Chain.Optimism,
    Chain.Polygon,
    Chain.THORChain,
    Chain.Maya,
  ],
  [WalletOption.TREZOR]: [
    Chain.Base,
    Chain.Bitcoin,
    Chain.BitcoinCash,
    Chain.Litecoin,
    Chain.Dash,
    Chain.Dogecoin,
    Chain.Ethereum,
    Chain.Avalanche,
    Chain.BinanceSmartChain,
    Chain.Optimism,
    Chain.Arbitrum,
    Chain.Polygon,
  ],
  [WalletOption.WALLETCONNECT]: [
    Chain.Ethereum,
    Chain.Base,
    Chain.BinanceSmartChain,
    Chain.Avalanche,
    Chain.THORChain,
    Chain.Maya,
    Chain.Polygon,
    Chain.Arbitrum,
    Chain.Optimism,
  ],
  [WalletOption.OKX]: [
    Chain.Ethereum,
    Chain.Avalanche,
    Chain.Base,
    Chain.BinanceSmartChain,
    Chain.Bitcoin,
    Chain.Cosmos,
    Chain.Polygon,
    Chain.Arbitrum,
    Chain.Optimism,
  ],
  [WalletOption.TALISMAN]: [
    Chain.Ethereum,
    Chain.Base,
    Chain.Arbitrum,
    Chain.Avalanche,
    Chain.Polygon,
    Chain.BinanceSmartChain,
    Chain.Optimism,
    Chain.Polkadot,
  ],
  [WalletOption.EXODUS]: [Chain.Ethereum, Chain.BinanceSmartChain, Chain.Polygon, Chain.Bitcoin],
  [WalletOption.LEDGER_LIVE]: [],
  [WalletOption.RADIX_WALLET]: [Chain.Radix],
};

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectDialog({ open, onOpenChange }: WalletConnectDialogProps) {
  const { loadingWallet, handleConnect } = useWalletConnect([Chain.THORChain]);
  const { setIsKeystoreOpen } = useSwapKit();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[60vh] bg-pink-50/50 backdrop-blur flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Connect Wallet</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div 
            className="grid h-full" 
            onMouseMove={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
          >

            <div className="flex flex-col overflow-hidden">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold">Select Wallet</h3>
              </div>

              <div className="flex-1 overflow-y-auto px-6">
                  {(() => {
                    const supportedWallets = Object.entries(WALLET_GROUPS)
                      .map(([groupName, wallets]) => {
                        const groupWallets = wallets.filter((wallet) => {
                          const supportedChains = availableChainsByWallet[wallet];

                          return (
                            supportedChains?.length > 0 &&
                            //@ts-expect-error its ok
                            [Chain.THORChain].every((chain) => supportedChains.includes(chain))
                          );
                        });

                        if (groupWallets.length === 0) return null;

                        return (
                          <div key={groupName} className="mb-6">
                            <h4 className="font-semibold mb-2">{groupName}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {groupWallets.map((wallet) => (
                                <Button
                                  key={wallet}
                                  variant="outline"
                                  size="lg"
                                  className="justify-start h-auto py-4"
                                  onClick={async () => {
                                    if (wallet === WalletOption.KEYSTORE) {
                                      triggerKeystoreFileSelect(() => setIsKeystoreOpen(true));
                                      onOpenChange(false);
                                    } else {
                                      await handleConnect(wallet);
                                      onOpenChange(false);
                                      toast(`Successfully connected ${wallet} wallet`, {
                                        className: 'bg-pink-50 text-pink-600 border-pink-200',
                                        position: 'top-center',
                                        duration: 3000
                                      });
                                      onOpenChange(false);
                                    }
                                  }}
                                  disabled={loadingWallet !== null}
                                >
                                  <WalletIcon wallet={wallet} className="mr-3 h-6 w-6" />
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{wallet}</span>
                                    {loadingWallet === wallet && (
                                      <span className="text-xs text-muted-foreground">
                                        Connecting...
                                      </span>
                                    )}
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                      .filter(Boolean);

                    if (supportedWallets.length === 0) {
                      return (
                        <div className="flex flex-1 items-center justify-center text-center">
                          <div className="max-w-sm">
                            <h3 className="font-semibold mb-2">No Compatible Wallets</h3>
                            <p className="text-sm text-muted-foreground">
                              No wallets support this combination of chains. Please select different
                              chains.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return supportedWallets;
                  })()}
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
