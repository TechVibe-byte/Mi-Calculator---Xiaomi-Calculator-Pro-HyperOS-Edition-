import React, { useState } from 'react';
import { Check, Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed standalone PWA app, show subtle Installed badge or hide
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
        <Check className="w-3 h-3" /> PWA Installed
      </span>
    );
  }

  // Click handler: if browser has native install prompt, trigger it; else show instant install instruction modal
  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff5400] to-[#ff7a00] hover:from-[#ff6000] hover:to-[#ff851a] text-white text-xs font-semibold shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
        title="Install Mi Calculator as PWA Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1c1d22] p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/icon.svg"
                  alt="Mi Calculator"
                  className="w-12 h-12 rounded-2xl shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold leading-tight">Install Mi Calculator</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Offline PWA for Mobile & Laptop</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 mb-6 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
                <p className="text-xs font-semibold text-[#ff6700]">iOS Safari Instructions:</p>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari navigation bar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Tap <strong>Add</strong> in the top right to install full-screen anytime!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 mb-6 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
                <p className="text-xs font-semibold text-[#ff6700]">Android & Chrome / Edge Instructions:</p>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Tap the browser menu (<strong>⋮</strong> three dots in top or bottom corner).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Select <strong>Install App</strong> or <strong>Add to Home screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#ff6700]/10 text-[#ff6700] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Confirm <strong>Install</strong> to add the Xiaomi Calculator icon to your apps list!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full rounded-2xl bg-[#ff6700] py-3 text-sm font-semibold text-white hover:bg-[#ff7a1a] shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
