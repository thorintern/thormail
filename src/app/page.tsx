'use client';

import { useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';

// import { useSwapKit } from "../lib/swapkit";
import { WalletButton } from "../components/WalletButton";
import { SendButton } from "../components/SendButton";
import { GlobalKeystoreDialog } from "../components/GlobalKeystoreDialog";
import { THORMAIL_ADDRESS } from "@/lib/constants";

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("all");
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
        <div className="flex justify-end items-center mb-6">
          <WalletButton />
        </div>
        <div className="h-[calc(100%-3rem)] flex flex-col">
          {selectedMessage === 0 ? (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-pink-600">Recipient</label>
                <input
                  type="text"
                  value={recipientAddress === THORMAIL_ADDRESS ? "Send to all Thorchads" : recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value === "Send to all Thorchads" ? THORMAIL_ADDRESS : e.target.value)}
                  className="p-3 rounded-lg border-2 border-pink-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 text-pink-900 placeholder-pink-300 bg-white"
                  placeholder="Enter recipient address or 'all' for everyone"
                />
              </div>
              <textarea
              className="min-h-[300px] flex-1 p-6 rounded-lg border-2 border-pink-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 resize-none text-pink-900 placeholder-pink-300 bg-white"
              placeholder="Write your heartfelt message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            </div>
          ) : (
            <div className="prose prose-lg text-pink-900 p-8 rounded-lg overflow-auto flex-1">
              {messages.find(m => m.id === selectedMessage)?.content}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-pink-100 flex justify-end">
            <SendButton 
              compose={selectedMessage === 0} 
              content={messageContent}
              recipient={recipientAddress}
            />
          </div>
        </div>
      </div>
    </div>
    </div> 
  );
}
