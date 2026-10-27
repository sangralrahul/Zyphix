// Small, hand-maintained lists for Eats / Book / Home (restaurants, menus, services, stores, promos).
// Kept out of mockData.ts so those pages never download the 2,900-product grocery catalogue.
export const restaurants = [
  { id:'r1', name:'Sharma Dhaba',        cuisine:'North Indian · Dal Makhni · Butter Chicken', cuisineType:'North Indian', rating:4.6, eta:'28 min', deliveryFee:0,  minOrder:149, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=280&fit=crop&q=80', tags:['Free Delivery','#1 Rated'] },
  { id:'r2', name:'Pizza Palace',        cuisine:'Pizza · Burgers · Pasta · Fast Food',         cuisineType:'Pizza',        rating:4.3, eta:'35 min', deliveryFee:30, minOrder:199, image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=280&fit=crop&q=80', tags:['New'] },
  { id:'r3', name:'Biryani House',       cuisine:'Biryani · Mughlai · Kebabs · Haleem',         cuisineType:'Biryani',      rating:4.8, eta:'40 min', deliveryFee:0,  minOrder:299, image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=280&fit=crop&q=80', tags:['Free Delivery','Bestseller'] },
  { id:'r4', name:'Mithai Palace',       cuisine:'Sweets · Mithai · Namkeen · Chai',            cuisineType:'Sweets',       rating:4.5, eta:'20 min', deliveryFee:20, minOrder:99,  image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=280&fit=crop&q=80', tags:['Bestseller'] },
  { id:'r5', name:'Punjab Da Dhaba',     cuisine:'Chole Bhature · Amritsari · Lassi · Kulcha',  cuisineType:'North Indian', rating:4.4, eta:'25 min', deliveryFee:0,  minOrder:149, image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=280&fit=crop&q=80', tags:['Free Delivery'] },
  { id:'r6', name:'Green Bowl Café',     cuisine:'Salads · Healthy · Juices · Buddha Bowl',     cuisineType:'Healthy',      rating:4.2, eta:'22 min', deliveryFee:0,  minOrder:199, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=280&fit=crop&q=80', tags:['Healthy','Free Delivery'] },
  { id:'r7', name:'Dosa Plaza',          cuisine:'Dosa · Idli · Sambhar · South Indian Thali',  cuisineType:'South Indian', rating:4.5, eta:'30 min', deliveryFee:0,  minOrder:149, image:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=280&fit=crop&q=80', tags:['Free Delivery','Popular'] },
  { id:'r8', name:'Momo Magic',          cuisine:'Momos · Thukpa · Dimsum · Tibetan',            cuisineType:'Momos',        rating:4.3, eta:'25 min', deliveryFee:20, minOrder:149, image:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&h=280&fit=crop&q=80', tags:['Trending'] },
  { id:'r9', name:'Burger Barn',         cuisine:'Burgers · Wraps · Shakes · Wings',             cuisineType:'Burgers',      rating:4.1, eta:'28 min', deliveryFee:25, minOrder:199, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=280&fit=crop&q=80', tags:['New'] },
  { id:'r10',name:'Chai Sutta Bar',      cuisine:'Chai · Snacks · Maggi · Bhurji',               cuisineType:'Chai & Snacks',rating:4.4, eta:'15 min', deliveryFee:0,  minOrder:99,  image:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&h=280&fit=crop&q=80', tags:['Free Delivery','Fast'] },
];

export const menuItems = [
  { id:'m1',  restaurantId:'r1', name:'Dal Makhni',           desc:'Slow-cooked black lentils with butter & cream',     price:199, origPrice:null, image:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop&q=80', tag:'Bestseller', isVeg:true },
  { id:'m2',  restaurantId:'r1', name:'Butter Chicken',       desc:'Tender chicken in tomato-cream gravy',               price:279, origPrice:329, image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop&q=80', tag:'20% OFF',    isVeg:false },
  { id:'m3',  restaurantId:'r1', name:'Butter Naan (2 pcs)',  desc:'Soft fluffy naan with butter',                       price:60,  origPrice:null, image:'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=300&h=200&fit=crop&q=80', tag:null,         isVeg:true },
  { id:'m4',  restaurantId:'r1', name:'Paneer Makhana',       desc:'Cottage cheese in rich makhani sauce',               price:239, origPrice:279, image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop&q=80', tag:'14% OFF',    isVeg:true },
  { id:'m5',  restaurantId:'r2', name:'Margherita Pizza',     desc:'Classic tomato, mozzarella & basil',                 price:249, origPrice:299, image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop&q=80', tag:'17% OFF',    isVeg:true },
  { id:'m6',  restaurantId:'r2', name:'Pepperoni Pizza',      desc:'Loaded pepperoni with extra cheese',                 price:349, origPrice:399, image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop&q=80', tag:'13% OFF',    isVeg:false },
  { id:'m7',  restaurantId:'r2', name:'Pasta Arrabbiata',     desc:'Penne in spicy tomato sauce',                        price:199, origPrice:null, image:'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=300&h=200&fit=crop&q=80', tag:null,         isVeg:true },
  { id:'m8',  restaurantId:'r3', name:'Chicken Biryani',      desc:'Dum-cooked basmati with spices & whole spices',      price:299, origPrice:349, image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop&q=80', tag:'15% OFF',    isVeg:false },
  { id:'m9',  restaurantId:'r3', name:'Mutton Biryani',       desc:'Tender mutton pieces in aromatic rice',              price:399, origPrice:449, image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop&q=80', tag:'11% OFF',    isVeg:false },
  { id:'m10', restaurantId:'r3', name:'Veg Biryani',          desc:'Garden vegetables in saffron basmati',               price:199, origPrice:229, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop&q=80', tag:'13% OFF',    isVeg:true },
  { id:'m11', restaurantId:'r4', name:'Kaju Katli (250g)',    desc:'Pure cashew barfi with silver vark',                 price:299, origPrice:350, image:'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop&q=80', tag:'15% OFF',    isVeg:true },
  { id:'m12', restaurantId:'r4', name:'Gulab Jamun (6 pcs)',  desc:'Soft milk-solid balls in sugar syrup',               price:79,  origPrice:null, image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop&q=80', tag:null,         isVeg:true },
  { id:'m13', restaurantId:'r5', name:'Chole Bhature',        desc:'Spiced chickpeas with fluffy fried bread',           price:149, origPrice:179, image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&q=80', tag:'17% OFF',    isVeg:true },
  { id:'m14', restaurantId:'r5', name:'Amritsari Kulcha',     desc:'Stuffed bread with chole & pickle',                  price:129, origPrice:null, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop&q=80', tag:'Bestseller', isVeg:true },
  { id:'m15', restaurantId:'r6', name:'Buddha Bowl',          desc:'Quinoa, avocado, greens & tahini dressing',          price:299, origPrice:349, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&q=80', tag:'14% OFF',    isVeg:true },
  { id:'m16', restaurantId:'r7', name:'Masala Dosa',          desc:'Crispy dosa with potato masala & chutneys',          price:129, origPrice:null, image:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop&q=80', tag:'Bestseller', isVeg:true },
  { id:'m17', restaurantId:'r7', name:'Idli Sambhar (4 pcs)', desc:'Steamed rice cakes with toor dal sambhar',           price:99,  origPrice:null, image:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop&q=80', tag:null,         isVeg:true },
  { id:'m18', restaurantId:'r8', name:'Steamed Momos (8 pcs)',desc:'Delicate wheat dumplings with spicy chutney',        price:129, origPrice:149, image:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop&q=80', tag:'13% OFF',    isVeg:true },
  { id:'m19', restaurantId:'r8', name:'Chicken Momos (8 pcs)',desc:'Juicy chicken filling in steamed wrappers',          price:149, origPrice:169, image:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop&q=80', tag:'12% OFF',    isVeg:false },
  { id:'m20', restaurantId:'r9', name:'Classic Beef Burger',  desc:'Beef patty, lettuce, tomato & secret sauce',         price:199, origPrice:229, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&q=80', tag:'13% OFF',    isVeg:false },
  { id:'m21', restaurantId:'r9', name:'Crispy Chicken Burger',desc:'Crispy fried chicken with coleslaw & mayo',          price:179, origPrice:219, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&q=80', tag:'18% OFF',    isVeg:false },
  { id:'m22', restaurantId:'r10',name:'Masala Chai (Special)',desc:'Freshly brewed tea with ginger & cardamom',          price:30,  origPrice:null, image:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=200&fit=crop&q=80', tag:'Bestseller', isVeg:true },
  { id:'m23', restaurantId:'r10',name:'Maggi Masala',         desc:'Classic Nestle Maggi with veggies',                  price:60,  origPrice:null, image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&q=80', tag:null,         isVeg:true },
  { id:'m24', restaurantId:'r1', name:'Shahi Paneer',         desc:'Paneer in rich, creamy saffron gravy',               price:259, origPrice:299, image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop&q=80', tag:'14% OFF',    isVeg:true },
  { id:'m25', restaurantId:'r3', name:'Chicken Seekh Kebab',  desc:'Minced chicken skewers grilled in tandoor',          price:249, origPrice:299, image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop&q=80', tag:'17% OFF',    isVeg:false },
];

export const FOOD_CUISINE_TYPES = ['All', 'North Indian', 'South Indian', 'Biryani', 'Pizza', 'Burgers', 'Momos', 'Chinese', 'Sweets', 'Chai & Snacks', 'Healthy'];

export const stores = [
  { id:'s1', name:'Fresh Farms Express',    type:'kirana',     distance:'0.3 km', openHours:'7am – 10pm', rating:4.6 },
  { id:'s2', name:'Sharma General Store',   type:'kirana',     distance:'0.3 km', openHours:'8am – 9pm',  rating:4.4 },
  { id:'s3', name:'Rajan Provision Store',  type:'kirana',     distance:'0.2 km', openHours:'7am – 11pm', rating:4.5 },
  { id:'s4', name:'City Medical & Pharmacy',type:'medical',    distance:'0.5 km', openHours:'8am – 10pm', rating:4.7 },
  { id:'s5', name:'Gupta Atta Chakki',      type:'kirana',     distance:'0.4 km', openHours:'7am – 9pm',  rating:4.3 },
  { id:'s6', name:'Bread & Butter Bakery',  type:'kirana',     distance:'0.5 km', openHours:'6am – 8pm',  rating:4.5 },
  { id:'s7', name:'Sharma Dhaba',           type:'restaurant', distance:'0.6 km', openHours:'10am – 11pm',rating:4.6 },
  { id:'s8', name:'Punjab Da Dhaba',        type:'restaurant', distance:'0.7 km', openHours:'9am – 10pm', rating:4.4 },
];

export const foodCategories = [
  { name:'North Indian',   image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=85' },
  { name:'South Indian',   image:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop&q=85' },
  { name:'Biryani',        image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop&q=85' },
  { name:'Pizza',          image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=85' },
  { name:'Burgers',        image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=85' },
  { name:'Momos',          image:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&h=200&fit=crop&q=85' },
  { name:'Chinese',        image:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop&q=85' },
  { name:'Sweets',         image:'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&q=85' },
  { name:'Chai & Snacks',  image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&q=85' },
  { name:'Healthy',        image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=85' },
];

export const promoCodes = [
  { code:'ZYPHIX10',  description:'10% off your first order — no minimum order value',           type:'new_user' },
  { code:'FRESH30',   description:'₹30 off on grocery orders above ₹299',                        type:'grocery' },
  { code:'FREESHIP',  description:'Free delivery on your next 3 orders — any amount',            type:'delivery' },
  { code:'KIRANA50',  description:'₹50 off when you order from a kirana partner store',          type:'kirana' },
  { code:'PARTNER20', description:'20% off for merchants who join the ZYPHIX partner network',   type:'partner' },
  { code:'NEWUSER15', description:'Flat 15% off — valid for new users on all categories',        type:'new_user' },
  { code:'DAIRY25',   description:'₹25 off on dairy & eggs orders above ₹149',                  type:'grocery' },
  { code:'HEALTH20',  description:'20% off on pharmacy & wellness orders above ₹199',            type:'pharmacy' },
];

export const services = [
  { id:'sv1', emoji:'🔧', title:'Plumber',         category:'Home Repair',   available:8,  nextSlot:'Today, 2pm' },
  { id:'sv2', emoji:'⚡', title:'Electrician',     category:'Home Repair',   available:12, nextSlot:'Today, 3pm' },
  { id:'sv3', emoji:'🧹', title:'Home Cleaning',   category:'Cleaning',      available:6,  nextSlot:'Today, 4pm' },
  { id:'sv4', emoji:'🎨', title:'Painter',         category:'Home Décor',    available:4,  nextSlot:'Tomorrow, 10am' },
  { id:'sv5', emoji:'❄️', title:'AC Service',      category:'Appliances',    available:9,  nextSlot:'Today, 5pm' },
  { id:'sv6', emoji:'🚰', title:'Water Purifier',  category:'Appliances',    available:5,  nextSlot:'Tomorrow, 11am' },
  { id:'sv7', emoji:'🪑', title:'Carpenter',       category:'Furniture',     available:7,  nextSlot:'Today, 6pm' },
  { id:'sv8', emoji:'🧑‍🍳', title:'Home Cook',    category:'Food & Kitchen', available:3,  nextSlot:'Tomorrow, 8am' },
  { id:'sv9', emoji:'🚚', title:'Packers & Movers',category:'Shifting',      available:5,  nextSlot:'Tomorrow, 9am' },
  { id:'sv10',emoji:'👨‍🔧',title:'Handyman',       category:'Home Repair',   available:10, nextSlot:'Today, 2pm' },
];
