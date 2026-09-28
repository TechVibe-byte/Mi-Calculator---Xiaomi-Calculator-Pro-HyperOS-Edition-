import { AppSettings, BackupPayload, HistoryEntry, TelegramConfig } from '../types';
import { TelegramService } from './telegramService';

const HISTORY_KEY = 'mi_calc_history_v1';
const SETTINGS_KEY = 'mi_calc_settings_v1';
const TELEGRAM_KEY = 'mi_calc_telegram_v1';

export const defaultSettings: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true,
  angleUnit: 'deg',
  dataBaseMode: '1024',
  currencySymbol: '₹',
};

export const defaultTelegramConfig: TelegramConfig = {
  botToken: '',
  chatId: '',
  autoBackup: false,
  lastBackupTime: null,
};

export class HistoryStorage {
  public static getHistory(): HistoryEntry[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveHistory(entries: HistoryEntry[]) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    } catch {
      // Ignore quota errors
    }
  }

  public static addEntry(
    expression: string,
    result: string,
    type: HistoryEntry['type'] = 'standard',
    category?: string
  ): HistoryEntry {
    const entries = this.getHistory();
    // Prevent duplicate consecutive entries with identical expression and result
    if (entries.length > 0 && entries[0].expression === expression && entries[0].result === result) {
      return entries[0];
    }

    const newEntry: HistoryEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      expression,
      result,
      type,
      category,
      isPinned: false,
    };

    const updated = [newEntry, ...entries].slice(0, 500); // retain up to 500 records
    this.saveHistory(updated);

    // Check auto backup if configured
    this.checkAutoBackup(updated);

    return newEntry;
  }

  public static togglePin(id: string): HistoryEntry[] {
    const entries = this.getHistory();
    const updated = entries.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item));
    this.saveHistory(updated);
    return updated;
  }

  public static updateNote(id: string, note: string): HistoryEntry[] {
    const entries = this.getHistory();
    const updated = entries.map((item) => (item.id === id ? { ...item, note } : item));
    this.saveHistory(updated);
    return updated;
  }

  public static deleteEntry(id: string): HistoryEntry[] {
    const entries = this.getHistory();
    const updated = entries.filter((item) => item.id !== id);
    this.saveHistory(updated);
    return updated;
  }

  public static clearHistory(): HistoryEntry[] {
    // Keep pinned items if any, or clear all
    const entries = this.getHistory();
    const pinned = entries.filter((item) => item.isPinned);
    this.saveHistory(pinned);
    return pinned;
  }

  public static clearAllPermanently() {
    this.saveHistory([]);
  }

  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  public static saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage error
    }
  }

  public static getTelegramConfig(): TelegramConfig {
    try {
      const data = localStorage.getItem(TELEGRAM_KEY);
      return data ? { ...defaultTelegramConfig, ...JSON.parse(data) } : defaultTelegramConfig;
    } catch {
      return defaultTelegramConfig;
    }
  }

  public static saveTelegramConfig(config: TelegramConfig) {
    try {
      localStorage.setItem(TELEGRAM_KEY, JSON.stringify(config));
    } catch {
      // Storage error
    }
  }

  public static generateBackupPayload(): BackupPayload {
    const history = this.getHistory();
    const settings = this.getSettings();
    const telegramConfig = this.getTelegramConfig();

    return {
      version: 1,
      signature: 'MI_CALCULATOR_PRO_BACKUP',
      timestamp: Date.now(),
      appName: 'Xiaomi Mi Calculator Pro',
      history,
      settings,
      telegramConfig: {
        chatId: telegramConfig.chatId,
        autoBackup: telegramConfig.autoBackup,
      },
      notesCount: history.filter((h) => !!h.note).length,
    };
  }

  public static applyRollback(payload: BackupPayload): boolean {
    if (!payload || payload.signature !== 'MI_CALCULATOR_PRO_BACKUP') {
      return false;
    }

    if (Array.isArray(payload.history)) {
      this.saveHistory(payload.history);
    }
    if (payload.settings) {
      this.saveSettings({ ...defaultSettings, ...payload.settings });
    }
    if (payload.telegramConfig) {
      const currentTg = this.getTelegramConfig();
      this.saveTelegramConfig({
        ...currentTg,
        ...payload.telegramConfig,
        lastBackupTime: payload.timestamp,
      });
    }
    return true;
  }

  private static autoBackupDebounceTimer: NodeJS.Timeout | null = null;
  private static checkAutoBackup(history: HistoryEntry[]) {
    const tg = this.getTelegramConfig();
    if (!tg.autoBackup || !tg.botToken || !tg.chatId) return;

    if (this.autoBackupDebounceTimer) {
      clearTimeout(this.autoBackupDebounceTimer);
    }

    this.autoBackupDebounceTimer = setTimeout(() => {
      const payload = this.generateBackupPayload();
      TelegramService.pushBackupToTelegram(tg, payload)
        .then((res) => {
          if (res.success) {
            this.saveTelegramConfig({ ...tg, lastBackupTime: Date.now() });
          }
        })
        .catch(() => {});
    }, 4000);
  }
}
