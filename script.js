/**
 * KADARTECH SOLUTIONS - FESTIVAL SEASON MEGA OFFER 2026 CONTROLLER
 * Handles Dark/Light Mode, Countdown Timer, Offer Modal, WhatsApp Integration & Metrics
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. THEME CONTROLLER (Dark & Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('kadartech-theme');
  if (savedTheme === 'light') {
    htmlRoot.classList.remove('dark');
  } else {
    htmlRoot.classList.add('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = htmlRoot.classList.contains('dark');
      if (isDark) {
        htmlRoot.classList.remove('dark');
        localStorage.setItem('kadartech-theme', 'light');
      } else {
        htmlRoot.classList.add('dark');
        localStorage.setItem('kadartech-theme', 'dark');
      }
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }

  /* ==========================================================================
     2. FESTIVAL OFFER COUNTDOWN TIMER (Till 31 December 2026)
     ========================================================================== */
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  const targetDate = new Date('2026-12-31T23:59:59+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    if (minsEl) minsEl.innerText = mins < 10 ? '0' + mins : mins;
    if (secsEl) secsEl.innerText = secs < 10 ? '0' + secs : secs;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     3. PROMOTIONAL BANNER DISMISS
     ========================================================================== */
  const banner = document.getElementById('promo-banner');
  const closeBannerBtn = document.getElementById('close-banner-btn');

  if (closeBannerBtn && banner) {
    closeBannerBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }

  /* ==========================================================================
     4. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  /* ==========================================================================
     5. FESTIVAL OFFER CLAIM MODAL & BOOKING GENERATOR
     ========================================================================== */
  const modal = document.getElementById('offer-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOfferSelect = document.getElementById('modal-offer-select');
  const modalForm = document.getElementById('modal-claim-form');
  const claimButtons = document.querySelectorAll('.claim-offer-btn');

  window.openOfferModal = function(offerName) {
    if (modal) {
      if (offerName && modalOfferSelect) {
        modalOfferSelect.value = offerName;
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closeOfferModal = function() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', window.closeOfferModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeOfferModal();
      }
    });
  }

  claimButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedOffer = btn.getAttribute('data-offer') || 'Growth Pack (9 Websites - $600)';
      window.openOfferModal(selectedOffer);
    });
  });

  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Claim Offer';
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Securing Slot...';
        submitBtn.disabled = true;
      }

      const name = document.getElementById('modal-client-name').value.trim();
      const phone = document.getElementById('modal-client-phone').value.trim();
      const offer = document.getElementById('modal-offer-select').value;
      const notes = document.getElementById('modal-client-notes').value.trim();

      try {
        await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, offer, notes })
        });
      } catch (err) {
        console.warn('API call background dispatch:', err);
      }

      const msg = 
        `*FESTIVAL MEGA OFFER 2026 - SLOT BOOKING*\n\n` +
        `🎁 *Selected Offer:* ${offer}\n` +
        `👤 *Name:* ${name}\n` +
        `📱 *Contact:* ${phone}\n` +
        `💬 *Details:* ${notes || 'Ready to start immediately'}\n\n` +
        `*Includes: FREE AI Chatbot (24/7 Lead Capture)*`;

      const whatsappUrl = `https://wa.me/919359086445?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      if (submitBtn) {
        submitBtn.innerHTML = '✓ Slot Reserved!';
      }

      setTimeout(() => {
        window.closeOfferModal();
        modalForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    });
  }

  /* ==========================================================================
     6. FAQ ACCORDION CONTROLLER
     ========================================================================== */
  const faqItems = document.querySelectorAll('#faq-accordion .faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answerDiv) {
      questionBtn.addEventListener('click', () => {
        const isHidden = answerDiv.classList.contains('hidden');

        faqItems.forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherAnswer && otherAnswer !== answerDiv) {
            otherAnswer.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        if (isHidden) {
          answerDiv.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          answerDiv.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    }
  });

  /* ==========================================================================
     7. CONTACT FORM WHATSAPP BUILDER
     ========================================================================== */
  const form = document.getElementById('project-form');
  const whatsappSubmitBtn = document.getElementById('whatsapp-submit-btn');
  const feedbackDiv = document.getElementById('form-feedback');

  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', () => {
      const name = document.getElementById('client-name');
      const message = document.getElementById('client-message');
      const service = document.getElementById('client-service');

      if (!name || !name.value.trim()) {
        alert('Please enter your name.');
        if (name) name.focus();
        return;
      }

      const msg = 
        `*Festival Mega Offer Inquiry - KADARTECH*\n\n` +
        `👤 *Name:* ${name.value.trim()}\n` +
        `🎯 *Requirement:* ${service ? service.value : 'General IT Inquiry'}\n` +
        `📝 *Notes:* ${message ? message.value.trim() : 'Please send details'}`;

      window.open(`https://wa.me/919359086445?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const message = document.getElementById('client-message').value.trim();

      if (feedbackDiv) {
        feedbackDiv.classList.remove('hidden', 'bg-red-500/20', 'text-red-400');
        feedbackDiv.classList.add('bg-emerald-500/20', 'text-emerald-400');
        feedbackDiv.innerHTML = `✓ Thank you, ${name}! Your inquiry has been prioritized. We will contact you shortly.`;
      }

      try {
        await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, notes: message })
        });
      } catch (err) {}

      setTimeout(() => { form.reset(); }, 2000);
    });
  }

  /* ==========================================================================
     8. ANIMATED METRICS COUNTER
     ========================================================================== */
  const counters = document.querySelectorAll('.counter');
  let hasCounted = false;

  const runCounterAnimation = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const increment = Math.ceil(target / 40);

      const updateCount = () => {
        current += increment;
        if (current < target) {
          if (target === 98) {
            counter.innerText = current + '%';
          } else {
            counter.innerText = current + '+';
          }
          requestAnimationFrame(updateCount);
        } else {
          if (target === 98) {
            counter.innerText = target + '%';
          } else {
            counter.innerText = target + '+';
          }
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        runCounterAnimation();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metric-card');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
});
