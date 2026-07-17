import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 3000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#111827]"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Image */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/jammu-bg.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.div 
          className="bg-[#0DA366] text-white px-8 py-3 rounded-full font-bold text-[2vw] mb-[4vh] shadow-xl"
          initial={{ y: -50, opacity: 0 }}
          animate={phase >= 5 ? { y: -50, opacity: 0 } : phase >= 1 ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          📍 Proudly Born In
        </motion.div>

        <motion.h2 
          className="text-[10vw] font-black text-white leading-none uppercase tracking-widest drop-shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 5 ? { scale: 1.2, opacity: 0 } : phase >= 2 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : { scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Jammu
        </motion.h2>

        <motion.div
          className="mt-[4vh] text-[3vw] text-white/90 font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 5 ? { opacity: 0, y: 30 } : phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Building for the Himalayas & Beyond
        </motion.div>
      </div>

      {/* Decorative gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
    </motion.div>
  );
}