# Hearth & Ledger — Household Budget Site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/oreo-sol/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/oreo-sol/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

A working household budget site for the Alvarez family — a household of four
keeping its money in order for November 2026. Plain static files under `app/`,
no build step, no network requests: serve `app/` with any static server and
open `index.html` on a desktop or a phone.

## What it does

- **Dashboard** — the month at a glance: income, spending, what's left over,
  the savings rate, biggest spending categories, bills still to pay, and the
  latest transactions.
- **Transactions** — every dollar in and out, with a working add form, delete
  buttons, a category filter and a search box. Adding or deleting a transaction
  updates the totals, the budget bars and the charts at once.
- **Budgets** — a monthly plan for each category with progress bars and
  remaining amounts; every budget amount can be edited and saved.
- **Bills & Goals** — monthly bills with due dates and paid/unpaid toggles,
  plus savings goals with progress bars and an add-to-goal control.
- **Reports** — hand-rolled canvas charts: income vs spending for September–
  November 2026, a category breakdown donut, and a three-month table.

Everything is stored in the browser's localStorage, so edits survive a reload.
The month switcher moves between September, October and November 2026, and
every figure, bar and chart follows.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Files

| File | Job |
| --- | --- |
| `app/index.html` | Page shell, navigation, footer |
| `app/style.css` | All styling |
| `app/data.js` | Sample household data (transactions, budgets, bills, goals) |
| `app/app.js` | State, hash routing, events, localStorage |
| `app/views.js` | Rendering for the five sections |
| `app/charts.js` | Canvas charts (trend bars, category donut) |
| `main.ts` | Hands the entry in: copies `app/` and `screenshots/` to `/output`, writes `dossier.json` |
| `serve.ts` | Tiny static server for local testing |

Entry for the make.fun competition
[best-household-budget-site-20261126-1457](https://make.fun/c/best-household-budget-site-20261126-1457).
