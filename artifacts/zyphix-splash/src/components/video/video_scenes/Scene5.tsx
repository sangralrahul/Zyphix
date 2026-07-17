import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 3000), // start exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8F9FA]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="flex items-center space-x-[2vw] mb-[4vh] relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={phase >= 4 ? { y: -50, opacity: 0 } : phase >= 1 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="w-[8vw] h-[8vw] rounded-2xl bg-[#0DA366] flex items-center justify-center shadow-xl">
          <span className="text-white font-display font-black italic text-[4vw] leading-none tracking-tighter">
            //
          </span>
        </div>
        <h1 className="text-[8vw] font-black text-[#111827] tracking-tight uppercase">
          ZYPHIX
        </h1>
      </motion.div>

      <motion.div
        className="flex space-x-[4vw] text-[2.5vw] font-bold text-[#111827]/70 relative z-10"
      >
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 4 ? { opacity: 0 } : phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          Groceries
        </motion.span>
        <motion.span
          className="text-[#0DA366]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 4 ? { opacity: 0 } : phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          •
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={phase >= 4 ? { opacity: 0 } : phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Food
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute bottom-[15vh] w-[60vw] h-[1vw] bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 0 } : phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.div 
          className="h-full bg-[#0DA366]"
          initial={{ width: '0%' }}
          animate={phase >= 3 ? { width: '100%' } : { width: '0%' }}
          transition={{ duration: 2, ease: 'linear' }}
        />
      </motion.div>

    </motion.div>
  );
}