# 🎨 Changer les couleurs du site — mode d'emploi

Toutes les couleurs du site viennent d'**un seul fichier** : `theme.js`.
Tu changes une ligne, tout le site suit.

---

## Changer de palette (le cas courant)

1. Ouvre `theme.js` sur GitHub (crayon ✏️ pour modifier).
2. Repère la **ligne 12** :

```js
const ACTIVE_THEME = "neonNuit";
```

3. Remplace `neonNuit` par le nom de la palette voulue.
4. **Commit changes**.
5. Attends une minute (GitHub Pages met en ligne), puis ferme et rouvre le site sur ton téléphone.

> ⚠️ Le nom doit être écrit **exactement** comme dans la liste, sans espace :
> `"synthwave"` et non `"Synthwave "`.

---

## Les palettes disponibles

Copie le nom tel quel entre les guillemets de `ACTIVE_THEME`.

### Néon / sombre

| Nom | Couleurs |
|---|---|
| `neonNuit` | violet électrique, rose, orange ← **actuelle** |
| `neonMagenta` | magenta, violet, turquoise |
| `acidLime` | vert acide, vert menthe, rose |
| `ultraviolence` | violet profond, cyan, rose vif |
| `synthwave` | rose années 80, violet, cyan |
| `vaporWave` | rose bonbon, lavande, menthe |
| `neonBlood` | rouge vif, orange, jaune |
| `electricBlue` | bleu électrique, cyan, magenta |
| `neonMandarin` | orange mandarine, jaune, cyan |
| `iceNeon` | bleu glacier, violet, rose |
| `neonJungle` | vert tropical, citron vert, rose |
| `toxicGreen` | vert fluo, citron vert, jaune |
| `royalPurple` | violet royal, rose, jaune |
| `neonCyan` | cyan, violet, rose |
| `hotCoral` | corail, orange, jaune |
| `bubblegum` | rose bubblegum, orange, jaune |
| `sunsetMiami` | orange, rose, turquoise |
| `sunsetGold` | orange, cuivre, jaune |
| `miami` | rose Miami, bleu, turquoise |
| `neonSunset` | rose, orange, jaune |

### Foncées et classiques

| Nom | Couleurs |
|---|---|
| `cyberpunk` | jaune, rouge, cyan |
| `electricViolet` | violet, fuchsia, bleu |
| `midnightBlue` | bleu nuit, jaune |
| `oceanDeep` | bleu océan |
| `royalGold` | or, bronze |
| `emerald` | vert émeraude, jaune |
| `lavaFire` | rouge lave, orange |
| `aurora` | vert, violet, rose |
| `rainbow` | arc-en-ciel complet |
| `tropical` | vert tropical, corail, jaune |
| `tropicalNeon` | vert néon, bleu, rose |

### Claires

| Nom | Couleurs |
|---|---|
| `candyPop` | rose bonbon, violet, bleu ciel |
| `mintFresh` | menthe, rose, jaune |
| `peachy` | pêche, corail, lavande |
| `sakura` | rose sakura |

### À toi

| Nom | Couleurs |
|---|---|
| `custom` | à remplir toi-même (voir plus bas) |

---

## Ce que fait chaque couleur

Aucune autre ligne à toucher : le halo, les bordures et le mode clair/sombre
se **recalculent automatiquement** à partir de ces six valeurs.

| Champ | Rôle sur le site |
|---|---|
| `bg` | fond de page |
| `surface` | fond des cartes, du menu, des fenêtres |
| `text` | texte principal |
| `muted` | texte secondaire (descriptions, notes) |
| `primary` | boutons, titre « Menu », accents |
| `secondary` | prix, étoiles, survols |
| `accent` | liens, petites étiquettes, catégories |
| `gradient` | dégradé des boutons et des titres |

---

## Créer ta propre palette

Méthode la plus simple : **copier une palette existante et la renommer**.

1. Dans `theme.js`, trouve le bloc `custom:` tout en bas.
2. Remplace ses couleurs par les tiennes :

```js
custom: { bg:"#101010", surface:"#1c1c1c", text:"#ffffff", muted:"#aaaaaa", primary:"#ff00aa", secondary:"#00ffaa", accent:"#ffaa00", gradient:"linear-gradient(135deg,#ff00aa,#00ffaa)" }
```

3. Mets `ACTIVE_THEME = "custom"` en haut du fichier.

Tu peux aussi **ajouter** une palette au lieu d'écraser `custom` : copie une
ligne existante, colle-la juste en dessous, et donne-lui un nouveau nom.

> Les codes couleur s'écrivent en **hexadécimal**, entre guillemets, avec le `#` :
> `#ff00aa`, `#000000`, `#ffffff`.
> Un sélecteur de couleur gratuit : https://htmlcolorcodes.com/fr/

---

## Conseils

- **Garde du contraste** : le texte (`text`) doit rester très clair si le fond (`bg`) est sombre, et inversement.
- **Ne renomme pas** `ACTIVE_THEME`, `THEMES` ni les champs (`bg`, `primary`…) : le site ne les trouverait plus.
- Si le site s'affiche **tout blanc** ou **sans style** après une modification,
c'est qu'il manque une virgule ou un guillemet : repasse par l'onglet
**Commits** et annule la modification.
- Une seule palette est active à la fois. Les visiteurs n'ont aucun bouton
pour changer les couleurs : toi seul peux le faire depuis ce fichier.

---

## En cas de doute

Dans l'onglet **Commits** du dépôt, clique sur le commit qui a cassé quelque
chose, puis sur **Revert**. Le fichier revient à son état précédent.
