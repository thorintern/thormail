'use client';

import { useState, useEffect } from 'react';
import { fetchMessages } from '../lib/midgard';
import { formatActionsToThorMail } from '../lib/message';
import Script from 'next/script';
import Image from 'next/image';

import { WalletButton } from "../components/WalletButton";
import { SendButton } from "../components/SendButton";
import { GlobalKeystoreDialog } from "../components/GlobalKeystoreDialog";
import { THORMAIL_ADDRESS } from "@/lib/constants";
import { ThorMail } from "@/types/thormail"; 

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thormails, setThormails] = useState<ThorMail[]>([]);
  
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const actions = await fetchMessages();
        const formatted = formatActionsToThorMail(actions);
        setThormails(formatted);
      } catch (err) {
        console.error('Failed to load messages:', err);
        setError('Failed to load messages. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Combine static compose message with loaded messages
  const messages = [
    { 
      id: 0, 
      title: "💌 Compose Message",
      content: "",
      isCompose: true 
    },
    ...thormails.map((mail, i) => ({
      id: i + 1,
      isCompose: false,
      title: `${mail.from.slice(-4)} → ${mail.recipient === THORMAIL_ADDRESS ? 'All' : mail.recipient.slice(-4)}`,
      content: mail.content
    }))
  ];

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
          {isLoading && (
            <div className="p-3 text-sm text-pink-500">Loading messages...</div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-500">{error}</div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message.id)}
              className={`p-3 text-sm rounded-md cursor-pointer transition-colors ${
                selectedMessage === message.id
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-pink-50'
              } space-y-1`}
            >
              {message.id === 0 ? (
                <div className="font-medium text-pink-600">💌 Compose Message</div>
              ) : (
                <>
                  <div className="font-medium text-pink-700">
                    From: {message.title.split("→")[0].trim()}
                  </div>
                  <div className="text-xs text-pink-500">
                    To: {message.title.split("→")[1]}
                  </div>
                  <div className="text-xs text-pink-400 line-clamp-2 whitespace-pre-wrap">
                    {message.content.substring(0, 30).trim() + (message.content.length > 30 ? "..." : "")}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 bg-white rounded-r-2xl shadow-lg">
        <div className="flex justify-end items-center mb-6">
          <WalletButton />
        </div>
        <hr className="border-pink-100 my-4" />
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
          <div className="mt-4 pt-4 pb-4 border-t border-pink-100 flex justify-end">
            <SendButton 
              compose={selectedMessage === 0} 
              content={messageContent}
              recipient={recipientAddress}
              onConnect={() => document.querySelector<HTMLButtonElement>('.connect-wallet-btn')?.click()}
            />
          </div>
        </div>
      </div>
    </div>
    </div> 
  );
}
