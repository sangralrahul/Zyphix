// Stock media for the Zyphix marketing site. All assets are free-to-use Pexels
// content (https://www.pexels.com/license/). Videos were verified to be
// landscape (1920x1080 / 1280x720) and direct-file URLs were pulled from each
// video page. Photos use Pexels' stable CDN pattern via `pexelsPhoto`.

export type Clip = {
  id: string;
  src: string;
  src720: string;
  src540?: string;
  src360?: string;
  poster: string;
  alt: string;
  credit: string;
};

export type Photo = { id: string; src: string; alt: string; portrait?: boolean };

/**
 * On *.zyphix.in every file is served through our own Worker (`/media/...`):
 * copied once into R2, then cached at the Cloudflare edge — much faster and more
 * reliable than hot-linking Pexels. Elsewhere (local preview) we use Pexels directly.
 */
const PROXY = typeof window !== 'undefined' && /(^|\.)zyphix\.in$/.test(window.location.hostname);

export const pexelsPhoto = (id: number, w = 960) =>
  PROXY ? `/media/p/${id}?w=${w}` : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/** Responsive srcset for a Pexels photo URL produced by `pexelsPhoto`. */
export function photoSrcSet(src: string): string | undefined {
  const m = /\/media\/p\/(\d+)|photos\/(\d+)\//.exec(src);
  const id = m && Number(m[1] || m[2]);
  if (!id) return undefined;
  return [480, 960, 1600].map(w => `${pexelsPhoto(id, w)} ${w}w`).join(', ');
}

/** Poster image at a given width (posters are full-size JPEGs otherwise). */
export function posterAt(poster: string, w = 1280): string {
  const m = /images\.pexels\.com\/videos\/(\d+)\/([^?]+)/.exec(poster);
  if (!m) return poster;
  return PROXY ? `/media/vp/${m[1]}/${m[2]}?w=${w}` : `https://images.pexels.com/videos/${m[1]}/${m[2]}?auto=compress&cs=tinysrgb&w=${w}`;
}

const vid = (id: number, file: string) =>
  PROXY ? `/media/v/${id}/${file}` : `https://videos.pexels.com/video-files/${id}/${file}`;

/** Best rendition for a box of `cssWidth` px (accounts for device pixel ratio, capped for data). */
export function pickRendition(c: Clip, cssWidth: number): string {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const px = cssWidth * dpr;
  if (px <= 700 && c.src360) return c.src360;
  if (px <= 1100 && c.src540) return c.src540;
  if (px <= 1600) return c.src720;
  return c.src;
}

const CREDIT = "Pexels";

