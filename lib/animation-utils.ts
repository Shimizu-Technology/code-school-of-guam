'use client';

/**
 * Sets up Intersection Observer to handle reveal animations on scroll
 * This is particularly effective for mobile where elements come into view as users scroll
 */
export function setupScrollAnimations() {
  if (typeof window === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }

  function initObserver() {
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.15, // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Add class when element is intersecting (visible)
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-on-scroll')) {
            entry.target.classList.add('is-visible');
          }
          if (entry.target.classList.contains('animate-stagger')) {
            entry.target.classList.add('in-view');
          }
          if (entry.target.classList.contains('animate-expand-width')) {
            entry.target.classList.add('in-view');
          }
          // Once animation is triggered, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with animation classes
    document.querySelectorAll('.reveal-on-scroll, .animate-stagger, .animate-expand-width').forEach((el) => {
      observer.observe(el);
    });
  }
}

/**
 * Adds staggered animation delays to children of a container
 * Great for mobile menus and lists that appear one after another
 */
export function setupStaggeredAnimations() {
  if (typeof window === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStaggered);
  } else {
    initStaggered();
  }

  function initStaggered() {
    document.querySelectorAll('[data-stagger-children]').forEach((container) => {
      Array.from(container.children).forEach((child, index) => {
        // Add staggered delay classes based on index
        const delayClass = `stagger-delay-${Math.min(index + 1, 8)}`;
        child.classList.add(delayClass);
      });
    });
  }
}

/**
 * Sets up mobile-specific animations that respond to device orientation
 * This creates an immersive effect on mobile devices
 */
export function setupDeviceOrientationEffects() {
  if (typeof window === 'undefined') return;
  if (!window.DeviceOrientationEvent) return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrientation);
  } else {
    initOrientation();
  }

  function initOrientation() {
    const tiltElements = document.querySelectorAll('[data-tilt-effect]');
    if (tiltElements.length === 0) return;

    // Only add event listener if we have elements to animate
    window.addEventListener('deviceorientation', (event) => {
      // Skip if no orientation data
      if (event.beta === null || event.gamma === null) return;

      // Get tilt values, constrain to reasonable range
      const tiltY = Math.min(Math.max(event.beta, -15), 15); 
      const tiltX = Math.min(Math.max(event.gamma, -15), 15);

      tiltElements.forEach((element) => {
        // Apply tilt effect based on device orientation
        (element as HTMLElement).style.transform = `perspective(1000px) rotateX(${tiltY * 0.2}deg) rotateY(${tiltX * -0.2}deg)`;
      });
    });
  }
}

/**
 * Adds touch ripple effect to buttons and interactive elements
 * Provides tactile feedback on mobile devices
 */
export function setupTouchEffects() {
  if (typeof window === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTouchEffects);
  } else {
    initTouchEffects();
  }

  function initTouchEffects() {
    document.querySelectorAll('.animate-ripple').forEach((element) => {
      element.addEventListener('click', (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}