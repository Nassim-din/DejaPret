/** Une ligne du panier : un produit de la carte, ou une formule composée. */
export interface LignePanier {
  readonly id: string;
  readonly commerceId: string;
  readonly type: 'produit' | 'formule';
  /** Identifiant du produit ou de la formule d'origine. */
  readonly referenceId: string;
  readonly nom: string;
  readonly quantite: number;
  readonly prixUnitaireCentimes: number;
  /** Choix retenus pour une formule, dans l'ordre des étapes. */
  readonly details?: readonly string[];
}
