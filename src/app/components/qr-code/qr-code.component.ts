import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { toString as qrVersSvg } from 'qrcode';

/**
 * Le QR code d'une adresse, rendu en SVG.
 *
 * Il est généré sur l'appareil : l'adresse de la boutique n'est envoyée à
 * aucun service tiers, et l'affiche s'imprime sans connexion.
 */
@Component({
  selector: 'app-qr-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styles: `
    :host {
      display: block;
      line-height: 0;
    }

    :host ::ng-deep svg {
      width: 100%;
      height: auto;
      display: block;
    }
  `,
})
export class QrCodeComponent {
  readonly valeur = input.required<string>();
  /** Marge en modules autour du code, comme le veut la norme. */
  readonly marge = input(1);

  constructor() {
    const hote = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    effect(() => {
      const valeur = this.valeur();
      const marge = this.marge();

      void qrVersSvg(valeur, {
        type: 'svg',
        margin: marge,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#00000000' },
      })
        .then((svg) => {
          hote.innerHTML = svg;
        })
        .catch(() => {
          hote.textContent = '';
        });
    });
  }
}
