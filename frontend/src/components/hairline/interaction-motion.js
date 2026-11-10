/**
 * Hairline UI · interaction-motion
 * Core physics, spring curves, and micro-motion constants
 * MIT License · Adapted for PRECICAST Deep Ethereal Aesthetic
 */

export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_SETTLE = 'cubic-bezier(0.22, 1.18, 0.36, 1)';
export const EASE_THROW = 'cubic-bezier(0.34, 1.36, 0.64, 1)';

export const SPRING_FAST = { stiffness: 620, damping: 49.8 };
export const SPRING_SMOOTH = { stiffness: 380, damping: 39 };
export const SPRING_SLIDER = { stiffness: 450, damping: 42.4 };

/**
 * Creates an interruptible analytical spring for smooth animations
 */
export function createSpring(initial, config, onFrame, precision = 0.01) {
  let value = initial;
  let velocity = 0;
  let target = initial;
  let { stiffness = 380, damping = 39, mass = 1 } = config || {};
  let animId = null;
  let lastTime = performance.now();

  function step(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    const force = -stiffness * (value - target) - damping * velocity;
    const accel = force / mass;
    velocity += accel * dt;
    value += velocity * dt;

    if (Math.abs(value - target) < precision && Math.abs(velocity) < precision * 10) {
      value = target;
      velocity = 0;
      onFrame();
      animId = null;
      return;
    }

    onFrame();
    animId = requestAnimationFrame(step);
  }

  return {
    get: () => value,
    getVelocity: () => velocity,
    getTarget: () => target,
    set(next) {
      target = next;
      if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(step);
      }
    },
    push(speed) {
      velocity += speed;
      if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(step);
      }
    },
    jump(next) {
      value = next;
      target = next;
      velocity = 0;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      onFrame();
    },
    configure(next) {
      if (next.stiffness !== undefined) stiffness = next.stiffness;
      if (next.damping !== undefined) damping = next.damping;
      if (next.mass !== undefined) mass = next.mass;
    },
    stop() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }
  };
}

/**
 * Smooth Apple/rational rubber-band curve for bounded drag interaction
 */
export function rubberBand(overshoot, dimension = 320, constant = 0.55) {
  const d = dimension || 320;
  const abs = Math.abs(overshoot);
  return Math.sign(overshoot) * (1 - 1 / ((abs * constant) / d + 1)) * d;
}
