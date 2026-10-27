import { apiFetch } from '@/lib/api';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { ArrowLeft, ArrowRight, Check, Upload, User, Bike, Calendar, CreditCard, FileDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { RegisterShell } from '@/components/register/RegisterShell';
import { exportApplicationPDF } from '@/components/register/applicationPdf';
import { StepIntro, Section, Field, TextInput, SelectInput, Actions, StateCityFields, isPhone, isEmail, digits10 } from '@/components/register/FormKit';
import { MapPin, Mail } from 'lucide-react';
import { RegisterSuccess, SuccessButton } from '@/components/register/RegisterSuccess';

const G = '#0DA366'; const T1 = '#111827'; const T2 = '#6B7280';
const T3 = '#9CA3AF'; const BD = '#E5E7EB'; const W = '#FFFFFF'; const BG = '#F8F9FA';
const SH = '0 2px 8px rgba(0,0,0,.07)'; const SH2 = '0 4px 24px rgba(0,0,0,.10)';

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
  { label:'Personal', icon:<User size={14}/> },
  { label:'License', icon:<CreditCard size={14}/> },
  { label:'Vehicle', icon:<Bike size={14}/> },
  { label:'Availability', icon:<Calendar size={14}/> },
  { label:'Done', icon:<Check size={14}/> },
];

