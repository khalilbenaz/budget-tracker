import type { Transaction } from '../types';
import { formatEur } from '../utils';

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  '#10b981', // emerald-500
  '#f43f5e', // rose-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
];

export default function CategoryChart({ transactions }: Props) {
  const depenses = transactions.filter((t) => t.type === 'depense');

  if (depenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Répartition des dépenses</h2>
        <p className="text-slate-400 text-sm text-center py-6">Aucune dépense ce mois-ci.</p>
      </div>
    );
  }

  // Agréger par catégorie
  const map: Record<string, number> = {};
  for (const t of depenses) {
    map[t.categorie] = (map[t.categorie] ?? 0) + t.montant;
  }
  const total = Object.values(map).reduce((a, b) => a + b, 0);

  const entries = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val], i) => ({
      cat,
      val,
      pct: total > 0 ? (val / total) * 100 : 0,
      color: COLORS[i % COLORS.length],
    }));

  // Donut SVG
  const SIZE = 160;
  const R = 60;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const STROKE = 22;
  const circumference = 2 * Math.PI * R;

  let cumulPct = 0;
  const slices = entries.map((e) => {
    const dash = (e.pct / 100) * circumference;
    // Décalage négatif = position de départ cumulée (sens horaire depuis le haut)
    const offset = -(cumulPct / 100) * circumference;
    cumulPct += e.pct;
    return { ...e, offset, dash };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="font-semibold text-slate-700 mb-5">Répartition des dépenses</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="flex-shrink-0 relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Graphique donut des dépenses par catégorie">
            {/* Fond */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
            {/* Rotation -90deg pour partir du haut */}
            <g transform={`rotate(-90, ${CX}, ${CY})`}>
              {slices.map((s) => (
                <circle
                  key={s.cat}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                />
              ))}
            </g>
          </svg>
          {/* Label centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-3 text-center">
            <span className="text-xs text-slate-400 font-medium">Total</span>
            <span className="text-sm font-bold text-slate-700 leading-tight tabular-nums">{formatEur(total)}</span>
          </div>
        </div>

        {/* Légende barres */}
        <div className="flex-1 w-full space-y-2.5">
          {entries.map((e) => (
            <div key={e.cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-xs font-medium text-slate-600 truncate">{e.cat}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0 whitespace-nowrap tabular-nums">
                  <span>{formatEur(e.val)}</span>
                  <span className="font-semibold text-slate-700">{e.pct.toFixed(0)}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${e.pct}%`, background: e.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