export const VIDEOS: Record<string, Clip> = {
  heroCity: {
    id: "7362583",
    src: vid(7362583, "7362583-hd_1920_1080_24fps.mp4"),
    src720: vid(7362583, "7362583-hd_1280_720_24fps.mp4"),
    src540: vid(7362583, "7362583-sd_960_540_24fps.mp4"),
    src360: vid(7362583, "7362583-sd_640_360_24fps.mp4"),
    poster:
      "https://images.pexels.com/videos/7362583/action-adult-appoint-architecture-7362583.jpeg",
    alt: "Delivery rider on a motorcycle weaving through a busy city street with a food bag on the back",
    credit: CREDIT,
  },
  grocery: {
    id: "6994800",
    src: vid(6994800, "6994800-hd_1920_1080_30fps.mp4"),
    src720: vid(6994800, "6994800-hd_1280_720_30fps.mp4"),
    src540: vid(6994800, "6994800-sd_960_540_30fps.mp4"),
    src360: vid(6994800, "6994800-sd_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/6994800/attractive-beautiful-black-black-female-6994800.jpeg",
    alt: "Delivery person handing over a crate of fresh vegetables at a customer's door",
    credit: CREDIT,
  },
  groceryShelf: {
    id: "29376327",
    src: vid(29376327, "12655224_1918_1080_30fps.mp4"),
    src720: vid(29376327, "12655223_1278_720_30fps.mp4"),
    src540: vid(29376327, "12655222_958_540_30fps.mp4"),
    src360: vid(29376327, "12655221_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/29376327/pexels-photo-29376327.jpeg",
    alt: "Slow tracking shot down a brightly lit supermarket aisle stocked with everyday essentials",
    credit: CREDIT,
  },
  food: {
    id: "4912725",
    src: vid(4912725, "4912725-hd_1920_1080_24fps.mp4"),
    src720: vid(4912725, "4912725-hd_1280_720_24fps.mp4"),
    src540: vid(4912725, "4912725-sd_960_540_24fps.mp4"),
    src360: vid(4912725, "4912725-sd_640_360_24fps.mp4"),
    poster:
      "https://images.pexels.com/videos/4912725/cooking-eastern-cuisine-food-blog-food-blogger-4912725.jpeg",
    alt: "Close-up of a cook scooping fragrant spiced yellow rice from a hot pan",
    credit: CREDIT,
  },
  foodDelivery: {
    id: "8926183",
    src: vid(8926183, "8926183-hd_1920_1080_25fps.mp4"),
    src720: vid(8926183, "8926183-hd_1280_720_25fps.mp4"),
    src540: vid(8926183, "8926183-sd_960_540_25fps.mp4"),
    src360: vid(8926183, "8926183-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/8926183/pexels-photo-8926183.jpeg",
    alt: "Food delivery courier handing a takeaway bag to a smiling customer at the doorstep",
    credit: CREDIT,
  },
  cleaning: {
    id: "7551100",
    src: vid(7551100, "7551100-hd_1920_1080_25fps.mp4"),
    src720: vid(7551100, "7551100-hd_1280_720_25fps.mp4"),
    src540: vid(7551100, "7551100-sd_960_540_25fps.mp4"),
    src360: vid(7551100, "7551100-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/7551100/pexels-photo-7551100.jpeg",
    alt: "Professional cleaner mopping a bright living-room floor in a modern home",
    credit: CREDIT,
  },
  electrician: {
    id: "4334561",
    src: vid(4334561, "4334561-hd_1920_1080_24fps.mp4"),
    src720: vid(4334561, "4334561-hd_1280_720_24fps.mp4"),
    src540: vid(4334561, "4334561-sd_960_540_24fps.mp4"),
    src360: vid(4334561, "4334561-sd_640_360_24fps.mp4"),
    poster: "https://images.pexels.com/videos/4334561/pexels-photo-4334561.jpeg",
    alt: "Electrician carefully fixing wiring inside a home electrical fitting",
    credit: CREDIT,
  },
  salon: {
    id: "7987790",
    src: vid(7987790, "7987790-hd_1920_1080_25fps.mp4"),
    src720: vid(7987790, "7987790-hd_1280_720_50fps.mp4"),
    src540: vid(7987790, "7987790-sd_960_540_25fps.mp4"),
    src360: vid(7987790, "7987790-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/7987790/pexels-photo-7987790.jpeg",
    alt: "Beautician applying makeup to a client during an at-home salon session",
    credit: CREDIT,
  },
  rider: {
    id: "8992553",
    src: vid(8992553, "8992553-hd_1920_1080_30fps.mp4"),
    src720: vid(8992553, "8992553-hd_1280_720_30fps.mp4"),
    src540: vid(8992553, "8992553-sd_960_540_30fps.mp4"),
    src360: vid(8992553, "8992553-sd_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/8992553/adult-backpack-bag-bicycle-8992553.jpeg",
    alt: "Tracking shot of a delivery rider on a scooter carrying an insulated thermal bag through the city",
    credit: CREDIT,
  },
  unboxing: {
    id: "6715786",
    src: vid(6715786, "6715786-hd_1920_1080_25fps.mp4"),
    src720: vid(6715786, "6715786-hd_1280_720_25fps.mp4"),
    src540: vid(6715786, "6715786-sd_960_540_25fps.mp4"),
    src360: vid(6715786, "6715786-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/6715786/pexels-photo-6715786.jpeg",
    alt: "Smiling woman opening her front door and receiving a parcel from a courier",
    credit: CREDIT,
  },
  spices: {
    id: "28283517",
    src: vid(28283517, "12351602_1920_1080_30fps.mp4"),
    src720: vid(28283517, "12351599_1280_720_30fps.mp4"),
    src540: vid(28283517, "12351598_960_540_30fps.mp4"),
    src360: vid(28283517, "12351597_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/28283517/authenticindianspices-chaispices-cuminandcoriander-curryspices-28283517.jpeg",
    alt: "Close-up of colourful Indian whole and ground spices — cumin, coriander and chai masala",
    credit: CREDIT,
  },
  vegMarket: {
    id: "29695848",
    src: vid(29695848, "12770716_1920_1080_30fps.mp4"),
    src720: vid(29695848, "12770715_1280_720_30fps.mp4"),
    src540: vid(29695848, "12770714_960_540_30fps.mp4"),
    src360: vid(29695848, "12770713_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/29695848/pexels-photo-29695848.jpeg",
    alt: "Vendor selling fresh vegetables at a vibrant Indian sabzi market",
    credit: CREDIT,
  },
  chai: {
    id: "37649378",
    src: vid(37649378, "15959080_1920_1080_30fps.mp4"),
    src720: vid(37649378, "15959079_1280_720_30fps.mp4"),
    src540: vid(37649378, "15959078_960_540_30fps.mp4"),
    src360: vid(37649378, "15959077_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/37649378/beautiful-morning-chai-cinnamon-cultural-37649378.jpeg",
    alt: "Steaming masala chai being poured into a cup",
    credit: CREDIT,
  },
  tandoor: {
    id: "38483155",
    src: vid(38483155, "16343321_1920_1080_60fps.mp4"),
    src720: vid(38483155, "16343320_1280_720_60fps.mp4"),
    src540: vid(38483155, "16343319_960_540_60fps.mp4"),
    src360: vid(38483155, "16343318_640_360_60fps.mp4"),
    poster: "https://images.pexels.com/videos/38483155/pexels-photo-38483155.jpeg",
    alt: "Traditional bread baking against the hot walls of a clay tandoor",
    credit: CREDIT,
  },
  streetFood: {
    id: "29875902",
    src: vid(29875902, "12827151_1920_1080_24fps.mp4"),
    src720: vid(29875902, "12827150_1280_720_24fps.mp4"),
    src540: vid(29875902, "12827149_960_540_24fps.mp4"),
    src360: vid(29875902, "12827148_640_360_24fps.mp4"),
    poster: "https://images.pexels.com/videos/29875902/pexels-photo-29875902.jpeg",
    alt: "Street food vendor frying crisp golden samosas in a large kadhai",
    credit: CREDIT,
  },
  plating: {
    id: "39498949",
    src: vid(39498949, "16826547_1920_1080_50fps.mp4"),
    src720: vid(39498949, "16826545_1280_720_50fps.mp4"),
    src540: vid(39498949, "16826543_960_540_50fps.mp4"),
    src360: vid(39498949, "16826541_640_360_50fps.mp4"),
    poster: "https://images.pexels.com/videos/39498949/kitchen-39498949.jpeg",
    alt: "Professional chef carefully plating a gourmet dish in slow motion",
    credit: CREDIT,
  },
  packing: {
    id: "4818259",
    src: vid(4818259, "4818259-hd_1920_1080_30fps.mp4"),
    src720: vid(4818259, "4818259-hd_1280_720_30fps.mp4"),
    src540: vid(4818259, "4818259-sd_960_540_30fps.mp4"),
    src360: vid(4818259, "4818259-sd_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/4818259/pexels-photo-4818259.jpeg",
    alt: "Hands packing fresh fruits and groceries into a reusable cloth bag",
    credit: CREDIT,
  },
  phoneOrder: {
    id: "6994864",
    src: vid(6994864, "6994864-hd_1920_1080_30fps.mp4"),
    src720: vid(6994864, "6994864-hd_1280_720_30fps.mp4"),
    src540: vid(6994864, "6994864-sd_960_540_30fps.mp4"),
    src360: vid(6994864, "6994864-sd_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/6994864/attractive-beautiful-black-black-female-6994864.jpeg",
    alt: "Close-up of hands browsing and ordering groceries on a smartphone",
    credit: CREDIT,
  },
  doorHandoff: {
    id: "8938170",
    src: vid(8938170, "8938170-hd_1920_1080_30fps.mp4"),
    src720: vid(8938170, "8938170-hd_1280_720_30fps.mp4"),
    src540: vid(8938170, "8938170-sd_960_540_30fps.mp4"),
    src360: vid(8938170, "8938170-sd_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/8938170/pexels-photo-8938170.jpeg",
    alt: "Delivery partner handing an order to a smiling customer at her door",
    credit: CREDIT,
  },
  nightCity: {
    id: "30739577",
    src: vid(30739577, "13149275_1920_1080_25fps.mp4"),
    src720: vid(30739577, "13149274_1280_720_25fps.mp4"),
    src540: vid(30739577, "13149273_960_540_25fps.mp4"),
    src360: vid(30739577, "13149272_640_360_25fps.mp4"),
    poster:
      "https://images.pexels.com/videos/30739577/4k-drone-4k-drone-shot-4k-timelapse-above-the-city-30739577.jpeg",
    alt: "Aerial night time-lapse of busy city traffic with streaking headlight trails",
    credit: CREDIT,
  },
  plumber: {
    id: "9890450",
    src: vid(9890450, "9890450-hd_1920_1080_30fps.mp4"),
    src720: vid(9890450, "9890450-hd_1280_720_30fps.mp4"),
    src540: vid(9890450, "9890450-sd_960_540_30fps.mp4"),
    src360: vid(9890450, "9890450-sd_640_360_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/9890450/leak-plumbing-repair-tools-9890450.jpeg",
    alt: "Close-up of a plumber fixing a leaking kitchen faucet",
    credit: CREDIT,
  },
  acRepair: {
    id: "31150098",
    src: vid(31150098, "13309368_1920_1080_60fps.mp4"),
    src720: vid(31150098, "13309367_1280_720_60fps.mp4"),
    src540: vid(31150098, "13309366_960_540_60fps.mp4"),
    src360: vid(31150098, "13309365_640_360_60fps.mp4"),
    poster:
      "https://images.pexels.com/videos/31150098/afternoon-chill-cinematic-cozy-31150098.jpeg",
    alt: "Close-up of a modern wall-mounted split air conditioner running indoors",
    credit: CREDIT,
  },
  haircut: {
    id: "30747522",
    src: vid(30747522, "13153649_1920_1080_30fps.mp4"),
    src720: vid(30747522, "13153648_1280_720_30fps.mp4"),
    src540: vid(30747522, "13153647_960_540_30fps.mp4"),
    src360: vid(30747522, "13153646_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/30747522/pexels-photo-30747522.jpeg",
    alt: "Barber trimming a client's beard in a modern men's grooming salon",
    credit: CREDIT,
  },
  homeSpa: {
    id: "9335765",
    src: vid(9335765, "9335765-hd_1920_1080_25fps.mp4"),
    src720: vid(9335765, "9335765-hd_1280_720_25fps.mp4"),
    src540: vid(9335765, "9335765-sd_960_540_25fps.mp4"),
    src360: vid(9335765, "9335765-sd_640_360_25fps.mp4"),
    poster:
      "https://images.pexels.com/videos/9335765/applying-back-comfort-cure-9335765.jpeg",
    alt: "Relaxing facial massage during a spa treatment",
    credit: CREDIT,
  },
  merchant: {
    id: "39688924",
    src: vid(39688924, "16922654_1920_1080_30fps.mp4"),
    src720: vid(39688924, "16922653_1280_720_30fps.mp4"),
    src540: vid(39688924, "16922652_960_540_30fps.mp4"),
    src360: vid(39688924, "16922651_640_360_30fps.mp4"),
    poster: "https://images.pexels.com/videos/39688924/pexels-photo-39688924.jpeg",
    alt: "Busy neighbourhood Indian grocery store with packed shelves and counter",
    credit: CREDIT,
  },
  chefTeam: {
    id: "3768941",
    src: vid(3768941, "3768941-hd_1920_1080_25fps.mp4"),
    src720: vid(3768941, "3768941-hd_1280_720_25fps.mp4"),
    src540: vid(3768941, "3768941-sd_960_540_25fps.mp4"),
    src360: vid(3768941, "3768941-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/3768941/pexels-photo-3768941.jpeg",
    alt: "Team of chefs busy cooking and plating in a restaurant kitchen",
    credit: CREDIT,
  },
  cooking: {
    id: "2894888",
    src: vid(2894888, "2894888-hd_1920_1080_24fps.mp4"),
    src720: vid(2894888, "2894888-hd_1280_720_24fps.mp4"),
    src540: vid(2894888, "2894888-sd_960_540_24fps.mp4"),
    src360: vid(2894888, "2894888-sd_640_360_24fps.mp4"),
    poster: "https://images.pexels.com/videos/2894888/free-video-2894888.jpg",
    alt: "Slow-motion close-up of fried rice tossed in a wok over roaring flames",
    credit: CREDIT,
  },
  fruit: {
    id: "8212561",
    src: vid(8212561, "8212561-hd_1920_1080_25fps.mp4"),
    src720: vid(8212561, "8212561-hd_1280_720_25fps.mp4"),
    src540: vid(8212561, "8212561-sd_960_540_25fps.mp4"),
    src360: vid(8212561, "8212561-sd_640_360_25fps.mp4"),
    poster: "https://images.pexels.com/videos/8212561/pexels-photo-8212561.jpeg",
    alt: "Assorted fresh fruit splashing into water in slow motion",
    credit: CREDIT,
  },
};

/** All URLs below were verified to load in a real browser on 2026-10-25. `portrait` = taller than wide (use object-cover or reserve for tall slots). */
const p = (id: number, alt: string, portrait = false): Photo => ({
  id: String(id),
  src: pexelsPhoto(id, 960),
  alt,
  ...(portrait ? { portrait: true } : {}),
});

/** First landscape photo of a group (falls back to the first photo). */
export const landscape = (key: string, n = 0): Photo => {
  const list = (PHOTOS[key] || []).filter(x => !x.portrait);
  return list[n % Math.max(list.length, 1)] || PHOTOS[key]?.[0] || { id: "0", src: "", alt: "" };
};

export const PHOTOS: Record<string, Photo[]> = {
  grocery: [
    p(7345419, "Woman carrying paper bags full of fresh groceries", true),
    p(6969888, "Man in white shirt holding a brown paper grocery bag"),
    p(33366963, "Colourful fresh groceries packed in an eco-friendly bag"),
    p(31031845, "Reusable bag filled with fresh vegetables", true),
    p(7363085, "Bag of groceries left at a doorstep"),
    p(8900017, "Elderly man holding a paper bag with vegetables"),
  ],
  produce: [
    p(39206252, "Vibrant fresh vegetables at a Delhi market", true),
    p(37321079, "Vibrant display of fresh market vegetables"),
    p(38383098, "Fresh vegetables stacked at a local market stall", true),
    p(5807481, "Vendor at a local bazaar surrounded by fresh vegetables"),
    p(34622385, "Market stall with a colourful vegetable display", true),
    p(33214226, "Fresh vegetables in a supermarket produce aisle"),
  ],
  snacks: [
    p(27939228, "Shelf stacked with snacks and packaged food items", true),
    p(21582447, "Bags of chips lined up in a store"),
    p(34338679, "Colourful supermarket cereal aisle", true),
    p(33690927, "Supermarket aisle with a bright drinks display"),
    p(20187354, "Woman choosing snacks from a store shelf", true),
    p(8111369, "Chips and cookies on a wooden table"),
  ],
  dairy: [
    p(20489330, "Dairy section in a grocery store"),
    p(7451957, "Shelves stocked with milk cartons"),
    p(17546504, "Chilled dairy freezers in a supermarket", true),
    p(6803754, "Fresh milk in glass containers beside almonds and cashews", true),
    p(5946733, "Bottle and glass of milk on a desk", true),
    p(4187779, "Assorted cheese on a table", true),
  ],
  indianFood: [
    p(29148133, "Traditional Indian thali with naan bread"),
    p(36388454, "Traditional Indian plate with puri and chole"),
    p(5410418, "Kerala sadya served on a banana leaf", true),
    p(2569760, "Close-up of a cooked Indian curry dish"),
    p(35985960, "Samosas and dumplings on a wicker tray"),
    p(36854500, "Rawa uttapam with chutneys in Delhi", true),
  ],
  restaurant: [
    p(34080434, "Authentic Indian cuisine plated in a restaurant", true),
    p(8818741, "Happy group of friends sharing dinner at a restaurant"),
    p(4570082, "Busy Indian street food stall"),
    p(35128164, "Street vendor preparing spicy Indian food", true),
    p(8818660, "People having a conversation over dinner"),
    p(984534, "Vendor standing beside his food stall"),
  ],
  foodDelivery: [
    p(7362948, "Rider with a food delivery bag on a motorcycle", true),
    p(12725445, "Delivery rider handing over a food order", true),
    p(4392044, "Courier wearing a thermal bag beside a bicycle"),
    p(12725434, "Rider holding a box of food beside his bike", true),
    p(12725420, "Woman receiving takeout food at her door", true),
    p(8931729, "Delivery woman cycling with an insulated bag"),
  ],
  cleaning: [
    p(4107160, "Woman wiping down a television screen", true),
    p(7703296, "Woman in a white shirt vacuuming a living room"),
    p(4239125, "Man cleaning a bathroom mirror", true),
    p(9462746, "Woman cleaning a kitchen counter", true),
    p(5591651, "Woman wiping a white table with an orange cloth"),
    p(4440537, "Woman cleaning a window with a spray bottle", true),
  ],
  plumbing: [
    p(6419128, "Plumber installing pipe fittings"),
    p(39885416, "Close-up of a plumber working with a copper pipe", true),
    p(29226620, "Professional plumber installing a radiator pipe"),
    p(32588548, "Plumber repairing a pipe with a wrench indoors", true),
    p(5691536, "Handyman measuring near a home heating system", true),
    p(8486978, "Handywoman holding a plumber's wrench", true),
  ],
  electrician: [
    p(27928761, "Electrician working on a home electrical panel"),
    p(34054464, "Electrician diagnosing an electrical panel with a multimeter", true),
    p(5691588, "Electrician using pliers to repair AC power sockets", true),
    p(29871587, "Electrician working on a renovation project", true),
    p(7285965, "Close-up of hands holding electrical cables"),
    p(27928762, "Technician inspecting an electrical panel"),
  ],
  salon: [
    p(5149734, "Woman having her makeup done in front of a ring light"),
    p(5732998, "Makeup artist applying makeup to her client"),
    p(33722921, "Professional makeup artist applying makeup to a model", true),
    p(20593111, "Beautician applying makeup", true),
    p(34025144, "Makeup artist applying beauty makeup indoors", true),
    p(6954002, "Makeup artist testing eyeshadow shades on a customer's wrist", true),
  ],
  appliance: [
    p(5463575, "Technician checking a wall-mounted air conditioner"),
    p(5463580, "Technician repairing an air conditioner unit", true),
    p(5463582, "Technician fixing an aircon indoor unit", true),
    p(33671149, "Air conditioner repair technician at work"),
    p(32497161, "Technician inspecting an outdoor HVAC unit"),
    p(5463581, "Technician drilling an aircon casing"),
  ],
  rider: [
    p(13311393, "Rider on a motorcycle on a city road"),
    p(31332062, "Motorcyclist delivering food on a city street", true),
    p(36072048, "Food delivery rider at night in a busy city"),
    p(39294655, "Delivery rider on a scooter in city traffic"),
    p(11010523, "Back view of a rider in an orange jacket at night", true),
    p(35803222, "Night-time delivery service on a motorbike in the city"),
  ],
  city: [
    p(29423536, "Bustling evening street scene with traffic in Mumbai", true),
    p(29254364, "Night traffic in an urban Indian cityscape", true),
    p(16005654, "People near shops on a city street at night"),
    p(34105075, "Late night bus ride through Mumbai city"),
    p(14468285, "Long-exposure light trails of cars on a night road", true),
    p(13079390, "Street lights in front of Chhatrapati Shivaji Terminus, Mumbai", true),
  ],
  people: [
    p(6169000, "Smiling woman receiving a package at her door"),
    p(6667682, "Smiling delivery man handing packages to a woman"),
    p(7844006, "Courier handing deliveries to a happy customer"),
    p(6347553, "Woman with parcels opening her front door", true),
    p(13432296, "Woman receiving a delivery in her doorway", true),
    p(7190893, "Woman receiving a parcel from a courier"),
  ],
  team: [
    p(7413920, "Team member presenting at a whiteboard"),
    p(7413914, "Man and woman collaborating at a whiteboard"),
    p(32866727, "Team collaboration in a modern office"),
    p(8278898, "People brainstorming in a meeting"),
    p(4623461, "Colleagues having a meeting around a table"),
    p(16323454, "Team working on laptops in a coworking space"),
  ],
  spices: [
    p(6808976, "Bowls of red chilli and turmeric powder"),
    p(31346441, "Vibrant red chilli peppers at an Indian street market"),
    p(6444313, "Close-up of spices piled high at a bazaar"),
    p(40194167, "Spice market vendor's colourful display"),
    p(30296301, "Assorted Indian spices on a wooden surface"),
    p(31280796, "Vibrant assortment of Indian spice powders"),
  ],
  streetFood: [
    p(28489409, "Vendor carrying a tray of samosas down a street"),
    p(34943745, "Street vendor cooking traditional Indian flatbreads"),
    p(16297823, "Elderly man selling traditional food on a street"),
    p(34836608, "Street vendor selling traditional Indian snacks"),
    p(18295371, "Street food seller at his stall"),
    p(21575653, "Man selling street food at a roadside stall"),
  ],
  chai: [
    p(33339360, "Street vendor making traditional Indian chai"),
    p(36662612, "Masala chai served in a traditional clay cup"),
    p(18413481, "Man preparing hot chai at a market stall"),
    p(18413480, "Chai being poured through a sieve"),
    p(40330458, "Cozy cup of spiced chai on a wooden table"),
  ],
  biryani: [
    p(28674660, "Indian chicken biryani with spicy curry"),
    p(34484975, "Biryani platter in Chennai"),
    p(30748996, "Biryani with aromatic whole spices"),
    p(39536492, "Chicken biryani on a wooden platter"),
    p(32825917, "Biryani dish garnished with spices"),
    p(9738983, "Plate of biryani"),
  ],
  thali: [
    p(35008222, "Traditional Indian thali with chapati and vegetables"),
    p(5775684, "Home-style meal on a stainless steel thali"),
    p(17223838, "Thali plate with dal, sabzi and rice"),
    p(17223836, "Indian meal served in small bowls on a plate"),
    p(17223835, "Full Indian meal laid out on a tray"),
    p(29850004, "Authentic Indian feast with rich flavours"),
  ],
  kirana: [
    p(26861411, "Shopkeeper working in a neighbourhood store"),
    p(13369323, "Customers shopping at a small local shop"),
    p(33561774, "Street-side stall in Kolkata, India"),
    p(37695265, "Local shop on a street in Tiruchirappalli"),
    p(19566900, "Corner grocery store lit up at night"),
  ],
  phone: [
    p(16052344, "Hand holding a phone with a delivery app on screen"),
    p(16052346, "Smartphone showing a food delivery app"),
    p(35765454, "Close-up of online shopping on a smartphone"),
    p(5077068, "Person holding an Android smartphone"),
    p(16195434, "Hand holding a smartphone"),
    p(6969953, "Man holding a smartphone"),
  ],
  deliveryBag: [
    p(13432042, "Woman delivering a meal in a delivery bag"),
    p(7258492, "Packaged hot food delivered at home"),
    p(6969967, "Brown paper bags handed over to a customer"),
    p(4440795, "Person holding brown paper shopping bags"),
    p(7258491, "Paper delivery package with fast food"),
    p(8988546, "Courier resting beside an insulated thermal bag"),
  ],
  acRepair: [
    p(33925031, "AC repair training session in Delhi"),
    p(33958627, "AC repair training at an institute in New Delhi"),
    p(34099331, "Technician repairing an AC circuit board in a Delhi workshop"),
    p(31800980, "Technician in an electronics and AC repair lab"),
    p(5463577, "Technicians checking a rooftop AC outdoor unit"),
    p(14522790, "Air conditioner with a ladder set up for servicing"),
  ],
  carpenter: [
    p(37178416, "Carpenter measuring a wooden plank in a workshop"),
    p(11127339, "Craftsman marking a piece of wood"),
    p(8817850, "Carpenter tracing an outline on timber"),
    p(5974413, "Carpenter hammering a nail into a wooden piece"),
    p(5691541, "Carpenter planing a window frame"),
    p(32831080, "Carpenter measuring wood with precision"),
  ],
  painting: [
    p(7218683, "Painter rolling fresh paint onto a wall"),
    p(5691471, "House painter undercoating a wall in a bright room"),
    p(36153946, "Workers painting interior walls"),
    p(4792500, "Painter with a brush beside a stepladder"),
    p(7218006, "Person painting a wall"),
    p(8481711, "Painting a white wall with a roller"),
  ],
  pestControl: [
    p(19789841, "Smoke fogging used for pest control"),
    p(19789837, "Pest exterminator fogging a yard"),
    p(4176541, "Technician fumigating a living space"),
    p(4176610, "Technician in protective clothing fumigating a rug"),
    p(4176417, "Technician in a protective suit fumigating a table"),
    p(4176302, "Professional fumigating a carpet"),
  ],
  jammu: [
    p(40424902, "Aerial view of Anantnag town in the Kashmir valley"),
    p(40348598, "Shikara ride on Dal Lake, Srinagar"),
    p(33836435, "Mughal garden with a mountain backdrop"),
    p(35841298, "Serene winter landscape in Kashmir"),
    p(25786565, "Boats on Dal Lake with snow-capped mountains"),
    p(18189943, "Cityscape of Srinagar"),
  ],
  shopOwner: [
    p(17843598, "Shopkeeper at work behind his counter"),
    p(28672824, "Delhi market vendor selling fresh produce"),
    p(35704494, "Small market shop with produce and its owner"),
    p(11586501, "Man standing inside his store"),
    p(8475172, "Man selling fruits in a grocery"),
    p(36818382, "Local shopfront in an Indian village"),
  ],
  chef: [
    p(36870973, "Chef tossing vegetables in a modern kitchen"),
    p(30660319, "Smiling chef giving a thumbs up in Bengaluru"),
    p(37708443, "Chef working in a restaurant kitchen at night"),
    p(39025942, "Chef preparing Indian street-food chaat"),
    p(18215050, "Man preparing food in a restaurant"),
    p(8629106, "Chef cooking in a kitchen"),
  ],
  teamOffice: [
    p(7581127, "Young team standing together in an office"),
    p(7580644, "Colleagues talking in the office"),
    p(7580645, "Team working in a startup office"),
    p(7580651, "Team in a meeting"),
    p(7581110, "Team having a standing meeting"),
    p(7580824, "Colleagues in the middle of an open office"),
  ],
};
