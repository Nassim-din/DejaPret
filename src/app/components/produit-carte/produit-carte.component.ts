import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Produit } from '../../models/commerce.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { ProduitIllustrationComponent } from '../produit-illustration/produit-illustration.component';

/**
 * Carte produit.
 *
 * La photo est optionnelle : si le commerçant en a fourni une, elle est
 * affichée ; sinon la carte retombe sur son illustration au trait, sans
 * que la mise en page change.
 */
@Component({
  selector: 'app-produit-carte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrixPipe, ProduitIllustrationComponent],
  templateUrl: './produit-carte.component.html',
  styleUrl: './produit-carte.component.scss',
})
export class ProduitCarteComponent {
  readonly produit = input.required<Produit>();
  readonly quantite = input.required<number>();
  /** Le commerce ne prend pas de commandes : la carte reste visible, inerte. */
  readonly desactive = input(false);

  readonly ajouter = output<void>();
  readonly retirer = output<void>();
}
