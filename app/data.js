// Hearth & Ledger — sample household data.
// Realistic figures for the Alvarez household (two adults, two kids) in
// November 2026, plus the two previous months so the month switcher and the
// reports have something real to show. Amounts are in US dollars.

export const HOUSEHOLD = {
  name: 'The Alvarez Household',
  members: ['Maya', 'Jon', 'Sofia (9)', 'Leo (6)'],
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#2e7d4f' },
  { id: 'housing', label: 'Housing', color: '#7c4a2d' },
  { id: 'utilities', label: 'Utilities', color: '#b7791f' },
  { id: 'transport', label: 'Transport', color: '#2b6cb0' },
  { id: 'dining', label: 'Dining Out', color: '#c05621' },
  { id: 'entertainment', label: 'Entertainment', color: '#805ad5' },
  { id: 'health', label: 'Health', color: '#c53030' },
  { id: 'kids', label: 'Kids & School', color: '#319795' },
  { id: 'personal', label: 'Personal', color: '#718096' },
  { id: 'savings', label: 'Savings', color: '#276749' },
];

// Monthly budgets the household set for itself (November is the live month).
export const BUDGETS = {
  '2026-09': { groceries: 680, housing: 1450, utilities: 360, transport: 170, dining: 200, entertainment: 110, health: 140, kids: 140, personal: 140, savings: 700 },
  '2026-10': { groceries: 700, housing: 1450, utilities: 370, transport: 180, dining: 210, entertainment: 120, health: 150, kids: 150, personal: 150, savings: 800 },
  '2026-11': { groceries: 700, housing: 1450, utilities: 380, transport: 180, dining: 220, entertainment: 120, health: 150, kids: 150, personal: 150, savings: 800 },
};

