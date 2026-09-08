import { Injectable, computed, inject } from '@angular/core';
import { TARIFS } from '../config/tarifs';
import { LISTE_COMMERCES } from '../merchants';
import { Commerce } from '../models/commerce.model';
import { CommandesService } from './commandes.service';
import { CommerceService } from './commerce.service';

/** Un commerce vu depuis l'administration, avec ses chiffres du jour. */
export interface CommerceAdministre {
  readonly commerce: Commerce;
  readonly commandes: number;
  readonly articles: number;
  readonly volumeCentimes: number;
  readonly panierMoyenCentimes: number;
}

/**
 * Vue plateforme : agrège les commerces et leurs chiffres.
 *
 * Tout ce qui est exposé ici est réellement connu de l'application. La mesure
 * d'audience (visiteurs, conversion) demande l'API et n'est pas simulée.
 */
@Injectable({ providedIn: 'root' })
export class PlateformeService {
  private readonly commerceService = inject(CommerceService);
  private readonly commandesService = inject(CommandesService);

  readonly commerces = computed<CommerceAdministre[]>(() =>
    LISTE_COMMERCES.map((base) => {
      const commerce = this.commerceService.commerceDe(base.id) ?? base;
      const commandes = this.commandesService.commandesDe(base.id);

      const volumeCentimes = commandes.reduce(
        (total, commande) => total + commande.totalCentimes,
        0,
      );
      const articles = commandes.reduce(
        (total, commande) => total + commande.articles,
        0,
      );

      return {
        commerce,
        commandes: commandes.length,
        articles,
        volumeCentimes,
        panierMoyenCentimes:
          commandes.length === 0 ? 0 : Math.round(volumeCentimes / commandes.length),
      };
    }),
  );

  readonly nombreCommerces = computed(() => this.commerces().length);

  /** Seuls les abonnements actifs sont facturés. */
  readonly commercesFactures = computed(() =>
    this.commerces().filter((item) => item.commerce.abonnement.statut === 'actif'),
  );

  readonly revenuMensuelCentimes = computed(
    () => this.commercesFactures().length * TARIFS.abonnementMensuelCentimes,
  );

  readonly misesEnPlaceRegleesCentimes = computed(
    () =>
      this.commerces().filter((item) => item.commerce.abonnement.miseEnPlaceReglee).length *
      TARIFS.miseEnPlaceCentimes,
  );

  readonly misesEnPlaceDues = computed(() =>
    this.commerces().filter((item) => !item.commerce.abonnement.miseEnPlaceReglee),
  );

  readonly commandesDuJour = computed(() =>
    this.commerces().reduce((total, item) => total + item.commandes, 0),
  );

  readonly volumeTraiteCentimes = computed(() =>
    this.commerces().reduce((total, item) => total + item.volumeCentimes, 0),
  );

  readonly panierMoyenCentimes = computed(() => {
    const nombre = this.commandesDuJour();
    return nombre === 0 ? 0 : Math.round(this.volumeTraiteCentimes() / nombre);
  });

  readonly commercesOuverts = computed(
    () => this.commerces().filter((item) => item.commerce.accepteCommandes).length,
  );
}
