import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnteteEtapeComponent } from '../../components/entete-etape/entete-etape.component';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { ModeService } from '../../models/commerce.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommandeService } from '../../services/commande.service';
import { CommerceService } from '../../services/commerce.service';
import { PanierService } from '../../services/panier.service';
import { calendrier, libelleDate } from '../../utils/jours';

/** Étape 2 : la date et l'heure de retrait. */
@Component({
  selector: 'app-creneau',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [EnteteEtapeComponent, PrixPipe, RouterLink],
  templateUrl: './creneau.component.html',
  styleUrl: './creneau.component.scss',
})
export class CreneauComponent {
  private readonly panier = inject(PanierService);

  readonly commande = inject(CommandeService);
  readonly commerce = inject(CommerceService).commerce;

  readonly modes = [
    {
      valeur: 'emporter' as ModeService,
      libelle: 'À emporter',
      note: 'Vous récupérez au comptoir',
    },
    {
      valeur: 'sur-place' as ModeService,
      libelle: 'Sur place',
      note: 'Vous consommez à la boutique',
    },
  ];

  /** Deux semaines de retrait possibles, jours de fermeture compris. */
  readonly jours = computed(() => calendrier(this.commerce().horaires));

  readonly libelleDateChoisie = computed(() => libelleDate(this.commande.date()));

  readonly totalCentimes = computed(() => this.panier.totalCentimes(this.commerce().id));

  readonly libelleArticles = computed(() => {
    const nombre = this.panier.nombreArticlesDe(this.commerce().id);
    return nombre > 1 ? `${nombre} articles` : `${nombre} article`;
  });

  constructor() {
    // À l'arrivée, on positionne le premier jour d'ouverture disponible :
    // le commerce peut très bien être fermé aujourd'hui.
    if (this.commande.date() === null) {
      const premier = this.jours().find((jour) => jour.ouvert);
      if (premier) {
        this.commande.choisirDate(premier.iso);
      }
    }
  }

  choisirService(mode: ModeService): void {
    this.commande.service.set(mode);
  }

  choisirDate(iso: string): void {
    this.commande.choisirDate(iso);
  }

  choisirHeure(heure: string): void {
    this.commande.heure.set(heure);
  }
}
