# Quiz des types Pokemon

Un petit quiz en ligne de commande ecrit en Python. Le joueur doit reconnaitre l'efficacite d'une attaque contre un type Pokemon :

```text
Glace attaque Acier, est-ce :
1 - Normal
2 - Tres efficace
3 - Peu efficace
4 - Sans effet
```

Le projet est volontairement simple et tient principalement dans [Main.py](Main.py), afin d'etre accessible a une personne qui debute en Python.

## Version web

Le quiz existe aussi en version web responsive :

- `index.html` contient la structure de la page.
- `styles.css` gere la mise en page PC/mobile, les couleurs et les animations.
- `app.js` contient les regles du tableau et le fonctionnement du quiz.

Pour l'ouvrir rapidement, double-cliquez sur `index.html`. Pour lancer un petit serveur local dans PowerShell :

```powershell
cd C:\Users\Eliot\Documents\PokemonTypeQuizz
py -m http.server 8000
```

Ouvrez ensuite [http://localhost:8000](http://localhost:8000) dans votre navigateur. Le serveur peut etre arrete avec `Ctrl+C`.

## 1. Prerequis

Il faut installer Python 3. Vous pouvez verifier l'installation dans PowerShell :

```powershell
py --version
```

Si la commande affiche une version, Python est disponible.

## 2. Lancer le quiz

Ouvrez PowerShell dans le dossier du projet :

```powershell
cd C:\Users\Eliot\Documents\PokemonTypeQuizz
py Main.py
```

Le programme demande :

1. Le tableau des types a utiliser : generations 2 a 5, ou generation 6 et suivantes.
2. Le nombre de questions, entre 1 et 50.
3. Une reponse de 1 a 4 pour chaque question.
4. Si vous voulez rejouer avec `o` pour oui ou `n` pour non.

## 3. Organisation du fichier

### Les imports

```python
import random
import sys
```

- `random` permet de melanger les questions.
- `sys` permet de savoir si le programme est execute dans un vrai terminal.

### Les constantes

Une constante est une valeur que le programme ne modifie pas pendant son execution. Par convention, son nom est ecrit en majuscules.

- `OLDER_TYPES` contient les types disponibles des generations 2 a 5.
- `NEWER_TYPES` reprend ces types et ajoute `Fairy`.
- `ANSWER_LABELS` transforme un multiplicateur numerique en reponse interne.
- `TYPE_NAMES_FR` traduit les noms internes anglais vers les noms affiches en francais.
- `COLORS` contient les couleurs generales de l'interface.
- `TYPE_COLORS` contient une couleur differente pour chaque type.

Les noms internes restent en anglais dans le code pour garder les regles faciles a comparer. L'utilisateur voit les traductions francaises.

## 4. Les couleurs du terminal

Les couleurs sont des codes ANSI, par exemple `\\033[92m` pour le vert.

```python
USE_COLORS = sys.stdout.isatty()
```

`sys.stdout.isatty()` renvoie `True` si le programme ecrit dans un terminal interactif. Dans ce cas, les couleurs sont activees. Si la sortie est redirigee dans un fichier, les couleurs sont desactivees pour eviter d'ecrire des codes inutiles dans le fichier.

La fonction `colorize()` ajoute une couleur aux textes generaux. La fonction `colorize_type()` fait deux choses : elle traduit le nom du type, puis lui applique sa couleur.

## 5. Le tableau d'efficacite

La fonction `build_chart()` construit un dictionnaire a deux niveaux :

```python
chart[attaque][defenseur] = multiplicateur
```

Exemple :

```python
chart["Ice"]["Dragon"] == 2.0
```

Cela signifie qu'une attaque Glace est tres efficace contre un Pokemon Dragon.

Les multiplicateurs possibles sont :

| Multiplicateur | Signification |
| --- | --- |
| `2.0` | Tres efficace |
| `1.0` | Normal |
| `0.5` | Peu efficace |
| `0.0` | Sans effet |

La fonction `set_effectiveness()` evite de repeter la meme instruction pour plusieurs types defenseurs.

## 6. Le deroulement d'une partie

### `choose_generation()`

Affiche les deux versions du tableau et recommence la question tant que la saisie n'est pas `1` ou `2`.

### `choose_question_count()`

Lit le nombre de questions. Une boucle `while True` permet de redemander une valeur tant que celle-ci n'est pas un nombre entre 1 et 50. Si le joueur appuie directement sur Entree, la valeur par defaut est 10.

### `run_quiz()`

1. Construit tous les couples attaque/defenseur possibles.
2. Melange ces couples avec `random.shuffle()`.
3. Affiche le nombre de questions demande.
4. Compare la reponse du joueur a la bonne reponse.
5. Augmente `score` lorsqu'elle est correcte.
6. Affiche le score final.

Cette ligne utilise une comprehension de liste :

```python
pairs = [(attack, defender) for attack in chart for defender in chart]
```

Elle signifie : pour chaque type d'attaque, creer un couple avec chaque type defenseur.

### `main()`

C'est le point de depart du programme. Le bloc suivant lance `main()` uniquement lorsque `Main.py` est execute directement :

```python
if __name__ == "__main__":
    main()
```

Cette protection permet aussi d'importer les fonctions dans un autre fichier sans lancer automatiquement le quiz.

## 7. Creer un fichier executable `.exe`

Installez PyInstaller une seule fois :

```powershell
py -m pip install pyinstaller
```

Puis construisez l'executable depuis le dossier du projet :

```powershell
cd C:\Users\Eliot\Documents\PokemonTypeQuizz
py -m PyInstaller --onefile --name PokemonTypeQuiz Main.py
```

Le fichier sera cree ici :

```text
dist\PokemonTypeQuiz.exe
```

`--onefile` demande a PyInstaller de produire un seul fichier executable. Fermez l'ancien `.exe` avant de le reconstruire s'il est encore ouvert.

## 8. Modifier le quiz

Quelques modifications faciles pour s'exercer :

- Changer le nombre maximum de questions dans `choose_question_count()`.
- Modifier un texte affiche par `print()`.
- Changer une couleur dans `COLORS` ou `TYPE_COLORS`.
- Ajouter une nouvelle regle avec `set_effectiveness()`.
- Ajouter une statistique, comme le pourcentage de bonnes reponses.
- Ajouter un mode d'entrainement qui affiche la bonne reponse sans compter le score.

Apres chaque modification, verifiez la syntaxe :

```powershell
py -m py_compile Main.py
```

Puis relancez le programme pour tester le comportement.
