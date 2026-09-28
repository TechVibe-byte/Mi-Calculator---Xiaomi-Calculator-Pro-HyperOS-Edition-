/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AngleUnit, AppSettings, HistoryEntry, TabMode, TelegramConfig } from './types';
import { HistoryStorage, defaultSettings } from './services/historyStorage';
import { CalculatorEngine } from './utils/calculatorEngine';
import { feedback } from './utils/audioFeedback';
import { Header } from './components/common/Header';
import { BasicKeypad } from './components/calculator/BasicKeypad';
import { ScientificKeypad } from './components/calculator/ScientificKeypad';
import { ConvertersHub } from './components/converters/ConvertersHub';
import { FinancialHub } from './components/financial/FinancialHub';
import { HistoryModal } from './components/history/HistoryModal';
import { TelegramBackupModal } from './components/backup/TelegramBackupModal';
import { FloatingCalcWidget } from './components/common/FloatingCalcWidget';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Check, Copy, RotateCcw } from 'lucide-react';

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<TabMode>('calculator');
  const [isScientificOpen, setIsScientificOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);

  // Persistence State
  const [settings, setSettings] = useState<AppSettings>(() => HistoryStorage.getSettings());
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(() => HistoryStorage.getTelegramConfig());
  const [history, setHistory] = useState<HistoryEntry[]>(() => HistoryStorage.getHistory());

  // Calculator engine state
  const [expression, setExpression] = useState<string>('0');
  const [evaluatedResult, setEvaluatedResult] = useState<string>('');
  const [justCalculated, setJustCalculated] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const displayEndRef = useRef<HTMLDivElement>(null);

  // Sync theme to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    feedback.setConfig(settings.soundEnabled, settings.vibrationEnabled);
  }, [settings]);

  // Live evaluation preview
  useEffect(() => {
    if (!expression || expression === '0') {
      setEvaluatedResult('');
      return;
    }

    const { result, error } = CalculatorEngine.evaluate(expression, settings.angleUnit);
    if (!error && result && result !== expression) {
      setEvaluatedResult(result);
    } else {
      setEvaluatedResult('');
    }
  }, [expression, settings.angleUnit]);

  // Auto-scroll expression display to the right
  useEffect(() => {
    displayEndRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'end' });
  }, [expression]);

  // Laptop Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === '.') {
        handleInput('.');
      } else if (e.key === '+') {
        handleInput('+');
      } else if (e.key === '-') {
        handleInput('−');
      } else if (e.key === '*' || e.key === 'x') {
        handleInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (e.key === '%') {
        handleInput('%');
      } else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, justCalculated]);

  // Calculator Action Handlers
  const handleInput = (token: string) => {
    setCopiedToast(false);
    const operators = ['+', '−', '×', '÷', '%', '^'];

    if (justCalculated) {
      setJustCalculated(false);
      // If user inputs an operator after calculation, continue with previous result
      if (operators.includes(token)) {
        setExpression(expression + token);
        return;
      } else {
        // Start fresh
        setExpression(token);
        return;
      }
    }

    if (expression === '0') {
      if (token === '.') {
        setExpression('0.');
      } else if (operators.includes(token)) {
        setExpression('0' + token);
      } else {
        setExpression(token);
      }
    } else {
      // Prevent consecutive duplicate operators
      const lastChar = expression.slice(-1);
      if (operators.includes(lastChar) && operators.includes(token)) {
        setExpression(expression.slice(0, -1) + token);
      } else {
        setExpression(expression + token);
      }
    }
  };

  const handleClear = () => {
    setExpression('0');
    setEvaluatedResult('');
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    setJustCalculated(false);
    if (expression.length <= 1) {
      setExpression('0');
    } else {
      // Remove trailing function names if present like "sin("
      if (expression.endsWith('sin(') || expression.endsWith('cos(') || expression.endsWith('tan(') || expression.endsWith('log(')) {
        setExpression(expression.slice(0, -4) || '0');
      } else if (expression.endsWith('ln(')) {
        setExpression(expression.slice(0, -3) || '0');
      } else {
        setExpression(expression.slice(0, -1));
      }
    }
  };

  const handleEquals = () => {
    if (expression === '0') return;

    const { result, numericValue, error } = CalculatorEngine.evaluate(expression, settings.angleUnit);

    if (error || numericValue === null) {
      // Incomplete or invalid syntax
      return;
    }

    // Save to History
    const cleanExpr = expression;
    const cleanResult = result;

    const newEntry = HistoryStorage.addEntry(
      cleanExpr,
      cleanResult,
      isScientificOpen ? 'scientific' : 'standard'
    );
    setHistory(HistoryStorage.getHistory());

    setExpression(cleanResult.replace(/,/g, ''));
    setEvaluatedResult('');
    setJustCalculated(true);
  };

  const handleCopyResult = () => {
    feedback.playKeyClick('action');
    const toCopy = evaluatedResult || expression;
    navigator.clipboard.writeText(toCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleToggleAngleUnit = () => {
    const next: AngleUnit = settings.angleUnit === 'deg' ? 'rad' : 'deg';
    const updated = { ...settings, angleUnit: next };
    setSettings(updated);
    HistoryStorage.saveSettings(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    HistoryStorage.saveSettings(updated);
  };

  const handleToggleTheme = () => {
    const nextTheme: AppSettings['theme'] = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: nextTheme };
    setSettings(updated);
    HistoryStorage.saveSettings(updated);
  };

  const handleToggleDataBaseMode = (mode: '1024' | '1000') => {
    const updated = { ...settings, dataBaseMode: mode };
    setSettings(updated);
    HistoryStorage.saveSettings(updated);
  };

  const handleSaveTelegramConfig = (config: TelegramConfig) => {
    setTelegramConfig(config);
    HistoryStorage.saveTelegramConfig(config);
  };

  const handleHistoryRestored = () => {
    setHistory(HistoryStorage.getHistory());
    setSettings(HistoryStorage.getSettings());
    setTelegramConfig(HistoryStorage.getTelegramConfig());
  };

  const handleSaveConverterToHistory = (expr: string, res: string, category: string) => {
    HistoryStorage.addEntry(expr, res, 'converter', category);
    setHistory(HistoryStorage.getHistory());
  };

  const handleSaveFinancialToHistory = (expr: string, res: string, category: string) => {
    HistoryStorage.addEntry(expr, res, 'financial', category);
    setHistory(HistoryStorage.getHistory());
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setActiveTab('calculator');
    setExpression(entry.result.replace(/,/g, ''));
    setJustCalculated(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] dark:bg-[#121214] text-[#1a1a1c] dark:text-[#f3f3f6] flex flex-col justify-between selection:bg-[#ff6700]/30 overflow-x-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTelegram={() => setIsTelegramOpen(true)}
        onToggleFloating={() => setIsFloatingOpen(!isFloatingOpen)}
        settings={settings}
        onToggleSound={handleToggleSound}
        onToggleTheme={handleToggleTheme}
        telegramConfig={telegramConfig}
        historyCount={history.length}
      />

      {/* Main Container - Responsive for Laptop (Dual-column) and Mobile */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-6 px-3 sm:px-6 py-2">
        {/* Main App Content Viewport */}
        <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between">
          {/* TAB 1: Calculator (Basic + Scientific) */}
          {activeTab === 'calculator' && (
            <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-200">
              {/* Display Area (Xiaomi Mi Style) */}
              <div className="px-5 py-4 sm:py-6 flex flex-col justify-end text-right min-h-[170px] sm:min-h-[200px] rounded-3xl bg-white/70 dark:bg-[#18191d]/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm backdrop-blur-md mb-2">
                {/* Status Badges & Quick Tools */}
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <div className="flex items-center gap-2">
                    {isScientificOpen && (
                      <button
                        onClick={handleToggleAngleUnit}
                        className="px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-[#25262c] text-[#ff6700] font-bold text-[10px] uppercase hover:opacity-80 transition cursor-pointer"
                      >
                        {settings.angleUnit}
                      </button>
                    )}
                    {copiedToast && (
                      <span className="flex items-center gap-1 text-emerald-500 font-semibold text-xs animate-in fade-in">
                        <Check className="w-3.5 h-3.5" /> Copied
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyResult}
                      className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-[#25262c] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
                      title="Copy result"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary Expression (Scrollable, dynamically formatted) */}
                <div className="overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth pb-1">
                  <div
                    className={`font-mono font-medium transition-all ${
                      expression.length > 18
                        ? 'text-2xl sm:text-3xl'
                        : expression.length > 12
                        ? 'text-3xl sm:text-4xl'
                        : 'text-4xl sm:text-5xl'
                    } text-neutral-900 dark:text-neutral-50 tracking-tight`}
                  >
                    {expression}
                    <span ref={displayEndRef} />
                  </div>
                </div>

                {/* Soft Live Evaluation Preview */}
                <div className="h-7 sm:h-8 flex items-center justify-end font-mono">
                  {evaluatedResult && (
                    <span className="text-xl sm:text-2xl font-semibold text-neutral-400 dark:text-neutral-500 animate-in fade-in">
                      = {evaluatedResult}
                    </span>
                  )}
                </div>
              </div>

              {/* Scientific Keypad Drawer (Collapsible) */}
              {isScientificOpen && (
                <ScientificKeypad
                  onInput={handleInput}
                  angleUnit={settings.angleUnit}
                  onToggleAngleUnit={handleToggleAngleUnit}
                />
              )}

              {/* Basic Xiaomi 4x5 Keypad */}
              <BasicKeypad
                onInput={handleInput}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onEquals={handleEquals}
                onToggleScientific={() => {
                  feedback.playKeyClick('action');
                  setIsScientificOpen(!isScientificOpen);
                }}
                isScientificOpen={isScientificOpen}
                hasInput={expression !== '0'}
              />
            </div>
          )}

          {/* TAB 2: Converters Hub */}
          {activeTab === 'converter' && (
            <div className="flex-1 bg-white dark:bg-[#18191d] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
              <ConvertersHub
                onSaveToHistory={handleSaveConverterToHistory}
                dataBaseMode={settings.dataBaseMode}
                onToggleDataBaseMode={handleToggleDataBaseMode}
              />
            </div>
          )}

          {/* TAB 3: Life & Financial Tools */}
          {activeTab === 'financial' && (
            <div className="flex-1 bg-white dark:bg-[#18191d] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
              <FinancialHub
                onSaveToHistory={handleSaveFinancialToHistory}
                currencySymbol={settings.currencySymbol || '₹'}
                onCurrencyChange={(curr) => {
                  const updated = { ...settings, currencySymbol: curr };
                  setSettings(updated);
                  HistoryStorage.saveSettings(updated);
                }}
              />
            </div>
          )}
        </div>

        {/* Laptop / Desktop Dedicated History Side-Panel */}
        <div className="hidden lg:flex flex-col w-80 h-[640px] rounded-3xl bg-white dark:bg-[#18191d] border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Live History Log
            </h3>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-xs text-[#ff6700] hover:underline font-semibold"
            >
              Expand Full
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-neutral-400">
                <RotateCcw className="w-8 h-8 mb-2 opacity-30" />
                <span>No calculations recorded yet</span>
              </div>
            ) : (
              history.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistoryEntry(item)}
                  className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-[#1f2026] hover:bg-neutral-100 dark:hover:bg-[#25262c] transition-all cursor-pointer border border-neutral-200/50 dark:border-neutral-800/80"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-0.5">
                    <span className="uppercase font-semibold tracking-wider text-[#ff6700]">
                      {item.type}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate">
                    {item.expression}
                  </div>
                  <div className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200 truncate">
                    = {item.result}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setIsTelegramOpen(true)}
            className="w-full py-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Cloud Sync & Telegram Backup</span>
          </button>
        </div>
      </main>

      {/* History Slide-Out / Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEntry={handleSelectHistoryEntry}
        onTogglePin={(id) => setHistory(HistoryStorage.togglePin(id))}
        onUpdateNote={(id, note) => setHistory(HistoryStorage.updateNote(id, note))}
        onDeleteEntry={(id) => setHistory(HistoryStorage.deleteEntry(id))}
        onClearHistory={() => setHistory(HistoryStorage.clearHistory())}
        onOpenTelegram={() => setIsTelegramOpen(true)}
      />

      {/* Telegram Backup & Rollback Modal */}
      <TelegramBackupModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        telegramConfig={telegramConfig}
        onSaveConfig={handleSaveTelegramConfig}
        onHistoryRestored={handleHistoryRestored}
      />

      {/* Picture-in-Picture Floating Calculator */}
      <FloatingCalcWidget
        isOpen={isFloatingOpen}
        onClose={() => setIsFloatingOpen(false)}
        onLogToHistory={(expr, res) => {
          HistoryStorage.addEntry(expr, res, 'standard');
          setHistory(HistoryStorage.getHistory());
        }}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
