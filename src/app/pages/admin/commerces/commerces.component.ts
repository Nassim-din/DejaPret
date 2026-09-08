import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommerceAvatarComponent } from '../../../components/commerce-avatar/commerce-avatar.component';
import { ThemeAdminDirective } from '../../../directives/theme-admin.directive';
import { EnteteAdminComponent } from '../../../components/entete-admin/entete-admin.component';
import { NavAdminComponent } from '../../../components/nav-admin/nav-admin.component';
import {
  CouleursCommerce,
  LIBELLES_ABONNEMENT,
  StatutAbonnement,
} from '../../../models/commerce.model';
import { PrixPipe } from '../../../pipes/prix.pipe';
import { CommerceService } from '../../../services/commerce.service';
import { PlateformeService } from '../../../services/plateforme.service';
import { normaliser } from '../../../utils/texte';

/** Les commerces équipés : fiche, état et accès à leurs espaces. */
@Component({
  selector: 'app-admin-commerces',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeAdminDirective],
  imports: [
    EnteteAdminComponent,
    NavAdminComponent,
    CommerceAvatarComponent,
    PrixPipe,
    RouterLink,
  ],
  templateUrl: './commerces.component.html',
  styleUrl: './commerces.component.scss',
})
export class AdminCommercesComponent {
  private readonly plateforme = inject(PlateformeService);
  private readonly commerceService = inject(CommerceService);

  readonly recherche = signal('');

  /** Le panneau d'apparence est replié : on ne le règle qu'à la mise en place. */
  readonly apparenceOuverte = signal<string | null>(null);

  readonly champsCouleur: readonly { cle: keyof CouleursCommerce; libelle: string }[] = [
    { cle: 'marque', libelle: 'Bannière' },
    { cle: 'accent', libelle: 'Couleur d’appel' },
    { cle: 'fond', libelle: 'Fond de page' },
    { cle: 'surface', libelle: 'Fond des visuels' },
  ];

  readonly commerces = computed(() => {
    const terme = normaliser(this.recherche());
    if (!terme) {
      return this.plateforme.commerces();
    }

    return this.plateforme
      .commerces()
      .filter(
        (item) =>
          normaliser(item.commerce.nom).includes(terme) ||
          normaliser(item.commerce.adresse).includes(terme),
      );
  });

  libelleAbonnement(statut: StatutAbonnement): string {
    return LIBELLES_ABONNEMENT[statut];
  }

  majRecherche(evenement: Event): void {
    this.recherche.set((evenement.target as HTMLInputElement).value);
  }

  basculerApparence(commerceId: string): void {
    this.apparenceOuverte.set(
      this.apparenceOuverte() === commerceId ? null : commerceId,
    );
  }

  majCouleur(commerceId: string, champ: keyof CouleursCommerce, valeur: string): void {
    const commerce = this.commerceService.commerceDe(commerceId);
    if (!commerce) {
      return;
    }

    this.commerceService.majCouleursDe(commerceId, {
      ...commerce.couleurs,
      [champ]: valeur,
    });
  }

  reinitialiserCouleurs(commerceId: string): void {
    this.commerceService.reinitialiserCouleursDe(commerceId);
  }
}
