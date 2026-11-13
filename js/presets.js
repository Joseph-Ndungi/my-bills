/**
 * Quick-add presets pre-configured for the user's specific recurring bills:
 * Rent, WiFi, Netflix, Spotify, YouTube Premium, YouTube Channel Memberships, ChatGPT, and Gym.
 */

export const PRESETS = [
  {
    id: 'rent',
    name: 'Rent',
    category: 'housing',
    defaultAmount: 1200,
    cycle: 'monthly',
    color: '#3b82f6',
    icon: 'home',
    packages: ['1 Bedroom Apt', '2 Bedroom Apt', 'Studio', 'Shared Room', 'House'],
    paymentMethod: 'Bank Transfer',
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

export const CATEGORIES = {
  housing: { label: 'Housing & Rent', color: '#3b82f6', icon: 'home' },
  utilities: { label: 'Utilities & Internet', color: '#06b6d4', icon: 'wifi' },
  entertainment: { label: 'Entertainment & Media', color: '#ec4899', icon: 'tv' },
  creators: { label: 'Creators & Channels', color: '#f59e0b', icon: 'user-check' },
  tools: { label: 'AI, Tech & Software', color: '#10b981', icon: 'cpu' },
  fitness: { label: 'Health & Fitness', color: '#8b5cf6', icon: 'activity' },
  other: { label: 'Other Recurring', color: '#64748b', icon: 'tag' }
};

export const BILLING_CYCLES = [
  { value: 'weekly', label: 'Weekly', weeksPerCycle: 1, monthsPerCycle: 1 / 4.3333 },
  { value: 'biweekly', label: 'Every 2 Weeks', weeksPerCycle: 2, monthsPerCycle: 2 / 4.3333 },
  { value: 'monthly', label: 'Monthly', weeksPerCycle: 4.3333, monthsPerCycle: 1 },
  { value: 'quarterly', label: 'Quarterly (Every 3 Mo)', weeksPerCycle: 13, monthsPerCycle: 3 },
  { value: 'semiannual', label: 'Every 6 Months', weeksPerCycle: 26, monthsPerCycle: 6 },
  { value: 'yearly', label: 'Yearly (Annual)', weeksPerCycle: 52, monthsPerCycle: 12 }
];

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Apple Pay',
  'Google Pay',
  'Bank Transfer / Direct Debit',
  'PayPal',
  'Cash',
  'Other'
];
