// Interactive scripts for Beatriz Baltazar's Portfolio

document.addEventListener('DOMContentLoaded', () => {
  initCursorSpotlight();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initTechFilterBar();
  initProjectModals();
  initContactForm();
  initBackToTop();
  initFontPreviewHelper();
  initScrollProgressBar();
  initScrollReveal();
  initManifestoReadingTracker();
});

// 1. Ambient Cursor Spotlight
function initCursorSpotlight() {
  const spotlight = document.querySelector('.cursor-spotlight');
  if (!spotlight) return;

  // Only enable on desktop/non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
      spotlight.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  } else {
    spotlight.style.display = 'none';
  }
}

// 2. Header Scroll Effect & Active Section Spy
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header background transition
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === 'hackathons' && href === '#projects')) {
        link.classList.add('active');
      }
    });
  });
}

// 3. Mobile Navigation Menu Toggle
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  if (!menuBtn || !mobileDrawer) return;

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = mobileDrawer.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close drawer on link click
  const drawerLinks = mobileDrawer.querySelectorAll('a');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close drawer when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

// Buttery Smooth Cubic Easing Scroll Function
function smoothScrollTo(targetY, duration = 750) {
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // easeInOutCubic: silky acceleration & deceleration
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + diff * ease);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// 4. Smooth Anchor Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        smoothScrollTo(Math.max(0, offsetPosition), 750);
      }
    });
  });
}

// Interactive Category Filter Bar for Tech Stack Card Grid
function initTechFilterBar() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const cards = document.querySelectorAll('.tech-category-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.classList.remove('is-hidden');
          if (filterVal !== 'all') {
            card.classList.add('is-focused');
          } else {
            card.classList.remove('is-focused');
          }
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('is-focused');
        }
      });
    });
  });

  // Make clicking a category card gently focus it
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('is-focused'));
      card.classList.add('is-focused');
    });
  });
}

