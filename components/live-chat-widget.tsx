"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
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
      text: "Hi! 👋 Welcome to MuscleSports! How can I help you today?",
      time: new Date()
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: message,
      time: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate agent response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "agent",
        text: "Thanks for your message! Our team will respond shortly. In the meantime, check out our Supplement Finder to get personalized recommendations! 💪",
        time: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[99997] w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open live chat support - 1 unread message"
        >
          <MessageCircle className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse" aria-hidden="true">
            1
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[99997] w-full md:w-full md:max-w-sm animate-slide-in-up">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden flex flex-col h-[80vh] md:h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">Live Support</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Online now</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-2 flex-wrap text-xs">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setMessage("What are your shipping times?")}
                >
                  Shipping Info
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setMessage("I need supplement recommendations")}
                >
                  Product Help
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setMessage("Track my order")}
                >
                  Track Order
                </Badge>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-green-600 hover:bg-green-700"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

