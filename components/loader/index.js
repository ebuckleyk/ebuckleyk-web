import Overlay from '../shared/overlay';
import styles from './index.module.css';

export default function Loader({ show = false }) {
  if (!show) return null;
  return (
    <>
      <Overlay show={show} />
      <div data-testid="ebuckleyk-loader" className={styles.wrapper}>
        <div className={`${styles.line} ${styles.line1}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line2}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line3}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line4}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line5}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line6}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line7}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line8}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line9}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line10}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
        <div className={`${styles.line} ${styles.line11}`}>
          <span className={`${styles.circle} ${styles['circle-top']}`}></span>
          <div className={styles.dotted}>
            <span className={`${styles.dot} ${styles['dot-top']}`}></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-top']}`}
            ></span>
            <span
              className={`${styles.dot} ${styles['dot-middle-bottom']}`}
            ></span>
            <span className={`${styles.dot} ${styles['dot-bottom']}`}></span>
          </div>
          <span
            className={`${styles.circle} ${styles['circle-bottom']}`}
          ></span>
        </div>
      </div>
    </>
  );
}
