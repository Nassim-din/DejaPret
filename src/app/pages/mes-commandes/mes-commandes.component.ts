import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EnteteEtapeComponent } from '../../components/entete-etape/entete-etape.component';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import {
  LIBELLES_STATUT,
  StatutCommande,
  heureEnMinutes,
} from '../../models/commande-jour.model';
import { LIBELLES_SERVICE, ModeService } from '../../models/commerce.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommerceService } from '../../services/commerce.service';
import { MesCommandesService } from '../../services/mes-commandes.service';
import { isoLocal, libelleDate } from '../../utils/jours';
import { normaliser } from '../../utils/texte';

type Tri = 'retrait' | 'recentes';

/** Le suivi de mes commandes : recherche, filtre par jour et tri. */
@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [EnteteEtapeComponent, PrixPipe],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss',
})
export class MesCommandesComponent {
  private readonly mesCommandes = inject(MesCommandesService);

  readonly commerce = inject(CommerceService).commerce;
  readonly aujourdhui = isoLocal(new Date());

  readonly recherche = signal('');
  readonly jourChoisi = signal<string | null>(null);
  readonly tri = signal<Tri>('retrait');

  private readonly toutes = this.mesCommandes.miennes;

  readonly aucune = computed(() => this.toutes().length === 0);

  /** Les jours où j'ai commandé, du plus proche au plus lointain. */
  readonly jours = computed(() =>
    [...new Set(this.toutes().map((commande) => commande.date))]
      .sort((a, b) => a.localeCompare(b))
      .map((iso) => ({
        iso,
        libelle: libelleDate(iso),
        nombre: this.toutes().filter((commande) => commande.date === iso).length,
      })),
  );

  readonly commandes = computed(() => {
    const terme = normaliser(this.recherche());
    const jour = this.jourChoisi();

    const filtrees = this.toutes().filter((commande) => {
      const surJour = !jour || commande.date === jour;
      const surTerme =
        !terme ||
        commande.code.includes(terme) ||
        normaliser(this.libelleStatut(commande.statut)).includes(terme) ||
        commande.lignes.some((ligne) => normaliser(ligne.nom).includes(terme));
      return surJour && surTerme;
    });

    // « Retrait » remonte la prochaine commande à récupérer ; « récentes »
    // remonte la dernière passée.
    return this.tri() === 'retrait'
      ? [...filtrees].sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            heureEnMinutes(a.heure) - heureEnMinutes(b.heure),
        )
      : filtrees;
  });

  readonly filtreActif = computed(
    () => this.recherche().trim().length > 0 || this.jourChoisi() !== null,
  );

  readonly aRecuperer = computed(
    () =>
      this.toutes().filter(
        (commande) =>
          commande.date >= this.aujourdhui &&
          (commande.statut === 'a-preparer' || commande.statut === 'prete'),
      ).length,
  );

  libelleStatut(statut: StatutCommande): string {
    return LIBELLES_STATUT[statut];
  }

  libelleService(service: ModeService): string {
    return LIBELLES_SERVICE[service];
  }

  libelleJour(date: string): string {
    return libelleDate(date);
  }

  /** Ce que le client doit comprendre, pas le nom interne du statut. */
  explication(statut: StatutCommande): string {
    switch (statut) {
      case 'a-preparer':
        return 'Votre commande est bien reçue, elle sera préparée pour l’heure choisie.';
      case 'prete':
        return 'Votre commande est prête. Présentez votre code au comptoir.';
      case 'retiree':
        return 'Vous avez retiré cette commande. Merci et à bientôt.';
      case 'refusee':
        return 'Le commerçant n’a pas pu préparer cette commande. Vous êtes remboursé.';
    }
  }

  majRecherche(evenement: Event): void {
    this.recherche.set((evenement.target as HTMLInputElement).value);
  }

  choisirJour(iso: string): void {
    this.jourChoisi.set(this.jourChoisi() === iso ? null : iso);
  }

  choisirTri(tri: Tri): void {
    this.tri.set(tri);
  }

  effacerFiltres(): void {
    this.recherche.set('');
    this.jourChoisi.set(null);
  }
}
