/**
 * Coral Pearl Navire Ltd - Main JavaScript
 * Navigation, smooth scroll, and general functionality
 * Updated for Tailwind CSS structure
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('nav a, #mobile-menu a');

  // ==========================================================================
  // Mobile Navigation Toggle
  // ==========================================================================

  function initMobileNav() {
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('open');

      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('open');
        mobileMenuBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#mobile-menu') &&
          !e.target.closest('#mobile-menu-btn') &&
          mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // Header Scroll Effect - Glassmorphism Transition
  // ==========================================================================

  function initHeaderScroll() {
    if (!header) return;

    let ticking = false;

    function updateHeader() {
      const scrollY = window.pageYOffset;

      if (scrollY > 50) {
        header.classList.add('glass-dark', 'shadow-lg', 'scrolled');
      } else {
        header.classList.remove('shadow-lg', 'scrolled');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================================================
  // Scroll Reveal Animation
  // ==========================================================================

  function initScrollReveal() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
      observer.observe(el);
    });
  }

  // ==========================================================================
  // WhatsApp Button
  // ==========================================================================

  function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float, [id*="whatsapp"]');

    if (!whatsappBtn) return;

    // Show button after scrolling down
    let isVisible = false;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300 && !isVisible) {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.visibility = 'visible';
        isVisible = true;
      } else if (window.pageYOffset <= 300 && isVisible) {
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.visibility = 'hidden';
        isVisible = false;
      }
    }, { passive: true });

    // Initial state
    if (window.pageYOffset <= 300) {
      whatsappBtn.style.opacity = '0';
      whatsappBtn.style.visibility = 'hidden';
    }
  }

  // ==========================================================================
  // Lazy Loading Images
  // ==========================================================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length === 0) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;

            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  }

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  // Debounce function for performance
  function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Get URL parameter
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // ==========================================================================
  // Pre-fill Contact Form from URL
  // ==========================================================================

  function initContactFormPrefill() {
    const subjectField = document.querySelector('select[name="subject"]');
    const messageField = document.querySelector('textarea[name="message"]');

    const product = getUrlParam('product');
    const subject = getUrlParam('subject');

    if (subjectField && subject) {
      subjectField.value = subject;
    }

    if (messageField && product) {
      messageField.value = `I would like to inquire about: ${product}\n\nPlease provide more information including pricing and availability.`;
    }
  }

  // ==========================================================================
  // Back to Top Button
  // ==========================================================================

  function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top, #back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', debounce(function() {
      if (window.pageYOffset > 500) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
      }
    }), { passive: true });

    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // Initialize All Functions
  // ==========================================================================

  function init() {
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initScrollReveal();
    initWhatsAppButton();
    initLazyLoading();
    initContactFormPrefill();
    initBackToTop();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utility functions globally if needed
  window.CoralPearl = {
    debounce,
    throttle,
    getUrlParam
  };

})();
