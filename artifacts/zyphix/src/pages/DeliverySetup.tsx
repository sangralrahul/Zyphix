import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Upload, User, Bike, Calendar, CreditCard, FileDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZyphixLogo } from '@/components/ZyphixLogo';

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
  const [form, setForm] = useState({ name: q.get('name') || '', phone: q.get('phone') || '', email: q.get('email') || '', age:'', area:'', emergency:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const f = (k:string,v:string) => { setForm(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:''})); };

  const validate = () => {
    const e:Record<string,string>={};
    if (!form.name.trim()) e.name='Name required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone='Enter valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Enter a valid email address';
    const age=parseInt(form.age);
    if (!form.age||isNaN(age)||age<18||age>55) e.age='Age must be 18–55';
    if (!form.area) e.area='Select your area';
    if (!/^[0-9]{10}$/.test(form.emergency)) e.emergency='Enter valid 10-digit number';
    return e;
  };

  const next = () => { const e=validate();if(Object.keys(e).length){setErrors(e);return;} onNext(form); };

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{type:'spring',stiffness:120,damping:18}}>
      <div style={{ maxWidth:620, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Personal Information</h2>
          <p style={{ color:T2,fontSize:14 }}>Your details for the delivery partner account</p>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:12 }}>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Full Name</label>
              <input value={form.name} onChange={e=>f('name',e.target.value)} placeholder="As on Aadhaar card" style={inp(errors.name)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.name?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.name && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.name}</p>}
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Age</label>
              <input value={form.age} onChange={e=>f('age',e.target.value)} type="number" min="18" max="55" placeholder="18–55" style={inp(errors.age)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.age?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.age && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.age}</p>}
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Mobile Number</label>
              <input value={form.phone} onChange={e=>f('phone',e.target.value)} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" style={inp(errors.phone)}
                onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
                onBlur={e=>{e.target.style.borderColor=errors.phone?'#EF4444':BD;e.target.style.boxShadow='none';}} />
              {errors.phone && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.phone}</p>}
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Area / Colony</label>
              <select value={form.area} onChange={e=>f('area',e.target.value)}
                style={{...inp(errors.area),appearance:'none',cursor:'pointer',color:form.area?T1:T3}}>
                <option value="">Select district & locality</option>
                {AREAS_BY_DISTRICT.map(d=>(
                  <optgroup key={d.d} label={`── ${d.d} ──`}>
                    {d.areas.map(a=><option key={a} value={a}>{a}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.area && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.area}</p>}
            </div>
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Emergency Contact Number</label>
            <input value={form.emergency} onChange={e=>f('emergency',e.target.value)} type="tel" inputMode="numeric" maxLength={10} placeholder="Parent / Spouse number" style={inp(errors.emergency)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.emergency?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.emergency && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.emergency}</p>}
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:700,color:T2,textTransform:'uppercase',letterSpacing:'.04em',display:'block',marginBottom:5 }}>Email Address <span style={{color:T2,fontWeight:400,fontSize:11}}>(optional)</span></label>
            <input value={form.email} onChange={e=>f('email',e.target.value)} type="email" inputMode="email" placeholder="you@example.com — for confirmation email" style={inp(errors.email)}
              onFocus={e=>{e.target.style.borderColor=G;e.target.style.boxShadow=`0 0 0 3px ${G}1A`;}}
              onBlur={e=>{e.target.style.borderColor=errors.email?'#EF4444':BD;e.target.style.boxShadow='none';}} />
            {errors.email && <p style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.email}</p>}
          </div>
        </div>
        <motion.button onClick={next} whileHover={{scale:1.02}} whileTap={{scale:.97}}
          style={{ width:'100%',marginTop:28,padding:'15px',borderRadius:13,background:G,color:'#fff',fontSize:15.5,fontWeight:800,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 6px 24px ${G}45` }}>
          Continue to License <ArrowRight size={16}/>
        </motion.button>
      </div>
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
          <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Driving License</h2>
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
          <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Your Vehicle</h2>
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
                  <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:16,color:type===v?tc:T1,marginBottom:4 }}>{title}</p>
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
          <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:'1.55rem',color:T1,letterSpacing:'-.03em',marginBottom:6 }}>Your Availability</h2>
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
                  <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:on?'#065F46':T1 }}>{l}</p>
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
  const ref = 'ZYX-D-' + Date.now().toString(36).toUpperCase();
  const date = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Delivery Partner Application – ZYPHIX</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;}
    body{background:#fff;color:#111827;padding:40px;max-width:800px;margin:0 auto;}
    .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #0DA366;padding-bottom:18px;margin-bottom:28px;}
    .logo{font-size:26px;font-weight:900;letter-spacing:-.04em;color:#111827;}
    .logo span{color:#0DA366;}
    .badge{background:#FFF7ED;border:1.5px solid #FED7AA;color:#9A3412;font-size:12px;font-weight:700;padding:5px 14px;border-radius:99px;}
    h1{font-size:22px;font-weight:900;color:#111827;margin-bottom:6px;}
    .meta{font-size:13px;color:#6B7280;margin-bottom:28px;}
    .ref{font-size:12px;font-weight:700;color:#0DA366;background:#ECFDF5;border:1px solid #A7F3D0;padding:8px 16px;border-radius:8px;display:inline-block;margin-bottom:28px;}
    .section{margin-bottom:26px;}
    .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;margin-bottom:12px;}
    table{width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;}
    th{background:#F9FAFB;text-align:left;padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6B7280;border-bottom:1px solid #E5E7EB;}
    td{padding:10px 14px;border-bottom:1px solid #E5E7EB;}
    tr:last-child td{border-bottom:none;}
    .steps{list-style:none;padding:0;margin:0;}
    .steps li{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151;}
    .steps li:last-child{border-bottom:none;}
    .step-num{width:22px;height:22px;border-radius:50%;background:#0DA366;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .earn{background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:14px 18px;font-size:13px;color:#78350F;font-weight:600;margin-top:24px;}
    .footer{margin-top:40px;border-top:1px solid #E5E7EB;padding-top:16px;font-size:11px;color:#9CA3AF;text-align:center;line-height:1.6;}
    @media print{body{padding:20px;}@page{margin:15mm;}}
  </style></head><body>
  <div class="header">
    <div class="logo">ZYPH<span style="font-weight:300;opacity:.75;">/</span><span>X</span></div>
    <span class="badge">Delivery Partner Application</span>
  </div>
  <h1>Application Submitted</h1>
  <p class="meta">Submitted on ${date} &nbsp;·&nbsp; Clavix Technologies Pvt. Ltd., India</p>
  <div class="ref">Reference: ${ref}</div>

  <div class="section">
    <div class="section-title">Applicant Details</div>
    <table>
      <tr><th>Field</th><th>Details</th></tr>
      <tr><td style="font-weight:600;">Full Name</td><td>${escHtml(personal.name || '—')}</td></tr>
      <tr><td style="font-weight:600;">Mobile Number</td><td>${escHtml(personal.phone || '—')}</td></tr>
      <tr><td style="font-weight:600;">Age</td><td>${escHtml(personal.age || '—')} years</td></tr>
      <tr><td style="font-weight:600;">Area / Colony</td><td>${escHtml(personal.area || '—')}</td></tr>
      <tr><td style="font-weight:600;">Emergency Contact</td><td>${escHtml(personal.emergency || '—')}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">What Happens Next</div>
    <ul class="steps">
      <li><span class="step-num">1</span>Document verification by our team</li>
      <li><span class="step-num">2</span>Background check (24–48 hours)</li>
      <li><span class="step-num">3</span>App onboarding &amp; training session</li>
      <li><span class="step-num">4</span>Start delivering and earn!</li>
    </ul>
  </div>

  <div class="earn">💰 Earn ₹18–₹25 per delivery + daily bonuses + fuel allowance (EV gets extra incentive!)</div>

  <div class="footer">
    This is an auto-generated application confirmation. Keep it for your records.<br/>
    Zyphix is a product of Clavix Technologies Pvt. Ltd. · India · wa.me/919682394363
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

/* ─── Step 5: Success ─── */
function SuccessStep({ personal }: { personal: Record<string,string> }) {
  const [, setLoc] = useLocation();
  return (
    <>
    <FlowerBurst />
    <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:180}}
      style={{ maxWidth:540, margin:'0 auto', textAlign:'center', padding:'20px 0' }}>
      <motion.div animate={{y:[0,-8,0]}} transition={{repeat:Infinity,duration:1.8}} style={{fontSize:64,marginBottom:20}}>🛵</motion.div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:'1.8rem',color:T1,letterSpacing:'-.03em',marginBottom:10 }}>Application Submitted!</h2>
      <p style={{ color:T2,fontSize:14.5,lineHeight:1.7,marginBottom:28 }}>
        Hey <strong>{personal.name}</strong>! We've received your delivery partner application. Our team will verify your documents and call you on <strong>{personal.phone}</strong> within 48 hours.
      </p>
      <div style={{ background:`${G}0C`,border:`1.5px solid ${G}30`,borderRadius:14,padding:'18px 20px',marginBottom:20,textAlign:'left' }}>
        <p style={{ fontSize:13,fontWeight:700,color:G,marginBottom:12 }}>⏱ What happens next?</p>
        <ul style={{ listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:8 }}>
          {['Document verification by our team','Background check (24–48 hours)','App onboarding & training session','Start delivering and earn!'].map((s,i)=>(
            <li key={i} style={{ fontSize:13,color:T2,display:'flex',alignItems:'center',gap:10 }}>
              <span style={{ width:20,height:20,borderRadius:'50%',background:G,color:'#fff',fontSize:10,fontWeight:900,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{i+1}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ background:'#FFFBEB',border:'1.5px solid #FDE68A',borderRadius:14,padding:'14px 18px',marginBottom:28 }}>
        <p style={{ fontSize:13,color:'#78350F',fontWeight:600 }}>💰 Earn ₹18–₹25 per delivery + daily bonuses + fuel allowance (EV gets extra incentive!)</p>
      </div>
      <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
        <motion.button onClick={()=>exportDeliveryPDF(personal)} whileHover={{scale:1.03}} whileTap={{scale:.97}}
          style={{ padding:'13px 24px',borderRadius:12,background:W,border:`2px solid ${G}`,color:G,fontSize:14,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}>
          <FileDown size={17}/> Export to PDF
        </motion.button>
        <motion.button onClick={()=>setLoc('/')} whileHover={{scale:1.02}} whileTap={{scale:.97}}
          style={{ padding:'13px 24px',borderRadius:12,background:G,color:'#fff',fontSize:14,fontWeight:800,border:'none',cursor:'pointer',boxShadow:`0 4px 20px ${G}40` }}>
          Back to Home
        </motion.button>
      </div>
    </motion.div>
    </>
  );
}

/* ─── Main Page ─── */
export function DeliverySetup() {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [, setLoc] = useLocation();

  const go = (s:number) => { setStep(s); window.scrollTo(0,0); };

  const handleAvailabilityNext = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/partner-register', {
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
    } catch { /* non-blocking */ }
    setSubmitting(false);
    go(4);
  };

  return (
    <div style={{ background:BG, minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:W,borderBottom:`1px solid ${BD}`,padding:'0 24px',position:'sticky',top:0,zIndex:50,boxShadow:SH }}>
        <div style={{ maxWidth:1100,margin:'0 auto',height:60,display:'flex',alignItems:'center',gap:14 }}>
          <button onClick={()=>setLoc('/')} style={{ background:BG,border:`1px solid ${BD}`,borderRadius:8,padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,color:T2,fontSize:13,fontWeight:600 }}>
            <ArrowLeft size={14}/> Home
          </button>
          <ZyphixLogo size={30} />
          <div style={{ height:20,width:1,background:BD }} />
          <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14.5,color:T1 }}>Delivery Partner Registration</span>
          <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:8,background:'#FFF7ED',border:'1px solid #FED7AA',borderRadius:99,padding:'5px 14px' }}>
            <span style={{ width:8,height:8,borderRadius:'50%',background:'#EA580C',display:'inline-block' }} />
            <span style={{ fontSize:12,fontWeight:700,color:'#EA580C' }}>Hiring Open</span>
          </div>
        </div>
      </div>

      <StepBar step={step} />

      <div style={{ maxWidth:1000,margin:'0 auto',padding:'36px 24px 80px' }}>
        <AnimatePresence mode="wait">
          {step===0 && <PersonalStep key="s0" onNext={d=>{setPersonal(d as Record<string,string>);go(1);}} />}
          {step===1 && <LicenseStep key="s1" onNext={()=>go(2)} onBack={()=>go(0)} />}
          {step===2 && <VehicleStep key="s2" onNext={()=>go(3)} onBack={()=>go(1)} />}
          {step===3 && <AvailabilityStep key="s3" onNext={handleAvailabilityNext} submitting={submitting} onBack={()=>go(2)} />}
          {step===4 && <SuccessStep key="s4" personal={personal} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
