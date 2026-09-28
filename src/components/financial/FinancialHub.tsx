import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CreditCard,
  Heart,
  Percent,
  Receipt,
  Scale,
  Smile,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  calculateAge,
  calculateBmi,
  calculateDiscount,
  calculateGst,
  calculateInvestment,
  calculateLoanEmi,
  calculateSplitBill,
} from '../../utils/financialCalculators';
import { feedback } from '../../utils/audioFeedback';

interface FinancialHubProps {
  onSaveToHistory: (expression: string, result: string, category: string) => void;
  currencySymbol?: string;
  onCurrencyChange?: (symbol: '₹' | '$' | '€' | '£') => void;
}

export const FinancialHub: React.FC<FinancialHubProps> = ({
  onSaveToHistory,
  currencySymbol = '₹',
  onCurrencyChange,
}) => {
  const [activeTool, setActiveTool] = useState<
    'loan' | 'bmi' | 'age' | 'discount' | 'gst' | 'investment' | 'split' | 'date'
  >('loan');

  // Loan State (amounts tailored to INR by default e.g. 5,00,000)
  const [loanPrincipal, setLoanPrincipal] = useState<number>(500000);
  const [loanRate, setLoanRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15);

  // BMI State
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Age State
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');

  // Discount State
  const [origPrice, setOrigPrice] = useState<number>(1999);
  const [discPercent, setDiscPercent] = useState<number>(25);
  const [extraDisc, setExtraDisc] = useState<number>(5);

  // GST State
  const [gstAmount, setGstAmount] = useState<number>(2500);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstInclusive, setGstInclusive] = useState<boolean>(false);

  // Investment State
  const [invInitial, setInvInitial] = useState<number>(25000);
  const [invMonthly, setInvMonthly] = useState<number>(5000);
  const [invRate, setInvRate] = useState<number>(12);
  const [invYears, setInvYears] = useState<number>(10);

  // Split Bill State
  const [billAmount, setBillAmount] = useState<number>(1250);
  const [tipRate, setTipRate] = useState<number>(10);
  const [peopleCount, setPeopleCount] = useState<number>(4);

  // Date Diff State
  const [dateFrom, setDateFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const tools = [
    { id: 'loan', name: 'Loan EMI', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'bmi', name: 'BMI Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'age', name: 'Age & Zodiac', icon: <Smile className="w-4 h-4" /> },
    { id: 'discount', name: 'Discount', icon: <Tag className="w-4 h-4" /> },
    { id: 'gst', name: 'GST / Tax', icon: <Percent className="w-4 h-4" /> },
    { id: 'investment', name: 'Investment', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'split', name: 'Split Bill', icon: <Users className="w-4 h-4" /> },
    { id: 'date', name: 'Date Calc', icon: <Calendar className="w-4 h-4" /> },
  ];

  // Evaluations
  const loanRes = calculateLoanEmi(loanPrincipal, loanRate, loanTenureYears * 12);
  const bmiRes = calculateBmi(weightKg, heightCm);
  const ageRes = calculateAge(birthDate);
  const discRes = calculateDiscount(origPrice, discPercent, extraDisc);
  const gstRes = calculateGst(gstAmount, gstRate, gstInclusive);
  const invRes = calculateInvestment(invInitial, invMonthly, invRate, invYears);
  const splitRes = calculateSplitBill(billAmount, tipRate, peopleCount);

  // Date Diff calculation
  const diffDays = Math.round(
    (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleToolChange = (toolId: typeof activeTool) => {
    feedback.playKeyClick('action');
    setActiveTool(toolId);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-full overflow-hidden select-none">
      {/* Category Pills Strip & Currency Selector */}
      <div className="px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-[#16171b]/50 backdrop-blur-md flex items-center justify-between gap-2">
        <div className="overflow-x-auto no-scrollbar flex items-center gap-2">
          {tools.map((t) => {
            const isActive = t.id === activeTool;
            return (
              <button
                key={t.id}
                onClick={() => handleToolChange(t.id as typeof activeTool)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all mi-key-press cursor-pointer ${
                  isActive
                    ? 'bg-[#ff6700] text-white shadow-md shadow-orange-500/20'
                    : 'bg-neutral-100 dark:bg-[#202126] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#282931]'
                }`}
              >
                {t.icon}
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Currency Switcher */}
        {onCurrencyChange && (
          <div className="flex items-center gap-1 bg-neutral-200/80 dark:bg-[#23242a] p-0.5 rounded-xl shrink-0">
            {(['₹', '$', '€', '£'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => {
                  feedback.playKeyClick('action');
                  onCurrencyChange(curr);
                }}
                className={`w-6 h-6 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  currencySymbol === curr
                    ? 'bg-[#ff6700] text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title={`Use ${curr}`}
              >
                {curr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* 1. Loan EMI */}
        {activeTool === 'loan' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4 rounded-3xl border border-[#ff6700]/30 shadow-sm text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                Monthly Loan EMI
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#ff6700] mt-1">
                {currencySymbol}{loanRes.monthlyEmi.toLocaleString()}
              </div>

              {/* Breakdown ratio bar */}
              <div className="w-full bg-neutral-200 dark:bg-[#272831] h-3 rounded-full mt-4 overflow-hidden flex">
                <div
                  className="bg-[#ff6700] h-full transition-all"
                  style={{ width: `${loanRes.principalPercent}%` }}
                  title={`Principal ${loanRes.principalPercent}%`}
                />
                <div
                  className="bg-amber-400 h-full transition-all"
                  style={{ width: `${loanRes.interestPercent}%` }}
                  title={`Interest ${loanRes.interestPercent}%`}
                />
              </div>

              <div className="flex justify-between items-center text-xs mt-3 px-1 text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff6700]" />
                  <span>Principal: {currencySymbol}{loanPrincipal.toLocaleString()} ({loanRes.principalPercent}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Interest: {currencySymbol}{loanRes.totalInterest.toLocaleString()} ({loanRes.interestPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Loan Principal Amount</span>
                  <span className="text-[#ff6700] font-mono">{currencySymbol}{loanPrincipal.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Annual Interest Rate (%)</span>
                  <span className="text-[#ff6700] font-mono">{loanRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Tenure (Years)</span>
                  <span className="text-[#ff6700] font-mono">{loanTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                feedback.playKeyClick('equals');
                onSaveToHistory(
                  `Loan: ${currencySymbol}${loanPrincipal.toLocaleString()} @ ${loanRate}% for ${loanTenureYears} yrs`,
                  `EMI: ${currencySymbol}${loanRes.monthlyEmi.toLocaleString()}, Total: ${currencySymbol}${loanRes.totalPayment.toLocaleString()}`,
                  'Loan EMI'
                );
              }}
              className="w-full py-3 rounded-2xl bg-[#ff6700] hover:bg-[#ff7a1a] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
            >
              Log Loan to History
            </button>
          </div>
        )}

        {/* 2. BMI Health */}
        {activeTool === 'bmi' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                Body Mass Index
              </span>
              <div className="text-5xl font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {bmiRes.bmi}
              </div>
              <div className={`text-base font-bold ${bmiRes.color} px-3 py-1 rounded-full inline-block bg-neutral-100 dark:bg-[#25262c]`}>
                {bmiRes.category}
              </div>
              <p className="text-xs text-neutral-500">
                Ideal weight for your height: <strong>{bmiRes.idealWeightRange}</strong>
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Weight (kg)</span>
                  <span className="text-[#ff6700] font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Height (cm)</span>
                  <span className="text-[#ff6700] font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                feedback.playKeyClick('equals');
                onSaveToHistory(
                  `BMI: Weight ${weightKg}kg, Height ${heightCm}cm`,
                  `BMI ${bmiRes.bmi} (${bmiRes.category})`,
                  'BMI Health'
                );
              }}
              className="w-full py-3 rounded-2xl bg-[#ff6700] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition"
            >
              Log BMI to History
            </button>
          </div>
        )}

        {/* 3. Age & Zodiac */}
        {activeTool === 'age' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-[#25262c] border border-neutral-200 dark:border-neutral-700 text-sm font-semibold focus:outline-none focus:border-[#ff6700]"
              />
            </div>

            {ageRes && (
              <>
                <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-[#ff6700]/30 text-center">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Exact Age</span>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-[#ff6700] mt-1">
                    {ageRes.years} Y, {ageRes.months} M, {ageRes.days} D
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Next Birthday in: <strong>{ageRes.nextBirthdayCountdown.months} months, {ageRes.nextBirthdayCountdown.days} days</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
                    <span className="text-neutral-400 block mb-0.5">Zodiac Sign</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{ageRes.zodiacSign}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
                    <span className="text-neutral-400 block mb-0.5">Chinese Zodiac</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{ageRes.chineseZodiac}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
                    <span className="text-neutral-400 block mb-0.5">Born on</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{ageRes.dayOfWeekBorn}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
                    <span className="text-neutral-400 block mb-0.5">Total Days Lived</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{ageRes.totalDays.toLocaleString()} days</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 4. Discount */}
        {activeTool === 'discount' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-[#ff6700]/30 text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Final Sale Price</span>
              <div className="text-4xl font-mono font-bold text-[#ff6700] mt-1">
                {currencySymbol}{discRes.finalPrice}
              </div>
              <div className="text-xs text-emerald-500 font-semibold mt-2">
                You Save: {currencySymbol}{discRes.savings} ({discRes.effectiveDiscountPercent}% off)
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Original Price ({currencySymbol})</label>
                <input
                  type="number"
                  value={origPrice}
                  onChange={(e) => setOrigPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Discount (%)</span>
                  <span className="text-[#ff6700] font-mono">{discPercent}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={discPercent}
                  onChange={(e) => setDiscPercent(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Extra Coupon Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={extraDisc}
                  onChange={(e) => setExtraDisc(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold border border-neutral-200 dark:border-neutral-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. GST / Sales Tax */}
        {activeTool === 'gst' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex bg-neutral-100 dark:bg-[#26272e] p-1 rounded-2xl">
                <button
                  onClick={() => setGstInclusive(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    !gstInclusive ? 'bg-[#ff6700] text-white shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  GST Exclusive (Add Tax)
                </button>
                <button
                  onClick={() => setGstInclusive(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    gstInclusive ? 'bg-[#ff6700] text-white shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  GST Inclusive (Remove Tax)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Base Amount ({currencySymbol})</label>
                <input
                  type="number"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Tax Slab Rate (%)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setGstRate(rate)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        gstRate === rate ? 'bg-[#ff6700] text-white' : 'bg-neutral-100 dark:bg-[#25262c] text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-neutral-50 dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Net Amount:</span>
                <span className="font-bold font-mono">{currencySymbol}{gstRes.netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">GST Tax ({gstRate}%):</span>
                <span className="font-bold font-mono text-[#ff6700]">{currencySymbol}{gstRes.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <span>Total Gross Amount:</span>
                <span className="font-mono text-base text-[#ff6700]">{currencySymbol}{gstRes.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Investment */}
        {activeTool === 'investment' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-[#ff6700]/30 text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total Maturity Value</span>
              <div className="text-4xl font-mono font-bold text-[#ff6700] mt-1">
                {currencySymbol}{invRes.maturityAmount.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-500 font-semibold mt-2">
                Wealth Gain / Interest: +{currencySymbol}{invRes.interestEarned.toLocaleString()}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Initial Deposit ({currencySymbol})</label>
                <input
                  type="number"
                  value={invInitial}
                  onChange={(e) => setInvInitial(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Monthly SIP Contribution ({currencySymbol})</label>
                <input
                  type="number"
                  value={invMonthly}
                  onChange={(e) => setInvMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Expected Return (%)</span>
                  <span className="text-[#ff6700] font-mono">{invRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="0.5"
                  value={invRate}
                  onChange={(e) => setInvRate(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Duration (Years)</span>
                  <span className="text-[#ff6700] font-mono">{invYears} yrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={invYears}
                  onChange={(e) => setInvYears(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. Split Bill & Tip */}
        {activeTool === 'split' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-[#ff6700]/30 text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Each Person Pays</span>
              <div className="text-4xl font-mono font-bold text-[#ff6700] mt-1">
                {currencySymbol}{splitRes.perPerson.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Total Bill with Tip: <strong>{currencySymbol}{splitRes.totalAmount.toLocaleString()}</strong> (Tip: {currencySymbol}{splitRes.tipAmount.toLocaleString()})
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Total Bill Amount ({currencySymbol})</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Tip Percentage (%)</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 5, 10, 15, 20].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipRate(t)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        tipRate === t ? 'bg-[#ff6700] text-white' : 'bg-neutral-100 dark:bg-[#25262c] text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Number of People: {peopleCount}</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full accent-[#ff6700]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. Date Difference */}
        {activeTool === 'date' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-[#ff6700]/30 text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Date Difference</span>
              <div className="text-4xl font-mono font-bold text-[#ff6700] mt-1">
                {Math.abs(diffDays)} Days
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Approx {Math.floor(Math.abs(diffDays) / 7)} weeks and {Math.abs(diffDays) % 7} days
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#25262c] text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
