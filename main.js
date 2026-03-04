/* ============================================
   Pearl Group Hotels & Resorts — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initStickyNav();
  initMobileMenu();
  initScrollAnimations();
  initHeroCrossfade();
  initFilterSystem();
  initLightbox();
  initHorizontalScroll();
  initNewsletter();
  initSmoothScroll();
  initLazyLoading();
  initPearlCircleForm();
});

/* ============================================
   Sticky Navigation
   ============================================ */

function initStickyNav() {
  const mainNav = document.querySelector('.main-nav');
  const utilityBar = document.querySelector('.utility-bar');
  
  if (!mainNav) return;
  
  let lastScroll = 0;
  const scrollThreshold = 100;
  
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class based on scroll position
    if (currentScroll > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    
    // Handle compact state
    if (currentScroll > scrollThreshold) {
      mainNav.classList.add('compact');
      if (utilityBar) {
        utilityBar.classList.add('hidden');
      }
    } else {
      mainNav.classList.remove('compact');
      if (utilityBar) {
        utilityBar.classList.remove('hidden');
      }
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================
   Mobile Menu
   ============================================ */

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animatedElements.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Hero Crossfade
   ============================================ */

function initHeroCrossfade() {
  const heroSlides = document.querySelectorAll('.hero-slide');
  
  if (heroSlides.length < 2) return;
  
  let currentSlide = 0;
  const interval = 6000;
  
  function nextSlide() {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }
  
  // Start cycling
  setInterval(nextSlide, interval);
}

/* ============================================
   Filter System
   ============================================ */

function initFilterSystem() {
  const filterBars = document.querySelectorAll('.filter-bar');
  
  filterBars.forEach(filterBar => {
    const buttons = filterBar.querySelectorAll('.filter-btn');
    const contentContainer = filterBar.nextElementSibling;
    
    if (!buttons.length || !contentContainer) return;
    
    buttons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Update active button
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Fade out content
        contentContainer.classList.add('fading');
        
        setTimeout(() => {
          // Show/hide based on filter
          const items = contentContainer.querySelectorAll('[data-category]');
          
          items.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
              item.style.display = '';
              item.classList.remove('filtered-out');
            } else {
              item.style.display = 'none';
              item.classList.add('filtered-out');
            }
          });
          
          // Fade in content
          contentContainer.classList.remove('fading');
        }, 300);
      });
    });
  });
}

/* ============================================
   Lightbox
   ============================================ */

function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  
  let galleryImages = [];
  let currentIndex = 0;
  
  // Open lightbox from triggers
  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      
      const src = this.dataset.src || this.src;
      const gallery = this.closest('[data-gallery]');
      
      if (gallery) {
        galleryImages = Array.from(gallery.querySelectorAll('[data-lightbox]')).map(el => ({
          src: el.dataset.src || el.src,
          caption: el.dataset.caption || ''
        }));
        currentIndex = galleryImages.findIndex(img => img.src === src);
      } else {
        galleryImages = [{ src: src, caption: '' }];
        currentIndex = 0;
      }
      
      openLightbox(src);
    });
  });
  
  function openLightbox(src) {
    if (!lightboxImage) return;
    
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show/hide nav buttons
    if (lightboxPrev) lightboxPrev.style.display = galleryImages.length > 1 ? 'block' : 'none';
    if (lightboxNext) lightboxNext.style.display = galleryImages.length > 1 ? 'block' : 'none';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function navigate(direction) {
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
  }
  
  // Event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigate(-1));
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigate(1));
  }
  
  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ============================================
   Horizontal Scroll
   ============================================ */

function initHorizontalScroll() {
  const scrollContainers = document.querySelectorAll('.horizontal-scroll');
  
  scrollContainers.forEach(container => {
    // Add grab cursor
    container.style.cursor = 'grab';
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    container.addEventListener('mousedown', function(e) {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    
    container.addEventListener('mouseleave', function() {
      isDown = false;
      container.style.cursor = 'grab';
    });
    
    container.addEventListener('mouseup', function() {
      isDown = false;
      container.style.cursor = 'grab';
    });
    
    container.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
    
    // Touch support
    container.addEventListener('touchstart', function(e) {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }, { passive: true });
    
    container.addEventListener('touchmove', function(e) {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  });
}

/* ============================================
   Newsletter Form
   ============================================ */

function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      const successMsg = form.parentElement.querySelector('.newsletter-success');
      const errorMsg = form.parentElement.querySelector('.newsletter-error');
      
      // Reset states
      errorMsg.classList.remove('show');
      
      // Validate
      if (!isValidEmail(email)) {
        errorMsg.textContent = 'Please enter a valid email address.';
        errorMsg.classList.add('show');
        return;
      }
      
      // Simulate submission
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
    });
  });
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ============================================
   Smooth Scroll
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   Lazy Loading Enhancement
   ============================================ */

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/* ============================================
   Pearl Circle Form
   ============================================ */

