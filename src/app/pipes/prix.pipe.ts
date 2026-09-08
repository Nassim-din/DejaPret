import { Pipe, PipeTransform } from '@angular/core';

/** Affiche un prix stocké en centimes au format français : 1,30 €. */
@Pipe({
  name: 'prix',
  standalone: true,
})
export class PrixPipe implements PipeTransform {
  private readonly format = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

  transform(centimes: number): string {
    return this.format.format(centimes / 100);
  }
}
