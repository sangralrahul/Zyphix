import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Store, Clock, FileText, Sparkles, FileDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZyphixLogo } from '@/components/ZyphixLogo';

const G = '#0DA366'; const T1 = '#111827'; const T2 = '#6B7280';
const T3 = '#9CA3AF'; const BD = '#E5E7EB'; const W = '#FFFFFF'; const BG = '#F8F9FA';
const SH = '0 2px 8px rgba(0,0,0,.07)'; const SH2 = '0 4px 24px rgba(0,0,0,.10)';

const tw = (emoji: string) => {
  const cp = [...emoji].map(c=>c.codePointAt(0)!.toString(16)).filter(h=>parseInt(h,16)!==0xfe0f && parseInt(h,16)!==0x200d).join('_');
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${cp}/512.png`;
};

const CATS = [
  { id:'fruits_veg',  e:tw('🥬'), n:'Fruits & Vegetables', c:'#16a34a', bg:'#ECFDF5' },
  { id:'dairy',       e:tw('🥛'), n:'Dairy & Eggs',        c:'#2563eb', bg:'#EFF6FF' },
  { id:'snacks',      e:tw('🍿'), n:'Snacks',              c:'#d97706', bg:'#FFFBEB' },
  { id:'beverages',   e:tw('🧃'), n:'Cold Drinks',         c:'#0891b2', bg:'#ECFEFF' },
  { id:'grains',      e:tw('🌾'), n:'Rice, Dal & Grains',  c:'#78350f', bg:'#FFFBEB' },
  { id:'spices',      e:tw('🌶'),  n:'Spices & Masala',    c:'#dc2626', bg:'#FFF1F2' },
  { id:'atta',        e:tw('🍞'), n:'Atta, Flour & Bread', c:'#c2410c', bg:'#FFF7ED' },
  { id:'oil',         e:tw('🫙'), n:'Oils & Ghee',         c:'#b45309', bg:'#FFFBEB' },
  { id:'breakfast',   e:tw('🥣'), n:'Breakfast & Cereal',  c:'#7c3aed', bg:'#F5F3FF' },
  { id:'biscuits',    e:tw('🍪'), n:'Biscuits & Cakes',    c:'#d97706', bg:'#FFFBEB' },
  { id:'noodles',     e:tw('🍜'), n:'Noodles & Pasta',     c:'#dc2626', bg:'#FFF1F2' },
  { id:'tea',         e:tw('☕'), n:'Tea & Coffee',        c:'#92400e', bg:'#FFF7ED' },
  { id:'personal',    e:tw('💄'), n:'Personal Care',       c:'#db2777', bg:'#FDF2F8' },
  { id:'household',   e:tw('🧹'), n:'Household Items',     c:'#4f46e5', bg:'#EEF2FF' },
  { id:'cleaning',    e:tw('🧴'), n:'Cleaning & Detergents',c:'#0284c7',bg:'#F0F9FF' },
  { id:'baby',        e:tw('👶'), n:'Baby Products',       c:'#0891b2', bg:'#ECFEFF' },
  { id:'pharmacy',    e:tw('💊'), n:'Medicines & Health',  c:'#0f766e', bg:'#F0FDFA' },
  { id:'frozen',      e:tw('❄'),  n:'Frozen Foods',        c:'#0284c7', bg:'#F0F9FF' },
  { id:'pet',         e:tw('🐾'), n:'Pet Products',        c:'#78350f', bg:'#FFFBEB' },
  { id:'stationery',  e:tw('✏'),  n:'Stationery',          c:'#4f46e5', bg:'#EEF2FF' },
];

type SubItem = { n: string; e: string };
const SUB_CATS: Record<string, SubItem[]> = {
  fruits_veg: [
    {n:'Tomatoes',e:tw('🍅')},{n:'Potatoes',e:tw('🥔')},{n:'Onions',e:tw('🧅')},{n:'Garlic',e:tw('🧄')},{n:'Ginger',e:tw('🫚')},
    {n:'Capsicum',e:tw('🫑')},{n:'Cauliflower',e:tw('🥦')},{n:'Cabbage',e:tw('🥬')},{n:'Brinjal',e:tw('🍆')},{n:'Ladyfinger',e:tw('🌿')},
    {n:'Spinach',e:tw('🥬')},{n:'Methi',e:tw('🌿')},{n:'Peas',e:tw('🫛')},{n:'Carrot',e:tw('🥕')},{n:'Beetroot',e:tw('🫚')},
    {n:'Radish',e:tw('🌶')},{n:'Apples',e:tw('🍎')},{n:'Bananas',e:tw('🍌')},{n:'Mangoes',e:tw('🥭')},{n:'Oranges',e:tw('🍊')},
    {n:'Grapes',e:tw('🍇')},{n:'Guava',e:tw('🍈')},{n:'Papaya',e:tw('🍈')},{n:'Watermelon',e:tw('🍉')},{n:'Pomegranate',e:tw('🍎')},
    {n:'Lemon',e:tw('🍋')},{n:'Pears',e:tw('🍐')},{n:'Kiwi',e:tw('🥝')},{n:'Pineapple',e:tw('🍍')},{n:'Coconut',e:tw('🥥')},
  ],
  dairy: [
    {n:'Full Cream Milk',e:tw('🥛')},{n:'Toned Milk',e:tw('🥛')},{n:'Double Toned Milk',e:tw('🥛')},{n:'Curd / Dahi',e:tw('🥣')},
    {n:'Paneer',e:tw('🧀')},{n:'Butter',e:tw('🧈')},{n:'Ghee',e:tw('🫙')},{n:'Cream',e:tw('🥛')},{n:'Cheese',e:tw('🧀')},
    {n:'Condensed Milk',e:tw('🥛')},{n:'Lassi',e:tw('🥤')},{n:'Buttermilk',e:tw('🥤')},{n:'Eggs (6 pack)',e:tw('🥚')},
    {n:'Eggs (12 pack)',e:tw('🥚')},{n:'Flavoured Milk',e:tw('🥛')},{n:'Tofu',e:tw('🧊')},
  ],
  snacks: [
    {n:'Potato Chips',e:tw('🥔')},{n:'Bhujia',e:tw('🍿')},{n:'Namkeen',e:tw('🌾')},{n:'Popcorn',e:tw('🍿')},{n:'Peanuts',e:tw('🥜')},
    {n:'Roasted Chana',e:tw('🫘')},{n:'Mukhwas',e:tw('🌿')},{n:'Trail Mix',e:tw('🥜')},{n:'Papad',e:tw('🫓')},{n:'Khakhra',e:tw('🫓')},
    {n:'Mathri',e:tw('🫓')},{n:'Bikaneri Bhujia',e:tw('🌾')},{n:'Aloo Bhujia',e:tw('🥔')},{n:'Corn Puffs',e:tw('🌽')},
    {n:'Rice Crackers',e:tw('🍚')},{n:'Banana Chips',e:tw('🍌')},{n:'Chakli',e:tw('🌀')},{n:'Dry Fruits Mix',e:tw('🫘')},
    {n:'Prawn Crackers',e:tw('🦐')},{n:'Chivda',e:tw('🌾')},
  ],
  beverages: [
    {n:'Cola (Pepsi/Coke)',e:tw('🥤')},{n:'Sprite / 7UP',e:tw('🥤')},{n:'Thums Up',e:tw('🥤')},{n:'Limca',e:tw('🥤')},
    {n:'Maaza / Slice',e:tw('🥭')},{n:'Real Juice',e:tw('🧃')},{n:'Paper Boat',e:tw('🧃')},{n:'Tropicana',e:tw('🍊')},
    {n:'Coconut Water',e:tw('🥥')},{n:'Drinking Water',e:tw('💧')},{n:'Sparkling Water',e:tw('💧')},{n:'Energy Drink',e:tw('⚡')},
    {n:'Iced Tea',e:tw('🧊')},{n:'Nimbu Pani Mix',e:tw('🍋')},{n:'Rooh Afza',e:tw('🌹')},{n:'Aam Panna',e:tw('🥭')},{n:'Jaljeera',e:tw('🌿')},
  ],
  grains: [
    {n:'Basmati Rice 1kg',e:tw('🌾')},{n:'Basmati Rice 5kg',e:tw('🌾')},{n:'Non-Basmati Rice',e:tw('🍚')},{n:'Brown Rice',e:tw('🍚')},
    {n:'Toor Dal',e:tw('🫘')},{n:'Moong Dal',e:tw('🫘')},{n:'Chana Dal',e:tw('🫘')},{n:'Urad Dal',e:tw('🫘')},
    {n:'Masoor Dal',e:tw('🫘')},{n:'Rajma',e:tw('🫘')},{n:'Kala Chana',e:tw('🫘')},{n:'White Peas',e:tw('🫛')},
    {n:'Lobia',e:tw('🫘')},{n:'Soya Chunks',e:tw('🌿')},{n:'Wheat',e:tw('🌾')},{n:'Jowar',e:tw('🌾')},
    {n:'Bajra',e:tw('🌾')},{n:'Maize',e:tw('🌽')},{n:'Oats',e:tw('🌾')},{n:'Barley',e:tw('🌾')},
  ],
  spices: [
    {n:'Turmeric Powder',e:tw('🌿')},{n:'Red Chilli Powder',e:tw('🌶')},{n:'Coriander Powder',e:tw('🌿')},{n:'Cumin Seeds',e:tw('🌿')},
    {n:'Garam Masala',e:tw('🫙')},{n:'Black Pepper',e:tw('🫙')},{n:'Green Cardamom',e:tw('🌿')},{n:'Cloves',e:tw('🌿')},
    {n:'Cinnamon',e:tw('🌿')},{n:'Bay Leaves',e:tw('🌿')},{n:'Hing (Asafoetida)',e:tw('🧄')},{n:'Mustard Seeds',e:tw('🌿')},
    {n:'Fenugreek Seeds',e:tw('🌿')},{n:'Fennel Seeds',e:tw('🌿')},{n:'Amchur Powder',e:tw('🫙')},{n:'Chaat Masala',e:tw('🫙')},
    {n:'Biryani Masala',e:tw('🫙')},{n:'Chicken Masala',e:tw('🍗')},{n:'Pav Bhaji Masala',e:tw('🫙')},{n:'Sambar Powder',e:tw('🌶')},
    {n:'Meat Masala',e:tw('🥩')},{n:'Kitchen King',e:tw('🫙')},{n:'Kasuri Methi',e:tw('🌿')},
  ],
  atta: [
    {n:'Wheat Atta 5kg',e:tw('🌾')},{n:'Wheat Atta 10kg',e:tw('🌾')},{n:'Multigrain Atta',e:tw('🌾')},{n:'Besan',e:tw('🫘')},
    {n:'Maida',e:tw('🫙')},{n:'Sooji / Rava',e:tw('🫙')},{n:'Rice Flour',e:tw('🍚')},{n:'Ragi Flour',e:tw('🌾')},
    {n:'Corn Flour',e:tw('🌽')},{n:'Jowar Flour',e:tw('🌾')},{n:'Bajra Flour',e:tw('🌾')},{n:'White Bread',e:tw('🍞')},
    {n:'Brown Bread',e:tw('🍞')},{n:'Multigrain Bread',e:tw('🍞')},{n:'Sandwich Bread',e:tw('🥪')},{n:'Pav / Dinner Rolls',e:tw('🍞')},
    {n:'Burger Buns',e:tw('🍔')},{n:'Bread Sticks',e:tw('🥖')},{n:'Rusk',e:tw('🍪')},
  ],
  oil: [
    {n:'Sunflower Oil 1L',e:tw('🌻')},{n:'Sunflower Oil 5L',e:tw('🌻')},{n:'Mustard Oil',e:tw('🌿')},{n:'Soyabean Oil',e:tw('🫘')},
    {n:'Groundnut Oil',e:tw('🥜')},{n:'Rice Bran Oil',e:tw('🌾')},{n:'Coconut Oil',e:tw('🥥')},{n:'Refined Oil',e:tw('🫙')},
    {n:'Olive Oil',e:tw('🫒')},{n:'Palm Oil',e:tw('🌴')},{n:'Desi Ghee (Cow)',e:tw('🐄')},{n:'Desi Ghee (Buffalo)',e:tw('🐃')},
    {n:'Vanaspati',e:tw('🫙')},{n:'Butter (Cooking)',e:tw('🧈')},
  ],
  breakfast: [
    {n:'Cornflakes',e:tw('🌽')},{n:'Muesli',e:tw('🌾')},{n:'Granola',e:tw('🌾')},{n:'Poha',e:tw('🍚')},{n:'Upma Mix',e:tw('🫙')},
    {n:'Idli Batter',e:tw('🫙')},{n:'Dosa Batter',e:tw('🫙')},{n:'Instant Oats',e:tw('🌾')},{n:'Rolled Oats',e:tw('🌾')},
    {n:'Semiya / Vermicelli',e:tw('🍝')},{n:'Suji Halwa Mix',e:tw('🍯')},{n:'Sabudana',e:tw('⚪')},{n:'Beaten Rice',e:tw('🍚')},
    {n:'Sattu',e:tw('🫙')},{n:'Quinoa',e:tw('🌾')},{n:'Protein Oats',e:tw('💪')},
  ],
  biscuits: [
    {n:'Marie Biscuits',e:tw('🍪')},{n:'Glucose Biscuits',e:tw('🍪')},{n:'Bourbon',e:tw('🍪')},{n:'Hide & Seek',e:tw('🍪')},
    {n:'Digestive',e:tw('🍪')},{n:'Khari Biscuit',e:tw('🥐')},{n:'Good Day',e:tw('🍪')},{n:'Oreo',e:tw('🍪')},
    {n:'Parle-G',e:tw('🍪')},{n:'Monaco',e:tw('🍪')},{n:'Jim Jam',e:tw('🍪')},{n:'Rusk',e:tw('🍪')},
    {n:'Milk Rusk',e:tw('🍪')},{n:'Wafers',e:tw('🍫')},{n:'Cookies',e:tw('🍪')},{n:'Butter Cookies',e:tw('🍪')},
    {n:'Choco Chip Cookies',e:tw('🍪')},{n:'Cake Slice',e:tw('🎂')},{n:'Muffins',e:tw('🧁')},{n:'Almond Cookies',e:tw('🍪')},
  ],
  noodles: [
    {n:'Maggi Noodles',e:tw('🍜')},{n:'Yippee Noodles',e:tw('🍜')},{n:'Top Ramen',e:tw('🍜')},{n:'Knorr Noodles',e:tw('🍜')},
    {n:'Wai Wai',e:tw('🍜')},{n:'Cup Noodles',e:tw('☕')},{n:'Wheat Noodles',e:tw('🍜')},{n:'Rice Noodles',e:tw('🍜')},
    {n:'Spaghetti',e:tw('🍝')},{n:'Penne Pasta',e:tw('🍝')},{n:'Fusilli Pasta',e:tw('🍝')},{n:'Macaroni',e:tw('🍝')},
    {n:'Hakka Noodles',e:tw('🍜')},{n:'Glass Noodles',e:tw('🍜')},{n:'Biryani Kit',e:tw('🍲')},
    {n:'Arrabiata Sauce',e:tw('🍅')},{n:'White Pasta Sauce',e:tw('🥛')},
  ],
  tea: [
    {n:'Tata Tea Gold',e:tw('☕')},{n:'Tata Tea Agni',e:tw('☕')},{n:'Red Label',e:tw('☕')},{n:'Taj Mahal',e:tw('☕')},
    {n:'Green Tea',e:tw('🍵')},{n:'Tulsi Tea',e:tw('🌿')},{n:'Ginger Tea',e:tw('☕')},{n:'Chamomile Tea',e:tw('🌼')},
    {n:'Peppermint Tea',e:tw('🌿')},{n:'Darjeeling Tea',e:tw('☕')},{n:'Masala Chai Mix',e:tw('☕')},{n:'Filter Coffee',e:tw('☕')},
    {n:'Bru Instant Coffee',e:tw('☕')},{n:'Nescafe Classic',e:tw('☕')},{n:'Nescafe Gold',e:tw('☕')},
    {n:'Cold Coffee Mix',e:tw('🧊')},{n:'Chai Premix',e:tw('☕')},{n:'Kadak Chai Mix',e:tw('☕')},
  ],
  personal: [
    {n:'Shampoo',e:tw('🧴')},{n:'Anti-Dandruff Shampoo',e:tw('🧴')},{n:'Conditioner',e:tw('🧴')},{n:'Body Wash',e:tw('🚿')},
    {n:'Soap Bar',e:tw('🧼')},{n:'Face Wash',e:tw('🧼')},{n:'Moisturizer',e:tw('🧴')},{n:'Sunscreen SPF50',e:tw('☀')},
    {n:'Deodorant',e:tw('🌸')},{n:'Perfume',e:tw('🌹')},{n:'Toothpaste',e:tw('🦷')},{n:'Toothbrush',e:tw('🪥')},
    {n:'Mouthwash',e:tw('💧')},{n:'Face Scrub',e:tw('🧴')},{n:'Toner',e:tw('💧')},{n:'Serum',e:tw('✨')},
    {n:'Hair Oil',e:tw('💆')},{n:'Hair Gel',e:tw('💇')},{n:'Razors',e:tw('🪒')},{n:'Shaving Cream',e:tw('🧼')},
    {n:'Sanitary Pads',e:tw('🌸')},{n:'Panty Liners',e:tw('🌸')},{n:'Intimate Wash',e:tw('🧼')},
  ],
  household: [
    {n:'Brooms',e:tw('🧹')},{n:'Mops',e:tw('🧹')},{n:'Dustpan',e:tw('🪣')},{n:'Floor Brush',e:tw('🪣')},
    {n:'Scrubber Pads',e:tw('🧽')},{n:'Dish Cloth',e:tw('🧺')},{n:'Duster',e:tw('🧹')},{n:'Mop Refill',e:tw('🧹')},
    {n:'Dustbin Bags',e:tw('🗑')},{n:'Candles',e:tw('🕯')},{n:'Matchboxes',e:tw('🔥')},{n:'AA Batteries',e:tw('🔋')},
    {n:'AAA Batteries',e:tw('🔋')},{n:'LED Bulbs',e:tw('💡')},{n:'Extension Cord',e:tw('🔌')},
    {n:'Mosquito Repellent',e:tw('🦟')},{n:'Fly Swatter',e:tw('🪰')},{n:'Air Freshener',e:tw('🌸')},
    {n:'Incense Sticks',e:tw('🪔')},{n:'Dhoop',e:tw('🪔')},{n:'Camphor',e:tw('🕯')},
  ],
  cleaning: [
    {n:'Washing Powder 1kg',e:tw('🧺')},{n:'Washing Powder 5kg',e:tw('🧺')},{n:'Liquid Detergent',e:tw('🧴')},
    {n:'Fabric Softener',e:tw('🌸')},{n:'Dishwash Bar',e:tw('🧼')},{n:'Dishwash Liquid',e:tw('🧴')},
    {n:'Floor Cleaner',e:tw('🧴')},{n:'Phenyl',e:tw('🧴')},{n:'Harpic',e:tw('🚽')},{n:'Bathroom Cleaner',e:tw('🛁')},
    {n:'Glass Cleaner',e:tw('🪟')},{n:'Disinfectant Spray',e:tw('🧴')},{n:'Multi-Purpose Cleaner',e:tw('🧴')},
    {n:'Steel Scrubber',e:tw('🧽')},{n:'Sponge Scrubber',e:tw('🧽')},{n:'Drain Cleaner',e:tw('🚰')},
    {n:'Shoe Cleaner',e:tw('👟')},{n:'Dry Clean Sheets',e:tw('🧺')},
  ],
  baby: [
    {n:'Baby Formula Stage 1',e:tw('🍼')},{n:'Baby Formula Stage 2',e:tw('🍼')},{n:'Baby Cereal',e:tw('🥣')},
    {n:'Baby Food Puree',e:tw('🥄')},{n:'Baby Biscuits',e:tw('🍪')},{n:'Diapers (S)',e:tw('👶')},
    {n:'Diapers (M)',e:tw('👶')},{n:'Diapers (L)',e:tw('👶')},{n:'Baby Wipes',e:tw('🧻')},{n:'Baby Shampoo',e:tw('🧴')},
    {n:'Baby Soap',e:tw('🧼')},{n:'Baby Oil',e:tw('🧴')},{n:'Baby Powder',e:tw('🌸')},{n:'Baby Lotion',e:tw('🧴')},
    {n:'Diaper Rash Cream',e:tw('🧴')},{n:'Baby Toothbrush',e:tw('🪥')},{n:'Baby Bottle',e:tw('🍼')},
    {n:'Pacifier',e:tw('🍼')},{n:'Baby Clothes',e:tw('👕')},
  ],
  pharmacy: [
    {n:'Paracetamol',e:tw('💊')},{n:'Ibuprofen',e:tw('💊')},{n:'Antacid',e:tw('💊')},{n:'ORS Sachet',e:tw('🧃')},
    {n:'Vitamin C',e:tw('💊')},{n:'Vitamin D3',e:tw('💊')},{n:'Multivitamin',e:tw('💊')},{n:'Calcium Tablets',e:tw('💊')},
    {n:'Iron Supplement',e:tw('💊')},{n:'Cough Syrup',e:tw('🧴')},{n:'Cold & Flu Tablets',e:tw('💊')},
    {n:'Antihistamine',e:tw('💊')},{n:'Eye Drops',e:tw('👁')},{n:'Nasal Drops',e:tw('💧')},{n:'Bandages',e:tw('🩹')},
    {n:'Cotton Wool',e:tw('🌿')},{n:'Dettol Antiseptic',e:tw('🧴')},{n:'Betadine',e:tw('🧴')},
    {n:'Hand Sanitizer',e:tw('🤲')},{n:'Face Masks',e:tw('😷')},{n:'BP Monitor',e:tw('💗')},
    {n:'Thermometer',e:tw('🌡')},{n:'Pulse Oximeter',e:tw('💗')},{n:'Glucometer Strips',e:tw('🩸')},
  ],
  frozen: [
    {n:'Frozen Green Peas',e:tw('🫛')},{n:'Frozen Sweet Corn',e:tw('🌽')},{n:'Frozen Mixed Veg',e:tw('🥦')},
    {n:'Frozen Spinach',e:tw('🥬')},{n:'Frozen Paneer',e:tw('🧀')},{n:'Frozen Parathas',e:tw('🫓')},
    {n:'Frozen Samosas',e:tw('🥟')},{n:'Frozen Spring Rolls',e:tw('🥟')},{n:'Frozen French Fries',e:tw('🍟')},
    {n:'Frozen Pizza',e:tw('🍕')},{n:'Frozen Burger Patty',e:tw('🍔')},{n:'Frozen Nuggets',e:tw('🍗')},
    {n:'Frozen Fish',e:tw('🐟')},{n:'Ice Cream (Vanilla)',e:tw('🍦')},{n:'Ice Cream (Choco)',e:tw('🍫')},
    {n:'Ice Cream (Strawberry)',e:tw('🍓')},{n:'Kulfi',e:tw('🍦')},{n:'Frozen Desserts',e:tw('🍮')},
  ],
  pet: [
    {n:'Dog Dry Food',e:tw('🐕')},{n:'Dog Wet Food',e:tw('🐕')},{n:'Cat Dry Food',e:tw('🐈')},{n:'Cat Wet Food',e:tw('🐈')},
    {n:'Fish Food',e:tw('🐠')},{n:'Bird Seeds',e:tw('🐦')},{n:'Dog Treats',e:tw('🦴')},{n:'Cat Treats',e:tw('🐟')},
    {n:'Pet Shampoo (Dog)',e:tw('🛁')},{n:'Pet Shampoo (Cat)',e:tw('🛁')},{n:'Dog Leash',e:tw('🔗')},
    {n:'Dog Collar',e:tw('🔗')},{n:'Cat Litter',e:tw('🪣')},{n:'Litter Tray',e:tw('🪣')},{n:'Pet Bed',e:tw('🛏')},
    {n:'Pet Toys (Ball)',e:tw('⚽')},{n:'Pet Toys (Rope)',e:tw('🪢')},{n:'Flea & Tick Spray',e:tw('🧴')},
    {n:'Deworming Tablets',e:tw('💊')},{n:'Pet Vitamins',e:tw('💧')},
  ],
  stationery: [
    {n:'Ball Pens (Blue)',e:tw('🖊')},{n:'Ball Pens (Black)',e:tw('🖊')},{n:'Gel Pens',e:tw('✒')},{n:'Pencils HB',e:tw('✏')},
    {n:'Pencils 2B',e:tw('✏')},{n:'Eraser',e:tw('🧹')},{n:'Sharpener',e:tw('✏')},{n:'Ruler',e:tw('📏')},
    {n:'Notebooks',e:tw('📓')},{n:'Register 200pg',e:tw('📔')},{n:'Register 400pg',e:tw('📔')},{n:'Drawing Book',e:tw('🎨')},
    {n:'Sketch Pens',e:tw('🖌')},{n:'Crayons',e:tw('🖍')},{n:'Stapler',e:tw('📎')},{n:'Staple Pins',e:tw('📎')},
    {n:'Paper Clips',e:tw('📎')},{n:'Glue Stick',e:tw('🖊')},{n:'Scissors',e:tw('✂')},{n:'Sticky Notes',e:tw('📝')},
    {n:'Highlighters',e:tw('🖊')},{n:'Files & Folders',e:tw('📁')},{n:'Envelopes',e:tw('✉')},{n:'Clear Tape',e:tw('📦')},
  ],
};

const STORE_TYPES = [
  { v:'kirana',    e:tw('🏪'), l:'Kirana / General Store' },
  { v:'super',     e:tw('🛒'), l:'Supermarket' },
  { v:'medical',   e:tw('💊'), l:'Medical Store' },
  { v:'bakery',    e:tw('🍞'), l:'Bakery & Confectionery' },
  { v:'fruits',    e:tw('🥬'), l:'Fruits & Vegetables' },
  { v:'dairy',     e:tw('🥛'), l:'Dairy & Milk Parlour' },
];

const AREAS_BY_DISTRICT = [
  { d: 'Delhi NCR', areas: [
    'Connaught Place','Karol Bagh','Lajpat Nagar','Saket','Vasant Kunj','Dwarka','Rohini',
    'Janakpuri','Preet Vihar','Mayur Vihar','Rajouri Garden','Pitampura',
    'Noida Sector 18','Noida Sector 62','Greater Noida','Gurgaon DLF','Gurgaon Cyber City',
    'Faridabad','Ghaziabad Vaishali','Indirapuram',
  ]},
  { d: 'Mumbai', areas: [
    'Andheri West','Andheri East','Bandra West','Juhu','Dadar','Kurla','Thane',
    'Borivali','Malad','Powai','Navi Mumbai','Kandivali','Goregaon','Mulund','Chembur',
  ]},
  { d: 'Bengaluru', areas: [
    'Koramangala','Indiranagar','Whitefield','HSR Layout','Jayanagar','Marathahalli',
    'Electronic City','Bannerghatta Road','Yelahanka','Rajajinagar','Malleshwaram','BTM Layout',
    'Hebbal','JP Nagar','Sarjapur Road','Bellandur',
  ]},
  { d: 'Hyderabad', areas: [
    'Banjara Hills','Jubilee Hills','Madhapur','Gachibowli','Secunderabad','Kukatpally',
    'LB Nagar','Uppal','Kompally','Begumpet','Ameerpet','Miyapur','HITEC City',
  ]},
  { d: 'Chennai', areas: [
    'Anna Nagar','T Nagar','Adyar','Velachery','OMR','Porur','Tambaram',
    'Perambur','Nungambakkam','Mylapore','Chromepet','Sholinganallur','Pallavaram',
  ]},
  { d: 'Kolkata', areas: [
    'Salt Lake','Park Street','New Town','Howrah','Jadavpur','Ballygunge',
    'Dum Dum','Behala','Ultadanga','Rajarhat','Gariahat','Tollygunge',
  ]},
  { d: 'Pune', areas: [
    'Kothrud','Hinjewadi','Wakad','Viman Nagar','Koregaon Park','Baner',
    'Hadapsar','Kharadi','Pimple Saudagar','Aundh','Kalyani Nagar','Shivajinagar',
  ]},
  { d: 'Ahmedabad', areas: [
    'SG Highway','Navrangpura','Satellite','Vastrapur','Prahlad Nagar','Bopal',
    'Chandkheda','Maninagar','Gota','Thaltej','Bodakdev','Motera',
  ]},
  { d: 'Jaipur', areas: [
    'Malviya Nagar','Vaishali Nagar','Jagatpura','Civil Lines','Mansarovar',
    'C-Scheme','Tonk Road','Ajmer Road','Sodala','Bapu Nagar','Sanganer',
  ]},
  { d: 'Lucknow', areas: [
    'Hazratganj','Gomti Nagar','Alambagh','Aliganj','Indira Nagar','Mahanagar',
    'Charbagh','Vibhuti Khand','Rajajipuram','Aminabad','Vikas Nagar',
  ]},
  { d: 'Chandigarh', areas: [
    'Sector 17','Sector 22','Sector 35','Sector 43','Mohali Phase 1','Mohali Phase 7',
    'Panchkula Sector 5','Panchkula Sector 15','Manimajra','Zirakpur','Aerocity',
  ]},
  { d: 'Surat', areas: [
    'Vesu','Adajan','Athwa Lines','Katargam','Varachha','Udhna','Althan','Piplod','Pal','Citylight',
  ]},
  { d: 'Nagpur', areas: [
    'Dharampeth','Sadar','Sitabuldi','Ramdaspeth','Ambazari','Hingna Road',
    'Wardha Road','Laxmi Nagar','Manish Nagar','Besa','Pratap Nagar',
  ]},
  { d: 'Indore', areas: [
    'Vijay Nagar','AB Road','LIG','MG Road','Rajwada','Palasia','Scheme 54','Rau','South Tukoganj',
  ]},
  { d: 'Bhopal', areas: [
    'Arera Colony','MP Nagar','Kolar Road','Gulmohar','Shahpura','Habibganj','Tulsi Nagar','Shyamla Hills',
  ]},
  { d: 'Patna', areas: [
    'Bailey Road','Boring Road','Kankarbagh','Rajendra Nagar','Fraser Road',
    'Patliputra Colony','Dak Bungalow','Exhibition Road','Saguna More',
  ]},
  { d: 'Kochi', areas: [
    'Ernakulam','Kakkanad','Edapally','Vyttila','Aluva','Thrippunithura',
    'Fort Kochi','Kaloor','Palarivattom','Kalamassery','Thevara',
  ]},
  { d: 'Visakhapatnam', areas: [
    'MVP Colony','Gajuwaka','Dwaraka Nagar','Madhurawada','Rushikonda',
    'Steel Plant Area','Seethammadhara','Siripuram','Old Town',
  ]},
  { d: 'Coimbatore', areas: [
    'RS Puram','Gandhipuram','Peelamedu','Saibaba Colony','Singanallur',
    'Tidel Park Area','Ondipudur','Kuniyamuthur','Goldwins',
  ]},
];

const inp = (err?: string): React.CSSProperties => ({
  width:'100%', padding:'12px 14px', borderRadius:10,
  border:`1.5px solid ${err?'#EF4444':BD}`, background:W,
  fontSize:14, color:T1, outline:'none', boxSizing:'border-box',
  transition:'border-color .15s, box-shadow .15s',
});

const STEPS = [
  { label:'Store Info',  icon:<Store size={14}/> },
  { label:'Categories',  icon:<Sparkles size={14}/> },
  { label:'Business',    icon:<FileText size={14}/> },
  { label:'Done',        icon:<Check size={14}/> },
];

function StepBar({ step }: { step: number }) {
  return (
    <div style={{ background:W, borderBottom:`1px solid ${BD}`, padding:'0 24px' }}>
      <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', padding:'16px 0', gap:0 }}>
        {STEPS.map((s,i) => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', flex: i<STEPS.length-1?1:'auto' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:64 }}>
              <motion.div animate={{ background: i<=step?G:BD, color: i<=step?'#fff':T3 }}
                style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:5, transition:'all .3s' }}>
                {i<step ? <Check size={15}/> : i===step ? s.icon : <span style={{fontSize:12,fontWeight:700}}>{i+1}</span>}
              </motion.div>
              <span style={{ fontSize:10.5, fontWeight: i<=step?700:500, color:i<=step?T1:T3, whiteSpace:'nowrap' }}>{s.label}</span>
            </div>
            {i<STEPS.length-1 && (
              <div style={{ flex:1, height:2, margin:'0 4px', marginBottom:18, background:i<step?G:BD, transition:'background .3s' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Store Info ─── */
function StoreInfoStep({ onNext }: { onNext:(d:object)=>void }) {
  const q = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({ name:'', area:'', address:'', ownerName: q.get('name') || '', phone: q.get('phone') || '', email: q.get('email') || '', type:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const f = (k:string, v:string) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:''})); };

  const validate = () => {
    const e:Record<string,string>={};
    if (!form.name.trim()) e.name='Store name required';
    if (!form.area) e.area='Select your area';
    if (!form.address.trim()) e.address='Address required';
    if (!form.ownerName.trim()) e.ownerName='Owner name required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone='Enter valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Enter a valid email address';
    if (!form.type) e.type='Select store type';
    return e;
  };

  const next = () => {
    const e = validate(); if (Object.keys(e).length){setErrors(e);return;}
    onNext(form);
  };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'1.55rem', color:T1, letterSpacing:'-.03em', marginBottom:6 }}>Tell us about your store</h2>
          <p style={{ color:T2, fontSize:14 }}>We'll use this to set up your listing on Zyphix</p>
        </div>

        {/* Store type */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:10 }}>Store Type</label>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {STORE_TYPES.map(({v,e,l})=>(
              <motion.button key={v} whileHover={{scale:1.03,y:-2}} whileTap={{scale:.97}}
                onClick={()=>f('type',v)}
                style={{ padding:'14px 10px', borderRadius:14, background:form.type===v?`${G}0F`:W, border:`2px solid ${form.type===v?G:BD}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:form.type===v?`0 0 0 3px ${G}1A`:SH, transition:'all .15s' }}>
                <img src={e} alt={l} draggable={false} style={{width:36,height:36,objectFit:'contain'}} />
                <span style={{fontSize:10.5,fontWeight:700,color:form.type===v?'#065F46':T2,lineHeight:1.3}}>{l}</span>
              </motion.button>
            ))}
          </div>
          {errors.type && <p style={{fontSize:11.5,color:'#EF4444',marginTop:6}}>{errors.type}</p>}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Store name */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Store Name</label>
            <input value={form.name} onChange={e=>f('name',e.target.value)} placeholder="e.g. Sharma Kirana Store"
              style={inp(errors.name)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.name?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.name && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.name}</p>}
          </div>

          {/* Area + Address */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Area / Colony</label>
              <select value={form.area} onChange={e=>f('area',e.target.value)}
                style={{...inp(errors.area), appearance:'none', cursor:'pointer', color:form.area?T1:T3}}>
                <option value="">Select district & locality</option>
                {AREAS_BY_DISTRICT.map(d=>(
                  <optgroup key={d.d} label={`── ${d.d} ──`}>
                    {d.areas.map(a=><option key={a} value={a}>{a}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.area && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.area}</p>}
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Full Address</label>
              <input value={form.address} onChange={e=>f('address',e.target.value)} placeholder="Shop no., street, landmark"
                style={inp(errors.address)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.address?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.address && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.address}</p>}
            </div>
          </div>

          {/* Owner + Phone */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Owner Name</label>
              <input value={form.ownerName} onChange={e=>f('ownerName',e.target.value)} placeholder="Your full name"
                style={inp(errors.ownerName)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.ownerName?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.ownerName && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.ownerName}</p>}
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Mobile Number</label>
              <input value={form.phone} onChange={e=>f('phone',e.target.value)} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number"
                style={inp(errors.phone)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.phone?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.phone && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:5 }}>Email Address <span style={{color:T2,fontWeight:400,fontSize:11}}>(optional)</span></label>
            <input value={form.email} onChange={e=>f('email',e.target.value)} type="email" inputMode="email" placeholder="you@example.com — for confirmation email"
              style={inp(errors.email)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.email?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.email && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.email}</p>}
          </div>
        </div>

        <motion.button onClick={next} whileHover={{scale:1.02}} whileTap={{scale:.97}}
          style={{ width:'100%', marginTop:28, padding:'15px', borderRadius:13, background:G, color:'#fff', fontSize:15.5, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 6px 24px ${G}45` }}>
          Continue to Categories <ArrowRight size={16}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Step 2: Categories ─── */
function CategoriesStep({ onNext, onBack }: { onNext:(s:Set<string>, subs:Record<string,Set<string>>)=>void; onBack:()=>void }) {
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [expandedCat, setExpandedCat] = useState<string|null>(null);
  const [selectedSubs, setSelectedSubs] = useState<Record<string,Set<string>>>({});
  const [customInput, setCustomInput] = useState<Record<string,string>>({});
  const [customItems, setCustomItems] = useState<Record<string,string[]>>({});

  const getSubs = (id:string): Set<string> => selectedSubs[id] ?? new Set();
  const totalItems = Object.values(selectedSubs).reduce((acc,s)=>acc+s.size,0);

  const handleCatClick = (id:string) => {
    if (expandedCat === id) { setExpandedCat(null); return; }
    setExpandedCat(id);
    setSelectedCats(prev => { const n=new Set(prev); n.add(id); return n; });
  };

  const toggleSub = (catId:string, item:string) => {
    setSelectedSubs(prev => {
      const cur = new Set(prev[catId] ?? []);
      cur.has(item) ? cur.delete(item) : cur.add(item);
      return {...prev, [catId]: cur};
    });
    setSelectedCats(prev => { const n=new Set(prev); n.add(catId); return n; });
  };

  const addAll = (catId:string) => {
    const all = new Set((SUB_CATS[catId] ?? []).map(s=>s.n));
    setSelectedSubs(prev => ({...prev, [catId]: all}));
    setSelectedCats(prev => { const n=new Set(prev); n.add(catId); return n; });
  };

  const clearAll = (catId:string) => {
    setSelectedSubs(prev => ({...prev, [catId]: new Set()}));
  };

  const addCustomItem = (catId:string) => {
    const val = (customInput[catId] ?? '').trim();
    if (!val) return;
    setCustomItems(prev => ({ ...prev, [catId]: [...(prev[catId] ?? []), val] }));
    setSelectedSubs(prev => {
      const cur = new Set(prev[catId] ?? []);
      cur.add(val);
      return { ...prev, [catId]: cur };
    });
    setSelectedCats(prev => { const n=new Set(prev); n.add(catId); return n; });
    setCustomInput(prev => ({ ...prev, [catId]: '' }));
  };

  const removeCustomItem = (catId:string, item:string) => {
    setCustomItems(prev => ({ ...prev, [catId]: (prev[catId] ?? []).filter(i=>i!==item) }));
    setSelectedSubs(prev => {
      const cur = new Set(prev[catId] ?? []);
      cur.delete(item);
      return { ...prev, [catId]: cur };
    });
  };

  const expandedCatData = expandedCat ? CATS.find(c=>c.id===expandedCat) : null;
  const expandedSubs    = expandedCat ? (SUB_CATS[expandedCat] ?? []) : [];
  const expandedSelSet  = expandedCat ? getSubs(expandedCat) : new Set<string>();

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'1.55rem', color:T1, letterSpacing:'-.03em', marginBottom:6 }}>What do you sell?</h2>
        <p style={{ color:T2, fontSize:14 }}>Tap a category to pick the exact items — or use "Add All"</p>
        {totalItems>0 && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            style={{ display:'inline-flex', alignItems:'center', gap:7, background:`${G}12`, border:`1px solid ${G}35`, color:G, fontSize:12.5, fontWeight:700, padding:'5px 14px', borderRadius:99, marginTop:10 }}>
            <Check size={13}/> {totalItems} items across {selectedCats.size} {selectedCats.size===1?'category':'categories'}
          </motion.div>
        )}
      </div>

      {/* Category grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10, marginBottom:16 }}>
        {CATS.map(({id,e,n,c,bg},i)=>{
          const isExpanded = expandedCat === id;
          const subCount   = getSubs(id).size;
          const hasItems   = subCount > 0;
          return (
            <motion.button key={id}
              initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.03,type:'spring',stiffness:200}}
              whileHover={{scale:1.03,y:-2}} whileTap={{scale:.97}}
              onClick={()=>handleCatClick(id)}
              style={{ padding:'14px 8px 12px', borderRadius:14, background:isExpanded||hasItems?bg:W, border:`2px solid ${isExpanded||hasItems?c:BD}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:isExpanded||hasItems?`0 4px 16px ${c}25`:SH, transition:'all .15s', position:'relative' }}>
              {hasItems && (
                <div style={{ position:'absolute', top:6, right:6, minWidth:20, height:20, borderRadius:99, background:c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff', padding:'0 5px' }}>
                  {subCount}
                </div>
              )}
              <img src={e} alt={n} draggable={false} style={{width:34,height:34,objectFit:'contain'}} />
              <span style={{fontSize:10.5,fontWeight:700,color:isExpanded||hasItems?c:T2,lineHeight:1.3}}>{n}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Subcategory panel */}
      <AnimatePresence>
        {expandedCat && expandedCatData && (
          <motion.div
            key={expandedCat}
            initial={{opacity:0,y:-12,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:.98}}
            transition={{type:'spring',stiffness:260,damping:22}}
            style={{ background:expandedCatData.bg, border:`2px solid ${expandedCatData.c}40`, borderRadius:18, padding:'18px 20px', marginBottom:20, boxShadow:`0 8px 32px ${expandedCatData.c}18` }}>
            {/* Panel header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <img src={expandedCatData.e} alt="" draggable={false} style={{width:28,height:28,objectFit:'contain'}} />
                <div>
                  <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14.5, color:T1, marginBottom:1 }}>{expandedCatData.n}</p>
                  <p style={{ fontSize:11.5, color:T2 }}>{expandedSelSet.size} of {expandedSubs.length} items selected</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {expandedSelSet.size < expandedSubs.length ? (
                  <button onClick={()=>addAll(expandedCat)}
                    style={{ padding:'6px 14px', borderRadius:99, background:expandedCatData.c, color:'#fff', fontSize:12, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                    <Check size={12}/> Add All
                  </button>
                ) : (
                  <button onClick={()=>clearAll(expandedCat)}
                    style={{ padding:'6px 14px', borderRadius:99, background:'#EF4444', color:'#fff', fontSize:12, fontWeight:800, border:'none', cursor:'pointer' }}>
                    Clear All
                  </button>
                )}
                <button onClick={()=>setExpandedCat(null)}
                  style={{ padding:'6px 12px', borderRadius:99, background:'rgba(0,0,0,.08)', color:T1, fontSize:12, fontWeight:700, border:'none', cursor:'pointer' }}>
                  Done ✓
                </button>
              </div>
            </div>

            {/* Item tiles */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))', gap:8, marginBottom:14 }}>
              {expandedSubs.map(({n:item, e:icon}) => {
                const on = expandedSelSet.has(item);
                return (
                  <motion.button key={item} whileHover={{scale:1.05,y:-2}} whileTap={{scale:.96}}
                    onClick={()=>toggleSub(expandedCat, item)}
                    style={{ padding:'12px 6px 10px', borderRadius:12, background:on?expandedCatData.c:'rgba(255,255,255,.9)', border:`2px solid ${on?expandedCatData.c:BD}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:on?`0 4px 14px ${expandedCatData.c}40`:SH, transition:'all .12s', position:'relative' }}>
                    {on && (
                      <div style={{ position:'absolute', top:5, right:5, width:16, height:16, borderRadius:'50%', background:'rgba(255,255,255,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={10} color="#fff" strokeWidth={3.5}/>
                      </div>
                    )}
                    <img src={icon} alt={item} draggable={false} style={{width:30,height:30,objectFit:'contain'}} />
                    <span style={{fontSize:10,fontWeight:700,color:on?'#fff':T2,lineHeight:1.25,wordBreak:'break-word'}}>{item}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom items already added */}
            {(customItems[expandedCat] ?? []).length > 0 && (
              <div style={{ marginBottom:10 }}>
                <p style={{ fontSize:11, fontWeight:700, color:T3, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8 }}>Your custom items</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {(customItems[expandedCat] ?? []).map(item => (
                    <span key={item} style={{ display:'inline-flex', alignItems:'center', gap:6, background:expandedCatData.c, color:'#fff', fontSize:12, fontWeight:700, padding:'5px 10px 5px 12px', borderRadius:99 }}>
                      ✏️ {item}
                      <button onClick={()=>removeCustomItem(expandedCat, item)}
                        style={{ background:'rgba(255,255,255,.25)', border:'none', borderRadius:'50%', width:16, height:16, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff', padding:0, lineHeight:1 }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add custom item input */}
            <div style={{ borderTop:`1px dashed ${expandedCatData.c}40`, paddingTop:12, marginTop:4 }}>
              <p style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:8 }}>+ Add your own item not listed above</p>
              <div style={{ display:'flex', gap:8 }}>
                <input
                  value={customInput[expandedCat] ?? ''}
                  onChange={e=>setCustomInput(prev=>({...prev, [expandedCat]:e.target.value}))}
                  onKeyDown={e=>{ if(e.key==='Enter') addCustomItem(expandedCat); }}
                  placeholder={`e.g. "Organic Tomato", "Buffalo Milk"…`}
                  style={{ flex:1, padding:'9px 13px', borderRadius:10, border:`1.5px solid ${expandedCatData.c}50`, background:'rgba(255,255,255,.9)', fontSize:13, color:T1, outline:'none' }}
                  onFocus={e=>{e.target.style.borderColor=expandedCatData.c; e.target.style.boxShadow=`0 0 0 3px ${expandedCatData.c}25`;}}
                  onBlur={e=>{e.target.style.borderColor=`${expandedCatData.c}50`; e.target.style.boxShadow='none';}}
                />
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}}
                  onClick={()=>addCustomItem(expandedCat)}
                  style={{ padding:'9px 18px', borderRadius:10, background:expandedCatData.c, color:'#fff', fontSize:13, fontWeight:800, border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>
                  Add ✓
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onBack}
          style={{ padding:'14px 22px', borderRadius:12, background:W, border:`1.5px solid ${BD}`, color:T2, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <ArrowLeft size={15}/> Back
        </button>
        <motion.button onClick={()=>onNext(selectedCats, selectedSubs)} whileHover={{scale:1.02}} whileTap={{scale:.97}}
          style={{ flex:1, padding:'15px', borderRadius:13, background: selectedCats.size>0?G:'#9CA3AF', color:'#fff', fontSize:15, fontWeight:800, border:'none', cursor: selectedCats.size>0?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background .2s', boxShadow: selectedCats.size>0?`0 6px 24px ${G}45`:'none' }}>
          Continue {totalItems>0?`(${totalItems} items)`:''} <ArrowRight size={16}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: Business Details ─── */
function BusinessStep({ onNext, onBack, submitting }: { onNext:()=>void; onBack:()=>void; submitting?:boolean }) {
  const [hasGst, setHasGst] = useState<boolean|null>(null);
  const [gst, setGst] = useState('');
  const [timings, setTimings] = useState({ open:'08:00', close:'22:00' });
  const [days, setDays] = useState<Set<string>>(new Set(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']));
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const toggleDay = (d:string)=>setDays(p=>{const n=new Set(p);n.has(d)?n.delete(d):n.add(d);return n;});

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'1.55rem', color:T1, letterSpacing:'-.03em', marginBottom:6 }}>Business Details</h2>
          <p style={{ color:T2, fontSize:14 }}>Almost done — tell us your working hours and tax info</p>
        </div>

        {/* Working Days */}
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:10 }}>Open Days</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {DAYS.map(d=>{
              const on=days.has(d);
              return (
                <motion.button key={d} whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=>toggleDay(d)}
                  style={{ padding:'8px 14px', borderRadius:99, background:on?G:W, border:`1.5px solid ${on?G:BD}`, color:on?'#fff':T2, fontSize:12.5, fontWeight:700, cursor:'pointer', transition:'all .15s', boxShadow:on?`0 2px 8px ${G}35`:SH }}>
                  {d}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hours */}
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:10 }}>
            <Clock size={12} style={{display:'inline',marginRight:5}} />Opening Hours
          </label>
          <div style={{ display:'flex', alignItems:'center', gap:16, background:W, border:`1.5px solid ${BD}`, borderRadius:12, padding:'14px 18px', boxShadow:SH }}>
            <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
              <span style={{ fontSize:11, fontWeight:700, color:T3, textTransform:'uppercase' }}>Opens At</span>
              <input type="time" value={timings.open} onChange={e=>setTimings(p=>({...p,open:e.target.value}))}
                style={{ border:'none', outline:'none', fontSize:20, fontWeight:800, color:T1, background:'transparent', cursor:'pointer' }} />
            </div>
            <div style={{ width:1, height:40, background:BD }} />
            <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
              <span style={{ fontSize:11, fontWeight:700, color:T3, textTransform:'uppercase' }}>Closes At</span>
              <input type="time" value={timings.close} onChange={e=>setTimings(p=>({...p,close:e.target.value}))}
                style={{ border:'none', outline:'none', fontSize:20, fontWeight:800, color:T1, background:'transparent', cursor:'pointer' }} />
            </div>
          </div>
        </div>

        {/* GST */}
        <div style={{ marginBottom:28 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T2, textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:10 }}>Do you have a GST number?</label>
          <div style={{ display:'flex', gap:10, marginBottom: hasGst?14:0 }}>
            {[{v:true,l:'Yes, I have GST'},{v:false,l:'No, not registered'}].map(({v,l})=>(
              <motion.button key={String(v)} whileHover={{scale:1.02}} whileTap={{scale:.97}}
                onClick={()=>setHasGst(v)}
                style={{ flex:1, padding:'13px', borderRadius:12, background:hasGst===v?(v?`${G}0F`:'#FFF1F2'):W, border:`2px solid ${hasGst===v?(v?G:'#EF4444'):BD}`, color:hasGst===v?(v?'#065F46':'#9F1239'):T2, fontSize:13.5, fontWeight:700, cursor:'pointer', transition:'all .15s', boxShadow:SH }}>
                {l}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {hasGst && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
                <input value={gst} onChange={e=>setGst(e.target.value.toUpperCase())} placeholder="GST Number (e.g. 01ABCDE1234F1Z5)"
                  style={{...inp(), marginTop:8}} maxLength={15}
                  onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                  onBlur={e=>{e.target.style.borderColor=BD;e.target.style.boxShadow='none';}} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onBack}
            style={{ padding:'14px 22px', borderRadius:12, background:W, border:`1.5px solid ${BD}`, color:T2, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <ArrowLeft size={15}/> Back
          </button>
          <motion.button onClick={onNext} disabled={submitting} whileHover={{scale:submitting?1:1.02}} whileTap={{scale:submitting?1:.97}}
            style={{ flex:1, padding:'15px', borderRadius:13, background:submitting?'#6B7280':G, color:'#fff', fontSize:15.5, fontWeight:800, border:'none', cursor:submitting?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 6px 24px ${G}45`, opacity:submitting?.7:1 }}>
            {submitting ? 'Submitting…' : <>Submit Store Registration <ArrowRight size={16}/></>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Confetti Celebration ─── */
function FlowerBurst() {
  useEffect(() => {
    if (!document.getElementById('confetti-anim')) {
      const s = document.createElement('style');
      s.id = 'confetti-anim';
      s.textContent =
        '@keyframes cFall{from{transform:translateY(-60px) translateX(0);opacity:1;}to{transform:translateY(110vh) translateX(var(--cx));opacity:0;}}' +
        '@keyframes cFlip{0%,100%{transform:rotate(0deg) scaleX(1);}50%{transform:rotate(var(--ch)) scaleX(0);}}';
      document.head.appendChild(s);
    }
  }, []);
  const pieces = useMemo(() => {
    const C = ['#16a34a','#22c55e','#4ade80','#f59e0b','#fbbf24','#ffffff','#f97316','#c084fc','#bbf7d0','#fde68a','#34d399','#fb923c'];
    return Array.from({length:80}, (_, i) => {
      const isCircle = i % 6 === 0;
      const isStrip  = i % 8 === 1;
      return {
        id: i,
        color: C[i % C.length],
        isCircle, isStrip,
        left: Math.random() * 100,
        delay: Math.random() * 4.5,
        duration: 3 + Math.random() * 2.5,
        flipDur: 0.28 + Math.random() * 0.44,
        w: isStrip ? 3 : isCircle ? 5 + Math.floor(Math.random() * 4) : 7 + Math.floor(Math.random() * 5),
        h: isStrip ? 18 + Math.floor(Math.random() * 10) : 9 + Math.floor(Math.random() * 6),
        dx: (Math.random() - 0.5) * 200,
        ch: (Math.random() > 0.5 ? 1 : -1) * 90,
      };
    });
  }, []);
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9999,overflow:'hidden'}}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', top:0, left:`${p.left}%`,
          animation:`cFall ${p.duration}s ${p.delay}s linear forwards`,
          '--cx':`${p.dx}px`,
        } as React.CSSProperties}>
          <div style={{
            width:p.w,
            height:p.isCircle ? p.w : p.h,
            background:p.color,
            borderRadius:p.isCircle ? '50%' : p.isStrip ? 1 : 2,
            boxShadow:p.isCircle ? `0 0 4px ${p.color}80` : 'none',
            animation:`cFlip ${p.flipDur}s ${p.delay}s ease-in-out infinite`,
            '--ch':`${p.ch}deg`,
          } as React.CSSProperties} />
        </div>
      ))}
    </div>
  );
}