function initPearlCircleForm() {
  const form = document.querySelector('.enrollment-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });
    
    // Validate
    let isValid = true;
    
    const firstName = form.querySelector('#firstName');
    const lastName = form.querySelector('#lastName');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const tier = form.querySelector('#tier');
    
    if (!firstName.value.trim()) {
      firstName.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!lastName.value.trim()) {
      lastName.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
      email.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!tier || !tier.value) {
      tier.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Show success message
    const successMsg = form.querySelector('.form-success');
    if (successMsg) {
      successMsg.classList.add('show');
      form.reset();
      
      // Scroll to success message
      setTimeout(() => {
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  });
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ============================================
   Property Dropdown (Contact Page)
   ============================================ */

function initPropertyDropdown() {
  const select = document.querySelector('#property-select');
  const detailsContainer = document.querySelector('.property-details');
  
  if (!select || !detailsContainer) return;
  
  const properties = {
    'dubai': {
      name: 'Pearl Dubai',
      address: 'Jumeirah Beach Road, Dubai, UAE',
      phone: '+971 4 555 8800',
      email: 'reservations.dubai@pearlgroup.com'
    },
    'santorini': {
      name: 'Pearl Santorini',
      address: 'Oia, Santorini 847 02, Greece',
      phone: '+30 22860 71300',
      email: 'reservations.santorini@pearlgroup.com'
    },
    'kyoto': {
      name: 'Pearl Kyoto',
      address: 'Higashiyama District, Kyoto 605-0001, Japan',
      phone: '+81 75 555 1234',
      email: 'reservations.kyoto@pearlgroup.com'
    },
    'marrakech': {
      name: 'Pearl Marrakech',
      address: 'Medina, Marrakech 40000, Morocco',
      phone: '+212 524 555 800',
      email: 'reservations.marrakech@pearlgroup.com'
    },
    'maldives': {
      name: 'Pearl Maldives',
      address: 'Baa Atoll, Maldives',
      phone: '+960 555 9000',
      email: 'reservations.maldives@pearlgroup.com'
    },
    'patagonia': {
      name: 'Pearl Patagonia',
      address: 'Torres del Paine, Chile',
      phone: '+56 61 555 7000',
      email: 'reservations.patagonia@pearlgroup.com'
    },
    'amalfi': {
      name: 'Pearl Amalfi',
      address: 'Ravello, Amalfi Coast 84010, Italy',
      phone: '+39 089 555 600',
      email: 'reservations.amalfi@pearlgroup.com'
    },
    'capetown': {
      name: 'Pearl Cape Town',
      address: 'Camps Bay, Cape Town 8005, South Africa',
      phone: '+27 21 555 5000',
      email: 'reservations.capetown@pearlgroup.com'
    },
    'rajasthan': {
      name: 'Pearl Rajasthan',
      address: 'Lake Pichola, Udaipur 313001, India',
      phone: '+91 294 555 400',
      email: 'reservations.rajasthan@pearlgroup.com'
    },
    'tulum': {
      name: 'Pearl Tulum',
      address: 'Tulum, Quintana Roo 77780, Mexico',
      phone: '+52 984 555 300',
      email: 'reservations.tulum@pearlgroup.com'
    }
  };
  
  select.addEventListener('change', function() {
    const property = properties[this.value];
    
    if (property) {
      detailsContainer.innerHTML = `
        <div class="property-info animate-on-scroll">
          <h4>${property.name}</h4>
          <p>${property.address}</p>
          <p><a href="tel:${property.phone}">${property.phone}</a></p>
          <p><a href="mailto:${property.email}">${property.email}</a></p>
        </div>
      `;
      
      // Trigger animation
      setTimeout(() => {
        const info = detailsContainer.querySelector('.property-info');
        if (info) info.classList.add('is-visible');
      }, 50);
    } else {
      detailsContainer.innerHTML = '';
    }
  });
}

// Initialize property dropdown if exists
document.addEventListener('DOMContentLoaded', initPropertyDropdown);

/* ============================================
   Contact Form Validation
   ============================================ */

function initContactForm() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });
    
    // Validate
    let isValid = true;
    
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
      email.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!message.value.trim()) {
      message.closest('.form-group').classList.add('has-error');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Show success
    const successMsg = form.querySelector('.form-success');
    if (successMsg) {
      successMsg.classList.add('show');
      form.reset();
    }
  });
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

document.addEventListener('DOMContentLoaded', initContactForm);
