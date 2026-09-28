import { AngleUnit } from '../types';

export class CalculatorEngine {
  private static factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  // Prepares the human-readable display string for safe JavaScript math execution
  public static sanitizeAndTokenize(expression: string, angleUnit: AngleUnit): string {
    if (!expression || !expression.trim()) return '';

    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`);

    // Handle factorial: e.g., 5! -> fact(5)
    expr = expr.replace(/(\d+(?:\.\d+)?|\([^)]+\))!/g, (_, val) => `__fact__(${val})`);

    // Handle square / cube / powers: x^y -> Math.pow(x, y)
    // We can replace standard function tokens
    // Trigonometry functions with deg/rad conversion
    const toRad = angleUnit === 'deg' ? `*(Math.PI/180)` : '';
    const fromRad = angleUnit === 'deg' ? `*(180/Math.PI)` : '';

    // Replace functions safely
    expr = expr.replace(/asin\(/g, `(Math.asin`);
    expr = expr.replace(/acos\(/g, `(Math.acos`);
    expr = expr.replace(/atan\(/g, `(Math.atan`);

    // Inverse trig degrees correction if needed
    if (angleUnit === 'deg') {
      expr = expr.replace(/Math\.asin\(([^)]+)\)/g, `(Math.asin($1)${fromRad})`);
      expr = expr.replace(/Math\.acos\(([^)]+)\)/g, `(Math.acos($1)${fromRad})`);
      expr = expr.replace(/Math\.atan\(([^)]+)\)/g, `(Math.atan($1)${fromRad})`);
    }

    // Standard trig
    expr = expr.replace(/sin\(/g, `Math.sin((`);
    expr = expr.replace(/cos\(/g, `Math.cos((`);
    expr = expr.replace(/tan\(/g, `Math.tan((`);
    if (angleUnit === 'deg') {
      expr = expr.replace(/Math\.sin\(\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
      expr = expr.replace(/Math\.cos\(\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
      expr = expr.replace(/Math\.tan\(\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);
    } else {
      expr = expr.replace(/Math\.sin\(\(([^)]+)\)/g, `Math.sin($1)`);
      expr = expr.replace(/Math\.cos\(\(([^)]+)\)/g, `Math.cos($1)`);
      expr = expr.replace(/Math\.tan\(\(([^)]+)\)/g, `Math.tan($1)`);
    }

    // Hyperbolic
    expr = expr.replace(/sinh\(/g, `Math.sinh(`);
    expr = expr.replace(/cosh\(/g, `Math.cosh(`);
    expr = expr.replace(/tanh\(/g, `Math.tanh(`);

    // Logs and roots
    expr = expr.replace(/ln\(/g, `Math.log(`);
    expr = expr.replace(/log\(/g, `Math.log10(`);
    expr = expr.replace(/√\(/g, `Math.sqrt(`);
    expr = expr.replace(/∛\(/g, `Math.cbrt(`);
    expr = expr.replace(/abs\(/g, `Math.abs(`);

    // Power operator ^ -> **
    expr = expr.replace(/\^/g, '**');

    // Percentages: e.g. 100 * 20% -> 100 * (20/100), or 50 + 10% -> 50 + (50 * 0.1)
    // First handle standalone percentage like "50%" -> "(50/100)"
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // Balance unclosed parentheses
    const openParens = (expr.match(/\(/g) || []).length;
    const closeParens = (expr.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      expr += ')'.repeat(openParens - closeParens);
    }

    return expr;
  }

  public static evaluate(expression: string, angleUnit: AngleUnit = 'deg'): { result: string; numericValue: number | null; error?: string } {
    if (!expression || !expression.trim()) {
      return { result: '0', numericValue: 0 };
    }

    try {
      const sanitized = this.sanitizeAndTokenize(expression, angleUnit);
      if (!sanitized) return { result: '0', numericValue: 0 };

      // Safe evaluation sandbox using Function with strict math arguments
      const factFn = (n: number) => this.factorial(n);
      const evalFn = new Function('__fact__', 'Math', `"use strict"; return (${sanitized});`);
      const val = evalFn(factFn, Math);

      if (val === undefined || val === null) {
        return { result: '0', numericValue: 0 };
      }

      if (typeof val === 'number') {
        if (Number.isNaN(val)) {
          return { result: 'Error', numericValue: null, error: 'Undefined result' };
        }
        if (!Number.isFinite(val)) {
          return { result: val > 0 ? 'Infinity' : '-Infinity', numericValue: val, error: "Can't divide by zero" };
        }

        // Clean small floating point precision errors e.g. 0.1 + 0.2 = 0.30000000000000004
        const rounded = parseFloat(val.toPrecision(12));
        const formatted = this.formatNumber(rounded);
        return { result: formatted, numericValue: rounded };
      }

      return { result: String(val), numericValue: null };
    } catch {
      return { result: '', numericValue: null, error: 'Incomplete' };
    }
  }

  public static formatNumber(num: number): string {
    if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-7 && num !== 0)) {
      return num.toExponential(6).replace(/\+/, '');
    }
    // Check if integer
    const parts = num.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  }

  public static unformatNumber(str: string): string {
    return str.replace(/,/g, '');
  }
}
