/* ==================================================================
   CERTIFICATIONS PAGE
   ================================================================== */

/* ---------- mobile menu ---------- */
const menu   = document.querySelector("#menu");
const navbar = document.querySelector(".navbar");

if (menu) {
  menu.addEventListener("click", () => {
    menu.classList.toggle("fa-times");
    navbar.classList.toggle("nav-toggle");
  });
}

window.addEventListener("scroll", () => {
  if (menu) {
    menu.classList.remove("fa-times");
    navbar.classList.remove("nav-toggle");
  }
  const st = document.querySelector("#scroll-top");
  if (st) st.classList.toggle("active", window.scrollY > 500);
});

/* ---------- animated counters ---------- */
(function () {
  const nums = document.querySelectorAll(".cs-num");
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let n = 0;
      const timer = setInterval(() => {
        n += Math.ceil(target / 25);
        if (n >= target) { n = target; clearInterval(timer); }
        el.textContent = n;
      }, 40);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach((n) => io.observe(n));
})();

/* ---------- category filtering (certificates + badges) ---------- */
(function () {
  const btns       = document.querySelectorAll("#certFilters .btn");
  const certCards  = document.querySelectorAll("#certGrid .cert-card");
  const badgeCards = document.querySelectorAll("#badgeGrid .badge-card");
  const empty      = document.getElementById("filterEmpty");
  const badgeSec   = document.querySelector(".badges-section");
  if (!btns.length) return;

  const apply = (nodes, filter) => {
    let visible = 0;
    nodes.forEach((el) => {
      const match = filter === "all" || el.dataset.cat === filter;
      el.classList.toggle("hide", !match);
      if (match) {
        visible++;
        el.classList.remove("show");
        void el.offsetWidth;          // restart animation
        el.classList.add("show");
      }
    });
    return visible;
  };

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("is-checked"));
      btn.classList.add("is-checked");

      const filter = btn.dataset.filter;
      const certsVisible  = apply(certCards,  filter);
      const badgesVisible = apply(badgeCards, filter);

      // empty state for certificates
      if (empty) empty.classList.toggle("show", certsVisible === 0);

      // hide the whole badges block if none match
      if (badgeSec) badgeSec.style.display = badgesVisible === 0 ? "none" : "";
    });
  });
})();

/* ---------- lightbox ---------- */
(function () {
  const lb = document.getElementById("certLightbox");
  if (!lb) return;

  const inner    = document.getElementById("certLightboxInner");
  const closeBtn = document.getElementById("certLightboxClose");

  const open = (html) => {
    inner.innerHTML = html;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("open");
    inner.innerHTML = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".cert-thumb").forEach((thumb) => {
    const fire = () => {
      const pdf = thumb.dataset.pdf;
      const img = thumb.querySelector("img");
      if (pdf) open(`<iframe src="${pdf}#view=FitH&toolbar=1" title="Certificate"></iframe>`);
      else if (img) open(`<img src="${img.src}" alt="${img.alt}">`);
    };
    thumb.addEventListener("click", fire);
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); }
    });
  });

  document.querySelectorAll(".badge-img-wrap img").forEach((img) => {
    img.addEventListener("click", () => open(`<img src="${img.src}" alt="${img.alt}">`));
  });

  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target === inner) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

/* ---------- broken image detector ---------- */
document.querySelectorAll(".cert-thumb img, .badge-img-wrap img").forEach((img) => {
  img.addEventListener("error", function () {
    console.error("❌ BROKEN IMAGE PATH:", this.getAttribute("src"));
    this.style.display = "none";
    this.parentElement.insertAdjacentHTML(
      "beforeend",
      '<i class="fas fa-certificate" style="font-size:5rem;color:#ffd700;opacity:.4"></i>'
    );
  });
});

/* ---------- scroll reveal ---------- */
if (window.ScrollReveal) {
  ScrollReveal().reveal(".cert-card",  { distance: "40px", origin: "bottom", duration: 700, interval: 80, opacity: 0 });
  ScrollReveal().reveal(".badge-card", { distance: "40px", origin: "bottom", duration: 700, interval: 70, opacity: 0 });
  ScrollReveal().reveal(".cs-item",    { distance: "25px", origin: "bottom", duration: 600, interval: 90, opacity: 0 });
}