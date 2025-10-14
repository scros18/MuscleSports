import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'We are currently performing scheduled maintenance. Please check back soon!';
  const estimatedTime = searchParams.get('estimatedTime') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-400 mb-4">
            💪 MuscleSports
          </h1>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Maintenance Message */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="text-4xl font-bold text-white mb-4">
            🔧 System Maintenance
          </div>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>
          {estimatedTime && (
            <div className="text-lg text-green-400 font-semibold">
              Estimated time: {estimatedTime}
            </div>
          )}
        </div>

        {/* 10% Welcome Discount Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="text-2xl font-bold text-white mb-3">
            🎉 EXCLUSIVE LAUNCH OFFER 🎉
          </div>
          <div className="text-7xl font-black text-white mb-3 drop-shadow-lg">
            10% OFF
          </div>
          <div className="text-3xl font-bold text-white mb-6">
            YOUR FIRST ORDER!
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 inline-block">
            <div className="text-2xl font-bold text-white">
              CODE: <span className="text-yellow-300">WELCOME10</span>
            </div>
          </div>
          <div className="text-lg text-white">
            Use this code when we&apos;re back online! 💪
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Assistance?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@musclesports.co.uk" 
              className="bg-white/20 hover:bg-white/30 transition-all duration-300 rounded-lg px-6 py-3 text-white font-semibold flex items-center justify-center gap-2"
            >
              📧 support@musclesports.co.uk
            </a>
            <a 
              href="tel:+441234567890" 
              className="bg-white/20 hover:bg-white/30 transition-all duration-300 rounded-lg px-6 py-3 text-white font-semibold flex items-center justify-center gap-2"
            >
              📞 +44 123 456 7890
            </a>
          </div>
        </div>

        {/* Current Time */}
        <div className="mt-8 text-gray-400">
          <p>Current time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function Maintenance() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <MaintenanceContent />
    </Suspense>
  );
}
