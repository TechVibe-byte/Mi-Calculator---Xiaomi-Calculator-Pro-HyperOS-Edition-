import React from 'react';
import {
  Calculator,
  Clock,
  Layers,
  Moon,
  Move,
  Send,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AppSettings, TabMode, TelegramConfig } from '../../types';
import { feedback } from '../../utils/audioFeedback';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  onOpenHistory: () => void;
  onOpenTelegram: () => void;
  onToggleFloating: () => void;
  settings: AppSettings;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  telegramConfig: TelegramConfig;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenHistory,
  onOpenTelegram,
  onToggleFloating,
  settings,
  onToggleSound,
  onToggleTheme,
  telegramConfig,
  historyCount,
}) => {
  const tabs: { id: TabMode; label: string; icon: React.ReactNode }[] = [
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'converter', label: 'Converter', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'financial', label: 'Life & Finance', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="w-full max-w-xl mx-auto px-3 sm:px-5 pt-3 pb-2 flex flex-col gap-2.5 select-none shrink-0">
      {/* Top Action Row */}
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/icon.svg"
            alt="Mi Calculator Logo"
            className="w-8 h-8 rounded-xl shadow-md shadow-orange-500/25 shrink-0"
          />
          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-none">
              Mi Calculator
            </h1>
            <span className="text-[10px] text-neutral-400 font-medium">HyperOS Edition</span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Sound Toggle */}
          <button
            onClick={() => {
              feedback.playKeyClick('action');
              onToggleSound();
            }}
            className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition cursor-pointer"
            title={settings.soundEnabled ? 'Mute Key Sounds' : 'Enable Key Sounds'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-[#ff6700]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              feedback.playKeyClick('action');
              onToggleTheme();
            }}
            className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Floating Calc Mode */}
          <button
            onClick={() => {
              feedback.playKeyClick('action');
              onToggleFloating();
            }}
            className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="Floating Mini Window"
          >
            <Move className="w-4 h-4" />
          </button>

          {/* Telegram Cloud Backup */}
          <button
            onClick={() => {
              feedback.playKeyClick('action');
              onOpenTelegram();
            }}
            className="relative p-2 rounded-full text-blue-500 hover:bg-blue-500/10 transition cursor-pointer"
            title="Telegram Cloud Backup & Rollback"
          >
            <Send className="w-4 h-4 -rotate-12" />
            {telegramConfig.botToken && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#121214]" />
            )}
          </button>

          {/* History */}
          <button
            onClick={() => {
              feedback.playKeyClick('action');
              onOpenHistory();
            }}
            className="relative p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="History"
          >
            <Clock className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#ff6700] text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Xiaomi Signature Segmented Tab Bar */}
      <div className="bg-neutral-200/60 dark:bg-[#1f2026] p-1 rounded-2xl flex items-center border border-neutral-300/40 dark:border-neutral-800/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                feedback.playKeyClick('action');
                onTabChange(tab.id);
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mi-key-press cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#2c2d36] text-neutral-900 dark:text-white shadow-sm shadow-black/5 font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
