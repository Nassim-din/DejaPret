import { Commerce } from '../models/commerce.model';
import { BOULANGERIE_DU_PANIER } from './boulangerie-du-panier';
import { SNACK_DU_VIEUX_PORT } from './snack-du-vieux-port';

/** Tous les commerces équipés, par identifiant. */
export const COMMERCES: Readonly<Record<string, Commerce>> = {
  [BOULANGERIE_DU_PANIER.id]: BOULANGERIE_DU_PANIER,
  [SNACK_DU_VIEUX_PORT.id]: SNACK_DU_VIEUX_PORT,
};

export const LISTE_COMMERCES: readonly Commerce[] = Object.values(COMMERCES);

/** Commerce ouvert par défaut quand l'URL n'en désigne aucun. */
export const COMMERCE_PAR_DEFAUT = BOULANGERIE_DU_PANIER.id;

export function commerceExiste(id: string | null): id is string {
  return !!id && id in COMMERCES;
}
