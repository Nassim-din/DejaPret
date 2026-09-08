import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { RouterLink } from '@angular/router';
import { CommerceAvatarComponent } from '../../components/commerce-avatar/commerce-avatar.component';
import { ProduitCarteComponent } from '../../components/produit-carte/produit-carte.component';
import { ProduitIllustrationComponent } from '../../components/produit-illustration/produit-illustration.component';
import { Produit } from '../../models/commerce.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommerceService } from '../../services/commerce.service';
import { MesCommandesService } from '../../services/mes-commandes.service';
import { PanierService } from '../../services/panier.service';
import { normaliser } from '../../utils/texte';

/** La carte du commerce : formules, produits, recherche et panier. */
@Component({
  selector: 'app-produits',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [
    ProduitCarteComponent,
    ProduitIllustrationComponent,
    CommerceAvatarComponent,
    PrixPipe,
    RouterLink,
  ],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss',
})
export class ProduitsComponent {
  private readonly panier = inject(PanierService);
  private readonly commerceService = inject(CommerceService);

  readonly commerce = this.commerceService.commerce;
  readonly horaireDuJour = this.commerceService.horaireDuJour;
  readonly accepteCommandes = this.commerceService.accepteCommandes;
  readonly phraseRetrait = this.commerceService.phraseRetrait;
  readonly accesActif = this.commerceService.accesActif;
  readonly mesCommandes = inject(MesCommandesService).nombre;

  readonly recherche = signal('');
  private readonly rayonChoisi = signal<string | null>(null);

  readonly categories = computed(() => [
    ...new Set(this.commerce().produits.map((produit) => produit.categorie)),
  ]);

  /** Le rayon affiché : le premier de la carte tant qu'on n'a rien choisi. */
  readonly rayonActif = computed(() => this.rayonChoisi() ?? this.categories()[0] ?? null);

  /** Une recherche traverse tous les rayons ; sinon on n'en montre qu'un. */
  readonly enRecherche = computed(() => this.recherche().trim().length > 0);

  readonly produitsFiltres = computed(() => {
    const terme = normaliser(this.recherche());

    if (terme) {
      return this.commerce().produits.filter(
        (produit) =>
          normaliser(produit.nom).includes(terme) ||
          normaliser(produit.categorie).includes(terme),
      );
    }

    const rayon = this.rayonActif();
    return this.commerce().produits.filter((produit) => produit.categorie === rayon);
  });

  readonly nombreArticles = computed(() =>
    this.panier.nombreArticlesDe(this.commerce().id),
  );

  readonly totalCentimes = computed(() => this.panier.totalCentimes(this.commerce().id));

  readonly libelleArticles = computed(() => {
    const nombre = this.nombreArticles();
    if (nombre === 0) {
      return 'Votre commande';
    }
    return nombre > 1 ? `${nombre} articles` : '1 article';
  });

  majRecherche(evenement: Event): void {
    this.recherche.set((evenement.target as HTMLInputElement).value);
  }

  choisirRayon(categorie: string): void {
    this.rayonChoisi.set(categorie);
    this.recherche.set('');
  }

  compteRayon(categorie: string): number {
    return this.commerce().produits.filter((produit) => produit.categorie === categorie)
      .length;
  }

  effacerRecherche(): void {
    this.recherche.set('');
  }

  quantite(produitId: string): number {
    return this.panier.quantiteProduit(this.commerce().id, produitId);
  }

  ajouter(produit: Produit): void {
    this.panier.ajouterProduit(this.commerce().id, produit);
  }

  retirer(produitId: string): void {
    this.panier.retirerProduit(this.commerce().id, produitId);
  }
}
