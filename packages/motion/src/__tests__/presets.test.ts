import { describe, it, expect } from 'vitest';
import {
  fadeIn,
  slideUp,
  scaleIn,
  staggerContainer,
} from '../presets';

describe('motion presets', () => {
  it('fadeIn returns opacity-only variants with defaults', () => {
    const v = fadeIn() as { hidden: { opacity: number }; visible: { opacity: number; transition: { duration: number; delay: number } } };
    expect(v.hidden.opacity).toBe(0);
    expect(v.visible.opacity).toBe(1);
    expect(v.visible.transition.duration).toBe(0.3);
    expect(v.visible.transition.delay).toBe(0);
  });

  it('fadeIn honors custom delay', () => {
    const v = fadeIn({ delay: 0.4 }) as { visible: { transition: { delay: number } } };
    expect(v.visible.transition.delay).toBe(0.4);
  });

  it('fadeIn collapses to instant when reducedMotion', () => {
    const v = fadeIn({ delay: 0.4, reducedMotion: true }) as { visible: { transition: { duration: number; delay: number } } };
    expect(v.visible.transition.duration).toBe(0);
    expect(v.visible.transition.delay).toBe(0);
  });

  it('slideUp uses transform y with default distance', () => {
    const v = slideUp() as { hidden: { y: number }; visible: { y: number } };
    expect(v.hidden.y).toBe(16);
    expect(v.visible.y).toBe(0);
  });

  it('scaleIn uses transform scale', () => {
    const v = scaleIn({ scale: 0.8 }) as { hidden: { scale: number }; visible: { scale: number } };
    expect(v.hidden.scale).toBe(0.8);
    expect(v.visible.scale).toBe(1);
  });

  it('staggerContainer passes through staggerChildren and delayChildren', () => {
    const v = staggerContainer({ staggerChildren: 0.1, delayChildren: 0.2 }) as { visible: { transition: { staggerChildren: number; delayChildren: number } } };
    expect(v.visible.transition.staggerChildren).toBe(0.1);
    expect(v.visible.transition.delayChildren).toBe(0.2);
  });

  it('staggerContainer zeroes timings under reducedMotion', () => {
    const v = staggerContainer({ staggerChildren: 0.1, delayChildren: 0.2, reducedMotion: true }) as { visible: { transition: { staggerChildren: number; delayChildren: number } } };
    expect(v.visible.transition.staggerChildren).toBe(0);
    expect(v.visible.transition.delayChildren).toBe(0);
  });
});
