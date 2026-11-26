// Hearth & Ledger — app.js
// State, hash routing and event wiring. The site is a single page whose
// five sections are reached by nav links; every control updates the same
// state object, which is saved to localStorage so the household's edits
// survive a reload. No network requests anywhere.

import { BUDGETS, BILLS, GOALS, MONTHS, TRANSACTIONS } from './data.js';
import { drawDonutChart, drawTrendChart } from './charts.js';
import {
  renderBills,
  renderBudgets,
  renderDashboard,
  renderReports,
  renderTransactions,
} from './views.js';

const STORAGE_KEY = 'hearth-ledger-v1';
const DEFAULT_MONTH = '2026-11';
const ROUTES = ['dashboard', 'transactions', 'budgets', 'bills', 'reports'];

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.transactions && saved.budgets) return saved;
    }
  } catch {
    // A damaged save is ignored; the household starts from its records.
  }
  return {
    transactions: deepCopy(TRANSACTIONS),
    budgets: deepCopy(BUDGETS),
    bills: deepCopy(BILLS),
    goals: deepCopy(GOALS),
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota: the page still works for this visit.
  }
}

const state = loadState();
let month = DEFAULT_MONTH;
let route = 'dashboard';
let filterCat = 'all';
let filterQ = '';

function monthContext() {
  return {
    month,
    months: MONTHS,
    txs: state.transactions[month] || [],
    allTxs: state.transactions,
    budgets: state.budgets[month] || {},
    bills: state.bills,
    goals: state.goals,
    filterCat,
    filterQ,
  };
}

function render() {
  const page = document.getElementById('page');
  const ctx = monthContext();
  if (route === 'transactions') page.innerHTML = renderTransactions(ctx);
  else if (route === 'budgets') page.innerHTML = renderBudgets(ctx);
  else if (route === 'bills') page.innerHTML = renderBills(ctx);
  else if (route === 'reports') page.innerHTML = renderReports(ctx);
  else page.innerHTML = renderDashboard(ctx);

  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });

  if (route === 'reports') {
    const trend = document.getElementById('trend-chart');
    const donut = document.getElementById('donut-chart');
    if (trend) drawTrendChart(trend, state.transactions, MONTHS);
    if (donut) drawDonutChart(donut, ctx.txs);
  }
  window.scrollTo(0, 0);
}

function routeFromHash() {
  const name = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  route = ROUTES.includes(name) ? name : 'dashboard';
}

function changeMonth(direction) {
  const idx = MONTHS.indexOf(month);
  const next = idx + direction;
  if (next >= 0 && next < MONTHS.length) {
    month = MONTHS[next];
    render();
  }
}

function nextTxId() {
  return 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

function bindEvents() {
  window.addEventListener('hashchange', () => {
    routeFromHash();
    render();
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'add-tx-form') return;
    event.preventDefault();
    const form = event.target;
    const desc = form.desc.value.trim();
    const amount = Number(form.amount.value);
    const cat = form.cat.value;
    const date = form.date.value;
    const type = form.type.value;
    if (!desc || !Number.isFinite(amount) || amount <= 0 || !date) return;
    const tx = {
      id: nextTxId(),
      date,
      desc,
      cat: type === 'income' ? 'income' : cat,
      amount: Math.round(amount * 100) / 100,
      type,
    };
    if (!state.transactions[month]) state.transactions[month] = [];
    state.transactions[month].push(tx);
    saveState(state);
    form.reset();
    form.date.value = month + '-26';
    render();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;

    if (action === 'month-prev') changeMonth(-1);
    if (action === 'month-next') changeMonth(1);

    if (action === 'delete-tx') {
      const id = button.dataset.id;
      state.transactions[month] = (state.transactions[month] || []).filter((t) => t.id !== id);
      saveState(state);
      render();
    }

    if (action === 'save-budget') {
      const cat = button.dataset.cat;
      const input = document.querySelector(`input[data-budget-cat="${cat}"]`);
      const value = Number(input.value);
      if (Number.isFinite(value) && value >= 0) {
        if (!state.budgets[month]) state.budgets[month] = {};
        state.budgets[month][cat] = Math.round(value);
        saveState(state);
        render();
      }
    }

    if (action === 'toggle-bill') {
      const bill = state.bills.find((b) => b.id === button.dataset.id);
      if (bill) {
        bill.paid = !bill.paid;
        saveState(state);
        render();
      }
    }

    if (action === 'add-goal') {
      const goal = state.goals.find((g) => g.id === button.dataset.id);
      const input = document.querySelector(`input[data-goal-id="${goal.id}"]`);
      const value = Number(input.value);
      if (goal && Number.isFinite(value) && value > 0) {
        goal.saved = Math.round((goal.saved + value) * 100) / 100;
        saveState(state);
        render();
      }
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.id === 'filter-cat') {
      filterCat = event.target.value;
      render();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'filter-q') {
      filterQ = event.target.value;
      // Re-render only the table body would be nicer; a full re-render
      // keeps every figure in sync, and the input keeps focus because
      // the search box is re-created with its value.
      const pos = event.target.selectionStart;
      render();
      const box = document.getElementById('filter-q');
      if (box) {
        box.focus();
        box.setSelectionRange(pos, pos);
      }
    }
  });
}

routeFromHash();
bindEvents();
render();
