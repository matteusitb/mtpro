(function () {
    "use strict";

    var body = document.body;
    var mobileToggle = document.querySelector(".mobile-menu-toggle");
    var mobileClose = document.querySelector(".mobile-menu-close");
    var mobileOverlay = document.querySelector(".mobile-drawer-overlay");
    var mobileLinks = document.querySelectorAll(".mobile-nav a");
    var desktopLinks = document.querySelectorAll(".desktop-nav a");
    var contactForm = document.getElementById("contact-whatsapp-form");
    var revealTargets = [
        ".section-heading",
        ".about-card",
        ".feature-card",
        ".phone-shot",
        ".pricing-card",
        ".contact-form-card",
        ".contact-side-card",
        ".footer-brand",
        ".footer-menu",
        ".footer-note"
    ];

    function setScrolledState() {
        body.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    function openDrawer() {
        body.classList.add("is-drawer-open", "is-locked");
        if (mobileToggle) {
            mobileToggle.setAttribute("aria-expanded", "true");
        }
    }

    function closeDrawer() {
        body.classList.remove("is-drawer-open", "is-locked");
        if (mobileToggle) {
            mobileToggle.setAttribute("aria-expanded", "false");
        }
    }

    function smoothScrollTo(targetId) {
        var target = document.querySelector(targetId);
        var header = document.querySelector(".site-header");
        if (!target) return;

        var offset = header ? header.offsetHeight + 8 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: top,
            behavior: "smooth"
        });
    }

    function bindAnchorLinks(links) {
        links.forEach(function (link) {
            link.addEventListener("click", function (event) {
                var href = link.getAttribute("href");
                if (!href || href.charAt(0) !== "#") return;

                event.preventDefault();
                smoothScrollTo(href);
                closeDrawer();
            });
        });
    }

    if (mobileToggle) {
        mobileToggle.addEventListener("click", function () {
            if (body.classList.contains("is-drawer-open")) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener("click", closeDrawer);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", closeDrawer);
    }

    bindAnchorLinks(Array.prototype.slice.call(mobileLinks));
    bindAnchorLinks(Array.prototype.slice.call(desktopLinks));

    window.addEventListener("scroll", setScrolledState, { passive: true });
    setScrolledState();

    function setupRevealOnScroll() {
        if (!("IntersectionObserver" in window)) {
            return;
        }

        var elements = [];
        revealTargets.forEach(function (selector) {
            var found = document.querySelectorAll(selector);
            found.forEach(function (element, index) {
                element.classList.add("reveal-on-scroll");
                if (selector === ".section-heading" || selector === ".footer-note") {
                    element.classList.add("reveal-soft");
                }
                element.style.setProperty("--reveal-delay", ((index % 4) * 80) + "ms");
                elements.push(element);
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px"
        });

        elements.forEach(function (element) {
            observer.observe(element);
        });
    }

    setupRevealOnScroll();

    function setupNativeCarousels() {
        var carousels = document.querySelectorAll("[data-carousel]");

        function updateButtons(viewport, prevButton, nextButton) {
            var maxScroll = viewport.scrollWidth - viewport.clientWidth;
            prevButton.disabled = viewport.scrollLeft <= 8;
            nextButton.disabled = viewport.scrollLeft >= maxScroll - 8;
        }

        carousels.forEach(function (carousel) {
            var viewport = carousel.querySelector(".native-carousel-viewport");
            var prevButton = carousel.querySelector("[data-carousel-prev]");
            var nextButton = carousel.querySelector("[data-carousel-next]");

            if (!viewport || !prevButton || !nextButton) return;

            function scrollByViewport(direction) {
                var amount = Math.max(viewport.clientWidth * 0.86, 240);
                viewport.scrollBy({
                    left: amount * direction,
                    behavior: "smooth"
                });
            }

            prevButton.addEventListener("click", function () {
                scrollByViewport(-1);
            });

            nextButton.addEventListener("click", function () {
                scrollByViewport(1);
            });

            viewport.addEventListener("scroll", function () {
                updateButtons(viewport, prevButton, nextButton);
            }, { passive: true });

            window.addEventListener("resize", function () {
                updateButtons(viewport, prevButton, nextButton);
            });

            updateButtons(viewport, prevButton, nextButton);
        });
    }

    setupNativeCarousels();

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            var company = contactForm.elements.company.value.trim();
            var email = contactForm.elements.email.value.trim();
            var goal = contactForm.elements.goal.value.trim();
            var message = contactForm.elements.message.value.trim();

            var whatsappMessage = [
                "Olá! Preenchi o formulário do site MT Pró e gostaria de falar com a equipe.",
                "",
                "Empresa: " + company,
                "E-mail: " + email,
                "Objetivo: " + goal,
                "Mensagem: " + message
            ].join("\n");

            window.location.href = "https://wa.me/5593984035819?text=" + encodeURIComponent(whatsappMessage);
        });
    }
}());
