"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Users, Video, Flame, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DynamicPageTitle } from "@/components/dynamic-page-title";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "FitnessPro23",
      message: "Just hit a new PR on bench! The pre-workout really helped 💪",
      timestamp: new Date(Date.now() - 300000),
      avatar: "FP"
    },
    {
      id: "2",
      user: "HealthyLiving",
      message: "Anyone tried the new protein flavors? Looking for recommendations",
      timestamp: new Date(Date.now() - 240000),
      avatar: "HL"
    },
    {
      id: "3",
      user: "GymRat2024",
      message: "The testosterone guide is excellent! Lots of natural tips 🔥",
      timestamp: new Date(Date.now() - 180000),
      avatar: "GR"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState("ordify");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect theme
  useEffect(() => {
    const detectTheme = () => {
      const classList = document.documentElement.classList;
      if (classList.contains('theme-musclesports')) return 'musclesports';
      if (classList.contains('theme-vera')) return 'vera';
      return 'ordify';
    };
    
    setCurrentTheme(detectTheme());
    const observer = new MutationObserver(() => setCurrentTheme(detectTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: "You",
      message: newMessage,
      timestamp: new Date(),
      avatar: "YU"
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const videos = [
    {
      id: "1",
      title: "10 Natural Ways to Boost Testosterone",
      channel: "Dr. Eric Berg DC",
      thumbnail: "https://img.youtube.com/vi/bV2E-LaQKZw/maxresdefault.jpg",
      videoId: "bV2E-LaQKZw",
      views: "2.1M",
      category: "Testosterone"
    },
    {
      id: "2",
      title: "Foods That Increase Testosterone by 52%",
      channel: "Thomas DeLauer",
      thumbnail: "https://img.youtube.com/vi/cN72g_qjJMY/maxresdefault.jpg",
      videoId: "cN72g_qjJMY",
      views: "1.8M",
      category: "Nutrition"
    },
    {
      id: "3",
      title: "How to Build Muscle Naturally - Complete Guide",
      channel: "Jeff Nippard",
      thumbnail: "https://img.youtube.com/vi/M0uO8X3_tEA/maxresdefault.jpg",
      videoId: "M0uO8X3_tEA",
      views: "3.2M",
      category: "Muscle Building"
    },
    {
      id: "4",
      title: "The Best Supplements for Testosterone",
      channel: "More Plates More Dates",
      thumbnail: "https://img.youtube.com/vi/YUeKlhS-FKw/maxresdefault.jpg",
      videoId: "YUeKlhS-FKw",
      views: "890K",
      category: "Supplements"
    },
    {
      id: "5",
      title: "Optimize Your Hormones Naturally",
      channel: "Dr. Andrew Huberman",
      thumbnail: "https://img.youtube.com/vi/qJXKhu5UZwk/maxresdefault.jpg",
      videoId: "qJXKhu5UZwk",
      views: "4.5M",
      category: "Science"
    },
    {
      id: "6",
      title: "Sleep & Testosterone Connection",
      channel: "Matthew Walker",
      thumbnail: "https://img.youtube.com/vi/pwaWilO_Pig/maxresdefault.jpg",
      videoId: "pwaWilO_Pig",
      views: "1.5M",
      category: "Recovery"
    }
  ];

  const recommendedChannels = [
    {
      name: "Jeff Nippard",
      description: "Science-based fitness & nutrition",
      subscribers: "4.2M",
      icon: "🏋️"
    },
    {
      name: "Thomas DeLauer",
      description: "Health optimization & biohacking",
      subscribers: "3.8M",
      icon: "🧬"
    },
    {
      name: "Dr. Andrew Huberman",
      description: "Neuroscience & performance",
      subscribers: "6.1M",
      icon: "🧠"
    },
    {
      name: "Dr. Eric Berg DC",
      description: "Keto, health & wellness",
      subscribers: "12M",
      icon: "⚕️"
    }
  ];

  const primaryColor = currentTheme === 'musclesports' 
    ? 'green' 
    : currentTheme === 'vera' 
    ? 'orange' 
    : 'blue';

  return (
    <>
      <DynamicPageTitle pageTitle="Community Hub - Chat & Educational Videos" />
      
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className={`absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-r ${
            currentTheme === 'musclesports' 
              ? 'from-green-400 to-emerald-600' 
              : currentTheme === 'vera'
              ? 'from-orange-400 to-red-600'
              : 'from-blue-400 to-indigo-600'
          }`}></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 mb-4">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Community Hub</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${
            currentTheme === 'musclesports'
              ? 'from-green-600 to-emerald-600'
              : currentTheme === 'vera'
              ? 'from-orange-600 to-red-600'
              : 'from-blue-600 to-indigo-600'
          } bg-clip-text text-transparent`}>
            Connect, Learn, Grow
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our fitness community. Chat with fellow athletes and watch expert educational content on health, testosterone, and performance.
          </p>
        </div>

        {/* Community Chat Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              currentTheme === 'musclesports'
                ? 'from-green-500 to-emerald-600'
                : currentTheme === 'vera'
                ? 'from-orange-500 to-red-600'
                : 'from-blue-500 to-indigo-600'
            } flex items-center justify-center shadow-lg`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Community Chat</h2>
              <p className="text-sm text-muted-foreground">Connect with fellow fitness enthusiasts</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {messages.length} online
            </Badge>
          </div>

          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            {/* Chat Messages */}
            <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-background to-muted/20">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3 animate-slide-in-up">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    msg.user === "You"
                      ? currentTheme === 'musclesports'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : currentTheme === 'vera'
                        ? 'bg-gradient-to-br from-orange-500 to-red-600'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm bg-muted/50 rounded-lg px-3 py-2 inline-block">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t bg-background p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className={`${
                    currentTheme === 'musclesports'
                      ? 'bg-green-600 hover:bg-green-700'
                      : currentTheme === 'vera'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Educational Videos Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              currentTheme === 'musclesports'
                ? 'from-amber-500 to-orange-600'
                : currentTheme === 'vera'
                ? 'from-pink-500 to-rose-600'
                : 'from-violet-500 to-purple-600'
            } flex items-center justify-center shadow-lg`}>
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Educational Videos</h2>
              <p className="text-sm text-muted-foreground">Expert content on health, testosterone & performance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    {video.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="truncate">{video.channel}</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {video.views}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recommended Channels */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              currentTheme === 'musclesports'
                ? 'from-emerald-500 to-teal-600'
                : currentTheme === 'vera'
                ? 'from-red-500 to-pink-600'
                : 'from-indigo-500 to-blue-600'
            } flex items-center justify-center shadow-lg`}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Recommended Channels</h2>
              <p className="text-sm text-muted-foreground">Top fitness & health experts to follow</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="text-5xl mb-4">{channel.icon}</div>
                <h3 className="font-bold text-lg mb-2">{channel.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {channel.subscribers} subscribers
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Testosterone Focus Banner */}
        <div className="mt-16 relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white mb-4">
              <Flame className="w-5 h-5" />
              <span className="font-bold">Featured Content</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Master Your Testosterone Naturally
            </h3>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Discover science-backed methods to optimize your hormones, build muscle, and enhance performance through natural nutrition and lifestyle changes.
            </p>
            
            <a
              href="/testosterone-guide"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Read Full Guide
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

