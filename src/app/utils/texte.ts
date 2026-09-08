/**
 * Met un texte à plat pour la recherche : minuscules, sans accents.
 * « Spécialités » et « specialites » doivent trouver la même chose.
 */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
