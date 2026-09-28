# 📱 Xiaomi Mi Calculator (HyperOS / MIUI Edition)

A high-fidelity, progressive web application (PWA) reproduction and extension of the renowned **Xiaomi Mi Calculator (HyperOS / MIUI)**. Engineered with a responsive multi-device design for laptops and mobile devices, comprehensive computer data unit conversion, full Indian financial & lifestyle suites, a multi-phone cloud backup system via Telegram Bot API, and full offline functionality.

---

## 🌟 Key Features Overview

### 1. 🧮 Calculator Engine (Standard & Scientific)
* **Authentic HyperOS / MIUI Design**: Minimalist clean aesthetic, smooth tactile spring animations (`mi-key-press`), Xiaomi signature orange (`#ff6700`), and subtle Web Audio keypress clicks.
* **Live Calculation Preview**: As you type complex expressions (`1250 * 18% + 50`), a soft live evaluation appears in real-time beneath the input.
* **Smart Backspace & Expression Normalization**: Eliminates consecutive invalid operators and safely handles function names like `sin(`, `ln(`, or `log(`.
* **Scientific Drawer**:
  * Trigonometry: `sin`, `cos`, `tan`, `sin⁻¹`, `cos⁻¹`, `tan⁻¹`
  * Angle Switcher: Instant toggle between **DEG** (Degrees) and **RAD** (Radians)
  * Logarithms & Exponents: `log₁₀`, natural `ln`, `e`, `π`, `xʸ`, `√`, `x!`, `1/x`, `(`, `)`
* **Keyboard Shortcuts (Laptops & Desktops)**:
  * Numbers `0-9`, decimal point `.`
  * Arithmetic: `+`, `-`, `*` or `x`, `/`
  * Action keys: `Enter` or `=` to evaluate, `Backspace` to delete, `Escape` or `c` to clear.
* **Dynamic Font Autoscaling**: Adapts display text size automatically as expressions grow longer, preventing layout overflow.

---

### 2. 💾 Computer Data Storage Converter & Unit Hub
* **Computer Data Storage Suite**:
  * Supported units: **Bits (b)**, **Bytes (B)**, **Kilobytes (KB)**, **Megabytes (MB)**, **Gigabytes (GB)**, **Terabytes (TB)**, **Petabytes (PB)**, **Exabytes (EB)**, **Megabits (Mb)**, **Gigabits (Gb)**.
  * **Base Switch (Binary 1024 vs. Decimal 1000)**:
    * **1024 Binary Base-2** (`1 KB = 1024 B`, `1 MB = 1024 KB`, `1 GB = 1024 MB`): Standard for RAM, operating systems, and disk sector calculations.
    * **1000 Decimal Base-10** (`1 KB = 1000 B`, `1 MB = 1000 KB`): Standard for commercial storage manufacturer packaging (SSDs/HDDs) and networking.
  * **Multi-Unit Breakdown Grid**: Instant side-by-side breakdown across all storage units simultaneously with one-tap copy.
* **11 Additional Unit Converters**:
  1. **Currency**: Indian Rupee (**₹ INR**) as primary base unit with instant exchange ratios against USD ($), EUR (€), GBP (£), AED, SAR, KWD, CAD, AUD, SGD, CNY, JPY, and CHF.
  2. **Length**: Millimeter, Centimeter, Meter, Kilometer, Inch, Foot, Yard, Mile, Nautical Mile.
  3. **Mass & Weight**: Milligram, Gram, Kilogram, Metric Ton, Ounce, Pound, Stone.
  4. **Area**: Square Millimeter, Square Centimeter, Square Meter, Square Kilometer, Square Foot, Square Yard, Acre, Hectare.
  5. **Volume**: Milliliter, Liter, Cubic Meter, Gallon (US), Quart (US), Pint (US), Fluid Ounce (US).
  6. **Temperature**: Celsius (°C), Fahrenheit (°F), Kelvin (K).
  7. **Speed**: m/s, km/h, mph, Knot, Mach.
  8. **Time**: Millisecond, Second, Minute, Hour, Day, Week, Month (30d), Year (365d).
  9. **Pressure**: Pascal (Pa), Kilopascal (kPa), Bar, PSI, Standard Atmosphere (atm), mmHg.
  10. **Energy**: Joule (J), Kilojoule (kJ), Calorie (cal), Kilocalorie (kcal), Watt-hour (Wh), Kilowatt-hour (kWh), Electronvolt (eV).
  11. **Power**: Watt (W), Kilowatt (kW), Megawatt (MW), Horsepower (hp).

