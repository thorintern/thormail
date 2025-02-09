'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messages] = useState([
    { id: 0, title: "💌 Compose Message", content: "" },
    { id: 1, title: "From: Secret Admirer", content: "You make my heart skip a beat every time I see you..." },
    { id: 2, title: "To: My Valentine", content: "Your smile lights up my world..." },
  ]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-full max-w-6xl h-3/4 bg-pink-50 rounded-2xl shadow-xl border border-pink-100">
        {/* Left Messages List */}
        <div className="w-1/3 bg-white p-6 rounded-l-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Love Letters</h1>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message.id)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedMessage === message.id
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-pink-50'
              }`}
            >
              {message.title}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 bg-white rounded-r-2xl shadow-lg">
        {selectedMessage === 0 ? (
          <textarea
            className="w-full h-full p-6 rounded-lg border-2 border-pink-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 resize-none text-pink-900 placeholder-pink-300 bg-white"
            placeholder="Write your heartfelt message here..."
          />
        ) : (
          <div className="prose prose-lg text-pink-900 p-8 rounded-lg overflow-auto h-full">
            {messages.find(m => m.id === selectedMessage)?.content}
          </div>
        )}
      </div>
    </div>
  );
}
