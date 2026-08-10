(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Current year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile navigation */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    var desktopQuery = window.matchMedia("(min-width: 860px)");
    var onBreakpoint = function (e) { if (e.matches) closeNav(); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onBreakpoint);
    else if (desktopQuery.addListener) desktopQuery.addListener(onBreakpoint);
  }

  /* Rotating headline word */
  var rotator = document.querySelector("[data-rotator]");
  if (rotator && !reduceMotion) {
    var words = rotator.querySelectorAll(".rotator-word");
    if (words.length > 1) {
      var wordIndex = 0;
      setInterval(function () {
        var current = words[wordIndex];
        wordIndex = (wordIndex + 1) % words.length;
        var next = words[wordIndex];
        current.classList.remove("is-current");
        current.classList.add("is-leaving");
        next.classList.add("is-current");
        setTimeout(function () { current.classList.remove("is-leaving"); }, 550);
      }, 2600);
    }
  }

  /* Header shadow on scroll */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Highlight nav link for the section in view */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-cta)')
  );
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (section) { spyObserver.observe(section); });
  }
})();