function StepBar({ step }: { step: number }) {
  return (
    <div style={{ background:W, borderBottom:`1px solid ${BD}`, padding:'0 24px' }}>
      <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', padding:'16px 0', gap:0 }}>
        {STEPS.map((s,i)=>(
          <div key={s.label} style={{ display:'flex', alignItems:'center', flex:i<STEPS.length-1?1:'auto' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:64 }}>
              <motion.div animate={{ background:i<=step?G:BD, color:i<=step?'#fff':T3 }}
                style={{ width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:5,transition:'all .3s' }}>
                {i<step?<Check size={15}/>:i===step?s.icon:<span style={{fontSize:12,fontWeight:700}}>{i+1}</span>}
              </motion.div>
              <span style={{ fontSize:10.5,fontWeight:i<=step?700:500,color:i<=step?T1:T3,whiteSpace:'nowrap' }}>{s.label}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ flex:1,height:2,margin:'0 4px',marginBottom:18,background:i<step?G:BD,transition:'background .3s' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Personal Details ─── */
function PersonalStep({ onNext }: { onNext:(d:object)=>void }) {
  const q = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({ name: q.get('name') || '', phone: q.get('phone') || '', email: q.get('email') || '', age:'', area:'', state:'', city:'', locality:'', emergency:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const f = (k:string,v:string) => { setForm(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:''})); };

  const validate = () => {
    const e:Record<string,string>={};
    if (!form.name.trim()) e.name='Name required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone='Enter valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Enter a valid email address';
    const age=parseInt(form.age);
    if (!form.age||isNaN(age)||age<18||age>55) e.age='Age must be 18–55';
    if (!form.state) e.state='Choose your state';
    if (!form.city.trim()) e.city='Choose or type your city';
    if (!form.locality.trim()) e.locality='Tell us the area you want to ride in';
    if (!/^[0-9]{10}$/.test(form.emergency)) e.emergency='Enter valid 10-digit number';
    return e;
  };

  const next = () => { const e=validate();if(Object.keys(e).length){setErrors(e);return;} onNext({ ...form, area: `${form.locality.trim()}, ${form.city.trim()}, ${form.state}` }); };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <StepIntro title="Let's get to know you" sub="Takes about two minutes. Your details stay private and are only used for onboarding." />

      <Section n={1} first title="About you" desc="Use your name exactly as it appears on your Aadhaar card.">
        <Field label="Full name" error={errors.name}>
          <TextInput icon={<User size={18} />} value={form.name} onValue={v => f('name', v)} placeholder="As on Aadhaar card" autoComplete="name" invalid={!!errors.name} valid={form.name.trim().length > 2} />
        </Field>
        <Field label="Age" hint="18 to 55" error={errors.age}>
          <TextInput icon={<Calendar size={18} />} value={form.age} onValue={v => f('age', v.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="e.g. 24" invalid={!!errors.age} valid={+form.age >= 18 && +form.age <= 55} />
        </Field>
        <StateCityFields state={form.state} city={form.city} onState={v => f('state', v)} onCity={v => f('city', v)} errors={{ state: errors.state, city: errors.city }} />
        <Field label="Area you want to ride in" hint="Locality or neighbourhood" error={errors.locality} full>
          <TextInput icon={<MapPin size={18} />} value={form.locality} onValue={v => f('locality', v)} placeholder="e.g. Rajpur Road, Sector 21" invalid={!!errors.locality} valid={form.locality.trim().length > 2} />
        </Field>
      </Section>

      <Section n={2} title="How we reach you" desc="We call to schedule your document check and app training.">
        <Field label="Mobile number" error={errors.phone}>
          <TextInput prefix="+91" value={form.phone} onValue={v => f('phone', digits10(v))} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" invalid={!!errors.phone} valid={isPhone(form.phone)} />
        </Field>
        <Field label="Emergency contact" hint="Parent or spouse" error={errors.emergency}>
          <TextInput prefix="+91" value={form.emergency} onValue={v => f('emergency', digits10(v))} type="tel" inputMode="numeric" placeholder="98765 43210" invalid={!!errors.emergency} valid={isPhone(form.emergency)} />
        </Field>
        <Field label="Email" optional hint="For your confirmation" error={errors.email} full>
          <TextInput icon={<Mail size={18} />} value={form.email} onValue={v => f('email', v)} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} valid={isEmail(form.email)} />
        </Field>
      </Section>

      <Actions onNext={next} label="Continue to licence" note="Free to apply. No joining fee." />
    </motion.div>
  );
}


/* ─── Upload Box ─── */
function UploadBox({ label, preview, onChange, required }: { label:string; preview:string|null; onChange:(url:string)=>void; required?:boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => { if (e.target?.result) onChange(e.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:8 }}>{label}{required&&<span style={{color:'#EF4444'}}> *</span>}</label>
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])} />
      <motion.div whileHover={{scale:1.02,borderColor:G}} whileTap={{scale:.98}}
        onClick={()=>ref.current?.click()}
        style={{ width:'100%', height:140, borderRadius:14, border:`2px dashed ${preview?G:BD}`, background:preview?`${G}06`:W, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, overflow:'hidden', position:'relative', transition:'all .2s' }}>
        {preview ? (
          <>
            <img src={preview} alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.8 }} />
            <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,.3)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:6 }}>
              <Check size={28} color="#fff" strokeWidth={2.5} />
              <span style={{ color:'#fff',fontSize:12.5,fontWeight:700 }}>Tap to change</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ width:44,height:44,borderRadius:12,background:`${G}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Upload size={20} color={G} />
            </div>
            <span style={{ fontSize:13,fontWeight:700,color:T2 }}>Tap to upload photo</span>
            <span style={{ fontSize:11.5,color:T3 }}>JPG, PNG or HEIC</span>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Step 2: License ─── */
function LicenseStep({ onNext, onBack }: { onNext:(d:object)=>void; onBack:()=>void }) {
  const [hasLicense, setHasLicense] = useState<boolean|null>(null);
  const [front, setFront] = useState<string|null>(null);
  const [back, setBack] = useState<string|null>(null);
  const [licNo, setLicNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});

  const next = () => {
    if (hasLicense===null) { setErrors({lic:'Please select an option'}); return; }
    if (hasLicense) {
      const e:Record<string,string>={};
      if (!front) e.front='Please upload front photo';
      if (!back) e.back='Please upload back photo';
      if (!licNo.trim()) e.licNo='License number required';
      if (!expiry) e.expiry='Expiry date required';
      if (Object.keys(e).length){setErrors(e);return;}
    }
    onNext({ hasLicense, licNo, expiry, hasFront:!!front, hasBack:!!back });
  };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:620, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Geist', 'Geist Fallback', sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Driving License</h2>
          <p style={{ color:T2,fontSize:14 }}>A valid license is required to deliver on Zyphix</p>
        </div>

        {/* Yes / No choice */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:10 }}>Do you have a valid driving license?</label>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            {[
              { v:true, e:'✅', l:'Yes, I have a license', bg:'#ECFDF5', bd:G, tc:'#065F46' },
              { v:false, e:'❌', l:"No, I don't have one", bg:'#FFF1F2', bd:'#EF4444', tc:'#9F1239' },
            ].map(({v,e,l,bg,bd,tc})=>(
              <motion.button key={String(v)} whileHover={{scale:1.03,y:-2}} whileTap={{scale:.97}}
                onClick={()=>{setHasLicense(v);setErrors({});}}
                style={{ padding:'20px 14px',borderRadius:16,background:hasLicense===v?bg:W,border:`2px solid ${hasLicense===v?bd:BD}`,cursor:'pointer',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:8,boxShadow:hasLicense===v?`0 0 0 3px ${bd}20`:SH,transition:'all .15s' }}>
                <span style={{fontSize:32}}>{e}</span>
                <span style={{fontSize:13,fontWeight:700,color:hasLicense===v?tc:T2,lineHeight:1.3}}>{l}</span>
              </motion.button>
            ))}
          </div>
          {errors.lic && <p style={{fontSize:11.5,color:'#EF4444',marginTop:8}}>{errors.lic}</p>}
        </div>

        <AnimatePresence>
          {hasLicense===true && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
              <div style={{ background:W,borderRadius:16,padding:'22px',border:`1.5px solid ${BD}`,boxShadow:SH,marginBottom:4 }}>
                <p style={{ fontSize:13,fontWeight:700,color:T1,marginBottom:18 }}>📸 Upload your driving license photos</p>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16 }}>
                  <div>
                    <UploadBox label="Front Side" preview={front} onChange={setFront} required />
                    {errors.front && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.front}</p>}
                  </div>
                  <div>
                    <UploadBox label="Back Side" preview={back} onChange={setBack} required />
                    {errors.back && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.back}</p>}
                  </div>
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:12 }}>
                  <div>
                    <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>License Number</label>
                    <input value={licNo} onChange={e=>{setLicNo(e.target.value.toUpperCase());setErrors(p=>({...p,licNo:''}));}}
                      placeholder="e.g. JK0119990012345" style={inp(errors.licNo)}
                      onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                      onBlur={e=>{e.target.style.borderColor=errors.licNo?'#EF4444':BD;e.target.style.boxShadow='none';}} />
                    {errors.licNo && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.licNo}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Expiry Date</label>
                    <input type="date" value={expiry} onChange={e=>{setExpiry(e.target.value);setErrors(p=>({...p,expiry:''}));}}
                      style={inp(errors.expiry)}
                      onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                      onBlur={e=>{e.target.style.borderColor=errors.expiry?'#EF4444':BD;e.target.style.boxShadow='none';}} />
                    {errors.expiry && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.expiry}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {hasLicense===false && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <div style={{ background:'#FFFBEB',border:'1.5px solid #FDE68A',borderRadius:14,padding:'16px 18px',marginBottom:4 }}>
                <p style={{ fontSize:13.5,fontWeight:700,color:'#78350F',marginBottom:4 }}>⚠️ License Required</p>
                <p style={{ fontSize:13,color:'#92400E',lineHeight:1.6 }}>A valid driving license is mandatory to deliver on Zyphix. You can still register and upload it later once you get one.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display:'flex',gap:12,marginTop:24 }}>
          <button onClick={onBack} style={{ padding:'14px 22px',borderRadius:12,background:W,border:`1.5px solid ${BD}`,color:T2,fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
            <ArrowLeft size={15}/> Back
          </button>
          <motion.button onClick={next} whileHover={{scale:1.02}} whileTap={{scale:.97}}
            style={{ flex:1,padding:'15px',borderRadius:13,background:G,color:'#fff',fontSize:15.5,fontWeight:800,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 6px 24px ${G}45` }}>
            Continue to Vehicle <ArrowRight size={16}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: Vehicle ─── */
