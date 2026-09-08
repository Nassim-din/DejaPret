import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { RouterLink } from '@angular/router';
import { AlerteCommandeComponent } from '../../components/alerte-commande/alerte-commande.component';
import { EnteteCommercantComponent } from '../../components/entete-commercant/entete-commercant.component';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { NavCommercantComponent } from '../../components/nav-commercant/nav-commercant.component';
import { HoraireJour } from '../../models/commerce.model';
import { CommerceService } from '../../services/commerce.service';
import { NotificationsService } from '../../services/notifications.service';

type Onglet = 'commerce' | 'produits' | 'horaires';

/** Les réglages que le commerçant tient lui-même. */
@Component({
  selector: 'app-parametres',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [
    AlerteCommandeComponent,
    EnteteCommercantComponent,
    NavCommercantComponent,
    QrCodeComponent,
    RouterLink,
  ],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.scss',
})
export class ParametresComponent {
  private readonly commerceService = inject(CommerceService);

  readonly commerce = this.commerceService.commerce;
  readonly lienPublic = this.commerceService.lienPublic;
  readonly accesActif = this.commerceService.accesActif;
  readonly notifications = inject(NotificationsService);

  /** Retour visuel après une copie réussie. */
  readonly lienCopie = signal(false);

  readonly onglets: readonly { id: Onglet; libelle: string }[] = [
    { id: 'commerce', libelle: 'Mon commerce' },
    { id: 'produits', libelle: 'Produits' },
    { id: 'horaires', libelle: 'Horaires' },
  ];

  readonly onglet = signal<Onglet>('commerce');

  /** Message de confirmation affiché après un enregistrement. */
  readonly confirmation = signal<string | null>(null);

  readonly accepteCommandes = computed(() => this.commerce().accepteCommandes);

  choisirOnglet(onglet: Onglet): void {
    this.onglet.set(onglet);
    this.confirmation.set(null);
  }

  enregistrerInfos(formulaire: HTMLFormElement): void {
    const donnees = new FormData(formulaire);

    this.commerceService.majInfos({
      nom: String(donnees.get('nom') ?? '').trim(),
      accroche: String(donnees.get('accroche') ?? '').trim(),
      adresse: String(donnees.get('adresse') ?? '').trim(),
    });

    this.annoncer('Informations enregistrées.');
  }

  enregistrerProduit(produitId: string, nom: string, prixEuros: string): void {
    const prix = Number(prixEuros.replace(',', '.'));

    if (!nom.trim() || Number.isNaN(prix) || prix < 0) {
      this.annoncer('Nom ou prix invalide, rien n’a été changé.');
      return;
    }

    this.commerceService.majProduit(produitId, {
      nom: nom.trim(),
      prixCentimes: Math.round(prix * 100),
    });

    this.annoncer('Produit mis à jour.');
  }

  basculerJour(jour: HoraireJour): void {
    this.commerceService.majHoraires(
      this.commerce().horaires.map((horaire) =>
        horaire.jour === jour.jour ? { ...horaire, ouvert: !horaire.ouvert } : horaire,
      ),
    );
  }

  majHeure(jour: HoraireJour, champ: 'ouverture' | 'fermeture', valeur: string): void {
    this.commerceService.majHoraires(
      this.commerce().horaires.map((horaire) =>
        horaire.jour === jour.jour ? { ...horaire, [champ]: valeur } : horaire,
      ),
    );
  }

  basculerSurPlace(): void {
    this.commerceService.definirServiceSurPlace(!this.commerce().serviceSurPlace);
    this.annoncer(
      this.commerce().serviceSurPlace
        ? 'Vos clients peuvent désormais choisir sur place.'
        : 'Toutes les commandes seront à emporter.',
    );
  }

  basculerDisponibilite(): void {
    this.commerceService.definirDisponibilite(!this.accepteCommandes());
    this.annoncer(
      this.accepteCommandes()
        ? 'Vous acceptez à nouveau les commandes.'
        : 'Prise de commandes suspendue.',
    );
  }

  majMessageIndisponible(valeur: string): void {
    this.commerceService.definirDisponibilite(this.accepteCommandes(), valeur);
  }

  reinitialiser(): void {
    this.commerceService.reinitialiser();
    this.annoncer('Réglages remis à leur état d’origine.');
  }

  async copierLien(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.lienPublic());
      this.lienCopie.set(true);
      setTimeout(() => this.lienCopie.set(false), 2500);
    } catch {
      // Presse-papiers refusé : l'adresse reste lisible et sélectionnable.
      this.annoncer('Copie impossible, sélectionnez l’adresse à la main.');
    }
  }

  private annoncer(message: string): void {
    this.confirmation.set(message);
  }
}
