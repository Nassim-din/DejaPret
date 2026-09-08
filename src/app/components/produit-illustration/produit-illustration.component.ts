import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Illustration } from '../../models/commerce.model';

/**
 * Visuel de repli, affiché quand le commerçant n'a pas fourni de photo.
 * Trait unique, couleur héritée du parent via `currentColor`.
 */
@Component({
  selector: 'app-produit-illustration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (type()) {
        @case ('baguette') {
          <path d="M11 29c-2-2-1-6 3-10l7-7c4-4 8-5 10-3s1 6-3 10l-7 7c-4 4-8 5-10 3Z" />
          <path d="M15 23l3 3M19 19l3 3M23 15l3 3" />
        }
        @case ('croissant') {
          <path d="M28 10a12 12 0 1 0 0 20 14 14 0 0 1 0-20Z" />
        }
        @case ('navette') {
          <path d="M8 20c6-7 18-7 24 0-6 7-18 7-24 0Z" />
          <path d="M14 20h12" />
        }
        @case ('pain-chocolat') {
          <rect x="8" y="13" width="24" height="14" rx="4" />
          <path d="M15 13v14M25 13v14" />
        }
        @case ('fougasse') {
          <rect x="8" y="12" width="24" height="16" rx="6" />
          <path d="M15 17l3 6M20 16l3 8M25 18l2 5" />
        }
        @case ('chausson') {
          <path d="M8 28c0-8 6-15 14-15s10 7 10 15Z" />
          <path d="M13 23l4 3M19 21l4 3" />
        }
        @case ('boisson') {
          <path d="M13 12h14l-1.6 16.2a2 2 0 0 1-2 1.8h-6.8a2 2 0 0 1-2-1.8Z" />
          <path d="M27 15h3.2a2.8 2.8 0 0 1 0 5.6H26.4" />
        }
        @case ('formule') {
          <rect x="7" y="14" width="15" height="14" rx="3" />
          <path d="M11 14v-2a3.5 3.5 0 0 1 7 0v2" />
          <path d="M26 13h7l-1 15h-5Z" />
        }
        @default {
          <rect x="8" y="13" width="24" height="14" rx="5" />
          <path d="M14 20h12" />
        }
      }
    </svg>
  `,
  styles: `
    /* Se met à l'échelle de la tuile : lisible sur un téléphone
       comme sur une carte large. */
    :host {
      display: block;
      width: clamp(44px, 32%, 84px);
      aspect-ratio: 1;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class ProduitIllustrationComponent {
  readonly type = input.required<Illustration>();
}
