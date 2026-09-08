import { Routes } from '@angular/router';
import {
  accesOuvert,
  commandePayee,
  creneauChoisi,
  panierRempli,
  resoudreCommerce,
} from './guards/parcours.guard';

/**
 * Le commerce est porté par l'URL : `/client/boulangerie-du-panier` est
 * l'adresse que peut viser un QR code posé sur ce comptoir précis.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/accueil/accueil.component').then((m) => m.AccueilComponent),
  },

  {
    path: 'client/:commerce',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/produits/produits.component').then((m) => m.ProduitsComponent),
  },
  {
    path: 'client/:commerce/mes-commandes',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/mes-commandes/mes-commandes.component').then(
        (m) => m.MesCommandesComponent,
      ),
  },
  {
    path: 'client/:commerce/formule/:formule',
    canActivate: [resoudreCommerce, accesOuvert],
    loadComponent: () =>
      import('./pages/formule/formule.component').then((m) => m.FormuleComponent),
  },
  {
    path: 'client/:commerce/creneau',
    canActivate: [resoudreCommerce, accesOuvert, panierRempli],
    loadComponent: () =>
      import('./pages/creneau/creneau.component').then((m) => m.CreneauComponent),
  },
  {
    path: 'client/:commerce/coordonnees',
    canActivate: [resoudreCommerce, accesOuvert, panierRempli, creneauChoisi],
    loadComponent: () =>
      import('./pages/coordonnees/coordonnees.component').then(
        (m) => m.CoordonneesComponent,
      ),
  },
  {
    path: 'client/:commerce/confirmation',
    canActivate: [resoudreCommerce, accesOuvert, commandePayee],
    loadComponent: () =>
      import('./pages/confirmation/confirmation.component').then(
        (m) => m.ConfirmationComponent,
      ),
  },

  {
    path: 'commercant/:commerce',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/commercant/commercant.component').then((m) => m.CommercantComponent),
  },
  {
    path: 'commercant/:commerce/tableau-de-bord',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/tableau-de-bord/tableau-de-bord.component').then(
        (m) => m.TableauDeBordComponent,
      ),
  },
  {
    path: 'commercant/:commerce/affiche',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/affiche/affiche.component').then((m) => m.AfficheComponent),
  },
  {
    path: 'commercant/:commerce/parametres',
    canActivate: [resoudreCommerce],
    loadComponent: () =>
      import('./pages/parametres/parametres.component').then((m) => m.ParametresComponent),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/vue-ensemble/vue-ensemble.component').then(
        (m) => m.VueEnsembleComponent,
      ),
  },
  {
    path: 'admin/commerces',
    loadComponent: () =>
      import('./pages/admin/commerces/commerces.component').then(
        (m) => m.AdminCommercesComponent,
      ),
  },
  {
    path: 'admin/abonnements',
    loadComponent: () =>
      import('./pages/admin/abonnements/abonnements.component').then(
        (m) => m.AdminAbonnementsComponent,
      ),
  },

  { path: '**', redirectTo: '' },
];
