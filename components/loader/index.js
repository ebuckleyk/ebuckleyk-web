import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import styles from './index.module.css';

const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export default function Loader({ loading }) {
  if (!loading) return null;

  return (
    <Box className={styles.body_loading}>
      <Box
        as={motion.div}
        animation={animation}
        padding="2"
        bgGradient="linear(to-l, #7daffa, #0026ff)"
        width="12"
        height="12"
        display="flex"
      />
    </Box>
  );
}
