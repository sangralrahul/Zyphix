"""Catalogue for the categories that had no products yet (and the four added to match the
full quick-commerce range). Writes db/more-products.sql; run it after db/seed.sql.
Run from artifacts/zyphix:  python3 scripts/catalog/more_products.py"""
import pathlib

GROCER, PHARMA, PROVISION = ('Sharma General Store', '0.3 km'), ('MedPlus Pharmacy', '0.5 km'), ('Rajan Provision Store', '0.2 km')

# category: (store, [(name, brand, weight, price, mrp)])
DATA = {
 'Noodles & Pasta': (GROCER, [
  ('Maggi 2-Minute Masala Noodles', 'Maggi', '280 g', 56, 60), ('Maggi 2-Minute Masala Noodles', 'Maggi', '560 g', 108, 120),
  ('Yippee Magic Masala Noodles', 'Sunfeast', '240 g', 50, 55), ('Top Ramen Curry Noodles', 'Nissin', '280 g', 54, 60),
  ('Ching\'s Hot Garlic Instant Noodles', 'Ching\'s Secret', '240 g', 58, 65), ('Ching\'s Hakka Noodles', 'Ching\'s Secret', '150 g', 35, 40),
  ('Knorr Soupy Noodles Mast Masala', 'Knorr', '282 g', 62, 70), ('Cup Noodles Mazedaar Masala', 'Nissin', '70 g', 48, 50),
  ('Bambino Vermicelli', 'Bambino', '400 g', 45, 50), ('Del Monte Penne Rigate Pasta', 'Del Monte', '500 g', 99, 125),
  ('Del Monte Fusilli Pasta', 'Del Monte', '500 g', 99, 125), ('Disano Durum Wheat Spaghetti', 'Disano', '500 g', 135, 160),
  ('Sunfeast Pasta Treat Tomato Cheese', 'Sunfeast', '65 g', 25, 25), ('Wai Wai Instant Noodles', 'Wai Wai', '300 g', 60, 65),
 ]),
 'Ready to Cook & Eat': (GROCER, [
  ('MTR Ready to Eat Dal Makhani', 'MTR', '300 g', 120, 135), ('MTR Ready to Eat Paneer Butter Masala', 'MTR', '300 g', 145, 160),
  ('MTR Ready to Eat Rajma Masala', 'MTR', '300 g', 105, 115), ('Haldiram\'s Minute Khana Dal Makhani', 'Haldiram\'s', '300 g', 110, 125),
  ('Gits Gulab Jamun Mix', 'Gits', '200 g', 105, 115), ('Gits Rava Idli Mix', 'Gits', '200 g', 72, 80),
  ('MTR Rava Dosa Mix', 'MTR', '500 g', 135, 150), ('Kohinoor Biryani Kit Hyderabadi', 'Kohinoor', '350 g', 160, 199),
  ('Knorr Classic Tomato Soup', 'Knorr', '53 g', 60, 65), ('Knorr Sweet Corn Veg Soup', 'Knorr', '42 g', 60, 65),
  ('Aashirvaad Instant Poha', 'Aashirvaad', '70 g', 30, 30), ('Saffola Masala Oats Classic', 'Saffola', '500 g', 189, 215),
 ]),
 'Organic & Healthy': (GROCER, [
  ('24 Mantra Organic Toor Dal', '24 Mantra', '1 kg', 205, 245), ('24 Mantra Organic Sonamasoori Rice', '24 Mantra', '1 kg', 110, 130),
  ('Organic Tattva Organic Jaggery Powder', 'Organic Tattva', '500 g', 95, 110), ('Organic India Tulsi Green Tea', 'Organic India', '25 bags', 175, 195),
  ('True Elements Rolled Oats', 'True Elements', '1.2 kg', 299, 399), ('True Elements Chia Seeds', 'True Elements', '250 g', 189, 225),
  ('Yoga Bar Multigrain Energy Bar', 'Yoga Bar', '6 x 38 g', 225, 250), ('Kellogg\'s Muesli Fruit & Nut', 'Kellogg\'s', '500 g', 330, 390),
  ('Pintola All Natural Peanut Butter Crunchy', 'Pintola', '1 kg', 379, 450), ('Too Yumm Quinoa Puffs', 'Too Yumm', '54 g', 30, 30),
  ('Conscious Food Organic Ragi Flour', 'Conscious Food', '500 g', 89, 99), ('Slurrp Farm Millet Pancake Mix', 'Slurrp Farm', '150 g', 165, 185),
 ]),
 'Health & Wellness': (PHARMA, [
  ('Ensure Diabetes Care Vanilla', 'Ensure', '400 g', 699, 755), ('Horlicks Protein Plus Chocolate', 'Horlicks', '400 g', 599, 665),
  ('Revital H Multivitamin Capsules', 'Revital', '30 caps', 336, 370), ('Limcee Vitamin C Chewable', 'Limcee', '15 tabs', 26, 28),
  ('Dabur Chyawanprash', 'Dabur', '1 kg', 395, 455), ('Himalaya Ashvagandha Tablets', 'Himalaya', '60 tabs', 199, 220),
  ('Muscleblaze Raw Whey Protein', 'MuscleBlaze', '1 kg', 1849, 2399), ('Electral ORS Powder Orange', 'Electral', '21 g x 5', 110, 115),
  ('Dr Trust Digital Thermometer', 'Dr Trust', '1 unit', 199, 399), ('Omron Blood Pressure Monitor HEM-7120', 'Omron', '1 unit', 1899, 2580),
  ('Dettol Antiseptic Liquid', 'Dettol', '550 ml', 215, 230), ('Hansaplast Washproof Strips', 'Hansaplast', '20 strips', 45, 50),
 ]),
 'Skincare': (PHARMA, [
  ('Cetaphil Gentle Skin Cleanser', 'Cetaphil', '125 ml', 399, 440), ('Nivea Soft Light Moisturising Cream', 'Nivea', '100 ml', 279, 315),
  ('Neutrogena Ultra Sheer Sunscreen SPF 50', 'Neutrogena', '88 ml', 699, 799), ('Himalaya Purifying Neem Face Wash', 'Himalaya', '150 ml', 199, 220),
  ('Minimalist 10% Niacinamide Serum', 'Minimalist', '30 ml', 569, 599), ('The Derma Co Hyaluronic Sunscreen Aqua Gel', 'The Derma Co', '50 g', 469, 499),
  ('Pond\'s Light Moisturiser', 'Pond\'s', '75 ml', 175, 199), ('Vaseline Intensive Care Deep Restore Lotion', 'Vaseline', '400 ml', 349, 399),
  ('Lakme Peach Milk Moisturiser', 'Lakme', '120 ml', 185, 210), ('Mamaearth Ubtan Face Wash', 'Mamaearth', '100 ml', 249, 299),
  ('Plum Green Tea Face Wash', 'Plum', '100 ml', 299, 345), ('Biotique Bio Morning Nectar Lotion', 'Biotique', '190 ml', 189, 215),
 ]),
 'Haircare': (PHARMA, [
  ('Dove Intense Repair Shampoo', 'Dove', '340 ml', 299, 365), ('Head & Shoulders Anti Dandruff Shampoo', 'Head & Shoulders', '340 ml', 335, 399),
  ('Pantene Hair Fall Control Shampoo', 'Pantene', '340 ml', 315, 379), ('Clinic Plus Strong & Long Shampoo', 'Clinic Plus', '355 ml', 189, 210),
  ('Sunsilk Black Shine Shampoo', 'Sunsilk', '360 ml', 219, 245), ('Tresemme Keratin Smooth Conditioner', 'Tresemme', '190 ml', 239, 270),
  ('Parachute Coconut Oil', 'Parachute', '500 ml', 220, 235), ('Dabur Amla Hair Oil', 'Dabur', '450 ml', 210, 230),
  ('Indulekha Bringha Hair Oil', 'Indulekha', '100 ml', 432, 480), ('Livon Serum for Frizz-free Hair', 'Livon', '100 ml', 249, 280),
  ('Set Wet Styling Hair Gel', 'Set Wet', '100 ml', 99, 110), ('Garnier Color Naturals Hair Colour Natural Black', 'Garnier', '1 pack', 179, 199),
 ]),
 'Fragrances': (PHARMA, [
  ('Fogg Master Deodorant', 'Fogg', '150 ml', 225, 299), ('Wild Stone Edge Perfume', 'Wild Stone', '100 ml', 375, 499),
  ('Park Avenue Good Morning Deo', 'Park Avenue', '150 ml', 219, 260), ('Engage W1 Perfume Spray for Women', 'Engage', '120 ml', 239, 299),
  ('Nivea Fresh Active Deodorant', 'Nivea', '150 ml', 199, 260), ('Denver Hamilton Deodorant', 'Denver', '165 ml', 199, 255),
  ('Yardley London English Lavender Deo', 'Yardley', '150 ml', 225, 270), ('Fiama Eau de Parfum Blossom', 'Fiama', '50 ml', 299, 349),
  ('Bella Vita Organic CEO Man Perfume', 'Bella Vita', '100 ml', 499, 799), ('Skinn by Titan Raw Eau de Parfum', 'Skinn', '50 ml', 1495, 1695),
 ]),
 'Bath & Body': (PHARMA, [
  ('Dove Cream Beauty Bathing Bar', 'Dove', '4 x 100 g', 219, 248), ('Pears Pure & Gentle Soap', 'Pears', '3 x 125 g', 189, 210),
  ('Lux Soft Glow Rose Soap', 'Lux', '4 x 100 g', 145, 164), ('Lifebuoy Total 10 Soap', 'Lifebuoy', '4 x 125 g', 132, 150),
  ('Santoor Sandal & Turmeric Soap', 'Santoor', '4 x 125 g', 150, 168), ('Medimix Classic Ayurvedic Soap', 'Medimix', '3 x 125 g', 135, 150),
  ('Fiama Shower Gel Peach & Avocado', 'Fiama', '250 ml', 215, 250), ('Nivea Creme Soft Body Wash', 'Nivea', '250 ml', 229, 270),
  ('Dettol Original Liquid Handwash', 'Dettol', '750 ml', 135, 149), ('Savlon Moisture Shield Handwash', 'Savlon', '750 ml', 119, 135),
  ('Nivea Body Milk Nourishing Lotion', 'Nivea', '400 ml', 349, 425), ('Cinthol Original Soap', 'Cinthol', '4 x 100 g', 165, 184),
 ]),
 'Feminine Hygiene': (PHARMA, [
  ('Whisper Ultra Clean XL+ Pads', 'Whisper', '30 pads', 365, 399), ('Whisper Choice Ultra XL', 'Whisper', '20 pads', 165, 180),
  ('Stayfree Secure Cottony XL', 'Stayfree', '20 pads', 125, 135), ('Sofy Antibacteria Extra Long', 'Sofy', '28 pads', 299, 335),
  ('Carefree Super Dry Panty Liners', 'Carefree', '20 liners', 99, 110), ('Sirona Reusable Menstrual Cup Medium', 'Sirona', '1 unit', 349, 499),
  ('Pee Safe Toilet Seat Sanitizer Spray', 'Pee Safe', '75 ml', 199, 249), ('Nua Ultra Thin Pads Heavy Flow', 'Nua', '12 pads', 249, 299),
  ('VWash Plus Intimate Hygiene Wash', 'VWash', '100 ml', 205, 225), ('Everteen Panty Liners', 'Everteen', '40 liners', 179, 199),
 ]),
 "Men's Grooming": (PHARMA, [
  ('Gillette Mach3 Razor', 'Gillette', '1 unit', 239, 275), ('Gillette Guard Cartridges', 'Gillette', '6 units', 125, 135),
  ('Gillette Classic Shave Foam', 'Gillette', '418 g', 245, 299), ('Old Spice Original After Shave Lotion', 'Old Spice', '100 ml', 279, 315),
  ('Beardo Beard & Hair Growth Oil', 'Beardo', '50 ml', 299, 350), ('The Man Company Charcoal Face Wash', 'The Man Company', '100 ml', 249, 299),
  ('Nivea Men Dark Spot Reduction Face Wash', 'Nivea', '100 g', 199, 235), ('Ustraa Beard Softener', 'Ustraa', '100 ml', 299, 350),
  ('Philips BT1232 Beard Trimmer', 'Philips', '1 unit', 1099, 1395), ('Park Avenue Shave Cream', 'Park Avenue', '84 g', 75, 85),
  ('Bombay Shaving Company Shaving Gel', 'Bombay Shaving Company', '100 g', 199, 249),
 ]),
 'Cleaning Essentials': (PROVISION, [
  ('Surf Excel Easy Wash Detergent Powder', 'Surf Excel', '1.5 kg', 245, 275), ('Ariel Matic Front Load Liquid', 'Ariel', '1 L', 285, 330),
  ('Tide Plus Double Power Detergent', 'Tide', '2 kg', 239, 270), ('Comfort After Wash Fabric Conditioner', 'Comfort', '860 ml', 239, 260),
  ('Vim Dishwash Gel Lemon', 'Vim', '750 ml', 175, 199), ('Pril Dishwash Liquid Lime', 'Pril', '750 ml', 155, 175),
  ('Lizol Disinfectant Floor Cleaner Citrus', 'Lizol', '975 ml', 219, 245), ('Harpic Power Plus Toilet Cleaner', 'Harpic', '1 L', 199, 220),
  ('Colin Glass & Surface Cleaner', 'Colin', '500 ml', 105, 117), ('Scotch-Brite Scrub Pad', 'Scotch-Brite', '3 pads', 60, 65),
  ('Gala No Dust Broom', 'Gala', '1 unit', 189, 249), ('Domex Fresh Guard Disinfectant', 'Domex', '1 L', 159, 175),
 ]),
 'Home Needs': (PROVISION, [
  ('Good Knight Gold Flash Refill', 'Good Knight', '45 ml x 2', 155, 168), ('All Out Ultra Refill', 'All Out', '45 ml x 2', 149, 165),
  ('Mortein Insta Insect Killer Spray', 'Mortein', '425 ml', 249, 279), ('Odonil Air Freshener Blocks Mix', 'Odonil', '4 x 48 g', 199, 220),
  ('Ambi Pur Car Freshener Vanilla', 'Ambi Pur', '7.5 ml', 375, 425), ('Origami So Soft Tissue Box', 'Origami', '200 pulls', 99, 125),
  ('Freshwrapp Aluminium Foil', 'Freshwrapp', '9 m', 85, 99), ('Ezee Garbage Bags Medium', 'Ezee', '30 bags', 90, 99),
  ('Syska LED Bulb 9W', 'Syska', '1 unit', 99, 175), ('Duracell AA Alkaline Batteries', 'Duracell', '4 units', 175, 190),
  ('Cycle Pure Agarbathi', 'Cycle', '1 pack', 99, 110), ('Hit Anti Roach Gel', 'Hit', '20 g', 199, 220),
 ]),
 'Pooja Needs': (PROVISION, [
  ('Cycle Three in One Agarbathi', 'Cycle', '1 pack', 99, 110), ('Mangaldeep Sandal Agarbathi', 'Mangaldeep', '1 pack', 85, 95),
  ('Zed Black Manthan Dhoop Sticks', 'Zed Black', '1 pack', 60, 65), ('Mangalam Camphor Tablets', 'Mangalam', '100 g', 135, 155),
  ('Patanjali Cow Ghee Diya Batti', 'Patanjali', '100 units', 75, 85), ('Ship Safety Matches', 'Ship', '10 boxes', 20, 20),
  ('Brass Pooja Diya Medium', 'Local Craft', '1 unit', 199, 249), ('Kumkum Roli Pack', 'Local Craft', '50 g', 30, 35),
  ('Gangajal Holy Water', 'Local Craft', '250 ml', 49, 60), ('Cotton Wicks Round', 'Local Craft', '200 units', 35, 40),
 ]),
 'Kitchenware & Appliances': (PROVISION, [
  ('Prestige Popular Pressure Cooker', 'Prestige', '3 L', 1499, 1995), ('Hawkins Classic Pressure Cooker', 'Hawkins', '5 L', 1825, 2125),
  ('Pigeon Non-Stick Fry Pan', 'Pigeon', '24 cm', 549, 899), ('Milton Thermosteel Flask', 'Milton', '1 L', 899, 1145),
  ('Cello Plastic Water Bottle Set', 'Cello', '1 L x 4', 299, 399), ('Borosil Glass Mixing Bowl', 'Borosil', '1.3 L', 399, 495),
  ('Bajaj Rex Mixer Grinder 500W', 'Bajaj', '1 unit', 2199, 3150), ('Philips Electric Kettle 1.5 L', 'Philips', '1 unit', 1349, 1795),
  ('Signoraware Lunch Box Set', 'Signoraware', '3 containers', 349, 450), ('Tupperware Aquasafe Bottle', 'Tupperware', '1 L', 275, 320),
  ('Steel Knife Set with Peeler', 'Vinod', '3 pieces', 249, 399), ('Prestige Omega Tawa', 'Prestige', '28 cm', 699, 990),
 ]),
 'Electronics & Accessories': (PROVISION, [
  ('boAt Airdopes 141 Earbuds', 'boAt', '1 unit', 1099, 4490), ('boAt Bassheads 100 Wired Earphones', 'boAt', '1 unit', 399, 999),
  ('Mi 10000mAh Power Bank', 'Xiaomi', '1 unit', 1099, 1499), ('Ambrane 20W Type-C Charger', 'Ambrane', '1 unit', 499, 999),
  ('Portronics Type-C Cable 1 m', 'Portronics', '1 unit', 199, 499), ('Duracell AAA Alkaline Batteries', 'Duracell', '4 units', 175, 190),
  ('Syska 20W LED Batten', 'Syska', '1 unit', 299, 549), ('SanDisk Ultra 64GB microSD Card', 'SanDisk', '1 unit', 499, 1299),
  ('SanDisk Ultra Dual Drive 64GB', 'SanDisk', '1 unit', 549, 1100), ('Anchor 4-Way Extension Board', 'Anchor', '1 unit', 449, 699),
  ('Zebronics Wireless Mouse', 'Zebronics', '1 unit', 299, 599), ('Philips LED Torch', 'Philips', '1 unit', 349, 499),
 ]),
 'Apparel': (GROCER, [
  ('Jockey Men\'s Cotton Briefs', 'Jockey', 'Pack of 2, M', 399, 449), ('Jockey Men\'s Round Neck T-Shirt', 'Jockey', 'L', 499, 549),
  ('Jockey Women\'s Cotton Leggings', 'Jockey', 'M', 599, 649), ('VIP Men\'s Vest', 'VIP', 'Pack of 2, M', 245, 290),
  ('Rupa Frontline Men\'s Vest', 'Rupa', 'Pack of 3, L', 299, 360), ('Bonjour Men\'s Ankle Socks', 'Bonjour', '3 pairs', 199, 299),
  ('Supersox Women\'s No-show Socks', 'Supersox', '3 pairs', 249, 399), ('Lux Cozi Men\'s Boxer Shorts', 'Lux Cozi', 'L', 299, 349),
  ('Cotton Hand Towel Set', 'Bombay Dyeing', '2 pieces', 299, 450), ('Cotton Bath Towel', 'Bombay Dyeing', '1 piece', 399, 599),
  ('Woollen Winter Cap', 'Local Craft', 'Free size', 199, 299), ('Reusable Cotton Tote Bag', 'Local Craft', '1 unit', 149, 199),
 ]),
 'Jewellery & Accessories': (GROCER, [
  ('Fastrack Analog Watch Black Dial', 'Fastrack', '1 unit', 1295, 1695), ('Sonata Analog Watch', 'Sonata', '1 unit', 899, 1095),
  ('Fastrack UV Protected Sunglasses', 'Fastrack', '1 unit', 999, 1299), ('Oxidised Silver Jhumka Earrings', 'Local Craft', '1 pair', 249, 399),
  ('Gold-plated Kundan Necklace Set', 'Local Craft', '1 set', 699, 999), ('Glass Bangles Set', 'Local Craft', '24 pieces', 149, 199),
  ('Leather Wallet for Men', 'Wildhorn', '1 unit', 449, 999), ('Women\'s Hair Claw Clips', 'Local Craft', '4 pieces', 149, 199),
  ('Steel Kada Bracelet', 'Local Craft', '1 unit', 199, 299), ('Laptop Backpack 30 L', 'Skybags', '1 unit', 1299, 2399),
 ]),
 'Party & Gifting': (GROCER, [
  ('Happy Birthday Foil Balloon Banner', 'Party Propz', '1 set', 199, 299), ('Metallic Balloons Assorted', 'Party Propz', '50 pieces', 199, 249),
  ('Birthday Cake Candles', 'Party Propz', '24 pieces', 49, 60), ('Sparkling Fountain Candle', 'Party Propz', '2 pieces', 99, 129),
  ('Paper Party Plates', 'Local Craft', '25 pieces', 99, 120), ('Gift Wrapping Paper Roll', 'Local Craft', '5 sheets', 99, 149),
  ('Cadbury Celebrations Gift Pack', 'Cadbury', '178 g', 199, 215), ('Ferrero Rocher Gift Box', 'Ferrero Rocher', '16 pieces', 549, 599),
  ('Greeting Card Assorted', 'Archies', '1 unit', 99, 120), ('Scented Candle Jar Lavender', 'Iris', '1 unit', 349, 499),
 ]),
 'Toys & Games': (GROCER, [
  ('Funskool Monopoly Classic', 'Funskool', '1 set', 699, 899), ('Funskool Scrabble Original', 'Funskool', '1 set', 799, 999),
  ('UNO Playing Cards', 'Mattel', '1 deck', 149, 199), ('Hot Wheels Basic Car', 'Hot Wheels', '1 unit', 149, 179),
  ('Rubik\'s Cube 3x3', 'Funskool', '1 unit', 499, 599), ('Play-Doh Modelling Compound', 'Play-Doh', '4 tubs', 399, 499),
  ('Ludo & Snakes Ladders Board', 'Local Craft', '1 set', 149, 199), ('Nerf Elite Blaster', 'Nerf', '1 unit', 899, 1299),
  ('Barbie Fashionista Doll', 'Barbie', '1 unit', 699, 899), ('Jigsaw Puzzle 500 Pieces', 'Frank', '1 set', 449, 525),
 ]),
 'Stationery & Crafts': (GROCER, [
  ('Classmate Single Line Notebook', 'Classmate', '6 x 172 pages', 299, 336), ('Classmate Octane Gel Pens Blue', 'Classmate', '10 pens', 90, 100),
  ('Reynolds Trimax Pen', 'Reynolds', '1 unit', 55, 60), ('Natraj 621 Pencils', 'Natraj', '10 pencils', 50, 55),
  ('Apsara Non-dust Eraser', 'Apsara', '5 units', 25, 25), ('Faber-Castell Wax Crayons', 'Faber-Castell', '24 shades', 99, 120),
  ('Camlin Sketch Pens', 'Camlin', '24 shades', 80, 90), ('Fevicol MR Squeeze Bottle', 'Fevicol', '200 g', 75, 80),
  ('Fevistik Glue Stick', 'Fevicol', '15 g', 45, 50), ('Kangaro Stapler with Pins', 'Kangaro', '1 unit', 125, 145),
  ('Post-it Sticky Notes', '3M', '100 sheets', 99, 115), ('A4 Copier Paper', 'JK Copier', '500 sheets', 345, 399),
 ]),
 'Sports & Fitness': (GROCER, [
  ('Cosco Light Tennis Cricket Ball', 'Cosco', '3 balls', 249, 300), ('SG Kashmir Willow Cricket Bat', 'SG', 'Size 6', 1199, 1599),
  ('Yonex Mavis 350 Shuttlecocks', 'Yonex', '6 units', 999, 1180), ('Yonex Badminton Racquet', 'Yonex', '1 unit', 999, 1490),
  ('Nivia Storm Football', 'Nivia', 'Size 5', 499, 649), ('Boldfit Yoga Mat 6 mm', 'Boldfit', '1 unit', 499, 1299),
  ('Boldfit Skipping Rope', 'Boldfit', '1 unit', 199, 499), ('Kore PVC Dumbbells', 'Kore', '2 x 2 kg', 599, 999),
  ('Strauss Resistance Bands', 'Strauss', '5 bands', 399, 799), ('Cello Gym Shaker Bottle', 'Cello', '700 ml', 249, 349),
 ]),
 'Books': (GROCER, [
  ('Atomic Habits', 'James Clear', 'Paperback', 499, 799), ('The Psychology of Money', 'Morgan Housel', 'Paperback', 329, 399),
  ('Ikigai', 'Hector Garcia', 'Hardcover', 399, 599), ('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Paperback', 349, 499),
  ('The Alchemist', 'Paulo Coelho', 'Paperback', 299, 350), ('Wings of Fire', 'A P J Abdul Kalam', 'Paperback', 299, 399),
  ('Panchatantra Stories for Children', 'Wonder House', 'Paperback', 199, 250), ('My First Library Board Books', 'Wonder House', '10 books', 499, 899),
  ('Oxford Student\'s Dictionary', 'Oxford', 'Paperback', 375, 425), ('Tinkle Digest', 'Tinkle', 'Paperback', 120, 120),
 ]),
}

