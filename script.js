// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    navToggle.classList.toggle("active");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.classList.remove("active");
    });
  });
}

// Scroll reveal
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => observer.observe(el));

// Dynamic year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ================================
   Dark / Light mode toggle
   Default: dark, toggle -> light
================================== */
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Default: dark
if (storedTheme === "light" || storedTheme === "dark") {
  body.classList.toggle("light-theme", storedTheme === "light");
} else {
  // If no stored theme, keep dark by default
  body.classList.toggle("light-theme", false);
}

function updateThemeIcon() {
  if (!themeIcon) return;
  const isLight = body.classList.contains("light-theme");
  themeIcon.textContent = isLight ? "☀" : "☾";
}

updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon();
  });
}

/* ================================
   Typing animation in hero
================================== */
const typedTarget = document.getElementById("typedText");

if (typedTarget) {
  const phrases = [
    "I craft modern web experiences.",
    "I tweak servers and networks for fun.",
    "I turn tech ideas into real projects."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const PAUSE_BETWEEN = 1300;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typedTarget.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        deleting = true;
        setTimeout(typeLoop, PAUSE_BETWEEN);
        return;
      }
    } else {
      charIndex--;
      typedTarget.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typeLoop, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(typeLoop, 450);
}

/* ================================
   Hero + floating parallax motion
================================== */
const floatItems = document.querySelectorAll(".profile-card, .floating-card");
const heroBgGlow = document.querySelector(".hero-bg-glow");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY || window.pageYOffset;

  floatItems.forEach((el, index) => {
    const intensity = 0.04 + index * 0.01;
    const translateY = scrollY * intensity * -0.2;
    el.style.transform = `translateY(${translateY}px)`;
  });

  if (heroBgGlow) {
    const scale = 1 + (scrollY * 0.0006);
    heroBgGlow.style.transform = `scale(${scale}) translate3d(0, ${scrollY *
      -0.04}px, 0)`;
  }
});

/* ================================
   Smooth scrollspy for nav
================================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function onScrollSpy() {
  const scrollPos = window.scrollY || window.pageYOffset;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const offsetTop = scrollPos + rect.top;
    const offsetBottom = offsetTop + section.offsetHeight;

    if (scrollPos + 120 >= offsetTop && scrollPos + 120 < offsetBottom) {
      const id = section.getAttribute("id");
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", onScrollSpy);
onScrollSpy();

/* ================================
   Back to top button
================================== */
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ================================
   Copy to clipboard for contact
================================== */
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.getAttribute("data-copy");
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied: " + value);
    } catch (err) {
      showToast("Could not copy");
    }
  });
});

/* ================================
   Stats counter animation
================================== */
const statNumbers = document.querySelectorAll(".stat-number");

function animateNumber(el) {
  const target = parseInt(el.getAttribute("data-target"), 10);
  if (isNaN(target)) return;

  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    current = Math.floor(progress * target);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateNumber(el);
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);

statNumbers.forEach((el) => statsObserver.observe(el));

/* ================================
   Project modal
================================== */
const projectModal = document.getElementById("projectModal");
const projectModalBackdrop = document.getElementById("projectModalBackdrop");
const projectModalClose = document.getElementById("projectModalClose");
const modalTitle = document.getElementById("projectModalTitle");
const modalText = document.getElementById("projectModalText");
const modalTags = document.getElementById("projectModalTags");

const projectData = {
  "digi-wallet": {
    title: "Digi Wallet Device",
    text:
      "A concept for a physical smart wallet device that securely stores cards, connects over Wi-Fi / 4G / NFC, and displays real-time transaction info with a companion app. Focused on user experience, security, and modern fintech workflows.",
    tags: ["Fintech", "Hardware concept", "Always-on connectivity"]
  },
  servers: {
    title: "Game & Minecraft Servers",
    text:
      "Experiments with spinning up different Minecraft and game servers, configuring plugins, optimizing TPS and latency, and testing different hosting setups for friends.",
    tags: ["Servers", "Networking", "Performance tuning"]
  },
  tools: {
    title: "Personal Tools & Scripts",
    text:
      "Small tools written in HTML, CSS, and JavaScript to automate repeated tasks, visualize data, and make daily device usage smoother and more efficient.",
    tags: ["Frontend", "Automation", "Productivity"]
  }
};

function openProjectModal(key) {
  if (!projectModal || !modalTitle || !modalText || !modalTags) return;
  const data = projectData[key];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalText.textContent = data.text;
  modalTags.innerHTML = "";
  data.tags.forEach((tag) => {
    const li = document.createElement("li");
    li.textContent = tag;
    modalTags.appendChild(li);
  });

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".project-card[data-project]").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-project");
    if (key) {
      openProjectModal(key);
    }
  });
});

if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener("click", closeProjectModal);
}
if (projectModalClose) {
  projectModalClose.addEventListener("click", closeProjectModal);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProjectModal();
  }
});

/* ================================
   Contact form (demo only)
================================== */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      return;
    }

    // Demo only: no real send, just fake success
    formStatus.textContent = "Thanks! This demo form doesn't actually send yet.";
    contactForm.reset();
  });
}
