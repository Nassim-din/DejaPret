import { HoraireJour, JOURS_SEMAINE, JourSemaine } from '../models/commerce.model';

const FORMAT_JOUR_COURT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const FORMAT_MOIS_COURT = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const FORMAT_COMPLET = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

/** Date du jour au format ISO « 2026-09-07 », dans le fuseau local. */
export function isoLocal(date: Date): string {
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mois}-${jour}`;
}

export function depuisIso(iso: string): Date {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return new Date(annee, mois - 1, jour);
}

export function jourSemaineDe(date: Date): JourSemaine {
  return JOURS_SEMAINE[(date.getDay() + 6) % 7];
}

/** Une case du calendrier de retrait. */
export interface JourCalendrier {
  readonly iso: string;
  /** « lun. », « mar. »… */
  readonly abrege: string;
  readonly numero: number;
  /** « sept. » — affiché seulement au changement de mois. */
  readonly mois: string;
  readonly ouvert: boolean;
  readonly aujourdhui: boolean;
}

/**
 * Les prochains jours de retrait, en tenant compte des jours de fermeture.
 * On propose un vrai calendrier plutôt que « aujourd'hui / demain » : un
 * client peut vouloir commander pour la fin de semaine.
 */
export function calendrier(
  horaires: readonly HoraireJour[],
  nombreDeJours = 14,
): JourCalendrier[] {
  const debut = new Date();
  debut.setHours(0, 0, 0, 0);

  return Array.from({ length: nombreDeJours }, (_, decalage) => {
    const date = new Date(debut);
    date.setDate(debut.getDate() + decalage);

    const jour = jourSemaineDe(date);
    const horaire = horaires.find((item) => item.jour === jour);

    return {
      iso: isoLocal(date),
      abrege: FORMAT_JOUR_COURT.format(date).replace('.', ''),
      numero: date.getDate(),
      mois: FORMAT_MOIS_COURT.format(date).replace('.', ''),
      ouvert: horaire?.ouvert ?? true,
      aujourdhui: decalage === 0,
    };
  });
}

/** « 06:30 » devient « 6h30 », « 19:00 » devient « 19h ». */
export function formatHeure(heure: string): string {
  const [heures, minutes] = heure.split(':');
  const h = Number(heures);
  return minutes === '00' ? `${h}h` : `${h}h${minutes}`;
}

/** Le prochain jour d'ouverture, aujourd'hui compris. */
export function prochaineOuverture(
  horaires: readonly HoraireJour[],
  nombreDeJours = 14,
): { iso: string; horaire: HoraireJour } | null {
  for (const jour of calendrier(horaires, nombreDeJours)) {
    const horaire = horaires.find((item) => item.jour === jourSemaineDe(depuisIso(jour.iso)));
    if (horaire?.ouvert) {
      return { iso: jour.iso, horaire };
    }
  }
  return null;
}

/** « aujourd'hui », « demain », sinon « jeudi 10 septembre ». */
export function libelleDate(iso: string | null): string {
  if (!iso) {
    return '';
  }

  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  const demain = new Date(aujourdhui);
  demain.setDate(aujourdhui.getDate() + 1);

  if (iso === isoLocal(aujourdhui)) {
    return 'aujourd’hui';
  }
  if (iso === isoLocal(demain)) {
    return 'demain';
  }
  return FORMAT_COMPLET.format(depuisIso(iso));
}
