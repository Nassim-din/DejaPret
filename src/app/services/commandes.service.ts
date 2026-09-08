import { Injectable, computed, inject, signal } from '@angular/core';
import { COMMERCES } from '../merchants';
import { COMMANDES_INITIALES, CommandeSeed } from '../merchants/commandes-demo';
import {
  CommandeJour,
  LigneCommande,
  StatutCommande,
  heureEnMinutes,
  totalArticles,
  totalCentimes,
} from '../models/commande-jour.model';
import { CommerceService } from './commerce.service';
import { isoLocal } from '../utils/jours';

/** Une commande porte son commerce : rien n'est partagé entre deux boutiques. */
type CommandesParCommerce = Record<string, readonly CommandeJour[]>;

function dateDecalee(jours: number): string {
  const date = new Date();
  date.setDate(date.getDate() + jours);
  return isoLocal(date);
}

/** Résout les lignes d'une commande contre la carte du commerce. */
function resoudre(commerceId: string, seed: CommandeSeed): CommandeJour {
  const produits = COMMERCES[commerceId]?.produits ?? [];

  const lignes: LigneCommande[] = seed.lignes.flatMap((ligne) => {
    const produit = produits.find((item) => item.id === ligne.produitId);
    return produit
      ? [
          {
            nom: produit.nom,
            quantite: ligne.quantite,
            prixUnitaireCentimes: produit.prixCentimes,
          },
        ]
      : [];
  });

  return {
    id: seed.id,
    date: dateDecalee(seed.decalageJours),
    heure: seed.heure,
    service: seed.service ?? 'emporter',
    prenom: seed.prenom,
    code: seed.code,
    statut: seed.statut,
    lignes,
    articles: totalArticles(lignes),
    totalCentimes: totalCentimes(lignes),
  };
}

function etatInitial(): CommandesParCommerce {
  return Object.fromEntries(
    Object.entries(COMMANDES_INITIALES).map(([commerceId, seeds]) => [
      commerceId,
      seeds.map((seed) => resoudre(commerceId, seed)),
    ]),
  );
}

const CLE_STOCKAGE = 'deja-pret:commandes';

/**
 * Conserve les commandes sur l'appareil, faute d'API.
 *
 * On repart des commandes d'exemple dès que le jour change : leurs dates
 * sont relatives à aujourd'hui, elles n'auraient plus de sens le lendemain.
 */
function lireStockage(): CommandesParCommerce | null {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) {
      return null;
    }

    const stocke = JSON.parse(brut) as { jour: string; donnees: CommandesParCommerce };
    return stocke.jour === isoLocal(new Date()) ? stocke.donnees : null;
  } catch {
    return null;
  }
}

/** Les commandes du commerce, côté commerçant comme côté client. */
@Injectable({ providedIn: 'root' })
export class CommandesService {
  private readonly commerceService = inject(CommerceService);
  private readonly parCommerce = signal<CommandesParCommerce>(
    lireStockage() ?? etatInitial(),
  );

  /** Toutes les commandes du commerce courant, triées par date puis heure. */
  readonly commandes = computed(() => this.commandesDe(this.commerceService.commerceId()));

  commandesDe(commerceId: string): readonly CommandeJour[] {
    return [...(this.parCommerce()[commerceId] ?? [])].sort(
      (a, b) =>
        a.date.localeCompare(b.date) || heureEnMinutes(a.heure) - heureEnMinutes(b.heure),
    );
  }

  /** Les jours où ce commerce a au moins une commande. */
  joursAvecCommandes(commerceId: string): readonly string[] {
    return [...new Set(this.commandesDe(commerceId).map((commande) => commande.date))];
  }

  /**
   * Commandes arrivées pendant la session et pas encore vues par le
   * commerçant. Sans API, une commande ne peut arriver que depuis cet
   * appareil : la vraie notification à distance demandera le serveur.
   */
  private readonly nonVuesInternes = signal<readonly CommandeJour[]>([]);
  readonly nonVues = this.nonVuesInternes.asReadonly();

  readonly nombreNonVues = computed(() => this.nonVuesInternes().length);

  ajouter(commerceId: string, commande: CommandeJour): void {
    this.enregistrer({
      ...this.parCommerce(),
      [commerceId]: [...(this.parCommerce()[commerceId] ?? []), commande],
    });

    if (commerceId === this.commerceService.commerceId()) {
      this.nonVuesInternes.set([...this.nonVuesInternes(), commande]);
    }
  }

  marquerVues(): void {
    if (this.nonVuesInternes().length > 0) {
      this.nonVuesInternes.set([]);
    }
  }

  changerStatut(commerceId: string, id: string, statut: StatutCommande): void {
    this.enregistrer({
      ...this.parCommerce(),
      [commerceId]: (this.parCommerce()[commerceId] ?? []).map((commande) =>
        commande.id === id ? { ...commande, statut } : commande,
      ),
    });
  }

  /**
   * Refuse une commande avec un motif.
   *
   * Le remboursement n'est pas déclenché : il passera par Stripe Connect,
   * qui n'est pas branché (CLAUDE.md § 7).
   */
  refuser(commerceId: string, id: string, note: string): void {
    this.enregistrer({
      ...this.parCommerce(),
      [commerceId]: (this.parCommerce()[commerceId] ?? []).map((commande) =>
        commande.id === id
          ? { ...commande, statut: 'refusee' as const, note: note.trim() }
          : commande,
      ),
    });
  }

  /** Retire les commandes ajoutées pendant la session. */
  reinitialiser(): void {
    this.enregistrer(etatInitial());
    this.nonVuesInternes.set([]);
  }

  private enregistrer(donnees: CommandesParCommerce): void {
    this.parCommerce.set(donnees);

    try {
      localStorage.setItem(
        CLE_STOCKAGE,
        JSON.stringify({ jour: isoLocal(new Date()), donnees }),
      );
    } catch {
      // Sans stockage, les commandes ne valent que pour la session.
    }
  }
}
