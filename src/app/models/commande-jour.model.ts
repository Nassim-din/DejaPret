import { ModeService } from './commerce.model';

/** Une ligne de commande, figée au moment de l'achat. */
export interface LigneCommande {
  readonly nom: string;
  readonly quantite: number;
  readonly prixUnitaireCentimes: number;
  /** Choix retenus pour une formule, dans l'ordre des étapes. */
  readonly details?: readonly string[];
}

/** Une commande telle que le commerçant la voit dans sa journée. */
export interface CommandeJour {
  readonly id: string;
  /** Date de retrait au format ISO « 2026-09-07 ». */
  readonly date: string;
  /** Heure de retrait, au format affiché : « 8h15 ». */
  readonly heure: string;
  /** Sur place ou à emporter, quand le commerce propose les deux. */
  readonly service: ModeService;
  readonly prenom: string;
  readonly code: string;
  readonly lignes: readonly LigneCommande[];
  readonly articles: number;
  readonly totalCentimes: number;
  readonly statut: StatutCommande;
  /** Motif communiqué au client quand la commande est refusée. */
  readonly note?: string;
  /** Vraie si la commande vient d'être passée depuis la page client. */
  readonly enDirect?: boolean;
}

export type StatutCommande = 'a-preparer' | 'prete' | 'retiree' | 'refusee';

/** Statuts proposés au commerçant dans le suivi courant. */
export const STATUTS_COMMANDE: readonly StatutCommande[] = [
  'a-preparer',
  'prete',
  'retiree',
];

export const LIBELLES_STATUT: Readonly<Record<StatutCommande, string>> = {
  'a-preparer': 'À préparer',
  prete: 'Prête',
  retiree: 'Retirée',
  refusee: 'Refusée',
};

/** Convertit « 8h15 » en minutes, pour trier les commandes par heure. */
export function heureEnMinutes(heure: string): number {
  const [heures, minutes] = heure.split('h');
  return Number(heures) * 60 + Number(minutes || 0);
}

/** Le nombre d'articles et le total découlent des lignes, jamais l'inverse. */
export function totalArticles(lignes: readonly LigneCommande[]): number {
  return lignes.reduce((total, ligne) => total + ligne.quantite, 0);
}

export function totalCentimes(lignes: readonly LigneCommande[]): number {
  return lignes.reduce(
    (total, ligne) => total + ligne.prixUnitaireCentimes * ligne.quantite,
    0,
  );
}
