export const MENU_ITEMS = [
  {
    id: 'dosa-sample',
    name: 'Dosa (Image Test)',
    price: '$7.99',
    description: 'Sample image-based AR test item for quick QR validation.',
    ingredients: ['Rice Batter', 'Lentils', 'Potato Masala'],
    modelUrl: '',
    poster: '/dosa-sample.svg',
    imageUrl: '/dosa-sample.svg',
    position: '0 -0.15 -1.2',
    scale: '1.8 1.2 1',
    rotation: '0 0 0',
    markerPosition: '0 0 0.25',
    markerScale: '1.1 0.75 1',
    markerRotation: '0 0 0',
  },
  {
    id: 'avocado-delight',
    name: 'Avocado Toast Elite',
    price: '$12.99',
    description: 'Fresh organic avocado, cherry tomatoes, and microgreens on artisanal sourdough.',
    ingredients: ['Avocado', 'Sourdough', 'Cherry Tomato', 'Microgreens', 'Olive Oil'],
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
    poster: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    position: '0 -0.5 -3',
    scale: '10 10 10',
    rotation: '0 0 0',
    markerPosition: '0 0.05 0.2',
    markerScale: '0.35 0.35 0.35',
    markerRotation: '0 0 0',
  },
  {
    id: 'classic-burger',
    name: 'Space Burger',
    price: '$18.50',
    description: 'A stellar experience of flavors with our signature patty and special stardust sauce.',
    ingredients: ['Beef Patty', 'Brioche Bun', 'Lettuce', 'Tomato', 'Interstellar Sauce'],
    // Fallback to the astronaut if we don't have a burger model at hand
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    // The poster isn't used as 3D fallback, but an actual image representation
    poster: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    position: '0 -0.7 -3',
    scale: '1 1 1',
    rotation: '0 0 0',
    markerPosition: '0 0.05 0.2',
    markerScale: '0.35 0.35 0.35',
    markerRotation: '0 0 0',
  }
];

export const getMenuItem = (id) => MENU_ITEMS.find(item => item.id === id);
