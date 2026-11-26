// Hearth & Ledger — views.js
// Pure rendering: each function takes the current context and returns an
// HTML string. Event wiring lives in app.js. All user-entered text is
// escaped before it reaches the page.

import { CATEGORIES, MONTH_LABELS } from './data.js';

export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function money(amount) {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  return sign + '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(amount) {
  return '$' + Math.round(Math.abs(amount)).toLocaleString('en-US');
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#718096' };
}

export function monthIncome(txs) {
  return txs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

export function monthSpending(txs) {
  return txs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function categoryTotals(txs) {
  const totals = {};
  for (const t of txs) {
    if (t.type !== 'expense') continue;
    totals[t.cat] = (totals[t.cat] || 0) + t.amount;
  }
  return totals;
}

function monthSwitcher(ctx) {
  const idx = ctx.months.indexOf(ctx.month);
  const prevDisabled = idx <= 0 ? 'disabled' : '';
  const nextDisabled = idx >= ctx.months.length - 1 ? 'disabled' : '';
  return `<div class="month-switch" role="group" aria-label="Choose month">
    <button class="chip-btn" data-action="month-prev" ${prevDisabled}>&larr; Prev</button>
    <span class="month-label">${esc(MONTH_LABELS[ctx.month])}</span>
    <button class="chip-btn" data-action="month-next" ${nextDisabled}>Next &rarr;</button>
  </div>`;
}

function pageHead(title, intro, ctx) {
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${intro}</p></div>${monthSwitcher(ctx)}</div>`;
}

// ---------------- Dashboard ----------------

export function renderDashboard(ctx) {
  const income = monthIncome(ctx.txs);
  const spending = monthSpending(ctx.txs);
  const left = income - spending;
  const saved = ctx.txs.filter((t) => t.type === 'expense' && t.cat === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);
  const rate = income > 0 ? Math.round((saved / income) * 100) : 0;
  const totals = categoryTotals(ctx.txs);
  const topCats = CATEGORIES
    .filter((c) => totals[c.id] > 0 && c.id !== 'savings')
    .sort((a, b) => totals[b.id] - totals[a.id])
    .slice(0, 6);
  const maxCat = topCats.length ? totals[topCats[0].id] : 1;
  const upcoming = ctx.bills.filter((b) => !b.paid);
  const recent = [...ctx.txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return `
  ${pageHead(`${MONTH_LABELS[ctx.month]} at a glance`, 'How the Alvarez household is doing this month — money in, money out, and what is left for the things that matter.', ctx)}
  <div class="grid grid-4">
    <div class="card stat"><div class="label">Income</div><div class="value">${money(income)}</div><div class="sub">${ctx.txs.filter((t) => t.type === 'income').length} paychecks &amp; payments</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(spending)}</div><div class="sub">including ${money(saved)} moved to savings</div></div>
    <div class="card stat"><div class="label">Left over</div><div class="value ${left < 0 ? 'negative' : ''}">${money(left)}</div><div class="sub">${left >= 0 ? 'Still unspent this month' : 'Over budget this month'}</div></div>
    <div class="card stat"><div class="label">Savings rate</div><div class="value">${rate}%</div><div class="sub">of income set aside</div></div>
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Where the money went</h2>
      <p class="muted">Biggest spending categories, ${esc(MONTH_LABELS[ctx.month])}.</p>
      ${topCats.map((c) => `
        <div class="cat-row">
          <span class="cat-name"><span class="cat-dot" style="background:${c.color}"></span>${esc(c.label)}</span>
          <span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.round((totals[c.id] / maxCat) * 100)}%;background:${c.color}"></span></span>
          <span class="cat-amount">${money(totals[c.id])}</span>
        </div>`).join('')}
      <p style="margin:12px 0 0"><a href="#/budgets">See all budgets &rarr;</a></p>
    </section>
    <section class="card">
      <h2>Bills still to pay</h2>
      <p class="muted">${upcoming.length ? `${upcoming.length} bill${upcoming.length === 1 ? '' : 's'} left in ${esc(MONTH_LABELS[ctx.month])}.` : 'Every bill this month is paid. Nice work.'}</p>
      ${upcoming.map((b) => `
        <div class="bill-row">
          <span class="bill-name">${esc(b.name)}</span>
          <span class="bill-due">Due ${esc(MONTH_LABELS[ctx.month].split(' ')[0].slice(0, 3))} ${b.day}</span>
          <span class="bill-amount">${money(b.amount)}</span>
          <span class="pill due">Unpaid</span>
        </div>`).join('')}
      <p style="margin:12px 0 0"><a href="#/bills">All bills &amp; savings goals &rarr;</a></p>
    </section>
  </div>
  <section class="card" style="margin-top:16px">
    <h2>Recent transactions</h2>
    <p class="muted">The latest money in and out.</p>
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th class="hide-mobile">Category</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>
      ${recent.map((t) => `
        <tr>
          <td class="tx-date">${esc(t.date)}</td>
          <td>${esc(t.desc)}</td>
          <td class="hide-mobile">${t.type === 'income' ? 'Income' : esc(categoryById(t.cat).label)}</td>
          <td class="amount ${t.type}">${t.type === 'income' ? '+' : '&minus;'}${money(t.amount)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <p style="margin:12px 0 0"><a href="#/transactions">All transactions &rarr;</a></p>
  </section>`;
}

// ---------------- Transactions ----------------

export function renderTransactions(ctx) {
  const filtered = ctx.txs
    .filter((t) => ctx.filterCat === 'all' || t.cat === ctx.filterCat || (ctx.filterCat === 'income' && t.type === 'income'))
    .filter((t) => !ctx.filterQ || t.desc.toLowerCase().includes(ctx.filterQ.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const shownSpent = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const shownIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  return `
  ${pageHead('Transactions', 'Every dollar in and out. Add a new one below — totals, budgets and charts update at once.', ctx)}
  <section class="card" style="margin-bottom:16px">
    <h2>Add a transaction</h2>
    <form class="add-form" id="add-tx-form">
      <div class="span-2"><label for="tx-desc">Description</label><input id="tx-desc" name="desc" required maxlength="80" placeholder="e.g. Weekly grocery shop"></div>
      <div><label for="tx-amount">Amount ($)</label><input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></div>
      <div><label for="tx-cat">Category</label><select id="tx-cat" name="cat">${CATEGORIES.filter((c) => c.id !== 'income').map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select></div>
      <div><label for="tx-date">Date</label><input id="tx-date" name="date" type="date" value="${ctx.month}-26" min="${ctx.month}-01" max="${ctx.month}-30" required></div>
      <div><label for="tx-type">Type</label><select id="tx-type" name="type"><option value="expense">Expense</option><option value="income">Income</option></select></div>
      <div><button class="btn-primary" type="submit">Add</button></div>
    </form>
  </section>
  <section class="card">
    <h2>${filtered.length} transaction${filtered.length === 1 ? '' : 's'}</h2>
    <p class="muted">Showing ${money(shownIncome)} in and ${money(shownSpent)} out.</p>
    <div class="tx-toolbar">
      <label for="filter-cat" class="muted">Category</label>
      <select id="filter-cat">
        <option value="all" ${ctx.filterCat === 'all' ? 'selected' : ''}>All categories</option>
        <option value="income" ${ctx.filterCat === 'income' ? 'selected' : ''}>Income</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${ctx.filterCat === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
      </select>
      <input type="search" id="filter-q" placeholder="Search descriptions…" value="${esc(ctx.filterQ)}" aria-label="Search transactions">
    </div>
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th class="hide-mobile">Category</th><th style="text-align:right">Amount</th><th></th></tr></thead>
      <tbody>
      ${filtered.length ? filtered.map((t) => `
        <tr>
          <td class="tx-date">${esc(t.date)}</td>
          <td>${esc(t.desc)}</td>
          <td class="hide-mobile">${t.type === 'income' ? 'Income' : `<span class="cat-dot" style="background:${categoryById(t.cat).color}"></span>${esc(categoryById(t.cat).label)}`}</td>
          <td class="amount ${t.type}">${t.type === 'income' ? '+' : '&minus;'}${money(t.amount)}</td>
          <td><button class="delete-btn" data-action="delete-tx" data-id="${esc(t.id)}">Delete</button></td>
        </tr>`).join('') : '<tr><td colspan="5" class="muted">No transactions match this filter.</td></tr>'}
      </tbody>
    </table>
  </section>`;
}

// ---------------- Budgets ----------------

export function renderBudgets(ctx) {
  const totals = categoryTotals(ctx.txs);
  const budgetCats = CATEGORIES.filter((c) => c.id !== 'income');
  const totalBudget = budgetCats.reduce((s, c) => s + (ctx.budgets[c.id] || 0), 0);
  const totalSpent = budgetCats.reduce((s, c) => s + (totals[c.id] || 0), 0);

  return `
  ${pageHead('Budgets', 'What the household planned to spend this month, against what it actually spent. Edit any budget — the bars move with it.', ctx)}
  <div class="card" style="margin-bottom:16px">
    <h2>Month total</h2>
    <p class="muted" style="margin:0">${money(totalSpent)} spent of a ${money(totalBudget)} plan — <b>${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</b> used, ${money(Math.max(0, totalBudget - totalSpent))} still in the plan.</p>
  </div>
  <div class="grid grid-3">
    ${budgetCats.map((c) => {
      const budget = ctx.budgets[c.id] || 0;
      const spent = totals[c.id] || 0;
      const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const over = spent > budget;
      const remaining = budget - spent;
      return `
      <section class="card budget-card">
        <div class="budget-top">
          <h3><span class="cat-dot" style="background:${c.color}"></span>${esc(c.label)}</h3>
          <span class="pct">${pct}% used</span>
        </div>
        <div><span class="spent">${money(spent)}</span> <span class="of">of ${money(budget)}</span></div>
        <div class="bar-track"><span class="bar-fill" style="display:block;width:${Math.min(100, pct)}%;background:${over ? 'var(--red)' : c.color}"></span></div>
        <div class="remaining ${over ? 'over' : 'left'}">${over ? `${money(-remaining)} over budget` : `${money(remaining)} left`}</div>
        <div class="budget-edit">
          <label for="budget-${c.id}" class="muted">Monthly budget $</label>
          <input id="budget-${c.id}" type="number" min="0" step="1" value="${budget}" data-budget-cat="${c.id}">
          <button class="btn-ghost" data-action="save-budget" data-cat="${c.id}">Save</button>
        </div>
      </section>`;
    }).join('')}
  </div>`;
}

// ---------------- Bills & Goals ----------------

export function renderBills(ctx) {
  const unpaid = ctx.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const today = 26; // November 26, 2026 — the household checks in near month's end.

  return `
  ${pageHead('Bills & Goals', 'The bills that keep the lights on, and the savings goals the household is building toward.', ctx)}
  <div class="grid grid-2">
    <section class="card">
      <h2>Monthly bills</h2>
      <p class="muted">${unpaid.length ? `${money(unpaidTotal)} still to pay this month.` : 'All bills paid for this month.'}</p>
      ${ctx.bills.map((b) => {
        const shortMonth = MONTH_LABELS[ctx.month].split(' ')[0].slice(0, 3);
        const dueLabel = `Due ${shortMonth} ${b.day}`;
        const pill = b.paid
          ? '<span class="pill paid">Paid</span>'
          : (b.day - today <= 4 ? '<span class="pill soon">Due soon</span>' : '<span class="pill due">Unpaid</span>');
        return `
        <div class="bill-row">
          <span class="bill-name">${esc(b.name)}</span>
          <span class="bill-due">${dueLabel}</span>
          <span class="bill-amount">${money(b.amount)}</span>
          ${pill}
          <button class="btn-ghost" data-action="toggle-bill" data-id="${esc(b.id)}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
        </div>`;
      }).join('')}
    </section>
    <section class="card">
      <h2>Savings goals</h2>
      <p class="muted">Every dollar moved to savings in Transactions counts toward these goals.</p>
      ${ctx.goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        return `
        <div class="goal-row">
          <div class="goal-head"><span class="goal-name">${esc(g.name)}</span><span class="goal-nums"><b>${money(g.saved)}</b> of ${money(g.target)} · ${pct}%</span></div>
          <div class="bar-track"><span class="bar-fill" style="display:block;width:${pct}%;background:var(--green-mid)"></span></div>
          <div class="muted">${esc(g.note)} — ${money(g.target - g.saved)} to go.</div>
          <div class="goal-add">
            <label for="goal-${g.id}" class="muted">Add $</label>
            <input id="goal-${g.id}" type="number" min="1" step="1" placeholder="50" data-goal-id="${g.id}">
            <button class="btn-ghost" data-action="add-goal" data-id="${esc(g.id)}">Add to goal</button>
          </div>
        </div>`;
      }).join('')}
    </section>
  </div>`;
}

// ---------------- Reports ----------------

export function renderReports(ctx) {
  const totals = categoryTotals(ctx.txs);
  const cats = CATEGORIES.filter((c) => totals[c.id] > 0 && c.id !== 'savings')
    .sort((a, b) => totals[b.id] - totals[a.id]);
  const top = cats[0];
  const income = monthIncome(ctx.txs);
  const spending = monthSpending(ctx.txs);
  const prevMonth = ctx.months[Math.max(0, ctx.months.indexOf(ctx.month) - 1)];
  const prevSpending = monthSpending(ctx.allTxs[prevMonth] || []);

  return `
  ${pageHead('Reports', 'Three months side by side, and where this month&rsquo;s money actually went. Switch months above to re-draw the charts.', ctx)}
  <div class="insight" style="margin-bottom:16px">
    <b>This month in one line:</b> ${esc(top ? top.label : 'Nothing')} is the biggest spending category at ${money(top ? totals[top.id] : 0)}.
    Spending is ${spending > prevSpending ? 'up' : 'down'} ${money(Math.abs(spending - prevSpending))} on ${esc(MONTH_LABELS[prevMonth])},
    and ${money(income - spending)} of ${money(income)} income is still unspent.
  </div>
  <div class="grid grid-2">
    <section class="card">
      <h2>Income vs spending</h2>
      <p class="muted">September – November 2026, in dollars.</p>
      <div class="chart-box"><canvas id="trend-chart" width="640" height="360" aria-label="Bar chart of income versus spending for September, October and November 2026"></canvas></div>
      <div class="legend"><span><span class="swatch" style="background:#2e7d4f"></span>Income</span><span><span class="swatch" style="background:#c05621"></span>Spending</span></div>
    </section>
    <section class="card">
      <h2>Where ${esc(MONTH_LABELS[ctx.month].replace(' 2026', ''))}&rsquo;s spending went</h2>
      <p class="muted">Share of spending by category, savings transfers excluded.</p>
      <div class="chart-box"><canvas id="donut-chart" width="640" height="360" aria-label="Donut chart of spending by category"></canvas></div>
      <div class="legend">${cats.slice(0, 5).map((c) => `<span><span class="swatch" style="background:${c.color}"></span>${esc(c.label)}</span>`).join('')}</div>
    </section>
  </div>
  <section class="card" style="margin-top:16px">
    <h2>Three months at a glance</h2>
    <table class="tx-table">
      <thead><tr><th>Month</th><th style="text-align:right">Income</th><th style="text-align:right">Spending</th><th style="text-align:right">Left over</th><th style="text-align:right">Savings moved</th></tr></thead>
      <tbody>
      ${ctx.months.map((m) => {
        const txs = ctx.allTxs[m] || [];
        const inc = monthIncome(txs);
        const sp = monthSpending(txs);
        const sv = txs.filter((t) => t.type === 'expense' && t.cat === 'savings').reduce((s, t) => s + t.amount, 0);
        return `<tr><td>${esc(MONTH_LABELS[m])}</td><td class="amount income">${money(inc)}</td><td class="amount">${money(sp)}</td><td class="amount ${inc - sp < 0 ? 'income' : ''}">${money(inc - sp)}</td><td class="amount">${money(sv)}</td></tr>`;
      }).join('')}
      </tbody>
    </table>
  </section>`;
}
