# 🎵 Fond sonore — comment ajouter un son

Le lecteur du site lit la liste écrite dans **`assets/music/playlist.txt`**.
Il suffit donc d'y écrire le nom des fichiers, un par ligne.

## Ajouter un son (2 étapes)

1. **Déposer le fichier ici**
   - Sur GitHub : ouvre le dossier `assets/music` → bouton **Add file** → **Upload files** → dépose ton fichier → **Commit changes**.
   - Formats acceptés : `.mp3` (recommandé), `.m4a`, `.aac`, `.ogg`, `.wav`.
   - Évite les espaces et les accents dans le nom : `ambiance-nuit.mp3` plutôt que `Ambiance Nuit Édition.mp3`.

2. **Écrire le nom dans `playlist.txt`**
   - Ouvre `assets/music/playlist.txt` → crayon ✏️ → ajoute le nom **exact** du fichier sur une nouvelle ligne.
   - Un nom par ligne, avec l'extension : `ambiance-nuit.mp3`
   - Pas de chemin, pas de guillemets, pas de virgule.

```
ambiance-nuit.mp3
zen-2.mp3
https://exemple.com/son-externe.mp3
```

> Une adresse complète (`https://…`) fonctionne aussi : c'est pratique pour
> un son hébergé ailleurs, sans le stocker dans le dépôt.

## ⚠️ L'erreur à ne pas refaire

Les lignes qui commencent par `#` sont des **commentaires** : elles ne comptent pas.
Si le nom d'un fichier est écrit **sur** une ligne qui commence par `#`, le lecteur
l'ignore et le son n'apparaît pas dans la liste.

❌ Mauvais

```
#   2. petunias.mp3
```

✅ Bon — le nom est **seul sur sa ligne**, sous les explications

```
# Les sons enregistrés (un nom par ligne, ici en bas) :
petunias.mp3
```

## Retirer un son

- Efface simplement sa ligne dans `playlist.txt` (le fichier peut rester en place).
- Pour le supprimer aussi du dépôt : dossier `assets/music` → sélectionne le fichier → **Delete file**.

## Ordre d'affichage

L'ordre de la liste = l'ordre des lignes du fichier. Pour changer l'ordre,
monte ou descends les lignes. Des sons courts (1 à 3 min) passent au suivant
tout seuls, en boucle.

## Ouvrir le lecteur sur le site

Le lecteur est **caché** : aucun bouton visible pour les visiteurs.

**Un simple clic sur la mention du pied de page** (« © 2026 WINTERFELL38 🛍️ »),
tout en bas du site. Le même clic referme le lecteur.

> Le logo en haut à gauche, lui, ramène à l'accueil. Il ne sert plus à ouvrir
> le lecteur.

## Les réglages

- **▶ / ❙❙** : lancer ou mettre en pause.
- **Liste déroulante** : choisir le son.
- **🔊 / 🔇** : couper ou rétablir le son immédiatement.
- **Curseur 0 → 100 avec pourcentage** : régler le volume.

Le volume, le son choisi et l'état coupé sont **mémorisés** sur ton appareil.
Bouger le curseur rétablit le son tout seul si tu avais coupé : pas besoin de
chercher le bouton 🔊.

## Après un rafraîchissement de la page

Rien ne se lance automatiquement à l'ouverture du site : les navigateurs
interdisent le son sans un geste de la personne. Mais si la musique jouait
avant que tu rafraîchisses, elle **repart au premier appui** n'importe où sur
la page (menu, bouton, lien…) — tu n'as pas à rappuyer sur ▶.

## Le volume ne semble pas changer grand-chose

C'est presque toujours **le volume du téléphone**, qui multiplie celui du site :
s'il est à 20 %, monter le curseur de 35 % à 100 % s'entendra à peine.
Monte d'abord le son de l'appareil, puis règle le curseur.

## Si un son ne se lance pas

- Vérifie que le nom dans `playlist.txt` est **exactement** celui du fichier (majuscules, tirets, extension) et qu'il n'est pas sur une ligne `#`.
- Attends une minute après le commit : GitHub Pages met la mise à jour en ligne avec un léger délai.
- Force le rechargement sur ton téléphone (ferme l'onglet et rouvre le site).
