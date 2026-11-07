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

## Retirer un son

- Efface simplement sa ligne dans `playlist.txt` (le fichier peut rester en place).
- Pour le supprimer aussi du dépôt : dossier `assets/music` → sélectionne le fichier → **Delete file**.

## Ordre d'affichage

L'ordre de la liste = l'ordre des lignes du fichier. Pour changer l'ordre,
monte ou descends les lignes. Des sons courts (1 à 3 min) passent au suivant
tout seuls, en boucle.

## Ouvrir le lecteur sur le site

Le lecteur est **caché** : aucun bouton visible pour les visiteurs.

**Appui long (1,2 s) sur le logo de la boutique**, en haut à gauche.
Le même geste referme le lecteur.

## Les réglages

- **▶ / ❙❙** : lancer ou mettre en pause.
- **Liste déroulante** : choisir le son.
- **🔊 / 🔇** : couper ou rétablir le son immédiatement.
- **Curseur + pourcentage** : régler le volume.

Le volume, le son choisi et l'état coupé sont **mémorisés** sur ton appareil.
Rien ne se lance automatiquement à l'ouverture du site : la lecture démarre
quand on appuie sur ▶.

## Si un son ne se lance pas

- Vérifie que le nom dans `playlist.txt` est **exactement** celui du fichier (majuscules, tirets, extension).
- Attends une minute après le commit : GitHub Pages met la mise à jour en ligne avec un léger délai.
- Sur mobile, appuie d'abord quelque part sur la page, puis sur ▶.
