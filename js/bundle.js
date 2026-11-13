/**
 * BillTrack - Standalone Universal Bundle
 * Runs seamlessly both offline via file:// (direct double-click) and HTTP/HTTPS servers.
 * Zero external dependencies.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PRESETS & CONFIGURATION
  // =========================================================================

  const PRESETS = [
    {
      id: 'rent',
      name: 'Rent',
      category: 'housing',
      defaultAmount: 1200,
      cycle: 'monthly',
      color: '#3b82f6',
      icon: 'home',
      packages: ['1 Bedroom Apt', '2 Bedroom Apt', 'Studio', 'Shared Room', 'House'],
      paymentMethod: 'Bank Transfer / Direct Debit',
      notes: 'Primary monthly living expense. Due 1st of each month.',
      defaultDay: 1,
      autoRenew: false
    },
    {
      id: 'wifi',
      name: 'Home WiFi / Fiber',
      category: 'utilities',
      defaultAmount: 60,
      cycle: 'monthly',
      color: '#06b6d4',
      icon: 'wifi',
      packages: ['50 Mbps Basic', '100 Mbps Standard', '300 Mbps Fiber', 'Gigabit Ultra'],
      paymentMethod: 'Credit Card',
      notes: 'Home high-speed broadband connection.',
      defaultDay: 15,
      autoRenew: true
    },
    {
      id: 'netflix',
      name: 'Netflix',
      category: 'entertainment',
      defaultAmount: 15.49,
      cycle: 'monthly',
      color: '#e50914',
      icon: 'tv',
      packages: [
        'Standard with Ads ($6.99)',
        'Standard 1080p ($15.49)',
        'Premium 4K + HDR ($22.99)'
      ],
      paymentMethod: 'Credit Card',
      notes: 'Streaming plan. Change tier when needed.',
      defaultDay: 18,
      url: 'https://www.netflix.com/youraccount',
      autoRenew: true
    },
    {
      id: 'spotify',
      name: 'Spotify',
      category: 'entertainment',
      defaultAmount: 11.99,
      cycle: 'monthly',
      color: '#1db954',
      icon: 'music',
      packages: [
        'Individual ($11.99)',
        'Duo ($16.99)',
        'Family 6 Accounts ($19.99)',
        'Student ($5.99)'
      ],
      paymentMethod: 'Apple Pay',
      notes: 'Music & podcast streaming.',
      defaultDay: 12,
      url: 'https://www.spotify.com/account/overview',
      autoRenew: true
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      category: 'entertainment',
      defaultAmount: 13.99,
      cycle: 'monthly',
      color: '#ff0000',
      icon: 'play-square',
      packages: [
        'Individual ($13.99)',
        'Family Plan ($22.99)',
        'Student Plan ($7.99)',
        'Annual Plan ($139.99/yr)'
      ],
      paymentMethod: 'Google Pay',
      notes: 'Ad-free YouTube & background play + YouTube Music.',
      defaultDay: 5,
      url: 'https://www.youtube.com/paid_memberships',
      autoRenew: true
    },
    {
      id: 'youtube-channel',
      name: 'YouTube Channel Membership',
      category: 'creators',
      defaultAmount: 4.99,
      cycle: 'monthly',
      color: '#f59e0b',
      icon: 'user-check',
      packages: [
        'Tier 1 Supporter ($0.99 - $1.99)',
        'Tier 2 Member ($4.99)',
        'Tier 3 VIP / Insider ($9.99)',
        'Tier 4 Super Fan ($24.99)'
      ],
      paymentMethod: 'Credit Card',
      notes: 'Creator membership with exclusive badges & member-only videos.',
      defaultDay: 14,
      url: 'https://www.youtube.com/purchases',
      autoRenew: true
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      category: 'tools',
      defaultAmount: 20.00,
      cycle: 'monthly',
      color: '#10a37f',
      icon: 'bot',
      packages: [
        'Plus ($20/month)',
        'Pro ($200/month)',
        'Team ($25/user/month)',
        'Free Tier ($0)'
      ],
      paymentMethod: 'Credit Card',
      notes: 'OpenAI GPT-4o, o1, canvas & advanced voice features.',
      defaultDay: 22,
      url: 'https://chatgpt.com/#settings/subscription',
      autoRenew: true
    },
    {
      id: 'gym',
      name: 'Gym Membership',
      category: 'fitness',
      defaultAmount: 50.00,
      cycle: 'monthly',
      color: '#8b5cf6',
      icon: 'activity',
      packages: [
        'Standard Access',
        'Peak / All-Hours Access',
        'Multi-Club Access',
        'Student Discount',
        'Annual Prepaid ($500/yr)'
      ],
      paymentMethod: 'Direct Debit',
      notes: 'Fitness center & workout facilities. Can be paused during travel.',
      defaultDay: 1,
      autoRenew: true
    }
  ];

  const CATEGORIES = {
    housing: { label: 'Housing & Rent', color: '#3b82f6', icon: 'home' },
    utilities: { label: 'Utilities & Internet', color: '#06b6d4', icon: 'wifi' },
    entertainment: { label: 'Entertainment & Media', color: '#ec4899', icon: 'tv' },
    creators: { label: 'Creators & Channels', color: '#f59e0b', icon: 'user-check' },
    tools: { label: 'AI, Tech & Software', color: '#10b981', icon: 'cpu' },
    fitness: { label: 'Health & Fitness', color: '#8b5cf6', icon: 'activity' },
    other: { label: 'Other Recurring', color: '#64748b', icon: 'tag' }
  };

  const BILLING_CYCLES = [
    { value: 'weekly', label: 'Weekly', weeksPerCycle: 1, monthsPerCycle: 1 / 4.3333 },
    { value: 'biweekly', label: 'Every 2 Weeks', weeksPerCycle: 2, monthsPerCycle: 2 / 4.3333 },
    { value: 'monthly', label: 'Monthly', weeksPerCycle: 4.3333, monthsPerCycle: 1 },
    { value: 'quarterly', label: 'Quarterly (3 Mo)', weeksPerCycle: 13, monthsPerCycle: 3 },
    { value: 'semiannual', label: 'Every 6 Months', weeksPerCycle: 26, monthsPerCycle: 6 },
    { value: 'yearly', label: 'Yearly (Annual)', weeksPerCycle: 52, monthsPerCycle: 12 }
  ];

  // =========================================================================
  // 2. SVG ICONS
  // =========================================================================

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    'play-square': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m10 8 6 4-6 4V8z"></path></svg>',
    'user-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"></rect><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M12 2v4"></path></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
  };

  // =========================================================================
  // 3. CALCULATIONS & NORMALIZATION ENGINE
  // =========================================================================

  function toMonthlyAmount(amount, cycle) {
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

  function toWeeklyAmount(amount, cycle) {
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

  function formatCurrency(amount, symbol = 'KSh ') {
    const num = Number(amount) || 0;
    return `${symbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function calculateTotals(bills = []) {
    let activeMonthly = 0;
    let activeWeekly = 0;
    let activeCount = 0;

    let pausedMonthly = 0;
    let pausedWeekly = 0;
    let pausedCount = 0;

    const categoryTotals = {};

    bills.forEach((bill) => {
      const monthly = toMonthlyAmount(bill.amount, bill.cycle);
      const weekly = toWeeklyAmount(bill.amount, bill.cycle);

      if (bill.status === 'active') {
        activeMonthly += monthly;
        activeWeekly += weekly;
        activeCount += 1;

        const cat = bill.category || 'other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + monthly;
      } else if (bill.status === 'paused') {
        pausedMonthly += monthly;
        pausedWeekly += weekly;
        pausedCount += 1;
      }
    });

    return {
      activeMonthly,
      activeWeekly,
      activeCount,
      pausedMonthly,
      pausedWeekly,
      pausedCount,
      totalBills: bills.length,
      categoryTotals
    };
  }

  function getNextDueDate(bill) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const billingDay = parseInt(bill.billingDay, 10) || 1;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let target = new Date(currentYear, currentMonth, billingDay);
    target.setHours(0, 0, 0, 0);

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

  function getDueBadgeInfo(daysRemaining) {
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

  // =========================================================================
  // 4. LOCAL STORAGE & DATA MANAGEMENT
  // =========================================================================

  const STORAGE_KEY = 'billtrack_bills_v1';
  const SETTINGS_KEY = 'billtrack_settings_v1';

  const DEFAULT_SETTINGS = {
    currency: 'KSh ',
    theme: 'dark',
    defaultFilter: 'all',
    sortBy: 'dueDate'
  };

  const INITIAL_SEEDS = [
    {
      id: 'seed-rent',
      name: 'Apartment Rent',
      category: 'housing',
      amount: 1250.00,
      cycle: 'monthly',
      billingDay: 1,
      status: 'active',
      packageTier: '2-Bedroom Apartment',
      paymentMethod: 'Bank Transfer / Direct Debit',
      autoRenew: false,
      url: '',
      notes: 'Primary monthly rent. Transferred on the 1st.',
      history: [
        { date: '2026-01-01', note: 'Lease renewed for 2026', newTier: '2-Bedroom Apartment', newAmount: 1250 }
      ]
    },
    {
      id: 'seed-wifi',
      name: 'Home WiFi / Fiber',
      category: 'utilities',
      amount: 65.00,
      cycle: 'monthly',
      billingDay: 15,
      status: 'active',
      packageTier: 'Fiber 300 Mbps Unlimited',
      paymentMethod: 'Credit Card',
      autoRenew: true,
      url: '',
      notes: 'Fiber router in living room. Auto-debited on card.',
      history: [
        { date: '2026-03-10', note: 'Upgraded from 100Mbps to 300Mbps', newTier: 'Fiber 300 Mbps Unlimited', newAmount: 65 }
      ]
    },
    {
      id: 'seed-netflix',
      name: 'Netflix',
      category: 'entertainment',
      amount: 15.49,
      cycle: 'monthly',
      billingDay: 18,
      status: 'active',
      packageTier: 'Standard 1080p (No Ads)',
      paymentMethod: 'Credit Card',
      autoRenew: true,
      url: 'https://www.netflix.com/youraccount',
      notes: 'Living room TV and mobile profile.',
      history: []
    },
    {
      id: 'seed-spotify',
      name: 'Spotify',
      category: 'entertainment',
      amount: 11.99,
      cycle: 'monthly',
      billingDay: 12,
      status: 'active',
      packageTier: 'Individual Premium',
      paymentMethod: 'Apple Pay',
      autoRenew: true,
      url: 'https://www.spotify.com/account/overview',
      notes: 'Offline downloads and high quality streaming.',
      history: []
    },
    {
      id: 'seed-youtube',
      name: 'YouTube Premium',
      category: 'entertainment',
      amount: 13.99,
      cycle: 'monthly',
      billingDay: 5,
      status: 'active',
      packageTier: 'Individual Plan',
      paymentMethod: 'Google Pay',
      autoRenew: true,
      url: 'https://www.youtube.com/paid_memberships',
      notes: 'Ad-free playback & background audio + YouTube Music.',
      history: []
    },
    {
      id: 'seed-youtube-channel',
      name: 'YouTube Channel Member',
      category: 'creators',
      amount: 4.99,
      cycle: 'monthly',
      billingDay: 14,
      status: 'active',
      packageTier: 'Tier 2 Channel Insider',
      paymentMethod: 'Credit Card',
      autoRenew: true,
      url: 'https://www.youtube.com/purchases',
      notes: 'Supporter badge, custom emojis, and members-only live chats.',
      history: []
    },
    {
      id: 'seed-chatgpt',
      name: 'ChatGPT',
      category: 'tools',
      amount: 20.00,
      cycle: 'monthly',
      billingDay: 22,
      status: 'active',
      packageTier: 'ChatGPT Plus (GPT-4o & o1)',
      paymentMethod: 'Credit Card',
      autoRenew: true,
      url: 'https://chatgpt.com/#settings/subscription',
      notes: 'AI assistant for work & code analysis.',
      history: []
    },
    {
      id: 'seed-gym',
      name: 'Gym Membership',
      category: 'fitness',
      amount: 55.00,
      cycle: 'monthly',
      billingDay: 1,
      status: 'paused', // Paused to showcase feature right out of the box
      packageTier: 'All-Clubs Peak Pass',
      paymentMethod: 'Direct Debit',
      autoRenew: true,
      url: '',
      notes: 'Temporarily paused during travel. Saving $55/mo while paused.',
      history: [
        { date: '2026-10-15', note: 'Paused membership during travel season' }
      ]
    }
  ];

  class StorageManager {
    static getBills() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
          this.saveBills(INITIAL_SEEDS);
          return INITIAL_SEEDS;
        }
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to load bills:', e);
        return INITIAL_SEEDS;
      }
    }

    static saveBills(bills) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
        return true;
      } catch (e) {
        return false;
      }
    }

    static addBill(billData) {
      const bills = this.getBills();
      const newBill = {
        id: 'bill-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        name: billData.name.trim(),
        category: billData.category || 'other',
        amount: parseFloat(billData.amount) || 0,
        cycle: billData.cycle || 'monthly',
        billingDay: parseInt(billData.billingDay, 10) || 1,
        status: billData.status || 'active',
        packageTier: billData.packageTier ? billData.packageTier.trim() : 'Standard',
        paymentMethod: billData.paymentMethod || 'Credit Card',
        url: billData.url ? billData.url.trim() : '',
        notes: billData.notes ? billData.notes.trim() : '',
        history: [
          {
            date: new Date().toISOString().split('T')[0],
            note: 'Subscription added',
            newTier: billData.packageTier || 'Standard',
            newAmount: parseFloat(billData.amount) || 0
          }
        ],
        createdAt: new Date().toISOString()
      };

      bills.unshift(newBill);
      this.saveBills(bills);
      return newBill;
    }

    static updateBill(id, updatedFields) {
      const bills = this.getBills();
      const index = bills.findIndex(b => b.id === id);
      if (index === -1) return null;

      const existing = bills[index];
      const history = existing.history || [];

      const oldTier = existing.packageTier;
      const newTier = updatedFields.packageTier !== undefined ? updatedFields.packageTier : oldTier;
      const oldAmount = existing.amount;
      const newAmount = updatedFields.amount !== undefined ? parseFloat(updatedFields.amount) : oldAmount;

      if (oldTier !== newTier || oldAmount !== newAmount) {
        history.unshift({
          date: new Date().toISOString().split('T')[0],
          note: updatedFields.changeNote || 'Package/Price updated',
          oldTier,
          newTier,
          oldAmount,
          newAmount
        });
      }

      bills[index] = {
        ...existing,
        ...updatedFields,
        history,
        updatedAt: new Date().toISOString()
      };

      this.saveBills(bills);
      return bills[index];
    }

    static togglePause(id, pauseReason = '') {
      const bills = this.getBills();
      const bill = bills.find(b => b.id === id);
      if (!bill) return null;

      const newStatus = bill.status === 'paused' ? 'active' : 'paused';
      const history = bill.history || [];

      history.unshift({
        date: new Date().toISOString().split('T')[0],
        note: newStatus === 'paused'
          ? (pauseReason ? `Paused: ${pauseReason}` : 'Subscription paused')
          : 'Subscription resumed to active'
      });

      bill.status = newStatus;
      bill.history = history;
      bill.updatedAt = new Date().toISOString();

      this.saveBills(bills);
      return bill;
    }

    static deleteBill(id) {
      const bills = this.getBills();
      const filtered = bills.filter(b => b.id !== id);
      this.saveBills(filtered);
      return true;
    }

    static resetToDefaults() {
      this.saveBills(INITIAL_SEEDS);
      return INITIAL_SEEDS;
    }

    static getSettings() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (!data) return DEFAULT_SETTINGS;
        const parsed = JSON.parse(data);
        if (parsed.currency === '$') {
          parsed.currency = 'KSh ';
          this.saveSettings(parsed);
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }

    static saveSettings(settings) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
      } catch (e) {
        return false;
      }
    }

    static exportJSON() {
      const bills = this.getBills();
      const settings = this.getSettings();
      const exportObject = {
        appName: 'BillTrack',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        settings,
        bills
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    static importJSON(jsonText) {
      try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
          this.saveBills(parsed);
          return { success: true, count: parsed.length };
        } else if (parsed && Array.isArray(parsed.bills)) {
          this.saveBills(parsed.bills);
          if (parsed.settings) {
            this.saveSettings(parsed.settings);
          }
          return { success: true, count: parsed.bills.length };
        }
        throw new Error('Invalid JSON structure.');
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    static exportCSV() {
      const bills = this.getBills();
      const headers = ['Name', 'Category', 'Package Tier', 'Amount', 'Cycle', 'Billing Day', 'Status', 'Payment Method', 'Notes'];

      const rows = bills.map(b => [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.category || '').replace(/"/g, '""')}"`,
        `"${(b.packageTier || '').replace(/"/g, '""')}"`,
        b.amount,
        b.cycle,
        b.billingDay || '',
        b.status,
        `"${(b.paymentMethod || '').replace(/"/g, '""')}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billtrack-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // =========================================================================
  // 5. VIEW & UI RENDERER
  // =========================================================================

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // =========================================================================
  // 6. MAIN APPLICATION CONTROLLER
  // =========================================================================

  class BillTrackerApp {
    constructor() {
      this.bills = [];
      this.settings = StorageManager.getSettings();
      this.currentFilter = 'all';
      this.searchQuery = '';
      this.sortBy = 'dueDate';
      this.activeModal = null;
      this.editingBillId = null;
      this.changingPackageBillId = null;
    }

    init() {
      this.bills = StorageManager.getBills();
      this.applyTheme(this.settings.theme);

      // Register Service Worker for PWA / offline support
      if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
      }

      this.setupEventListeners();
      this.render();
    }

    applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }

    setupEventListeners() {
      // Render quick presets
      const presetsContainer = document.getElementById('presets-scroll');
      if (presetsContainer) {
        presetsContainer.innerHTML = PRESETS.map(preset => `
          <button type="button" class="preset-chip" data-preset-id="${preset.id}">
            <span class="preset-dot" style="background-color: ${preset.color}"></span>
            <span>${preset.name}</span>
          </button>
        `).join('');

        presetsContainer.querySelectorAll('.preset-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const presetId = btn.getAttribute('data-preset-id');
            const found = PRESETS.find(p => p.id === presetId);
            if (found) this.openAddModalWithPreset(found);
          });
        });
      }

      // Segmented control
      document.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.getAttribute('data-filter') || 'all';
          this.renderBills();
        });
      });

      // Search input
      const searchInput = document.getElementById('search-bills');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderBills();
        });
      }

      // Sort select
      const sortSelect = document.getElementById('sort-bills');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.renderBills();
        });
      }

      // Add Bill buttons
      const addBtn = document.getElementById('btn-add-bill');
      const fabBtn = document.getElementById('btn-fab-add');
      if (addBtn) addBtn.addEventListener('click', () => this.openBillModal());
      if (fabBtn) fabBtn.addEventListener('click', () => this.openBillModal());

      // Settings Modal
      const settingsBtn = document.getElementById('btn-settings');
      if (settingsBtn) settingsBtn.addEventListener('click', () => this.openModal('modal-settings'));

      // Theme Toggle
      const themeBtn = document.getElementById('btn-toggle-theme');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
          this.settings.theme = newTheme;
          StorageManager.saveSettings(this.settings);
          this.applyTheme(newTheme);
        });
      }

      // Modal Closers
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeModal(modal.id);
        });
      });

      document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-overlay');
          if (modal) this.closeModal(modal.id);
        });
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.closeModal(this.activeModal);
        }
      });

      // Forms
      const billForm = document.getElementById('form-bill');
      if (billForm) {
        billForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleBillFormSubmit();
        });
      }

      const pkgForm = document.getElementById('form-change-package');
      if (pkgForm) {
        pkgForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleChangePackageSubmit();
        });
      }

      // Settings controls
      const currencySelect = document.getElementById('setting-currency');
      if (currencySelect) {
        currencySelect.value = this.settings.currency || 'KSh ';
        currencySelect.addEventListener('change', (e) => {
          this.settings.currency = e.target.value;
          StorageManager.saveSettings(this.settings);
          this.render();
          showToast(`Currency changed to ${this.settings.currency}`);
        });
      }

      const btnExportJSON = document.getElementById('btn-export-json');
      if (btnExportJSON) {
        btnExportJSON.addEventListener('click', () => {
          StorageManager.exportJSON();
          showToast('Backup JSON downloaded');
        });
      }

      const btnExportCSV = document.getElementById('btn-export-csv');
      if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
          StorageManager.exportCSV();
          showToast('CSV export downloaded');
        });
      }

      const btnImportJSON = document.getElementById('btn-import-json');
      const importFileInput = document.getElementById('import-file-input');
      if (btnImportJSON && importFileInput) {
        btnImportJSON.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = StorageManager.importJSON(event.target.result);
            if (res.success) {
              this.bills = StorageManager.getBills();
              this.settings = StorageManager.getSettings();
              this.render();
              this.closeModal('modal-settings');
              showToast(`Imported ${res.count} bills successfully!`);
            } else {
              alert('Import error: ' + res.error);
            }
          };
          reader.readAsText(file);
        });
      }

      const btnResetDefaults = document.getElementById('btn-reset-defaults');
      if (btnResetDefaults) {
        btnResetDefaults.addEventListener('click', () => {
          if (confirm('Reset to standard sample subscriptions (Rent, WiFi, Netflix, Spotify, YouTube, ChatGPT, Gym)?')) {
            this.bills = StorageManager.resetToDefaults();
            this.render();
            this.closeModal('modal-settings');
            showToast('Reset to sample subscriptions.');
          }
        });
      }
    }

    render() {
      const currency = this.settings.currency || 'KSh ';
      const totals = calculateTotals(this.bills);

      // Hero Metrics
      const activeMonthlyEl = document.getElementById('metric-active-monthly');
      const activeWeeklyEl = document.getElementById('metric-active-weekly');
      const activeCountEl = document.getElementById('metric-active-count');
      const pausedMetricEl = document.getElementById('metric-paused-savings');
      const pausedCountEl = document.getElementById('metric-paused-count');
      const nextDueEl = document.getElementById('metric-next-due');

      if (activeMonthlyEl) activeMonthlyEl.textContent = formatCurrency(totals.activeMonthly, currency);
      if (activeWeeklyEl) activeWeeklyEl.textContent = formatCurrency(totals.activeWeekly, currency);
      if (activeCountEl) activeCountEl.textContent = `${totals.activeCount} active bill${totals.activeCount === 1 ? '' : 's'}`;

      if (pausedMetricEl && pausedCountEl) {
        if (totals.pausedCount > 0) {
          pausedMetricEl.textContent = `${formatCurrency(totals.pausedMonthly, currency)}/mo saved`;
          pausedCountEl.textContent = `${totals.pausedCount} paused`;
        } else {
          pausedMetricEl.textContent = 'None paused';
          pausedCountEl.textContent = '0 paused';
        }
      }

      // Next upcoming active bill
      if (nextDueEl) {
        const activeBills = this.bills.filter(b => b.status === 'active');
        if (activeBills.length === 0) {
          nextDueEl.textContent = 'No active bills';
        } else {
          const sorted = [...activeBills].map(b => ({
            bill: b,
            due: getNextDueDate(b)
          })).sort((a, b) => a.due.daysRemaining - b.due.daysRemaining);

          const next = sorted[0];
          if (next) {
            const badge = getDueBadgeInfo(next.due.daysRemaining);
            nextDueEl.innerHTML = `<span class="highlight">${escapeHtml(next.bill.name)}</span> (${badge.text})`;
          }
        }
      }

      // Badges on segmented controls
      const badgeAll = document.getElementById('count-all');
      const badgeActive = document.getElementById('count-active');
      const badgePaused = document.getElementById('count-paused');

      if (badgeAll) badgeAll.textContent = totals.totalBills;
      if (badgeActive) badgeActive.textContent = totals.activeCount;
      if (badgePaused) badgePaused.textContent = totals.pausedCount;

      this.renderBills();
      this.renderAnalytics(totals, currency);
    }

    renderBills() {
      const currency = this.settings.currency || 'KSh ';
      const container = document.getElementById('bills-container');
      if (!container) return;

      let filtered = [...this.bills];

      if (this.currentFilter === 'active') {
        filtered = filtered.filter(b => b.status === 'active');
      } else if (this.currentFilter === 'paused') {
        filtered = filtered.filter(b => b.status === 'paused');
      }

      if (this.searchQuery) {
        filtered = filtered.filter(b => {
          const name = (b.name || '').toLowerCase();
          const pkg = (b.packageTier || '').toLowerCase();
          const notes = (b.notes || '').toLowerCase();
          const cat = (CATEGORIES[b.category]?.label || '').toLowerCase();
          return name.includes(this.searchQuery) ||
                 pkg.includes(this.searchQuery) ||
                 notes.includes(this.searchQuery) ||
                 cat.includes(this.searchQuery);
        });
      }

      if (this.sortBy === 'dueDate') {
        filtered.sort((a, b) => getNextDueDate(a).daysRemaining - getNextDueDate(b).daysRemaining);
      } else if (this.sortBy === 'amountDesc') {
        filtered.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      } else if (this.sortBy === 'nameAsc') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            ${ICONS.tag}
            <h3>No subscriptions found</h3>
            <p>Tap a quick preset above or hit "+ Add Bill" to add your first bill.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(bill => {
        const catConfig = CATEGORIES[bill.category] || CATEGORIES.other;
        const iconSvg = ICONS[catConfig.icon] || ICONS.tag;
        const isPaused = bill.status === 'paused';

        const nextDue = getNextDueDate(bill);
        const dueBadge = getDueBadgeInfo(nextDue.daysRemaining);

        const monthlyCost = toMonthlyAmount(bill.amount, bill.cycle);
        const weeklyCost = toWeeklyAmount(bill.amount, bill.cycle);
        const cycleObj = BILLING_CYCLES.find(c => c.value === bill.cycle) || { label: 'Monthly' };

        return `
          <div class="bill-card ${isPaused ? 'status-paused' : ''}" data-id="${bill.id}">
            <div class="bill-main">
              <div class="bill-left">
                <div class="bill-icon-badge" style="background: ${catConfig.color}">
                  ${iconSvg}
                </div>
                <div class="bill-info">
                  <div class="bill-title-row">
                    <span class="bill-name">${escapeHtml(bill.name)}</span>
                    <span class="package-badge" title="Package / Tier">${escapeHtml(bill.packageTier || 'Standard')}</span>
                    ${isPaused ? '<span class="status-badge paused">PAUSED</span>' : ''}
                  </div>
                  <div class="bill-meta-row">
                    <span>${catConfig.label}</span>
                    <span class="bill-meta-dot"></span>
                    <span class="${dueBadge.class}">${dueBadge.text} (${nextDue.formatted})</span>
                    ${bill.paymentMethod ? `
                      <span class="bill-meta-dot"></span>
                      <span>${escapeHtml(bill.paymentMethod)}</span>
                    ` : ''}
                  </div>
                </div>
              </div>

              <div class="bill-right">
                <div class="bill-price">${formatCurrency(bill.amount, currency)}</div>
                <div class="bill-cycle-sub">${cycleObj.label}</div>
                <div class="bill-normalized">
                  ${isPaused ? 'Saved ' : ''}${formatCurrency(monthlyCost, currency)}/mo • ${formatCurrency(weeklyCost, currency)}/wk
                </div>
              </div>
            </div>

            <div class="bill-footer">
              <div class="bill-footer-left">
                <!-- iOS Toggle Switch for Pause / Resume -->
                <label class="ios-switch-container" title="${isPaused ? 'Click to Resume' : 'Click to Pause subscription'}">
                  <div class="ios-switch">
                    <input type="checkbox" class="toggle-pause-input" data-id="${bill.id}" ${!isPaused ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                  </div>
                  <span class="ios-switch-label">${isPaused ? 'Paused' : 'Active'}</span>
                </label>

                <!-- Change Package Action -->
                <button type="button" class="bill-action-btn btn-change-pkg" data-action="change-package" data-id="${bill.id}" title="Upgrade or switch package tier">
                  ${ICONS.layers}
                  <span>Change Package</span>
                </button>
              </div>

              <div class="bill-footer-right">
                ${bill.url ? `
                  <a href="${escapeHtml(bill.url)}" target="_blank" rel="noopener noreferrer" class="bill-action-btn" title="Open management portal">
                    ${ICONS.external}
                    <span>Portal</span>
                  </a>
                ` : ''}
                
                <button type="button" class="bill-action-btn" data-action="edit" data-id="${bill.id}" title="Edit bill details">
                  ${ICONS.edit}
                  <span>Edit</span>
                </button>

                <button type="button" class="bill-action-btn" data-action="delete" data-id="${bill.id}" title="Delete bill">
                  ${ICONS.trash}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Event listeners for card buttons
      container.querySelectorAll('.toggle-pause-input').forEach(input => {
        input.addEventListener('change', () => {
          const id = input.getAttribute('data-id');
          this.togglePause(id);
        });
      });

      container.querySelectorAll('[data-action="change-package"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.openChangePackageModal(id);
        });
      });

      container.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.openBillModal(id);
        });
      });

      container.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.deleteBill(id);
        });
      });
    }

    renderAnalytics(totals, currency) {
      const stackContainer = document.getElementById('category-bar-stack');
      const legendContainer = document.getElementById('category-legend-grid');

      if (!stackContainer || !legendContainer) return;

      if (totals.activeMonthly <= 0) {
        stackContainer.innerHTML = '<div class="bar-segment" style="width: 100%; background: #334155;"></div>';
        legendContainer.innerHTML = '<p class="metric-sub">No active recurring expenses to display.</p>';
        return;
      }

      const categories = Object.keys(totals.categoryTotals);
      const sortedCategories = categories.sort((a, b) => totals.categoryTotals[b] - totals.categoryTotals[a]);

      stackContainer.innerHTML = sortedCategories.map(catKey => {
        const catVal = totals.categoryTotals[catKey];
        const pct = (catVal / totals.activeMonthly) * 100;
        const color = CATEGORIES[catKey]?.color || '#94a3b8';
        return `<div class="bar-segment" style="width: ${pct}%; background-color: ${color};" title="${CATEGORIES[catKey]?.label || catKey}: ${pct.toFixed(1)}%"></div>`;
      }).join('');

      legendContainer.innerHTML = sortedCategories.map(catKey => {
        const catVal = totals.categoryTotals[catKey];
        const pct = ((catVal / totals.activeMonthly) * 100).toFixed(0);
        const catConfig = CATEGORIES[catKey] || CATEGORIES.other;
        return `
          <div class="legend-item">
            <div class="legend-left">
              <span class="legend-color-dot" style="background-color: ${catConfig.color}"></span>
              <span>${catConfig.label}</span>
            </div>
            <span class="legend-amount">${formatCurrency(catVal, currency)} <small style="color:var(--text-secondary);font-weight:normal">(${pct}%)</small></span>
          </div>
        `;
      }).join('');
    }

    togglePause(id) {
      const updated = StorageManager.togglePause(id);
      if (updated) {
        this.bills = StorageManager.getBills();
        this.render();
        const statusText = updated.status === 'paused' ? 'Paused (saved from totals)' : 'Resumed to Active';
        showToast(`${updated.name} ${statusText}`);
      }
    }

    deleteBill(id) {
      const bill = this.bills.find(b => b.id === id);
      const name = bill ? bill.name : 'Bill';
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        StorageManager.deleteBill(id);
        this.bills = StorageManager.getBills();
        this.render();
        showToast(`Deleted ${name}`);
      }
    }

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        this.activeModal = modalId;
      }
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('open');
        if (this.activeModal === modalId) {
          this.activeModal = null;
        }
      }
    }

    openBillModal(id = null) {
      this.editingBillId = id;
      const titleEl = document.getElementById('modal-bill-title');
      const form = document.getElementById('form-bill');
      const pkgSuggestionsEl = document.getElementById('bill-pkg-suggestions');
      if (!form) return;

      if (id) {
        const bill = this.bills.find(b => b.id === id);
        if (!bill) return;
        if (titleEl) titleEl.textContent = 'Edit Bill';
        form.elements['name'].value = bill.name || '';
        form.elements['category'].value = bill.category || 'other';
        form.elements['packageTier'].value = bill.packageTier || '';
        form.elements['amount'].value = bill.amount || '';
        form.elements['cycle'].value = bill.cycle || 'monthly';
        form.elements['billingDay'].value = bill.billingDay || 1;
        form.elements['paymentMethod'].value = bill.paymentMethod || 'Credit Card';
        form.elements['url'].value = bill.url || '';
        form.elements['notes'].value = bill.notes || '';
        form.elements['status'].value = bill.status || 'active';
        if (pkgSuggestionsEl) pkgSuggestionsEl.innerHTML = '';
      } else {
        if (titleEl) titleEl.textContent = 'Add Recurrent Bill';
        form.reset();
        form.elements['cycle'].value = 'monthly';
        form.elements['billingDay'].value = 1;
        form.elements['category'].value = 'entertainment';
        form.elements['paymentMethod'].value = 'Credit Card';
        form.elements['status'].value = 'active';
        if (pkgSuggestionsEl) pkgSuggestionsEl.innerHTML = '';
      }

      this.openModal('modal-bill');
    }

    openAddModalWithPreset(preset) {
      this.openBillModal(null);
      const form = document.getElementById('form-bill');
      const pkgSuggestionsEl = document.getElementById('bill-pkg-suggestions');

      form.elements['name'].value = preset.name;
      form.elements['category'].value = preset.category;
      form.elements['amount'].value = preset.defaultAmount;
      form.elements['cycle'].value = preset.cycle || 'monthly';
      form.elements['billingDay'].value = preset.defaultDay || 1;
      form.elements['paymentMethod'].value = preset.paymentMethod || 'Credit Card';
      form.elements['packageTier'].value = preset.packages[0] || 'Standard';
      form.elements['url'].value = preset.url || '';
      form.elements['notes'].value = preset.notes || '';

      if (pkgSuggestionsEl && preset.packages) {
        pkgSuggestionsEl.innerHTML = `
          <span style="font-size:0.75rem; color:var(--text-secondary); width:100%; margin-bottom:2px;">Common packages:</span>
          ${preset.packages.map(pkg => `
            <button type="button" class="pkg-suggestion-chip">${pkg}</button>
          `).join('')}
        `;

        pkgSuggestionsEl.querySelectorAll('.pkg-suggestion-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            form.elements['packageTier'].value = chip.textContent;
            const match = chip.textContent.match(/\$([0-9.]+)/);
            if (match && match[1]) {
              form.elements['amount'].value = match[1];
            }
          });
        });
      }
    }

    handleBillFormSubmit() {
      const form = document.getElementById('form-bill');
      const data = {
        name: form.elements['name'].value,
        category: form.elements['category'].value,
        packageTier: form.elements['packageTier'].value,
        amount: parseFloat(form.elements['amount'].value) || 0,
        cycle: form.elements['cycle'].value,
        billingDay: parseInt(form.elements['billingDay'].value, 10) || 1,
        paymentMethod: form.elements['paymentMethod'].value,
        status: form.elements['status'].value,
        url: form.elements['url'].value,
        notes: form.elements['notes'].value
      };

      if (!data.name) {
        alert('Please provide a name for this bill.');
        return;
      }

      if (this.editingBillId) {
        StorageManager.updateBill(this.editingBillId, data);
        showToast(`Updated "${data.name}"`);
      } else {
        StorageManager.addBill(data);
        showToast(`Added "${data.name}"`);
      }

      this.bills = StorageManager.getBills();
      this.render();
      this.closeModal('modal-bill');
    }

    openChangePackageModal(id) {
      this.changingPackageBillId = id;
      const bill = this.bills.find(b => b.id === id);
      if (!bill) return;

      const nameEl = document.getElementById('pkg-modal-bill-name');
      const currentTierEl = document.getElementById('pkg-modal-current-tier');
      const currentPriceEl = document.getElementById('pkg-modal-current-price');
      const newTierInput = document.getElementById('input-new-tier');
      const newPriceInput = document.getElementById('input-new-price');
      const noteInput = document.getElementById('input-pkg-note');
      const suggestionsContainer = document.getElementById('pkg-quick-suggestions');
      const historyContainer = document.getElementById('pkg-history-container');

      if (nameEl) nameEl.textContent = bill.name;
      if (currentTierEl) currentTierEl.textContent = bill.packageTier || 'Standard';
      if (currentPriceEl) currentPriceEl.textContent = `${this.settings.currency}${bill.amount} / ${bill.cycle}`;

      if (newTierInput) newTierInput.value = bill.packageTier || '';
      if (newPriceInput) newPriceInput.value = bill.amount || '';
      if (noteInput) noteInput.value = '';

      const matchedPreset = PRESETS.find(p => bill.name.toLowerCase().includes(p.name.toLowerCase()));
      if (suggestionsContainer) {
        if (matchedPreset && matchedPreset.packages) {
          suggestionsContainer.innerHTML = matchedPreset.packages.map(pkg => `
            <button type="button" class="pkg-suggestion-chip">${pkg}</button>
          `).join('');

          suggestionsContainer.querySelectorAll('.pkg-suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
              newTierInput.value = chip.textContent;
              const match = chip.textContent.match(/\$([0-9.]+)/);
              if (match && match[1]) {
                newPriceInput.value = match[1];
              }
            });
          });
        } else {
          suggestionsContainer.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted)">Type new package details above.</span>';
        }
      }

      if (historyContainer) {
        const history = bill.history || [];
        if (history.length === 0) {
          historyContainer.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted)">No past package changes recorded.</span>';
        } else {
          historyContainer.innerHTML = history.map(item => `
            <div class="history-item">
              <div>
                <strong>${item.date}</strong>: ${item.note || 'Package changed'}
                ${item.newTier ? `<br><small style="color:var(--text-secondary)">Tier: ${item.newTier}</small>` : ''}
              </div>
              ${item.newAmount !== undefined ? `<span>${this.settings.currency}${item.newAmount}</span>` : ''}
            </div>
          `).join('');
        }
      }

      this.openModal('modal-package');
    }

    handleChangePackageSubmit() {
      if (!this.changingPackageBillId) return;

      const newTier = document.getElementById('input-new-tier').value.trim();
      const newPrice = parseFloat(document.getElementById('input-new-price').value) || 0;
      const note = document.getElementById('input-pkg-note').value.trim() || `Changed package to ${newTier}`;

      if (!newTier) {
        alert('Please enter a package / plan name.');
        return;
      }

      StorageManager.updateBill(this.changingPackageBillId, {
        packageTier: newTier,
        amount: newPrice,
        changeNote: note
      });

      this.bills = StorageManager.getBills();
      this.render();
      this.closeModal('modal-package');
      showToast(`Updated package to "${newTier}" ($${newPrice})`);
    }
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BillTrackerApp().init());
  } else {
    new BillTrackerApp().init();
  }

})();
