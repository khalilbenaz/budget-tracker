import type { Transaction, Categorie } from './types';

export const CATEGORIES: Categorie[] = [
  'Alimentation',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Salaire',
  'Autre',
];

export const formatEur = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

export const formatMonthLabel = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

export const getYearMonth = (dateStr: string): string => dateStr.slice(0, 7);

export const STORAGE_KEY = 'budget_tracker_transactions';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'sample-1',
    libelle: 'Salaire mai',
    montant: 2800,
    type: 'revenu',
    categorie: 'Salaire',
    date: '2026-05-05',
  },
  {
    id: 'sample-2',
    libelle: 'Loyer mai',
    montant: 850,
    type: 'depense',
    categorie: 'Logement',
    date: '2026-05-01',
  },
  {
    id: 'sample-3',
    libelle: 'Courses Carrefour',
    montant: 127.5,
    type: 'depense',
    categorie: 'Alimentation',
    date: '2026-05-12',
  },
  {
    id: 'sample-4',
    libelle: 'Abonnement transport',
    montant: 75,
    type: 'depense',
    categorie: 'Transport',
    date: '2026-05-03',
  },
  {
    id: 'sample-5',
    libelle: 'Cinéma + resto',
    montant: 62,
    type: 'depense',
    categorie: 'Loisirs',
    date: '2026-05-17',
  },
  {
    id: 'sample-6',
    libelle: 'Pharmacie',
    montant: 34.9,
    type: 'depense',
    categorie: 'Santé',
    date: '2026-05-20',
  },
  {
    id: 'sample-7',
    libelle: 'Freelance avril',
    montant: 450,
    type: 'revenu',
    categorie: 'Autre',
    date: '2026-04-28',
  },
  {
    id: 'sample-8',
    libelle: 'Salaire avril',
    montant: 2800,
    type: 'revenu',
    categorie: 'Salaire',
    date: '2026-04-05',
  },
  {
    id: 'sample-9',
    libelle: 'Loyer avril',
    montant: 850,
    type: 'depense',
    categorie: 'Logement',
    date: '2026-04-01',
  },
  {
    id: 'sample-10',
    libelle: 'Épicerie bio',
    montant: 98,
    type: 'depense',
    categorie: 'Alimentation',
    date: '2026-04-15',
  },
];

export function exportCSV(transactions: Transaction[]): void {
  const headers = ['Date', 'Libellé', 'Type', 'Catégorie', 'Montant (€)'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.libelle.replace(/"/g, '""')}"`,
    t.type === 'revenu' ? 'Revenu' : 'Dépense',
    t.categorie,
    t.montant.toFixed(2).replace('.', ','),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(';')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