---

### 3. 💰 Indian Financial & Lifestyle Suite
All tools are configured in **Indian Rupee (₹ INR)** by default, with an optional quick-switcher for international currencies (`₹`, `$`, `€`, `£`).
1. **Loan / Mortgage EMI**:
   * Computes monthly EMI, total interest, and total payable amount.
   * Visual **Principal vs. Interest percentage ratio progress bar**.
   * Sliders designed for Indian values (from ₹10,000 to ₹1,00,00,000+).
2. **BMI Health Calculator**:
   * Evaluates Body Mass Index using height (cm) and weight (kg).
   * Color-coded health classification: Underweight, Normal, Overweight, Obese.
   * Displays the ideal healthy weight range for the user's specific height.
3. **Age & Zodiac Calculator**:
   * Exact breakdown: Years, Months, and Days lived.
   * Countdown to next birthday (exact months and days remaining).
   * Western Zodiac Sign & Chinese Zodiac Animal.
   * Day of the week of birth and total cumulative days lived.
4. **Discount & Savings Calculator**:
   * Original price, primary discount percentage, and extra coupon discount deductions.
   * Displays final sale price, total savings amount, and net effective discount.
5. **GST / Tax Calculator**:
   * **GST Exclusive (Add Tax)**: Calculates net amount, GST tax, and total gross.
   * **GST Inclusive (Extract Tax)**: Extracts base price and tax component from gross totals.
   * Instant preset slab buttons: **5%**, **12%**, **18%**, **28%**.
6. **Investment & Wealth (SIP / Lump Sum)**:
   * Calculates total maturity amount, initial principal, cumulative SIP deposits, and total wealth gains/interest earned over the investment horizon.
7. **Split Bill & Tip**:
   * Split total bills among friends with configurable tip percentages.
   * Precise per-person payment share.
8. **Date Difference**:
   * Days and weeks between two calendar dates.

---

### 4. ☁️ Multi-Phone Telegram Cloud Backup & Rollback
Switching between phones or devices often leads to lost calculation histories. This app introduces a zero-server-cost cloud sync powered by Telegram Bot API:
* **Bot Verification (`getMe`)**: Validates the bot token and verifies the `@bot_username`.
* **Push Backup to Telegram**: Packages history records, tagged notes, favorites, and settings into an encrypted JSON payload and uploads it as a document directly to your Telegram chat.
* **Rollback from Telegram**: When opening the app on a second phone or new browser, enter the Bot Token & Chat ID and tap **Rollback from Telegram** to restore your complete state.
* **Auto-Backup**: Option to silently push backups to your Telegram bot upon every calculation.
* **Offline Local File Backup (`.json`)**: Export and import your backup directly as a `.json` file from local storage without needing internet access.

---

### 5. 🗂️ Structured History Log & Notes
* **Chronological History**: Records timestamp, category tag, math expression, and formatted result.
* **Tagging & Notes**: Attach custom notes to any entry (e.g. *"Grocery"*, *"Flight ticket"*, *"House rent"*).
* **Favorites / Pinned Calculations**: Pin critical calculations to the top of the history modal.
* **Restore to Display**: Tap any entry to load the result directly into the active calculator display.
* **Data Export**: Export calculation histories to `.csv` or `.json`.

---

### 6. 📱 Progressive Web App (PWA) & Offline Capabilities
* **100% Offline Functional**:
  * Precached application bundle via Workbox Service Worker (`sw.js`).
  * `navigateFallback: '/index.html'` guarantees smooth page refreshes offline.
  * Local font caching (`CacheFirst` for Google Fonts).
  * In-app offline status banner when disconnected.
* **Installation Experience**:
  * Header **"Install App"** button with native Chromium prompt and iOS Safari guide.
  * Full icon branding: Squircle Mi logo displayed on splash screen, installation modal, and device home screen.
  * Standalone display mode with custom theme bar color (`#ff6700`).

---

### 7. 💻 Desktop / Laptop Dual-Pane Layout
* On mobile screens, the app acts as a streamlined full-screen mobile calculator.
* On laptop / desktop displays, the layout expands into a **dual-column workstation** with an always-visible **Live History Log** on the right side.
* **Floating Mini-Calculator**: A draggable, picture-in-picture mini window that stays visible while multitasking.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS 4, Lucide Icons, Custom MIUI CSS |
| **PWA & Offline** | `vite-plugin-pwa`, Workbox, Web App Manifest |
| **Audio & Haptics** | Web Audio API synthesize click haptics (no external audio assets needed) |
| **Cloud Sync** | Telegram Bot API (`sendMessage`, `sendDocument`, `getUpdates`, `getFile`) |
| **State Storage** | LocalStorage API + Safe JSON Schema Serialization |

