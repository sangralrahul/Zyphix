import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => setPhase(5), 3500), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-row-reverse items-center justify-between px-[10vw]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-1/2 relative z-10 pl-[5vw]">
        <motion.div
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '8vw' } : { width: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-[0.5vw] bg-[#111827] mb-[2vh]"
        />
        
        <motion.h2 
          className="text-[6vw] font-black text-[#111827] leading-[1.1] mb-[2vh]"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 5 ? { opacity: 0, x: 50 } : phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          Zyphix<span className="text-[#0DA366]">Eats</span>
        </motion.h2>

        <motion.div 
          className="text-[3vw] font-bold text-[#111827]/80 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 5 ? { opacity: 0, y: 30 } : phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Cravings delivered
          <motion.span 
            className="block text-[4vw] text-[#111827]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={phase >= 5 ? { scale: 0.8, opacity: 0 } : phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            Super Fast 🛵
          </motion.span>
        </motion.div>
      </div>

      <div className="w-1/2 h-full flex justify-center items-center relative">
        <motion.div 
          className="absolute w-[40vw] h-[40vw] bg-[#0DA366] rounded-[4vw] rotate-12 shadow-2xl"
          initial={{ scale: 0, rotate: 0 }}
          animate={phase >= 5 ? { scale: 0, rotate: -45 } : phase >= 2 ? { scale: 1, rotate: 12 } : { scale: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
        
        {/* Floating food image */}
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/food.png`}
          className="absolute w-[45vw] h-[45vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={phase >= 5 ? { scale: 1.5, opacity: 0 } : phase >= 3 ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0.5, opacity: 0, rotate: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />

        {/* Delivery scooter small accent */}
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/scooter.png`}
          className="absolute bottom-[10%] left-[10%] w-[15vw] h-[15vw] object-contain drop-shadow-xl z-30"
          initial={{ x: -100, opacity: 0 }}
          animate={phase >= 5 ? { x: 200, opacity: 0 } : phase >= 4 ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </div>
    </motion.div>
  );
}