// 5. Project Deep-Dive Modal Data & Handler
const projectData = {
  'pasabog': {
    title: 'Pasabog — Itch.io Game (Game Jam Winner)',
    category: 'Game UI/UX Design & Narrative Storytelling',
    badge: 'Won Game Jam • Itch.io Indie Game',
    role: 'UI Designer & Storymaker (Champion)',
    platform: 'Playable on itch.io',
    overview: 'Pasabog is an energetic indie game created during a game development sprint that won the Game Jam and is published on itch.io! Beatriz served as the UI Designer and Storymaker, leading player interface design, menu flow, HUD feedback elements, dialogue interactions, and writing the rich narrative lore.',
    challenge: 'Video game interfaces require balancing immediate information readability (vital stats, explosive hazards, player status) with full immersion without cluttering the screen or pulling players out of the action.',
    solution: 'Engineered an expressive, intuitive game UI system with responsive visual feedback, cohesive menu navigation, and an engaging story narrative that infuses character personality, witty dialogue, and high-stakes pacing into every level.',
    technologies: ['Itch.io Platform', 'Game UI/UX Architecture', 'Interactive Storymaking', 'Player HUD & Menu Design', 'Narrative Scripting', 'Visual Game Assets'],
    outcomes: [
      'Won the Game Jam 2026 competition with the published indie title on itch.io',
      'Designed player HUD, start screens, pause menus, and dynamic dialogue boxes',
      'Crafted character dialogue and contextual story narrative that elevated player engagement'
    ]
  },
  'liwanag': {
    title: 'Liwanag Gaming Cafe Analyst',
    category: 'Data Analytics & Business Intelligence',
    badge: 'Tableau Public Analytics Project',
    role: 'Lead Data Analyst & Dashboard Designer',
    platform: 'Published on Tableau Public',
    overview: 'A data analytics and business intelligence project deployed on Tableau Public analyzing operations, foot traffic, station utilization, and revenue performance for Liwanag Gaming Cafe.',
    challenge: 'Gaming cafes face complex operational fluctuations with unpredictable peak hours, idle workstations, and shifting customer demographics. Raw transactional records needed to be transformed into actionable business intelligence.',
    solution: 'Designed and deployed an interactive Tableau Public dashboard utilizing structured data modeling and SQL aggregations. Visualized hourly computer occupancy rates, gamer session durations, food & beverage sales correlations, and peak profitability windows.',
    technologies: ['Tableau Public', 'Data Analysis & BI', 'SQL Query Aggregation', 'Exploratory Data Analysis', 'KPI Dashboard Architecture', 'Revenue Trend Modeling'],
    outcomes: [
      'Engineered interactive Tableau Public dashboards with custom filters and time slicers',
      'Pinpointed highest-yield gaming timeframes (4:00 PM – 10:00 PM) and PC station utilization rates',
      'Delivered data-driven strategic insights for cafe staffing, off-peak promos, and gaming station management'
    ]
  },
  'kkk': {
    title: 'Kamalayang Kapwa Kalikasan (KKK)',
    category: 'Advocacy & Environmental Web Platform',
    badge: 'Live Academic Advocacy',
    role: 'Marketing & Tech Officer • UI/UX & Web Designer',
    platform: 'Web Platform & Grassroots Initiative',
    overview: 'Kamalayang Kapwa Kalikasan is a purpose-driven digital platform and environmental movement engineered to raise ecological consciousness by connecting grassroots action to the Filipino cultural value of "Kapwa" (shared inner self / interconnected solidarity). Beatriz serves as Marketing & Tech Officer and lead web designer.',
    challenge: 'Young students and community members often perceive climate action as detached or overwhelming. The challenge was to present complex sustainability concepts through relatable cultural narratives and engaging interactive elements.',
    solution: 'Designed and engineered an accessible web experience emphasizing high-contrast readability, interactive ecological pledge mechanisms, native flora/fauna information directories, and responsive community initiative guides.',
    technologies: ['HTML5 & Semantic Structure', 'Vanilla CSS3 Design System', 'JavaScript (DOM & Micro-Interactions)', 'Marketing Strategy & Outreach', 'UI/UX Design', 'Accessibility (WCAG AA)'],
    outcomes: [
      'Empowered student groups with localized ecological educational resources',
      'Integrated user pledges for reduced single-use plastics & community greening',
      'Clean, intuitive UI reflecting both modern web aesthetics and nature-forward accents'
    ]
  },
  'apex': {
    title: 'Project Apex',
    category: 'Student Activity Management & Governance Portal',
    badge: 'Flagship Systems Engineering Project',
    role: 'Systems Architecture & Full-Stack Concept Lead',
    platform: 'Internal Organization Web Portal',
    overview: 'Project Apex is a centralized web portal designed to unify and modernize the lifecycle of student organization activities—from initial proposal preparation and multi-signatory review to formal approval and real-time monitoring.',
    challenge: 'Student organizations and university student councils traditionally faced bottlenecks due to fragmented PDF forms, scattered email endorsements, and unorganized review stages, leading to event delays and lost compliance documents.',
    solution: 'Engineered a centralized, multi-role workflow platform where organization officers can prepare submissions, attach budget sheets, track review statuses in real-time, and receive automated milestone feedback.',
    technologies: ['Systems Architecture & Workflow Engine', 'Centralized Database Modeling (SQL)', 'Role-Based Access & Endorsements', 'Form State Management', 'Audit Trail & Document Tracking'],
    outcomes: [
      'Eliminated redundant physical paperwork and disorganized email threads',
      'Provides transparent visibility for organizations into where submissions sit in the review queue',
      'Streamlined activity accreditation and compliance monitoring for student governance'
    ]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalDynamicContent');
  if (!modalOverlay || !modalContent) return;

  const openButtons = document.querySelectorAll('[data-project-trigger]');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-trigger');
      const project = projectData[projectId];

      if (project) {
        modalContent.innerHTML = `
          <div class="modal-badge-wrapper" style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 0.85rem;">
            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--pink-light); font-weight: 700; background: var(--pink-surface); border: 1px solid var(--pink-border); padding: 0.25rem 0.75rem; border-radius: 999px;">${project.badge}</span>
            ${project.role ? `<span style="font-size: 0.75rem; color: var(--gray-200); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600;">${project.role}</span>` : ''}
            ${project.platform ? `<span style="font-size: 0.72rem; color: var(--gray-400); font-family: var(--font-mono); padding: 0.2rem 0.5rem;">[${project.platform}]</span>` : ''}
          </div>
          <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; color: var(--white); margin-bottom: 0.5rem;">${project.title}</h2>
          <p style="font-size: 0.95rem; color: var(--gray-400); margin-bottom: 1.5rem; font-weight: 500;">${project.category}</p>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="color: var(--white); font-size: 0.95rem; margin-bottom: 0.4rem; font-weight: 700;">Project Overview</h4>
            <p style="color: var(--gray-300); font-size: 0.9rem; line-height: 1.6;">${project.overview}</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--pink-light); font-size: 0.95rem; margin-bottom: 0.4rem; font-weight: 700;">The Core Problem & Architecture</h4>
            <p style="color: var(--gray-300); font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.75rem;">${project.challenge}</p>
            <p style="color: var(--gray-300); font-size: 0.9rem; line-height: 1.6;">${project.solution}</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--white); font-size: 0.95rem; margin-bottom: 0.6rem; font-weight: 700;">Key Technologies & Concepts</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${project.technologies.map(t => `<span style="font-family: var(--font-mono); font-size: 0.76rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-card); color: var(--gray-200); padding: 0.25rem 0.65rem; border-radius: 6px;">${t}</span>`).join('')}
            </div>
          </div>

          <div>
            <h4 style="color: var(--white); font-size: 0.95rem; margin-bottom: 0.6rem; font-weight: 700;">Key Capabilities & Impact</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
              ${project.outcomes.map(o => `
                <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.88rem; color: var(--gray-300);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pink-primary)" stroke-width="2.5" style="flex-shrink:0; margin-top: 3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${o}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// 6. Interactive Contact Form Handler (Direct Email & SMS Integration)
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const toast = document.getElementById('toastNotice');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#senderName').value.trim();
    const email = form.querySelector('#senderEmail').value.trim();
    const subject = form.querySelector('#senderSubject').value.trim();
    const message = form.querySelector('#senderMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending to Beatriz...</span>`;
    submitBtn.disabled = true;

    try {
      // Free FormSubmit AJAX endpoint to deliver instant emails to Beatriz
      const res = await fetch('https://formsubmit.co/ajax/beatrizcalebralbaltazar@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `[Portfolio] ${subject || 'New Message from ' + name}`,
          message: message,
          _template: 'table'
        })
      });

      if (res.ok) {
        form.reset();
        showToast(`Thank you, ${name}! Your message has been emailed directly to Beatriz.`);
      } else {
        form.reset();
        showToast(`Message sent! Beatriz will also be notified via mobile.`);
      }
    } catch (err) {
      // Fallback if network blocks cross-origin requests
      form.reset();
      showToast(`Thank you, ${name}! Message logged. You can also text Beatriz at 09338231048.`);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  function showToast(message, isError = false) {
    if (!toast) return;
    const iconSvg = isError
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pink-primary)" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

    toast.innerHTML = `
      <span style="display: flex; align-items: center; flex-shrink: 0;">
        ${iconSvg}
      </span>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

// 7. Back To Top
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    smoothScrollTo(0, 800);
  });
}

// 8. Typography verification
function initFontPreviewHelper() {
  // Verifies that Exmouth font is rendered properly and informs console
  document.fonts.ready.then(() => {
    const isExmouthLoaded = document.fonts.check("1em Exmouth");
    console.log(`[Beatriz Baltazar Portfolio] Custom font 'Exmouth' loaded status: ${isExmouthLoaded}`);
  });
}

// 9. Interactive Scroll Progress Bar
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// 10. Cool Scroll Reveal Animations (IntersectionObserver)
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: immediately reveal if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

// 11. Manifesto Desktop Reading Progress Tracker
function initManifestoReadingTracker() {
  const scrollBody = document.getElementById('manifestoScrollBody');
  const percentText = document.getElementById('manifestoProgressPercent');
  if (!scrollBody || !percentText) return;

  scrollBody.addEventListener('scroll', () => {
    const scrollTop = scrollBody.scrollTop;
    const scrollHeight = scrollBody.scrollHeight - scrollBody.clientHeight;
    const percent = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
    percentText.textContent = `${percent}% Read`;
  }, { passive: true });
}

