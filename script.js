/* Prime Estates — shared interactivity */
document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const expanded = mainNav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* Boundary line scroll progress (signature element) */
  const setScrollProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
    doc.style.setProperty('--scroll', pct + '%');
  };
  document.addEventListener('scroll', setScrollProgress, { passive: true });
  setScrollProgress();

  /* Header background intensifies after scroll */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 40 ? '0 10px 30px -20px rgba(11,30,51,.25)' : 'none';
  };
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Animated counters */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* Carousel controls */
  document.querySelectorAll('[data-carousel]').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const prev = wrapper.querySelector('[data-prev]');
    const next = wrapper.querySelector('[data-next]');
    const scrollAmount = () => wrapper.querySelector('.property-card')?.offsetWidth + 32 || 340;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  });

  /* FAQ accordion */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Scroll to top button */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    document.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Listings filter toggle (client-side demo filtering by data attributes) */
  const filterForm = document.querySelector('[data-listing-filters]');
  const listingCards = document.querySelectorAll('[data-listing-card]');
  const resultsCount = document.querySelector('[data-results-count]');
  if (filterForm && listingCards.length) {
    const applyFilters = () => {
      const type = filterForm.querySelector('[name="type"]:checked')?.value;
      const purpose = filterForm.querySelector('[name="purpose"]:checked')?.value;
      let visible = 0;
      listingCards.forEach(card => {
        const matchesType = !type || type === 'all' || card.dataset.type === type;
        const matchesPurpose = !purpose || purpose === 'all' || card.dataset.purpose === purpose;
        const show = matchesType && matchesPurpose;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (resultsCount) resultsCount.textContent = `Showing ${visible} of ${listingCards.length} properties`;
    };
    filterForm.addEventListener('change', applyFilters);
  }

  /* Contact form — lightweight client-side handling */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = contactForm.querySelector('[data-form-feedback]');
      if (feedback) {
        feedback.textContent = 'Thank you — your enquiry has been received. An agent will call you within one business day.';
        feedback.style.display = 'block';
      }
      contactForm.reset();
    });
  }

  /* Newsletter form */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) { btn.textContent = 'Subscribed ✓'; setTimeout(() => btn.textContent = '→', 2500); }
      form.reset();
    });
  });

});
