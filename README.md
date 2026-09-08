# Déjà Prêt

Générateur de démo personnalisée par commerce. Voir [CLAUDE.md](./CLAUDE.md) pour le brief complet du projet.

## Développement

Lancer `npm start` (ou `ng serve`) puis ouvrir `http://localhost:4200/`.

## Build

Lancer `ng build`. Les artefacts sont générés dans `dist/`.

## Créer une démo pour un nouveau commerce

1. Copier `src/app/merchants/boulangerie-du-panier.ts` sous un nouveau nom.
2. Modifier le nom, l'accroche, l'adresse, les 4 couleurs et les produits.
3. Déclarer le nouveau commerce dans `src/app/merchants/index.ts` et le
   désigner comme `COMMERCE_ACTIF`.

C'est tout : les couleurs de la page, le titre de l'onglet et la carte
viennent de ce seul fichier.

### Photos produit

Les photos sont **optionnelles, produit par produit**.

- Déposer l'image dans `public/produits/`.
- Ajouter `photo: 'produits/ma-photo.jpg'` sur la ligne du produit.

Un produit sans photo affiche son illustration au trait : la mise en page est
la même dans les deux cas, on peut donc mélanger librement les produits
photographiés et les autres.

### Photo du commerce

Même principe : déposer l'image dans `public/commerce/` et renseigner
`photoProfil: 'commerce/devanture.jpg'`. Sans photo, on affiche les initiales
du commerce.

## Le parcours

Quatre écrans : carte (`/`), créneau (`/creneau`), coordonnées
(`/coordonnees`), confirmation (`/confirmation`).

Le paiement et l'envoi du SMS sont **simulés** : rien n'est envoyé nulle part,
et les champs de carte bancaire sont décoratifs.
