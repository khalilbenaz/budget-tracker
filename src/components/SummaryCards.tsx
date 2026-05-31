import type { Transaction } from '../types';
import { formatEur } from '../utils';

interface Props {
  transactions: Transaction[];
}

export default function SummaryCards({ transactions }: Props) {
  const totalRevenus = transactions
    .filter((t) => t.type === 'revenu')
    .reduce((sum, t) => sum + t.montant, 0);

  const totalDepenses = transactions
    .filter((t) => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0);

  const solde = totalRevenus - totalDepenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Revenus */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Revenus</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{formatEur(totalRevenus)}</p>
        </div>
      </div>

      {/* Dépenses */}
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Dépenses</p>
          <p className="text-xl font-bold text-rose-500 mt-0.5">{formatEur(totalDepenses)}</p>
        </div>
      </div>

      {/* Solde */}
      <div className={`bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4 ${solde >= 0 ? 'border-blue-100' : 'border-orange-100'}`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${solde >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
          <svg className={`w-6 h-6 ${solde >= 0 ? 'text-blue-600' : 'text-orange-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Solde net</p>
          <p className={`text-xl font-bold mt-0.5 ${solde >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>{formatEur(solde)}</p>
        </div>
      </div>
    </div>
  );
}
