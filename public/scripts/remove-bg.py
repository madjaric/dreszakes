#!/usr/bin/env python3
"""
Uklanja belu/svetlu pozadinu sa svih dresova i čuva ih kao transparentni PNG.

Upotreba:
    pip install pillow numpy
    python3 scripts/remove-bg.py

Ulaz:  public/images/kits/*.jpg
Izlaz: public/images/kits/*.png  (transparentna pozadina, iste osnove imena)

Posle pokretanja, .jpg fajlovi se mogu obrisati (kitImages.js koristi .png).
Irak i Iran nemaju slike i koriste SVG placeholder — njih preskoči.
"""
import os
import glob
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

KITS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "kits")


def remove_white_bg(path):
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    r, g, b = arr[:, :, 0].astype(int), arr[:, :, 1].astype(int), arr[:, :, 2].astype(int)

    # Pozadina = vrlo svetlo + nisko zasićeno (skoro belo / neutralno sivo)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    is_bg = (mx > 225) & (sat < 22)

    # Flood-fill od ivica: uklanja samo POVEZANU pozadinu,
    # bela polja UNUTAR dresa (logo, pruge) ostaju netaknuta.
    bg = np.zeros((h, w), bool)
    visited = np.zeros((h, w), bool)
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg[y, x] and not visited[y, x]:
                dq.append((y, x)); visited[y, x] = True
    for y in range(h):
        for x in (0, w - 1):
            if is_bg[y, x] and not visited[y, x]:
                dq.append((y, x)); visited[y, x] = True
    while dq:
        y, x = dq.popleft()
        bg[y, x] = True
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_bg[ny, nx]:
                visited[ny, nx] = True
                dq.append((ny, nx))

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # Blago omekšaj ivice (anti-alias)
    a_im = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
    arr[:, :, 3] = np.array(a_im)

    out = Image.fromarray(arr, "RGBA")
    bbox = out.getbbox()          # iseci prazne margine
    if bbox:
        out = out.crop(bbox)
    return out


def main():
    jpgs = sorted(glob.glob(os.path.join(KITS_DIR, "*.jpg")))
    if not jpgs:
        print("Nema .jpg fajlova u", KITS_DIR)
        return
    for p in jpgs:
        name = os.path.splitext(os.path.basename(p))[0]
        out = remove_white_bg(p)
        dst = os.path.join(KITS_DIR, name + ".png")
        out.save(dst, optimize=True)
        print(f"  {name}.jpg -> {name}.png  ({out.size[0]}x{out.size[1]})")
    print(f"\nGotovo: {len(jpgs)} slika obrađeno.")
    print("Sada možeš obrisati .jpg fajlove (kitImages.js koristi .png).")


if __name__ == "__main__":
    main()
