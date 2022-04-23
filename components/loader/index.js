import { CircularProgress, CircularProgressLabel, Box } from '@chakra-ui/react';
import styles from './index.module.css';

export default function Loader({ loading }) {
  if (!loading) return null;
  return (
    <Box className={styles.body_loading}>
      <CircularProgress
        size={'100px'}
        thickness="4px"
        isIndeterminate
        color="green.300"
      >
        <CircularProgressLabel color={'white'} fontSize={14}>
          Loading...
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}
