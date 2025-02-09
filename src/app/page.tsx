import { useState } from 'react';

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messages] = useState([
    { id: 0, title: "💌 Compose Message", content: "" },
    { id: 1, title: "From: Secret Admirer", content: "You make my heart skip a beat every time I see you..." },
    { id: 2, title: "To: My Valentine", content: "Your smile lights up my world..." },
  ]);

  return (
    <div className="flex h-screen bg-pink-50">
      {/* Left Messages List */}
      <div className="w-1/3 border-r-2 border-pink-100 bg-white p-6">
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
      <div className="flex-1 p-8 bg-pink-50">
        {selectedMessage === 0 ? (
          <textarea
            className="w-full h-full p-6 rounded-lg border-2 border-pink-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 resize-none text-pink-900 placeholder-pink-300"
            placeholder="Write your heartfelt message here..."
          />
        ) : (
          <div className="prose prose-lg text-pink-900 bg-white p-8 rounded-lg shadow-sm">
            {messages.find(m => m.id === selectedMessage)?.content}
          </div>
        )}
      </div>
    </div>
  );
}