/* ─── PDF export helper ─── */
function escHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function exportMerchantPDF(storeData: Record<string,string>, categories: Set<string>, selectedSubs: Record<string,Set<string>>) {
  const ref = 'ZYX-M-' + Date.now().toString(36).toUpperCase();
  const date = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

  const catRows = [...categories].map(id => {
    const cat = CATS.find(c => c.id === id);
    if (!cat) return '';
    const items = [...(selectedSubs[id] ?? [])];
    return `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-weight:700;color:#111827;vertical-align:top;">${escHtml(cat.n)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;">${items.length > 0 ? escHtml(items.join(', ')) : '<em>All items</em>'}</td>
      </tr>`;
  }).join('');

  const logoSVG = `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><rect width="44" height="44" rx="10" fill="#0DA366"/><text x="22" y="30" text-anchor="middle" font-size="19" font-weight="900" font-style="italic" fill="white" letter-spacing="-1" font-family="Arial,sans-serif">//</text></svg>`;

  const storeRows = [
    ['Store Name',   storeData.name  || '—'],
    ['Owner Name',   storeData.owner || '—'],
    ['Mobile',       storeData.phone || '—'],
    ['Area / Colony',storeData.area  || '—'],
    ['Full Address', storeData.address || '—'],
    ['Store Type',   storeData.type  || '—'],
  ].map(([label, val], i) =>
    `<tr style="background:${i%2===0?'#fff':'#F9FAFB'}">
      <td style="padding:11px 16px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;width:38%;border-right:1px solid #F3F4F6;">${escHtml(label)}</td>
      <td style="padding:11px 16px;font-size:13.5px;font-weight:600;color:#111827;">${escHtml(val)}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Store Registration – ZYPHIX</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,Arial,sans-serif;}
  body{background:#fff;color:#111827;max-width:820px;margin:0 auto;}
  .banner{background:linear-gradient(135deg,#0A0E1A 0%,#101828 100%);padding:26px 36px;display:flex;align-items:center;justify-content:space-between;}
  .logo-row{display:flex;align-items:center;gap:12px;}
  .wordmark{font-size:28px;font-weight:900;letter-spacing:-.05em;line-height:1;}
  .wordmark .g{color:#0DA366;font-style:italic;}
  .wordmark .w{color:#ffffff;}
  .doc-label{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:4px;letter-spacing:.04em;text-transform:uppercase;}
  .status-pill{background:#0DA366;color:#fff;font-size:11px;font-weight:800;padding:7px 18px;border-radius:99px;letter-spacing:.04em;}
  .body{padding:32px 36px 28px;}
  .doc-title{font-size:24px;font-weight:900;color:#111827;letter-spacing:-.03em;margin-bottom:4px;}
  .submitted{font-size:12.5px;color:#6B7280;margin-bottom:18px;}
  .ref-box{display:inline-flex;align-items:center;gap:10px;background:#ECFDF5;border:1.5px solid #6EE7B7;border-radius:10px;padding:10px 18px;margin-bottom:28px;}
  .ref-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9CA3AF;}
  .ref-value{font-size:14px;font-weight:900;color:#0DA366;letter-spacing:.02em;}
  .sec-head{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:#9CA3AF;border-top:1px solid #E5E7EB;padding-top:18px;margin-bottom:12px;}
  .info-table{width:100%;border-collapse:collapse;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:24px;}
  .cat-table{width:100%;border-collapse:collapse;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:24px;}
  .cat-table th{background:#F9FAFB;text-align:left;padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6B7280;border-bottom:1px solid #E5E7EB;}
  .cat-table td{padding:10px 16px;border-bottom:1px solid #F3F4F6;font-size:12.5px;vertical-align:top;}
  .cat-table td:first-child{font-weight:700;color:#111827;width:32%;background:#FAFAFA;}
  .cat-table td:last-child{color:#4B5563;}
  .next-box{background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1.5px solid #6EE7B7;border-radius:12px;padding:18px 20px;margin-bottom:24px;}
  .next-title{font-size:12px;font-weight:800;color:#065F46;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;}
  .step{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;}
  .step-num{width:22px;height:22px;border-radius:50%;background:#0DA366;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
  .step-text{font-size:12.5px;color:#065F46;font-weight:600;line-height:1.5;}
  .footer{border-top:1px solid #E5E7EB;padding:16px 36px;display:flex;align-items:center;justify-content:space-between;}
  .footer-left{font-size:10.5px;color:#9CA3AF;line-height:1.65;}
  .footer-right{font-size:10px;color:#D1D5DB;text-align:right;}
  @media print{body{max-width:100%;}@page{margin:10mm 12mm;}}
</style></head><body>

<div class="banner">
  <div class="logo-row">
    ${logoSVG}
    <div>
      <div class="wordmark"><span class="g">ZYPH</span><span class="w">IX</span></div>
      <div class="doc-label">Merchant Partner Document</div>
    </div>
  </div>
  <div class="status-pill">✓ Registration Received</div>
</div>

<div class="body">
  <div class="doc-title">Store Registration</div>
  <div class="submitted">Submitted on ${date} &nbsp;·&nbsp; Clavix Technologies Pvt. Ltd., India</div>

  <div class="ref-box">
    <div>
      <div class="ref-label">Reference Number</div>
      <div class="ref-value">${ref}</div>
    </div>
  </div>

  <div class="sec-head">Store Details</div>
  <table class="info-table">${storeRows}</table>

  ${categories.size > 0 ? `
  <div class="sec-head">Categories &amp; Items (${categories.size} categories)</div>
  <table class="cat-table">
    <tr><th>Category</th><th>Selected Items</th></tr>
    ${catRows}
  </table>` : ''}

  <div class="next-box">
    <div class="next-title">What Happens Next</div>
    <div class="step"><div class="step-num">1</div><div class="step-text">Our team verifies your store and calls you on <strong>${storeData.phone || 'your number'}</strong> within 24-48 hours</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-text">We help you set up your product catalogue with photos and pricing</div></div>
    <div class="step"><div class="step-num">3</div><div class="step-text">Your store goes live on ZyphixNow and starts receiving delivery orders!</div></div>
  </div>
</div>

<div class="footer">
  <div class="footer-left">
    This is an auto-generated registration confirmation. Keep it for your records.<br/>
    Zyphix · Clavix Technologies Pvt. Ltd. · India · <strong>wa.me/919682394363</strong>
  </div>
  <div class="footer-right">ZyphixNow Merchant Program<br/>${date}</div>
</div>

<script>window.onload=()=>{window.print();}</script>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}

/* ─── Step 4: Success ─── */
function SuccessStep({ storeData, categories, selectedSubs }: { storeData: Record<string,string>; categories: Set<string>; selectedSubs: Record<string,Set<string>> }) {
  const [, setLoc] = useLocation();
  return (
    <>
    <FlowerBurst />
    <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:180}}
      style={{ maxWidth:540, margin:'0 auto', textAlign:'center', padding:'20px 0' }}>
      <motion.div animate={{rotate:[0,12,-12,8,-6,0],scale:[1,1.3,1]}} transition={{duration:.8}}
        style={{fontSize:64,marginBottom:20}}>🏪</motion.div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'1.8rem', color:T1, letterSpacing:'-.03em', marginBottom:10 }}>
        {storeData.name || 'Your Store'} is registered!
      </h2>
      <p style={{ color:T2, fontSize:14.5, lineHeight:1.7, marginBottom:28 }}>
        We've received your registration. Our team will contact you on <strong>{storeData.phone}</strong> to verify your store and set up your Zyphix listing.
      </p>

      {/* Categories summary */}
      {categories.size>0 && (
        <div style={{ background:W, borderRadius:16, padding:'18px 20px', border:`1px solid ${BD}`, boxShadow:SH, marginBottom:20, textAlign:'left' }}>
          <p style={{ fontSize:12, fontWeight:700, color:T3, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:12 }}>Categories Selected ({categories.size})</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {[...categories].map(id=>{
              const cat = CATS.find(c=>c.id===id);
              if (!cat) return null;
              return (
                <span key={id} style={{ display:'inline-flex', alignItems:'center', gap:5, background:cat.bg, border:`1px solid ${cat.c}30`, color:cat.c, fontSize:12, fontWeight:700, padding:'5px 11px', borderRadius:99 }}>
                  {cat.n}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* How Zyphix helps merchants grow */}
      <div style={{ background:'linear-gradient(135deg,#0A0E1A,#0D1520)', borderRadius:20, padding:'22px 22px', marginBottom:20, textAlign:'left' }}>
        <p style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:14, textAlign:'center' }}>🚀 How Zyphix grows your kirana business</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { icon:'📈', title:'3× More Sales',   desc:'Reach customers who can\'t visit your store — online orders add 30–60% revenue' },
            { icon:'💰', title:'₹0 Setup Cost',   desc:'No monthly fee, no listing charge. We earn only when you earn — tiny commission per order' },
            { icon:'⚡', title:'Live in 24 Hours', desc:'Once verified, your store is searchable on Zyphix and begins receiving orders' },
            { icon:'📦', title:'Delivery Handled', desc:'Our fleet covers your area — you focus on the store, we handle the last mile' },
          ].map(({ icon, title, desc }) => (
            <motion.div key={title} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:13, padding:'13px 13px' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
              <p style={{ fontWeight:800, color:'#fff', fontSize:12.5, marginBottom:4 }}>{title}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,.48)', lineHeight:1.55 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ background:`${G}0C`, border:`1.5px solid ${G}30`, borderRadius:14, padding:'16px 20px', marginBottom:24 }}>
        <p style={{ fontSize:13, color:G, fontWeight:700, marginBottom:8 }}>⏱ What happens next?</p>
        <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
          {['Our team verifies your store (24-48 hrs)','We help you set up your product catalogue','Your store goes live on Zyphix!'].map((s,i)=>(
            <li key={i} style={{ fontSize:13, color:T2, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:18, height:18, borderRadius:'50%', background:G, color:'#fff', fontSize:10, fontWeight:900, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
        <motion.button onClick={()=>exportMerchantPDF(storeData, categories, selectedSubs)} whileHover={{scale:1.03}} whileTap={{scale:.97}}
          style={{ padding:'13px 24px', borderRadius:12, background:W, border:`2px solid ${G}`, color:G, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:SH }}>
          <FileDown size={17}/> Export to PDF
        </motion.button>
        <motion.button onClick={()=>setLoc('/')} whileHover={{scale:1.02}} whileTap={{scale:.97}}
          style={{ padding:'13px 24px', borderRadius:12, background:G, color:'#fff', fontSize:14, fontWeight:800, border:'none', cursor:'pointer', boxShadow:`0 4px 20px ${G}40` }}>
          Back to Home
        </motion.button>
      </div>
    </motion.div>
    </>
  );
}

/* ─── Main Page ─── */
export function MerchantSetup() {
  const [step, setStep] = useState(0);
  const [storeData, setStoreData] = useState<Record<string,string>>({});
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [selectedSubs, setSelectedSubs] = useState<Record<string,Set<string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [, setLoc] = useLocation();

  const handleStoreNext = (d: object) => { setStoreData(d as Record<string,string>); setStep(1); window.scrollTo(0,0); };
  const handleCatsNext  = (s: Set<string>, subs: Record<string,Set<string>>) => { setCategories(s); setSelectedSubs(subs); setStep(2); window.scrollTo(0,0); };
  const handleBizNext   = async () => {
    setSubmitting(true); setSubmitError('');
    try {
      const catSummary = [...categories].map(id => {
        const items = [...(selectedSubs[id] ?? [])];
        return items.length ? `${id}: ${items.join(', ')}` : id;
      }).join(' | ');
      await fetch('/api/partner-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storeData.ownerName || storeData.name,
          email: storeData.email,
          phone: storeData.phone,
          city: storeData.area || 'India',
          role: 'merchant',
          details: {
            storeName: storeData.name,
            storeType: storeData.type,
            address: storeData.address,
            categories: [...categories].join(', '),
            itemsSummary: catSummary,
          },
        }),
      });
    } catch { /* non-blocking — still show success */ }
    setSubmitting(false);
    setStep(3); window.scrollTo(0,0);
  };

  return (
    <div style={{ background:BG, minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:W, borderBottom:`1px solid ${BD}`, padding:'0 24px', position:'sticky', top:0, zIndex:50, boxShadow:SH }}>
        <div style={{ maxWidth:1100, margin:'0 auto', height:60, display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={()=>setLoc('/')} style={{ background:BG, border:`1px solid ${BD}`, borderRadius:8, padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:T2, fontSize:13, fontWeight:600 }}>
            <ArrowLeft size={14}/> Home
          </button>
          <ZyphixLogo size={30} />
          <div style={{ height:20, width:1, background:BD }} />
          <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14.5, color:T1 }}>Register Your Store</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, background:`${G}10`, border:`1px solid ${G}30`, borderRadius:99, padding:'5px 14px' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:G, display:'inline-block' }} />
            <span style={{ fontSize:12, fontWeight:700, color:G }}>Partner Program Open</span>
          </div>
        </div>
      </div>

      <StepBar step={step} />

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'36px 24px 80px' }}>
        <AnimatePresence mode="wait">
          {step===0 && <StoreInfoStep key="s0" onNext={handleStoreNext} />}
          {step===1 && <CategoriesStep key="s1" onNext={handleCatsNext} onBack={()=>{setStep(0);window.scrollTo(0,0);}} />}
          {step===2 && <BusinessStep key="s2" onNext={handleBizNext} onBack={()=>{setStep(1);window.scrollTo(0,0);}} submitting={submitting} />}
          {step===3 && <SuccessStep key="s3" storeData={storeData} categories={categories} selectedSubs={selectedSubs} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
