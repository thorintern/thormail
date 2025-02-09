"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

// import { Chain, WalletOption } from "@swapkit/helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useSwapKit } from "../lib/swapkit";
// import { useWalletConnect } from "../hooks/useWalletConnect";

export const GlobalKeystoreDialog = () => {
  // const { handleConnect } = useWalletConnect([Chain.THORChain]);
  const {
    isKeystoreOpen,
    setIsKeystoreOpen,
    isKeystoreDecrypting,
    keystoreFile,
    setKeystoreFile,
    connectKeystore,
  } = useSwapKit();
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isKeystoreOpen) {
      inputRef.current?.focus();
      setPassword("");
    }
  }, [isKeystoreOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPassword = password.trim();
    if (!(trimmedPassword && keystoreFile)) return;
    await connectKeystore(trimmedPassword);
    // await handleConnect(WalletOption.KEYSTORE);
  };

  const handleCancel = () => {
    setIsKeystoreOpen(false);
    setKeystoreFile(null);
  };

  return (
    <Dialog open={isKeystoreOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="bg-pink-50/50 sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter Keystore Password</DialogTitle>
            <DialogDescription>
              Please enter your keystore password to decrypt and connect your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              ref={inputRef}
              disabled={isKeystoreDecrypting}
              className="col-span-3 text-grey-900"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isKeystoreDecrypting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isKeystoreDecrypting}>
              {isKeystoreDecrypting ? "Decrypting..." : "Unlock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const triggerKeystoreFileSelect = (onSelect: (file: File) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.json";
  input.style.display = "none";
  document.body.appendChild(input);

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) onSelect(file);
    document.body.removeChild(input);
  };

  input.click();
};
