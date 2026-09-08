import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommerceService } from '../../services/commerce.service';
import { NotificationsService } from '../../services/notifications.service';

/** Bandeau affiché au commerçant dès qu'une commande arrive. */
@Component({
  selector: 'app-alerte-commande',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrixPipe, RouterLink],
  template: `
    @if (notifications.derniere(); as commande) {
      <div class="alerte" role="status">
        <div class="conteneur alerte__contenu">
          <span class="alerte__pastille" aria-hidden="true"></span>

          <span class="alerte__texte">
            <strong>
              {{ notifications.nombreNonVues() > 1 ? notifications.nombreNonVues() + ' nouvelles commandes' : 'Nouvelle commande' }}
            </strong>
            {{ commande.prenom }} · retrait à {{ commande.heure }} ·
            {{ commande.articles }} article{{ commande.articles > 1 ? 's' : '' }} ·
            {{ commande.totalCentimes | prix }}
          </span>

          <a
            class="alerte__voir"
            [routerLink]="['/commercant', commerceId()]"
            (click)="notifications.marquerVues()"
          >
            Voir
          </a>

          <button
            type="button"
            class="alerte__fermer"
            aria-label="Masquer"
            (click)="notifications.marquerVues()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    .alerte {
      padding: 12px 0;
      background: var(--c-accent);
      color: var(--c-marque);
    }

    .alerte__contenu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alerte__pastille {
      flex-shrink: 0;
      width: 9px;
      height: 9px;
      border-radius: 5px;
      background: var(--c-marque);
      animation: battement 1.4s ease-in-out infinite;
    }

    @keyframes battement {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .alerte__pastille {
        animation: none;
      }
    }

    .alerte__texte {
      flex-grow: 1;
      min-width: 0;
      font-size: 13px;
      line-height: 1.4;
    }

    .alerte__texte strong {
      display: block;
      font-size: 13.5px;
    }

    .alerte__voir {
      flex-shrink: 0;
      padding: 8px 16px;
      border-radius: 18px;
      background: var(--c-marque);
      color: var(--c-fond);
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .alerte__fermer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 16px;
      background: none;
      color: inherit;
      cursor: pointer;
    }

    .alerte__fermer svg {
      width: 16px;
      height: 16px;
    }
  `,
})
export class AlerteCommandeComponent {
  readonly notifications = inject(NotificationsService);
  readonly commerceId = inject(CommerceService).commerceId;
}
