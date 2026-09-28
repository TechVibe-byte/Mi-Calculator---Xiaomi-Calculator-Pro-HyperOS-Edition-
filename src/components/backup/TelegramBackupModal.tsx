import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Upload,
  X,
} from 'lucide-react';
import { BackupPayload, TelegramConfig } from '../../types';
import { HistoryStorage } from '../../services/historyStorage';
import { TelegramService } from '../../services/telegramService';
import { feedback } from '../../utils/audioFeedback';

interface TelegramBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramConfig: TelegramConfig;
  onSaveConfig: (config: TelegramConfig) => void;
  onHistoryRestored: () => void;
}

export const TelegramBackupModal: React.FC<TelegramBackupModalProps> = ({
  isOpen,
  onClose,
  telegramConfig,
  onSaveConfig,
  onHistoryRestored,
}) => {
  const [botToken, setBotToken] = useState(telegramConfig.botToken || '');
  const [chatId, setChatId] = useState(telegramConfig.chatId || '');
  const [autoBackup, setAutoBackup] = useState(telegramConfig.autoBackup || false);
  const [showToken, setShowToken] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupResult, setBackupResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackPreview, setRollbackPreview] = useState<{
    payload: BackupPayload;
    date: string;
    count: number;
  } | null>(null);
  const [rollbackStatus, setRollbackStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveAndVerify = async () => {
    feedback.playKeyClick('action');
    if (!botToken.trim()) {
      setVerifyStatus({ success: false, message: 'Please enter a valid Bot Token' });
      return;
    }

    setIsVerifying(true);
    setVerifyStatus(null);

    const tokenRes = await TelegramService.verifyBotToken(botToken);
    if (!tokenRes.success) {
      setIsVerifying(false);
      setVerifyStatus({ success: false, message: tokenRes.error || 'Invalid Bot Token' });
      return;
    }

    // Save token and chat ID
    const newConfig: TelegramConfig = {
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoBackup,
      lastBackupTime: telegramConfig.lastBackupTime,
      botUsername: tokenRes.botUsername,
    };
    onSaveConfig(newConfig);

    // If chat ID is also provided, test sending message
    if (chatId.trim()) {
      const pingRes = await TelegramService.sendTestMessage(newConfig);
      if (pingRes.success) {
        setVerifyStatus({
          success: true,
          message: `Connected to @${tokenRes.botUsername}! Test message delivered to Chat ID ${chatId}.`,
        });
      } else {
        setVerifyStatus({
          success: true,
          message: `Bot @${tokenRes.botUsername} verified! Note: ${pingRes.error || 'Could not send test ping. Make sure you started the bot.'}`,
        });
      }
    } else {
      setVerifyStatus({
        success: true,
        message: `Verified bot @${tokenRes.botUsername}! Please enter your Chat ID to complete setup.`,
      });
    }

    setIsVerifying(false);
  };

  const handlePushBackup = async () => {
    feedback.playKeyClick('action');
    if (!botToken.trim() || !chatId.trim()) {
      setBackupResult({ success: false, message: 'Enter both Bot Token and Chat ID first' });
      return;
    }

    setIsBackingUp(true);
    setBackupResult(null);

    const payload = HistoryStorage.generateBackupPayload();
    const config: TelegramConfig = {
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoBackup,
      lastBackupTime: Date.now(),
      botUsername: telegramConfig.botUsername,
    };

    const res = await TelegramService.pushBackupToTelegram(config, payload);
    setIsBackingUp(false);

    if (res.success) {
      onSaveConfig(config);
      setBackupResult({
        success: true,
        message: `Backup dispatched to Telegram at ${res.date}! File and record summary uploaded.`,
      });
    } else {
      setBackupResult({
        success: false,
        message: res.error || 'Failed to dispatch backup to Telegram',
      });
    }
  };

  const handleFetchRollback = async () => {
    feedback.playKeyClick('action');
    if (!botToken.trim()) {
      setRollbackStatus({ success: false, message: 'Enter Bot Token to fetch backups' });
      return;
    }

    setIsRollingBack(true);
    setRollbackStatus(null);
    setRollbackPreview(null);

    const config: TelegramConfig = {
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoBackup,
      lastBackupTime: telegramConfig.lastBackupTime,
    };

    const res = await TelegramService.fetchLatestBackupFromTelegram(config);
    setIsRollingBack(false);

    if (res.success && res.payload) {
      setRollbackPreview({
        payload: res.payload,
        date: res.backupDate || 'Recent',
        count: res.itemsCount || 0,
      });
    } else {
      setRollbackStatus({
        success: false,
        message: res.error || 'No backup detected in Telegram updates',
      });
    }
  };

  const handleConfirmRollback = () => {
    if (!rollbackPreview) return;
    feedback.playKeyClick('equals');

    const ok = HistoryStorage.applyRollback(rollbackPreview.payload);
    if (ok) {
      onHistoryRestored();
      setRollbackStatus({
        success: true,
        message: `Rollback completed! ${rollbackPreview.count} calculations and settings restored to this device.`,
      });
      setRollbackPreview(null);
    } else {
      setRollbackStatus({
        success: false,
        message: 'Could not apply rollback payload. Format mismatch.',
      });
    }
  };

  const handleDownloadFile = () => {
    feedback.playKeyClick('action');
    const payload = HistoryStorage.generateBackupPayload();
    TelegramService.exportToFile(payload);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const payload = await TelegramService.parseFromFile(file);
      const ok = HistoryStorage.applyRollback(payload);
      if (ok) {
        onHistoryRestored();
        setRollbackStatus({
          success: true,
          message: `Restored ${payload.history.length} calculations from ${file.name}!`,
        });
      }
    } catch (err: unknown) {
      setRollbackStatus({
        success: false,
        message: (err as Error).message || 'Invalid backup file',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-[#18191d] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-[#1a1b20]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Send className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Telegram Cloud & File Backup</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Sync & rollback calculations across multiple phones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Guide Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-3.5 text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center justify-between font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                How Multi-Phone Telegram Backup Works
              </span>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] underline text-blue-600 dark:text-blue-400"
              >
                {showGuide ? 'Hide Guide' : 'Show Instructions'}
              </button>
            </div>
            {showGuide && (
              <ol className="list-decimal ml-4 mt-2 space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>Open Telegram and message <strong>@BotFather</strong>. Type <code>/newbot</code> and follow prompts to get your <strong>Bot Token</strong>.</li>
                <li>Message <strong>@userinfobot</strong> on Telegram to find your numeric <strong>Chat ID</strong>.</li>
                <li>Send a <code>/start</code> message to your new bot.</li>
                <li>Paste the Bot Token and Chat ID below and tap <strong>Backup to Telegram</strong>.</li>
                <li><strong>When switching to another phone</strong>: Open this app on the new phone, enter the same Bot Token & Chat ID, and click <strong>Rollback from Telegram</strong>!</li>
              </ol>
            )}
          </div>

          {/* Telegram Credentials Card */}
          <div className="bg-neutral-50 dark:bg-[#1f2026] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Telegram Credentials
              </h3>
              {telegramConfig.botUsername && (
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  @{telegramConfig.botUsername}
                </span>
              )}
            </div>

            {/* Bot Token */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Telegram Bot Token (API Key)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="e.g. 123456789:ABCdefGHIjklmnoPQRstuv..."
                  className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-white dark:bg-[#282931] border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Chat ID */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Telegram Chat ID (Your User ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="e.g. 987654321"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#282931] border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Auto backup switch */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">Auto-Backup on Calculations</span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Silently pushes new history to your Telegram</p>
              </div>
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => {
                  setAutoBackup(e.target.checked);
                  onSaveConfig({ ...telegramConfig, autoBackup: e.target.checked });
                }}
                className="w-4 h-4 accent-[#ff6700] rounded cursor-pointer"
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSaveAndVerify}
              disabled={isVerifying || !botToken}
              className="w-full py-2 px-3 rounded-xl bg-neutral-200 dark:bg-[#2b2c34] hover:bg-neutral-300 dark:hover:bg-[#343540] text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying with Telegram...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Save & Test Connection</span>
                </>
              )}
            </button>

            {verifyStatus && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                  verifyStatus.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {verifyStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{verifyStatus.message}</span>
              </div>
            )}
          </div>

          {/* Action Grid: Backup vs Rollback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Push Backup */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#1f2026] border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-[#ff6700]">
                    <ArrowUpCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Push to Telegram</h4>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                  Uploads current history and app configuration file directly to your Telegram bot.
                </p>
              </div>

              <button
                onClick={handlePushBackup}
                disabled={isBackingUp || !botToken || !chatId}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-tr from-[#ff5400] to-[#ff7a00] hover:from-[#ff6000] hover:to-[#ff851a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-40 transition cursor-pointer"
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending to Telegram...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Backup to Telegram</span>
                  </>
                )}
              </button>
            </div>

            {/* Fetch Rollback */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#1f2026] border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                    <ArrowDownCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Rollback to this Phone</h4>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                  Restores calculations previously backed up to Telegram onto this new phone.
                </p>
              </div>

              <button
                onClick={handleFetchRollback}
                disabled={isRollingBack || !botToken}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-40 transition cursor-pointer"
              >
                {isRollingBack ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching Backup...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Rollback from Telegram</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backup Result Message */}
          {backupResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                backupResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {backupResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{backupResult.message}</span>
            </div>
          )}

          {/* Rollback Preview Card */}
          {rollbackPreview && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Backup Found in Telegram
                </span>
                <span className="text-xs text-neutral-500">{rollbackPreview.date}</span>
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300">
                Found <strong>{rollbackPreview.count} calculation records</strong>, tagged notes, and user settings ready to rollback.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmRollback}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-md active:scale-95 transition"
                >
                  Confirm & Rollback to this Device
                </button>
                <button
                  onClick={() => setRollbackPreview(null)}
                  className="px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Rollback Status Message */}
          {rollbackStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                rollbackStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {rollbackStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{rollbackStatus.message}</span>
            </div>
          )}

          {/* Local File Backup & Restore (Requested: "telegram backup backup in the file") */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1a1b20] border border-neutral-200 dark:border-neutral-800 space-y-2">
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Local File Backup (.JSON)
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Download your backup as a portable JSON file or upload one from your storage.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleDownloadFile}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-200/80 dark:bg-[#25262c] hover:bg-neutral-300 dark:hover:bg-[#2e2f37] text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save JSON File</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-200/80 dark:bg-[#25262c] hover:bg-neutral-300 dark:hover:bg-[#2e2f37] text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore from File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#1a1b20] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