// One transaction: { id, date, desc, cat, amount, type }
// type is 'expense' or 'income'. Dates are ISO, within the month key.
export const TRANSACTIONS = {
  '2026-09': [
    { id: 's01', date: '2026-09-01', desc: 'Salary — Maya (City Library)', cat: 'income', amount: 4850, type: 'income' },
    { id: 's02', date: '2026-09-01', desc: 'Rent — Maple Street apartment', cat: 'housing', amount: 1450, type: 'expense' },
    { id: 's03', date: '2026-09-02', desc: 'Transfer to emergency fund', cat: 'savings', amount: 700, type: 'expense' },
    { id: 's04', date: '2026-09-03', desc: 'Whole Foods weekly shop', cat: 'groceries', amount: 152.40, type: 'expense' },
    { id: 's05', date: '2026-09-05', desc: 'Internet — Fiber 500', cat: 'utilities', amount: 79, type: 'expense' },
    { id: 's06', date: '2026-09-07', desc: 'Gas — Shell, Maple Ave', cat: 'transport', amount: 44.20, type: 'expense' },
    { id: 's07', date: '2026-09-09', desc: 'Trader Joe’s weekly shop', cat: 'groceries', amount: 98.15, type: 'expense' },
    { id: 's08', date: '2026-09-11', desc: 'Electric bill — September', cat: 'utilities', amount: 118.60, type: 'expense' },
    { id: 's09', date: '2026-09-12', desc: 'School lunch money — Sofia & Leo', cat: 'kids', amount: 60, type: 'expense' },
    { id: 's10', date: '2026-09-14', desc: 'Freelance — Jon (weekend design)', cat: 'income', amount: 540, type: 'income' },
    { id: 's11', date: '2026-09-16', desc: 'Costco monthly stock-up', cat: 'groceries', amount: 198.30, type: 'expense' },
    { id: 's12', date: '2026-09-18', desc: 'Dentist check-up — Leo', cat: 'health', amount: 65, type: 'expense' },
    { id: 's13', date: '2026-09-20', desc: 'Phone plan — family', cat: 'utilities', amount: 96, type: 'expense' },
    { id: 's14', date: '2026-09-22', desc: 'Pizza night — family', cat: 'dining', amount: 31.40, type: 'expense' },
    { id: 's15', date: '2026-09-24', desc: 'Farmers market', cat: 'groceries', amount: 47.80, type: 'expense' },
    { id: 's16', date: '2026-09-26', desc: 'Movie night — cinema', cat: 'entertainment', amount: 34, type: 'expense' },
    { id: 's17', date: '2026-09-28', desc: 'Haircuts — Jon & Leo', cat: 'personal', amount: 58, type: 'expense' },
  ],
  '2026-10': [
    { id: 'o01', date: '2026-10-01', desc: 'Salary — Maya (City Library)', cat: 'income', amount: 4850, type: 'income' },
    { id: 'o02', date: '2026-10-01', desc: 'Rent — Maple Street apartment', cat: 'housing', amount: 1450, type: 'expense' },
    { id: 'o03', date: '2026-10-02', desc: 'Transfer to emergency fund', cat: 'savings', amount: 800, type: 'expense' },
    { id: 'o04', date: '2026-10-03', desc: 'Whole Foods weekly shop', cat: 'groceries', amount: 161.55, type: 'expense' },
    { id: 'o05', date: '2026-10-05', desc: 'Internet — Fiber 500', cat: 'utilities', amount: 79, type: 'expense' },
    { id: 'o06', date: '2026-10-06', desc: 'Gas — Shell, Maple Ave', cat: 'transport', amount: 41.30, type: 'expense' },
    { id: 'o07', date: '2026-10-08', desc: 'Trader Joe’s weekly shop', cat: 'groceries', amount: 104.20, type: 'expense' },
    { id: 'o08', date: '2026-10-10', desc: 'Electric bill — October', cat: 'utilities', amount: 124.85, type: 'expense' },
    { id: 'o09', date: '2026-10-12', desc: 'Halloween costumes — Sofia & Leo', cat: 'kids', amount: 72.40, type: 'expense' },
    { id: 'o10', date: '2026-10-13', desc: 'Thai takeout — family dinner', cat: 'dining', amount: 42.60, type: 'expense' },
    { id: 'o11', date: '2026-10-15', desc: 'Costco monthly stock-up', cat: 'groceries', amount: 224.10, type: 'expense' },
    { id: 'o12', date: '2026-10-16', desc: 'Pharmacy — flu shots', cat: 'health', amount: 38.50, type: 'expense' },
    { id: 'o13', date: '2026-10-18', desc: 'Freelance — Jon (logo work)', cat: 'income', amount: 480, type: 'income' },
    { id: 'o14', date: '2026-10-20', desc: 'Phone plan — family', cat: 'utilities', amount: 96, type: 'expense' },
    { id: 'o15', date: '2026-10-21', desc: 'Metro passes — Maya & Jon', cat: 'transport', amount: 68, type: 'expense' },
    { id: 'o16', date: '2026-10-23', desc: 'Farmers market', cat: 'groceries', amount: 52.75, type: 'expense' },
    { id: 'o17', date: '2026-10-25', desc: 'Streaming — movies & music', cat: 'entertainment', amount: 15.99, type: 'expense' },
    { id: 'o18', date: '2026-10-27', desc: 'Brunch out — Sunday', cat: 'dining', amount: 58.30, type: 'expense' },
    { id: 'o19', date: '2026-10-29', desc: 'Winter coats — Sofia', cat: 'personal', amount: 94.99, type: 'expense' },
    { id: 'o20', date: '2026-10-31', desc: 'Pumpkin patch — family outing', cat: 'entertainment', amount: 46, type: 'expense' },
  ],
  '2026-11': [
    { id: 'n01', date: '2026-11-01', desc: 'Salary — Maya (City Library)', cat: 'income', amount: 4850, type: 'income' },
    { id: 'n02', date: '2026-11-01', desc: 'Rent — Maple Street apartment', cat: 'housing', amount: 1450, type: 'expense' },
    { id: 'n03', date: '2026-11-02', desc: 'Transfer to emergency fund', cat: 'savings', amount: 800, type: 'expense' },
    { id: 'n04', date: '2026-11-02', desc: 'Whole Foods weekly shop', cat: 'groceries', amount: 148.20, type: 'expense' },
    { id: 'n05', date: '2026-11-03', desc: 'Metro passes — Maya & Jon', cat: 'transport', amount: 34, type: 'expense' },
    { id: 'n06', date: '2026-11-04', desc: 'Gas — Shell, Maple Ave', cat: 'transport', amount: 42.10, type: 'expense' },
    { id: 'n07', date: '2026-11-05', desc: 'Internet — Fiber 500', cat: 'utilities', amount: 79, type: 'expense' },
    { id: 'n08', date: '2026-11-06', desc: 'Thai takeout — family dinner', cat: 'dining', amount: 38.50, type: 'expense' },
    { id: 'n09', date: '2026-11-07', desc: 'Trader Joe’s weekly shop', cat: 'groceries', amount: 96.40, type: 'expense' },
    { id: 'n10', date: '2026-11-08', desc: 'Movie night — cinema', cat: 'entertainment', amount: 32, type: 'expense' },
    { id: 'n11', date: '2026-11-09', desc: 'Pharmacy — vitamins & cold meds', cat: 'health', amount: 28.60, type: 'expense' },
    { id: 'n12', date: '2026-11-10', desc: 'Electric bill — November', cat: 'utilities', amount: 128.40, type: 'expense' },
    { id: 'n13', date: '2026-11-11', desc: 'School supplies — Sofia & Leo', cat: 'kids', amount: 64.20, type: 'expense' },
    { id: 'n14', date: '2026-11-12', desc: 'Costco monthly stock-up', cat: 'groceries', amount: 212.75, type: 'expense' },
    { id: 'n15', date: '2026-11-13', desc: 'Pizza night — family', cat: 'dining', amount: 27.80, type: 'expense' },
    { id: 'n16', date: '2026-11-14', desc: 'Freelance — Jon (weekend design)', cat: 'income', amount: 620, type: 'income' },
    { id: 'n17', date: '2026-11-14', desc: 'Haircut — Maya', cat: 'personal', amount: 42, type: 'expense' },
    { id: 'n18', date: '2026-11-15', desc: 'Water bill — November', cat: 'utilities', amount: 52.60, type: 'expense' },
    { id: 'n19', date: '2026-11-16', desc: 'Dentist copay — Maya', cat: 'health', amount: 75, type: 'expense' },
    { id: 'n20', date: '2026-11-17', desc: 'Gas — Shell, Maple Ave', cat: 'transport', amount: 38.75, type: 'expense' },
    { id: 'n21', date: '2026-11-18', desc: 'Farmers market', cat: 'groceries', amount: 58.30, type: 'expense' },
    { id: 'n22', date: '2026-11-19', desc: 'Kids shoes — Leo', cat: 'kids', amount: 58.95, type: 'expense' },
    { id: 'n23', date: '2026-11-20', desc: 'Phone plan — family', cat: 'utilities', amount: 96, type: 'expense' },
    { id: 'n24', date: '2026-11-20', desc: 'Coffee & brunch — Saturday', cat: 'dining', amount: 46.20, type: 'expense' },
    { id: 'n25', date: '2026-11-21', desc: 'Parking — downtown', cat: 'transport', amount: 18, type: 'expense' },
    { id: 'n26', date: '2026-11-22', desc: 'Streaming — movies & music', cat: 'entertainment', amount: 15.99, type: 'expense' },
    { id: 'n27', date: '2026-11-23', desc: 'Clothing — winter layers, Jon', cat: 'personal', amount: 89.50, type: 'expense' },
    { id: 'n28', date: '2026-11-24', desc: 'Grocery top-up — Thanksgiving', cat: 'groceries', amount: 134.90, type: 'expense' },
    { id: 'n29', date: '2026-11-25', desc: 'Board game — family night', cat: 'entertainment', amount: 24.99, type: 'expense' },
  ],
};

