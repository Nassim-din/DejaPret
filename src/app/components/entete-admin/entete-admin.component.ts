import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

/** En-tête commun aux écrans d'administration. */
@Component({
  selector: 'app-entete-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="conteneur contenu">
      <a class="retour" routerLink="/" aria-label="Revenir à l’accueil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </a>

      <div class="texte">
        <p class="surtitre">Déjà Prêt · Administration</p>
        <h1 class="titre">{{ titre() }}</h1>
      </div>
    </div>
  `,
  styles: `
    /* Même respiration que la bannière commerçant, pour que les deux
       espaces se ressemblent en passant de l'un à l'autre. */
    :host {
      display: flex;
      align-items: center;
      min-height: clamp(110px, 13vw, 170px);
      padding: clamp(16px, 2.4vw, 28px) 0;
      background: var(--c-marque);
    }

    .contenu {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .retour {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      margin-left: -12px;
      color: var(--c-fond);
    }

    .retour svg {
      width: 20px;
      height: 20px;
    }

    .texte {
      display: flex;
      flex-direction: column;
      gap: clamp(3px, 0.5vw, 6px);
      min-width: 0;
    }

    .surtitre {
      margin: 0;
      font-size: clamp(10px, 0.9vw, 11px);
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--c-accent);
    }

    .titre {
      margin: 0;
      font-family: var(--police-titre);
      font-size: clamp(23px, 2.9vw, 34px);
      font-weight: 800;
      line-height: 1.06;
      letter-spacing: -0.03em;
      color: var(--c-fond);
    }
  `,
})
export class EnteteAdminComponent {
  readonly titre = input.required<string>();

  constructor() {
    inject(Title).setTitle('Déjà Prêt — Administration');
  }
}
