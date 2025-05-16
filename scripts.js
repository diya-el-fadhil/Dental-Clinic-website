// Preloader handler
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
      setTimeout(() => (preloader.style.display = "none"), 500);
    }, 500);
  }
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

// Add required animation styles
(function injectAnimationStyles() {
  const styleContent = `
      .hero h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        overflow: hidden;
        opacity: 1 !important; /* Prevent FOUC */
      }
      .hero h1 .left-container,
      .hero h1 .right-container {
        display: inline-flex;
        overflow: hidden;
      }
      .hero h1 span {
        display: inline-block;
        white-space: pre;
        transform: translateY(100%);
        opacity: 0;
      }
      .hero h1 .left-container {
        transform-origin: right center;
        text-align: right;
      }
      .hero h1 .right-container {
        transform-origin: left center;
        text-align: left;
      }
    `;
  if (!document.querySelector("#animation-styles")) {
    const style = document.createElement("style");
    style.id = "animation-styles";
    style.textContent = styleContent;
    document.head.appendChild(style);
  }
})();

// Helper to split h1 into span-wrapped halves
function breakText() {
  const heroH1 = document.querySelector(".hero h1");
  if (!heroH1) return console.warn("Hero h1 not found");

  const chars = heroH1.textContent.trim().split("");
  const mid = Math.ceil(chars.length / 2);
  const spanWrap = (arr) =>
    arr.map((ch) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`).join("");

  heroH1.innerHTML = `
      <div class="left-container">${spanWrap(chars.slice(0, mid))}</div>
      <div class="right-container">${spanWrap(chars.slice(mid))}</div>
    `;
}

// Landing page animation
function createLandingAnimations() {
  breakText();

  gsap.killTweensOf([
    ".hero h1 .left-container span",
    ".hero h1 .right-container span",
    ".hero p",
    ".hero a",
    ".nav img.logo",
    ".nav ul",
    ".nav button",
  ]);

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onStart: () => console.log("Landing animation started"),
    onComplete: () => console.log("Landing animation completed"),
  });

  // Set initial states
  gsap.set(
    [".hero h1 .left-container span", ".hero h1 .right-container span"],
    {
      y: 100,
      opacity: 0,
    }
  );

  // Animate
  tl.to(".nav img.logo", { y: 0, opacity: 1, duration: 0.8 })
    .to(".nav button", { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
    .to(
      ".hero h1 .left-container span",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
      },
      "-=0.4"
    )
    .to(
      ".hero h1 .right-container span",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
      },
      "<"
    )
    .to(".hero p", { y: 0, opacity: 1, duration: 0.8 }, "-=0.4")
    .to(
      ".hero a",
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.75)",
      },
      "-=0.6"
    );
}

// About section animation
function createAboutAnimations() {
  const elements = [
    ".left-contain",
    ".top-image-container",
    ".bottom-left",
    ".bottom-right",
  ];

  gsap.set(elements, { opacity: 0, y: 50 });

  elements.forEach((selector) => {
    gsap.to(selector, {
      scrollTrigger: {
        trigger: selector,
        start: "top bottom-=100",
        end: "top center",
        toggleActions: "play none none reverse",
        markers: false, // turn on if debugging
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Hover effect
    const el = document.querySelector(selector);
    const img = el?.querySelector("img");
    if (img) {
      el.addEventListener("mouseenter", () => {
        gsap.to(img, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.inOut" });
      });
    }
  });
}

// Initialize all animations
function initializeAnimations() {
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded. Make sure it's included.");
    return;
  }

  createLandingAnimations();
  createAboutAnimations();
}

// Fire when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAnimations);
} else {
  initializeAnimations();
}

// String Animation
var initialPath = "M 10 100 Q 500 100 990 100";
var finalPath = "M 10 100 Q 500 100 990 100";
var string = document.querySelector("#string");

string.addEventListener("mousemove", function (dets) {
  const rect = string.getBoundingClientRect();
  const x = dets.clientX - rect.left;
  const y = dets.clientY - rect.top;

  path = `M 10 100 Q ${x} ${y} 990 100`;
  gsap.to("svg path", {
    attr: { d: path },
    duration: 0.3,
    ease: "power3.out",
  });
});

string.addEventListener("mouseleave", function () {
  gsap.to("svg path", {
    attr: { d: finalPath },
    duration: 1.5,
    ease: "elastic.out(1,0.2)",
  });
});

// Function to update card details
function updateCard() {
  const fullName = document.getElementById("fullName").value || "XXXX";
  const age = document.getElementById("age").value || "XX";
  const gender = document.getElementById("gender").value || "-";
  const phone = document.getElementById("phone").value || "+XX XXX XXX XXXX";
  const email = document.getElementById("email").value || "XXXX@GMAIL.COM";
  const appointmentDate = document.getElementById("appointmentDate").value
    ? new Date(
        document.getElementById("appointmentDate").value
      ).toLocaleDateString()
    : "XX-XX-XXXX";

  // Update character image based on gender
  const characterImage = document.getElementById("characterImage");
  if (gender === "male") {
    characterImage.src =
      "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";
  } else if (gender === "female") {
    characterImage.src =
      "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_female_user-512.png";
  } else {
    characterImage.src =
      "https://www.svgrepo.com/show/316857/profile-simple.svg";
  }

  // Update card fields
  document.getElementById("nameDisplay").textContent = `${fullName}`;
  document.getElementById("ageDisplay").textContent = `${age}`;
  document.getElementById("phoneDisplay").textContent = `${phone}`;
  document.getElementById("emailDisplay").textContent = `${email}`;
  document.getElementById("dateDisplay").textContent = `${appointmentDate}`;
}
// Initial update
updateCard();

// Add event listeners to all input fields
const inputs = document.querySelectorAll("input, select");
inputs.forEach((input) => {
  input.addEventListener("input", updateCard);
});

document.addEventListener("DOMContentLoaded", function () {
  // =====================
  // Section 1: Scroll Animation (#page4 items)
  // =====================

  const items = gsap.utils.toArray("#page4 .item");
  gsap.set(items, { scale: 0.5, opacity: 0 });

  gsap.to(items, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: "#page4",
      start: "top 50%",
    },
  });

  // =====================
  // Section 2: Hamburger Menu Logic
  // =====================

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav ul");
  const navLinks = document.querySelectorAll(".nav ul li");
  const menuBackground = document.querySelector(".menu-background");

  const openMenu = () => {
    hamburger.classList.add("active");
    navMenu.classList.add("active");

    menuBackground.style.display = "block";
    const rows = menuBackground.querySelectorAll(".bg-row");

    // Animate background rows
    rows.forEach((row, index) => {
      gsap.fromTo(
        row,
        { width: "0%" },
        {
          width: "100%",
          duration: 0.5,
          delay: 0.1 * index,
          ease: "power1.out",
        }
      );
    });

    // Animate nav links
    navLinks.forEach((link, index) => {
      gsap.fromTo(
        link,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.3 + index * 0.1,
          ease: "power2.out",
        }
      );
    });
  };

  const closeMenu = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");

    const rows = menuBackground.querySelectorAll(".bg-row");
    rows.forEach((row) => {
      gsap.to(row, {
        width: "0%",
        duration: 0.3,
        ease: "power1.in",
        onComplete: () => {
          menuBackground.style.display = "none";
        },
      });
    });

    navLinks.forEach((link) => {
      gsap.set(link, { clearProps: "all" });
    });
  };

  hamburger.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on link click
  if (window.width > 600) {
    document.querySelectorAll(".nav ul li a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 50 },
          duration: 1,
          ease: "power2.out",
        });
      }
      if (window.innerWidth < 600) {
        closeMenu();
      }
    });
  });

  // =====================
  // Section 3: Custom Cursor + Trail
  // =====================

  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  const trail = Array.from({ length: 10 }, () => {
    const dot = document.createElement("div");
    dot.classList.add("cursor-trail");
    document.body.appendChild(dot);
    return dot;
  });

  let mouseX = 0,
    mouseY = 0;
  const trailPositions = [];

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateTrail() {
    trailPositions.unshift({ x: mouseX, y: mouseY });
    trailPositions.length = trail.length;

    trail.forEach((dot, i) => {
      const position = trailPositions[i] || { x: mouseX, y: mouseY };
      dot.style.left = `${position.x}px`;
      dot.style.top = `${position.y}px`;
      dot.style.opacity = 1 - i / trail.length;
    });

    requestAnimationFrame(animateTrail);
  }

  if (window.innerWidth < 600) {
    cursor.style.display = "none";
    trail.forEach((dot) => {
      dot.style.display = "none";
    });
  }

  animateTrail();

  // Optional hover effects
  document.querySelectorAll("a, button").forEach((elem) => {
    elem.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    elem.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
});

$(document).ready(function () {
  var owl = $(".owl-carousel");
  owl.owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });
});

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxJGrDh6j4OcEUb6hgW5Cxgo5yUnLIhVVPFRRaFNMfjpHgQMxBCZDnmSlz6di4qvA0/exec";

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100); // animate in
  setTimeout(() => {
    toast.classList.remove("show"); // animate out
    setTimeout(() => toast.remove(), 300);
  }, 4000); // show for 4 sec
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted");

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      body: formData, // <-- FormData avoids CORS preflight!
    });

    if (res.ok) {
      showToast("Appointment successful! You will get a callback shortly.");
      form.reset();
    } else {
      showToast("Submission failed. Please try again.");
    }
  } catch (err) {
    console.error("Error!", err.message);
  }
});
