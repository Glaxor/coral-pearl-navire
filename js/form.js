/**
 * Coral Pearl Navire Ltd - Form JavaScript
 * Form validation and submission handling
 */

(function() {
  'use strict';

  // ==========================================================================
  // Form Elements
  // ==========================================================================

  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  // ==========================================================================
  // Validation Rules
  // ==========================================================================

  const validators = {
    required: (value) => {
      return value.trim() !== '';
    },

    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },

    phone: (value) => {
      // Allow various phone formats, including Nigerian numbers
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
      return value.trim() === '' || phoneRegex.test(value.replace(/\s/g, ''));
    },

    minLength: (value, min) => {
      return value.trim().length >= min;
    },

    maxLength: (value, max) => {
      return value.trim().length <= max;
    }
  };

  // ==========================================================================
  // Error Messages
  // ==========================================================================

  const errorMessages = {
    name: 'Please enter your full name',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    subject: 'Please select a subject',
    message: 'Please enter your message (minimum 10 characters)'
  };

  // ==========================================================================
  // Validation Functions
  // ==========================================================================

  function validateField(field) {
    const name = field.name;
    const value = field.value;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];

    if (requiredFields.includes(name) && !validators.required(value)) {
      isValid = false;
      errorMessage = errorMessages[name] || 'This field is required';
    }

    // Email validation
    if (name === 'email' && value && !validators.email(value)) {
      isValid = false;
      errorMessage = errorMessages.email;
    }

    // Phone validation (optional but must be valid if provided)
    if (name === 'phone' && value && !validators.phone(value)) {
      isValid = false;
      errorMessage = errorMessages.phone;
    }

    // Message minimum length
    if (name === 'message' && value && !validators.minLength(value, 10)) {
      isValid = false;
      errorMessage = errorMessages.message;
    }

    // Show error if invalid
    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    // Create or update error element
    let errorEl = field.parentElement.querySelector('.form-error');

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorEl);
    }

    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');

    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  function validateForm() {
    const fields = contactForm.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (field.type !== 'hidden' && field.name !== 'botcheck') {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  // ==========================================================================
  // Form Submission
  // ==========================================================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Focus first error field
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Get submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

    // Hide any previous messages
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success message
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form
        contactForm.reset();

        // Track conversion (if analytics available)
        if (typeof gtag === 'function') {
          gtag('event', 'form_submission', {
            'event_category': 'Contact',
            'event_label': 'Contact Form'
          });
        }

      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);

      // Show error message
      if (formError) {
        formError.style.display = 'block';
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalText;
    }
  }

  // ==========================================================================
  // Real-time Validation
  // ==========================================================================

  function initRealTimeValidation() {
    const fields = contactForm.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      // Validate on blur
      field.addEventListener('blur', function() {
        if (this.value.trim() !== '' || this.classList.contains('error')) {
          validateField(this);
        }
      });

      // Clear error on input
      field.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          clearFieldError(this);
        }
      });
    });
  }

  // ==========================================================================
  // Character Counter (for message field)
  // ==========================================================================

  function initCharacterCounter() {
    const messageField = contactForm.querySelector('textarea[name="message"]');

    if (!messageField) return;

    const maxLength = 2000;

    // Create counter element
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.style.cssText = 'display: block; text-align: right; font-size: 0.875rem; color: var(--gray-medium); margin-top: 0.25rem;';
    counter.textContent = `0 / ${maxLength}`;

    messageField.parentElement.appendChild(counter);
    messageField.setAttribute('maxlength', maxLength);

    // Update counter on input
    messageField.addEventListener('input', function() {
      const current = this.value.length;
      counter.textContent = `${current} / ${maxLength}`;

      if (current > maxLength * 0.9) {
        counter.style.color = 'var(--warning)';
      } else {
        counter.style.color = 'var(--gray-medium)';
      }
    });
  }

  // ==========================================================================
  // Pre-fill Form from URL Parameters
  // ==========================================================================

  function prefillFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Pre-fill subject
    const subject = urlParams.get('subject');
    if (subject) {
      const subjectField = contactForm.querySelector('select[name="subject"]');
      if (subjectField) {
        const option = subjectField.querySelector(`option[value="${subject}"]`);
        if (option) {
          subjectField.value = subject;
        }
      }
    }

    // Pre-fill message with product inquiry
    const product = urlParams.get('product');
    if (product) {
      const messageField = contactForm.querySelector('textarea[name="message"]');
      if (messageField) {
        messageField.value = `Product Inquiry: ${decodeURIComponent(product)}\n\nPlease provide more information about this product including pricing and availability.\n\n`;
        messageField.focus();
      }
    }
  }

  // ==========================================================================
  // Initialize Form Handling
  // ==========================================================================

  function init() {
    if (!contactForm) return;

    // Set up form submission
    contactForm.addEventListener('submit', handleSubmit);

    // Initialize real-time validation
    initRealTimeValidation();

    // Initialize character counter
    initCharacterCounter();

    // Pre-fill from URL
    prefillFromURL();

    // Prevent form resubmission on page refresh
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ==========================================================================
// Add Error Styles
// ==========================================================================

(function() {
  const style = document.createElement('style');
  style.textContent = `
    .form-input.error,
    .form-textarea.error,
    .form-select.error {
      border-color: var(--error);
    }

    .form-input.error:focus,
    .form-textarea.error:focus,
    .form-select.error:focus {
      box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    }

    .form-error {
      color: var(--error);
      font-size: var(--text-sm);
      margin-top: var(--space-xs);
      display: block;
    }

    #form-success {
      display: none;
      background-color: var(--success);
      color: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    #form-error {
      display: none;
      background-color: var(--error);
      color: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      text-align: center;
      margin-bottom: var(--space-lg);
    }
  `;
  document.head.appendChild(style);
})();
