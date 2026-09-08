import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { Router } from '@angular/router';
import { EnteteEtapeComponent } from '../../components/entete-etape/entete-etape.component';
import { totalArticles, totalCentimes } from '../../models/commande-jour.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommandeService } from '../../services/commande.service';
import { CommandesService } from '../../services/commandes.service';
import { CommerceService } from '../../services/commerce.service';
import { MesCommandesService } from '../../services/mes-commandes.service';
import { PanierService } from '../../services/panier.service';
import { libelleDate } from '../../utils/jours';

/** Étape 3 : prénom, téléphone et paiement. */
@Component({
  selector: 'app-coordonnees',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [EnteteEtapeComponent, PrixPipe],
  templateUrl: './coordonnees.component.html',
  styleUrl: './coordonnees.component.scss',
})
export class CoordonneesComponent {
  private readonly panier = inject(PanierService);
  private readonly commandes = inject(CommandesService);
  private readonly mesCommandes = inject(MesCommandesService);
  private readonly router = inject(Router);

  readonly commande = inject(CommandeService);
  readonly commerce = inject(CommerceService).commerce;

  readonly totalCentimes = computed(() => this.panier.totalCentimes(this.commerce().id));

  readonly libelleJour = computed(() => libelleDate(this.commande.date()));

  readonly libelleArticles = computed(() => {
    const nombre = this.panier.nombreArticlesDe(this.commerce().id);
    return nombre > 1 ? `${nombre} articles` : `${nombre} article`;
  });

  /** Prénom et numéro suffisent : pas de création de compte. */
  readonly formulaireValide = computed(
    () =>
      this.commande.prenom().trim().length > 0 &&
      this.commande.telephone().replace(/\D/g, '').length >= 10,
  );

  majPrenom(evenement: Event): void {
    this.commande.prenom.set((evenement.target as HTMLInputElement).value);
  }

  majTelephone(evenement: Event): void {
    this.commande.telephone.set((evenement.target as HTMLInputElement).value);
  }

  payer(): void {
    this.commande.genererCode();

    const code = this.commande.code();
    const heure = this.commande.heure();
    const date = this.commande.date();

    if (code && heure && date) {
      // La commande garde le détail de ce qui a été acheté : le commerçant
      // doit savoir quoi préparer, pas seulement combien.
      const lignes = this.panier.lignesDe(this.commerce().id).map((ligne) => ({
        nom: ligne.nom,
        quantite: ligne.quantite,
        prixUnitaireCentimes: ligne.prixUnitaireCentimes,
        details: ligne.details,
      }));

      const identifiant = `commande-${code}`;

      this.commandes.ajouter(this.commerce().id, {
        id: identifiant,
        date,
        heure,
        service: this.commerce().serviceSurPlace
          ? this.commande.service()
          : 'emporter',
        prenom: this.commande.prenom().trim() || 'Client',
        code,
        lignes,
        articles: totalArticles(lignes),
        totalCentimes: totalCentimes(lignes),
        statut: 'a-preparer',
        enDirect: true,
      });

      // Le client pourra suivre sa commande depuis cet appareil.
      this.mesCommandes.retenir(this.commerce().id, identifiant);
    }

    void this.router.navigate(['/client', this.commerce().id, 'confirmation']);
  }
}
