# Quiz des types Pokémon

Ce projet est un petit jeu web dans lequel tu dois choisir la bonne efficacité d'une attaque Pokémon.

Exemple :

```text
Glace attaque Dragon
Quel est le bon verdict ?
```

Tu as 4 choix :

- Normal
- Très efficace
- Peu efficace
- Sans effet

Le but est simple : répondre vite et juste, puis finir le quiz avec le meilleur score possible.

Ce projet est pensé pour être très accessible, même si tu n'as jamais fait de Python, HTML, CSS ou JavaScript.

## Ce que tu peux faire avec ce projet

- Jouer directement dans le navigateur
- Comprendre les bases du développement web
- Modifier le jeu pour l'améliorer
- Apprendre à lire un code de projet simple

## Prérequis

Tu n'as pas besoin d'installer beaucoup de choses.

Il te faut juste :

- Un navigateur web moderne (Chrome, Edge, Firefox, etc.)
- Un fichier du projet sur ton ordinateur

Optionnel :

- VS Code pour ouvrir les fichiers plus facilement
- Une extension de serveur local si tu veux lancer le projet avec un mini serveur

## Lancer le jeu

### Option 1 : ouvrir directement le fichier HTML

Tu peux simplement double-cliquer sur le fichier `index.html`.

Ça ouvre la page dans ton navigateur et le jeu est prêt à jouer.

### Option 2 : lancer un petit serveur local

Dans PowerShell, va dans le dossier du projet puis lance :

```powershell
cd C:\chemin\vers\ton\dossier
py -m http.server 8000
```

Ensuite ouvre dans ton navigateur :

```text
http://localhost:8000
```

Si `py` ne fonctionne pas, essaie `python` à la place :

```powershell
python -m http.server 8000
```

## Structure du projet

Voici à quoi sert chaque fichier :

- `index.html` : la structure de la page web
- `styles.css` : le design, les couleurs, les boutons, le layout
- `app.js` : la logique du jeu, les règles de types et le score

### En français simple :

- HTML = la base de la page
- CSS = ce qui donne du style
- JavaScript = ce qui rend la page interactive

Tu n'as pas besoin de tout comprendre d'un coup. L'important est de voir qu'un projet web est souvent séparé en 3 morceaux :

1. le contenu
2. le visuel
3. le comportement

## Comment fonctionne le jeu

Le jeu utilise un "tableau d'efficacité" de Pokémon.

Chaque type a un effet sur les autres types :

- très efficace
- normal
- peu efficace
- sans effet

Dans le code, ça ressemble à quelque chose comme :

```javascript
chart["Ice"]["Dragon"] = 2;
```

Cela veut dire :

- Glace attaque Dragon
- et c'est très efficace

Le fichier `app.js` contient :

- les types Pokémon
- les règles de bonus/malus
- les questions aléatoires
- le calcul du score
- la gestion de l'affichage final

## Comment modifier le jeu

Tu peux commencer par de petites changements simples.

### 1. Changer le texte

Ouvre `index.html` ou `app.js` et modifie les textes affichés à l'écran.

Par exemple :

- remplacer "Très efficace" par "Super efficace"
- changer "Question 01 / 10" en quelque chose de ton goût
- modifier le message final

### 2. Changer les couleurs

Ouvre `styles.css` et change les couleurs.

Tu peux tester des choses comme :

- fond plus sombre
- boutons rouges ou violets
- texte plus grand

### 3. Modifier les règles

Dans `app.js`, la fonction `buildChart()` contient les règles de combat.

C'est ici que sont définis les bonus et malus entre les types.

Si tu veux ajouter une règle ou corriger une règle, c'est là qu'il faut regarder.

### 4. Modifier le nombre de questions

Le jeu limite le nombre de questions, mais tu peux le changer dans `app.js`.

Le code vérifie souvent une valeur comme :

```javascript
Math.min(50, Math.max(1, ...))
```

Ça veut dire :

- minimum 1 question
- maximum 50 questions
- sinon, on prend une valeur sûre

## Ce que tu peux apprendre en lisant le code

Même si tu es débutant, tu peux déjà comprendre une partie du projet.

### Les variables

```javascript
let score = 0;
```

Une variable sert à stocker une valeur. Ici, le score du joueur.

### Les fonctions

```javascript
function startQuiz() {
  // logique de démarrage
}
```

Une fonction, c'est un petit bloc de code qui fait une action précise.

### Les tableaux

```javascript
const OLDER_TYPES = ["Normal", "Fire", "Water", "Electric"];
```

Un tableau est une liste de valeurs.

### Les objets

```javascript
const TYPE_NAMES = {
  Normal: "Normal",
  Fire: "Feu"
};
```

Un objet associe une clé à une valeur. Ici, le type anglais est associé à son nom français.

## Tester le projet

Quand tu modifies quelque chose :

1. ouvre `index.html` dans le navigateur
2. ou recharge la page si tu utilises un serveur local
3. vérifie que le jeu fonctionne encore

Pour un jeu simple, il vaut mieux faire de très petits changements et tester souvent.

## Astuces pour bien commencer

Si tu veux apprendre sans te perdre :

- commence par lire `index.html`
- puis `styles.css`
- puis `app.js`
- essaie un changement facile, comme un mot ou une couleur
- recharge la page et vérifie le résultat

C'est souvent comme ça qu'on apprend en développement :

- petit changement
- test
- correction
- repetition

## Idée de progression

Voici quelques améliorations faciles à essayer :

- ajouter un compteur de bonnes réponses
- afficher un message plus détaillé à la fin
- ajouter un mode "entrainement"
- changer le thème visuel du jeu
- ajouter de la musique ou un son simple

## Résumé

Ce projet est une bonne petite introduction au développement web parce qu'il est :

- simple
- visible immédiatement
- modifiable facilement
- parfait pour apprendre sans beaucoup de dépendances

Tu n'as pas besoin de tout maîtriser pour commencer : il suffit de comprendre le but et de faire une petite modification à la fois.

## Fichiers importants

- [index.html](index.html)
- [styles.css](styles.css)
- [app.js](app.js)

Si tu veux, je peux aussi te faire une version encore plus simple de ce README, avec :

- une explication étape par étape du code
- une liste de mini défis pour débutant
- une version 100 % en français très pédagogique
