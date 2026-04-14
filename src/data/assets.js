const BASE_URL = "/design_prototype"; 

export const CAKE_IMAGES = {
  WEDDING_FLORAL: `${BASE_URL}/cake_00001.jpg`,
  CHOCO_DRIP: `${BASE_URL}/cake_00002.jpg`,
  MINIMALIST: `${BASE_URL}/cake_00003.jpg`,
  SAVORY_SPECIAL: `${BASE_URL}/cake_00004.jpg`,
  DONUT_STACK: `${BASE_URL}/cake_00005.jpg`,
  COOKIE_BOX: `${BASE_URL}/cake_00006.jpg`,
};

export const HERO_SLIDES = [
  { id: 1, src: CAKE_IMAGES.WEDDING_FLORAL, alt: "Elegant custom floral wedding cake" },
  { id: 2, src: CAKE_IMAGES.CHOCO_DRIP, alt: "Decadent chocolate drip birthday cake" },
  { id: 3, src: CAKE_IMAGES.MINIMALIST, alt: "Modern minimalist buttercream cake" }
];