export interface ConverterUnit {
  id: string;
  name: string;
  symbol: string;
  factor: number; // ratio to base unit
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
}

export interface ConverterCategoryConfig {
  id: string;
  name: string;
  iconName: string;
  description: string;
  baseUnitId: string;
  units: ConverterUnit[];
  hasBaseSwitch?: boolean; // For Computer Data 1024 vs 1000
}

export const CONVERTER_CATEGORIES: ConverterCategoryConfig[] = [
  {
    id: 'data',
    name: 'Computer Data',
    iconName: 'Database',
    description: 'Bits, Bytes, KB, MB, GB, TB, PB',
    baseUnitId: 'byte',
    hasBaseSwitch: true,
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', factor: 0.125 },
      { id: 'byte', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1024 * 1024 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1024 * 1024 * 1024 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
      { id: 'pb', name: 'Petabyte', symbol: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 },
      { id: 'eb', name: 'Exabyte', symbol: 'EB', factor: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
      { id: 'mbit', name: 'Megabit', symbol: 'Mb', factor: (1024 * 1024) / 8 },
      { id: 'gbit', name: 'Gigabit', symbol: 'Gb', factor: (1024 * 1024 * 1024) / 8 },
    ],
  },
  {
    id: 'currency',
    name: 'Currency',
    iconName: 'Coins',
    description: 'INR, USD, EUR, GBP, AED, CNY, JPY...',
    baseUnitId: 'inr',
    units: [
      { id: 'inr', name: 'Indian Rupee', symbol: '₹ INR', factor: 1 },
      { id: 'usd', name: 'US Dollar', symbol: '$ USD', factor: 87.2 },
      { id: 'eur', name: 'Euro', symbol: '€ EUR', factor: 95.1 },
      { id: 'gbp', name: 'British Pound', symbol: '£ GBP', factor: 111.8 },
      { id: 'aed', name: 'UAE Dirham', symbol: 'AED', factor: 23.74 },
      { id: 'cad', name: 'Canadian Dollar', symbol: '$ CAD', factor: 64.5 },
      { id: 'aud', name: 'Australian Dollar', symbol: '$ AUD', factor: 57.6 },
      { id: 'sgd', name: 'Singapore Dollar', symbol: 'S$ SGD', factor: 65.4 },
      { id: 'cny', name: 'Chinese Yuan', symbol: '¥ CNY', factor: 12.0 },
      { id: 'jpy', name: 'Japanese Yen', symbol: '¥ JPY', factor: 0.58 },
      { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', factor: 98.4 },
      { id: 'sar', name: 'Saudi Riyal', symbol: 'SAR', factor: 23.2 },
      { id: 'kwd', name: 'Kuwaiti Dinar', symbol: 'KWD', factor: 284.0 },
    ],
  },
  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    description: 'km, m, cm, mm, mile, yard, foot, inch',
    baseUnitId: 'meter',
    units: [
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'meter', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'dm', name: 'Decimeter', symbol: 'dm', factor: 0.1 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', factor: 1e-6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
      { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'NM', factor: 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    description: 'kg, g, tonne, lb, oz, carat, stone',
    baseUnitId: 'kg',
    units: [
      { id: 'tonne', name: 'Metric Tonne', symbol: 't', factor: 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 1e-6 },
      { id: 'ug', name: 'Microgram', symbol: 'µg', factor: 1e-9 },
      { id: 'quintal', name: 'Quintal', symbol: 'q', factor: 100 },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.0002 },
      { id: 'stone', name: 'Stone', symbol: 'st', factor: 6.35029 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Maximize2',
    description: 'sq m, sq km, hectare, acre, sq ft',
    baseUnitId: 'sq_m',
    units: [
      { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', factor: 10000 },
      { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224 },
      { id: 'sq_m', name: 'Square Meter', symbol: 'm²', factor: 1 },
      { id: 'sq_dm', name: 'Square Decimeter', symbol: 'dm²', factor: 0.01 },
      { id: 'sq_cm', name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      { id: 'sq_mm', name: 'Square Millimeter', symbol: 'mm²', factor: 1e-6 },
      { id: 'sq_mile', name: 'Square Mile', symbol: 'mi²', factor: 2589988.110336 },
      { id: 'sq_yd', name: 'Square Yard', symbol: 'yd²', factor: 0.83612736 },
      { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
      { id: 'sq_in', name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      { id: 'mu', name: 'Chinese Mu (亩)', symbol: 'mu', factor: 666.6667 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    iconName: 'Box',
    description: 'm³, liter, ml, gallon, pint, fl oz',
    baseUnitId: 'liter',
    units: [
      { id: 'cu_m', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { id: 'liter', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'dl', name: 'Deciliter', symbol: 'dL', factor: 0.1 },
      { id: 'cl', name: 'Centiliter', symbol: 'cL', factor: 0.01 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { id: 'cu_cm', name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal (US)', factor: 3.78541 },
      { id: 'gal_uk', name: 'Gallon (UK)', symbol: 'gal (UK)', factor: 4.54609 },
      { id: 'qt_us', name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { id: 'pt_us', name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', factor: 0.24 },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', factor: 0.0147868 },
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', factor: 0.00492892 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    description: 'Celsius, Fahrenheit, Kelvin',
    baseUnitId: 'celsius',
    units: [
      {
        id: 'celsius',
        name: 'Celsius',
        symbol: '°C',
        factor: 1,
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: 'fahrenheit',
        name: 'Fahrenheit',
        symbol: '°F',
        factor: 1,
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      {
        id: 'kelvin',
        name: 'Kelvin',
        symbol: 'K',
        factor: 1,
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
      {
        id: 'rankine',
        name: 'Rankine',
        symbol: '°R',
        factor: 1,
        toBase: (v) => ((v - 491.67) * 5) / 9,
        fromBase: (v) => ((v + 273.15) * 9) / 5,
      },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    iconName: 'Gauge',
    description: 'km/h, m/s, mph, knot, Mach',
    baseUnitId: 'mps',
    units: [
      { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', factor: 1 / 3.6 },
      { id: 'mps', name: 'Meter per second', symbol: 'm/s', factor: 1 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
      { id: 'fps', name: 'Foot per second', symbol: 'ft/s', factor: 0.3048 },
      { id: 'mach', name: 'Mach (Sound speed)', symbol: 'Mach', factor: 340.29 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    description: 'year, month, week, day, hour, min, sec',
    baseUnitId: 'second',
    units: [
      { id: 'century', name: 'Century', symbol: 'cen', factor: 3155760000 },
      { id: 'decade', name: 'Decade', symbol: 'dec', factor: 315576000 },
      { id: 'year', name: 'Year (365d)', symbol: 'yr', factor: 31536000 },
      { id: 'month', name: 'Month (30d)', symbol: 'mo', factor: 2592000 },
      { id: 'week', name: 'Week', symbol: 'wk', factor: 604800 },
      { id: 'day', name: 'Day', symbol: 'd', factor: 86400 },
      { id: 'hour', name: 'Hour', symbol: 'h', factor: 3600 },
      { id: 'minute', name: 'Minute', symbol: 'min', factor: 60 },
      { id: 'second', name: 'Second', symbol: 's', factor: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { id: 'us', name: 'Microsecond', symbol: 'µs', factor: 1e-6 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Compass',
    description: 'Pa, kPa, bar, psi, atm, mmHg',
    baseUnitId: 'pascal',
    units: [
      { id: 'pascal', name: 'Pascal', symbol: 'Pa', factor: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', factor: 1000000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000 },
      { id: 'psi', name: 'Pound per sq inch', symbol: 'psi', factor: 6894.757 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', factor: 101325 },
      { id: 'mmhg', name: 'Millimeter of Mercury', symbol: 'mmHg', factor: 133.322 },
      { id: 'torr', name: 'Torr', symbol: 'Torr', factor: 133.322 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    iconName: 'Zap',
    description: 'Joule, kJ, Calorie, kcal, kWh, BTU',
    baseUnitId: 'joule',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J', factor: 1 },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
      { id: 'cal', name: 'Calorie', symbol: 'cal', factor: 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600000 },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06 },
      { id: 'ftlbf', name: 'Foot-pound', symbol: 'ft⋅lbf', factor: 1.355818 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    iconName: 'Activity',
    description: 'Watt, kW, MW, Horsepower',
    baseUnitId: 'watt',
    units: [
      { id: 'watt', name: 'Watt', symbol: 'W', factor: 1 },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', factor: 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', factor: 1000000 },
      { id: 'hp_m', name: 'Metric Horsepower', symbol: 'hp (M)', factor: 735.49875 },
      { id: 'hp_e', name: 'Mechanical Horsepower', symbol: 'hp (I)', factor: 745.69987 },
      { id: 'kcal_h', name: 'Kilocalorie per hour', symbol: 'kcal/h', factor: 1.163 },
    ],
  },
];

export function convertValue(
  value: number,
  fromUnit: ConverterUnit,
  toUnit: ConverterUnit,
  category: ConverterCategoryConfig,
  baseMode: '1024' | '1000' = '1024'
): number {
  if (Number.isNaN(value)) return 0;
  if (fromUnit.id === toUnit.id) return value;

  // Temperature has non-linear conversions
  if (category.id === 'temperature') {
    const toBase = fromUnit.toBase ? fromUnit.toBase(value) : value;
    const res = toUnit.fromBase ? toUnit.fromBase(toBase) : toBase;
    return res;
  }

  // Computer Data supports dynamic base 1024 or 1000
  if (category.id === 'data' && baseMode === '1000') {
    const factorMap1000: Record<string, number> = {
      bit: 0.125,
      byte: 1,
      kb: 1000,
      mb: 1e6,
      gb: 1e9,
      tb: 1e12,
      pb: 1e15,
      eb: 1e18,
      mbit: 1e6 / 8,
      gbit: 1e9 / 8,
    };
    const fromFactor = factorMap1000[fromUnit.id] ?? fromUnit.factor;
    const toFactor = factorMap1000[toUnit.id] ?? toUnit.factor;
    const inBytes = value * fromFactor;
    return inBytes / toFactor;
  }

  // Standard ratio to base
  const inBase = value * fromUnit.factor;
  return inBase / toUnit.factor;
}
