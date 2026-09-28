import React, { useState } from 'react';
import { AngleUnit } from '../../types';
import { feedback } from '../../utils/audioFeedback';

interface ScientificKeypadProps {
  onInput: (func: string) => void;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onInput,
  angleUnit,
  onToggleAngleUnit,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  const handleKey = (token: string) => {
    feedback.playKeyClick('operator');
    onInput(token);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-5 pb-2 select-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 p-2 rounded-3xl bg-neutral-200/50 dark:bg-[#1a1b20]/60 border border-neutral-300/40 dark:border-neutral-800/60 backdrop-blur-sm">
        {/* Row 1 */}
        <button
          onClick={() => {
            feedback.playKeyClick('action');
            setIsSecond(!isSecond);
          }}
          className={`h-11 sm:h-12 rounded-2xl text-xs font-bold transition-all mi-key-press cursor-pointer ${
            isSecond
              ? 'bg-[#ff6700] text-white shadow-sm'
              : 'bg-white/80 dark:bg-[#25262c] text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-[#2c2d35]'
          }`}
        >
          2nd
        </button>

        <button
          onClick={() => {
            feedback.playKeyClick('action');
            onToggleAngleUnit();
          }}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-bold transition-all mi-key-press cursor-pointer flex items-center justify-center gap-1"
        >
          <span>{angleUnit.toUpperCase()}</span>
        </button>

        <button
          onClick={() => handleKey('sin(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? 'sin⁻¹' : 'sin'}
        </button>

        <button
          onClick={() => handleKey('cos(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? 'cos⁻¹' : 'cos'}
        </button>

        <button
          onClick={() => handleKey('tan(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? 'tan⁻¹' : 'tan'}
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleKey('^')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          xʸ
        </button>

        <button
          onClick={() => handleKey('log(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? '10ˣ' : 'lg'}
        </button>

        <button
          onClick={() => handleKey('ln(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>

        <button
          onClick={() => handleKey('(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-sm font-semibold mi-key-press cursor-pointer"
        >
          (
        </button>

        <button
          onClick={() => handleKey(')')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-sm font-semibold mi-key-press cursor-pointer"
        >
          )
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleKey('√(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          {isSecond ? 'x²' : '√'}
        </button>

        <button
          onClick={() => handleKey('!')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          x!
        </button>

        <button
          onClick={() => handleKey('1/(')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer"
        >
          1/x
        </button>

        <button
          onClick={() => handleKey('e')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-xs font-semibold mi-key-press cursor-pointer italic"
        >
          e
        </button>

        <button
          onClick={() => handleKey('π')}
          className="h-11 sm:h-12 rounded-2xl bg-white/80 dark:bg-[#25262c] text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#2c2d35] text-sm font-semibold mi-key-press cursor-pointer"
        >
          π
        </button>
      </div>
    </div>
  );
};
