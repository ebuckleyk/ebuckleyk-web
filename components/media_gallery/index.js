import LightGallery from 'lightgallery/react';
import NextImage from 'next/future/image';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import lgHash from 'lightgallery/plugins/hash';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';
import styles from './index.module.css';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-fullscreen.css';

const PlayBtnOverlay = ({ show }) => {
  if (!show) return;
  return (
    <svg
      className={styles.playBtnOverlay}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 311.69 311.69"
    >
      <path d="M155.84,0A155.85,155.85,0,1,0,311.69,155.84,155.84,155.84,0,0,0,155.84,0Zm0,296.42A140.58,140.58,0,1,1,296.42,155.84,140.58,140.58,0,0,1,155.84,296.42Z"></path>
      <polygon points="218.79 155.84 119.22 94.34 119.22 217.34 218.79 155.84"></polygon>
    </svg>
  );
};

export default function MediaGallery({ media = [], galleryName }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        {...STAGGER_LOAD_ITEMS_ANIMATION.containerProps}
        variants={STAGGER_LOAD_ITEMS_ANIMATION.containerVariant}
      >
        <LightGallery
          speed={500}
          licenseKey={process.env.NEXT_PUBLIC_LG_LICENSE_KEY}
          galleryId={galleryName}
          elementClassNames={styles['lg-custom']}
          mode="lg-fade"
          download={false}
          plugins={[lgThumbnail, lgZoom, lgVideo, lgHash]}
        >
          {media.map((m) => {
            const src = `${process.env.NEXT_PUBLIC_CDN}/${m.src}`;
            const thumbnail = `${process.env.NEXT_PUBLIC_CDN}/${m.thumbnail}`;
            const dataSize = `${m.size.width}-${m.size.height}`;
            const isVideo = m.mediaType.includes('video');
            const html = `
                <div class='lightGallery-captions'>
                  <h4>${m.title}</h4>
                  <p>${m.description ?? ''}</p>
                </div>
              `;
            let mediaProps = {
              'data-lg-size': dataSize,
              'data-sub-html': html,
              'data-slide-name': m.mediaName
            };
            if (isVideo) {
              const json = JSON.stringify({
                source: [
                  {
                    src,
                    type: m.mediaType
                  }
                ],
                attributes: { preload: false, controls: true }
              });
              mediaProps = {
                ...mediaProps,
                'data-video': json,
                'data-poster': thumbnail
              };
            } else {
              mediaProps = {
                ...mediaProps,
                'data-src': src
              };
            }

            return (
              <motion.div
                variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
                className={styles['lg-custom-item']}
                key={m._id}
                {...mediaProps}
              >
                <NextImage
                  alt={m.mediaName}
                  quality={100}
                  src={thumbnail}
                  width={m.size.width}
                  height={m.size.height}
                  style={{
                    objectFit: 'contain',
                    height: 'auto',
                    width: 'auto'
                  }}
                />
                <PlayBtnOverlay show={isVideo} />
              </motion.div>
            );
          })}
        </LightGallery>
      </motion.div>
    </AnimatePresence>
  );
}
