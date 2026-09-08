import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CouleursCommerce } from '../../models/commerce.model';

/** Mots qu'on ne compte pas dans les initiales d'un nom de commerce. */
const MOTS_OUTILS = new Set([
  'de',
  'des',
  'du',
  'la',
  'le',
  'les',
  'et',
  'au',
  'aux',
  'chez',
  'a',
]);

/**
 * Photo de profil du commerce.
 *
 * Optionnelle : sans photo, on affiche ses initiales plutôt qu'un trou.
 * Les couleurs peuvent être imposées (`couleurs`) pour que le commerce garde
 * son identité même affiché dans un espace qui a son propre thème, comme
 * l'administration.
 */
@Component({
  selector: 'app-commerce-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.background]': 'fond()',
    '[style.border-color]': 'bordure()',
  },
  template: `
    @if (photo(); as source) {
      <img [src]="source" [alt]="'Photo de ' + nom()" decoding="async" />
    } @else {
      <span class="initiales" [style.color]="teinteTexte()" aria-hidden="true">
        {{ initiales() }}
      </span>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--taille-avatar, 62px);
      height: var(--taille-avatar, 62px);
      border-radius: 50%;
      overflow: hidden;
      background: color-mix(in oklab, var(--c-fond) 16%, var(--c-marque));
      border: 2px solid var(--c-accent);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .initiales {
      font-family: var(--police-titre);
      font-size: calc(var(--taille-avatar, 62px) * 0.36);
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--c-accent);
    }
  `,
})
export class CommerceAvatarComponent {
  readonly nom = input.required<string>();
  readonly photo = input<string | undefined>(undefined);
  /** Couleurs du commerce, quand l'entourage ne les porte pas déjà. */
  readonly couleurs = input<CouleursCommerce | undefined>(undefined);

  readonly fond = computed(() => this.couleurs()?.marque ?? null);
  readonly bordure = computed(() => this.couleurs()?.accent ?? null);
  readonly teinteTexte = computed(() => this.couleurs()?.accent ?? null);

  readonly initiales = computed(() =>
    this.nom()
      .split(/[\s-]+/)
      .filter((mot) => mot.length > 0 && !MOTS_OUTILS.has(mot.toLowerCase()))
      .slice(0, 2)
      .map((mot) => mot[0]?.toUpperCase() ?? '')
      .join(''),
  );
}
