import React, { useState } from 'react';
import {
  Activity,
  ArrowRightLeft,
  Box,
  Check,
  Clock,
  Coins,
  Compass,
  Copy,
  Database,
  Gauge,
  HelpCircle,
  History,
  Maximize2,
  Ruler,
  Scale,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react';
import { CONVERTER_CATEGORIES, ConverterCategoryConfig, ConverterUnit, convertValue } from '../../utils/converterData';
import { feedback } from '../../utils/audioFeedback';

interface ConvertersHubProps {
  onSaveToHistory: (expression: string, result: string, category: string) => void;
  dataBaseMode: '1024' | '1000';
  onToggleDataBaseMode: (mode: '1024' | '1000') => void;
}

export const ConvertersHub: React.FC<ConvertersHubProps> = ({
  onSaveToHistory,
  dataBaseMode,
  onToggleDataBaseMode,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('data');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('gb');
  const [toUnitId, setToUnitId] = useState<string>('mb');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeCategory: ConverterCategoryConfig =
    CONVERTER_CATEGORIES.find((c) => c.id === activeCategoryId) || CONVERTER_CATEGORIES[0];

  // Adjust default units when switching category
  const handleCategorySelect = (catId: string) => {
    feedback.playKeyClick('action');
    setActiveCategoryId(catId);
    const cat = CONVERTER_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      if (cat.id === 'data') {
        setFromUnitId('gb');
        setToUnitId('mb');
      } else if (cat.id === 'currency') {
        setFromUnitId('usd');
        setToUnitId('inr');
      } else {
        setFromUnitId(cat.units[0].id);
        setToUnitId(cat.units[1].id);
      }
    }
  };

  const fromUnit = activeCategory.units.find((u) => u.id === fromUnitId) || activeCategory.units[0];
  const toUnit = activeCategory.units.find((u) => u.id === toUnitId) || activeCategory.units[1] || activeCategory.units[0];

  const numericInput = parseFloat(inputValue) || 0;
  const convertedResult = convertValue(numericInput, fromUnit, toUnit, activeCategory, dataBaseMode);

  // Format result
  const formattedResult =
    Math.abs(convertedResult) > 1e12 || (Math.abs(convertedResult) < 1e-6 && convertedResult !== 0)
      ? convertedResult.toExponential(6)
      : parseFloat(convertedResult.toPrecision(10)).toString();

  const handleSwapUnits = () => {
    feedback.playKeyClick('action');
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleNumberInput = (digit: string) => {
    feedback.playKeyClick('number');
    if (digit === '.') {
      if (!inputValue.includes('.')) setInputValue(inputValue + '.');
      return;
    }
    if (inputValue === '0') {
      setInputValue(digit);
    } else {
      setInputValue(inputValue + digit);
    }
  };

  const handleBackspace = () => {
    feedback.playKeyClick('action');
    if (inputValue.length <= 1) {
      setInputValue('0');
    } else {
      setInputValue(inputValue.slice(0, -1));
    }
  };

  const handleClear = () => {
    feedback.playKeyClick('action');
    setInputValue('0');
  };

  const handleCopy = (text: string, key: string) => {
    feedback.playKeyClick('action');
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleLogToHistory = () => {
    feedback.playKeyClick('equals');
    const expr = `${inputValue} ${fromUnit.symbol} ➔ ${toUnit.symbol}`;
    const res = `${formattedResult} ${toUnit.symbol}`;
    onSaveToHistory(expr, res, activeCategory.name);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'Ruler': return <Ruler className="w-4 h-4" />;
      case 'Scale': return <Scale className="w-4 h-4" />;
      case 'Maximize2': return <Maximize2 className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Gauge': return <Gauge className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-full overflow-hidden select-none">
      {/* Category Pills Strip */}
      <div className="px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-[#16171b]/50 backdrop-blur-md overflow-x-auto no-scrollbar flex items-center gap-2">
        {CONVERTER_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all mi-key-press cursor-pointer ${
                isActive
                  ? 'bg-[#ff6700] text-white shadow-md shadow-orange-500/20'
                  : 'bg-neutral-100 dark:bg-[#202126] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#282931]'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Display */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* Computer Data Specific Switch (1024 Binary vs 1000 Decimal) */}
        {activeCategory.hasBaseSwitch && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#ff6700]">Computer Data Calculation Mode</span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                {dataBaseMode === '1024' ? 'Binary Base-2 (1 KB = 1024 B, 1 MB = 1024 KB)' : 'Decimal Base-10 (1 KB = 1000 B, 1 MB = 1000 KB)'}
              </p>
            </div>
            <div className="flex bg-neutral-200 dark:bg-[#272830] p-0.5 rounded-xl">
              <button
                onClick={() => onToggleDataBaseMode('1024')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                  dataBaseMode === '1024' ? 'bg-[#ff6700] text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                1024
              </button>
              <button
                onClick={() => onToggleDataBaseMode('1000')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                  dataBaseMode === '1000' ? 'bg-[#ff6700] text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                1000
              </button>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">From</span>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="bg-neutral-100 dark:bg-[#26272e] text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-[#ff6700] text-neutral-800 dark:text-neutral-200"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-neutral-900 dark:text-neutral-100 break-all">
              {inputValue}
            </span>
            <span className="text-sm font-semibold text-neutral-400 ml-2">{fromUnit.symbol}</span>
          </div>
        </div>

        {/* Swap & Action Bar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSwapUnits}
            className="p-2.5 rounded-full bg-neutral-200 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300 dark:hover:bg-[#2e2f37] mi-key-press shadow-sm cursor-pointer"
            title="Swap Units"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogToHistory}
            className="px-3.5 py-1.5 rounded-full bg-[#ff6700]/10 text-[#ff6700] hover:bg-[#ff6700]/20 text-xs font-semibold flex items-center gap-1.5 mi-key-press cursor-pointer"
            title="Save conversion to calculation history"
          >
            <History className="w-3.5 h-3.5" />
            <span>Save to History</span>
          </button>
        </div>

        {/* Result Card */}
        <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/10 dark:from-[#ff6700]/10 dark:to-transparent p-4 rounded-3xl border border-[#ff6700]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#ff6700]">To</span>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="bg-neutral-100 dark:bg-[#26272e] text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-[#ff6700] text-neutral-800 dark:text-neutral-200"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#ff6700] break-all">
              {formattedResult}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#ff6700]">{toUnit.symbol}</span>
              <button
                onClick={() => handleCopy(formattedResult, 'main')}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                title="Copy result"
              >
                {copiedKey === 'main' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Unit Overview Grid (Famous Xiaomi Converter Feature) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-semibold px-1">
            <span>Instant Multi-Unit Breakdown</span>
            <span>Tap to copy</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activeCategory.units.slice(0, 9).map((unit) => {
              const val = convertValue(numericInput, fromUnit, unit, activeCategory, dataBaseMode);
              const formatted =
                Math.abs(val) > 1e9 || (Math.abs(val) < 1e-4 && val !== 0)
                  ? val.toExponential(4)
                  : parseFloat(val.toPrecision(7)).toString();

              return (
                <div
                  key={unit.id}
                  onClick={() => handleCopy(`${formatted} ${unit.symbol}`, unit.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    unit.id === toUnit.id
                      ? 'bg-[#ff6700]/10 border-[#ff6700]/40'
                      : 'bg-white dark:bg-[#1a1b20] border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                    <span className="truncate">{unit.name}</span>
                    <span className="font-bold text-[#ff6700] ml-1">{unit.symbol}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 truncate">
                    {formatted}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Numeric Keypad for fast mobile typing */}
      <div className="p-3 bg-neutral-100 dark:bg-[#16171b] border-t border-neutral-200/80 dark:border-neutral-800">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {['7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumberInput(n)}
              className="h-11 rounded-xl bg-white dark:bg-[#202126] font-mono text-lg font-semibold mi-key-press shadow-sm"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-11 rounded-xl bg-neutral-200 dark:bg-[#2a2b33] text-[#ff6700] font-bold text-sm mi-key-press"
          >
            C
          </button>

          {['4', '5', '6'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumberInput(n)}
              className="h-11 rounded-xl bg-white dark:bg-[#202126] font-mono text-lg font-semibold mi-key-press shadow-sm"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-11 rounded-xl bg-neutral-200 dark:bg-[#2a2b33] text-neutral-700 dark:text-neutral-300 font-bold text-sm mi-key-press"
          >
            ⌫
          </button>

          {['1', '2', '3'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumberInput(n)}
              className="h-11 rounded-xl bg-white dark:bg-[#202126] font-mono text-lg font-semibold mi-key-press shadow-sm"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleNumberInput('.')}
            className="h-11 rounded-xl bg-white dark:bg-[#202126] font-mono text-lg font-bold mi-key-press shadow-sm"
          >
            .
          </button>

          <div className="col-span-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNumberInput('0')}
              className="h-11 rounded-xl bg-white dark:bg-[#202126] font-mono text-lg font-semibold mi-key-press shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleLogToHistory}
              className="h-11 rounded-xl bg-[#ff6700] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Log to History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
