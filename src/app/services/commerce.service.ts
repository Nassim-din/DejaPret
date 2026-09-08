import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { COMMERCES, COMMERCE_PAR_DEFAUT } from '../merchants';
import {
  Abonnement,
  Commerce,
  CouleursCommerce,
  HoraireJour,
  JOURS_SEMAINE,
} from '../models/commerce.model';
import { formatHeure, libelleDate, prochaineOuverture } from '../utils/jours';

/**
 * Ce que le commerçant peut modifier depuis ses paramètres.
 * On ne conserve que ces champs : le reste vient toujours du fichier du
 * commerce, pour qu'un ajout au fichier apparaisse même après des réglages.
 */
interface ModificationsCommerce {
  nom?: string;
  accroche?: string;
  adresse?: string;

  accepteCommandes?: boolean;
  serviceSurPlace?: boolean;
  messageIndisponible?: string;
  couleurs?: CouleursCommerce;
  abonnement?: Abonnement;
  horaires?: HoraireJour[];
  /** Prix et noms de produits, par identifiant de produit. */
  produits?: Record<string, { nom?: string; prixCentimes?: number }>;
}

/** Les réglages de tous les commerces, par identifiant de commerce. */
type Reglages = Record<string, ModificationsCommerce>;

const CLE_STOCKAGE = 'deja-pret:commerces';

/**
 * Résout le commerce courant et applique ses réglages.
 *
 * C'est le **seul** endroit où un commerce est résolu : aucun composant
 * n'importe un commerce en dur. L'identifiant vient de l'URL.
 */
@Injectable({ providedIn: 'root' })
export class CommerceService {
  private readonly identifiant = signal<string>(COMMERCE_PAR_DEFAUT);
  private readonly reglages = signal<Reglages>(this.lire());

  readonly commerceId = this.identifiant.asReadonly();

  readonly commerce = computed<Commerce>(() => {
    const base = COMMERCES[this.identifiant()] ?? COMMERCES[COMMERCE_PAR_DEFAUT];
    return this.appliquer(base, this.reglages()[base.id] ?? {});
  });

  /** L'horaire du jour en cours, pour l'afficher côté client. */
  readonly horaireDuJour = computed<HoraireJour | undefined>(() => {
    const index = (new Date().getDay() + 6) % 7; // dimanche = 0 → lundi en tête
    const jour = JOURS_SEMAINE[index];
    return this.commerce().horaires.find((horaire) => horaire.jour === jour);
  });

  readonly accepteCommandes = computed(() => this.commerce().accepteCommandes);

  /**
   * Phrase de réassurance affichée au client, déduite des horaires.
   * Elle ne peut donc pas contredire l'en-tête : un commerce fermé
   * aujourd'hui annonce son prochain jour d'ouverture.
   */
  readonly phraseRetrait = computed(() => {
    const prochaine = prochaineOuverture(this.commerce().horaires);

    if (!prochaine) {
      return 'Retrait au comptoir, sans faire la queue.';
    }

    const heure = formatHeure(prochaine.horaire.ouverture);
    return `Retrait ${libelleDate(prochaine.iso)} dès ${heure}, sans attente.`;
  });

  /**
   * Un abonnement suspendu coupe la page publique du commerce : son lien et
   * son QR code ne mènent plus à la carte. La décision se prend depuis
   * l'administration, jamais depuis l'espace du commerçant.
   */
  readonly accesActif = computed(() => this.commerce().abonnement.statut !== 'suspendu');

  private readonly origine = inject(DOCUMENT).defaultView?.location.origin ?? '';

  /**
   * L'adresse publique du commerce : celle du QR code posé sur le comptoir.
   * C'est l'URL qui identifie la boutique, d'où le multi-tenant par l'URL.
   */
  readonly lienPublic = computed(() => `${this.origine}/client/${this.commerce().id}`);

  lienPublicDe(commerceId: string): string {
    return `${this.origine}/client/${commerceId}`;
  }

  /** Appelé par la résolution de route, à chaque entrée dans un espace. */
  definirCommerce(id: string): void {
    if (id in COMMERCES) {
      this.identifiant.set(id);
    }
  }

