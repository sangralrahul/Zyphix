/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Now category catalogue + category artwork.

   Every category has a group (how the store home page groups its tiles), a sort
   order, an emoji fallback and a prompt for its tile image. Tile images are our
   own: generated with Workers AI as an unbranded group of items on a plain light
   grey background, stored in R2 (categories/<slug>-v1.jpg) with a 480px WebP thumb.
   No brand names or logos, so nothing belongs to anyone else.
──────────────────────────────────────────────────────────────────────────── */

export type CategoryDef = { name: string; group: string; icon: string; color: string; prompt: string };

export const GROUP_ORDER = ['Grocery & Kitchen', 'Snacks & Drinks', 'Beauty & Personal Care', 'Household Essentials', 'Fashion & Lifestyle', 'Hobbies & Interests'];

export const CATEGORY_DEFS: CategoryDef[] = [
  // Grocery & Kitchen
  { name: 'Fruits & Veg', group: 'Grocery & Kitchen', icon: '🥦', color: '#16a34a', prompt: 'a woven wicker basket overflowing with fresh fruits and vegetables: tomatoes, broccoli, carrots, red apples, bananas, green grapes, oranges and a capsicum' },
  { name: 'Dairy & Eggs', group: 'Grocery & Kitchen', icon: '🥛', color: '#2563eb', prompt: 'a glass bottle of milk, a block of butter, a cup of plain yogurt, cubes of paneer on a small plate and a few brown eggs' },
  { name: 'Atta, Rice & Dal', group: 'Grocery & Kitchen', icon: '🌾', color: '#d97706', prompt: 'small burlap sacks and wooden bowls filled with basmati rice, whole wheat flour and yellow lentils, with a wooden scoop' },
  { name: 'Bakery & Biscuits', group: 'Grocery & Kitchen', icon: '🍞', color: '#c2410c', prompt: 'a loaf of sliced bread, two croissants, round butter cookies and crisp rusk toasts on a small wooden board' },
  { name: 'Oils & Ghee', group: 'Grocery & Kitchen', icon: '🫙', color: '#ca8a04', prompt: 'plain clear glass bottles of golden cooking oil and a brass bowl of ghee with a spoon' },
  { name: 'Masalas & Spices', group: 'Grocery & Kitchen', icon: '🌶️', color: '#dc2626', prompt: 'small bowls of turmeric powder, red chilli powder, cumin seeds and coriander seeds with cinnamon sticks, star anise and green cardamom' },
  { name: 'Dry Fruits & Nuts', group: 'Grocery & Kitchen', icon: '🥜', color: '#78350f', prompt: 'small bowls of almonds, cashews, golden raisins, walnuts and pistachios' },
  { name: 'Breakfast & Soya', group: 'Grocery & Kitchen', icon: '🥣', color: '#15803d', prompt: 'a bowl of cornflakes with milk, a bowl of rolled oats with berries and a bowl of soya chunks' },
  { name: 'Sauces, Spreads & Ketchup', group: 'Grocery & Kitchen', icon: '🥫', color: '#c2410c', prompt: 'an unlabelled glass bottle of tomato ketchup, a jar of red fruit jam and a jar of peanut butter with a knife' },
  { name: 'Noodles & Pasta', group: 'Grocery & Kitchen', icon: '🍜', color: '#b45309', prompt: 'a bowl of instant noodles, a bundle of dry spaghetti and a small bowl of uncooked penne pasta' },
  { name: 'Ready to Cook & Eat', group: 'Grocery & Kitchen', icon: '🥘', color: '#0891b2', prompt: 'a bowl of creamy dal makhani and a bowl of steamed rice beside two plain unlabelled ready-meal pouches' },
  { name: 'Frozen Food', group: 'Grocery & Kitchen', icon: '🧊', color: '#0369a1', prompt: 'frozen french fries, frozen green peas and frozen samosas on a small tray with a light frost' },
  { name: 'Meat & Seafood', group: 'Grocery & Kitchen', icon: '🍗', color: '#b45309', prompt: 'fresh raw chicken pieces, fish fillets and prawns on a bed of crushed ice in a shallow bowl' },

  // Snacks & Drinks
  { name: 'Snacks & Munchies', group: 'Snacks & Drinks', icon: '🍿', color: '#9333ea', prompt: 'two plain unlabelled foil snack bags, a bowl of potato chips, a bowl of crunchy namkeen mixture and roasted peanuts' },
  { name: 'Cold Drinks & Juices', group: 'Snacks & Drinks', icon: '🥤', color: '#0284c7', prompt: 'unlabelled glass bottles of orange juice and lemonade, and a tall glass of dark cola with ice cubes' },
  { name: 'Tea & Coffee', group: 'Snacks & Drinks', icon: '☕', color: '#92400e', prompt: 'a cup of masala chai, a glass jar of loose black tea leaves, roasted coffee beans and a cup of black coffee' },
  { name: 'Chocolates & Sweets', group: 'Snacks & Drinks', icon: '🍫', color: '#be185d', prompt: 'a broken chocolate bar, and Indian sweets: gulab jamun, rasgulla and diamond-shaped kaju katli on a small plate' },
  { name: 'Ice Creams', group: 'Snacks & Drinks', icon: '🍦', color: '#7e22ce', prompt: 'two ice cream cones with chocolate and vanilla scoops and a small tub of strawberry ice cream' },
  { name: 'Paan Corner', group: 'Snacks & Drinks', icon: '🌿', color: '#16a34a', prompt: 'fresh betel leaves, a small brass bowl of colourful fennel mouth freshener and green cardamom pods' },

  // Beauty & Personal Care
  { name: 'Personal Care', group: 'Beauty & Personal Care', icon: '🧴', color: '#db2777', prompt: 'a toothbrush and a plain white toothpaste tube, a bar of soap, a plain shampoo bottle and a plain deodorant can' },
  { name: 'Skincare', group: 'Beauty & Personal Care', icon: '🧖', color: '#e11d48', prompt: 'minimal plain skincare bottles: a face wash tube, a moisturiser jar, a sunscreen tube and a serum dropper bottle' },
  { name: 'Haircare', group: 'Beauty & Personal Care', icon: '💇', color: '#a855f7', prompt: 'plain shampoo and conditioner bottles, a small bottle of hair oil and a wooden comb' },
  { name: 'Beauty & Cosmetics', group: 'Beauty & Personal Care', icon: '💄', color: '#9d174d', prompt: 'two lipsticks, an eyeshadow palette, a foundation bottle, a mascara and two makeup brushes' },
  { name: 'Fragrances', group: 'Beauty & Personal Care', icon: '🌸', color: '#c026d3', prompt: 'two elegant unlabelled glass perfume bottles and a plain deodorant spray can' },
  { name: 'Bath & Body', group: 'Beauty & Personal Care', icon: '🛁', color: '#0ea5e9', prompt: 'a plain body wash bottle, a natural loofah, a jar of bath salts and stacked handmade soap bars' },
  { name: 'Feminine Hygiene', group: 'Beauty & Personal Care', icon: '🌷', color: '#ec4899', prompt: 'minimal pastel packs of sanitary pads, a menstrual cup and a plain intimate wash bottle' },
  { name: 'Pharmacy', group: 'Beauty & Personal Care', icon: '💊', color: '#0891b2', prompt: 'a white first aid box, pill blister packs, a digital thermometer, bandage rolls and a plain bottle of antiseptic' },
  { name: 'Health & Wellness', group: 'Beauty & Personal Care', icon: '💪', color: '#059669', prompt: 'a plain tub of protein powder, a shaker bottle, a plain multivitamin bottle and a measuring scoop' },
  { name: 'Baby Care', group: 'Beauty & Personal Care', icon: '👶', color: '#f43f5e', prompt: 'a stack of baby diapers, a plain baby lotion bottle, a baby feeding bottle and a soft pack of baby wipes' },

  // Household Essentials
  { name: 'Household', group: 'Household Essentials', icon: '🧹', color: '#64748b', prompt: 'a plain detergent bottle, dishwashing liquid, a sponge, a scrub brush and a roll of garbage bags' },
  { name: 'Cleaning Essentials', group: 'Household Essentials', icon: '🧽', color: '#0d9488', prompt: 'a plain floor cleaner bottle, a spray bottle, scrub pads and yellow rubber gloves' },
  { name: 'Home Needs', group: 'Household Essentials', icon: '🏠', color: '#0f766e', prompt: 'a box of tissues, a small potted green plant, a spin mop with bucket and stacked storage containers' },
  { name: 'Kitchenware & Appliances', group: 'Household Essentials', icon: '🍳', color: '#475569', prompt: 'a steel pressure cooker, a mixer grinder, a non-stick frying pan and a steel ladle' },
  { name: 'Electronics & Accessories', group: 'Household Essentials', icon: '🔌', color: '#334155', prompt: 'wireless earbuds with case, a power bank, a coiled charging cable, an LED bulb and AA batteries' },
  { name: 'Pet Care', group: 'Household Essentials', icon: '🐾', color: '#7c3aed', prompt: 'a plain bag of dog food, a bowl of kibble, a tennis ball toy and a plain cat food tin' },

  // Fashion & Lifestyle
  { name: 'Apparel', group: 'Fashion & Lifestyle', icon: '👕', color: '#2563eb', prompt: 'neatly folded cotton t-shirts, a pair of denim jeans, a linen shirt and a canvas tote bag' },
  { name: 'Jewellery & Accessories', group: 'Fashion & Lifestyle', icon: '💍', color: '#b45309', prompt: 'a gold necklace with matching earrings, a classic wristwatch and a pair of sunglasses' },

  // Hobbies & Interests
  { name: 'Toys & Games', group: 'Hobbies & Interests', icon: '🧸', color: '#f97316', prompt: 'a red toy car, colourful building blocks, a teddy bear and a rubber ball' },
  { name: 'Stationery & Crafts', group: 'Hobbies & Interests', icon: '✏️', color: '#eab308', prompt: 'plain notebooks, colour pencils, highlighter pens, scissors and a glue stick' },
  { name: 'Sports & Fitness', group: 'Hobbies & Interests', icon: '⚽', color: '#16a34a', prompt: 'a football, a red cricket ball, a rolled yoga mat, a pair of dumbbells and a skipping rope' },
  { name: 'Books', group: 'Hobbies & Interests', icon: '📚', color: '#7c2d12', prompt: 'a neat stack of hardcover and paperback books with plain covers and a pair of reading glasses' },
];

