import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TARIFS } from '../../../config/tarifs';
import { ThemeAdminDirective } from '../../../directives/theme-admin.directive';
import { EnteteAdminComponent } from '../../../components/entete-admin/entete-admin.component';
import { NavAdminComponent } from '../../../components/nav-admin/nav-admin.component';
import { StatCarteComponent } from '../../../components/stat-carte/stat-carte.component';
import {
  Commerce,
  LIBELLES_ABONNEMENT,
  StatutAbonnement,
} from '../../../models/commerce.model';
import { PrixPipe } from '../../../pipes/prix.pipe';
import { CommerceService } from '../../../services/commerce.service';
import { PlateformeService } from '../../../services/plateforme.service';
import { depuisIso } from '../../../utils/jours';

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const STATUTS: readonly StatutAbonnement[] = ['actif', 'essai', 'suspendu'];

/** Gestion des abonnements : statut, ancienneté et mise en place. */
@Component({
  selector: 'app-admin-abonnements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeAdminDirective],
  imports: [EnteteAdminComponent, NavAdminComponent, StatCarteComponent, PrixPipe],
  templateUrl: './abonnements.component.html',
  styleUrl: './abonnements.component.scss',
})
export class AdminAbonnementsComponent {
  private readonly commerceService = inject(CommerceService);

  readonly plateforme = inject(PlateformeService);
  readonly statuts = STATUTS;
  readonly abonnementMensuelCentimes = TARIFS.abonnementMensuelCentimes;
  readonly miseEnPlaceCentimes = TARIFS.miseEnPlaceCentimes;

  libelleStatut(statut: StatutAbonnement): string {
    return LIBELLES_ABONNEMENT[statut];
  }

  depuis(iso: string): string {
    return FORMAT_DATE.format(depuisIso(iso));
  }

  changerStatut(commerce: Commerce, statut: StatutAbonnement): void {
    this.commerceService.majAbonnementDe(commerce.id, {
      ...commerce.abonnement,
      statut,
    });
  }

  basculerMiseEnPlace(commerce: Commerce): void {
    this.commerceService.majAbonnementDe(commerce.id, {
      ...commerce.abonnement,
      miseEnPlaceReglee: !commerce.abonnement.miseEnPlaceReglee,
    });
  }
}
