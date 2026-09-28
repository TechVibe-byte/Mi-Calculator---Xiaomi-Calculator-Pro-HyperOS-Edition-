import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Clock,
  Copy,
  Download,
  Edit3,
  FileSpreadsheet,
  Pin,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { HistoryEntry } from '../../types';
import { feedback } from '../../utils/audioFeedback';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onTogglePin: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
  onOpenTelegram: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onTogglePin,
  onUpdateNote,
  onDeleteEntry,
  onClearHistory,
  onOpenTelegram,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesType;
  });

  // Sort pinned first, then by timestamp descending
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });

  const handleCopy = (id: string, text: string) => {
    feedback.playKeyClick('action');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleStartEditNote = (item: HistoryEntry) => {
    setEditingNoteId(item.id);
    setNoteText(item.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, noteText.trim());
    setEditingNoteId(null);
  };

  const exportAsCsv = () => {
    const rows = [
      ['Date', 'Type', 'Expression', 'Result', 'Note'],
      ...history.map((h) => [
        new Date(h.timestamp).toISOString(),
        h.type,
        `"${h.expression.replace(/"/g, '""')}"`,
        `"${h.result.replace(/"/g, '""')}"`,
        `"${(h.note || '').replace(/"/g, '""')}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mi_calc_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end sm:justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl h-full sm:h-[88vh] bg-white dark:bg-[#18191d] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/70 dark:bg-[#1a1b20]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#ff6700]/10 text-[#ff6700]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Calculation History</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {history.length} {history.length === 1 ? 'record' : 'records'} logged
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={exportAsCsv}
              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              title="Export as CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-neutral-200/80 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-[#151619] space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expressions, notes, or numbers..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-[#202126] border border-neutral-200 dark:border-neutral-700/60 focus:outline-none focus:border-[#ff6700] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'standard', 'scientific', 'converter', 'financial'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-full capitalize whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-[#ff6700] text-white font-medium'
                    : 'bg-neutral-200/60 dark:bg-[#23242a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#2a2b32]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {sortedHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Clock className="w-12 h-12 mb-3 opacity-30 stroke-1" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">No calculations recorded yet</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Your arithmetic, scientific formulas, conversions, and loan calculations will automatically be logged here.
              </p>
            </div>
          ) : (
            sortedHistory.map((item) => (
              <div
                key={item.id}
                className={`group p-3.5 rounded-2xl transition-all border ${
                  item.isPinned
                    ? 'bg-amber-500/5 dark:bg-[#ff6700]/5 border-[#ff6700]/30 shadow-sm'
                    : 'bg-neutral-50 dark:bg-[#1d1e23] border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      feedback.playKeyClick('action');
                      onSelectEntry(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase font-semibold tracking-wider">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono break-all line-clamp-2">
                      {item.expression}
                    </div>

                    <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5 break-all">
                      = {item.result}
                    </div>
                  </div>

                  {/* Quick Action Icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isPinned
                          ? 'text-[#ff6700] bg-[#ff6700]/15'
                          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                      }`}
                      title={item.isPinned ? 'Unpin calculation' : 'Pin to top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, item.result)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      title="Copy result"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDeleteEntry(item.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Note section (Xiaomi Mi Calculator style) */}
                <div className="mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/60">
                  {editingNoteId === item.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add note (e.g. Grocery, Flight, Rent)..."
                        className="flex-1 text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#25262c] border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-[#ff6700]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveNote(item.id);
                          if (e.key === 'Escape') setEditingNoteId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveNote(item.id)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#ff6700] text-white font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : item.note ? (
                    <div
                      onClick={() => handleStartEditNote(item)}
                      className="flex items-center justify-between text-xs text-[#ff6700] bg-[#ff6700]/10 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#ff6700]/15 transition"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Bookmark className="w-3 h-3" />
                        {item.note}
                      </span>
                      <Edit3 className="w-3 h-3 opacity-60" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEditNote(item)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center gap-1 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Add label/note</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Clear & Telegram Sync */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#1a1b20] flex items-center justify-between gap-3">
          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-500 font-medium">Clear history?</span>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={history.length === 0}
              className="text-xs text-neutral-500 hover:text-rose-500 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenTelegram();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs font-semibold transition cursor-pointer"
          >
            <span>Cloud & Telegram Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
