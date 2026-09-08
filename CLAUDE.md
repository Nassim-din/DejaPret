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
- Premières visites de boulangeries faites : retours positifs, **aucun chiffre obtenu**
- **Zéro client payant. Rien n'est validé commercialement.**

---

## 7. Phase actuelle — on construit le produit

Décision prise : on ne construit plus une démo de vente, on construit la V1.
Cette section remplace l'ancienne consigne « périmètre serré, tout sert la vente ».

Le fait qu'il n'y ait **aucun client payant** reste vrai et reste un risque : le produit
se construit sans validation commerciale. Ce n'est pas une raison pour bâcler, c'en est
une pour ne pas partir dans des fonctionnalités que personne n'a demandées.

### Ce qui existe (front-end Angular)

- **Client** : carte du commerce, recherche et filtres par rayon, formules composées
  étape par étape, choix du créneau, coordonnées, confirmation avec code à 4 chiffres.
- **Commerçant** : commandes du jour (recherche, filtres, changement de statut avec
  confirmation), tableau de bord, paramètres (infos, prix et noms de produits, horaires
  jour par jour, couleurs, suspension des commandes).
- **Admin** : commerces équipés, abonnements, volume traité.

### Ce qui manque, et qui est bloquant

Ces points séparent « le front-end du produit » du produit :

1. **Pas d'API ni de base de données.** Les commandes vivent en mémoire (un
   rafraîchissement les perd), les réglages du commerçant dans le `localStorage` d'un
   seul appareil. C'est le prochain chantier, avant toute nouvelle fonctionnalité d'écran.
2. **Pas d'authentification.** `/commercant/...` et `/admin` sont ouverts à qui a l'URL.
3. **Pas de Stripe Connect.** Rien n'est encaissé. Les champs de carte sont décoratifs
   et le signalent à l'écran.
4. **RGPD non traité.** Pas de durée de conservation ni de purge des numéros de téléphone.

### Règles qui tiennent toujours

- Le multi-tenant reste la contrainte n°1 (voir section 5). Le commerce est identifié
  par l'URL et résolu en **un seul endroit** : `CommerceService`. Aucun composant
  n'importe un commerce en dur.
- Ne pas inventer de données présentées comme réelles. L'espace admin affiche ce que
  l'application sait réellement et signale explicitement ce qui demande l'API, plutôt
  que d'afficher des chiffres d'audience fabriqués.
- Périmètre avant élégance. Une demande qui n'est ni dans le produit décrit en
  section 2 ni dans les manques bloquants ci-dessus mérite une objection avant du code.

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

- TypeScript strict activé
- Angular 18, composants **standalone**, `ChangeDetectionStrategy.OnPush`, signaux
  (`signal`, `computed`, `input()`, `output()`) — pas de NgModule
- Un commerce = un fichier dans `src/app/merchants/`, déclaré dans `index.ts`
- Nommage des fichiers en kebab-case, code et commentaires en français
- Commits en français, format court : `feat: …`, `fix: …`, `chore: …`
- Pas de secrets dans le dépôt (clés Stripe, identifiants SMS) — variables d'environnement
- Textes de l'interface en français, prévoir la sortie des chaînes en dur dès le début
