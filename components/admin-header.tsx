'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, LogOut, Bell, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 border-b border-slate-900 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Brand with Cool Symbol */}
        <div className="flex items-center gap-3">
          {/* Professional Lumify Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex flex-col justify-center">
              <span className="text-white font-bold text-2xl tracking-tighter leading-tight" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '-0.03em', fontWeight: '700' }}>
                Lumify
              </span>
              <span className="text-blue-400 text-[11px] font-semibold tracking-widest uppercase opacity-80 leading-tight">Administration</span>
            </div>
            
            {/* Cool Custom Symbol - Glowing Diamond */}
            <div className="relative hidden md:flex items-center justify-center">
              {/* Outer glow rings */}
              <div className="absolute inset-0 animate-ping opacity-20">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L26 12L16 22L6 12L16 2Z" fill="url(#gradient1)" />
                  <defs>
                    <linearGradient id="gradient1" x1="6" y1="2" x2="26" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" stopOpacity="0.8"/>
                      <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Main diamond with gradient */}
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)] transition-all duration-300">
                <path d="M16 3L25 12L16 21L7 12L16 3Z" fill="url(#gradient2)" stroke="url(#gradient3)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M16 3L25 12L16 21L7 12L16 3Z" fill="url(#shine)" opacity="0.4"/>
                <line x1="16" y1="3" x2="16" y2="21" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                <line x1="7" y1="12" x2="25" y2="12" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                
                <defs>
                  <linearGradient id="gradient2" x1="7" y1="3" x2="25" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60A5FA"/>
                    <stop offset="0.5" stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#2563EB"/>
                  </linearGradient>
                  <linearGradient id="gradient3" x1="7" y1="3" x2="25" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#93C5FD"/>
                    <stop offset="1" stopColor="#60A5FA"/>
                  </linearGradient>
                  <linearGradient id="shine" x1="16" y1="3" x2="16" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.8"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Link>
        </div>

        {/* Right: Actions - Aligned to furthest right */}
        <div className="flex items-center justify-end gap-3 ml-auto">
          {/* Notifications */}
          <button className="p-2.5 hover:bg-slate-800/80 rounded-lg transition-all duration-200 relative group">
            <Bell className="h-5 w-5 text-slate-200 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50 ring-2 ring-slate-950"></span>
          </button>

          {/* User Menu - Administrator Badge */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="px-4 py-2 bg-slate-900 border-2 border-red-500/30 rounded-lg transition-all duration-200 group hover:bg-slate-800 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <span className="text-red-500 text-sm font-bold animate-pulse" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)' }}>
                Administrator
              </span>
            </button>

            {/* Dropdown Menu */}
            {mounted && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl shadow-slate-900/50 py-1 z-50">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-blue-300 hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-red-400 hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] transition-all text-sm">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
