import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AlerteCommandeComponent } from '../../components/alerte-commande/alerte-commande.component';
import { EnteteCommercantComponent } from '../../components/entete-commercant/entete-commercant.component';
import { NavCommercantComponent } from '../../components/nav-commercant/nav-commercant.component';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { CommandeJour, heureEnMinutes } from '../../models/commande-jour.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommandesService } from '../../services/commandes.service';
import { isoLocal, libelleDate } from '../../utils/jours';

/** Un produit et ce qu'il a rapporté sur la période. */
interface ProduitVendu {
  readonly nom: string;
  readonly quantite: number;
  readonly totalCentimes: number;
  readonly part: number;
}

function cumulerProduits(commandes: readonly CommandeJour[]): ProduitVendu[] {
  const parNom = new Map<string, { quantite: number; totalCentimes: number }>();

  for (const commande of commandes) {
    for (const ligne of commande.lignes) {
      const actuel = parNom.get(ligne.nom) ?? { quantite: 0, totalCentimes: 0 };
      parNom.set(ligne.nom, {
        quantite: actuel.quantite + ligne.quantite,
        totalCentimes:
          actuel.totalCentimes + ligne.prixUnitaireCentimes * ligne.quantite,
      });
    }
  }

  const entrees = [...parNom.entries()].sort((a, b) => b[1].quantite - a[1].quantite);
  const maximum = Math.max(1, ...entrees.map(([, valeurs]) => valeurs.quantite));

  return entrees.map(([nom, valeurs]) => ({
    nom,
    quantite: valeurs.quantite,
    totalCentimes: valeurs.totalCentimes,
    part: (valeurs.quantite / maximum) * 100,
  }));
}

/**
 * Tableau de bord du commerçant.
 *
 * Deux temps, comme sa journée : ce qui se passe aujourd'hui, puis ce qui est
 * déjà vendu pour les jours suivants — le récapitulatif du soir décrit dans
 * le brief (CLAUDE.md § 2).
 */
@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [
    AlerteCommandeComponent,
    EnteteCommercantComponent,
    NavCommercantComponent,
    PrixPipe,
  ],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.scss',
})
export class TableauDeBordComponent {
  private readonly commandesService = inject(CommandesService);
  private readonly aujourdhui = isoLocal(new Date());

  readonly commandes = computed(() =>
    this.commandesService.commandes().filter((c) => c.date === this.aujourdhui),
  );

  readonly aVenir = computed(() =>
    this.commandesService.commandes().filter((c) => c.date > this.aujourdhui),
  );

  // --- Aujourd'hui ---

  /** Les commandes refusées seront remboursées : hors chiffre d'affaires. */
  private readonly honorees = computed(() =>
    this.commandes().filter((c) => c.statut !== 'refusee'),
  );

  readonly chiffreAffaires = computed(() =>
    this.honorees().reduce((total, c) => total + c.totalCentimes, 0),
  );

  readonly refusees = computed(
    () => this.commandes().filter((c) => c.statut === 'refusee').length,
  );

  readonly panierMoyen = computed(() => {
    const nombre = this.honorees().length;
    return nombre === 0 ? 0 : Math.round(this.chiffreAffaires() / nombre);
  });

  readonly articlesVendus = computed(() =>
    this.honorees().reduce((total, c) => total + c.articles, 0),
  );

  readonly avancement = computed(() => {
    const commandes = this.commandes();
    const total = Math.max(1, commandes.length);

    const compte = (statut: string) =>
      commandes.filter((c) => c.statut === statut).length;

    return [
      { cle: 'a-preparer', libelle: 'À préparer', nombre: compte('a-preparer') },
      { cle: 'prete', libelle: 'Prêtes', nombre: compte('prete') },
      { cle: 'retiree', libelle: 'Retirées', nombre: compte('retiree') },
    ].map((item) => ({ ...item, part: (item.nombre / total) * 100 }));
  });

  readonly resteAPreparer = computed(
    () => this.commandes().filter((c) => c.statut === 'a-preparer').length,
  );

  readonly produitsDuJour = computed(() => cumulerProduits(this.commandes()).slice(0, 5));

  /** Répartition des retraits par tranche horaire : les coups de feu. */
  readonly parHeure = computed(() => {
    const groupes = new Map<string, number>();

    for (const commande of this.commandes()) {
      const tranche = `${commande.heure.split('h')[0]}h`;
      groupes.set(tranche, (groupes.get(tranche) ?? 0) + 1);
    }

    const entrees = [...groupes.entries()].sort(
      (a, b) => heureEnMinutes(a[0]) - heureEnMinutes(b[0]),
    );
    const maximum = Math.max(1, ...entrees.map(([, nombre]) => nombre));

    return entrees.map(([tranche, nombre]) => ({
      tranche,
      nombre,
      part: (nombre / maximum) * 100,
    }));
  });

  // --- Déjà vendu pour la suite ---

  readonly caAVenir = computed(() =>
    this.aVenir().reduce((total, c) => total + c.totalCentimes, 0),
  );

  readonly articlesAVenir = computed(() =>
    this.aVenir().reduce((total, c) => total + c.articles, 0),
  );

  readonly produitsAVenir = computed(() => cumulerProduits(this.aVenir()).slice(0, 5));

  /** Les jours à venir qui ont déjà des commandes. */
  readonly joursAVenir = computed(() => {
    const parJour = new Map<string, { nombre: number; totalCentimes: number }>();

    for (const commande of this.aVenir()) {
      const actuel = parJour.get(commande.date) ?? { nombre: 0, totalCentimes: 0 };
      parJour.set(commande.date, {
        nombre: actuel.nombre + 1,
        totalCentimes: actuel.totalCentimes + commande.totalCentimes,
      });
    }

    return [...parJour.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, valeurs]) => ({ date, libelle: libelleDate(date), ...valeurs }));
  });

  // --- Clients ---

  readonly clientsReguliers = computed(() => {
    const comptes = new Map<string, number>();

    for (const commande of this.commandesService.commandes()) {
      comptes.set(commande.prenom, (comptes.get(commande.prenom) ?? 0) + 1);
    }

    return [...comptes.entries()]
      .filter(([, nombre]) => nombre > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([prenom, nombre]) => ({ prenom, nombre }));
  });
}
