import { apiFetch } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { ArrowLeft, ArrowRight, Check, Utensils, Clock, FileText, Star, FileDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { RegisterShell } from '@/components/register/RegisterShell';
import { exportApplicationPDF } from '@/components/register/applicationPdf';
import { IconBadge, CUISINE_ICONS, PAYMENT_ICONS, ORDER_ICONS } from '@/components/register/icons';
import { Coffee as CoffeeIcon, CookingPot, Flame, Hamburger, Candy, Truck, Home as HomeIcon, Utensils as UtensilsIcon } from 'lucide-react';
const KITCHEN_ICONS: Record<string, any> = {
  'Dine-in Restaurant': UtensilsIcon, 'Cloud Kitchen / Dark Kitchen': CookingPot, 'Dhaba': Flame, 'Cafe': CoffeeIcon,
  'Fast Food Outlet': Hamburger, 'Sweet Shop / Mithai': Candy, 'Food Truck': Truck, 'Home Kitchen': HomeIcon,
};
import { StepIntro, Section, Field, TextInput, SelectInput, TextArea, ChoiceTiles, Actions, StateCityFields, isPhone, isEmail, digits10 } from '@/components/register/FormKit';
import { MapPin, User, Users, Mail } from 'lucide-react';
import { RegisterSuccess, SuccessButton } from '@/components/register/RegisterSuccess';

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
  const [form, setForm] = useState({ name: '', owner: q.get('name') || '', phone: q.get('phone') || '', email: q.get('email') || '', area: '', state: '', city: '', address: '', type: '', seating: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const f = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Restaurant name is required';
    if (!form.owner.trim()) e.owner = 'Owner/manager name is required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.state) e.state = 'Choose your state';
    if (!form.city.trim()) e.city = 'Choose or type your city';
    if (!form.address.trim()) e.address = 'Full address is required';
    if (!form.type) e.type = 'Please select restaurant type';
    return e;
  };

  const TYPES = ['Dine-in Restaurant', 'Cloud Kitchen / Dark Kitchen', 'Dhaba', 'Cafe', 'Fast Food Outlet', 'Sweet Shop / Mithai', 'Food Truck', 'Home Kitchen'];
  const next = () => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } onNext({ ...form, area: `${form.city.trim()}, ${form.state}` }); };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <StepIntro title="Tell us about your restaurant" sub="Takes about two minutes. This becomes your Zyphix Eats listing." />

      <Section n={1} first title="What kind of kitchen is it?" desc="Choose the closest match.">
        <div className="sm:col-span-2">
          <ChoiceTiles cols={4} options={TYPES.map(t => ({ v: t, label: t, icon: <IconBadge icon={KITCHEN_ICONS[t]} size={36} /> }))} value={form.type} onChange={v => f('type', v)} invalid={!!errors.type} />
          {errors.type && <p className="mt-2 text-[12.5px] font-medium text-red-600">{errors.type}</p>}
        </div>
      </Section>

      <Section n={2} title="Restaurant details" desc="Shown to customers on your restaurant page.">
        <Field label="Restaurant name" error={errors.name}>
          <TextInput icon={<Utensils size={18} />} value={form.name} onValue={v => f('name', v)} placeholder="e.g. Sharma Dhaba" invalid={!!errors.name} valid={form.name.trim().length > 2} />
        </Field>
        <Field label="Seating capacity" optional error={errors.seating}>
          <TextInput icon={<Users size={18} />} value={form.seating} onValue={v => f('seating', v.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="e.g. 30 seats" valid={!!form.seating} />
        </Field>
        <StateCityFields state={form.state} city={form.city} onState={v => f('state', v)} onCity={v => f('city', v)} errors={{ state: errors.state, city: errors.city }} />
        <Field label="Full address" error={errors.address} full>
          <TextArea value={form.address} onValue={v => f('address', v)} placeholder="Shop no., street, landmark" rows={2} invalid={!!errors.address} />
        </Field>
      </Section>

      <Section n={3} title="Owner and contact" desc="We call this number to verify your restaurant. It is never shown to customers.">
        <Field label="Owner / manager name" error={errors.owner}>
          <TextInput icon={<User size={18} />} value={form.owner} onValue={v => f('owner', v)} placeholder="Full name" autoComplete="name" invalid={!!errors.owner} valid={form.owner.trim().length > 2} />
        </Field>
        <Field label="Mobile number" error={errors.phone}>
          <TextInput prefix="+91" value={form.phone} onValue={v => f('phone', digits10(v))} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" invalid={!!errors.phone} valid={isPhone(form.phone)} />
        </Field>
        <Field label="Email" optional hint="For your confirmation" error={errors.email} full>
          <TextInput icon={<Mail size={18} />} value={form.email} onValue={v => f('email', v)} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} valid={isEmail(form.email)} />
        </Field>
      </Section>

      <Actions onNext={next} label="Continue to menu" note="Free to apply. No joining fee." />
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

  const exp = expanded && selected.has(expanded) ? CUISINES.find(c => c.id === expanded) : null;
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <StepIntro title="What do you cook?" sub="Pick every cuisine you serve. Tap one again to add its popular dishes to your menu." />

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[13.5px] font-medium text-gray-800">Cuisines</p>
        <AnimatePresence mode="wait">
          <motion.span key={`${selected.size}-${totalItems}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-full px-3 py-1 text-[12.5px] font-semibold tabular-nums"
            style={selected.size ? { background: 'color-mix(in srgb, var(--acc) 10%, white)', color: 'var(--acc)' } : { background: '#F3F4F6', color: '#6B7280' }}>
            {selected.size ? `${selected.size} selected · ${totalItems} dishes` : 'None selected'}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CUISINES.map(({ id, n, c }, i) => {
          const on = selected.has(id);
          const count = selectedItems[id]?.size || 0;
          const isOpen = expanded === id && on;
          return (
            <motion.button key={id} type="button" aria-pressed={on}
              onClick={() => (on && expanded !== id ? setExpanded(id) : toggleCuisine(id))}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.02 * i }}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border-[1.5px] p-3.5 text-left transition-[border-color,background-color,box-shadow] duration-200 ${on ? 'shadow-[0_12px_30px_-16px_rgba(16,24,40,.35)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              style={on ? { borderColor: c, background: `color-mix(in srgb, ${c} 6%, white)` } : undefined}>
              <IconBadge icon={CUISINE_ICONS[id]} color={c} size={40} active={on} />
              <span className="text-[13.5px] font-semibold leading-tight text-gray-900">{n}</span>
              <span className={`text-[12px] ${on ? '' : 'text-gray-400'}`} style={on ? { color: c } : undefined}>
                {on ? (count ? `${count} dish${count > 1 ? 'es' : ''}` : isOpen ? 'Pick dishes below' : 'Tap to add dishes') : 'Add'}
              </span>
              <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] ${on ? 'border-transparent' : 'border-gray-300'}`} style={on ? { background: c } : undefined}>
                <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-white"><Check size={12} strokeWidth={3.2} /></motion.span>}</AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Dish drill-down for the open cuisine */}
      <AnimatePresence mode="wait">
        {exp && (
          <motion.div key={exp.id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconBadge icon={CUISINE_ICONS[exp.id]} color={exp.c} size={34} />
                  <div>
                    <p className="text-[14.5px] font-semibold text-gray-900">{exp.n} dishes</p>
                    <p className="text-[12.5px] text-gray-500">Optional. Helps us set up your menu faster.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedItems(si => ({ ...si, [exp.id]: new Set(MENU_ITEMS[exp.id] || []) }))}
                    className="h-8 rounded-full px-3.5 text-[12.5px] font-semibold text-white" style={{ background: exp.c }}>Select all</button>
                  <button type="button" onClick={() => setSelectedItems(si => ({ ...si, [exp.id]: new Set() }))}
                    className="h-8 rounded-full border border-gray-200 bg-white px-3.5 text-[12.5px] font-semibold text-gray-600 hover:text-gray-900">Clear</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(MENU_ITEMS[exp.id] || []).map(item => {
                  const on = !!selectedItems[exp.id]?.has(item);
                  return (
                    <motion.button key={item} type="button" onClick={() => toggleItem(exp.id, item)} whileTap={{ scale: 0.95 }}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[13px] font-medium transition-colors ${on ? 'text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                      style={on ? { background: exp.c, borderColor: exp.c } : undefined}>
                      {on && <Check size={13} strokeWidth={3} />}{item}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected.size === 0 && <p className="mt-5 text-[13px] text-gray-500">Select at least one cuisine to continue.</p>}

      <Actions onBack={onBack} onNext={() => { if (selected.size === 0) return; onNext(selected, selectedItems); }} label="Continue to operations" />
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
          <h2 style={{ fontFamily: "'Geist', 'Geist Fallback', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: T1 }}>Operations & Timing</h2>
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
                  <div className="mb-2 flex justify-center"><IconBadge icon={PAYMENT_ICONS[v]} color={RA} size={34} active={form.payment === v} /></div>
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
                <div className="mb-2 flex justify-center"><IconBadge icon={ORDER_ICONS[v]} color={RA} size={36} active={form.delivery === v} /></div>
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
  exportApplicationPDF({
    track: 'restaurant',
    title: restData.name || 'Your restaurant',
    sections: [
      { heading: 'Restaurant', rows: [['Restaurant name', restData.name], ['Type', restData.type], ['City', restData.area], ['Seating', restData.seating ? `${restData.seating} seats` : undefined], ['Address', restData.address]] },
      { heading: 'Owner and contact', rows: [['Owner / manager', restData.owner], ['Mobile', restData.phone ? `+91 ${restData.phone}` : undefined], ['Email', restData.email]] },
    ],
    tags: { heading: 'Cuisines', items: [...cuisines].map(id => CUISINES.find(c => c.id === id)?.n).filter(Boolean) as string[] },
    nextSteps: ['Verification call from our partner team', 'Menu, photos and prices uploaded with your onboarding manager', 'Your restaurant goes live on Zyphix Eats'],
  });
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
  { icon: '📈', title: 'More orders', desc: 'Reach people nearby who would never walk in — delivery and pickup from one listing' },
  { icon: '💰', title: '₹0 Setup Cost', desc: 'No monthly fees, no listing charges. We only earn when you earn — a tiny commission per order' },
  { icon: '⚡', title: 'Live in 24 Hours', desc: 'Once verified, your restaurant goes live on ZyphixEats and starts receiving orders immediately' },
  { icon: '🛵', title: 'Delivery Handled', desc: 'Our local delivery fleet covers your area — you focus on cooking, we handle the last mile' },
];

function SuccessStep({ restData, cuisines }: { restData: Record<string, string>; cuisines: Set<string> }) {
  const [, setLoc] = useLocation();
  return (
    <RegisterSuccess
      track="restaurant"
      name={restData.owner}
      headline={restData.name ? `Thank you! ${restData.name} is registered.` : undefined}
      message={<>Our partner team will call <strong className="text-white">{restData.phone}</strong> within 24 hours to verify your restaurant and set up your Zyphix Eats listing.</>}
      nextSteps={['Verification call from our partner team', 'Menu, photos and prices uploaded with your onboarding manager', 'Your restaurant goes live on Zyphix Eats']}
      summary={cuisines.size > 0 ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-500">Cuisines registered · {cuisines.size}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...cuisines].map(id => {
              const c = CUISINES.find(x => x.id === id);
              if (!c) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: c.bg, color: c.c, boxShadow: `inset 0 0 0 1px ${c.c}30` }}>
                  <img src={c.img} alt="" width={16} height={16} style={{ objectFit: 'contain' }} /> {c.n}
                </span>
              );
            })}
          </div>
        </div>
      ) : undefined}
      actions={<>
        <SuccessButton onClick={() => exportRestaurantPDF(restData, cuisines)}><FileDown size={17} /> Save as PDF</SuccessButton>
        <SuccessButton primary accent={RA} onClick={() => setLoc('/')}>Back to partner home</SuccessButton>
      </>}
    />
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
      await apiFetch('/api/partner-register', {
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
    <RegisterShell track="restaurant" steps={['Restaurant info', 'Menu & cuisine', 'Operations']} step={step} done={step === 3}>
      <div>
        <AnimatePresence mode="wait">
          {step === 0 && <RestaurantInfoStep key="r0" onNext={d => { setRestData(d as Record<string, string>); setStep(1); window.scrollTo(0, 0); }} />}
          {step === 1 && <MenuStep key="r1" onNext={(c, _) => { setCuisines(c); setStep(2); window.scrollTo(0, 0); }} onBack={() => { setStep(0); window.scrollTo(0, 0); }} />}
          {step === 2 && <OperationsStep key="r2" onNext={handleOperationsNext} submitting={submitting} onBack={() => { setStep(1); window.scrollTo(0, 0); }} />}
          {step === 3 && <SuccessStep key="r3" restData={restData} cuisines={cuisines} />}
        </AnimatePresence>
      </div>
    </RegisterShell>
  );
}
