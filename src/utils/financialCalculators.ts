// Financial and Life tools calculations for Xiaomi Calculator clone

export interface LoanResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
}

export function calculateLoanEmi(principal: number, annualRatePercent: number, tenureMonths: number): LoanResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, principalPercent: 100, interestPercent: 0 };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const principalPercent = (principal / totalPayment) * 100;
  const interestPercent = (totalInterest / totalPayment) * 100;

  return {
    monthlyEmi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    principalPercent: Math.round(principalPercent),
    interestPercent: Math.round(interestPercent),
  };
}

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  idealWeightRange: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: 'Normal weight', color: 'text-emerald-500', idealWeightRange: '0 - 0 kg' };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBmi = Math.round(bmi * 10) / 10;

  const minIdeal = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxIdeal = Math.round(24.9 * heightM * heightM * 10) / 10;

  let category: BmiResult['category'] = 'Normal weight';
  let color = 'text-emerald-500';

  if (roundedBmi < 18.5) {
    category = 'Underweight';
    color = 'text-blue-500';
  } else if (roundedBmi <= 24.9) {
    category = 'Normal weight';
    color = 'text-emerald-500';
  } else if (roundedBmi <= 29.9) {
    category = 'Overweight';
    color = 'text-amber-500';
  } else {
    category = 'Obese';
    color = 'text-rose-500';
  }

  return {
    bmi: roundedBmi,
    category,
    color,
    idealWeightRange: `${minIdeal} - ${maxIdeal} kg`,
  };
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalWeeks: number;
  nextBirthdayCountdown: { months: number; days: number };
  dayOfWeekBorn: string;
  zodiacSign: string;
  chineseZodiac: string;
}

export function calculateAge(birthDateStr: string, targetDateStr?: string): AgeResult | null {
  const birth = new Date(birthDateStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
    return null;
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;
  const totalWeeks = Math.floor(totalDays / 7);

  // Next birthday
  let nextBdayYear = target.getFullYear();
  let nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBdayYear++;
    nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
  }

  let nbMonths = nextBday.getMonth() - target.getMonth();
  let nbDays = nextBday.getDate() - target.getDate();
  if (nbDays < 0) {
    nbMonths--;
    const prev = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0).getDate();
    nbDays += prev;
  }
  if (nbMonths < 0) nbMonths += 12;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birth.getDay()];

  // Zodiac
  const month = birth.getMonth() + 1;
  const day = birth.getDate();
  let zodiacSign = '';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = 'Aquarius ♒';
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) zodiacSign = 'Pisces ♓';
  else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = 'Aries ♈';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = 'Taurus ♉';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = 'Gemini ♊';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = 'Cancer ♋';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = 'Leo ♌';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = 'Virgo ♍';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = 'Libra ♎';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = 'Scorpio ♏';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = 'Sagittarius ♐';
  else zodiacSign = 'Capricorn ♑';

  const animals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
  const chineseZodiac = animals[(birth.getFullYear() - 4) % 12];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalWeeks,
    nextBirthdayCountdown: { months: nbMonths, days: nbDays },
    dayOfWeekBorn,
    zodiacSign,
    chineseZodiac,
  };
}

export function calculateDiscount(originalPrice: number, discountPercent: number, extraDiscount: number = 0) {
  const priceAfterFirst = originalPrice * (1 - discountPercent / 100);
  const finalPrice = priceAfterFirst * (1 - extraDiscount / 100);
  const savings = Math.max(0, originalPrice - finalPrice);
  const effectiveDiscountPercent = originalPrice > 0 ? (savings / originalPrice) * 100 : 0;

  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    effectiveDiscountPercent: Math.round(effectiveDiscountPercent * 10) / 10,
  };
}

export function calculateGst(amount: number, ratePercent: number, isInclusive: boolean) {
  if (isInclusive) {
    // Amount contains GST
    const base = amount / (1 + ratePercent / 100);
    const tax = amount - base;
    return {
      netAmount: Math.round(base * 100) / 100,
      taxAmount: Math.round(tax * 100) / 100,
      totalAmount: Math.round(amount * 100) / 100,
      cgst: Math.round((tax / 2) * 100) / 100,
      sgst: Math.round((tax / 2) * 100) / 100,
    };
  } else {
    // Add GST to amount
    const tax = amount * (ratePercent / 100);
    const total = amount + tax;
    return {
      netAmount: Math.round(amount * 100) / 100,
      taxAmount: Math.round(tax * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
      cgst: Math.round((tax / 2) * 100) / 100,
      sgst: Math.round((tax / 2) * 100) / 100,
    };
  }
}

export function calculateInvestment(
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number
) {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = years * 12;

  let balance = initialAmount;
  let totalInvested = initialAmount;

  for (let i = 0; i < totalMonths; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalInvested += monthlyContribution;
  }

  const interestEarned = Math.max(0, balance - totalInvested);

  return {
    maturityAmount: Math.round(balance * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    interestEarned: Math.round(interestEarned * 100) / 100,
  };
}

export function calculateSplitBill(billAmount: number, tipPercent: number, people: number) {
  const safePeople = Math.max(1, people);
  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;
  const perPerson = totalAmount / safePeople;
  const perPersonTip = tipAmount / safePeople;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    perPerson: Math.round(perPerson * 100) / 100,
    perPersonTip: Math.round(perPersonTip * 100) / 100,
  };
}
