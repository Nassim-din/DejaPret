import { Injectable, computed, signal } from '@angular/core';
import { Produit } from '../models/commerce.model';
import { LignePanier } from '../models/panier.model';

/**
 * Panier de la commande en cours.
 *
 * Chaque ligne porte l'identifiant de son commerce : le panier d'une
 * boutique ne peut pas déborder sur une autre.
 */
@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly lignesInternes = signal<readonly LignePanier[]>([]);

  readonly lignes = this.lignesInternes.asReadonly();

  /** Articles d'un commerce donné : deux boutiques ne s'additionnent pas. */
  nombreArticlesDe(commerceId: string): number {
    return this.lignesDe(commerceId).reduce((total, ligne) => total + ligne.quantite, 0);
  }

  lignesDe(commerceId: string): readonly LignePanier[] {
    return this.lignesInternes().filter((ligne) => ligne.commerceId === commerceId);
  }

  totalCentimes(commerceId: string): number {
    return this.lignesDe(commerceId).reduce(
      (total, ligne) => total + ligne.prixUnitaireCentimes * ligne.quantite,
      0,
    );
  }

  quantiteProduit(commerceId: string, produitId: string): number {
    return (
      this.lignesInternes().find(
        (ligne) =>
          ligne.commerceId === commerceId &&
          ligne.type === 'produit' &&
          ligne.referenceId === produitId,
      )?.quantite ?? 0
    );
  }

  ajouterProduit(commerceId: string, produit: Produit): void {
    const cle = this.cleProduit(commerceId, produit.id);
    const existante = this.lignesInternes().find((ligne) => ligne.id === cle);

    if (existante) {
      this.majQuantite(cle, existante.quantite + 1);
      return;
    }

    this.lignesInternes.set([
      ...this.lignesInternes(),
      {
        id: cle,
        commerceId,
        type: 'produit',
        referenceId: produit.id,
        nom: produit.nom,
        quantite: 1,
        prixUnitaireCentimes: produit.prixCentimes,
      },
    ]);
  }

  retirerProduit(commerceId: string, produitId: string): void {
    const cle = this.cleProduit(commerceId, produitId);
    const existante = this.lignesInternes().find((ligne) => ligne.id === cle);
    if (existante) {
      this.majQuantite(cle, existante.quantite - 1);
    }
  }

  ajouterFormule(ligne: Omit<LignePanier, 'id' | 'quantite' | 'type'>): void {
    this.lignesInternes.set([
      ...this.lignesInternes(),
      {
        ...ligne,
        id: `formule:${ligne.referenceId}:${Date.now()}`,
        type: 'formule',
        quantite: 1,
      },
    ]);
  }

  retirerLigne(ligneId: string): void {
    this.lignesInternes.set(
      this.lignesInternes().filter((ligne) => ligne.id !== ligneId),
    );
  }

  vider(): void {
    this.lignesInternes.set([]);
  }

  private majQuantite(ligneId: string, quantite: number): void {
    if (quantite <= 0) {
      this.retirerLigne(ligneId);
      return;
    }

    this.lignesInternes.set(
      this.lignesInternes().map((ligne) =>
        ligne.id === ligneId ? { ...ligne, quantite } : ligne,
      ),
    );
  }

  private cleProduit(commerceId: string, produitId: string): string {
    return `produit:${commerceId}:${produitId}`;
  }
}
