import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeCommerceDirective } from '../../directives/theme-commerce.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeFormule, Formule, OptionFormule } from '../../models/commerce.model';
import { PrixPipe } from '../../pipes/prix.pipe';
import { CommerceService } from '../../services/commerce.service';
import { PanierService } from '../../services/panier.service';

/**
 * Composition d'une formule, une étape à la fois.
 *
 * Une étape par choix : le client ne voit jamais qu'une décision à prendre,
 * ce qui reste tenable sur un téléphone tenu d'une main.
 */
@Component({
  selector: 'app-formule',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeCommerceDirective],
  imports: [PrixPipe],
  templateUrl: './formule.component.html',
  styleUrl: './formule.component.scss',
})
export class FormuleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly panier = inject(PanierService);
  private readonly commerceService = inject(CommerceService);

  readonly commerce = this.commerceService.commerce;

  readonly formule = computed<Formule | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('formule');
    return this.commerce().formules.find((formule) => formule.id === id);
  });

  readonly indexEtape = signal(0);

  /** Options retenues, par identifiant d'étape. */
  private readonly choix = signal<Record<string, string[]>>({});

  readonly etapes = computed<readonly EtapeFormule[]>(() => this.formule()?.etapes ?? []);

  readonly etape = computed<EtapeFormule | undefined>(
    () => this.etapes()[this.indexEtape()],
  );

  readonly derniereEtape = computed(
    () => this.indexEtape() === this.etapes().length - 1,
  );

  readonly progression = computed(() => {
    const total = this.etapes().length;
    return total === 0 ? 0 : ((this.indexEtape() + 1) / total) * 100;
  });

  /** Prix de base plus les suppléments retenus. */
  readonly totalCentimes = computed(() => {
    const formule = this.formule();
    if (!formule) {
      return 0;
    }

    return formule.etapes.reduce((total, etape) => {
      const retenus = this.choix()[etape.id] ?? [];
      const supplements = etape.options
        .filter((option) => retenus.includes(option.id))
        .reduce((somme, option) => somme + (option.supplementCentimes ?? 0), 0);
      return total + supplements;
    }, formule.prixCentimes);
  });

  readonly etapeValide = computed(() => {
    const etape = this.etape();
    if (!etape) {
      return false;
    }
    return etape.facultative || (this.choix()[etape.id]?.length ?? 0) > 0;
  });

  estRetenue(optionId: string): boolean {
    const etape = this.etape();
    return etape ? (this.choix()[etape.id] ?? []).includes(optionId) : false;
  }

  basculer(option: OptionFormule): void {
    const etape = this.etape();
    if (!etape) {
      return;
    }

    const actuels = this.choix()[etape.id] ?? [];
    const suivants = etape.choixMultiple
      ? actuels.includes(option.id)
        ? actuels.filter((id) => id !== option.id)
        : [...actuels, option.id]
      : [option.id];

    this.choix.set({ ...this.choix(), [etape.id]: suivants });

    // Un choix unique fait avancer tout seul : un geste de moins.
    if (!etape.choixMultiple && !this.derniereEtape()) {
      this.suivant();
    }
  }

  precedent(): void {
    if (this.indexEtape() === 0) {
      void this.router.navigate(['/client', this.commerce().id]);
      return;
    }
    this.indexEtape.set(this.indexEtape() - 1);
  }

  suivant(): void {
    if (!this.derniereEtape()) {
      this.indexEtape.set(this.indexEtape() + 1);
    }
  }

  ajouterAuPanier(): void {
    const formule = this.formule();
    if (!formule) {
      return;
    }

    this.panier.ajouterFormule({
      commerceId: this.commerce().id,
      referenceId: formule.id,
      nom: formule.nom,
      prixUnitaireCentimes: this.totalCentimes(),
      details: this.detailsRetenus(formule),
    });

    void this.router.navigate(['/client', this.commerce().id]);
  }

  private detailsRetenus(formule: Formule): string[] {
    return formule.etapes.flatMap((etape) => {
      const retenus = this.choix()[etape.id] ?? [];
      return etape.options
        .filter((option) => retenus.includes(option.id))
        .map((option) => option.nom);
    });
  }
}