const DEF = new Map(CATEGORY_DEFS.map(d => [d.name, d]));
export const groupOf = (name: string) => DEF.get(name)?.group ?? null;

const STYLE = 'product photography for a grocery delivery app category tile, items neatly arranged as one group, centered, isolated on a plain seamless very light grey background, soft shadow underneath, bright soft studio lighting, high detail, photorealistic, no text, no words, no logos, no brand names, no people, no hands';

type Env = { DB: D1Database; AI: Ai };
type Put = (key: string, body: ArrayBuffer, contentType: string) => Promise<string>;

/** Adds any categories from CATEGORY_DEFS that the database does not have yet (existing rows are left alone). */
export async function ensureCategories(env: Env) {
  const have = new Set(((await env.DB.prepare('SELECT name FROM categories').all<{ name: string }>()).results ?? []).map(r => r.name));
  const max = (await env.DB.prepare('SELECT COALESCE(MAX(sort), 0) AS m FROM categories').first<{ m: number }>())?.m ?? 0;
  const missing = CATEGORY_DEFS.filter(d => !have.has(d.name));
  if (!missing.length) return 0;
  await env.DB.batch(missing.map((d, i) => env.DB.prepare('INSERT OR IGNORE INTO categories (name, icon, color, image_url, sort) VALUES (?, ?, ?, NULL, ?)').bind(d.name, d.icon, d.color, max + 1 + i)));
  return missing.length;
}

