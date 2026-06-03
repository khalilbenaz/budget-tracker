import type { Transaction } from '../types';
import { formatEur } from '../utils';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORIE_ICONS: Record<string, string> = {
  Alimentation: '🛒',
  Transport: '🚌',
  Logement: '🏠',
  Loisirs: '🎬',
  Santé: '💊',
  Salaire: '💼',
  Autre: '📦',
};

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
        <p className="text-slate-400 text-sm">Aucune transaction pour ce mois.</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">
          Transactions{' '}
          <span className="text-xs font-normal text-slate-400 ml-1">({transactions.length})</span>
        </h2>
      </div>
      <ul role="list" className="divide-y divide-slate-50">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
          >
            {/* Icone catégorie */}
            <span className="flex-shrink-0 w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base" aria-hidden>
              {CATEGORIE_ICONS[t.categorie] ?? '📦'}
            </span>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{t.libelle}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDate(t.date)} · {t.categorie}
              </p>
            </div>

            {/* Montant + badge */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span
                className={`text-sm font-bold whitespace-nowrap tabular-nums ${t.type === 'revenu' ? 'text-emerald-600' : 'text-rose-500'}`}
              >
                {t.type === 'revenu' ? '+' : '-'}{formatEur(t.montant)}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  t.type === 'revenu'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {t.type === 'revenu' ? 'Revenu' : 'Dépense'}
              </span>
            </div>

            {/* Supprimer */}
            <button
              onClick={() => onDelete(t.id)}
              aria-label={`Supprimer "${t.libelle}"`}
              className="flex-shrink-0 ml-1 w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
