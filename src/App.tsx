import { useState, useMemo, useCallback } from 'react';
import type { Transaction } from './types';
import {
  loadTransactions,
  saveTransactions,
  SAMPLE_TRANSACTIONS,
  getYearMonth,
  formatMonthLabel,
  exportCSV,
} from './utils';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryChart from './components/CategoryChart';

function initTransactions(): Transaction[] {
  const stored = loadTransactions();
  if (stored.length > 0) return stored;
  saveTransactions(SAMPLE_TRANSACTIONS);
  return SAMPLE_TRANSACTIONS;
}

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getAllMonths(transactions: Transaction[]): string[] {
  const set = new Set(transactions.map((t) => getYearMonth(t.date)));
  return Array.from(set).sort().reverse();
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initTransactions);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());

  const months = useMemo(() => getAllMonths(transactions), [transactions]);

  // Ensure selectedMonth is valid when transactions change
  const validSelectedMonth = months.includes(selectedMonth)
    ? selectedMonth
    : months[0] ?? getCurrentYearMonth();

  const filtered = useMemo(
    () =>
      transactions
        .filter((t) => getYearMonth(t.date) === validSelectedMonth)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, validSelectedMonth]
  );

  const handleAdd = useCallback(
    (partial: Omit<Transaction, 'id'>) => {
      const newT: Transaction = {
        ...partial,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setTransactions((prev) => {
        const updated = [newT, ...prev];
        saveTransactions(updated);
        return updated;
      });
      // Switch to the month of the new transaction
      setSelectedMonth(getYearMonth(newT.date));
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const handleExport = () => {
    exportCSV(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-800 text-base leading-tight truncate">Budget Tracker</h1>
              <p className="text-xs text-slate-400 hidden sm:block truncate">Suivi de vos finances personnelles</p>
            </div>
          </div>

          {/* Sélecteur de mois + Export */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <select
                aria-label="Filtrer par mois"
                value={validSelectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-3 pr-8 py-2 max-w-[9.5rem] truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer transition-colors"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}
                  </option>
                ))}
                {months.length === 0 && (
                  <option value={getCurrentYearMonth()}>{formatMonthLabel(getCurrentYearMonth())}</option>
                )}
              </select>
              <svg
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button
              onClick={handleExport}
              aria-label="Exporter en CSV"
              title="Exporter en CSV"
              className="flex items-center gap-1.5 flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Cartes résumé */}
        <SummaryCards transactions={filtered} />

        {/* Formulaire */}
        <TransactionForm onAdd={handleAdd} />

        {/* Graphique + Liste */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CategoryChart transactions={filtered} />
          <TransactionList transactions={filtered} onDelete={handleDelete} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400">
        Budget Tracker &mdash; Licence MIT
      </footer>
    </div>
  );
}
