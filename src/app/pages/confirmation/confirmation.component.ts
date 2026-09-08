import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { Router, RouterLink } from '@angular/router';
import { CommerceAvatarComponent } from '../../components/commerce-avatar/commerce-avatar.component';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommandeService } from '../../services/commande.service';
import { CommandesService } from '../../services/commandes.service';
import { CommerceService } from '../../services/commerce.service';
import { PanierService } from '../../services/panier.service';
import { libelleDate } from '../../utils/jours';

/** Étape 4 : le code de retrait à présenter au comptoir. */
@Component({
  selector: 'app-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [CommerceAvatarComponent, PrixPipe, RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  private readonly panier = inject(PanierService);
  private readonly commandes = inject(CommandesService);
  private readonly router = inject(Router);

  readonly commande = inject(CommandeService);
  readonly commerce = inject(CommerceService).commerce;

  readonly chiffres = computed(() => (this.commande.code() ?? '----').split(''));

  readonly libelleJour = computed(() => libelleDate(this.commande.date()));

  readonly prenomAffiche = computed(() => {
    const prenom = this.commande.prenom().trim();
    return prenom ? `, ${prenom}` : '';
  });

  /** On n'affiche jamais le numéro en entier à l'écran. */
  readonly telephoneMasque = computed(() => {
    const chiffres = this.commande.telephone().replace(/\D/g, '');
    if (chiffres.length < 4) {
      return '••••';
    }
    return `${chiffres.slice(0, 2)} ${chiffres.slice(2, 4)} •• •• ${chiffres.slice(-2)}`;
  });

  readonly lignes = computed(() => this.panier.lignesDe(this.commerce().id));

  readonly totalCentimes = computed(() => this.panier.totalCentimes(this.commerce().id));

  /** Repart d'une commande vierge. */
  recommencer(): void {
    this.panier.vider();
    this.commande.reinitialiser();
    this.commandes.reinitialiser();
    void this.router.navigate(['/']);
  }
}
