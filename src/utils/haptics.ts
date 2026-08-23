/**
 * Triggers subtle haptic feedback on devices that support navigator.vibrate
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'light') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'success':
        navigator.vibrate([15, 40, 20]);
        break;
    }
  } catch {
    // Ignore if vibration is restricted or unsupported
  }
};

