// Stock media for the Zyphix marketing site. All assets are free-to-use Pexels
// content (https://www.pexels.com/license/). Videos were verified to be
// landscape (1920x1080 / 1280x720) and direct-file URLs were pulled from each
// video page. Photos use Pexels' stable CDN pattern via `pexelsPhoto`.

export type Clip = {
  id: string;
  src: string;
  src720: string;
  poster: string;
  alt: string;
  credit: string;
};

export type Photo = { id: string; src: string; alt: string; portrait?: boolean };

export const pexelsPhoto = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const vid = (id: number, file: string) =>
  `https://videos.pexels.com/video-files/${id}/${file}`;

const CREDIT = "Pexels";

export const VIDEOS: Record<string, Clip> = {
  heroCity: {
    id: "7362583",
    src: vid(7362583, "7362583-hd_1920_1080_24fps.mp4"),
    src720: vid(7362583, "7362583-hd_1280_720_24fps.mp4"),
    poster:
      "https://images.pexels.com/videos/7362583/action-adult-appoint-architecture-7362583.jpeg",
    alt: "Delivery rider on a motorcycle weaving through a busy city street with a food bag on the back",
    credit: CREDIT,
  },
  grocery: {
    id: "6994800",
    src: vid(6994800, "6994800-hd_1920_1080_30fps.mp4"),
    src720: vid(6994800, "6994800-hd_1280_720_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/6994800/attractive-beautiful-black-black-female-6994800.jpeg",
    alt: "Delivery person handing over a crate of fresh vegetables at a customer's door",
    credit: CREDIT,
  },
  groceryShelf: {
    id: "29376327",
    src: vid(29376327, "12655224_1918_1080_30fps.mp4"),
    src720: vid(29376327, "12655223_1278_720_30fps.mp4"),
    poster: "https://images.pexels.com/videos/29376327/pexels-photo-29376327.jpeg",
    alt: "Slow tracking shot down a brightly lit supermarket aisle stocked with everyday essentials",
    credit: CREDIT,
  },
  food: {
    id: "4912725",
    src: vid(4912725, "4912725-hd_1920_1080_24fps.mp4"),
    src720: vid(4912725, "4912725-hd_1280_720_24fps.mp4"),
    poster:
      "https://images.pexels.com/videos/4912725/cooking-eastern-cuisine-food-blog-food-blogger-4912725.jpeg",
    alt: "Close-up of a cook scooping fragrant spiced yellow rice from a hot pan",
    credit: CREDIT,
  },
  foodDelivery: {
    id: "8926183",
    src: vid(8926183, "8926183-hd_1920_1080_25fps.mp4"),
    src720: vid(8926183, "8926183-hd_1280_720_25fps.mp4"),
    poster: "https://images.pexels.com/videos/8926183/pexels-photo-8926183.jpeg",
    alt: "Food delivery courier handing a takeaway bag to a smiling customer at the doorstep",
    credit: CREDIT,
  },
  cleaning: {
    id: "7551100",
    src: vid(7551100, "7551100-hd_1920_1080_25fps.mp4"),
    src720: vid(7551100, "7551100-hd_1280_720_25fps.mp4"),
    poster: "https://images.pexels.com/videos/7551100/pexels-photo-7551100.jpeg",
    alt: "Professional cleaner mopping a bright living-room floor in a modern home",
    credit: CREDIT,
  },
  electrician: {
    id: "4334561",
    src: vid(4334561, "4334561-hd_1920_1080_24fps.mp4"),
    src720: vid(4334561, "4334561-hd_1280_720_24fps.mp4"),
    poster: "https://images.pexels.com/videos/4334561/pexels-photo-4334561.jpeg",
    alt: "Electrician carefully fixing wiring inside a home electrical fitting",
    credit: CREDIT,
  },
  salon: {
    id: "7987790",
    src: vid(7987790, "7987790-hd_1920_1080_25fps.mp4"),
    src720: vid(7987790, "7987790-hd_1280_720_50fps.mp4"),
    poster: "https://images.pexels.com/videos/7987790/pexels-photo-7987790.jpeg",
    alt: "Beautician applying makeup to a client during an at-home salon session",
    credit: CREDIT,
  },
  rider: {
    id: "8992553",
    src: vid(8992553, "8992553-hd_1920_1080_30fps.mp4"),
    src720: vid(8992553, "8992553-hd_1280_720_30fps.mp4"),
    poster:
      "https://images.pexels.com/videos/8992553/adult-backpack-bag-bicycle-8992553.jpeg",
    alt: "Tracking shot of a delivery rider on a scooter carrying an insulated thermal bag through the city",
    credit: CREDIT,
  },
  unboxing: {
    id: "6715786",
    src: vid(6715786, "6715786-hd_1920_1080_25fps.mp4"),
    src720: vid(6715786, "6715786-hd_1280_720_25fps.mp4"),
    poster: "https://images.pexels.com/videos/6715786/pexels-photo-6715786.jpeg",
    alt: "Smiling woman opening her front door and receiving a parcel from a courier",
    credit: CREDIT,
  },
};

/** All URLs below were verified to load in a real browser on 2026-10-25. `portrait` = taller than wide (use object-cover or reserve for tall slots). */
const p = (id: number, alt: string, portrait = false): Photo => ({
  id: String(id),
  src: pexelsPhoto(id),
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
};
