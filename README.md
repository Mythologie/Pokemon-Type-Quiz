# Quiz des types Pokémon

Ce projet est un petit jeu de quiz web basé sur les types Pokémon.

Le joueur voit une attaque et un type défendant, puis doit choisir le bon effet de cette attaque :

- Normal
- Très efficace
- Peu efficace
- Sans effet

Le but est de répondre correctement au plus grand nombre de questions possible.

## Ce que contient le projet

Le projet est composé de trois fichiers principaux :

- `index.html` : la structure de la page
- `styles.css` : le style visuel
- `app.js` : la logique du quiz

## Comment le quiz fonctionne

Le jeu s'appuie sur les règles de type de Pokémon.

Par exemple :

- Glace contre Dragon est très efficace
- Eau contre Feu est très efficace
- Plante contre Eau est très efficace
- Électrik contre Sol est sans effet

Ces règles sont enregistrées dans le code JavaScript.

## Fichier HTML

Le fichier `index.html` contient :

- le titre du quiz
- l'écran de configuration
- la zone de question
- les boutons de réponse
- l'écran final avec le score

C'est la structure de base de la page web.

## Fichier CSS

Le fichier `styles.css` donne le style visuel du site.

Il contrôle :

- les couleurs
- la taille des textes
- la disposition des blocs
- les boutons
- les états visuels comme le bon ou le mauvais choix

## Fichier JavaScript

Le fichier `app.js` est le cœur du jeu.

Il contient :

- la liste des types Pokémon
- les règles de force et de faiblesse
- les questions aléatoires
- la vérification des réponses
- le calcul du score
- le suivi des erreurs
- l'affichage des résultats

### Exemple simple de logique

Le code crée une table qui relie un type d'attaque à un type de défense.

Par exemple, une règle peut être écrite de cette façon :

```javascript
setEffectiveness("Ice", ["Dragon"], 2);
```

Cela signifie :

- l'attaque Glace
- contre le type Dragon
- est très efficace

## Le déroulement d'une partie

Une partie suit ce principe :

1. le joueur choisit le nombre de questions
2. le jeu choisit une question au hasard
3. le joueur choisit la bonne réponse
4. le score est mis à jour
5. la question suivante apparaît
6. à la fin, le score total et le récapitulatif des erreurs sont affichés

## Les réponses possibles

Pour chaque question, le joueur a quatre choix :

- Normal
- Très efficace
- Peu efficace
- Sans effet

La bonne réponse dépend des règles de type entre l'attaque et la défense.

## Le score

Le score augmente à chaque bonne réponse.

À la fin de la partie, le jeu affiche :

- le nombre de bonnes réponses
- le nombre total de questions
- un écran de fin
- chaque question à laquelle le joueur a répondu incorrectement
- la réponse choisie par le joueur pour chaque erreur
- la solution correcte pour chaque erreur

Les erreurs sont présentées sous forme de cartes colorées. La réponse du
joueur apparaît en rouge et la solution apparaît en vert. Les types Pokémon
affichés dans chaque question utilisent aussi leur couleur correspondante.

## Un projet simple à comprendre

Ce projet est abordable pour un débutant car il est séparé en parties claires :

- HTML pour la structure
- CSS pour le style
- JavaScript pour la logique

Cela permet de voir comment un petit site web peut fonctionner sans être trop compliqué.

## Fichiers du projet

- [index.html](index.html)
- [styles.css](styles.css)
- [app.js](app.js)

## Objectif du projet

Le but principal de ce projet est de présenter un quiz Pokémon basé sur les attaques et leurs efficacités, de façon simple et visuelle.

Il est conçu comme une petite application web pédagogique, facile à lire et à comprendre pour quelqu'un qui découvre le développement web.
