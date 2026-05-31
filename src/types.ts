export type TransactionType = 'revenu' | 'depense';

export type Categorie =
  | 'Alimentation'
  | 'Transport'
  | 'Logement'
  | 'Loisirs'
  | 'Santé'
  | 'Salaire'
  | 'Autre';

export interface Transaction {
  id: string;
  libelle: string;
  montant: number;
  type: TransactionType;
  categorie: Categorie;
  date: string; // ISO date string YYYY-MM-DD
}
