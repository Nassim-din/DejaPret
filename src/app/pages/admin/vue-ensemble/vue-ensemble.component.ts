import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeAdminDirective } from '../../../directives/theme-admin.directive';
import { EnteteAdminComponent } from '../../../components/entete-admin/entete-admin.component';
import { NavAdminComponent } from '../../../components/nav-admin/nav-admin.component';
import { StatCarteComponent } from '../../../components/stat-carte/stat-carte.component';
import { PrixPipe } from '../../../pipes/prix.pipe';
import { PlateformeService } from '../../../services/plateforme.service';

/** Ce qu'on regarde en ouvrant l'administration. */
@Component({
  selector: 'app-vue-ensemble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeAdminDirective],
  imports: [
    EnteteAdminComponent,
    NavAdminComponent,
    StatCarteComponent,
    PrixPipe,
    RouterLink,
  ],
  templateUrl: './vue-ensemble.component.html',
  styleUrl: './vue-ensemble.component.scss',
})
export class VueEnsembleComponent {
  readonly plateforme = inject(PlateformeService);
}
