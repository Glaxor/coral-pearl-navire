/**
 * Coral Pearl Navire Ltd - Gallery JavaScript
 * Lightbox and filtering functionality
 */

(function() {
  'use strict';

  // ==========================================================================
  // Gallery Filtering
  // ==========================================================================

  function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        galleryItems.forEach(item => {
          const category = item.dataset.category;

          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.5s ease forwards';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ==========================================================================
  // GLightbox Initialization
  // ==========================================================================

  function initLightbox() {
    // Check if GLightbox is available
    if (typeof GLightbox === 'undefined') {
      console.warn('GLightbox library not loaded');
      return null;
    }

    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' }
      },
      skin: 'clean',
      zoomable: true,
      draggable: true,
      dragAutoSnap: true
    });

    return lightbox;
  }

  // ==========================================================================
  // Gallery Lazy Loading
  // ==========================================================================

  function initGalleryLazyLoad() {
    const galleryImages = document.querySelectorAll('.gallery-item img[data-src]');

    if (galleryImages.length === 0) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Create a new image to preload
            const tempImg = new Image();
            tempImg.onload = function() {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            };
            tempImg.src = img.dataset.src;

            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.01
      });

      galleryImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      galleryImages.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  // ==========================================================================
  // Gallery Grid Animation
  // ==========================================================================

  function initGalleryAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length === 0) return;

    // Add staggered animation on load
    galleryItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';

      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  // ==========================================================================
  // Keyboard Navigation
  // ==========================================================================

  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      // Focus management for filter buttons
      const activeFilter = document.activeElement;

      if (activeFilter && activeFilter.classList.contains('gallery-filter')) {
        const filters = Array.from(document.querySelectorAll('.gallery-filter'));
        const currentIndex = filters.indexOf(activeFilter);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % filters.length;
          filters[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + filters.length) % filters.length;
          filters[prevIndex].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activeFilter.click();
        }
      }
    });
  }

  // ==========================================================================
  // Initialize Gallery
  // ==========================================================================

  function init() {
    initGalleryFilters();
    initGalleryLazyLoad();
    initGalleryAnimation();
    initKeyboardNav();

    // Initialize lightbox after a short delay to ensure images are ready
    setTimeout(() => {
      const lightbox = initLightbox();

      // Store lightbox instance for potential external access
      if (lightbox) {
        window.galleryLightbox = lightbox;
      }
    }, 100);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ==========================================================================
// CSS Keyframes (injected dynamically)
// ==========================================================================

(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .gallery-item.loaded img {
      animation: fadeIn 0.3s ease;
    }

    .gallery-item img {
      background-color: #e2e8f0;
    }

    .gallery-item img:not([src]) {
      visibility: hidden;
    }
  `;
  document.head.appendChild(style);
})();
