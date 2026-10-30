/* ────────────────────────────────────────────────────────────────────────────
   Subcategories for the Zyphix Now category page (the left rail, like a
   quick-commerce app). The catalogue has no subcategory column, so products are
   sorted by keywords in their names; anything unmatched goes to "More". For
   categories without rules the rail lists the top brands instead.
──────────────────────────────────────────────────────────────────────────── */
import type { Product } from '@/lib/catalog';

type Rule = { name: string; icon: string; re: RegExp };

const RULES: Record<string, Rule[]> = {
  'Fruits & Veg': [
    { name: 'Fresh Vegetables', icon: '🥕', re: /potato|onion|tomato|carrot|cabbage|cauliflower|capsicum|cucumber|brinjal|beans|peas|gourd|okra|bhindi|beetroot|radish|zucchini|pumpkin|drumstick|tinda|parwal|corn|mushroom|sweet potato|raw banana|raw papaya|broccoli|lettuce/i },
    { name: 'Leafy, Herbs & Seasonings', icon: '🌿', re: /spinach|palak|coriander|mint|methi|curry leaves|spring onion|ginger|garlic|lemon|chilli|chili|dill|celery|basil/i },
    { name: 'Fresh Fruits', icon: '🍎', re: /apple|banana|mango|orange|grape|papaya|pineapple|watermelon|melon|pomegranate|guava|kiwi|pear|lime|chikoo|sapota|custard|litchi|plum|peach|strawberr|berr|avocado|dragon|coconut|fig|cherr/i },
  ],
  'Dairy & Eggs': [
    { name: 'Milk', icon: '🥛', re: /\bmilk\b(?!.*(shake|maid))|cow milk|toned|full cream|a2/i },
    { name: 'Curd & Yogurt', icon: '🥣', re: /curd|dahi|yogurt|yoghurt|mishti doi|lassi|chach|chaas|buttermilk/i },
    { name: 'Paneer & Cream', icon: '🧀', re: /paneer|cream|tofu/i },
    { name: 'Cheese', icon: '🧀', re: /cheese|mozzarella/i },
    { name: 'Butter & Ghee', icon: '🧈', re: /butter(?!milk)|ghee/i },
    { name: 'Eggs', icon: '🥚', re: /\beggs?\b/i },
    { name: 'Condensed Milk & Shakes', icon: '🍼', re: /milkmaid|condensed|shake|kool/i },
  ],
  'Atta, Rice & Dal': [
    { name: 'Atta & Flours', icon: '🌾', re: /atta|flour|maida|besan|suji|rava|sooji|ragi|bajra|jowar/i },
    { name: 'Rice', icon: '🍚', re: /rice|basmati|poha|sona masoori|ponni|kolam/i },
    { name: 'Dals & Pulses', icon: '🫘', re: /dal|moong|masoor|toor|arhar|urad|chana|rajma|lobia|matar|chickpea|kabuli/i },
    { name: 'Salt & Sugar', icon: '🧂', re: /salt|sugar|jaggery|gur/i },
  ],
  'Snacks & Munchies': [
    { name: 'Chips & Crisps', icon: '🥔', re: /chips|wafers|crisps|pringles|lay'?s|nachos|kurkure|bingo|puff|uncle chipps|too yumm/i },
    { name: 'Namkeen & Bhujia', icon: '🥨', re: /bhujia|namkeen|mixture|sev|boondi|chana jor|moong dal|khatta meetha|nut cracker|aloo/i },
    { name: 'Popcorn & Makhana', icon: '🍿', re: /popcorn|makhana/i },
    { name: 'Nuts & Seeds', icon: '🥜', re: /almond|cashew|peanut|nuts|seeds/i },
  ],
  'Cold Drinks & Juices': [
    { name: 'Soft Drinks', icon: '🥤', re: /cola|coke|pepsi|thums up|sprite|limca|mirinda|fanta|mountain dew|7up|soda|fizz|nimbooz/i },
    { name: 'Fruit Juices', icon: '🧃', re: /juice|maaza|frooti|slice|appy(?! fizz)|real |tropicana|minute maid|b natural|paper ?boat|aam/i },
    { name: 'Water & Coconut Water', icon: '💧', re: /water/i },
    { name: 'Energy & Iced Drinks', icon: '⚡', re: /energy|sting|red bull|monster|iced coffee|ready to drink|shake/i },
  ],
  'Personal Care': [
    { name: 'Bath & Soaps', icon: '🧼', re: /soap|body wash|shower|handwash|bath/i },
    { name: 'Hair Care', icon: '💇', re: /shampoo|conditioner|hair|oil/i },
    { name: 'Oral Care', icon: '🪥', re: /tooth|colgate|pepsodent|sensodyne|closeup|mouthwash|dabur red/i },
    { name: 'Skin & Face', icon: '🧴', re: /face wash|cream|lotion|moisturi|facial|cleanser|serum|sunscreen|powder|vaseline/i },
    { name: 'Shaving & Grooming', icon: '🪒', re: /shav|razor|gillette|trimmer|gel|deo|perfume|body spray/i },
    { name: 'Feminine & Sexual Wellness', icon: '🌸', re: /sanitary|pads|whisper|stayfree|tampon|condom|manforce|durex/i },
  ],
  'Household': [
    { name: 'Detergents & Laundry', icon: '🧺', re: /detergent|surf|rin|ariel|tide|wheel|ghari|nirma|fabric|comfort|laundry/i },
    { name: 'Dishwash', icon: '🍽️', re: /dish|vim|pril|exo|scrub|sponge|scotch-?brite/i },
    { name: 'Cleaners & Disinfectants', icon: '🧽', re: /cleaner|lizol|harpic|colin|dettol|savlon|antiseptic|phenyl|mr\.? muscle|handwash/i },
    { name: 'Pest Control', icon: '🦟', re: /mosquito|insect|all out|good knight|mortein|hit |repellent/i },
    { name: 'Tissues, Foils & Wraps', icon: '🧻', re: /tissue|towel|foil|wrap|garbage|bags|napkin/i },
    { name: 'Fresheners & Pooja', icon: '🕯️', re: /freshener|ambi pur|odonil|aer|agarbatti|incense|camphor|diya|match/i },
  ],
  'Pharmacy': [
    { name: 'Vitamins & Supplements', icon: '💊', re: /vitamin|multivit|protein|whey|omega|calcium|centrum|supradyn|melatonin|biotin/i },
    { name: 'Ayurveda', icon: '🌿', re: /patanjali|dabur|chyawan|chyavan|ashwagandha|ashvagandha|giloy|amla|aloe|himalaya|zandu|baidyanath/i },
    { name: 'Pain Relief', icon: '🩹', re: /pain|balm|volini|moov|iodex|crocin|combiflam|dolo|spray/i },
    { name: 'Cold, Cough & Digestion', icon: '🤧', re: /cough|cold|vicks|benadryl|strepsils|eno|digene|hajmola|antacid|ors|electral|prolyte/i },
    { name: 'Health Devices', icon: '🩺', re: /monitor|thermometer|oximeter|glucometer|omron|dr trust|bp /i },
  ],
  'Meat & Seafood': [
    { name: 'Chicken', icon: '🍗', re: /chicken/i },
    { name: 'Fish & Seafood', icon: '🐟', re: /fish|prawn|shrimp|seafood|rohu|basa|salmon|pomfret|crab/i },
    { name: 'Mutton', icon: '🍖', re: /mutton|goat|lamb/i },
    { name: 'Eggs & Cold Cuts', icon: '🥚', re: /egg|salami|sausage|ham|bacon|kebab|nugget/i },
  ],
  'Tea & Coffee': [
    { name: 'Tea', icon: '🍵', re: /tea|chai/i },
    { name: 'Coffee', icon: '☕', re: /coffee|nescafe|bru|espresso/i },
    { name: 'Health Drinks', icon: '🥛', re: /horlicks|bournvita|boost|complan|protinex|milo/i },
  ],
  'Frozen Food': [
    { name: 'Snacks & Starters', icon: '🍟', re: /fries|nugget|samosa|tikki|patty|kebab|spring roll|momo|popcorn|smiles|wedges|finger/i },
    { name: 'Ready Meals & Parathas', icon: '🫓', re: /paratha|roti|chapati|naan|meal|biryani|rice|pizza/i },
    { name: 'Frozen Vegetables', icon: '🫛', re: /peas|corn|vegetable|veggies|mixed veg|spinach/i },
  ],
  'Noodles & Pasta': [
    { name: 'Instant Noodles', icon: '🍜', re: /noodle|ramen|maggi|yippee|wai wai/i },
    { name: 'Pasta & Vermicelli', icon: '🍝', re: /pasta|penne|fusilli|spaghetti|macaroni|vermicelli/i },
  ],
  'Ready to Cook & Eat': [
    { name: 'Ready Meals', icon: '🍛', re: /ready to eat|minute khana|biryani/i },
    { name: 'Instant Mixes', icon: '🥣', re: /mix|poha|oats/i },
    { name: 'Soups', icon: '🍲', re: /soup/i },
  ],
  'Skincare': [
    { name: 'Face Wash', icon: '🫧', re: /face wash|cleanser/i },
    { name: 'Moisturisers & Lotions', icon: '🧴', re: /moistur|lotion|cream/i },
    { name: 'Sunscreen & Serums', icon: '☀️', re: /sunscreen|serum|spf/i },
  ],
  'Haircare': [
    { name: 'Shampoo & Conditioner', icon: '🧴', re: /shampoo|conditioner/i },
    { name: 'Hair Oil & Serum', icon: '💧', re: /oil|serum/i },
    { name: 'Styling & Colour', icon: '💇', re: /gel|colou?r/i },
  ],
  'Bath & Body': [
    { name: 'Soaps', icon: '🧼', re: /soap|bar/i },
    { name: 'Body Wash & Lotion', icon: '🛁', re: /shower|body wash|lotion|body milk/i },
    { name: 'Handwash', icon: '🫧', re: /handwash/i },
  ],
  'Cleaning Essentials': [
    { name: 'Laundry', icon: '🧺', re: /detergent|liquid|fabric|conditioner/i },
    { name: 'Dishwash', icon: '🍽️', re: /dish|scrub/i },
    { name: 'Floor & Toilet', icon: '🧽', re: /floor|toilet|disinfect|glass|broom/i },
  ],
  'Kitchenware & Appliances': [
    { name: 'Cookware', icon: '🍳', re: /cooker|pan|tawa|kadai/i },
    { name: 'Appliances', icon: '🔌', re: /mixer|grinder|kettle|toaster/i },
    { name: 'Bottles & Storage', icon: '🥤', re: /bottle|flask|lunch|bowl|container/i },
  ],
  'Electronics & Accessories': [
    { name: 'Audio', icon: '🎧', re: /earbud|earphone|headphone|speaker|airdopes/i },
    { name: 'Chargers & Cables', icon: '🔋', re: /charger|cable|power bank/i },
    { name: 'Storage & Computer', icon: '💾', re: /microsd|drive|mouse|keyboard/i },
    { name: 'Lighting & Power', icon: '💡', re: /led|bulb|batten|torch|batter|extension/i },
  ],
  'Stationery & Crafts': [
    { name: 'Notebooks & Paper', icon: '📒', re: /notebook|paper|sticky/i },
    { name: 'Pens & Pencils', icon: '✏️', re: /pen|pencil|eraser/i },
    { name: 'Art & Craft', icon: '🎨', re: /crayon|sketch|glue|fevi/i },
  ],
  'Sports & Fitness': [
    { name: 'Cricket', icon: '🏏', re: /cricket/i },
    { name: 'Badminton & Football', icon: '🏸', re: /badminton|shuttle|football|racquet|yonex/i },
    { name: 'Fitness', icon: '🏋️', re: /yoga|dumbbell|skipping|resistance|shaker/i },
  ],
};

export type Subcat = { name: string; icon: string; products: Product[] };

/** Subcategories for one category: keyword rules where we have them, otherwise top brands. */
export function subcategoriesFor(category: string, products: Product[]): Subcat[] {
  const rules = RULES[category];
  if (rules) {
    const buckets = rules.map(r => ({ name: r.name, icon: r.icon, products: [] as Product[] }));
    const more: Product[] = [];
    for (const p of products) {
      const name = p.name.replace(/^local farm\s*/i, '');
      const i = rules.findIndex(r => r.re.test(name));
      (i >= 0 ? buckets[i].products : more).push(p);
    }
    const out = buckets.filter(b => b.products.length > 0);
    if (more.length) out.push({ name: 'More', icon: '✨', products: more });
    return out;
  }
  // Brand rail: the biggest brands, then everything else.
  const byBrand = new Map<string, Product[]>();
  for (const p of products) {
    const b = (p.brand || 'Other').trim() || 'Other';
    if (!byBrand.has(b)) byBrand.set(b, []);
    byBrand.get(b)!.push(p);
  }
  const ranked = [...byBrand.entries()].sort((a, b) => b[1].length - a[1].length);
  const top = ranked.slice(0, 10).filter(([, list]) => list.length >= 3);
  const shown = new Set(top.map(([b]) => b));
  const rest = products.filter(p => !shown.has((p.brand || 'Other').trim() || 'Other'));
  const out: Subcat[] = top.map(([b, list]) => ({ name: b, icon: b.charAt(0).toUpperCase(), products: list }));
  if (rest.length) out.push({ name: 'Other brands', icon: '✨', products: rest });
  return out;
}

export const categorySlug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
