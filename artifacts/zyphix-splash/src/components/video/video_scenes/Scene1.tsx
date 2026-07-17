import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -40, scale: 0.9 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 1.1, filter: 'blur(10px)' }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Background sweep */}
      <motion.div 
        className="absolute inset-0 bg-[#111827]"
        initial={{ scaleY: 1, originY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <div className="text-center relative z-10 pt-[15vh]">
        <motion.h1 
          className="text-[12vw] font-black tracking-tighter text-[#111827] leading-[0.9] uppercase"
          style={{ WebkitTextStroke: '2px #111827', color: 'transparent' }}
          animate={phase >= 1 ? { color: '#111827', WebkitTextStroke: '0px' } : {}}
          transition={{ duration: 0.5 }}
        >
          {'ZYPHIX'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial="hidden"
              animate={phase >= 4 ? 'exit' : phase >= 1 ? 'visible' : 'hidden'}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: phase >= 4 ? i * 0.05 : i * 0.08
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="mt-[2vh] overflow-hidden"
        >
          <motion.p 
            className="text-[2.5vw] font-bold text-[#0DA366] tracking-widest uppercase bg-white px-6 py-2 rounded-full inline-block shadow-lg border-2 border-[#0DA366]"
            initial={{ y: '100%', opacity: 0 }}
            animate={phase >= 4 ? { y: '-100%', opacity: 0 } : phase >= 2 ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            India's SuperLocal App
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <motion.div 
        className="absolute bottom-10 left-10 w-32 h-32 border-l-4 border-b-4 border-[#111827]"
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={phase >= 3 ? { opacity: 0.2, x: 0, y: 0 } : { opacity: 0, x: -20, y: 20 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 border-r-4 border-t-4 border-[#0DA366]"
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={phase >= 3 ? { opacity: 0.5, x: 0, y: 0 } : { opacity: 0, x: 20, y: -20 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}