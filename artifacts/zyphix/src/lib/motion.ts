/**
 * Single entry point for animations. `motion` here is framer-motion's lightweight `m` component;
 * the animation features are loaded once by <LazyMotion features={domAnimation}> in App.tsx.
 * This keeps ~25 KB (gzip) of unused motion features out of every page.
 */
export {
  m as motion, AnimatePresence, LazyMotion, domAnimation, useInView, useMotionValue, useScroll, useSpring, useTransform,
  useMotionTemplate, useVelocity, useAnimationFrame, animate,
  type MotionProps, type MotionValue,
} from 'framer-motion';
