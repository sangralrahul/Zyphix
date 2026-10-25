/**
 * Stock media (Pexels, free licence) served from zyphix.in's own media proxy (R2 + Cloudflare edge),
 * the same files the website uses. Phones get the light 540p renditions.
 */
const BASE = 'https://zyphix.in/media';

export const photo = (id: string | number, w = 960) => `${BASE}/p/${id}?w=${w}`;
const v = (id: number, file: string) => `${BASE}/v/${id}/${file}`;
const poster = (id: number, name: string, w = 960) => `${BASE}/vp/${id}/${name}?w=${w}`;

export type Clip = { uri: string; poster: string };

export const CLIPS = {
  heroCity: { uri: v(7362583, '7362583-sd_960_540_24fps.mp4'), poster: poster(7362583, 'action-adult-appoint-architecture-7362583.jpeg') },
  groceryShelf: { uri: v(29376327, '12655222_958_540_30fps.mp4'), poster: poster(29376327, 'pexels-photo-29376327.jpeg') },
  packing: { uri: v(4818259, '4818259-sd_960_540_30fps.mp4'), poster: poster(4818259, 'pexels-photo-4818259.jpeg') },
  vegMarket: { uri: v(29695848, '12770714_960_540_30fps.mp4'), poster: poster(29695848, 'pexels-photo-29695848.jpeg') },
  cooking: { uri: v(2894888, '2894888-sd_960_540_24fps.mp4'), poster: poster(2894888, 'free-video-2894888.jpg') },
  food: { uri: v(4912725, '4912725-sd_960_540_24fps.mp4'), poster: poster(4912725, 'cooking-eastern-cuisine-food-blog-food-blogger-4912725.jpeg') },
  plating: { uri: v(39498949, '16826543_960_540_50fps.mp4'), poster: poster(39498949, 'kitchen-39498949.jpeg') },
  cleaning: { uri: v(7551100, '7551100-sd_960_540_25fps.mp4'), poster: poster(7551100, 'pexels-photo-7551100.jpeg') },
  plumber: { uri: v(9890450, '9890450-sd_960_540_30fps.mp4'), poster: poster(9890450, 'leak-plumbing-repair-tools-9890450.jpeg') },
  doorHandoff: { uri: v(8938170, '8938170-sd_960_540_30fps.mp4'), poster: poster(8938170, 'pexels-photo-8938170.jpeg') },
  nightCity: { uri: v(30739577, '13149273_960_540_25fps.mp4'), poster: poster(30739577, '4k-drone-4k-drone-shot-4k-timelapse-above-the-city-30739577.jpeg') },
  rider: { uri: v(8992553, '8992553-sd_960_540_30fps.mp4'), poster: poster(8992553, 'adult-backpack-bag-bicycle-8992553.jpeg') },
} satisfies Record<string, Clip>;

/** Hand-picked landscape photos (same ids as the website's PHOTOS). */
export const PHOTO = {
  produce: photo(37321079),
  dairy: photo(20489330),
  snacks: photo(21582447),
  grocery: photo(6969888),
  restaurant: photo(8818741),
  streetFood: photo(4570082),
  thali: photo(29148133),
  biryani: photo(28674660),
  shop: photo(26861411),
  doorstep: photo(6169000),
  deliveryBag: photo(13432042),
  phone: photo(16052344),
  city: photo(16005654),
  teamOffice: photo(7581127),
};
