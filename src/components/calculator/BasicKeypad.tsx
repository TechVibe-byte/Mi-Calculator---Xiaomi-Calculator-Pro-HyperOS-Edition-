import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { feedback } from '../../utils/audioFeedback';

interface BasicKeypadProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleScientific: () => void;
  isScientificOpen: boolean;
  hasInput: boolean;
}

export const BasicKeypad: React.FC<BasicKeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onEquals,
  onToggleScientific,
  isScientificOpen,
  hasInput,
}) => {
  const handleKey = (type: 'number' | 'operator' | 'action' | 'equals', action: () => void) => {
    feedback.playKeyClick(type);
    action();
  };

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-5 select-none w-full max-w-lg mx-auto">
      {/* Row 1 */}
      <button
        onClick={() => handleKey('action', onClear)}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-2xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
        aria-label="Clear"
      >
        {hasInput ? 'C' : 'AC'}
      </button>

      <button
        onClick={() => handleKey('action', onBackspace)}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
        aria-label="Backspace"
      >
        <Delete className="w-6 h-6 text-[#ff6700]" />
      </button>

      <button
        onClick={() => handleKey('operator', () => onInput('%'))}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-2xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
      >
        %
      </button>

      <button
        onClick={() => handleKey('operator', () => onInput('÷'))}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-3xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
      >
        ÷
      </button>

      {/* Row 2 */}
      <button
        onClick={() => handleKey('number', () => onInput('7'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        7
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('8'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        8
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('9'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        9
      </button>

      <button
        onClick={() => handleKey('operator', () => onInput('×'))}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-3xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
      >
        ×
      </button>

      {/* Row 3 */}
      <button
        onClick={() => handleKey('number', () => onInput('4'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        4
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('5'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        5
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('6'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        6
      </button>

      <button
        onClick={() => handleKey('operator', () => onInput('−'))}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-3xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
      >
        −
      </button>

      {/* Row 4 */}
      <button
        onClick={() => handleKey('number', () => onInput('1'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        1
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('2'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        2
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('3'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        3
      </button>

      <button
        onClick={() => handleKey('operator', () => onInput('+'))}
        className="h-16 sm:h-18 rounded-3xl bg-neutral-200/80 dark:bg-[#25262c] text-[#ff6700] hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37] text-3xl font-semibold flex items-center justify-center mi-key-press shadow-sm cursor-pointer"
      >
        +
      </button>

      {/* Row 5 */}
      <button
        onClick={() => handleKey('action', onToggleScientific)}
        className={`h-16 sm:h-18 rounded-3xl text-sm font-semibold flex flex-col items-center justify-center gap-1 mi-key-press shadow-sm cursor-pointer transition-colors ${
          isScientificOpen
            ? 'bg-[#ff6700]/15 text-[#ff6700] border border-[#ff6700]/30'
            : 'bg-neutral-200/80 dark:bg-[#25262c] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300/80 dark:hover:bg-[#2e2f37]'
        }`}
        title="Toggle Scientific Keypad"
      >
        <RotateCcw className={`w-5 h-5 transition-transform duration-300 ${isScientificOpen ? 'rotate-180 text-[#ff6700]' : ''}`} />
        <span className="text-[11px] font-medium leading-none">Sci</span>
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('0'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        0
      </button>

      <button
        onClick={() => handleKey('number', () => onInput('.'))}
        className="h-16 sm:h-18 rounded-3xl bg-white dark:bg-[#1e1f24] text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#27282f] text-3xl font-medium flex items-center justify-center mi-key-press shadow-sm cursor-pointer number-mono"
      >
        .
      </button>

      <button
        onClick={() => handleKey('equals', onEquals)}
        className="h-16 sm:h-18 rounded-3xl bg-gradient-to-tr from-[#ff5400] to-[#ff7a00] hover:from-[#ff6000] hover:to-[#ff851a] text-white text-3xl font-medium flex items-center justify-center mi-key-press shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer"
        aria-label="Equals"
      >
        =
      </button>
    </div>
  );
};
