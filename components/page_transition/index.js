import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.5
    }
  },
  out: {
    opacity: 0,
    scale: 1,
    y: 40,
    transition: {
      duration: 0.75
    }
  }
};

export default function PageTransition({ children }) {
  const { route } = useRouter(); // *Note: asPath may work better
  return (
    <div style={{ overflow: 'hidden' }}>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={route}
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
