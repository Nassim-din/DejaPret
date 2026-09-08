import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommerceService } from '../../services/commerce.service';
import { NotificationsService } from '../../services/notifications.service';

/** Navigation entre les espaces du commerçant. */
@Component({
  selector: 'app-nav-commercant',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="conteneur onglets" aria-label="Espaces commerçant">
      <a
        class="onglet"
        [routerLink]="['/commercant', commerceId()]"
        routerLinkActive="onglet--actif"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Commandes
        @if (nombreNonVues() > 0) {
          <span class="pastille" aria-label="nouvelles commandes">{{ nombreNonVues() }}</span>
        }
      </a>
      <a
        class="onglet"
        [routerLink]="['/commercant', commerceId(), 'tableau-de-bord']"
        routerLinkActive="onglet--actif"
      >
        Tableau de bord
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

    .pastille {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 19px;
      height: 19px;
      margin-left: 6px;
      padding: 0 6px;
      border-radius: 10px;
      background: var(--c-accent);
      color: var(--c-marque);
      font-size: 11px;
      font-weight: 700;
    }

    .onglet {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
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
export class NavCommercantComponent {
  readonly commerceId = inject(CommerceService).commerceId;
  readonly nombreNonVues = inject(NotificationsService).nombreNonVues;
}
