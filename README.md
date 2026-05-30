# DresZaKes ⚽

Premium fudbalski dresovi u Srbiji — e-commerce landing page.

## Tech Stack

- **React 19** + **Vite 8**
- Inline CSS-in-JS styling (no external UI library)
- Google Fonts: Bebas Neue + Outfit
- Deployed on **Vercel**

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview   # preview locally
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at https://vercel.com/new

## Project Structure

```
dreszakes/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── App.jsx        # Main component (all sections)
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles & animations
├── index.html         # Entry HTML with SEO meta tags
├── vite.config.js     # Vite build config
├── vercel.json        # Vercel deployment config
└── package.json
```

## Sections

1. Hero — Full-screen with animated grid
2. Why Us — Feature cards
3. Products — Mystery Dres, Fan Version, Player Version
4. Comparison — Fan vs Player table
5. Mystery Section — Animated reveal
6. Gallery — Team collection
7. Testimonials — Customer reviews
8. FAQ — Accordion
9. Footer — Links & social

## Features

- Sticky glassmorphism navbar
- Shopping cart modal
- Search modal
- Floating buy button
- Toast notifications
- Mobile responsive
- SEO optimized
