// ═══════════════════════════════════════════════════════════
// PORTFOLIO JAVASCRIPT — Pradnya Wakode
// ═══════════════════════════════════════════════════════════

// ─── SCROLL REVEAL ANIMATION ─────────────────────────────
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  reveals.forEach((el) => revealObserver.observe(el));
}

// ─── ACTIVE NAV HIGHLIGHT (SCROLL-BASED) ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length > 0 && navLinks.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const matchingLink = document.querySelector(
            `.nav-links a[href*="${entry.target.id}"]`
          );
          if (matchingLink) {
            matchingLink.classList.add('active');
          }
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((section) => navObserver.observe(section));
}

// ─── TYPING ANIMATION FOR HERO ROLE ──────────────────────
const roleElement = document.getElementById('roleText');
if (roleElement) {
  const roles = [
    'Visual-First Developer',
    'Cloud Enthusiast ☁️',
    'UI/UX Designer',
    'ML Explorer',
    'Kathak Dancer 💃',
    'Problem Solver',
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (!isDeleting) {
      roleElement.textContent = currentRole.slice(0, charIndex++);
      if (charIndex > currentRole.length) {
        isDeleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      roleElement.textContent = currentRole.slice(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }
    
    setTimeout(typeRole, isDeleting ? 45 : 88);
  }
  
  setTimeout(typeRole, 1200);
}

// ─── CONTACT FORM HANDLING ───────────────────────────────
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };
    
    // Show success message (in production, this would send to a backend)
    formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
    formStatus.classList.remove('error');
    formStatus.classList.add('success');
    
    // Reset form
    contactForm.reset();
    
    // Hide status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
      formStatus.classList.remove('success');
    }, 5000);
    
    // In production, you would send this to your backend/email service
    // Example:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // Handle success
    // })
    // .catch(error => {
    //   formStatus.textContent = '✗ Something went wrong. Please try again or email directly.';
    //   formStatus.classList.remove('success');
    //   formStatus.classList.add('error');
    // });
  });
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#' && targetId !== '') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  });
});

// ─── PAGE LOAD FADE IN ───────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

// ─── PREVENT EXTERNAL LINK NAVIGATION DELAY ──────────────
// Add smooth exit transition for external links if desired
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.addEventListener('click', function (e) {
    // External links open in new tab, no special handling needed
    // This is just a placeholder for any future enhancements
  });
});

console.log('Portfolio loaded successfully ✓');
