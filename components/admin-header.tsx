'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, LogOut, Bell, Menu, X } from 'lucide-react';
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
        {/* Left: Logo & Brand */}
        <div className="flex items-start pt-1">
          {/* Professional Lumify Logo */}
          <Link href="/admin" className="flex flex-col justify-start group">
            <span className="text-white font-bold text-2xl hidden sm:block tracking-tighter leading-tight" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '-0.03em', fontWeight: '700' }}>
              Lumify
            </span>
            <span className="text-white font-bold text-2xl sm:hidden tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '-0.03em', fontWeight: '700' }}>
              Lumify
            </span>
            <span className="text-blue-400 text-[11px] font-semibold tracking-widest uppercase hidden sm:block opacity-80">Administration</span>
          </Link>

          {/* Page Title */}
          {title && (
            <div className="hidden sm:block ml-4 pl-4 border-l border-slate-700">
              <h1 className="text-white font-semibold text-sm">{title}</h1>
            </div>
          )}
        </div>

        {/* Right: Actions - Aligned to furthest right */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 ml-auto">
          {/* Notifications */}
          <button className="p-2 hover:bg-slate-800/80 rounded-lg transition-all duration-200 relative group">
            <Bell className="h-5 w-5 text-slate-200 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="px-3 py-2 text-slate-100 text-sm font-medium hover:bg-slate-800/80 rounded-lg transition-all duration-200 group hover:text-blue-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            >
              Admin
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
