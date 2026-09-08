import { StatutCommande } from '../models/commande-jour.model';
import { ModeService } from '../models/commerce.model';
import { BOULANGERIE_DU_PANIER } from './boulangerie-du-panier';
import { SNACK_DU_VIEUX_PORT } from './snack-du-vieux-port';

/**
 * Commandes de départ, par commerce.
 *
 * Les lignes désignent des produits de la carte du commerce : le nombre
 * d'articles et le total en découlent, ils ne sont jamais saisis à la main.
 * Elles tiennent lieu de données tant que l'API n'existe pas (CLAUDE.md § 7).
 */
export interface LigneSeed {
  readonly produitId: string;
  readonly quantite: number;
}

export interface CommandeSeed {
  readonly id: string;
  /** 0 = aujourd'hui, 1 = demain… */
  readonly decalageJours: number;
  readonly heure: string;
  readonly prenom: string;
  readonly code: string;
  readonly statut: StatutCommande;
  /** Absent : à emporter. */
  readonly service?: ModeService;
  readonly lignes: readonly LigneSeed[];
}

export const COMMANDES_INITIALES: Readonly<Record<string, readonly CommandeSeed[]>> = {
  [BOULANGERIE_DU_PANIER.id]: [
    {
      id: 'panier-1',
      decalageJours: 0,
      heure: '7h00',
      prenom: 'Karim',
      code: '2914',
      statut: 'retiree',
      lignes: [
        { produitId: 'baguette-tradition', quantite: 2 },
        { produitId: 'croissant-beurre', quantite: 1 },
      ],
    },
    {
      id: 'panier-2',
      decalageJours: 0,
      heure: '7h30',
      prenom: 'Élodie',
      code: '5077',
      statut: 'retiree',
      lignes: [
        { produitId: 'croissant-beurre', quantite: 3 },
        { produitId: 'pain-chocolat', quantite: 3 },
      ],
    },
    {
      id: 'panier-3',
      decalageJours: 0,
      heure: '8h00',
      prenom: 'Marc',
      code: '1348',
      statut: 'prete',
      lignes: [{ produitId: 'baguette-tradition', quantite: 2 }],
    },
    {
      id: 'panier-4',
      decalageJours: 0,
      heure: '8h30',
      prenom: 'Léa',
      code: '6205',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'navette-oranger', quantite: 4 },
        { produitId: 'chausson-pommes', quantite: 1 },
      ],
    },
    {
      id: 'panier-5',
      decalageJours: 0,
      heure: '9h00',
      prenom: 'Rachid',
      code: '4461',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'fougasse-olives', quantite: 1 },
        { produitId: 'baguette-tradition', quantite: 3 },
      ],
    },
    {
      id: 'panier-6',
      decalageJours: 0,
      heure: '9h30',
      prenom: 'Camille',
      code: '8830',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'pain-chocolat', quantite: 4 },
        { produitId: 'croissant-beurre', quantite: 4 },
      ],
    },
    {
      id: 'panier-7',
      decalageJours: 1,
      heure: '7h15',
      prenom: 'Sophie',
      code: '3390',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'baguette-tradition', quantite: 4 },
        { produitId: 'fougasse-olives', quantite: 2 },
      ],
    },
    {
      id: 'panier-8',
      decalageJours: 1,
      heure: '8h45',
      prenom: 'Karim',
      code: '7712',
      statut: 'a-preparer',
      lignes: [{ produitId: 'chausson-pommes', quantite: 3 }],
    },
  ],

  [SNACK_DU_VIEUX_PORT.id]: [
    {
      id: 'snack-1',
      decalageJours: 0,
      heure: '11h45',
      prenom: 'Yanis',
      code: '3320',
      statut: 'retiree',
      lignes: [
        { produitId: 'kebab', quantite: 1 },
        { produitId: 'frites', quantite: 1 },
      ],
    },
    {
      id: 'snack-2',
      decalageJours: 0,
      heure: '12h00',
      prenom: 'Sarah',
      code: '7188',
      statut: 'prete',
      service: 'sur-place',
      lignes: [
        { produitId: 'tacos-poulet', quantite: 2 },
        { produitId: 'boisson-33', quantite: 2 },
      ],
    },
    {
      id: 'snack-3',
      decalageJours: 0,
      heure: '12h15',
      prenom: 'Thomas',
      code: '9042',
      statut: 'a-preparer',
      lignes: [{ produitId: 'burger-maison', quantite: 1 }],
    },
    {
      id: 'snack-4',
      decalageJours: 0,
      heure: '12h30',
      prenom: 'Sarah',
      code: '5613',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'burger-maison', quantite: 1 },
        { produitId: 'tiramisu', quantite: 1 },
      ],
    },
    {
      id: 'snack-5',
      decalageJours: 0,
      heure: '12h45',
      prenom: 'Inès',
      code: '2276',
      statut: 'a-preparer',
      service: 'sur-place',
      lignes: [
        { produitId: 'tacos-poulet', quantite: 2 },
        { produitId: 'frites', quantite: 1 },
        { produitId: 'boisson-33', quantite: 2 },
      ],
    },
    {
      id: 'snack-6',
      decalageJours: 0,
      heure: '19h30',
      prenom: 'Malik',
      code: '8451',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'kebab', quantite: 2 },
        { produitId: 'boisson-33', quantite: 1 },
      ],
    },
    {
      id: 'snack-7',
      decalageJours: 1,
      heure: '12h00',
      prenom: 'Nadia',
      code: '6104',
      statut: 'a-preparer',
      lignes: [
        { produitId: 'burger-maison', quantite: 2 },
        { produitId: 'frites', quantite: 2 },
      ],
    },
  ],
};
