import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AlerteCommandeComponent } from '../../components/alerte-commande/alerte-commande.component';
import { EnteteCommercantComponent } from '../../components/entete-commercant/entete-commercant.component';
import { NavCommercantComponent } from '../../components/nav-commercant/nav-commercant.component';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import {
  CommandeJour,
  LIBELLES_STATUT,
  STATUTS_COMMANDE,
  StatutCommande,
} from '../../models/commande-jour.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommandesService } from '../../services/commandes.service';
import { LIBELLES_SERVICE, ModeService } from '../../models/commerce.model';
import { CommerceService } from '../../services/commerce.service';
import { calendrier, isoLocal, libelleDate } from '../../utils/jours';
import { normaliser } from '../../utils/texte';

/** Les commandes du commerce, jour par jour. */
@Component({
  selector: 'app-commercant',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [AlerteCommandeComponent, EnteteCommercantComponent, NavCommercantComponent, PrixPipe],
  templateUrl: './commercant.component.html',
  styleUrl: './commercant.component.scss',
})
export class CommercantComponent {
  private readonly commandesService = inject(CommandesService);
  private readonly commerceService = inject(CommerceService);

  readonly commerce = this.commerceService.commerce;
  readonly statuts = STATUTS_COMMANDE;
  readonly aujourdhui = isoLocal(new Date());

  readonly jourChoisi = signal(this.aujourdhui);
  readonly recherche = signal('');
  readonly filtreStatut = signal<StatutCommande | null>(null);

  readonly commandeOuverte = signal<CommandeJour | null>(null);
  readonly statutEnAttente = signal<StatutCommande | null>(null);

  /** Mode refus : on demande un motif avant de rendre la commande au client. */
  readonly enRefus = signal(false);
  readonly note = signal('');

  /**
   * Motifs proposés, construits à partir de ce qui a été commandé : la
   * rupture porte presque toujours sur un article précis.
   */
  readonly suggestions = computed(() => {
    const commande = this.commandeOuverte();
    if (!commande) {
      return [];
    }

    const parProduit = commande.lignes.map(
      (ligne) => `Il ne me reste plus de ${ligne.nom.toLowerCase()}.`,
    );

    return [
      ...parProduit,
      'Je suis en rupture sur un article de votre commande.',
      'Je ferme plus tôt aujourd’hui, je ne pourrai pas préparer votre commande.',
      'La quantité demandée dépasse ce que je peux préparer.',
    ];
  });

  /** Deux semaines de retrait, avec le nombre de commandes par jour. */
  readonly jours = computed(() => {
    const toutes = this.commandesService.commandes();

    return calendrier(this.commerce().horaires).map((jour) => ({
      ...jour,
      nombre: toutes.filter((commande) => commande.date === jour.iso).length,
      choisi: jour.iso === this.jourChoisi(),
    }));
  });

  /** Les commandes du jour choisi, avant recherche et filtre. */
  readonly commandesDuJour = computed(() =>
    this.commandesService.commandes().filter((c) => c.date === this.jourChoisi()),
  );

  readonly commandes = computed(() => {
    const terme = normaliser(this.recherche());
    const statut = this.filtreStatut();

    return this.commandesDuJour().filter((commande) => {
      const surStatut = !statut || commande.statut === statut;
      const surTerme =
        !terme ||
        normaliser(commande.prenom).includes(terme) ||
        commande.code.includes(terme) ||
        commande.lignes.some((ligne) => normaliser(ligne.nom).includes(terme));
      return surStatut && surTerme;
    });
  });

  readonly libelleJourChoisi = computed(() => libelleDate(this.jourChoisi()));

  /** Le filtre « Refusée » n'apparaît que s'il y a des refus ce jour-là. */
  readonly statutsAffiches = computed<readonly StatutCommande[]>(() =>
    this.commandesDuJour().some((c) => c.statut === 'refusee')
      ? [...STATUTS_COMMANDE, 'refusee']
      : STATUTS_COMMANDE,
  );

  /** Les chiffres portent sur ce qui est affiché, filtres compris. */
  readonly articlesAffiches = computed(() =>
    this.commandes()
      .filter((commande) => commande.statut !== 'refusee')
      .reduce((total, commande) => total + commande.articles, 0),
  );

  /** Une commande refusée sera remboursée : elle ne compte pas comme encaissée. */
  readonly totalCentimes = computed(() =>
    this.commandes()
      .filter((commande) => commande.statut !== 'refusee')
      .reduce((total, commande) => total + commande.totalCentimes, 0),
  );

  readonly filtreActif = computed(
    () => this.recherche().trim().length > 0 || this.filtreStatut() !== null,
  );

  readonly changementEnAttente = computed(() => {
    const commande = this.commandeOuverte();
    const statut = this.statutEnAttente();
    return !!commande && !!statut && statut !== commande.statut;
  });

  libelleStatut(statut: StatutCommande): string {
    return LIBELLES_STATUT[statut];
  }

  libelleService(service: ModeService): string {
    return LIBELLES_SERVICE[service];
  }

  compte(statut: StatutCommande): number {
    return this.commandesDuJour().filter((commande) => commande.statut === statut).length;
  }

  choisirJour(iso: string): void {
    this.jourChoisi.set(iso);
    this.filtreStatut.set(null);
    this.recherche.set('');
  }

  majRecherche(evenement: Event): void {
    this.recherche.set((evenement.target as HTMLInputElement).value);
  }

  basculerFiltre(statut: StatutCommande): void {
    this.filtreStatut.set(this.filtreStatut() === statut ? null : statut);
  }

  effacerFiltres(): void {
    this.recherche.set('');
    this.filtreStatut.set(null);
  }

  ouvrir(commande: CommandeJour): void {
    this.commandeOuverte.set(commande);
    this.statutEnAttente.set(commande.statut);
    this.enRefus.set(false);
    this.note.set('');
  }

  fermer(): void {
    this.commandeOuverte.set(null);
    this.statutEnAttente.set(null);
    this.enRefus.set(false);
    this.note.set('');
  }

  ouvrirRefus(): void {
    this.enRefus.set(true);
  }

  annulerRefus(): void {
    this.enRefus.set(false);
    this.note.set('');
  }

  choisirSuggestion(texte: string): void {
    this.note.set(texte);
  }

  majNote(evenement: Event): void {
    this.note.set((evenement.target as HTMLTextAreaElement).value);
  }

  /** Un refus sans explication laisserait le client sans réponse. */
  readonly refusPossible = computed(() => this.note().trim().length > 0);

  confirmerRefus(): void {
    const commande = this.commandeOuverte();

    if (commande && this.refusPossible()) {
      this.commandesService.refuser(this.commerce().id, commande.id, this.note());
    }

    this.fermer();
  }

  choisirStatut(statut: StatutCommande): void {
    this.statutEnAttente.set(statut);
  }

  /** Le changement n'est appliqué qu'après confirmation explicite. */
  confirmer(): void {
    const commande = this.commandeOuverte();
    const statut = this.statutEnAttente();

    if (commande && statut && statut !== commande.statut) {
      this.commandesService.changerStatut(this.commerce().id, commande.id, statut);
    }

    this.fermer();
  }
}
