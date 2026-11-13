# 💳 BillTrack — Recurrent Bills & Subscription Tracker

A sleek, modern, iOS-inspired personal recurring bills and subscription manager designed to give you instant clarity over your recurring financial commitments.

---

## 🌟 Key Features

### 1. Weekly & Monthly Cash Flow Totals
- **Active Monthly Total**: Normalized monthly expenditure for all active commitments.
- **Active Weekly Total**: Exact weekly cash flow burn, making weekly budgeting effortless.
- **Smart Cycle Normalization**:
  - **Weekly**: $\text{Monthly} = \frac{\text{amount} \times 52}{12}$
  - **Bi-weekly**: $\text{Monthly} = \frac{\text{amount} \times 26}{12}$
  - **Quarterly**: $\text{Monthly} = \frac{\text{amount}}{3}$
  - **Yearly (Annual)**: $\text{Monthly} = \frac{\text{amount}}{12}$, $\text{Weekly} = \frac{\text{amount}}{52}$
  - Displays both your billed amount (e.g. `$120/yr`) and its prorated monthly & weekly impact (`$10.00/mo • $2.31/wk`).

### 2. Pause / Resume Lifecycle with Savings Tracker
- Easily toggle any subscription to **Paused** with a single click (iOS toggle switch on every card).
- Paused bills are immediately deducted from your active weekly and monthly burn totals.
- The **Paused Savings** card tracks exactly how much money you are saving each month while paused (e.g., pausing Gym during travel season).
- One-click resume restores it back to active status.

### 3. Package & Plan Tier Management
- Track the exact package/tier for every service (e.g., *Netflix Standard 1080p*, *Spotify Family*, *ChatGPT Plus*, *Fiber 300 Mbps*).
- **"Change Package" Action**: A dedicated modal to switch plans, update pricing, and log package change history over time.

### 4. 1-Tap Quick-Add Presets
Pre-configured templates for the exact recurring bills you specified:
- 🏠 **Rent** (Housing — 1st of month, Bank Transfer)
- 🌐 **Home WiFi / Fiber** (Utilities — 50/100/300 Mbps Fiber options)
- 🎬 **Netflix** (Standard with Ads, Standard 1080p, Premium 4K + HDR)
- 🎵 **Spotify** (Individual, Duo, Family, Student)
- ▶️ **YouTube Premium** (Ad-free playback & background play)
- 🌟 **YouTube Channel Memberships** (Creator support tiers with channel name)
- 🤖 **ChatGPT** (Free, Plus, Pro, Team)
- 🏋️ **Gym Membership** (Peak, Off-Peak, Annual prepaid)

### 5. Critical Missing Details Added
- ⏰ **Due Date Countdown Badges**: Automatic calculation of days remaining (e.g., `Due in 3 days`, `Due Tomorrow`, `Due Today`, `Overdue`).
- 💳 **Payment Method Tracking**: Know which credit card, debit card, Apple Pay, or bank debit each bill is tied to (invaluable when a card expires or gets replaced).
- 🔗 **Direct Portal Link**: 1-click jump button directly to the account/management page for that service (e.g. `netflix.com/youraccount`, `chatgpt.com/#settings/subscription`).
- 📊 **Spending Distribution Analytics**: Visual stacked percentage bar and category legend showing where your money goes.
- 💾 **Data Portability**: Full JSON Backup & Restore, plus CSV export for Excel / Apple Numbers / Google Sheets.
- 🌗 **Apple iOS Aesthetic**: SF Pro typography, smooth squircle cards, segmented controls, haptic-like animations, and light/dark theme toggle.

---

## 🚀 How to Run the Web App Now

### Option 1: Direct Double-Click (Zero Setup)
Simply open `index.html` in Microsoft Edge, Google Chrome, Safari, or Firefox:
- Works 100% offline.
- Data persists automatically in your browser's `localStorage`.

### Option 2: Local Web Server (PowerShell)
To run a local web server:
1. Open PowerShell in this folder (`d:\Projects\Code Castler\my-bills`).
2. Run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
3. Open your browser at:
   ```
   http://localhost:8080/
   ```

---

## 📱 Preparing for iOS Application

The application is already engineered specifically with an iOS transition in mind:
- Standard Apple Human Interface Guidelines (HIG) touch target sizes ($\ge 44 \times 44\text{px}$).
- iOS safe-area insets and `viewport-fit=cover`.
- `manifest.json` and Apple mobile web app meta tags (`apple-mobile-web-app-capable`).
- Dedicated Apple Touch Icon in `icons/icon.svg`.

### Path A: Use as an iOS Web App (Today — No Mac / Xcode Needed)
1. Upload this folder to GitHub Pages, Netlify, Vercel, or host locally on your home network.
2. Open the URL in **Safari on your iPhone**.
3. Tap the **Share** button (box with upward arrow) at the bottom.
4. Scroll down and tap **"Add to Home Screen"**.
5. It will install with its app icon and launch as a standalone, full-screen iOS app without browser address bars!

### Path B: Wrap as a Native iOS App with Capacitor
When you are ready to produce an `.ipa` file or deploy to the Apple App Store:
1. Initialize Capacitor:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/ios
   npx cap init BillTrack com.yourname.billtrack --web-dir .
   ```
2. Add the iOS platform:
   ```bash
   npx cap add ios
   ```
3. Open in Xcode:
   ```bash
   npx cap open ios
   ```
4. Build and run on your iPhone or iOS Simulator. All your HTML/CSS/JS and `localStorage` work seamlessly inside WKWebView!

### Path C: Native SwiftUI Architecture Blueprint
If you decide to rewrite natively in Swift for iOS later:
- **Model**:
  ```swift
  struct Bill: Identifiable, Codable {
      var id: UUID = UUID()
      var name: String
      var category: Category
      var amount: Double
      var cycle: BillingCycle // weekly, monthly, quarterly, yearly
      var billingDay: Int
      var status: BillStatus // active, paused, cancelled
      var packageTier: String
      var paymentMethod: String
      var notes: String?
  }
  ```
- **Calculations**: The normalization formulas in `js/calculations.js` map 1:1 to computed properties:
  ```swift
  var monthlyEquivalent: Double {
      switch cycle {
      case .weekly: return (amount * 52) / 12
      case .biweekly: return (amount * 26) / 12
      case .monthly: return amount
      case .quarterly: return amount / 3
      case .yearly: return amount / 12
      }
  }
  ```

---

## 📁 File Structure

```
my-bills/
├── index.html           # Main HTML5 application with iOS view hierarchy
├── manifest.json        # PWA Web App Manifest for iOS home screen installation
├── service-worker.js    # Offline caching service worker
├── server.ps1           # Zero-dependency PowerShell local HTTP server
├── css/
│   └── styles.css       # Clean Apple iOS-inspired stylesheet (light/dark mode)
├── js/
│   ├── bundle.js        # Universal standalone runtime (works via file:// & http)
│   ├── app.js           # Modular Application Controller
│   ├── storage.js       # LocalStorage persistence, backup & CSV export
│   ├── calculations.js  # Normalization math (weekly/monthly/annual)
│   ├── presets.js       # Pre-configured templates (Rent, WiFi, Netflix, Spotify...)
│   └── ui.js            # View renderer, SVG icon repository & toasts
└── icons/
    └── icon.svg         # Crisp vector app icon (Apple squircle aesthetic)
```
