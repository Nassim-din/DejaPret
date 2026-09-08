import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Un chiffre clé, réutilisé sur les écrans d'administration. */
@Component({
  selector: 'app-stat-carte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="libelle">{{ libelle() }}</p>
    <p class="valeur">{{ valeur() }}</p>
    @if (note(); as texte) {
      <p class="note">{{ texte }}</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      border: 1px solid color-mix(in oklab, var(--c-marque) 14%, var(--c-fond));
      border-radius: 16px;
      background: #fff;
    }

    :host([forte]) {
      border-color: transparent;
      background: var(--c-marque);
      color: var(--c-fond);
    }

    :host([forte]) .libelle {
      color: var(--c-accent);
    }

    :host([forte]) .note {
      color: color-mix(in oklab, var(--c-fond) 62%, var(--c-marque));
    }

    .libelle {
      margin: 0;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: color-mix(in oklab, var(--c-marque) 55%, var(--c-fond));
    }

    .valeur {
      margin: 0;
      font-family: var(--police-titre);
      font-size: 27px;
      font-weight: 700;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }

    .note {
      margin: 0;
      font-size: 12px;
      line-height: 1.4;
      color: color-mix(in oklab, var(--c-marque) 58%, var(--c-fond));
    }
  `,
})
export class StatCarteComponent {
  readonly libelle = input.required<string>();
  readonly valeur = input.required<string | number>();
  readonly note = input<string | undefined>(undefined);
}
