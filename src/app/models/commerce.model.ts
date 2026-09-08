/**
 * Modèle d'un commerce, de sa carte et de ses formules.
 *
 * Un commerce = un fichier de configuration. Pour créer une nouvelle démo,
 * on copie un fichier de `src/app/merchants/`, on l'édite, et c'est tout.
 * Le commerçant peut ensuite ajuster ses infos depuis ses paramètres.
 */

/** Visuel de repli quand le commerçant n'a pas fourni de photo. */
export type Illustration =
  | 'baguette'
  | 'croissant'
  | 'navette'
  | 'pain-chocolat'
  | 'fougasse'
  | 'chausson'
  | 'formule'
  | 'boisson'
  | 'generique';

export interface Produit {
  readonly id: string;
  readonly nom: string;
  readonly prixCentimes: number;
  /** Rayon utilisé par les filtres côté client. */
  readonly categorie: string;
  /**
   * Photo du commerçant, optionnelle.
   * Chemin depuis `public/`, par exemple `produits/baguette.jpg`.
   * Absente : la carte retombe sur `illustration`.
   */
  readonly photo?: string;
  readonly illustration: Illustration;
}

/** Un choix possible à une étape de formule. */
export interface OptionFormule {
  readonly id: string;
  readonly nom: string;
  /** Supplément éventuel, en centimes. */
  readonly supplementCentimes?: number;
}

/** Une étape du parcours de composition d'une formule. */
export interface EtapeFormule {
  readonly id: string;
  readonly libelle: string;
  /** Phrase d'aide affichée sous le titre de l'étape. */
  readonly aide?: string;
  /** Plusieurs choix autorisés (les sauces, par exemple). */
  readonly choixMultiple?: boolean;
  /** Une étape facultative peut être passée. */
  readonly facultative?: boolean;
  readonly options: readonly OptionFormule[];
}

export interface Formule {
  readonly id: string;
  readonly nom: string;
  readonly description: string;
  readonly prixCentimes: number;
  readonly illustration: Illustration;
  readonly photo?: string;
  readonly etapes: readonly EtapeFormule[];
}

export interface CouleursCommerce {
  /** Bandeaux haut et bas. */
  readonly marque: string;
  /** Couleur d'appel : boutons, filets, prix. */
  readonly accent: string;
  /** Fond de page. */
  readonly fond: string;
  /** Fond des visuels produit. */
  readonly surface: string;
}

export const JOURS_SEMAINE = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const;

export type JourSemaine = (typeof JOURS_SEMAINE)[number];

export interface HoraireJour {
  readonly jour: JourSemaine;
  readonly ouvert: boolean;
  /** Format « 06:30 », pour rester compatible avec un champ heure. */
  readonly ouverture: string;
  readonly fermeture: string;
}

/** Comment le client veut être servi, quand le commerce propose les deux. */
export type ModeService = 'emporter' | 'sur-place';

export const LIBELLES_SERVICE: Readonly<Record<ModeService, string>> = {
  emporter: 'À emporter',
  'sur-place': 'Sur place',
};

export type StatutAbonnement = 'actif' | 'essai' | 'suspendu';

export const LIBELLES_ABONNEMENT: Readonly<Record<StatutAbonnement, string>> = {
  actif: 'Actif',
  essai: 'Essai',
  suspendu: 'Suspendu',
};

/** L'abonnement du commerce à Déjà Prêt. Géré depuis l'administration. */
export interface Abonnement {
  readonly statut: StatutAbonnement;
  /** Date de signature au format ISO « 2026-06-15 ». */
  readonly depuis: string;
  readonly miseEnPlaceReglee: boolean;
}

/** Un groupe d'horaires de retrait, par exemple « Matin ». */
export interface GroupeCreneaux {
  readonly libelle: string;
  readonly heures: readonly string[];
}

export interface Commerce {
  /**
   * Identifiant du commerce. Multi-tenant dès la première ligne :
   * rien dans l'application ne suppose qu'il n'y a qu'un seul commerce.
   */
  readonly id: string;
  readonly nom: string;
  /** Petite ligne au-dessus du nom, par exemple « Maison fondée en 1978 ». */
  readonly accroche: string;
  readonly adresse: string;
  /**
   * Photo ou logo du commerce, optionnelle.
   * Chemin depuis `public/`, par exemple `commerce/devanture.jpg`.
   * Absente : on affiche les initiales du commerce.
   */
  readonly photoProfil?: string;
  /** Le commerçant peut suspendre la prise de commandes à tout moment. */
  readonly accepteCommandes: boolean;
  /**
   * Le commerce propose de consommer sur place. Quand c'est faux, le client
   * n'a pas à choisir : tout est à emporter.
   */
  readonly serviceSurPlace: boolean;
  readonly abonnement: Abonnement;
  /** Message affiché aux clients quand la prise de commandes est suspendue. */
  readonly messageIndisponible: string;
  readonly couleurs: CouleursCommerce;
  readonly horaires: readonly HoraireJour[];
  readonly produits: readonly Produit[];
  readonly formules: readonly Formule[];
  readonly creneaux: readonly GroupeCreneaux[];
}
