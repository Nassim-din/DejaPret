import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Navigation entre les écrans d'administration. */
@Component({
  selector: 'app-nav-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="conteneur onglets" aria-label="Administration">
      <a
        class="onglet"
        routerLink="/admin"
        routerLinkActive="onglet--actif"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Vue d’ensemble
      </a>
      <a class="onglet" routerLink="/admin/commerces" routerLinkActive="onglet--actif">
        Commerces
      </a>
      <a class="onglet" routerLink="/admin/abonnements" routerLinkActive="onglet--actif">
        Abonnements
      </a>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      background: var(--c-marque);
    }

    .onglets {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .onglets::-webkit-scrollbar {
      display: none;
    }

    .onglet {
      flex-shrink: 0;
      padding: 10px 14px 12px;
      border-bottom: 2px solid transparent;
      color: color-mix(in oklab, var(--c-fond) 58%, var(--c-marque));
      font-size: 13.5px;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
    }

    .onglet--actif {
      border-bottom-color: var(--c-accent);
      color: var(--c-fond);
    }
  `,
})
export class NavAdminComponent {}
