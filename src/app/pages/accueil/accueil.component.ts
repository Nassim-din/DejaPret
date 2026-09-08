import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LISTE_COMMERCES } from '../../merchants';

/**
 * Accueil : on choisit d'abord la boutique, puis le point de vue.
 *
 * Les liens vers un commerce sont directs (`/client/<id>`) : un QR code posé
 * sur un comptoir n'a pas à passer par cet écran.
 */
@Component({
  selector: 'app-accueil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  readonly commerces = LISTE_COMMERCES;

  readonly commerceId = signal(this.commerces[0].id);

  readonly commerce = computed(
    () => this.commerces.find((commerce) => commerce.id === this.commerceId())!,
  );

  choisirCommerce(id: string): void {
    this.commerceId.set(id);
  }
}
