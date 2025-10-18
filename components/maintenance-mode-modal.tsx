'use client';

import React, { useState } from 'react';
import { Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaintenanceModeModalProps {
  isOpen: boolean;
  isMaintenanceMode: boolean;
  isLoading: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function MaintenanceModeModal({
  isOpen,
  isMaintenanceMode,
  isLoading,
  onClose,
  onToggle
}: MaintenanceModeModalProps) {
  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <>
      {/* Blurred Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 sm:max-w-lg">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Wrench className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Maintenance Mode</h2>
                <p className="text-xs text-slate-400 mt-0.5">Current time: {currentTime}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            {/* Status Section */}
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div>
                <p className="text-sm text-slate-300 font-medium">Current Status</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isMaintenanceMode
                    ? 'Site is currently in maintenance mode'
                    : 'Site is running normally and accepting visitors'}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                isMaintenanceMode
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></span>
                {isMaintenanceMode ? 'Maintenance' : 'Active'}
              </div>
            </div>

            {/* Message */}
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-200 leading-relaxed">
                {isMaintenanceMode
                  ? 'The site is currently undergoing maintenance. Visitors will see a maintenance page. Estimated time to completion: 30 minutes.'
                  : 'Enable maintenance mode to prevent visitors from accessing the site while you perform updates or maintenance.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-10 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={onToggle}
                disabled={isLoading}
                className={`flex-1 h-10 font-medium transition-all ${
                  isMaintenanceMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin text-sm">⚙</span>
                    Updating...
                  </span>
                ) : isMaintenanceMode ? (
                  'Resume Site'
                ) : (
                  'Enable Maintenance'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
