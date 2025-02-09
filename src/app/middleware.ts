import { NextResponse } from "next/server";
import crypto from "node:crypto";

if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = crypto.webcrypto as Crypto;
}

if (typeof global === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}

export function middleware() {
  return NextResponse.next();
}
