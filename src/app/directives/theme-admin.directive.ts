import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Habille l'administration de ses propres couleurs — bleu profond, orange,
 * blanc — pour qu'on ne la confonde jamais avec l'espace d'un commerce.
 * Comme pour les commerces, le thème est posé sur l'élément hôte seulement.
 */
const COULEURS_ADMIN = {
  '--c-marque': '#10395c',
  '--c-accent': '#f07a2b',
  '--c-fond': '#f6f9fc',
  '--c-surface': '#e3ecf5',
} as const;

@Directive({
  selector: '[appThemeAdmin]',
  standalone: true,
})
export class ThemeAdminDirective {
  constructor() {
    const hote = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    for (const [variable, valeur] of Object.entries(COULEURS_ADMIN)) {
      hote.style.setProperty(variable, valeur);
    }
  }
}
