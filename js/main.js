(function () {
    "use strict";

    var body = document.body;
    var mobileToggle = document.querySelector(".mobile-menu-toggle");
    var mobileClose = document.querySelector(".mobile-menu-close");
    var mobileOverlay = document.querySelector(".mobile-drawer-overlay");
    var mobileLinks = document.querySelectorAll(".mobile-nav a");
    var desktopLinks = document.querySelectorAll(".desktop-nav a");
    var contactForm = document.getElementById("contact-whatsapp-form");

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

    if (window.jQuery && window.jQuery.fn.owlCarousel) {
        window.jQuery(".screenshot-slide").owlCarousel({
            items: 4,
            loop: true,
            center: true,
            margin: 20,
            nav: true,
            dots: false,
            autoplay: false,
            navText: ["<span>&larr;</span>", "<span>&rarr;</span>"],
            responsive: {
                0: { items: 1, margin: 0 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 4 }
            }
        });

        window.jQuery(".testimonial-slide").owlCarousel({
            items: 3,
            loop: true,
            nav: true,
            dots: false,
            margin: 20,
            autoplay: true,
            navText: ["<span>&larr;</span>", "<span>&rarr;</span>"],
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1200: { items: 3 }
            }
        });
    }

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
