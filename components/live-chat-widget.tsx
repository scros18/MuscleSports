"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Hi there! 👋 I'm Maya, your MuscleSports Support Agent. How can I help you today?",
      time: new Date(),
      name: "Maya"
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: message,
      time: new Date(),
      name: "You"
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate agent response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "agent",
        text: "Thanks for reaching out! I'm here to help with any questions about our fitness partners, supplements, or services. What can I assist you with? 💪",
        time: new Date(),
        name: "Maya"
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button - Premium Animated */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[99997] w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open live chat support with Maya"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
          <MessageCircle className="w-7 h-7 relative z-10" strokeWidth={1.5} />
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-lg animate-pulse" aria-hidden="true">
            1
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-950 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap">
              Chat with Maya
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[99997] w-full md:w-full md:max-w-sm animate-slide-in-up">
          <div className="bg-white dark:bg-gray-950 rounded-t-3xl md:rounded-3xl shadow-2xl border-2 border-green-500/50 overflow-hidden flex flex-col h-[80vh] md:h-[600px] backdrop-blur-lg">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 flex items-center justify-between border-b-2 border-green-700/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-green-100 rounded-full blur-sm opacity-30"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border-2 border-white/30 relative">
                    <span className="text-xl">👩‍💼</span>
                  </div>
                </div>
                <div>
                  <div className="font-black text-white text-sm uppercase tracking-wider">Maya</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/90 font-semibold">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse shadow-lg shadow-green-300"></div>
                    <span>AI Support Agent</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-semibold text-green-700 dark:text-green-300">Powered by AI • Instant Response</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {msg.sender === "agent" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs mr-2 flex-shrink-0">
                      M
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium rounded-br-none"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-600 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Quick Help</p>
              <div className="flex gap-2 flex-wrap text-xs">
                <button
                  onClick={() => setMessage("Shipping information")}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-green-500 transition-all font-semibold"
                >
                  📦 Shipping
                </button>
                <button
                  onClick={() => setMessage("Product recommendations")}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-green-500 transition-all font-semibold"
                >
                  💪 Products
                </button>
                <button
                  onClick={() => setMessage("Track my order")}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-green-500 transition-all font-semibold"
                >
                  📍 Track
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Message Maya..."
                  className="flex-1 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl w-11 h-11 shadow-lg hover:shadow-xl transition-all active:scale-95"
                  aria-label="Send message to Maya"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Maya usually responds instantly</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

