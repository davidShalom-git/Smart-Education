# Open Source AR Smart Menu

This project lets users scan a **dish-specific QR code** and open a WebAR view where that dish model pops up.

## Quick start

```bash
npm install
npm run dev
```

Open the app in browser and scan one of the generated QR codes on the landing page.

## How QR -> dish mapping works

- Every dish is defined in `src/data/menu.js`.
- Landing page auto-generates QR codes using `/menu/<dish-id>`.
- AR page reads that `:id` route param and loads the matching `modelUrl`.

## Add your own food item

Edit `src/data/menu.js` and add an object inside `MENU_ITEMS`:

```js
{
  id: 'my-new-dish',
  name: 'My New Dish',
  price: '$9.99',
  description: '...',
  ingredients: ['...'],
  modelUrl: 'https://example.com/models/my-dish.glb',
  poster: 'https://example.com/my-dish.jpg',
  position: '0 -0.6 -3',
  scale: '1 1 1',
  rotation: '0 0 0',
}
```

Notes:
- `id` must be unique.
- Use public `.glb` URLs for `modelUrl`.
- Tune `position` and `scale` per model for best visual pop.

## Tech stack

- React + Vite
- A-Frame + AR.js (runtime loaded)
- Tailwind CSS
