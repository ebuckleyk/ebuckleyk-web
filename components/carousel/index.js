// https://medium.com/tinyso/how-to-create-the-responsive-and-swipeable-carousel-slider-component-in-react-99f433364aa0
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { FaGg, FaGgCircle } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import useResponsive from '../../utils/hooks/useResponsive';
import styles from './index.module.css';

//TODO: Maybe make this component reusable throughout the app
const CarouselItem = ({ children, width, borderStyle = {} }) => {
  return (
    <div
      className={styles['carousel-item']}
      style={{ width, padding: '10px 50px', ...borderStyle }}
    >
      {children}
    </div>
  );
};

const Carousel = ({ children, autoPlay = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(!autoPlay);
  const [config, setConfig] = useState({
    transformPerc: 100,
    width: '100%'
  });
  const childrenCount = useMemo(
    () => React.Children.count(children),
    [children]
  );
  const responsive = useResponsive();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1 === childrenCount ? 0 : activeIndex + 1);
      }
    }, 3000);

    return () => interval && clearInterval(interval);
  });

  useEffect(() => {
    let t = config.transformPerc;
    let w = config.width;

    if (responsive.isDesktop) {
      t = 33.33;
      w = '33.33%';
    } else if (responsive.isTablet) {
      t = 50;
      w = '50%';
    } else {
      t = 100;
      w = '100%';
    }

    setConfig({ transformPerc: t, width: w });
  }, [
    config.transformPerc,
    config.width,
    responsive.isDesktop,
    responsive.isMobile,
    responsive.isTablet
  ]);

  const updateIndex = useCallback(
    (newIdx) => {
      if (newIdx < 0) {
        newIdx = childrenCount - 1;
      } else if (newIdx >= childrenCount) {
        newIdx = 0;
      }
      setActiveIndex(newIdx);
    },
    [childrenCount]
  );

  const next = useCallback(() => {
    updateIndex(activeIndex + 1);
  }, [activeIndex, updateIndex]);

  const prev = useCallback(() => {
    updateIndex(activeIndex - 1);
  }, [activeIndex, updateIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1)
  });

  const getBorderStyle = useCallback(
    (currentIdx) => {
      let borderStyle = { borderColor: 'white', borderRightWidth: '1px' };

      if (responsive.isTablet && currentIdx < 1) {
        borderStyle = {
          ...borderStyle,
          borderRightWidth: '1px'
        };
      } else if (responsive.isDesktop && currentIdx + 1 != childrenCount) {
        borderStyle = {
          ...borderStyle,
          borderRightWidth: '1px'
        };
      }

      return borderStyle;
    },
    [childrenCount, responsive.isDesktop, responsive.isTablet]
  );

  return (
    <div
      {...handlers}
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Using 100% because we have 100% width for each item */}
      <div
        className={styles.inner}
        style={{
          transform: `translateX(-${activeIndex * config.transformPerc}%)`
        }}
      >
        {React.Children.map(children, (child, idx) => {
          return (
            <CarouselItem
              width={config.width}
              borderStyle={getBorderStyle(idx)}
            >
              {child}
            </CarouselItem>
          );
        })}
      </div>
      {childrenCount === 3 && responsive.isDesktop ? null : (
        <ArrowLeftIcon
          cursor={'pointer'}
          onClick={prev}
          left={15}
          top={35}
          position={'absolute'}
          color="white"
        />
      )}
      {childrenCount === 3 && responsive.isDesktop ? null : (
        <ArrowRightIcon
          cursor={'pointer'}
          onClick={next}
          right={15}
          top={35}
          position="absolute"
          color="white"
        />
      )}
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        justifyContent={'center'}
        alignItems={'center'}
        mt={2}
      >
        {React.Children.map(children, (child, idx) => {
          return (
            <Icon
              margin={1}
              as={idx === activeIndex ? FaGgCircle : FaGg}
              color="white"
              onClick={() => updateIndex(idx)}
            />
          );
        })}
      </Flex>
    </div>
  );
};

export default Carousel;
