import { Commerce } from '../models/commerce.model';

/**
 * Démo : Boulangerie du Panier (commerce fictif).
 *
 * Pour une nouvelle démo : copier ce fichier, changer le nom, l'adresse,
 * les couleurs et les produits, puis le déclarer dans `index.ts`.
 *
 * Ce fichier est l'état de départ. Le commerçant peut ensuite ajuster ses
 * informations, ses prix et ses horaires depuis ses paramètres ; ses
 * changements sont conservés sur l'appareil.
 *
 * Photos : déposer les images dans `public/produits/` ou `public/commerce/`
 * et renseigner `photo` / `photoProfil`. Sans photo, on affiche une
 * illustration au trait ou les initiales du commerce.
 */
export const BOULANGERIE_DU_PANIER: Commerce = {
  id: 'boulangerie-du-panier',
  nom: 'Boulangerie du Panier',
  accroche: 'Maison fondée en 1978',
  adresse: '12 rue du Panier, Marseille 2e',
  accepteCommandes: true,
  serviceSurPlace: false,
  abonnement: {
    statut: 'actif',
    depuis: '2026-06-15',
    miseEnPlaceReglee: true,
  },
  messageIndisponible:
    'Nous ne prenons pas de commandes en ce moment. Merci de repasser un peu plus tard.',
  couleurs: {
    marque: '#14342B',
    accent: '#B8873B',
    fond: '#F4EEE3',
    surface: '#E7DCC8',
  },
  horaires: [
    { jour: 'lundi', ouvert: false, ouverture: '06:30', fermeture: '19:30' },
    { jour: 'mardi', ouvert: true, ouverture: '06:30', fermeture: '19:30' },
    { jour: 'mercredi', ouvert: true, ouverture: '06:30', fermeture: '19:30' },
    { jour: 'jeudi', ouvert: true, ouverture: '06:30', fermeture: '19:30' },
    { jour: 'vendredi', ouvert: true, ouverture: '06:30', fermeture: '19:30' },
    { jour: 'samedi', ouvert: true, ouverture: '06:30', fermeture: '20:00' },
    { jour: 'dimanche', ouvert: true, ouverture: '07:00', fermeture: '13:00' },
  ],
  produits: [
    {
      id: 'baguette-tradition',
      nom: 'Baguette tradition',
      prixCentimes: 130,
      categorie: 'Pains',
      illustration: 'baguette',
    },
    {
      id: 'croissant-beurre',
      nom: 'Croissant au beurre',
      prixCentimes: 120,
      categorie: 'Viennoiseries',
      illustration: 'croissant',
    },
    {
      id: 'navette-oranger',
      nom: 'Navette fleur d’oranger',
      prixCentimes: 110,
      categorie: 'Spécialités',
      illustration: 'navette',
    },
    {
      id: 'pain-chocolat',
      nom: 'Pain au chocolat',
      prixCentimes: 140,
      categorie: 'Viennoiseries',
      illustration: 'pain-chocolat',
    },
    {
      id: 'fougasse-olives',
      nom: 'Fougasse aux olives',
      prixCentimes: 350,
      categorie: 'Pains',
      illustration: 'fougasse',
    },
    {
      id: 'chausson-pommes',
      nom: 'Chausson aux pommes',
      prixCentimes: 180,
      categorie: 'Viennoiseries',
      illustration: 'chausson',
    },
  ],
  formules: [
    {
      id: 'formule-petit-dejeuner',
      nom: 'Formule petit-déjeuner',
      description: 'Une viennoiserie et une boisson chaude.',
      prixCentimes: 390,
      illustration: 'boisson',
      etapes: [
        {
          id: 'viennoiserie',
          libelle: 'Votre viennoiserie',
          aide: 'Une seule au choix.',
          options: [
            { id: 'croissant', nom: 'Croissant au beurre' },
            { id: 'pain-chocolat', nom: 'Pain au chocolat' },
            { id: 'chausson', nom: 'Chausson aux pommes', supplementCentimes: 40 },
          ],
        },
        {
          id: 'boisson-chaude',
          libelle: 'Votre boisson chaude',
          options: [
            { id: 'cafe', nom: 'Café' },
            { id: 'the', nom: 'Thé' },
            { id: 'chocolat', nom: 'Chocolat chaud', supplementCentimes: 30 },
          ],
        },
      ],
    },
    {
      id: 'formule-midi',
      nom: 'Formule midi',
      description: 'Un sandwich, un accompagnement, une boisson et un dessert.',
      prixCentimes: 890,
      illustration: 'formule',
      etapes: [
        {
          id: 'sandwich',
          libelle: 'Votre sandwich',
          options: [
            { id: 'jambon-beurre', nom: 'Jambon-beurre' },
            { id: 'poulet-crudites', nom: 'Poulet crudités' },
            { id: 'thon', nom: 'Thon mayonnaise' },
            { id: 'vegetarien', nom: 'Végétarien' },
          ],
        },
        {
          id: 'accompagnement',
          libelle: 'Votre accompagnement',
          options: [
            { id: 'chips', nom: 'Chips' },
            { id: 'salade', nom: 'Petite salade' },
            { id: 'soupe', nom: 'Soupe du jour', supplementCentimes: 60 },
          ],
        },
        {
          id: 'sauces',
          libelle: 'Vos sauces',
          aide: 'Autant que vous voulez, c’est offert.',
          choixMultiple: true,
          facultative: true,
          options: [
            { id: 'mayonnaise', nom: 'Mayonnaise' },
            { id: 'moutarde', nom: 'Moutarde' },
            { id: 'ketchup', nom: 'Ketchup' },
            { id: 'harissa', nom: 'Harissa' },
          ],
        },
        {
          id: 'boisson',
          libelle: 'Votre boisson',
          options: [
            { id: 'eau', nom: 'Eau minérale' },
            { id: 'soda', nom: 'Soda' },
            { id: 'jus', nom: 'Jus de fruits', supplementCentimes: 40 },
          ],
        },
        {
          id: 'dessert',
          libelle: 'Votre dessert',
          options: [
            { id: 'cookie', nom: 'Cookie' },
            { id: 'chausson', nom: 'Chausson aux pommes' },
            { id: 'tarte', nom: 'Part de tarte', supplementCentimes: 80 },
          ],
        },
      ],
    },
  ],
  creneaux: [
    {
      libelle: 'Matin',
      heures: [
        '7h00',
        '7h15',
        '7h30',
        '7h45',
        '8h00',
        '8h15',
        '8h30',
        '8h45',
        '9h00',
        '9h15',
        '9h30',
        '9h45',
      ],
    },
    {
      libelle: 'Après-midi',
      heures: ['16h00', '16h15', '16h30', '16h45', '17h00', '17h15'],
    },
  ],
};
