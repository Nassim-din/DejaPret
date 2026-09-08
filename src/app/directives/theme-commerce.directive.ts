import { Directive, ElementRef, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommerceService } from '../services/commerce.service';

/**
 * Applique les couleurs du commerce **sur l'élément hôte seulement**.
 *
 * Le thème reste ainsi cantonné aux espaces client et commerçant : l'accueil
 * et l'administration gardent les couleurs de Déjà Prêt, définies sur `:root`.
 */
@Directive({
  selector: '[appThemeCommerce]',
  standalone: true,
})
export class ThemeCommerceDirective {
  constructor() {
    const hote = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const commerce = inject(CommerceService).commerce;
    const titre = inject(Title);

    effect(() => {
      const { couleurs, nom } = commerce();

      hote.style.setProperty('--c-marque', couleurs.marque);
      hote.style.setProperty('--c-accent', couleurs.accent);
      hote.style.setProperty('--c-fond', couleurs.fond);
      hote.style.setProperty('--c-surface', couleurs.surface);

      titre.setTitle(`${nom} — Commande en ligne`);
    });
  }
}
