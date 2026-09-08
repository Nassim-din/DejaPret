import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommerceService } from '../../services/commerce.service';
import { CommerceAvatarComponent } from '../commerce-avatar/commerce-avatar.component';

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

/** En-tête commun aux espaces du commerçant. */
@Component({
  selector: 'app-entete-commercant',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommerceAvatarComponent, RouterLink, RouterLinkActive],
  template: `
    <div class="conteneur contenu">
      <a class="retour" routerLink="/" aria-label="Revenir à l’accueil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </a>

      <app-commerce-avatar
        class="avatar"
        [nom]="commerce().nom"
        [photo]="commerce().photoProfil"
      />

      <div class="texte">
        <p class="surtitre">Espace commerçant</p>
        <h1 class="nom">{{ commerce().nom }}</h1>
        <p class="date">{{ dateDuJour }}</p>
      </div>

      <span class="etat" [class.etat--ferme]="!commerce().accepteCommandes">
        {{ commerce().accepteCommandes ? 'Ouvert aux commandes' : 'Commandes suspendues' }}
      </span>

      <a
        class="reglages"
        [routerLink]="['/commercant', commerce().id, 'parametres']"
        routerLinkActive="reglages--actif"
        aria-label="Paramètres du commerce"
        title="Paramètres"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15.1 4.7a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.03a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      </a>
    </div>
  `,
  styles: `
    /* Hauteur fluide : compacte sur téléphone, où chaque pixel sert aux
       commandes, plus ample dès qu'on a de la place. */
    :host {
      display: flex;
      align-items: center;
      min-height: clamp(118px, 14vw, 180px);
      padding: clamp(16px, 2.4vw, 28px) 0;
      background: var(--c-marque);
    }

    .contenu {
      display: flex;
      align-items: center;
      gap: clamp(12px, 1.6vw, 20px);
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

    .avatar {
      --taille-avatar: clamp(46px, 6vw, 72px);
    }

    .texte {
      display: flex;
      flex-direction: column;
      gap: clamp(3px, 0.5vw, 6px);
      flex-grow: 1;
      min-width: 0;
    }

    .surtitre {
      margin: 0;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--c-accent);
    }

    .nom {
      margin: 0;
      font-family: var(--police-titre);
      font-size: clamp(21px, 2.6vw, 30px);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.03em;
      color: var(--c-fond);
    }

    .date {
      margin: 0;
      font-size: clamp(12px, 1.1vw, 14px);
      text-transform: capitalize;
      color: color-mix(in oklab, var(--c-fond) 58%, var(--c-marque));
    }

    .etat {
      flex-shrink: 0;
      padding: 5px 11px;
      border-radius: 12px;
      background: color-mix(in oklab, var(--c-accent) 26%, var(--c-marque));
      color: var(--c-accent);
      font-size: 11px;
      font-weight: 700;
      text-align: center;
    }

    .etat--ferme {
      background: #7d2b1c;
      color: #fdf2ee;
    }

    /* Les réglages sont rares : une icône suffit, et elle laisse la
       place aux deux écrans consultés tous les jours. */
    .reglages {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      margin-right: -10px;
      border-radius: 22px;
      color: color-mix(in oklab, var(--c-fond) 70%, var(--c-marque));
    }

    .reglages svg {
      width: 21px;
      height: 21px;
    }

    .reglages--actif {
      background: color-mix(in oklab, var(--c-fond) 14%, var(--c-marque));
      color: var(--c-accent);
    }

    @media (max-width: 599px) {
      .etat {
        display: none;
      }
    }
  `,
})
export class EnteteCommercantComponent {
  readonly commerce = inject(CommerceService).commerce;
  readonly dateDuJour = FORMAT_DATE.format(new Date());
}
