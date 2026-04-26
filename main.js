(function () {
  // === EmailJS INIT ===
  emailjs.init("1Xtrz_Elfpqhi9XAz");

  // === DOM Elements ===
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const themeToggle = document.getElementById("themeToggle");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const allNavLinks = document.querySelectorAll(".nav-links a");
  const revealElements = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  // === Theme Management ===
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className =
      theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  // === Mobile Menu ===
  function openMobileMenu() {
    navLinks.classList.add("open");
    mobileOverlay.classList.add("active");
    mobileMenuBtn.querySelector("i").className = "fa-solid fa-xmark";
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    navLinks.classList.remove("open");
    mobileOverlay.classList.remove("active");
    mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
    document.body.style.overflow = "";
  }

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.contains("open")
      ? closeMobileMenu()
      : openMobileMenu();
  });

  mobileOverlay.addEventListener("click", closeMobileMenu);

  allNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // === Navbar Scroll ===
  function handleScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 50);

    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    allNavLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentSection
      );
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // === Reveal Animations ===
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));

  // === Skill Bars ===
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute("data-width") + "%";
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = "0%";
    skillObserver.observe(bar);
  });

  // === Contact Form ===
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();

    if (!name || !email || !message) {
      showToast("Por favor, completa todos los campos.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Por favor, ingresa un email válido.", "error");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // === EMAILJS SEND ===
    emailjs
      .send("service_5vc7tbt", "template_yzm76sm", {
        name: name,
        email: email,
        message: message,
        to_email: "byronmatalia.dev@gmail.com",
      })
      .then(() => {
        showToast(
          "✅ ¡Mensaje enviado con éxito! Gracias, " + name + ".",
          "success"
        );
        contactForm.reset();
      })
      .catch(() => {
        showToast("❌ Error al enviar el mensaje.", "error");
      })
      .finally(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // === Toast ===
  let toastTimeout;

  function showToast(message, type = "success") {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.style.background =
      type === "error" ? "#ef4444" : "var(--toast-bg)";
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  handleScroll();

  // === Shortcut ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "t" && e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      themeToggle.click();
    }
  });
})();