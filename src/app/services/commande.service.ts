import { Injectable, signal } from '@angular/core';
import { ModeService } from '../models/commerce.model';

/**
 * La commande en cours, en dehors du panier : créneau, coordonnées et
 * code de retrait.
 *
 * Le paiement et l'envoi du SMS ne sont pas branchés (voir CLAUDE.md,
 * section 7) : rien n'est transmis.
 */
@Injectable({ providedIn: 'root' })
export class CommandeService {
  /** Date de retrait au format ISO « 2026-09-07 ». */
  readonly date = signal<string | null>(null);
  readonly heure = signal<string | null>(null);
  /** À emporter par défaut : c'est le cas de tous les commerces. */
  readonly service = signal<ModeService>('emporter');
  readonly prenom = signal('');
  readonly telephone = signal('');

  private readonly codeInterne = signal<string | null>(null);
  readonly code = this.codeInterne.asReadonly();

  choisirDate(date: string): void {
    if (this.date() !== date) {
      this.date.set(date);
      // Un créneau n'a de sens que pour le jour choisi.
      this.heure.set(null);
    }
  }

  reinitialiser(): void {
    this.date.set(null);
    this.heure.set(null);
    this.service.set('emporter');
    this.prenom.set('');
    this.telephone.set('');
    this.codeInterne.set(null);
  }

  /** Tire le code à 4 chiffres présenté au comptoir. */
  genererCode(): void {
    const tirage = new Uint32Array(1);
    crypto.getRandomValues(tirage);
    this.codeInterne.set(String(1000 + (tirage[0] % 9000)));
  }
}