def q(v): return 'NULL' if v is None else "'" + str(v).replace("'", "''") + "'"

lines = ['-- generated by scripts/catalog/more_products.py — run after db/seed.sql',
         'DELETE FROM products WHERE id LIKE \'x%\';']
# Categories added to match the full range (the worker's CATEGORY_DEFS also creates them and their artwork).
for i, (name, icon, color) in enumerate([('Organic & Healthy', '🌱', '#15803d'), ("Men's Grooming", '🪒', '#334155'), ('Pooja Needs', '🪔', '#ea580c'), ('Party & Gifting', '🎁', '#db2777')]):
    lines.append(f'INSERT OR IGNORE INTO categories (name, icon, color, image_url, sort) VALUES ({q(name)}, {q(icon)}, {q(color)}, NULL, {41 + i});')
count = 0
for ci, (cat, ((store, dist), items)) in enumerate(DATA.items()):
    for i, (name, brand, weight, price, mrp) in enumerate(items):
        off = round((mrp - price) * 100 / mrp) if mrp > price else 0
        tag = f'{off}% OFF' if off >= 5 else None
        orig = mrp if off >= 5 else None
        lines.append('INSERT INTO products (id, name, brand, price, orig_price, category, weight, image_url, image_source, image_status, image_kind, tag, store_name, distance) VALUES ('
                     + ', '.join([q(f'x{ci:02d}-{i:02d}'), q(name), q(brand), str(price), 'NULL' if orig is None else str(orig), q(cat), q(weight), 'NULL', 'NULL', q('pending'), q('packaged'), q(tag), q(store), q(dist)]) + ');')
        count += 1
out = pathlib.Path(__file__).resolve().parents[2] / 'db' / 'more-products.sql'
out.write_text('\n'.join(lines) + '\n')
print(count, 'products in', len(DATA), 'categories ->', out)
