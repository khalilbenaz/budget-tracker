import { useState } from 'react';
import type { Transaction, TransactionType, Categorie } from '../types';
import { CATEGORIES } from '../utils';

interface Props {
  onAdd: (t: Omit<Transaction, 'id'>) => void;
}

const today = (): string => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ onAdd }: Props) {
  const [libelle, setLibelle] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState<TransactionType>('depense');
  const [categorie, setCategorie] = useState<Categorie>('Alimentation');
  const [date, setDate] = useState(today());
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = libelle.trim();
    const num = parseFloat(montant.replace(',', '.'));
    if (!trimmed) { setError('Le libellé est requis.'); return; }
    if (isNaN(num) || num <= 0) { setError('Le montant doit être un nombre positif.'); return; }
    if (!date) { setError('La date est requise.'); return; }
    onAdd({ libelle: trimmed, montant: num, type, categorie, date });
    setLibelle('');
    setMontant('');
    setType('depense');
    setCategorie('Alimentation');
    setDate(today());
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Ajouter une transaction
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 border-t border-slate-100 pt-4" noValidate>
          {error && (
            <div role="alert" className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Type toggle */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 w-fit">
              <button
                type="button"
                onClick={() => setType('depense')}
                className={`px-5 py-2 text-sm font-medium transition-colors ${type === 'depense' ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                Dépense
              </button>
              <button
                type="button"
                onClick={() => setType('revenu')}
                className={`px-5 py-2 text-sm font-medium transition-colors ${type === 'revenu' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                Revenu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Libellé */}
            <div className="sm:col-span-2">
              <label htmlFor="libelle" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Libellé
              </label>
              <input
                id="libelle"
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                placeholder="Ex : Courses supermarché"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
            </div>

            {/* Montant */}
            <div>
              <label htmlFor="montant" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Montant (MAD)
              </label>
              <input
                id="montant"
                type="number"
                min="0.01"
                step="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0,00"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <div className="sm:col-span-2">
              <label htmlFor="categorie" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Catégorie
              </label>
              <select
                id="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as Categorie)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            Ajouter
          </button>
        </form>
      )}
    </div>
  );
}
