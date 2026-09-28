import { BackupPayload, TelegramConfig } from '../types';

export interface TelegramVerifyResult {
  success: boolean;
  botUsername?: string;
  botFirstName?: string;
  error?: string;
}

export interface TelegramBackupResult {
  success: boolean;
  messageId?: number;
  date?: string;
  error?: string;
}

export interface TelegramRollbackResult {
  success: boolean;
  payload?: BackupPayload;
  backupDate?: string;
  itemsCount?: number;
  error?: string;
}

export class TelegramService {
  /**
   * Verify Telegram Bot Token by calling getMe
   */
  public static async verifyBotToken(token: string): Promise<TelegramVerifyResult> {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, error: 'Please enter a valid Telegram Bot Token' };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        success: false,
        error: 'You are currently offline. Cloud sync requires an active internet connection, but all local calculations and JSON file exports work completely offline.',
      };
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
      const data = await res.json();

      if (data.ok && data.result) {
        return {
          success: true,
          botUsername: data.result.username,
          botFirstName: data.result.first_name,
        };
      } else {
        return {
          success: false,
          error: data.description || 'Invalid Telegram Bot Token',
        };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error reaching Telegram API';
      return {
        success: false,
        error: `Could not reach Telegram API: ${message}`,
      };
    }
  }

  /**
   * Send test ping to verify Chat ID
   */
  public static async sendTestMessage(config: TelegramConfig): Promise<{ success: boolean; error?: string }> {
    const cleanToken = config.botToken.trim();
    const cleanChatId = config.chatId.trim();

    if (!cleanToken || !cleanChatId) {
      return { success: false, error: 'Both Bot Token and Chat ID are required' };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        success: false,
        error: 'Cannot send test message while offline. Please connect to Wi-Fi / Mobile Data.',
      };
    }

    try {
      const text = `🔔 <b>Mi Calculator Pro</b>\n\n✅ Telegram Connection Verified successfully!\n📱 Device: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n⏰ Time: ${new Date().toLocaleString()}`;
      
      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await res.json();
      if (data.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.description || 'Failed to send message to Chat ID' };
      }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Send full backup to Telegram via sendDocument (with fallback to sendMessage)
   */
  public static async pushBackupToTelegram(
    config: TelegramConfig,
    payload: BackupPayload
  ): Promise<TelegramBackupResult> {
    const cleanToken = config.botToken.trim();
    const cleanChatId = config.chatId.trim();

    if (!cleanToken || !cleanChatId) {
      return { success: false, error: 'Bot Token and Chat ID must be configured' };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        success: false,
        error: 'You are currently offline. Your calculations remain saved locally. Use "Save JSON File" below for immediate offline backup.',
      };
    }

    try {
      const jsonString = JSON.stringify(payload, null, 2);
      const nowStr = new Date(payload.timestamp).toLocaleString();
      const fileName = `mi_calculator_backup_${Date.now()}.json`;

      const caption = `💾 <b>Xiaomi Mi Calculator Pro — Cloud Backup</b>\n\n` +
        `📅 <b>Date:</b> ${nowStr}\n` +
        `🔢 <b>History Entries:</b> ${payload.history.length}\n` +
        `🏷️ <b>Tagged Notes:</b> ${payload.notesCount}\n` +
        `⚙️ <b>Settings:</b> Theme: ${payload.settings.theme}, Sound: ${payload.settings.soundEnabled ? 'ON' : 'OFF'}, Data Base: ${payload.settings.dataBaseMode}\n\n` +
        `ℹ️ <i>To rollback on another phone: input your Bot Token & Chat ID, then tap 'Rollback from Telegram'.</i>\n` +
        `#MiCalcBackup`;

      // Try sending as document file attachment first (best for full reliability and large history)
      const formData = new FormData();
      const blob = new Blob([jsonString], { type: 'application/json' });
      formData.append('chat_id', cleanChatId);
      formData.append('document', blob, fileName);
      formData.append('caption', caption);
      formData.append('parse_mode', 'HTML');

      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.ok) {
        return {
          success: true,
          messageId: data.result.message_id,
          date: nowStr,
        };
      } else {
        // Fallback to sendMessage with embedded payload if file upload is restricted
        const embeddedText = `${caption}\n\n<pre><code class="language-json">MI_CALC_DATA:${btoa(unescape(encodeURIComponent(jsonString)))}</code></pre>`;
        
        const textRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cleanChatId,
            text: embeddedText.substring(0, 4000), // Telegram message limit
            parse_mode: 'HTML',
          }),
        });

        const textData = await textRes.json();
        if (textData.ok) {
          return { success: true, messageId: textData.result.message_id, date: nowStr };
        }

        return { success: false, error: data.description || textData.description || 'Failed to dispatch backup' };
      }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Network error sending backup' };
    }
  }

  /**
   * Rollback / Restore latest backup from Telegram chat
   */
  public static async fetchLatestBackupFromTelegram(config: TelegramConfig): Promise<TelegramRollbackResult> {
    const cleanToken = config.botToken.trim();
    const cleanChatId = config.chatId.trim();

    if (!cleanToken) {
      return { success: false, error: 'Telegram Bot Token is required' };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        success: false,
        error: 'You are currently offline. Connect to internet to fetch Telegram backups, or use "Restore from File" below to restore offline.',
      };
    }

    try {
      // 1. Get recent updates from bot
      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getUpdates?offset=-25&limit=25`);
      const data = await res.json();

      if (!data.ok) {
        return { success: false, error: data.description || 'Failed to query Telegram updates' };
      }

      const updates = (data.result || []).reverse(); // newest first

      for (const update of updates) {
        const msg = update.message || update.channel_post || update.edited_message;
        if (!msg) continue;

        // Check if message is from target chat if chatId provided
        if (cleanChatId && String(msg.chat?.id) !== cleanChatId) {
          continue;
        }

        // Case A: Message contains Document file (.json)
        if (msg.document && (msg.document.file_name?.includes('mi_calculator_backup') || msg.caption?.includes('MiCalcBackup') || msg.caption?.includes('Xiaomi Mi Calculator'))) {
          const fileId = msg.document.file_id;
          // Get file path
          const fileRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getFile?file_id=${fileId}`);
          const fileData = await fileRes.json();

          if (fileData.ok && fileData.result?.file_path) {
            const downloadUrl = `https://api.telegram.org/file/bot${cleanToken}/${fileData.result.file_path}`;
            const contentRes = await fetch(downloadUrl);
            const contentJson = await contentRes.json();

            if (contentJson && contentJson.signature === 'MI_CALCULATOR_PRO_BACKUP') {
              return {
                success: true,
                payload: contentJson,
                backupDate: new Date(contentJson.timestamp).toLocaleString(),
                itemsCount: contentJson.history?.length || 0,
              };
            }
          }
        }

        // Case B: Message has embedded text code MI_CALC_DATA
        const text = msg.text || msg.caption || '';
        if (text.includes('MI_CALC_DATA:')) {
          try {
            const match = text.match(/MI_CALC_DATA:([A-Za-z0-9+/=]+)/);
            if (match && match[1]) {
              const decoded = decodeURIComponent(escape(atob(match[1])));
              const parsed = JSON.parse(decoded);
              if (parsed.signature === 'MI_CALCULATOR_PRO_BACKUP') {
                return {
                  success: true,
                  payload: parsed,
                  backupDate: new Date(parsed.timestamp).toLocaleString(),
                  itemsCount: parsed.history?.length || 0,
                };
              }
            }
          } catch {
            // continue checking other messages
          }
        }
      }

      return {
        success: false,
        error: 'No backup found in recent Telegram bot updates. Please perform a backup first or send a backup file to the bot.',
      };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to rollback from Telegram' };
    }
  }

  /**
   * Export to downloadable JSON file
   */
  public static exportToFile(payload: BackupPayload) {
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi_calculator_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Read and parse backup from local file
   */
  public static async parseFromFile(file: File): Promise<BackupPayload> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && parsed.signature === 'MI_CALCULATOR_PRO_BACKUP') {
            resolve(parsed);
          } else {
            reject(new Error('Invalid backup file format. Missing MI_CALCULATOR_PRO_BACKUP signature.'));
          }
        } catch {
          reject(new Error('Could not parse JSON from file.'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error.'));
      reader.readAsText(file);
    });
  }
}
