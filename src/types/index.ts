export type TabMode = 'calculator' | 'converter' | 'financial';
export type CalculatorMode = 'standard' | 'scientific';
export type AngleUnit = 'deg' | 'rad';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  expression: string;
  result: string;
  type: 'standard' | 'scientific' | 'converter' | 'financial';
  category?: string;
  note?: string;
  isPinned?: boolean;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  autoBackup: boolean;
  lastBackupTime: number | null;
  botUsername?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  angleUnit: AngleUnit;
  dataBaseMode: '1024' | '1000'; // 1024 = Binary (KiB/MiB/GiB), 1000 = Decimal (KB/MB/GB)
  currencySymbol?: '₹' | '$' | '€' | '£';
}

export interface BackupPayload {
  version: number;
  signature: 'MI_CALCULATOR_PRO_BACKUP';
  timestamp: number;
  appName: string;
  history: HistoryEntry[];
  settings: AppSettings;
  telegramConfig?: Partial<TelegramConfig>;
  notesCount: number;
}

export interface UnitItem {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // ratio to category standard base unit
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseUnit: string;
  units: UnitItem[];
}