function VehicleStep({ onNext, onBack }: { onNext:(d:object)=>void; onBack:()=>void }) {
  const [type, setType] = useState<'ev'|'petrol'|null>(null);
  const [brand, setBrand] = useState('');
  const [regNo, setRegNo] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});

  const next = () => {
    const e:Record<string,string>={};
    if (!type) e.type='Please select vehicle type';
    if (!brand.trim()) e.brand='Enter vehicle brand/model';
    if (!regNo.trim()) e.regNo='Enter registration number';
    if (Object.keys(e).length){setErrors(e);return;}
    onNext({ type, brand, regNo });
  };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:620, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Geist', 'Geist Fallback', sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Your Vehicle</h2>
          <p style={{ color:T2,fontSize:14 }}>Only two-wheelers are currently supported</p>
        </div>

        {/* EV / Petrol selector */}
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:12 }}>Vehicle Type</label>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            {[
              {
                v:'ev' as const,
                icon:'⚡',
                title:'Electric (EV)',
                sub:'Battery-powered scooter\nActiva-E, Ola S1, Ather etc.',
                grad:'linear-gradient(140deg,#ECFDF5,#D1FAE5)',
                bd:G,
                glow:G,
                tc:'#065F46',
                badge:'🌱 Eco-friendly',
                badgeBg:'#ECFDF5',
                badgeTc:'#065F46',
              },
              {
                v:'petrol' as const,
                icon:'⛽',
                title:'Petrol',
                sub:'Petrol-powered scooter\nHero Splendor, Activa, etc.',
                grad:'linear-gradient(140deg,#FFF7ED,#FFEDD5)',
                bd:'#EA580C',
                glow:'#EA580C',
                tc:'#9A3412',
                badge:'💨 Standard',
                badgeBg:'#FFF7ED',
                badgeTc:'#9A3412',
              },
            ].map(({v,icon,title,sub,grad,bd,glow,tc,badge,badgeBg,badgeTc})=>(
              <motion.button key={v} whileHover={{scale:1.03,y:-4}} whileTap={{scale:.97}}
                onClick={()=>{setType(v);setErrors(p=>({...p,type:''}));}}
                style={{ padding:'24px 16px 20px',borderRadius:20,background:type===v?grad:W,border:`2.5px solid ${type===v?bd:BD}`,cursor:'pointer',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:10,boxShadow:type===v?`0 8px 28px ${glow}30`:SH2,transition:'all .2s',position:'relative' }}>
                {type===v && (
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300}}
                    style={{ position:'absolute',top:12,right:12,width:22,height:22,borderRadius:'50%',background:bd,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Check size={12} color="#fff" strokeWidth={3}/>
                  </motion.div>
                )}
                <motion.span animate={{y:type===v?[0,-4,0]:0}} transition={{repeat:type===v?Infinity:0,duration:1.5}} style={{fontSize:44,lineHeight:1}}>{icon}</motion.span>
                <div>
                  <p style={{ fontFamily:"'Geist', 'Geist Fallback', sans-serif",fontWeight:900,fontSize:16,color:type===v?tc:T1,marginBottom:4 }}>{title}</p>
                  <p style={{ fontSize:11.5,color:type===v?`${tc}CC`:T3,lineHeight:1.5,whiteSpace:'pre-line' }}>{sub}</p>
                </div>
                <span style={{ display:'inline-block',background:type===v?badgeBg:'#F3F4F6',color:type===v?badgeTc:T3,fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:99 }}>{badge}</span>
              </motion.button>
            ))}
          </div>
          {errors.type && <p style={{fontSize:11.5,color:'#EF4444',marginTop:8}}>{errors.type}</p>}
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:4 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Brand & Model</label>
            <input value={brand} onChange={e=>{setBrand(e.target.value);setErrors(p=>({...p,brand:''}));}} placeholder="e.g. Honda Activa 6G" style={inp(errors.brand)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.brand?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.brand && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.brand}</p>}
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Registration Number</label>
            <input value={regNo} onChange={e=>{setRegNo(e.target.value.toUpperCase());setErrors(p=>({...p,regNo:''}));}} placeholder="e.g. JK01A 1234" style={inp(errors.regNo)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.regNo?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.regNo && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.regNo}</p>}
          </div>
        </div>

        <div style={{ display:'flex',gap:12,marginTop:24 }}>
          <button onClick={onBack} style={{ padding:'14px 22px',borderRadius:12,background:W,border:`1.5px solid ${BD}`,color:T2,fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
            <ArrowLeft size={15}/> Back
          </button>
          <motion.button onClick={next} whileHover={{scale:1.02}} whileTap={{scale:.97}}
            style={{ flex:1,padding:'15px',borderRadius:13,background:G,color:'#fff',fontSize:15.5,fontWeight:800,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 6px 24px ${G}45` }}>
            Continue to Availability <ArrowRight size={16}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 4: Availability ─── */
function AvailabilityStep({ onNext, onBack, submitting }: { onNext:()=>void; onBack:()=>void; submitting?:boolean }) {
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const SHIFTS = [
    { v:'morning',  e:'🌅', l:'Morning',   t:'6 AM – 2 PM' },
    { v:'evening',  e:'🌇', l:'Evening',   t:'2 PM – 10 PM' },
    { v:'night',    e:'🌙', l:'Night',     t:'10 PM – 6 AM' },
    { v:'flexible', e:'⚡', l:'Flexible',  t:'Any time' },
  ];
  const [days, setDays] = useState<Set<string>>(new Set(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']));
  const [shift, setShift] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const toggleDay = (d:string) => setDays(p=>{const n=new Set(p);n.has(d)?n.delete(d):n.add(d);return n;});

  const next = () => {
    const e:Record<string,string>={};
    if (days.size===0) e.days='Select at least one day';
    if (!shift) e.shift='Select a shift preference';
    if (Object.keys(e).length){setErrors(e);return;}
    onNext();
  };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:620, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Geist', 'Geist Fallback', sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Your Availability</h2>
          <p style={{ color:T2,fontSize:14 }}>When are you available to deliver?</p>
        </div>

        {/* Days */}
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:10 }}>Available Days</label>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {DAYS.map(d=>{
              const on=days.has(d);
              return (
                <motion.button key={d} whileHover={{scale:1.06}} whileTap={{scale:.94}} onClick={()=>{toggleDay(d);setErrors(p=>({...p,days:''}));}}
                  style={{ padding:'10px 18px',borderRadius:99,background:on?G:W,border:`1.5px solid ${on?G:BD}`,color:on?'#fff':T2,fontSize:13,fontWeight:700,cursor:'pointer',transition:'all .15s',boxShadow:on?`0 2px 10px ${G}40`:SH }}>
                  {d}
                </motion.button>
              );
            })}
          </div>
          {errors.days && <p style={{fontSize:11.5,color:'#EF4444',marginTop:8}}>{errors.days}</p>}
        </div>

        {/* Shift */}
        <div style={{ marginBottom:4 }}>
          <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:12 }}>Preferred Shift</label>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10 }}>
            {SHIFTS.map(({v,e,l,t})=>{
              const on=shift===v;
              return (
                <motion.button key={v} whileHover={{scale:1.03,y:-2}} whileTap={{scale:.97}}
                  onClick={()=>{setShift(v);setErrors(p=>({...p,shift:''}));}}
                  style={{ padding:'16px 12px',borderRadius:14,background:on?`${G}0E`:W,border:`2px solid ${on?G:BD}`,cursor:'pointer',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:6,boxShadow:on?`0 4px 16px ${G}25`:SH,transition:'all .15s' }}>
                  <span style={{fontSize:28}}>{e}</span>
                  <p style={{ fontFamily:"'Geist', 'Geist Fallback', sans-serif",fontWeight:800,fontSize:14,color:on?'#065F46':T1 }}>{l}</p>
                  <p style={{ fontSize:11.5,color:on?'#059669':T3,fontWeight:500 }}>{t}</p>
                </motion.button>
              );
            })}
          </div>
          {errors.shift && <p style={{fontSize:11.5,color:'#EF4444',marginTop:8}}>{errors.shift}</p>}
        </div>

        <div style={{ display:'flex',gap:12,marginTop:24 }}>
          <button onClick={onBack} style={{ padding:'14px 22px',borderRadius:12,background:W,border:`1.5px solid ${BD}`,color:T2,fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
            <ArrowLeft size={15}/> Back
          </button>
          <motion.button onClick={next} disabled={submitting} whileHover={{scale:submitting?1:1.02}} whileTap={{scale:submitting?1:.97}}
            style={{ flex:1,padding:'15px',borderRadius:13,background:submitting?'#6B7280':G,color:'#fff',fontSize:15.5,fontWeight:800,border:'none',cursor:submitting?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 6px 24px ${G}45`,opacity:submitting?.7:1 }}>
            {submitting ? 'Submitting…' : <> Submit Application <ArrowRight size={16}/></>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── PDF export helper ─── */
function escHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function exportDeliveryPDF(personal: Record<string,string>) {
  exportApplicationPDF({
    track: 'delivery',
    title: personal.name || 'Delivery partner',
    sections: [
      { heading: 'About you', rows: [['Full name', personal.name], ['Age', personal.age], ['Riding area', personal.area]] },
      { heading: 'Contact', rows: [['Mobile', personal.phone ? `+91 ${personal.phone}` : undefined], ['Emergency contact', personal.emergency ? `+91 ${personal.emergency}` : undefined], ['Email', personal.email]] },
    ],
    nextSteps: ['Document verification by our team', 'Background check (24–48 hours)', 'App onboarding and a short training session', 'Start delivering in your area'],
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

/* ─── Step 5: Success ─── */
function SuccessStep({ personal }: { personal: Record<string,string> }) {
  const [, setLoc] = useLocation();
  return (
    <RegisterSuccess
      track="delivery"
      name={personal.name}
      message={<>We have your delivery partner application. Our team will verify your documents and call <strong className="text-white">{personal.phone}</strong> within 48 hours.</>}
      nextSteps={['Document verification by our team', 'Background check (24–48 hours)', 'App onboarding and a short training session', 'Start delivering in your area']}
      actions={<>
        <SuccessButton onClick={() => exportDeliveryPDF(personal)}><FileDown size={17} /> Save as PDF</SuccessButton>
        <SuccessButton primary onClick={() => setLoc('/')}>Back to partner home</SuccessButton>
      </>}
    />
  );
}

/* ─── Main Page ─── */
export function DeliverySetup() {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [, setLoc] = useLocation();

  const go = (s:number) => { setStep(s); window.scrollTo(0,0); };

  const handleAvailabilityNext = async () => {
    setSubmitting(true); setSubmitError('');
    let sent = false;
    try {
      const res = await apiFetch('/api/partner-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personal.name,
          email: personal.email,
          phone: personal.phone,
          city: personal.area || 'India',
          role: 'delivery',
          details: {
            age: personal.age,
            emergencyContact: personal.emergency,
          },
        }),
      });
      sent = res.ok;
    } catch { /* offline */ }
    if (!sent) { setSubmitting(false); setSubmitError("We couldn't send your application. Check your internet connection and tap submit again. Your answers are still here."); return; }
    setSubmitting(false);
    go(4);
  };

  return (
    <RegisterShell track="delivery" error={submitError} onDismissError={() => setSubmitError('')} steps={['Personal', 'Licence', 'Vehicle', 'Availability']} step={step} done={step===4}>
      <div>
        <AnimatePresence mode="wait">
          {step===0 && <PersonalStep key="s0" onNext={d=>{setPersonal(d as Record<string,string>);go(1);}} />}
          {step===1 && <LicenseStep key="s1" onNext={()=>go(2)} onBack={()=>go(0)} />}
          {step===2 && <VehicleStep key="s2" onNext={()=>go(3)} onBack={()=>go(1)} />}
          {step===3 && <AvailabilityStep key="s3" onNext={handleAvailabilityNext} submitting={submitting} onBack={()=>go(2)} />}
          {step===4 && <SuccessStep key="s4" personal={personal} />}
        </AnimatePresence>
      </div>
    </RegisterShell>
  );
}
