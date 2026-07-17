import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Utensils, Clock, FileText, Star, FileDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZyphixLogo } from '@/components/ZyphixLogo';

const G = '#0DA366'; const T1 = '#111827'; const T2 = '#6B7280';
const T3 = '#9CA3AF'; const BD = '#E5E7EB'; const W = '#FFFFFF'; const BG = '#F8F9FA';
const SH = '0 2px 8px rgba(0,0,0,.07)'; const SH2 = '0 4px 24px rgba(0,0,0,.10)';
const RA = '#E11D48';

const tw = (emoji: string) => {
  const cp = [...emoji].map(c => c.codePointAt(0)!.toString(16))
    .filter(h => parseInt(h, 16) !== 0xfe0f && parseInt(h, 16) !== 0x200d).join('_');
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${cp}/512.png`;
};

const inp = (err?: string): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: `1.5px solid ${err ? '#EF4444' : BD}`, background: W,
  fontSize: 14, color: T1, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color .15s, box-shadow .15s',
});

const STEPS = [
  { label: 'Restaurant Info', icon: <Utensils size={14} /> },
  { label: 'Menu & Cuisine',  icon: <FileText size={14} /> },
  { label: 'Operations',      icon: <Clock size={14} /> },
  { label: 'Done',            icon: <Star size={14} /> },
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

const CUISINES = [
  { id: 'north_indian', img: tw('🍛'), n: 'North Indian',       c: '#b45309', bg: '#FFFBEB' },
  { id: 'mughlai',      img: tw('🫕'), n: 'Mughlai',            c: '#9a3412', bg: '#FFF7ED' },
  { id: 'chinese',      img: tw('🍜'), n: 'Chinese',            c: '#0891b2', bg: '#ECFEFF' },
  { id: 'fast_food',    img: tw('🍔'), n: 'Fast Food',          c: '#dc2626', bg: '#FFF1F2' },
  { id: 'pizza',        img: tw('🍕'), n: 'Pizza',              c: '#9f1239', bg: '#FFF1F2' },
  { id: 'biryani',      img: tw('🍲'), n: 'Biryani',            c: '#78350f', bg: '#FFFBEB' },
  { id: 'sweets',       img: tw('🍮'), n: 'Sweets & Mithai',    c: '#d97706', bg: '#FFFBEB' },
  { id: 'snacks',       img: tw('🌮'), n: 'Chaat & Snacks',     c: '#c2410c', bg: '#FFF7ED' },
  { id: 'continental',  img: tw('🥗'), n: 'Continental',        c: '#16a34a', bg: '#ECFDF5' },
  { id: 'south_indian', img: tw('🥘'), n: 'South Indian',       c: '#7c3aed', bg: '#F5F3FF' },
  { id: 'tandoor',      img: tw('🔥'), n: 'Tandoor',            c: '#ea580c', bg: '#FFF7ED' },
  { id: 'beverages',    img: tw('🥤'), n: 'Beverages',          c: '#0284c7', bg: '#F0F9FF' },
  { id: 'desserts',     img: tw('🍨'), n: 'Desserts & Ice Cream', c: '#db2777', bg: '#FDF2F8' },
  { id: 'bakes',        img: tw('🍞'), n: 'Bakery & Bakes',     c: '#b45309', bg: '#FFFBEB' },
  { id: 'healthy',      img: tw('🥙'), n: 'Healthy / Salads',   c: '#16a34a', bg: '#ECFDF5' },
];

const MENU_ITEMS: Record<string, string[]> = {
  north_indian: ['Dal Makhani', 'Butter Chicken', 'Paneer Tikka', 'Rajma', 'Aloo Gobi', 'Kadhi Pakoda', 'Chole Bhature', 'Palak Paneer', 'Shahi Paneer', 'Matar Paneer', 'Aloo Paratha', 'Puri Sabzi', 'Dal Tadka', 'Mix Veg', 'Sarson Ka Saag', 'Makki Roti'],
  mughlai: ['Mutton Rogan Josh', 'Chicken Korma', 'Seekh Kebab', 'Shami Kebab', 'Biryani', 'Nihari', 'Haleem', 'Mutton Keema', 'Chicken Tikka', 'Boti Kebab', 'Pasanda', 'Yakhni', 'Paya Shorba'],
  chinese: ['Fried Rice', 'Noodles', 'Manchurian', 'Spring Rolls', 'Chilli Chicken', 'Soup', 'Momos', 'Hakka Noodles', 'Schezwan Rice', 'Dim Sum', 'Honey Chilli Potato', 'Kung Pao Chicken', 'Wonton Soup'],
  fast_food: ['Burger', 'French Fries', 'Sandwich', 'Hot Dog', 'Wrap', 'Nuggets', 'Milkshake', 'Aloo Tikki Burger', 'Grilled Sandwich', 'Club Sandwich', 'Tacos', 'Quesadilla', 'Onion Rings', 'Loaded Fries'],
  pizza: ['Margherita', 'Pepperoni', 'Veggie Supreme', 'BBQ Chicken', 'Cheese Burst', 'Paneer Pizza', 'Garlic Bread', 'Farmhouse', 'Double Cheese', 'Spicy Chicken', 'Mexican Wave', 'Peri Peri Paneer', 'Calzone'],
  biryani: ['Chicken Biryani', 'Mutton Biryani', 'Veg Biryani', 'Egg Biryani', 'Fish Biryani', 'Raita', 'Shorba', 'Dum Biryani', 'Hyderabadi Biryani', 'Lucknowi Biryani', 'Kolkata Biryani', 'Prawn Biryani', 'Soya Biryani'],
  sweets: ['Gulab Jamun', 'Jalebi', 'Barfi', 'Halwa', 'Kheer', 'Rasgulla', 'Peda', 'Ladoo', 'Kulfi', 'Rabri', 'Imarti', 'Rasmalai', 'Gajrela', 'Pinni', 'Besan Ladoo', 'Milk Cake'],
  snacks: ['Pani Puri', 'Bhel Puri', 'Dahi Puri', 'Aloo Chaat', 'Samosa', 'Kachori', 'Pakora', 'Dahi Bhalla', 'Papdi Chaat', 'Raj Kachori', 'Sev Puri', 'Aloo Tikki', 'Bread Pakora', 'Vada Pav'],
  continental: ['Pasta', 'Lasagna', 'Salad', 'Soup', 'Bruschetta', 'Risotto', 'Grilled Chicken', 'Penne Arrabbiata', 'Carbonara', 'Caesar Salad', 'Mushroom Soup', 'Baked Ziti', 'Focaccia'],
  south_indian: [
    'Masala Dosa', 'Plain Dosa', 'Rava Dosa', 'Paper Dosa', 'Set Dosa', 'Onion Dosa', 'Paneer Dosa', 'Egg Dosa',
    'Idli', 'Rava Idli', 'Mini Idli', 'Idli Sambar',
    'Medu Vada', 'Sambar Vada', 'Curd Vada', 'Masala Vada',
    'Sambar', 'Rasam', 'Coconut Chutney', 'Tomato Chutney', 'Groundnut Chutney',
    'Uttapam', 'Onion Uttapam', 'Tomato Uttapam',
    'Pongal', 'Khichdi Pongal', 'Curd Rice', 'Lemon Rice', 'Tamarind Rice', 'Tomato Rice', 'Bisibelebath',
    'Upma', 'Vermicelli Upma', 'Rava Upma',
    'Appam', 'Puttu', 'Kadala Curry', 'Kerala Fish Curry',
    'Pesarattu', 'Poha', 'Kesari Bath', 'Filter Coffee', 'Buttermilk', 'Payasam',
  ],
  tandoor: ['Tandoori Chicken', 'Naan', 'Butter Naan', 'Garlic Naan', 'Rumali Roti', 'Tandoori Roti', 'Paratha', 'Tandoori Paneer', 'Seekh Kebab', 'Tandoori Fish', 'Chicken Tikka', 'Malai Tikka'],
  beverages: ['Tea', 'Coffee', 'Lassi', 'Fresh Juice', 'Lemonade', 'Cold Coffee', 'Soft Drinks', 'Masala Chai', 'Green Tea', 'Mango Lassi', 'Rose Lassi', 'Buttermilk', 'Shikanji', 'Aam Panna', 'Sugarcane Juice'],
  desserts: ['Ice Cream', 'Brownie', 'Pastry', 'Mousse', 'Pudding', 'Cheesecake', 'Waffle', 'Chocolate Lava Cake', 'Tiramisu', 'Panna Cotta', 'Crème Brûlée', 'Sundae', 'Banana Split'],
  bakes: ['Bread', 'Croissant', 'Muffin', 'Cake', 'Cookies', 'Bun', 'Pita', 'Danish Pastry', 'Cinnamon Roll', 'Focaccia', 'Brioche', 'Bagel', 'Scone', 'Banana Bread'],
  healthy: ['Green Salad', 'Fruit Bowl', 'Smoothie', 'Quinoa Bowl', 'Oatmeal', 'Protein Shake', 'Avocado Toast', 'Acai Bowl', 'Chia Pudding', 'Detox Juice', 'Grilled Veggies', 'Sprout Salad'],
};

const DISH_EMOJIS: Record<string, string> = {
  'Dal Makhani':'🫘','Butter Chicken':'🍗','Paneer Tikka':'🧆','Rajma':'🫘','Aloo Gobi':'🥔','Kadhi Pakoda':'🍲','Chole Bhature':'🫓','Palak Paneer':'🌿',
  'Shahi Paneer':'🧀','Matar Paneer':'🟩','Aloo Paratha':'🫓','Puri Sabzi':'🍽️','Dal Tadka':'🫘','Mix Veg':'🥦','Sarson Ka Saag':'🌿','Makki Roti':'🫓',
  'Mutton Rogan Josh':'🍖','Chicken Korma':'🍛','Seekh Kebab':'🍢','Shami Kebab':'🥩','Biryani':'🍚','Nihari':'🍲','Haleem':'🫕','Mutton Keema':'🥩',
  'Chicken Tikka':'🍗','Boti Kebab':'🍢','Pasanda':'🍛','Yakhni':'🫕','Paya Shorba':'🫗',
  'Fried Rice':'🍳','Noodles':'🍜','Manchurian':'🟤','Spring Rolls':'🌯','Chilli Chicken':'🌶️','Soup':'🍜','Momos':'🥟','Hakka Noodles':'🍜',
  'Schezwan Rice':'🍚','Dim Sum':'🥟','Honey Chilli Potato':'🥔','Kung Pao Chicken':'🍗','Wonton Soup':'🍜',
  'Burger':'🍔','French Fries':'🍟','Sandwich':'🥪','Hot Dog':'🌭','Wrap':'🌯','Nuggets':'🍗','Milkshake':'🥤','Aloo Tikki Burger':'🍔',
  'Grilled Sandwich':'🥪','Club Sandwich':'🥪','Tacos':'🌮','Quesadilla':'🫓','Onion Rings':'🧅','Loaded Fries':'🍟',
  'Margherita':'🍕','Pepperoni':'🍕','Veggie Supreme':'🍕','BBQ Chicken':'🍕','Cheese Burst':'🍕','Paneer Pizza':'🍕','Garlic Bread':'🥖',
  'Farmhouse':'🍕','Double Cheese':'🧀','Spicy Chicken':'🌶️','Mexican Wave':'🌮','Peri Peri Paneer':'🍕','Calzone':'🥟',
  'Chicken Biryani':'🍗','Mutton Biryani':'🍖','Veg Biryani':'🌿','Egg Biryani':'🥚','Fish Biryani':'🐟','Raita':'🥛','Shorba':'🫕',
  'Dum Biryani':'🍚','Hyderabadi Biryani':'🍚','Lucknowi Biryani':'🍚','Kolkata Biryani':'🍚','Prawn Biryani':'🦐','Soya Biryani':'🫘',
  'Gulab Jamun':'🟤','Jalebi':'🟠','Barfi':'🟪','Halwa':'🟡','Kheer':'🥛','Rasgulla':'⚪','Peda':'🟤','Ladoo':'🟡','Kulfi':'🍦',
  'Rabri':'🥛','Imarti':'🟠','Rasmalai':'⚪','Gajrela':'🟠','Pinni':'🟤','Besan Ladoo':'🟡','Milk Cake':'🟤',
  'Pani Puri':'🫙','Bhel Puri':'🍿','Dahi Puri':'🫙','Aloo Chaat':'🥔','Samosa':'🥟','Kachori':'🥟','Pakora':'🟤','Dahi Bhalla':'🟡',
  'Papdi Chaat':'🍿','Raj Kachori':'🥟','Sev Puri':'🍿','Aloo Tikki':'🥔','Bread Pakora':'🍞','Vada Pav':'🍔',
  'Pasta':'🍝','Lasagna':'🫕','Salad':'🥗','Continental Soup':'🍲','Bruschetta':'🥖','Risotto':'🍚','Grilled Chicken':'🍗',
  'Penne Arrabbiata':'🍝','Carbonara':'🍝','Caesar Salad':'🥗','Mushroom Soup':'🍲','Baked Ziti':'🍝','Focaccia':'🥖',
  'Masala Dosa':'🥞','Plain Dosa':'🥞','Rava Dosa':'🥞','Paper Dosa':'🥞','Set Dosa':'🥞','Onion Dosa':'🥞','Paneer Dosa':'🥞','Egg Dosa':'🥚',
  'Idli':'🍚','Rava Idli':'🍚','Mini Idli':'🍚','Idli Sambar':'🍚',
  'Medu Vada':'🍩','Sambar Vada':'🍩','Curd Vada':'🍩','Masala Vada':'🍩',
  'Sambar':'🫕','Rasam':'🫗','Coconut Chutney':'🥥','Tomato Chutney':'🍅','Groundnut Chutney':'🥜',
  'Uttapam':'🥞','Onion Uttapam':'🥞','Tomato Uttapam':'🥞',
  'Pongal':'🍚','Khichdi Pongal':'🍚','Curd Rice':'🥛','Lemon Rice':'🍋','Tamarind Rice':'🍚','Tomato Rice':'🍅','Bisibelebath':'🍲',
  'Upma':'🍚','Vermicelli Upma':'🍚','Rava Upma':'🍚',
  'Appam':'🫓','Puttu':'🍚','Kadala Curry':'🫘','Kerala Fish Curry':'🐟',
  'Pesarattu':'🥞','Poha':'🍚','Kesari Bath':'🟡','Filter Coffee':'☕','Buttermilk':'🥛','Payasam':'🍮',
  'Tandoori Chicken':'🍗','Naan':'🫓','Butter Naan':'🫓','Garlic Naan':'🫓','Rumali Roti':'🫓','Tandoori Roti':'🫓',
  'Paratha':'🫓','Tandoori Paneer':'🧀','Tandoori Fish':'🐟','Malai Tikka':'🍢',
  'Tea':'🍵','Coffee':'☕','Lassi':'🥛','Fresh Juice':'🧃','Lemonade':'🍋','Cold Coffee':'☕','Soft Drinks':'🥤',
  'Masala Chai':'🍵','Green Tea':'🍵','Mango Lassi':'🥭','Rose Lassi':'🌹','Shikanji':'🍋','Aam Panna':'🥭','Sugarcane Juice':'🌿',
  'Ice Cream':'🍨','Brownie':'🍫','Pastry':'🧁','Mousse':'🍮','Pudding':'🍮','Cheesecake':'🍰','Waffle':'🧇',
  'Chocolate Lava Cake':'🎂','Tiramisu':'🍰','Panna Cotta':'🍮','Crème Brûlée':'🍮','Sundae':'🍨','Banana Split':'🍌',
  'Bread':'🍞','Croissant':'🥐','Muffin':'🧁','Cake':'🎂','Cookies':'🍪','Bun':'🍞','Pita':'🫓','Danish Pastry':'🥐',
  'Cinnamon Roll':'🍥','Brioche':'🥐','Bagel':'🥯','Scone':'🥐','Banana Bread':'🍌',
  'Green Salad':'🥗','Fruit Bowl':'🍎','Smoothie':'🥤','Quinoa Bowl':'🌾','Oatmeal':'🫙','Protein Shake':'💪',
  'Avocado Toast':'🥑','Acai Bowl':'🫐','Chia Pudding':'🫙','Detox Juice':'🧃','Grilled Veggies':'🥦','Sprout Salad':'🌱',
};

function StepBar({ step }: { step: number }) {
  return (
    <div style={{ background: W, borderBottom: `1px solid ${BD}`, padding: '0 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '16px 0', gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72 }}>
              <motion.div animate={{ background: i <= step ? RA : BD, color: i <= step ? '#fff' : T3 }}
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5, transition: 'all .3s' }}>
                {i < step ? <Check size={15} /> : i === step ? s.icon : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
              </motion.div>
              <span style={{ fontSize: 10, fontWeight: i <= step ? 700 : 500, color: i <= step ? T1 : T3, whiteSpace: 'nowrap', textAlign: 'center' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, margin: '0 4px', marginBottom: 18, background: i < step ? RA : BD, transition: 'background .3s' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Restaurant Info ─── */
function RestaurantInfoStep({ onNext }: { onNext: (d: object) => void }) {
  const q = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({ name: '', owner: q.get('name') || '', phone: q.get('phone') || '', email: q.get('email') || '', area: '', address: '', type: '', seating: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const f = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Restaurant name is required';
    if (!form.owner.trim()) e.owner = 'Owner/manager name is required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.area) e.area = 'Please select an area';
    if (!form.address.trim()) e.address = 'Full address is required';
    if (!form.type) e.type = 'Please select restaurant type';
    return e;
  };

  const TYPES = ['Dine-in Restaurant', 'Cloud Kitchen / Dark Kitchen', 'Dhaba', 'Cafe', 'Fast Food Outlet', 'Sweet Shop / Mithai', 'Food Truck', 'Home Kitchen'];

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div style={{ background: W, borderRadius: 20, padding: '32px 28px', boxShadow: SH2, border: `1px solid ${BD}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: `${RA}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🍽️</div>
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.3rem', color: T1 }}>Restaurant Information</h2>
            <p style={{ fontSize: 13, color: T3 }}>Tell us about your restaurant</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { k: 'name', label: 'Restaurant Name', ph: 'e.g. Sharma Dhaba', full: true },
            { k: 'owner', label: 'Owner / Manager Name', ph: 'Full name' },
            { k: 'phone', label: 'Mobile Number', ph: '10-digit number', type: 'tel' },
            { k: 'email', label: 'Email Address (optional)', ph: 'you@example.com — for confirmation', type: 'email' },
            { k: 'seating', label: 'Seating Capacity (optional)', ph: 'e.g. 30 seats', type: 'number' },
          ].map(({ k, label, ph, full, type }) => (
            <div key={k} style={{ gridColumn: full ? '1 / -1' : undefined }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</label>
              <input value={(form as Record<string, string>)[k]} type={type || 'text'}
                onChange={e => f(k, e.target.value)} placeholder={ph}
                style={inp(errors[k])}
                onFocus={e => { e.target.style.borderColor = RA; e.target.style.boxShadow = `0 0 0 3px ${RA}18`; }}
                onBlur={e => { e.target.style.borderColor = errors[k] ? '#EF4444' : BD; e.target.style.boxShadow = 'none'; }} />
              {errors[k] && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors[k]}</p>}
            </div>
          ))}

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Area / Colony</label>
            <select value={form.area} onChange={e => f('area', e.target.value)} style={{ ...inp(errors.area), appearance: 'none', cursor: 'pointer', color: form.area ? T1 : T3 }}>
              <option value="">Select district & locality</option>
              {AREAS_BY_DISTRICT.map(d => (
                <optgroup key={d.d} label={`── ${d.d} ──`}>
                  {d.areas.map(a => <option key={a} value={a}>{a}</option>)}
                </optgroup>
              ))}
            </select>
            {errors.area && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.area}</p>}
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Restaurant Type</label>
            <select value={form.type} onChange={e => f('type', e.target.value)} style={{ ...inp(errors.type), appearance: 'none', cursor: 'pointer', color: form.type ? T1 : T3 }}>
              <option value="">Select type</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.type}</p>}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Full Address</label>
            <textarea value={form.address} onChange={e => f('address', e.target.value)} placeholder="Shop no., street, landmark..."
              rows={2} style={{ ...inp(errors.address), resize: 'none', fontFamily: 'inherit' }}
              onFocus={e => { e.target.style.borderColor = RA; e.target.style.boxShadow = `0 0 0 3px ${RA}18`; }}
              onBlur={e => { e.target.style.borderColor = errors.address ? '#EF4444' : BD; e.target.style.boxShadow = 'none'; }} />
            {errors.address && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.address}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <motion.button onClick={() => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } onNext(form); }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: RA, color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: `0 4px 20px ${RA}40` }}>
            Continue <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 2: Menu & Cuisine ─── */
function MenuStep({ onNext, onBack }: { onNext: (cuisines: Set<string>, items: Record<string, Set<string>>) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleCuisine = (id: string) => {
    setSelected(s => {
      const ns = new Set(s);
      if (ns.has(id)) { ns.delete(id); const ni = { ...selectedItems }; delete ni[id]; setSelectedItems(ni); }
      else { ns.add(id); setExpanded(id); }
      return ns;
    });
  };

  const toggleItem = (cid: string, item: string) => {
    setSelectedItems(si => {
      const cur = new Set(si[cid] || []);
      if (cur.has(item)) cur.delete(item); else cur.add(item);
      return { ...si, [cid]: cur };
    });
  };

  const totalItems = Object.values(selectedItems).reduce((a, s) => a + s.size, 0);

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div style={{ background: W, borderRadius: 20, padding: '32px 28px', boxShadow: SH2, border: `1px solid ${BD}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.3rem', color: T1 }}>Menu & Cuisine Types</h2>
            <p style={{ fontSize: 13, color: T3, marginTop: 2 }}>Select all cuisines you serve and your menu items</p>
          </div>
          {(selected.size > 0 || totalItems > 0) && (
            <div style={{ background: `${RA}12`, border: `1px solid ${RA}30`, borderRadius: 99, padding: '5px 14px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: RA }}>{selected.size} cuisines · {totalItems} items</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20, marginTop: 20 }}>
          {CUISINES.map(({ id, img, n, c, bg }) => {
            const isSel = selected.has(id);
            const itemCount = selectedItems[id]?.size || 0;
            return (
              <motion.button key={id} onClick={() => toggleCuisine(id)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ padding: '14px 8px 12px', borderRadius: 14, background: isSel ? bg : W, border: `2px solid ${isSel ? c : BD}`, cursor: 'pointer', textAlign: 'center', position: 'relative', transition: 'all .15s' }}>
                {isSel && itemCount > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: c, color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{itemCount}</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 7 }}>
                  <img src={img} alt={n} width={36} height={36} style={{ objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: isSel ? c : T2, lineHeight: 1.3 }}>{n}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Sub-items drill down */}
        <AnimatePresence>
          {expanded && selected.has(expanded) && (
            <motion.div key={expanded} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ background: BG, borderRadius: 14, padding: '16px', border: `1px solid ${BD}`, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: T1, fontSize: 13 }}>
                    {CUISINES.find(c => c.id === expanded)?.n} — Select menu items
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setSelectedItems(si => ({ ...si, [expanded!]: new Set(MENU_ITEMS[expanded!] || []) }))}
                      style={{ fontSize: 11, fontWeight: 700, color: RA, background: `${RA}10`, border: `1px solid ${RA}30`, borderRadius: 99, padding: '4px 10px', cursor: 'pointer' }}>Add All</button>
                    <button onClick={() => setSelectedItems(si => ({ ...si, [expanded!]: new Set() }))}
                      style={{ fontSize: 11, fontWeight: 700, color: T3, background: BG, border: `1px solid ${BD}`, borderRadius: 99, padding: '4px 10px', cursor: 'pointer' }}>Clear</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(MENU_ITEMS[expanded] || []).map(item => {
                    const isSel = selectedItems[expanded!]?.has(item);
                    const { c, bg } = CUISINES.find(x => x.id === expanded) || { c: T2, bg: BG };
                    const emoji = DISH_EMOJIS[item] ?? '🍽️';
                    return (
                      <button key={item} onClick={() => toggleItem(expanded!, item)}
                        style={{ padding: '6px 10px 6px 8px', borderRadius: 99, border: `1.5px solid ${isSel ? c : BD}`, background: isSel ? bg : W, color: isSel ? c : T2, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .12s', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img src={tw(emoji)} alt="" draggable={false} style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }} />
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selected.size === 0 && (
          <p style={{ fontSize: 13, color: T3, textAlign: 'center', padding: '12px 0' }}>Select at least one cuisine type to continue</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 22px', borderRadius: 11, border: `1.5px solid ${BD}`, background: W, color: T2, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <motion.button onClick={() => { if (selected.size === 0) return; onNext(selected, selectedItems); }}
            whileHover={{ scale: selected.size > 0 ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: selected.size > 0 ? RA : BD, color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: selected.size > 0 ? 'pointer' : 'not-allowed', transition: 'background .2s' }}>
            Continue <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: Operations ─── */
function OperationsStep({ onNext, onBack, submitting }: { onNext: () => void; onBack: () => void; submitting?: boolean }) {
  const [form, setForm] = useState({ open: '', close: '', prepTime: '', delivery: '', dine: '', payment: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const f = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const TIMES = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM','12:00 AM'];
  const PREPS = ['10 minutes','15 minutes','20 minutes','25 minutes','30 minutes','45 minutes','1 hour'];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.open) e.open = 'Select opening time';
    if (!form.close) e.close = 'Select closing time';
    if (!form.prepTime) e.prepTime = 'Select prep time';
    if (!form.payment) e.payment = 'Select payment method';
    return e;
  };

  const PAYMENTS = [
    { v: 'cash_only', l: 'Cash Only', e: '💵' },
    { v: 'digital', l: 'Digital (UPI/Card)', e: '📱' },
    { v: 'both', l: 'Cash + Digital', e: '✅' },
  ];
  const ORDERS = [
    { v: 'delivery', l: 'Delivery', e: '🛵' },
    { v: 'dine', l: 'Dine-in', e: '🍽️' },
    { v: 'both', l: 'Both', e: '✅' },
    { v: 'pickup', l: 'Pickup', e: '📦' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div style={{ background: W, borderRadius: 20, padding: '32px 28px', boxShadow: SH2, border: `1px solid ${BD}` }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.3rem', color: T1 }}>Operations & Timing</h2>
          <p style={{ fontSize: 13, color: T3, marginTop: 2 }}>Set your operating hours and order preferences</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Opening Time</label>
            <select value={form.open} onChange={e => f('open', e.target.value)} style={{ ...inp(errors.open), appearance: 'none', cursor: 'pointer', color: form.open ? T1 : T3 }}>
              <option value="">Select time</option>
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.open && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.open}</p>}
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Closing Time</label>
            <select value={form.close} onChange={e => f('close', e.target.value)} style={{ ...inp(errors.close), appearance: 'none', cursor: 'pointer', color: form.close ? T1 : T3 }}>
              <option value="">Select time</option>
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.close && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.close}</p>}
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Avg Preparation Time</label>
            <select value={form.prepTime} onChange={e => f('prepTime', e.target.value)} style={{ ...inp(errors.prepTime), appearance: 'none', cursor: 'pointer', color: form.prepTime ? T1 : T3 }}>
              <option value="">Select prep time</option>
              {PREPS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.prepTime && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.prepTime}</p>}
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Payment Accepted</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PAYMENTS.map(({ v, l, e }) => (
                <button key={v} onClick={() => f('payment', v)}
                  style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: `1.5px solid ${form.payment === v ? RA : BD}`, background: form.payment === v ? `${RA}08` : W, cursor: 'pointer', textAlign: 'center', transition: 'all .12s' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{e}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: form.payment === v ? RA : T2 }}>{l}</div>
                </button>
              ))}
            </div>
            {errors.payment && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.payment}</p>}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 10, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>Order Types Accepted</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {ORDERS.map(({ v, l, e }) => (
              <button key={v} onClick={() => f('delivery', v)}
                style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${form.delivery === v ? RA : BD}`, background: form.delivery === v ? `${RA}08` : W, cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 22, marginBottom: 5 }}>{e}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: form.delivery === v ? RA : T2 }}>{l}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 22px', borderRadius: 11, border: `1.5px solid ${BD}`, background: W, color: T2, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <motion.button onClick={() => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } onNext(); }}
            disabled={submitting} whileHover={{ scale: submitting ? 1 : 1.02 }} whileTap={{ scale: submitting ? 1 : 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: submitting ? '#6B7280' : RA, color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: `0 4px 20px ${RA}40`, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Submitting…' : <> Submit Registration <ArrowRight size={16} /></>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── PDF Export ─── */
function escHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function exportRestaurantPDF(restData: Record<string, string>, cuisines: Set<string>) {
  const ref = `ZYX-R-${Date.now()}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const cuisineList = [...cuisines].map(id => CUISINES.find(c => c.id === id)?.n).filter(Boolean);

  const logoSVG = `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><rect width="44" height="44" rx="10" fill="#0DA366"/><text x="22" y="30" text-anchor="middle" font-size="19" font-weight="900" font-style="italic" fill="white" letter-spacing="-1" font-family="Arial,sans-serif">//</text></svg>`;

  const rows = [
    ['Restaurant Name', restData.name || '—'],
    ['Owner / Manager', restData.owner || '—'],
    ['Mobile Number', restData.phone || '—'],
    ['Area / Colony', restData.area || '—'],
    ['Full Address', restData.address || '—'],
    ['Restaurant Type', restData.type || '—'],
    ...(restData.seating ? [['Seating Capacity', `${restData.seating} seats`]] : []),
  ];

  const tableRows = rows.map(([ label, val ], i) =>
    `<tr style="background:${i%2===0?'#fff':'#F9FAFB'}">
      <td style="padding:11px 16px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;width:38%;border-right:1px solid #F3F4F6;">${escHtml(label)}</td>
      <td style="padding:11px 16px;font-size:13.5px;font-weight:600;color:#111827;">${escHtml(val)}</td>
    </tr>`
  ).join('');

  const cuisineTags = cuisineList.map(n =>
    `<span style="display:inline-block;background:#FFF1F2;border:1.5px solid #FECDD3;color:#9F1239;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;margin:3px 4px 3px 0;">${escHtml(n)}</span>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Restaurant Registration – ZYPHIX</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,Arial,sans-serif;}
  body{background:#fff;color:#111827;max-width:820px;margin:0 auto;}
  .banner{background:linear-gradient(135deg,#0A0E1A 0%,#101828 100%);padding:26px 36px;display:flex;align-items:center;justify-content:space-between;}
  .logo-row{display:flex;align-items:center;gap:12px;}
  .wordmark{font-size:28px;font-weight:900;letter-spacing:-.05em;line-height:1;}
  .wordmark .g{color:#0DA366;font-style:italic;}
  .wordmark .w{color:#ffffff;}
  .doc-label{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:4px;letter-spacing:.04em;text-transform:uppercase;}
  .status-pill{background:#E11D48;color:#fff;font-size:11px;font-weight:800;padding:7px 18px;border-radius:99px;letter-spacing:.04em;}
  .body{padding:32px 36px 28px;}
  .title-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;}
  .doc-title{font-size:24px;font-weight:900;color:#111827;letter-spacing:-.03em;}
  .submitted{font-size:12.5px;color:#6B7280;margin-bottom:18px;}
  .ref-box{display:inline-flex;align-items:center;gap:10px;background:#FFF1F2;border:1.5px solid #FECDD3;border-radius:10px;padding:10px 18px;margin-bottom:28px;}
  .ref-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9CA3AF;}
  .ref-value{font-size:14px;font-weight:900;color:#E11D48;letter-spacing:.02em;}
  .sec-head{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:#9CA3AF;border-top:1px solid #E5E7EB;padding-top:18px;margin-bottom:12px;}
  .info-table{width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:24px;}
  .cuisine-wrap{margin-bottom:24px;padding:16px;background:#FAFAFA;border:1px solid #F3F4F6;border-radius:12px;}
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
      <div class="doc-label">Restaurant Partner Document</div>
    </div>
  </div>
  <div class="status-pill">✓ Registration Received</div>
</div>

<div class="body">
  <div class="title-row">
    <div>
      <div class="doc-title">Restaurant Registration</div>
      <div class="submitted">Submitted on ${date} &nbsp;·&nbsp; Clavix Technologies Pvt. Ltd., India</div>
    </div>
  </div>

  <div class="ref-box">
    <div>
      <div class="ref-label">Reference Number</div>
      <div class="ref-value">${ref}</div>
    </div>
  </div>

  <div class="sec-head">Restaurant Details</div>
  <table class="info-table">
    ${tableRows}
  </table>

  ${cuisineList.length > 0 ? `
  <div class="sec-head">Cuisine Types &amp; Menu (${cuisineList.length} selected)</div>
  <div class="cuisine-wrap">${cuisineTags}</div>` : ''}

  <div class="next-box">
    <div class="next-title">What Happens Next</div>
    <div class="step"><div class="step-num">1</div><div class="step-text">Our team will call you on <strong>${escHtml(restData.phone || 'your number')}</strong> within 24 hours to verify your restaurant</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-text">We'll help you upload your menu, photos, and pricing on ZyphixEats</div></div>
    <div class="step"><div class="step-num">3</div><div class="step-text">Your restaurant goes live and starts receiving orders from customers near you!</div></div>
  </div>
</div>

<div class="footer">
  <div class="footer-left">
    This is an auto-generated registration confirmation. Keep it for your records.<br/>
    Zyphix · Clavix Technologies Pvt. Ltd. · India · <strong>wa.me/919682394363</strong>
  </div>
  <div class="footer-right">ZyphixEats Partner Program<br/>${date}</div>
</div>

<script>window.onload=()=>{window.print();}</script>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
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

/* ─── Step 4: Success ─── */
const BENEFITS = [
  { icon: '📈', title: '3× More Orders', desc: 'Reach customers who can\'t visit physically — online orders add 30–60% revenue on average' },
  { icon: '💰', title: '₹0 Setup Cost', desc: 'No monthly fees, no listing charges. We only earn when you earn — a tiny commission per order' },
  { icon: '⚡', title: 'Live in 24 Hours', desc: 'Once verified, your restaurant goes live on ZyphixEats and starts receiving orders immediately' },
  { icon: '🛵', title: 'Delivery Handled', desc: 'Our local delivery fleet covers your area — you focus on cooking, we handle the last mile' },
];

function SuccessStep({ restData, cuisines }: { restData: Record<string, string>; cuisines: Set<string> }) {
  const [, setLoc] = useLocation();
  return (
    <>
    <FlowerBurst />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 180 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
        <motion.div animate={{ rotate: [0, 14, -14, 10, -8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.8 }}
          style={{ fontSize: 64, marginBottom: 20 }}>🍽️</motion.div>

        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.8rem', color: T1, letterSpacing: '-.03em', marginBottom: 10 }}>
          {restData.name || 'Your Restaurant'} is registered!
        </h2>
        <p style={{ color: T2, fontSize: 14.5, lineHeight: 1.7, marginBottom: 28 }}>
          Our team will contact you on <strong>{restData.phone}</strong> within 24 hours to verify your listing and get you live on ZyphixEats.
        </p>

        {/* Cuisines summary */}
        {cuisines.size > 0 && (
          <div style={{ background: W, borderRadius: 16, padding: '16px 20px', border: `1px solid ${BD}`, boxShadow: SH, marginBottom: 20, textAlign: 'left' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Cuisines registered ({cuisines.size})</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...cuisines].map(id => {
                const c = CUISINES.find(x => x.id === id);
                if (!c) return null;
                return (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.bg, border: `1px solid ${c.c}30`, color: c.c, fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 99 }}>
                    <img src={c.img} alt={c.n} width={16} height={16} style={{ objectFit: 'contain' }} /> {c.n}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* How Zyphix helps grow */}
        <div style={{ background: 'linear-gradient(135deg,#0A0E1A,#0D1520)', borderRadius: 20, padding: '24px 24px', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 16, textAlign: 'center' }}>
            🚀 How ZyphixEats grows your restaurant business
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {BENEFITS.map(({ icon, title, desc }) => (
              <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '14px 14px' }}>
                <div style={{ fontSize: 24, marginBottom: 7 }}>{icon}</div>
                <p style={{ fontWeight: 800, color: '#fff', fontSize: 13, marginBottom: 5 }}>{title}</p>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.5)', lineHeight: 1.55 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What's next */}
        <div style={{ background: `${RA}0C`, border: `1.5px solid ${RA}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: RA, fontWeight: 700, marginBottom: 8 }}>⏱ What happens next?</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Our team verifies your restaurant (within 24 hrs)', 'We help you upload your menu with photos', 'Your restaurant goes live on ZyphixEats!'].map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: T2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: RA, color: '#fff', fontSize: 10, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <motion.button onClick={() => exportRestaurantPDF(restData, cuisines)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '13px 24px', borderRadius: 12, background: W, border: `2px solid ${RA}`, color: RA, fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: SH }}>
            <FileDown size={17} /> Export to PDF
          </motion.button>
          <motion.button onClick={() => setLoc('/')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '13px 24px', borderRadius: 12, background: RA, color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: `0 4px 20px ${RA}40` }}>
            Back to Home
          </motion.button>
        </div>
      </div>
    </motion.div>
    </>
  );
}

/* ─── Main Page ─── */
export function RestaurantSetup() {
  const [step, setStep] = useState(0);
  const [restData, setRestData] = useState<Record<string, string>>({});
  const [cuisines, setCuisines] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [, setLoc] = useLocation();

  const handleOperationsNext = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/partner-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: restData.owner || restData.name,
          email: restData.email,
          phone: restData.phone,
          city: restData.area || 'India',
          role: 'restaurant',
          details: {
            restaurantName: restData.name,
            restaurantType: restData.type,
            address: restData.address,
            seating: restData.seating,
            cuisines: [...cuisines].join(', '),
          },
        }),
      });
    } catch { /* non-blocking */ }
    setSubmitting(false);
    setStep(3); window.scrollTo(0, 0);
  };

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, padding: '0 24px', position: 'sticky', top: 0, zIndex: 50, boxShadow: SH }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setLoc('/')} style={{ background: BG, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: T2, fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={14} /> Home
          </button>
          <ZyphixLogo size={30} />
          <div style={{ height: 20, width: 1, background: BD }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14.5, color: T1 }}>Register Your Restaurant</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: `${RA}10`, border: `1px solid ${RA}30`, borderRadius: 99, padding: '5px 14px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: RA, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: RA }}>ZyphixEats Partner Program Open</span>
          </div>
        </div>
      </div>

      <StepBar step={step} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>
        <AnimatePresence mode="wait">
          {step === 0 && <RestaurantInfoStep key="r0" onNext={d => { setRestData(d as Record<string, string>); setStep(1); window.scrollTo(0, 0); }} />}
          {step === 1 && <MenuStep key="r1" onNext={(c, _) => { setCuisines(c); setStep(2); window.scrollTo(0, 0); }} onBack={() => { setStep(0); window.scrollTo(0, 0); }} />}
          {step === 2 && <OperationsStep key="r2" onNext={handleOperationsNext} submitting={submitting} onBack={() => { setStep(1); window.scrollTo(0, 0); }} />}
          {step === 3 && <SuccessStep key="r3" restData={restData} cuisines={cuisines} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
