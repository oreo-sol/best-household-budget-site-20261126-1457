// Hearth & Ledger — charts.js
// Hand-rolled canvas charts, no library. Every chart is drawn from the
// same transaction data the tables show, so the pictures and the numbers
// can never disagree.

import { CATEGORIES, MONTH_LABELS } from './data.js';
import { categoryTotals, monthIncome, monthSpending } from './views.js';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width;
  const height = canvas.height;
  canvas.style.aspectRatio = `${width} / ${height}`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function moneyLabel(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

// Grouped bars: income (green) vs spending (terracotta) for each month.
export function drawTrendChart(canvas, allTxs, months) {
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { left: 56, right: 14, top: 18, bottom: 34 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const rows = months.map((m) => {
    const txs = allTxs[m] || [];
    return { label: MONTH_LABELS[m].replace(' 2026', ''), income: monthIncome(txs), spending: monthSpending(txs) };
  });
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spending]), 1);
  const top = Math.ceil(max / 1000) * 1000;

  ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#6b645a';
  ctx.strokeStyle = '#e5dccb';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++) {
    const value = (top / 4) * g;
    const y = pad.top + plotH - (value / top) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(moneyLabel(value), pad.left - 8, y + 4);
  }

  const groupW = plotW / rows.length;
  const barW = Math.min(46, (groupW - 40) / 2);
  rows.forEach((row, i) => {
    const groupX = pad.left + i * groupW + groupW / 2;
    const pairs = [
      { value: row.income, color: '#2e7d4f' },
      { value: row.spending, color: '#c05621' },
    ];
    pairs.forEach((bar, j) => {
      const barH = (bar.value / top) * plotH;
      const x = groupX - barW - 4 + j * (barW + 8);
      const y = pad.top + plotH - barH;
      ctx.fillStyle = bar.color;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#2d2a26';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px -apple-system, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(moneyLabel(bar.value), x + barW / 2, y - 6);
      ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
    });
    ctx.fillStyle = '#2d2a26';
    ctx.textAlign = 'center';
    ctx.fillText(row.label, groupX, height - 12);
  });
}

// Donut: share of spending by category for one month (savings excluded).
export function drawDonutChart(canvas, txs) {
  const { ctx, width, height } = setupCanvas(canvas);
  const totals = categoryTotals(txs);
  const cats = CATEGORIES
    .filter((c) => totals[c.id] > 0 && c.id !== 'savings')
    .sort((a, b) => totals[b.id] - totals[a.id]);
  const total = cats.reduce((s, c) => s + totals[c.id], 0);
  const cx = width / 2;
  const cy = height / 2 + 6;
  const outer = 128;
  const inner = 78;

  if (total <= 0) {
    ctx.fillStyle = '#6b645a';
    ctx.font = '14px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No spending recorded this month.', cx, cy);
    return;
  }

  let angle = -Math.PI / 2;
  for (const c of cats) {
    const slice = (totals[c.id] / total) * Math.PI * 2;
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + slice);
    ctx.closePath();
    ctx.fill();
    angle += slice;
  }
  // Punch the hole and label it.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle = '#1e4d3a';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(moneyLabel(total), cx, cy - 4);
  ctx.fillStyle = '#6b645a';
  ctx.font = '13px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('spent, excl. savings', cx, cy + 16);

  // Leader labels for the three biggest slices.
  ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
  let labelAngle = -Math.PI / 2;
  cats.slice(0, 3).forEach((c) => {
    const slice = (totals[c.id] / total) * Math.PI * 2;
    const mid = labelAngle + slice / 2;
    const lx = cx + Math.cos(mid) * (outer + 26);
    const ly = cy + Math.sin(mid) * (outer + 26);
    ctx.fillStyle = '#2d2a26';
    ctx.textAlign = lx < cx ? 'right' : 'left';
    const pct = Math.round((totals[c.id] / total) * 100);
    ctx.fillText(`${c.label} ${pct}%`, lx + (lx < cx ? -6 : 6), ly);
    labelAngle += slice;
  });
}
