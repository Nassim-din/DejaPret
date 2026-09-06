# Déjà Prêt

Brief projet. À lire en entier au début de chaque session avant de proposer quoi que ce soit.

---

## 1. Le projet

**Déjà Prêt** — « Commandez à l'avance, ne faites plus la queue. »

Une application auto-hébergée qui donne à chaque commerçant alimentaire sa propre page de
commande, à sa marque. Rien n'est installé sur le site du commerçant, rien n'est branché sur
sa caisse.

Porté seul par Nassim (développeur front-end Angular/TypeScript, auto-entrepreneur).
Démarchage en porte-à-porte à Marseille.

---

## 2. Le produit

### Parcours client

1. QR code sur le comptoir
2. Page web dans le navigateur, **sans installation, sans création de compte**
3. Choix des produits, choix du créneau de retrait
4. Prénom + numéro de téléphone
5. Paiement par carte
6. SMS avec un code à 4 chiffres
7. Retrait au comptoir sans faire la queue

### Parcours commerçant

- Notification à chaque commande
- Page web des commandes du jour, triées par heure de retrait
- Récapitulatif chaque soir de ce qui est déjà vendu pour le lendemain
- Tableau de bord simple : commandes, clients réguliers, totaux

---

## 3. Hors périmètre V1 — décisions prises, ne pas les rouvrir

Ne propose pas ces fonctionnalités, ne les suggère pas « pour plus tard dans le code »,
ne prévois pas d'abstraction pour les accueillir :

- ❌ **Stock en temps réel** — la réservation le remplace
- ❌ **Caisse enregistreuse** — certification NF525, hors sujet
- ❌ **Livraison**
- ❌ **Application à télécharger** — c'est du web, point
- ❌ **Compte client obligatoire** — prénom + numéro suffisent
- ❌ **Système de notation / réputation** — le paiement à l'avance règle le problème

V2 **envisagée** (pas maintenant) : une plateforme regroupant tous les commerces équipés,
affichés par proximité géographique. Ne pas construire pour ça aujourd'hui, mais ne pas
rendre impossible non plus (voir multi-tenant ci-dessous).

---

## 4. Cible et modèle économique

- **Segments** : boulangeries d'abord, puis snacks, bouchers, traiteurs
- **Prix** : 300 € de mise en place, puis 29 €/mois. **Aucune commission.**
- **Argument face aux plateformes** : « Uber vous prend 30 % sur vos propres clients et
  garde leur contact. Moi c'est 29 €/mois, vos clients restent les vôtres. »

---

## 5. Technique

### Stack

- Front : **Angular + TypeScript**
- Back : une API
- Base de données : **une seule base, multi-commerces**
- Paiement : **Stripe Connect**, le commerçant est bénéficiaire direct

### Décisions d'architecture non négociables

**Multi-tenant dès la première ligne.** Chaque table porte un identifiant de commerce
(`merchant_id`) dès le départ, y compris les tables où ça semble inutile aujourd'hui.
Toute requête est filtrée par tenant. Aucune fonctionnalité ne doit supposer un commerce
unique. Rétrofitter le multi-tenant plus tard = réécriture.

**Stripe Connect, jamais de détention de fonds.** Les paiements vont directement au
commerçant. Nassim ne détient à aucun moment l'argent des commerçants ni celui des
clients finaux — c'est ce qui évite un statut d'établissement de paiement. Toute
proposition qui ferait transiter les fonds par un compte de la plateforme est à refuser
et à signaler.

**RGPD.** On collecte prénom + numéro de téléphone de clients finaux. Prévoir : politique
de confidentialité, durée de conservation définie, purge automatique, et le commerçant
comme responsable de traitement (Déjà Prêt = sous-traitant). Ne pas logger de numéros de
téléphone en clair.

---

## 6. État actuel (septembre 2026)

- Nom retenu : **Déjà Prêt**
- Domaines : `dejapret.fr` est pris (parqué, expire le 10/10/2026) ; `deja-pret.fr` est
  disponible. Marque à vérifier à l'INPI.
- Démo cliquable réalisée (parcours client + commerçant, données d'exemple)
- Premières visites de boulangeries faites : retours positifs, **aucun chiffre obtenu**
- **Zéro client payant. Rien n'est validé.**

---

## 7. Priorité actuelle — périmètre serré

L'objectif n'est pas de finir le produit. L'objectif est de **décrocher un premier
commerçant payant**. Tout le code écrit maintenant sert la vente, pas la production.

### Ce qu'on construit maintenant

**Un générateur de démo personnalisée par commerce.** Un fichier de configuration par
commerçant (nom, logo, couleurs, 6 produits avec prix, horaires, créneaux) produit une
page de commande à sa marque, montrable sur téléphone pendant la visite.

Critères :
- Créer une nouvelle démo doit prendre **moins de 5 minutes** (éditer un fichier, rien d'autre)
- Doit être parfaite sur mobile — c'est un téléphone tendu par-dessus un comptoir
- Aucune dépendance à un backend, à Stripe ou à l'envoi de SMS : les étapes de paiement
  et de confirmation sont simulées
- Doit se charger vite sur un réseau mobile moyen dans une boutique

### Ce qu'on ne construit PAS maintenant

Pas de Stripe en production, pas d'envoi réel de SMS, pas d'authentification commerçant,
pas de back-office complet, pas de CI/CD élaboré, pas de tests exhaustifs sur du code
qui sera jeté. Tout ça vient **après** qu'un commerçant a payé — et sera construit pour
lui.

Si une demande dérive vers la V1 complète, dis-le au lieu de l'implémenter.

---

## 8. Comment travailler avec moi

- **Sois direct.** Dis-moi quand je me trompe et pourquoi.
- **Ne valide pas une idée juste parce qu'elle vient de moi.**
- **Donne-moi toujours l'objection la plus forte avant les arguments favorables.**
- Signale-moi quand je suis en train de construire au lieu de vendre. C'est mon biais
  principal : je suis développeur, coder est ma zone de confort, démarcher ne l'est pas.
- Périmètre avant élégance. Je préfère un truc simple livré aujourd'hui qu'une belle
  architecture la semaine prochaine.

---

## 9. Conventions de code

> À compléter/corriger selon ce qui existe réellement dans le dépôt.

- TypeScript strict activé
- Composants Angular standalone, pas de NgModule sauf nécessité
- Nommage des fichiers en kebab-case
- Commits en français, format court : `feat: …`, `fix: …`, `chore: …`
- Pas de secrets dans le dépôt (clés Stripe, identifiants SMS) — variables d'environnement
- Textes de l'interface en français, prévoir la sortie des chaînes en dur dès le début
