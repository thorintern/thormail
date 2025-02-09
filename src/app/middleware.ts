import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = crypto.webcrypto as Crypto;
}

export function middleware() {
  return NextResponse.next();
}
