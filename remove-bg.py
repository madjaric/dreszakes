#!/usr/bin/env python3
"""
Poboljšano uklanjanje bele/svetle pozadine sa dresova -> transparentni WebP.
Čuva tamno platno (ne briše tamne delove dresa) i radi za bele dresove na beloj
pozadini (najveća povezana komponenta + erozija pozadine).

Upotreba:
    pip install pillow numpy scipy
    python3 scripts/remove-bg.py

Ulaz:  public/images/kits/*.jpg (ili *.png)
Izlaz: public/images/kits/*.webp  (transparentna pozadina)
Irak i Iran nemaju slike i koriste SVG placeholder.
"""
import os, glob
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

KITS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "kits")

def remove_bg(path):
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    r,g,b = arr[:,:,0].astype(int), arr[:,:,1].astype(int), arr[:,:,2].astype(int)
    mx = np.maximum(np.maximum(r,g),b)
    mn = np.minimum(np.minimum(r,g),b)
    sat = mx - mn
    is_light = (mx > 220) & (sat < 24)
    labels, n = ndimage.label(is_light)
    edge = set(labels[0,:]) | set(labels[-1,:]) | set(labels[:,0]) | set(labels[:,-1])
    edge.discard(0)
    bg = np.isin(labels, list(edge))
    # eroduj pozadinu da uske grane koje su "procurile" u dres nestanu
    bg_eroded = ndimage.binary_erosion(bg, structure=np.ones((9,9)))
    lab2, n2 = ndimage.label(bg_eroded)
    edge2 = set(lab2[0,:]) | set(lab2[-1,:]) | set(lab2[:,0]) | set(lab2[:,-1])
    edge2.discard(0)
    bg_clean = np.isin(lab2, list(edge2))
    bg_clean = ndimage.binary_dilation(bg_clean, structure=np.ones((9,9))) & bg
    obj = ~bg_clean
    obj = ndimage.binary_opening(obj, structure=np.ones((3,3)))
    lab3, n3 = ndimage.label(obj)
    if n3 > 0:
        sizes = ndimage.sum(np.ones_like(lab3), lab3, range(1, n3+1))
        obj = (lab3 == (np.argmax(sizes)+1))
    obj = ndimage.binary_fill_holes(obj)
    alpha = np.where(obj, 255, 0).astype(np.uint8)
    a_im = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2))
    arr[:,:,3] = np.array(a_im)
    out = Image.fromarray(arr, "RGBA")
    bbox = out.getbbox()
    if bbox: out = out.crop(bbox)
    W,H = out.size; mxs=900
    if max(W,H)>mxs:
        if W>=H: out=out.resize((mxs,int(H*mxs/W)),Image.LANCZOS)
        else: out=out.resize((int(W*mxs/H),mxs),Image.LANCZOS)
    return out

def main():
    files = sorted(glob.glob(os.path.join(KITS_DIR,"*.jpg")) + glob.glob(os.path.join(KITS_DIR,"*.png")))
    if not files:
        print("Nema slika u", KITS_DIR); return
    for p in files:
        name = os.path.splitext(os.path.basename(p))[0]
        out = remove_bg(p)
        out.save(os.path.join(KITS_DIR, name+".webp"), "WEBP", quality=88, method=6)
        print(f"  {name} -> {name}.webp  ({out.size[0]}x{out.size[1]})")
    print(f"\nGotovo: {len(files)} slika.")

if __name__ == "__main__":
    main()
