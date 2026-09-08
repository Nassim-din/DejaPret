import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** En-tête des étapes du parcours : retour et titre, sur toute la largeur. */
@Component({
  selector: 'app-entete-etape',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="conteneur contenu">
      <a class="retour" [routerLink]="retour()" aria-label="Revenir à l'étape précédente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </a>
      <h1 class="titre">{{ titre() }}</h1>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 12px 0;
      background: var(--c-marque);
    }

    .contenu {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .retour {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      margin-left: -12px;
      border-radius: 22px;
      color: var(--c-fond);

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .titre {
      margin: 0;
      font-family: var(--police-titre);
      font-size: 21px;
      font-weight: 700;
      letter-spacing: -0.015em;
      color: var(--c-fond);
    }
  `,
})
export class EnteteEtapeComponent {
  readonly titre = input.required<string>();
  /** Cible du retour, sous forme de segments de route. */
  readonly retour = input.required<string[]>();
}
