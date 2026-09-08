import { Commerce } from '../models/commerce.model';

/**
 * Snack du Vieux-Port (commerce fictif).
 *
 * Deuxième segment visé après les boulangeries. Il sert surtout à vérifier que
 * rien dans l'application ne suppose un commerce unique : couleurs, carte,
 * horaires et formules sont entièrement différents de la boulangerie.
 */
export const SNACK_DU_VIEUX_PORT: Commerce = {
  id: 'snack-du-vieux-port',
  nom: 'Snack du Vieux-Port',
  accroche: 'Sur place ou à emporter',
  adresse: '4 quai du Port, Marseille 2e',
  accepteCommandes: true,
  serviceSurPlace: true,
  abonnement: {
    statut: 'essai',
    depuis: '2026-09-01',
    miseEnPlaceReglee: false,
  },
  messageIndisponible:
    'Nous sommes en coup de feu et ne prenons plus de commandes. Merci de réessayer dans un moment.',
  couleurs: {
    marque: '#1B2A41',
    accent: '#E4572E',
    fond: '#F5F2EC',
    surface: '#E3DED3',
  },
  horaires: [
    { jour: 'lundi', ouvert: true, ouverture: '11:00', fermeture: '22:00' },
    { jour: 'mardi', ouvert: true, ouverture: '11:00', fermeture: '22:00' },
    { jour: 'mercredi', ouvert: true, ouverture: '11:00', fermeture: '22:00' },
    { jour: 'jeudi', ouvert: true, ouverture: '11:00', fermeture: '22:00' },
    { jour: 'vendredi', ouvert: true, ouverture: '11:00', fermeture: '23:30' },
    { jour: 'samedi', ouvert: true, ouverture: '11:00', fermeture: '23:30' },
    { jour: 'dimanche', ouvert: false, ouverture: '11:00', fermeture: '22:00' },
  ],
  produits: [
    {
      id: 'kebab',
      nom: 'Kebab',
      prixCentimes: 750,
      categorie: 'Sandwichs',
      illustration: 'generique',
    },
    {
      id: 'tacos-poulet',
      nom: 'Tacos poulet',
      prixCentimes: 850,
      categorie: 'Sandwichs',
      illustration: 'generique',
    },
    {
      id: 'burger-maison',
      nom: 'Burger maison',
      prixCentimes: 900,
      categorie: 'Burgers',
      illustration: 'formule',
    },
    {
      id: 'frites',
      nom: 'Frites maison',
      prixCentimes: 350,
      categorie: 'Accompagnements',
      illustration: 'generique',
    },
    {
      id: 'boisson-33',
      nom: 'Boisson 33 cl',
      prixCentimes: 200,
      categorie: 'Boissons',
      illustration: 'boisson',
    },
    {
      id: 'tiramisu',
      nom: 'Tiramisu maison',
      prixCentimes: 400,
      categorie: 'Desserts',
      illustration: 'generique',
    },
  ],
  formules: [
    {
      id: 'formule-sandwich',
      nom: 'Formule sandwich',
      description: 'Un sandwich, des frites, une boisson et vos sauces.',
      prixCentimes: 1150,
      illustration: 'formule',
      etapes: [
        {
          id: 'plat',
          libelle: 'Votre sandwich',
          options: [
            { id: 'kebab', nom: 'Kebab' },
            { id: 'tacos-poulet', nom: 'Tacos poulet' },
            { id: 'tacos-viande', nom: 'Tacos viande hachée', supplementCentimes: 100 },
            { id: 'panini', nom: 'Panini' },
          ],
        },
        {
          id: 'accompagnement',
          libelle: 'Votre accompagnement',
          options: [
            { id: 'frites', nom: 'Frites maison' },
            { id: 'potatoes', nom: 'Potatoes', supplementCentimes: 80 },
            { id: 'salade', nom: 'Salade verte' },
          ],
        },
        {
          id: 'sauces',
          libelle: 'Vos sauces',
          aide: 'Jusqu’à trois, c’est offert.',
          choixMultiple: true,
          facultative: true,
          options: [
            { id: 'algerienne', nom: 'Algérienne' },
            { id: 'blanche', nom: 'Blanche' },
            { id: 'harissa', nom: 'Harissa' },
            { id: 'barbecue', nom: 'Barbecue' },
            { id: 'ketchup', nom: 'Ketchup' },
            { id: 'mayonnaise', nom: 'Mayonnaise' },
          ],
        },
        {
          id: 'boisson',
          libelle: 'Votre boisson',
          options: [
            { id: 'soda', nom: 'Soda 33 cl' },
            { id: 'eau', nom: 'Eau minérale' },
            { id: 'the-glace', nom: 'Thé glacé', supplementCentimes: 50 },
          ],
        },
      ],
    },
    {
      id: 'formule-burger',
      nom: 'Formule burger',
      description: 'Un burger, des frites, une boisson et un dessert.',
      prixCentimes: 1450,
      illustration: 'formule',
      etapes: [
        {
          id: 'burger',
          libelle: 'Votre burger',
          options: [
            { id: 'maison', nom: 'Burger maison' },
            { id: 'cheese', nom: 'Double cheese', supplementCentimes: 150 },
            { id: 'veggie', nom: 'Burger végétarien' },
          ],
        },
        {
          id: 'cuisson',
          libelle: 'La cuisson',
          options: [
            { id: 'saignant', nom: 'Saignant' },
            { id: 'a-point', nom: 'À point' },
            { id: 'bien-cuit', nom: 'Bien cuit' },
          ],
        },
        {
          id: 'sauces',
          libelle: 'Vos sauces',
          choixMultiple: true,
          facultative: true,
          options: [
            { id: 'burger', nom: 'Sauce burger' },
            { id: 'barbecue', nom: 'Barbecue' },
            { id: 'moutarde', nom: 'Moutarde' },
            { id: 'algerienne', nom: 'Algérienne' },
          ],
        },
        {
          id: 'boisson',
          libelle: 'Votre boisson',
          options: [
            { id: 'soda', nom: 'Soda 33 cl' },
            { id: 'eau', nom: 'Eau minérale' },
            { id: 'the-glace', nom: 'Thé glacé', supplementCentimes: 50 },
          ],
        },
        {
          id: 'dessert',
          libelle: 'Votre dessert',
          options: [
            { id: 'tiramisu', nom: 'Tiramisu maison' },
            { id: 'cookie', nom: 'Cookie' },
            { id: 'glace', nom: 'Glace deux boules', supplementCentimes: 60 },
          ],
        },
      ],
    },
  ],
  creneaux: [
    {
      libelle: 'Midi',
      heures: [
        '11h45',
        '12h00',
        '12h15',
        '12h30',
        '12h45',
        '13h00',
        '13h15',
        '13h30',
        '13h45',
      ],
    },
    {
      libelle: 'Soir',
      heures: ['19h00', '19h30', '20h00', '20h30', '21h00', '21h30'],
    },
  ],
};
