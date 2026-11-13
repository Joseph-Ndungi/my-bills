/**
 * Calculation engine for BillTrack:
 * - Precise normalization for Weekly, Monthly, and Annual costs
 * - Active vs Paused totals & savings calculations
 * - Next due date projection and countdowns
 * - Category spending distribution
 */

/**
 * Normalizes an amount from any cycle to its monthly equivalent
 */
export function toMonthlyAmount(amount, cycle) {
  const num = Number(amount) || 0;
  switch (cycle) {
    case 'weekly':
      return (num * 52) / 12;
    case 'biweekly':
      return (num * 26) / 12;
    case 'monthly':
      return num;
    case 'quarterly':
      return num / 3;
    case 'semiannual':
      return num / 6;
    case 'yearly':
      return num / 12;
    default:
      return num;
  }
}

/**
 * Normalizes an amount from any cycle to its weekly equivalent
 */
export function toWeeklyAmount(amount, cycle) {
  const num = Number(amount) || 0;
  switch (cycle) {
    case 'weekly':
      return num;
    case 'biweekly':
      return num / 2;
    case 'monthly':
      return (num * 12) / 52;
    case 'quarterly':
      return (num * 4) / 52;
    case 'semiannual':
      return (num * 2) / 52;
    case 'yearly':
      return num / 52;
    default:
      return (num * 12) / 52;
  }
}

/**
 * Normalizes an amount from any cycle to its yearly equivalent
 */
export function toYearlyAmount(amount, cycle) {
  const num = Number(amount) || 0;
  switch (cycle) {
    case 'weekly':
      return num * 52;
    case 'biweekly':
      return num * 26;
    case 'monthly':
      return num * 12;
    case 'quarterly':
      return num * 4;
    case 'semiannual':
      return num * 2;
    case 'yearly':
      return num;
    default:
      return num * 12;
  }
}

/**
 * Formats a currency amount with symbol and 2 decimal places
 */
export function formatCurrency(amount, symbol = 'KSh ') {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Calculates comprehensive summary metrics across all bills
 */
export function calculateTotals(bills = []) {
  let activeMonthly = 0;
  let activeWeekly = 0;
  let activeYearly = 0;
  let activeCount = 0;

  let pausedMonthly = 0;
  let pausedWeekly = 0;
  let pausedCount = 0;

  let cancelledCount = 0;

  const categoryTotals = {};

  bills.forEach((bill) => {
    const monthly = toMonthlyAmount(bill.amount, bill.cycle);
    const weekly = toWeeklyAmount(bill.amount, bill.cycle);
    const yearly = toYearlyAmount(bill.amount, bill.cycle);

    if (bill.status === 'active') {
      activeMonthly += monthly;
      activeWeekly += weekly;
      activeYearly += yearly;
      activeCount += 1;

      const cat = bill.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + monthly;
    } else if (bill.status === 'paused') {
      pausedMonthly += monthly;
      pausedWeekly += weekly;
      pausedCount += 1;
    } else if (bill.status === 'cancelled') {
      cancelledCount += 1;
    }
  });

  return {
    activeMonthly,
    activeWeekly,
    activeYearly,
    activeCount,
    pausedMonthly,
    pausedWeekly,
    pausedCount,
    cancelledCount,
    totalBills: bills.length,
    categoryTotals
  };
}

/**
 * Computes the next billing date and days remaining for a bill
 */
export function getNextDueDate(bill) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If user provided a specific ISO date string
  if (bill.nextDueDate) {
    const target = new Date(bill.nextDueDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      date: target,
      daysRemaining: diffDays,
      formatted: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  // Monthly billing day (1-31)
  const billingDay = parseInt(bill.billingDay, 10) || 1;
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Try this month
  let target = new Date(currentYear, currentMonth, billingDay);
  target.setHours(0, 0, 0, 0);

  // If already passed this month, move to next month
  if (target < today) {
    target = new Date(currentYear, currentMonth + 1, billingDay);
  }

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    date: target,
    daysRemaining: diffDays,
    formatted: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
}

/**
 * Returns human-readable label for upcoming due status
 */
export function getDueBadgeInfo(daysRemaining) {
  if (daysRemaining < 0) {
    return { text: `Overdue by ${Math.abs(daysRemaining)}d`, class: 'badge-danger' };
  }
  if (daysRemaining === 0) {
    return { text: 'Due Today', class: 'badge-danger' };
  }
  if (daysRemaining === 1) {
    return { text: 'Due Tomorrow', class: 'badge-warning' };
  }
  if (daysRemaining <= 7) {
    return { text: `Due in ${daysRemaining} days`, class: 'badge-warning' };
  }
  return { text: `Due in ${daysRemaining} days`, class: 'badge-neutral' };
}
