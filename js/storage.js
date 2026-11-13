/**
 * Data Storage & Persistence Module for BillTrack:
 * - LocalStorage state management
 * - Seed data initialization matching user requirements
 * - Package tier change logging
 * - JSON Import / Export & CSV Export
 */

const STORAGE_KEY = "billtrack_bills_v1";
const SETTINGS_KEY = "billtrack_settings_v1";

export const DEFAULT_SETTINGS = {
  currency: "KSh ",
  theme: "light", // 'dark' | 'light' | 'system'
  defaultFilter: "all", // 'all' | 'active' | 'paused'
  sortBy: "dueDate", // 'dueDate' | 'amountDesc' | 'nameAsc' | 'status'
};

export const INITIAL_SEEDS = [
  {
    id: "seed-rent",
    name: "Apartment Rent",
    category: "housing",
    amount: 1250.0,
    cycle: "monthly",
    billingDay: 1,
    status: "active",
    packageTier: "2-Bedroom Apartment",
    paymentMethod: "Bank Transfer / Direct Debit",
    autoRenew: false,
    url: "",
    notes: "Primary monthly rent. Transferred on the 1st.",
    history: [
      {
        date: "2026-01-01",
        note: "Lease renewed for 2026",
        oldTier: "2-Bedroom Apartment",
        newTier: "2-Bedroom Apartment",
        price: 1250,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-wifi",
    name: "Home WiFi / Fiber",
    category: "utilities",
    amount: 65.0,
    cycle: "monthly",
    billingDay: 15,
    status: "active",
    packageTier: "Fiber 300 Mbps Unlimited",
    paymentMethod: "Credit Card",
    autoRenew: true,
    url: "",
    notes: "Fiber router in living room. Auto-debited on card.",
    history: [
      {
        date: "2026-03-10",
        note: "Upgraded from 100Mbps to 300Mbps",
        oldTier: "Fiber 100 Mbps",
        newTier: "Fiber 300 Mbps Unlimited",
        price: 65,
      },
    ],
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "seed-netflix",
    name: "Netflix",
    category: "entertainment",
    amount: 15.49,
    cycle: "monthly",
    billingDay: 18,
    status: "active",
    packageTier: "Standard 1080p (No Ads)",
    paymentMethod: "Credit Card",
    autoRenew: true,
    url: "https://www.netflix.com/youraccount",
    notes: "Living room TV and mobile profile.",
    history: [],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-spotify",
    name: "Spotify",
    category: "entertainment",
    amount: 11.99,
    cycle: "monthly",
    billingDay: 12,
    status: "active",
    packageTier: "Individual Premium",
    paymentMethod: "Apple Pay",
    autoRenew: true,
    url: "https://www.spotify.com/account/overview",
    notes: "Offline downloads and high quality streaming.",
    history: [],
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "seed-youtube",
    name: "YouTube Premium",
    category: "entertainment",
    amount: 13.99,
    cycle: "monthly",
    billingDay: 5,
    status: "active",
    packageTier: "Individual Plan",
    paymentMethod: "Google Pay",
    autoRenew: true,
    url: "https://www.youtube.com/paid_memberships",
    notes: "Ad-free playback & background audio + YouTube Music.",
    history: [],
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "seed-youtube-channel",
    name: "YouTube Channel Member",
    category: "creators",
    amount: 4.99,
    cycle: "monthly",
    billingDay: 14,
    status: "active",
    packageTier: "Tier 2 Channel Insider",
    paymentMethod: "Credit Card",
    autoRenew: true,
    url: "https://www.youtube.com/purchases",
    notes: "Supporter badge, custom emojis, and members-only live chats.",
    history: [],
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "seed-chatgpt",
    name: "ChatGPT",
    category: "tools",
    amount: 20.0,
    cycle: "monthly",
    billingDay: 22,
    status: "active",
    packageTier: "ChatGPT Plus (GPT-4o & o1)",
    paymentMethod: "Credit Card",
    autoRenew: true,
    url: "https://chatgpt.com/#settings/subscription",
    notes: "AI assistant for work & code analysis.",
    history: [],
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "seed-gym",
    name: "Gym Membership",
    category: "fitness",
    amount: 55.0,
    cycle: "monthly",
    billingDay: 1,
    status: "paused", // Demonstrates paused feature right out of the box!
    packageTier: "All-Clubs Peak Pass",
    paymentMethod: "Direct Debit",
    autoRenew: true,
    url: "",
    notes: "Temporarily paused for travel. Saving $55/mo while paused.",
    history: [
      {
        date: "2026-10-15",
        note: "Paused membership during travel season",
        oldTier: "All-Clubs Peak Pass",
        newTier: "All-Clubs Peak Pass (Paused)",
        price: 55,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export class StorageManager {
  static getBills() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveBills(INITIAL_SEEDS);
        return INITIAL_SEEDS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load bills from localStorage:", e);
      return INITIAL_SEEDS;
    }
  }

  static saveBills(bills) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
      return true;
    } catch (e) {
      console.error("Failed to save bills to localStorage:", e);
      return false;
    }
  }

  static addBill(billData) {
    const bills = this.getBills();
    const newBill = {
      id: "bill-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      name: billData.name.trim(),
      category: billData.category || "other",
      amount: parseFloat(billData.amount) || 0,
      cycle: billData.cycle || "monthly",
      billingDay: parseInt(billData.billingDay, 10) || 1,
      nextDueDate: billData.nextDueDate || "",
      status: billData.status || "active", // 'active' | 'paused' | 'cancelled'
      packageTier: billData.packageTier
        ? billData.packageTier.trim()
        : "Standard",
      paymentMethod: billData.paymentMethod || "Credit Card",
      autoRenew: billData.autoRenew !== false,
      url: billData.url ? billData.url.trim() : "",
      notes: billData.notes ? billData.notes.trim() : "",
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          note: "Subscription added",
          packageTier: billData.packageTier || "Standard",
          price: parseFloat(billData.amount) || 0,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    bills.unshift(newBill);
    this.saveBills(bills);
    return newBill;
  }

  static updateBill(id, updatedFields) {
    const bills = this.getBills();
    const index = bills.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const existing = bills[index];
    const history = existing.history || [];

    // Check if package or price changed to record in history
    const oldTier = existing.packageTier;
    const newTier =
      updatedFields.packageTier !== undefined
        ? updatedFields.packageTier
        : oldTier;
    const oldAmount = existing.amount;
    const newAmount =
      updatedFields.amount !== undefined
        ? parseFloat(updatedFields.amount)
        : oldAmount;

    if (oldTier !== newTier || oldAmount !== newAmount) {
      history.unshift({
        date: new Date().toISOString().split("T")[0],
        note: updatedFields.changeNote || "Package/Price updated",
        oldTier,
        newTier,
        oldAmount,
        newAmount,
      });
    }

    bills[index] = {
      ...existing,
      ...updatedFields,
      history,
      updatedAt: new Date().toISOString(),
    };

    this.saveBills(bills);
    return bills[index];
  }

  static togglePause(id, pauseReason = "") {
    const bills = this.getBills();
    const bill = bills.find((b) => b.id === id);
    if (!bill) return null;

    const newStatus = bill.status === "paused" ? "active" : "paused";
    const history = bill.history || [];

    history.unshift({
      date: new Date().toISOString().split("T")[0],
      note:
        newStatus === "paused"
          ? pauseReason
            ? `Paused: ${pauseReason}`
            : "Subscription paused"
          : "Subscription resumed to active",
      statusChange: newStatus,
    });

    bill.status = newStatus;
    bill.history = history;
    bill.updatedAt = new Date().toISOString();

    this.saveBills(bills);
    return bill;
  }

  static deleteBill(id) {
    const bills = this.getBills();
    const filtered = bills.filter((b) => b.id !== id);
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
      // Migrate from prior default if unchanged
      if (parsed.currency === "$") {
        parsed.currency = "KSh ";
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
      appName: "BillTrack",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      settings,
      bills,
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billtrack-backup-${new Date().toISOString().split("T")[0]}.json`;
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
      throw new Error(
        "Invalid JSON structure. Expected array of bills or backup object.",
      );
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static exportCSV() {
    const bills = this.getBills();
    const headers = [
      "Name",
      "Category",
      "Package / Tier",
      "Amount",
      "Billing Cycle",
      "Billing Day",
      "Status",
      "Payment Method",
      "Auto Renew",
      "Notes",
    ];

    const rows = bills.map((b) => [
      `"${(b.name || "").replace(/"/g, '""')}"`,
      `"${(b.category || "").replace(/"/g, '""')}"`,
      `"${(b.packageTier || "").replace(/"/g, '""')}"`,
      b.amount,
      b.cycle,
      b.billingDay || "",
      b.status,
      `"${(b.paymentMethod || "").replace(/"/g, '""')}"`,
      b.autoRenew ? "Yes" : "No",
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billtrack-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
