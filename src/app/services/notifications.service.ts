import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CommandesService } from './commandes.service';

const CLE_STOCKAGE = 'deja-pret:notifications';

export type EtatPermission = 'indisponible' | 'accordee' | 'refusee' | 'a-demander';

/**
 * Prévient le commerçant qu'une commande vient d'arriver.
 *
 * Limite assumée tant que l'API n'existe pas (CLAUDE.md § 7) : la
 * notification ne part que si la page est ouverte sur cet appareil. Une
 * alerte reçue téléphone éteint demandera le serveur et un service worker.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly commandes = inject(CommandesService);
  private readonly fenetre = inject(DOCUMENT).defaultView;

  private readonly activeesInternes = signal(this.lire());
  readonly activees = this.activeesInternes.asReadonly();

  /** Dernière commande signalée, pour l'affichage à l'écran. */
  private readonly derniereSignalee = signal<string | null>(null);

  readonly nonVues = this.commandes.nonVues;
  readonly nombreNonVues = this.commandes.nombreNonVues;

  readonly derniere = computed(() => {
    const liste = this.nonVues();
    return liste.length > 0 ? liste[liste.length - 1] : null;
  });

  readonly supportees = !!this.fenetre && 'Notification' in this.fenetre;

  readonly permission = computed<EtatPermission>(() => {
    if (!this.supportees) {
      return 'indisponible';
    }
    const etat = this.fenetre?.Notification.permission;
    return etat === 'granted' ? 'accordee' : etat === 'denied' ? 'refusee' : 'a-demander';
  });

  constructor() {
    effect(() => {
      const commande = this.derniere();

      if (!commande || commande.id === this.derniereSignalee()) {
        return;
      }

      // On note d'abord pour ne jamais notifier deux fois la même commande.
      this.derniereSignalee.set(commande.id);
      this.envoyer(commande.prenom, commande.heure, commande.articles);
    });
  }

  async activer(): Promise<void> {
    if (!this.supportees || !this.fenetre) {
      return;
    }

    const reponse = await this.fenetre.Notification.requestPermission();
    const accordee = reponse === 'granted';

    this.activeesInternes.set(accordee);
    this.ecrire(accordee);
  }

  desactiver(): void {
    this.activeesInternes.set(false);
    this.ecrire(false);
  }

  marquerVues(): void {
    this.commandes.marquerVues();
  }

  private envoyer(prenom: string, heure: string, articles: number): void {
    if (!this.activees() || this.permission() !== 'accordee' || !this.fenetre) {
      return;
    }

    try {
      new this.fenetre.Notification('Nouvelle commande', {
        body: `${prenom} · retrait à ${heure} · ${articles} article${articles > 1 ? 's' : ''}`,
        tag: 'deja-pret-commande',
      });
    } catch {
      // Certaines plateformes exigent un service worker : on reste silencieux,
      // le bandeau à l'écran suffit.
    }
  }

  private lire(): boolean {
    try {
      return localStorage.getItem(CLE_STOCKAGE) === 'oui';
    } catch {
      return false;
    }
  }

  private ecrire(activees: boolean): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, activees ? 'oui' : 'non');
    } catch {
      // Sans stockage, le réglage vaut pour la session.
    }
  }
}
