import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => setPhase(5), 3500), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-row items-center justify-between px-[10vw]"
      initial={{ x: '100%', skewX: -10 }}
      animate={{ x: 0, skewX: 0 }}
      exit={{ x: '-100%', skewX: 10 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-1/2 relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '8vw' } : { width: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-[0.5vw] bg-[#0DA366] mb-[2vh]"
        />
        
        <motion.h2 
          className="text-[6vw] font-black text-[#111827] leading-[1.1] mb-[2vh]"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 5 ? { opacity: 0, x: -50 } : phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          Zyphix<span className="text-[#0DA366]">Now</span>
        </motion.h2>

        <motion.div 
          className="text-[3vw] font-bold text-[#111827]/80 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 5 ? { opacity: 0, y: 30 } : phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Groceries in
          <motion.span 
            className="block text-[5vw] text-[#0DA366]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={phase >= 5 ? { scale: 0.5, opacity: 0 } : phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            30 Mins
          </motion.span>
        </motion.div>
      </div>

      <div className="w-1/2 h-full flex justify-center items-center relative">
        <motion.div 
          className="absolute w-[40vw] h-[40vw] bg-white rounded-full shadow-2xl border-4 border-[#0DA366]/20"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 5 ? { scale: 0, rotate: 90 } : phase >= 2 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
        
        {/* Floating elements */}
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/groceries.png`}
          className="absolute w-[35vw] h-[35vw] object-contain drop-shadow-2xl z-20"
          initial={{ y: 100, opacity: 0, rotate: 15 }}
          animate={phase >= 5 ? { y: -100, opacity: 0 } : phase >= 3 ? { y: 0, opacity: 1, rotate: 0 } : { y: 100, opacity: 0, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />

        {/* Local store tag */}
        <motion.div
          className="absolute bottom-[20%] right-[10%] bg-[#111827] text-white px-6 py-3 rounded-2xl font-bold text-[1.5vw] shadow-xl z-30"
          initial={{ scale: 0, x: 50 }}
          animate={phase >= 5 ? { scale: 0 } : phase >= 4 ? { scale: 1, x: 0 } : { scale: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          From your local Kirana 🏪
        </motion.div>
      </div>
    </motion.div>
  );
}