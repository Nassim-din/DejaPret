import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { CommerceService } from '../../services/commerce.service';

/**
 * L'affiche à poser sur le comptoir : nom, QR code et mode d'emploi.
 *
 * C'est le point d'entrée physique du produit. Elle s'imprime en A4 sans
 * la navigation, via une feuille de style d'impression.
 */
@Component({
  selector: 'app-affiche',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [QrCodeComponent, RouterLink],
  templateUrl: './affiche.component.html',
  styleUrl: './affiche.component.scss',
})
export class AfficheComponent {
  private readonly commerceService = inject(CommerceService);
  private readonly document = inject(DOCUMENT);

  readonly commerce = this.commerceService.commerce;
  readonly lienPublic = this.commerceService.lienPublic;
  readonly accesActif = this.commerceService.accesActif;

  /** Adresse sans le protocole : plus lisible sur une affiche. */
  readonly lienAffiche = () => this.lienPublic().replace(/^https?:\/\//, '');

  imprimer(): void {
    this.document.defaultView?.print();
  }
}
