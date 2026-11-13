/**
 * BillTrack Application Controller
 * Orchestrates Storage, State, Filtering, and Modals
 */

import { StorageManager } from './storage.js';
import { UI, ICONS } from './ui.js';
import { PRESETS, CATEGORIES, BILLING_CYCLES, PAYMENT_METHODS } from './presets.js';
import { getNextDueDate } from './calculations.js';

class App {
  constructor() {
    this.bills = [];
    this.settings = StorageManager.getSettings();
    this.currentFilter = 'all'; // 'all' | 'active' | 'paused'
    this.searchQuery = '';
    this.sortBy = 'dueDate'; // 'dueDate' | 'amountDesc' | 'nameAsc'
    this.activeModal = null;
    this.editingBillId = null;
    this.changingPackageBillId = null;
  }

  init() {
    this.bills = StorageManager.getBills();
    this.applyTheme(this.settings.theme);

    // Register PWA Service Worker if available
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./service-worker.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    }

    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Quick presets
    UI.renderPresets('presets-scroll', (preset) => {
      this.openAddModalWithPreset(preset);
    });

    // Segmented control (All / Active / Paused)
    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
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

    // Add Bill FAB & Header button
    const addBtn = document.getElementById('btn-add-bill');
    const fabBtn = document.getElementById('btn-fab-add');
    if (addBtn) addBtn.addEventListener('click', () => this.openBillModal());
    if (fabBtn) fabBtn.addEventListener('click', () => this.openBillModal());

    // Settings Modal
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettingsModal());

    // Theme Toggle in Header
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        this.settings.theme = newTheme;
        StorageManager.saveSettings(this.settings);
        this.applyTheme(newTheme);
      });
    }

    // Modal Close Buttons & Backdrop Clicks
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Escape Key to Close Modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });

    // Bill Form Submit
    const billForm = document.getElementById('form-bill');
    if (billForm) {
      billForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBillFormSubmit();
      });
    }

    // Change Package Form Submit
    const pkgForm = document.getElementById('form-change-package');
    if (pkgForm) {
      pkgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleChangePackageSubmit();
      });
    }

    // Settings Form & Actions
    this.setupSettingsActions();
  }

  setupSettingsActions() {
    const currencySelect = document.getElementById('setting-currency');
    if (currencySelect) {
      currencySelect.value = this.settings.currency || 'KSh ';
      currencySelect.addEventListener('change', (e) => {
        this.settings.currency = e.target.value;
        StorageManager.saveSettings(this.settings);
        this.render();
        UI.showToast(`Currency changed to ${this.settings.currency}`);
      });
    }

    const btnExportJSON = document.getElementById('btn-export-json');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        StorageManager.exportJSON();
        UI.showToast('Backup JSON downloaded');
      });
    }

    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        StorageManager.exportCSV();
        UI.showToast('CSV export downloaded');
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
            UI.showToast(`Imported ${res.count} bills successfully!`);
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
          UI.showToast('Reset to sample subscriptions.');
        }
      });
    }
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  render() {
    UI.renderMetrics(this.bills, this.settings.currency);
    this.renderBills();
    UI.renderAnalytics(this.bills, this.settings.currency);
  }

  renderBills() {
    let filtered = [...this.bills];

    // Filter by status
    if (this.currentFilter === 'active') {
      filtered = filtered.filter(b => b.status === 'active');
    } else if (this.currentFilter === 'paused') {
      filtered = filtered.filter(b => b.status === 'paused');
    }

    // Search query
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

    // Sort order
    if (this.sortBy === 'dueDate') {
      filtered.sort((a, b) => {
        const da = getNextDueDate(a).daysRemaining;
        const db = getNextDueDate(b).daysRemaining;
        return da - db;
      });
    } else if (this.sortBy === 'amountDesc') {
      filtered.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (this.sortBy === 'nameAsc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    UI.renderBillsList(
      filtered,
      'bills-container',
      {
        onTogglePause: (id) => this.togglePause(id),
        onChangePackage: (id) => this.openChangePackageModal(id),
        onEdit: (id) => this.openBillModal(id),
        onDelete: (id) => this.deleteBill(id)
      },
      this.settings.currency
    );
  }

  togglePause(id) {
    const updated = StorageManager.togglePause(id);
    if (updated) {
      this.bills = StorageManager.getBills();
      this.render();
      const statusText = updated.status === 'paused' ? 'Paused (saved from totals)' : 'Resumed to Active';
      UI.showToast(`${updated.name} ${statusText}`);
    }
  }

  deleteBill(id) {
    const bill = this.bills.find(b => b.id === id);
    const name = bill ? bill.name : 'Bill';
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      StorageManager.deleteBill(id);
      this.bills = StorageManager.getBills();
      this.render();
      UI.showToast(`Deleted ${name}`);
    }
  }

  // --- Modal Controllers ---

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
    const modal = document.getElementById('modal-bill');
    const titleEl = document.getElementById('modal-bill-title');
    const form = document.getElementById('form-bill');
    const pkgSuggestionsEl = document.getElementById('bill-pkg-suggestions');
    if (!modal || !form) return;

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

    // Render package suggestions
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
          // Extract price if present e.g. "($15.49)"
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
      UI.showToast(`Updated "${data.name}"`);
    } else {
      StorageManager.addBill(data);
      UI.showToast(`Added "${data.name}"`);
    }

    this.bills = StorageManager.getBills();
    this.render();
    this.closeModal('modal-bill');
  }

  // --- Change Package Modal ---

  openChangePackageModal(id) {
    this.changingPackageBillId = id;
    const bill = this.bills.find(b => b.id === id);
    if (!bill) return;

    const modal = document.getElementById('modal-package');
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

    // Check if preset has suggestion packages
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

    // Render history
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
    UI.showToast(`Updated package to "${newTier}" ($${newPrice})`);
  }

  openSettingsModal() {
    this.openModal('modal-settings');
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