const ART_PREFIX = '/img/categories/';
const keyFor = (name: string) => `categories/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-v1.jpg`;

/** Generates artwork for up to `limit` categories that still use stock photos (or, with a redo tag, all of them). */
export async function generateCategoryArt(env: Env, put: Put, limit = 4, redoTag = '') {
  await ensureCategories(env);
  const rows = (await env.DB.prepare('SELECT name, image_url FROM categories ORDER BY sort').all<{ name: string; image_url: string | null }>()).results ?? [];
  // Normal run: categories without our artwork. Redo run: everything not yet made in this redo (tagged v=<tag>).
  const todo = rows.filter(r => DEF.has(r.name) && (redoTag ? !(r.image_url ?? '').includes(`v=${redoTag}`) : !(r.image_url ?? '').startsWith(ART_PREFIX)));
  const done: string[] = []; const failed: { name: string; error: string }[] = [];
  for (const r of todo.slice(0, limit)) {
    try {
      const d = DEF.get(r.name)!;
      const out: any = await env.AI.run('@cf/black-forest-labs/flux-1-schnell' as any, { prompt: `${d.prompt}, ${STYLE}`, steps: 8 } as any);
      if (!out?.image) throw new Error('AI returned no image');
      const bytes = Uint8Array.from(atob(out.image), c => c.charCodeAt(0));
      const url = await put(keyFor(r.name), bytes.buffer, 'image/jpeg');
      // The 480px WebP thumbnail is what the tiles load.
      await env.DB.prepare('UPDATE categories SET image_url = ? WHERE name = ?').bind(`${url}?w=thumb&v=${redoTag || Date.now().toString(36)}`, r.name).run();
      done.push(r.name);
    } catch (e) { failed.push({ name: r.name, error: (e as Error).message.slice(0, 160) }); }
  }
  const remaining = Math.max(0, todo.length - done.length);
  return { done, failed, remaining, total: rows.filter(r => DEF.has(r.name)).length };
}

/** How many categories already have generated art. */
export async function categoryArtStatus(env: Env) {
  await ensureCategories(env);
  const rows = (await env.DB.prepare('SELECT name, image_url FROM categories').all<{ name: string; image_url: string | null }>()).results ?? [];
  const known = rows.filter(r => DEF.has(r.name));
  return { total: known.length, done: known.filter(r => (r.image_url ?? '').startsWith(ART_PREFIX)).length };
}