---

## 📁 Project Structure

```text
├── index.html                           # HTML entry point with PWA meta tags & splash colors
├── package.json                         # Dependencies & npm scripts
├── public/
│   ├── icon.svg                         # High-res vector Xiaomi Mi Calculator logo
│   ├── icon-192.png                     # Standard PWA launcher icon
│   ├── icon-512.png                     # High-res PWA launcher icon
│   └── apple-touch-icon.png             # iOS Safari home screen icon
├── src/
│   ├── App.tsx                          # Primary app shell, responsive layout, shortcuts listener
│   ├── main.tsx                         # React root & service worker registration
│   ├── index.css                        # Tailwind 4 configuration & tactile spring animations
│   ├── types/
│   │   └── index.ts                     # TypeScript definitions for History, Converters, Settings
│   ├── components/
│   │   ├── backup/
│   │   │   └── TelegramBackupModal.tsx  # Telegram credentials, Push & Rollback UI, File backup
│   │   ├── calculator/
│   │   │   ├── BasicKeypad.tsx          # Xiaomi 4x5 tactile keypad
│   │   │   └── ScientificKeypad.tsx     # Trigonometric, logarithmic, and power functions
│   │   ├── common/
│   │   │   ├── FloatingCalcWidget.tsx   # Draggable Picture-in-Picture mini calculator
│   │   │   └── Header.tsx               # Brand logo, segmented tabs, theme, audio, PWA button
│   │   ├── converters/
│   │   │   └── ConvertersHub.tsx        # 12 converters + Computer data 1024/1000 base switcher
│   │   ├── financial/
│   │   │   └── FinancialHub.tsx         # Loan EMI, BMI, Age, Discount, GST, SIP, Split Bill
│   │   ├── history/
│   │   │   └── HistoryModal.tsx         # History drawer, search, notes, export, and delete
│   │   └── pwa/
│   │       ├── OfflineIndicator.tsx     # Non-intrusive offline connectivity banner
│   │       ├── PWAInstallButton.tsx     # App logo install modal with Android & iOS steps
│   │       └── usePWAInstall.ts         # Hook tracking `beforeinstallprompt` & standalone mode
│   ├── services/
│   │   ├── historyStorage.ts            # LocalStorage persistence, backup payloads & migrations
│   │   └── telegramService.ts          # Telegram Bot API integration (cloud sync & rollback)
│   └── utils/
│       ├── audioFeedback.ts             # Web Audio API synthetic key click engine
│       ├── calculatorEngine.ts          # Mathematical evaluator & precision formatting
│       ├── converterData.ts             # Conversion factors, units, and base-1024/1000 math
│       └── financialCalculators.ts      # EMI, BMI, GST, Age, and investment algorithms
└── vite.config.ts                       # Vite configuration with Workbox PWA caching rules
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation
1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd mi-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Generates production assets, precache manifests, and the service worker in the `dist/` directory.

---

## 📖 Telegram Cloud Backup Setup Guide

To sync calculations across multiple devices (e.g. from an Android phone to an iPhone or PC):

1. **Obtain a Bot Token**:
   * Open Telegram and search for `@BotFather`.
   * Send the command `/newbot` and follow the instructions to name your bot.
   * Copy the HTTP API token provided by BotFather (e.g. `123456789:ABCdefGHI...`).

2. **Obtain your Chat ID**:
   * In Telegram, message `@userinfobot` or `@raw_data_bot`.
   * It will reply with your numeric `Id` (e.g. `987654321`).

3. **Link to Mi Calculator**:
   * Open the app, tap the **Send / Telegram icon** in the header.
   * Paste your **Bot Token** and **Chat ID**.
   * Click **Save & Test Connection**.
   * Click **Backup to Telegram** to upload your history.

4. **Rollback on Another Phone**:
   * Open the app on your second device.
   * Open the Telegram modal, enter the same **Bot Token** and **Chat ID**.
   * Click **Rollback from Telegram** — your calculations and settings will instantly restore.

---

## 📄 License
Licensed under the [Apache-2.0 License](LICENSE).
