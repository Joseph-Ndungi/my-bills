/**
 * UI Renderer and View Controller for BillTrack
 * Clean, lightweight, zero external library dependencies.
 */

import { formatCurrency, calculateTotals, getNextDueDate, getDueBadgeInfo, toMonthlyAmount, toWeeklyAmount } from './calculations.js';
import { CATEGORIES, PRESETS, BILLING_CYCLES, PAYMENT_METHODS } from './presets.js';

// SVG Icons repository for crisp rendering without external icon fonts
export const ICONS = {
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
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
};

export class UI {
  /**
   * Renders the top Hero Metrics: Monthly Total, Weekly Total, Paused Savings, and Next Due
   */
  static renderMetrics(bills, currency = 'KSh ') {
    const totals = calculateTotals(bills);

    const activeMonthlyEl = document.getElementById('metric-active-monthly');
    const activeWeeklyEl = document.getElementById('metric-active-weekly');
    const activeCountEl = document.getElementById('metric-active-count');
    const pausedMetricEl = document.getElementById('metric-paused-savings');
    const pausedCountEl = document.getElementById('metric-paused-count');
    const nextDueEl = document.getElementById('metric-next-due');

    if (activeMonthlyEl) {
      activeMonthlyEl.textContent = formatCurrency(totals.activeMonthly, currency);
    }
    if (activeWeeklyEl) {
      activeWeeklyEl.textContent = formatCurrency(totals.activeWeekly, currency);
    }
    if (activeCountEl) {
      activeCountEl.textContent = `${totals.activeCount} active bill${totals.activeCount === 1 ? '' : 's'}`;
    }

    if (pausedMetricEl && pausedCountEl) {
      if (totals.pausedCount > 0) {
        pausedMetricEl.textContent = `${formatCurrency(totals.pausedMonthly, currency)}/mo saved`;
        pausedCountEl.textContent = `${totals.pausedCount} paused`;
      } else {
        pausedMetricEl.textContent = 'None paused';
        pausedCountEl.textContent = '0 paused';
      }
    }

    // Find next upcoming active bill
    if (nextDueEl) {
      const activeBills = bills.filter(b => b.status === 'active');
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
          nextDueEl.innerHTML = `<span class="highlight">${next.bill.name}</span> (${badge.text})`;
        }
      }
    }

    // Update Segmented Control Badges
    const badgeAll = document.getElementById('count-all');
    const badgeActive = document.getElementById('count-active');
    const badgePaused = document.getElementById('count-paused');

    if (badgeAll) badgeAll.textContent = totals.totalBills;
    if (badgeActive) badgeActive.textContent = totals.activeCount;
    if (badgePaused) badgePaused.textContent = totals.pausedCount;
  }

  /**
   * Renders the Quick Presets scroll bar
   */
  static renderPresets(containerId, onSelectPreset) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = PRESETS.map(preset => `
      <button type="button" class="preset-chip" data-preset-id="${preset.id}">
        <span class="preset-dot" style="background-color: ${preset.color}"></span>
        <span>${preset.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset-id');
        const found = PRESETS.find(p => p.id === presetId);
        if (found && onSelectPreset) {
          onSelectPreset(found);
        }
      });
    });
  }

  /**
   * Renders the List of Bill Cards
   */
  static renderBillsList(bills, containerId, handlers = {}, currency = 'KSh ') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!bills || bills.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          ${ICONS.tag}
          <h3>No subscriptions found</h3>
          <p>Tap a quick preset above or hit "+ Add Bill" to add your first bill.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = bills.map(bill => {
      const catConfig = CATEGORIES[bill.category] || CATEGORIES.other;
      const iconSvg = ICONS[catConfig.icon] || ICONS.tag;
      const isPaused = bill.status === 'paused';
      const isCancelled = bill.status === 'cancelled';

      const nextDue = getNextDueDate(bill);
      const dueBadge = getDueBadgeInfo(nextDue.daysRemaining);

      const monthlyCost = toMonthlyAmount(bill.amount, bill.cycle);
      const weeklyCost = toWeeklyAmount(bill.amount, bill.cycle);

      // Label for cycle
      const cycleObj = BILLING_CYCLES.find(c => c.value === bill.cycle) || { label: 'Monthly' };

      return `
        <div class="bill-card ${isPaused ? 'status-paused' : ''} ${isCancelled ? 'status-cancelled' : ''}" data-id="${bill.id}">
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

              <!-- Quick Change Package / Tier Action -->
              <button type="button" class="bill-action-btn btn-change-pkg" data-action="change-package" data-id="${bill.id}" title="Upgrade or switch package tier">
                ${ICONS.layers}
                <span>Change Package</span>
              </button>
            </div>

            <div class="bill-footer-right">
              ${bill.url ? `
                <a href="${escapeHtml(bill.url)}" target="_blank" rel="noopener noreferrer" class="bill-action-btn" title="Open management portal">
                  ${ICONS.external}
                  <span>Manage</span>
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

    // Attach event listeners
    container.querySelectorAll('.toggle-pause-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.getAttribute('data-id');
        if (handlers.onTogglePause) {
          handlers.onTogglePause(id);
        }
      });
    });

    container.querySelectorAll('[data-action="change-package"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (handlers.onChangePackage) {
          handlers.onChangePackage(id);
        }
      });
    });

    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (handlers.onEdit) {
          handlers.onEdit(id);
        }
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (handlers.onDelete) {
          handlers.onDelete(id);
        }
      });
    });
  }

  /**
   * Renders the category spending breakdown visual bar & legend
   */
  static renderAnalytics(bills, currency = 'KSh ') {
    const totals = calculateTotals(bills);
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

    // Stack segments
    stackContainer.innerHTML = sortedCategories.map(catKey => {
      const catVal = totals.categoryTotals[catKey];
      const pct = (catVal / totals.activeMonthly) * 100;
      const color = CATEGORIES[catKey]?.color || '#94a3b8';
      return `<div class="bar-segment" style="width: ${pct}%; background-color: ${color};" title="${CATEGORIES[catKey]?.label || catKey}: ${pct.toFixed(1)}%"></div>`;
    }).join('');

    // Legend items
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

  /**
   * Shows a floating toast message
   */
  static showToast(message, type = 'info') {
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
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
