import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  intro: 4000,     // ZYPHIX boldly animates in
  now: 4500,       // ZyphixNow - Grocery
  eats: 4500,      // ZyphixEats - Food
  jammu: 4000,     // Jammu City reference
  outro: 4000,     // SuperLocal App / Outro
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0DA366, transparent)' }}
          animate={{
            x: ['-20%', '50%', '10%'],
            y: ['-10%', '60%', '20%'],
            scale: [1, 1.5, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-10 blur-3xl right-0 bottom-0"
          style={{ background: 'radial-gradient(circle, #111827, transparent)' }}
          animate={{
            x: ['20%', '-40%', '0%'],
            y: ['10%', '-50%', '-10%']
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Persistent Brand Elements */}
      <motion.div 
        className="absolute z-10 w-[15vw] h-[15vw] rounded-3xl bg-[#0DA366] flex items-center justify-center shadow-2xl"
        animate={{
          top: ['50%', '15%', '15%', '80%', '50%'][currentScene],
          left: ['50%', '85%', '15%', '15%', '50%'][currentScene],
          x: '-50%',
          y: '-50%',
          scale: [1.5, 0.5, 0.5, 0.5, 1.5][currentScene],
          rotate: [0, 90, 180, 270, 360][currentScene],
          borderRadius: ['25%', '50%', '25%', '50%', '25%'][currentScene]
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white font-display font-black italic text-[4vw] tracking-tighter leading-none">
          //
        </span>
      </motion.div>

      {/* Dynamic Grid Pattern that changes opacity */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(#0DA366 1px, transparent 1px), linear-gradient(90deg, #0DA366 1px, transparent 1px)',
          backgroundSize: '4vw 4vw'
        }}
        animate={{
          opacity: [0.05, 0.1, 0.05, 0.15, 0.05][currentScene],
          backgroundPosition: ['0vw 0vw', '2vw 2vw', '-2vw 0vw', '0vw -2vw', '0vw 0vw'][currentScene]
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Scene Content */}
      <div className="relative z-20 w-full h-full">
        <AnimatePresence mode="popLayout">
          {currentScene === 0 && <Scene1 key="intro" />}
          {currentScene === 1 && <Scene2 key="now" />}
          {currentScene === 2 && <Scene3 key="eats" />}
          {currentScene === 3 && <Scene4 key="jammu" />}
          {currentScene === 4 && <Scene5 key="outro" />}
        </AnimatePresence>
      </div>
    </div>
  );
}