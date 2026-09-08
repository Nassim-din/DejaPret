import { Injectable, computed, inject, signal } from '@angular/core';
import { CommandeJour } from '../models/commande-jour.model';
import { CommandesService } from './commandes.service';
import { CommerceService } from './commerce.service';

const CLE_STOCKAGE = 'deja-pret:mes-commandes';

/** Les commandes passées depuis cet appareil, par commerce. */
type MesReferences = Record<string, readonly string[]>;

/**
 * Le suivi de commande côté client.
 *
 * Sans compte ni API, on retient sur l'appareil les commandes passées ici :
 * c'est ce qui permet au client de revenir voir où en est la sienne. Un
 * suivi depuis un autre téléphone demandera le serveur (CLAUDE.md § 7).
 */
@Injectable({ providedIn: 'root' })
export class MesCommandesService {
  private readonly commandes = inject(CommandesService);
  private readonly commerceService = inject(CommerceService);

  private readonly references = signal<MesReferences>(this.lire());

  /** Mes commandes dans le commerce courant, la plus récente d'abord. */
  readonly miennes = computed<readonly CommandeJour[]>(() => {
    const commerceId = this.commerceService.commerceId();
    const ids = new Set(this.references()[commerceId] ?? []);

    return this.commandes
      .commandesDe(commerceId)
      .filter((commande) => ids.has(commande.id))
      .reverse();
  });

  readonly nombre = computed(() => this.miennes().length);

  retenir(commerceId: string, commandeId: string): void {
    const actuelles = this.references()[commerceId] ?? [];

    if (actuelles.includes(commandeId)) {
      return;
    }

    const suivantes = { ...this.references(), [commerceId]: [...actuelles, commandeId] };
    this.references.set(suivantes);
    this.ecrire(suivantes);
  }

  private lire(): MesReferences {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      return brut ? (JSON.parse(brut) as MesReferences) : {};
    } catch {
      return {};
    }
  }

  private ecrire(references: MesReferences): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(references));
    } catch {
      // Sans stockage, le suivi ne vaut que pour la session.
    }
  }
}
