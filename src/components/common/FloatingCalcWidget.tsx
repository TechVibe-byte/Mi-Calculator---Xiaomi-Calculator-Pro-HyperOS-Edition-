import React, { useState } from 'react';
import { Delete, Minus, Move, X } from 'lucide-react';
import { CalculatorEngine } from '../../utils/calculatorEngine';
import { feedback } from '../../utils/audioFeedback';

interface FloatingCalcWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onLogToHistory: (expression: string, result: string) => void;
}

export const FloatingCalcWidget: React.FC<FloatingCalcWidgetProps> = ({
  isOpen,
  onClose,
  onLogToHistory,
}) => {
  const [expr, setExpr] = useState('0');
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = Math.max(10, Math.min(window.innerWidth - 260, e.clientX - dragOffset.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 340, e.clientY - dragOffset.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKey = (char: string) => {
    feedback.playKeyClick('number');
    if (expr === '0' && !'+−×÷%'.includes(char)) {
      setExpr(char);
    } else {
      setExpr(expr + char);
    }
  };

  const handleClear = () => {
    feedback.playKeyClick('action');
    setExpr('0');
  };

  const handleBackspace = () => {
    feedback.playKeyClick('action');
    if (expr.length <= 1) setExpr('0');
    else setExpr(expr.slice(0, -1));
  };

  const handleEquals = () => {
    feedback.playKeyClick('equals');
    const { result, numericValue } = CalculatorEngine.evaluate(expr);
    if (numericValue !== null) {
      onLogToHistory(expr, result);
      setExpr(result.replace(/,/g, ''));
    }
  };

  const livePreview = CalculatorEngine.evaluate(expr).result;

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed z-50 w-60 rounded-3xl bg-white/95 dark:bg-[#1a1b20]/95 backdrop-blur-md shadow-2xl border border-neutral-300 dark:border-neutral-700/80 p-3 select-none flex flex-col gap-2 touch-none animate-in zoom-in-95 duration-150"
    >
      {/* Title bar */}
      <div
        onPointerDown={handlePointerDown}
        className="flex items-center justify-between cursor-move pb-1 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400"
      >
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
          <Move className="w-3.5 h-3.5 text-[#ff6700]" />
          <span>Floating Calc</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Display */}
      <div className="text-right px-2 py-1 bg-neutral-100 dark:bg-[#202126] rounded-xl font-mono">
        <div className="text-xs text-neutral-400 truncate">{expr}</div>
        <div className="text-lg font-bold text-[#ff6700] truncate">
          = {livePreview || '0'}
        </div>
      </div>

      {/* Mini Keypad */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
        <button onClick={handleClear} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700]">C</button>
        <button onClick={handleBackspace} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-neutral-600 dark:text-neutral-300">⌫</button>
        <button onClick={() => handleKey('%')} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700]">%</button>
        <button onClick={() => handleKey('÷')} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700] text-sm">÷</button>

        <button onClick={() => handleKey('7')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">7</button>
        <button onClick={() => handleKey('8')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">8</button>
        <button onClick={() => handleKey('9')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">9</button>
        <button onClick={() => handleKey('×')} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700] text-sm">×</button>

        <button onClick={() => handleKey('4')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">4</button>
        <button onClick={() => handleKey('5')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">5</button>
        <button onClick={() => handleKey('6')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">6</button>
        <button onClick={() => handleKey('−')} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700] text-sm">−</button>

        <button onClick={() => handleKey('1')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">1</button>
        <button onClick={() => handleKey('2')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">2</button>
        <button onClick={() => handleKey('3')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">3</button>
        <button onClick={() => handleKey('+')} className="h-8 rounded-lg bg-neutral-200 dark:bg-[#282931] text-[#ff6700] text-sm">+</button>

        <button onClick={() => handleKey('0')} className="col-span-2 h-8 rounded-lg bg-white dark:bg-[#23242a]">0</button>
        <button onClick={() => handleKey('.')} className="h-8 rounded-lg bg-white dark:bg-[#23242a]">.</button>
        <button onClick={handleEquals} className="h-8 rounded-lg bg-[#ff6700] text-white font-bold">=</button>
      </div>
    </div>
  );
};
