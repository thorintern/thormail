'use client';

import { useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';

// import { useSwapKit } from "../lib/swapkit";
import { WalletButton } from "../components/WalletButton";
import { GlobalKeystoreDialog } from "../components/GlobalKeystoreDialog";

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messages] = useState([
    { id: 0, title: "💌 Compose Message", content: "" },
    { id: 1, title: "From: Secret Admirer", content: "You make my heart skip a beat every time I see you..." },
    { id: 2, title: "To: My Valentine", content: "Your smile lights up my world..." },
  ]);

  return (
    <div className="flex items-center justify-center h-screen">
      <GlobalKeystoreDialog />
      <div className="custom-cursor">💌</div>
      <Script src="/cursor-trail.js" strategy="afterInteractive" />
      <div className="flex w-full max-w-4xl h-2/3 bg-pink-50 rounded-2xl shadow-xl border border-pink-100 pane-container">
        {/* Left Messages List */}
        <div className="w-1/3 bg-white p-4 rounded-l-2xl shadow-lg">
        <Image 
          src="/thormail-logo.png" 
          alt="Thormail Logo"
          width={160}
          height={48}
          className="mb-2 mx-auto"
        />
        <div className="space-y-1 divide-y divide-pink-100">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message.id)}
              className={`p-3 text-sm rounded-md cursor-pointer transition-colors ${
                selectedMessage === message.id
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-pink-50'
              } border-b border-pink-100 last:border-b-0`}
            >
              {message.title}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 bg-white rounded-r-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="text-pink-400 text-sm"></div>
          <WalletButton />
        </div>
        <div className="h-[calc(100%-3rem)] flex flex-col">
          {selectedMessage === 0 ? (
            <textarea
              className="flex-1 p-6 rounded-lg border-2 border-pink-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 resize-none text-pink-900 placeholder-pink-300 bg-white"
              placeholder="Write your heartfelt message here..."
            />
          ) : (
            <div className="prose prose-lg text-pink-900 p-8 rounded-lg overflow-auto flex-1">
              {messages.find(m => m.id === selectedMessage)?.content}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-pink-100">
            <button className={`w-full ${
              selectedMessage === 0 
                ? 'bg-pink-100 hover:bg-pink-200 text-pink-600' 
                : 'bg-red-100 hover:bg-red-200 text-red-600'
              } px-4 py-2 rounded-lg text-sm transition-colors`}>
              {selectedMessage === 0 ? 'Send Message' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div> 
  );
}
