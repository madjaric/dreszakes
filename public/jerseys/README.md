# Jersey Images

Drop your **own licensed** product photos here. The app loads them automatically — no code changes needed.

## Naming convention

Each country folder expects up to 3 images per kit:

```
public/jerseys/<country>/
  home-1.jpg   home-2.jpg   home-3.jpg
  away-1.jpg   away-2.jpg   away-3.jpg
```

Example for Argentina:

```
public/jerseys/argentina/home-1.jpg
public/jerseys/argentina/home-2.jpg
public/jerseys/argentina/home-3.jpg
public/jerseys/argentina/away-1.jpg
public/jerseys/argentina/away-2.jpg
public/jerseys/argentina/away-3.jpg
```

## Country folder IDs

argentina, brazil, portugal, france, engleska, nemacka, spanija, hrvatska,
srbija, holandija, belgija, meksiko, japan, maroko, sad, kanada, italija,
kolumbija, urugvaj, ekvador, paragvaj, juznakoreja, australija, iran,
saudijska (Saudijska Arabija), japan2 (Katar), maroko2 (Senegal), gana,
obala (Obala Slonovače), egipat, alzir, juznaafrika, tunis, norveska,
svajcarska, skotska, austrija, ceska, novizeland, uzbekistan, jordan,
kapeverde (Zelenortska Ostrva)

## Missing images

If a file is missing, a premium colored SVG jersey placeholder is shown in its
place (matched to each team's colors). Add the real `.jpg` and it replaces the
placeholder on next load.

## Recommended specs

- Format: `.jpg` (or `.webp` — update paths in `src/products.js` if so)
- Size: ~1000×1000px, square
- Optimize before upload (e.g. squoosh.app) to keep the site fast.