  /** Le commerce tel qu'il est réglé, sans changer le commerce courant. */
  commerceDe(id: string): Commerce | undefined {
    const base = COMMERCES[id];
    return base ? this.appliquer(base, this.reglages()[id] ?? {}) : undefined;
  }

  majInfos(infos: { nom: string; accroche: string; adresse: string }): void {
    this.changer({ ...infos });
  }

  majProduit(produitId: string, valeurs: { nom: string; prixCentimes: number }): void {
    const courantes = this.modificationsCourantes();
    const produits = { ...(courantes.produits ?? {}) };
    produits[produitId] = valeurs;
    this.changer({ produits });
  }

  /**
   * Les couleurs sont réglées depuis l'administration, pas par le commerçant :
   * elles font partie de la mise en place, et un contraste raté rend la page
   * illisible pour ses clients.
   */
  majCouleursDe(commerceId: string, couleurs: CouleursCommerce): void {
    this.changer({ couleurs }, commerceId);
  }

  /** L'abonnement se gère depuis l'administration, jamais par le commerçant. */
  majAbonnementDe(commerceId: string, abonnement: Abonnement): void {
    this.changer({ abonnement }, commerceId);
  }

  reinitialiserCouleursDe(commerceId: string): void {
    const modifications = { ...(this.reglages()[commerceId] ?? {}) };
    delete modifications.couleurs;

    this.enregistrer({ ...this.reglages(), [commerceId]: modifications });
  }

  majHoraires(horaires: readonly HoraireJour[]): void {
    this.changer({ horaires: [...horaires] });
  }

  /** Le commerçant décide s'il propose la consommation sur place. */
  definirServiceSurPlace(serviceSurPlace: boolean): void {
    this.changer({ serviceSurPlace });
  }

  definirDisponibilite(accepteCommandes: boolean, message?: string): void {
    this.changer({
      accepteCommandes,
      ...(message === undefined ? {} : { messageIndisponible: message }),
    });
  }

  /** Revient à l'état du fichier de configuration, pour ce commerce seulement. */
  reinitialiser(): void {
    const suivants = { ...this.reglages() };
    delete suivants[this.identifiant()];
    this.enregistrer(suivants);
  }

  private modificationsCourantes(): ModificationsCommerce {
    return this.reglages()[this.identifiant()] ?? {};
  }

  private changer(partie: ModificationsCommerce, commerceId?: string): void {
    const id = commerceId ?? this.identifiant();
    this.enregistrer({
      ...this.reglages(),
      [id]: { ...(this.reglages()[id] ?? {}), ...partie },
    });
  }

  private enregistrer(reglages: Reglages): void {
    this.reglages.set(reglages);
    this.ecrire(reglages);
  }

  private appliquer(base: Commerce, modifications: ModificationsCommerce): Commerce {
    const parProduit = modifications.produits ?? {};

    return {
      ...base,
      nom: modifications.nom ?? base.nom,
      accroche: modifications.accroche ?? base.accroche,
      adresse: modifications.adresse ?? base.adresse,
      accepteCommandes: modifications.accepteCommandes ?? base.accepteCommandes,
      serviceSurPlace: modifications.serviceSurPlace ?? base.serviceSurPlace,
      messageIndisponible: modifications.messageIndisponible ?? base.messageIndisponible,
      couleurs: modifications.couleurs ?? base.couleurs,
      abonnement: modifications.abonnement ?? base.abonnement,
      horaires: modifications.horaires ?? base.horaires,
      produits: base.produits.map((produit) => {
        const change = parProduit[produit.id];
        if (!change) {
          return produit;
        }
        return {
          ...produit,
          nom: change.nom ?? produit.nom,
          prixCentimes: change.prixCentimes ?? produit.prixCentimes,
        };
      }),
    };
  }

  private lire(): Reglages {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      return brut ? (JSON.parse(brut) as Reglages) : {};
    } catch {
      // Navigation privée, stockage bloqué : on repart des fichiers.
      return {};
    }
  }

  private ecrire(reglages: Reglages): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(reglages));
    } catch {
      // Les réglages ne survivront pas au rechargement, sans conséquence ici.
    }
  }
}
