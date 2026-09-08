import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { commerceExiste } from '../merchants';
import { CommandeService } from '../services/commande.service';
import { CommerceService } from '../services/commerce.service';
import { PanierService } from '../services/panier.service';

/**
 * Résout le commerce depuis l'URL. C'est le point d'entrée unique du
 * multi-tenant : une adresse inconnue renvoie à l'accueil plutôt que
 * d'afficher un commerce par défaut au hasard.
 */
export const resoudreCommerce: CanActivateFn = (route) => {
  const id = route.paramMap.get('commerce');

  if (!commerceExiste(id)) {
    return inject(Router).createUrlTree(['/']);
  }

  inject(CommerceService).definirCommerce(id);
  return true;
};

/**
 * Rien n'est encore persisté côté serveur : si la page est rafraîchie au
 * milieu du parcours, on repart de la carte plutôt que d'afficher une étape
 * vide (voir CLAUDE.md, section 7).
 */
const versLaCarte = (route: { paramMap: { get(nom: string): string | null } }) =>
  inject(Router).createUrlTree(['/client', route.paramMap.get('commerce') ?? '']);

/** Abonnement suspendu : la page publique est coupée. */
export const accesOuvert: CanActivateFn = (route) =>
  inject(CommerceService).accesActif() || versLaCarte(route);

export const panierRempli: CanActivateFn = (route) => {
  const commerceId = route.paramMap.get('commerce') ?? '';
  return inject(PanierService).lignesDe(commerceId).length > 0 || versLaCarte(route);
};

export const creneauChoisi: CanActivateFn = (route) =>
  inject(CommandeService).heure() !== null || versLaCarte(route);

export const commandePayee: CanActivateFn = (route) =>
  inject(CommandeService).code() !== null || versLaCarte(route);
