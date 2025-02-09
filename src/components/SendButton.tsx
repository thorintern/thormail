"use client";

import { Button } from "./ui/button";
import { useSwapKit } from "../lib/swapkit";
import { Chain } from "@swapkit/helpers";
import { useSendMessages } from "../hooks/useSendMessages";

export function SendButton({ compose, content, recipient, onConnect, onSwitchToCompose}: {compose: boolean; content: string; recipient: string, onConnect: () => void, onSwitchToCompose: () => void}) {
  const { swapKit, isWalletConnected } = useSwapKit();
  const walletAddress = swapKit?.getWallet(Chain.THORChain)?.address;
  const { sendMessages } = useSendMessages()

  return (
    <>
      {compose ? (
        <Button onClick={() => {
          if (!isWalletConnected) {
            onConnect();
            return;
          }
          sendMessages({
            from: walletAddress || "",
            to: recipient,
            content: content,
          })
        }} className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm hover:bg-pink-200 transition-colors">Send Love 💌</Button>
      ) : (
        <Button onClick={() => {
          onSwitchToCompose();
        }} className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm hover:bg-pink-200 transition-colors">Reply 💌</Button>
      )}
    </>
  );
}