// Recurring monthly bills. `day` is the due day of the month; `paid` is the
// starting state for November 2026 (bills due before the 26th are paid).
export const BILLS = [
  { id: 'b-rent', name: 'Rent — Maple Street', amount: 1450, day: 1, paid: true },
  { id: 'b-internet', name: 'Internet — Fiber 500', amount: 79, day: 5, paid: true },
  { id: 'b-electric', name: 'Electric — City Power', amount: 128.40, day: 10, paid: true },
  { id: 'b-water', name: 'Water — City Water', amount: 52.60, day: 15, paid: true },
  { id: 'b-phone', name: 'Phone plan — family', amount: 96, day: 20, paid: true },
  { id: 'b-gym', name: 'Gym — Riverside Fitness', amount: 45, day: 22, paid: true },
  { id: 'b-insurance', name: 'Home insurance', amount: 210, day: 25, paid: true },
  { id: 'b-streaming', name: 'Streaming — movies & music', amount: 15.99, day: 28, paid: false },
  { id: 'b-credit', name: 'Credit card — statement', amount: 320, day: 30, paid: false },
];

// Savings goals the household is working toward.
export const GOALS = [
  { id: 'g-emergency', name: 'Emergency fund', target: 6000, saved: 4350, note: '3 months of essential spending' },
  { id: 'g-vacation', name: 'Family vacation — coast trip', target: 2400, saved: 1150, note: 'Summer 2027, four tickets + stay' },
  { id: 'g-car', name: 'New family car', target: 12000, saved: 3800, note: 'Replace the 2012 hatchback' },
  { id: 'g-home', name: 'Home repairs — roof', target: 3000, saved: 900, note: 'Patch and reseal before winter' },
];

export const MONTHS = ['2026-09', '2026-10', '2026-11'];

export const MONTH_LABELS = {
  '2026-09': 'September 2026',
  '2026-10': 'October 2026',
  '2026-11': 'November 2026',
};
