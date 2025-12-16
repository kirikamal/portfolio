// Small interactivity: hamburger, smooth scroll, simple contact feedback
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Toggle mobile nav
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      body.classList.toggle('nav-open');
    });
  }

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      body.classList.remove('nav-open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form handling (client-side feedback)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple success state; replace with real submit integration later
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        btn.textContent = 'Message Sent';
        btn.classList.add('sent');
        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Send Message';
          btn.classList.remove('sent');
        }, 2200);
      }, 900);
    });
  }

  // Project Filtering System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects with animation
      projectCards.forEach((card, index) => {
        const categories = card.getAttribute('data-category');

        if (filter === 'all' || categories.includes(filter)) {
          // Show card with staggered animation
          setTimeout(() => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
          }, index * 50);
        } else {
          // Hide card
          card.style.animation = 'fadeOut 0.3s ease forwards';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe project cards
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

// ...existing code...

// Animate circular skill rings when visible
(function () {
  const skills = Array.from(document.querySelectorAll('.skill'));
  if (!skills.length) return;

  // helper: check if element is in viewport
  function isInViewport(el, offset = 120) {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset;
  }

  function animateSkill(skill) {
    if (skill.dataset.animated) return;
    const percent = parseInt(skill.getAttribute('data-percent') || '0', 10);
    const circle = skill.querySelector('.ring');
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; // ~263.89 for r=42
    const offset = Math.max(0, circumference - (percent / 100) * circumference);
    // set gradient stroke color per skill (pleasant palette)
    const name = skill.dataset.skill.toLowerCase();
    let color = '#7c5cff';
    if (name.includes('python')) color = '#306998';
    else if (name.includes('javascript')) color = '#f0db4f';
    else if (name.includes('aws')) color = '#FF9900';
    else if (name.includes('docker')) color = '#2496ED';
    else if (name.includes('ruby')) color = '#CC342D';
    else if (name.includes('sql')) color = '#2B7A78';
    else if (name.includes('ml')) color = '#00d4ff';
    else if (name.includes('node')) color = '#3C873A';

    circle.style.stroke = color;
    // apply stroke-dasharray/dashoffset just in case
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    // trigger animation (use requestAnimationFrame to ensure style applied)
    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.2,.9,.2,1)';
      circle.style.strokeDashoffset = offset;
    });

    // update percent text (animated count)
    const pctEl = skill.querySelector('.skill-percent');
    if (pctEl) {
      let start = 0;
      const duration = 900;
      const startTime = performance.now();
      (function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const current = Math.floor(start + (percent - start) * progress);
        pctEl.textContent = current + '%';
        if (progress < 1) requestAnimationFrame(tick);
      })(startTime);
    }

    skill.dataset.animated = 'true';
  }

  function onScroll() {
    skills.forEach(s => {
      if (!s.dataset.animated && isInViewport(s)) animateSkill(s);
    });
  }

  // initial check and on scroll
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Project modal handling (added)
(function () {
  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalGithub = document.getElementById('modal-github');
  const modalLive = document.getElementById('modal-live');
  const modalClose = document.getElementById('modal-close');

  function openModal(data) {
    try {
      const project = typeof data === 'string' ? JSON.parse(data) : data;
      modalTitle.textContent = project.title || 'Project';
      modalDesc.textContent = project.desc || '';
      modalTech.textContent = project.tech ? 'Tech: ' + project.tech.join(' • ') : '';
      modalGithub.href = project.github || '#';
      modalLive.href = project.live || '#';

      // choose best available image (use last item as largest)
      const imgSrc = (project.images && project.images[project.images.length - 1]) || '';
      modalImage.src = imgSrc;
      modalImage.alt = project.alt || project.title || 'Project image';

      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    } catch (err) {
      console.error('Failed to open project modal', err);
    }
  }

  function closeModal() {
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImage.src = '';
  }

  document.querySelectorAll('.project-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const data = card.getAttribute('data-project');
      openModal(data);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
})();


// Project Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update active button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show correct tab
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
  });
});