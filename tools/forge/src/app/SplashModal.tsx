import { useEffect, useState } from 'react';
import { FocusScope } from 'react-aria';
import Close from '@react-spectrum/s2/icons/Close';
import { SPLASH_SLIDES } from './splashContent';
import styles from './SplashModal.module.css';

interface SplashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// The M1 welcome tour: a multi-step carousel, shown once on first run (seen-flag
// wired in ConfigProvider/ModalRoot) and re-openable from the TopBar.
export function SplashModal({ isOpen, onClose }: SplashModalProps) {
  const [step, setStep] = useState(0);
  const slides = SPLASH_SLIDES;
  const last = slides.length - 1;
  const slide = slides[step];
  const isLast = step === last;

  // Reset to slide 0 on open; wire Esc + arrow-key paging.
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, last));
      else if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, last, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Trap Tab in the dialog, focus in on open, restore to the trigger on close. */}
      <FocusScope contain autoFocus restoreFocus>
        <div className={styles.modal} role="dialog" aria-modal aria-label="Welcome to Forge">
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Close />
          </button>

          {/* Keyed on the slide so a step change retriggers the crossfade; the
              foot stays outside so the controls don't flicker. */}
          <div key={slide.id} className={styles.slide}>
            <div className={styles.stage} aria-hidden="true">
              {slide.specimen()}
            </div>

            <div className={styles.body}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.copy}>{slide.body}</p>
            </div>
          </div>

          <div className={styles.foot}>
            {/* Plain buttons, not an ARIA tablist (no tabpanels); aria-current marks the step. */}
            <div className={styles.dots} aria-label="Tour steps">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.dot} ${i === step ? styles.dotActive : ''}`}
                  aria-label={`Go to step ${i + 1}: ${s.title}`}
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => setStep(i)}
                />
              ))}
            </div>

            <div className={styles.actions}>
              {step > 0 && (
                <button
                  type="button"
                  className="pf-btn-secondary"
                  onClick={() => setStep((s) => Math.max(s - 1, 0))}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className="pf-btn-primary"
                onClick={() => (isLast ? onClose() : setStep((s) => Math.min(s + 1, last)))}
              >
                {isLast ? 'Get started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </FocusScope>
    </div>
  );
}
