// Preloader handler
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 500); 
        }, 100);
    }
});

// Helper function to split text for animation
function breakText() {
    const heroH1 = document.querySelector(".hero h1");
    if (!heroH1) {
        console.warn("Hero h1 element not found");
        return;
    }
    
    const text = heroH1.textContent.trim();
    const splitText = text.split("");
    const halfPoint = Math.ceil(splitText.length / 2); // Changed to ceil for better text splitting
    
    const newHTML = {
        left: splitText.slice(0, halfPoint).map(char => 
            `<span>${char === " " ? "&nbsp;" : char}</span>`
        ).join(""),
        right: splitText.slice(halfPoint).map(char => 
            `<span>${char === " " ? "&nbsp;" : char}</span>`
        ).join("")
    };
    
    heroH1.innerHTML = `
        <div class="left-container">${newHTML.left}</div>
        <div class="right-container">${newHTML.right}</div>
    `;
}

// Main animation function
function initializeAnimations() {
    // Check for GSAP and required plugins
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not found. Please include GSAP in your project.');
        return;
    }

    // Add required styles
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

    // Create and append style element if it doesn't exist
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = styleContent;
        document.head.appendChild(style);
    }

    // Landing page animations
    function createLandingAnimations() {
        // Break text before creating timeline
        breakText();
        
        // Kill any existing tweens
        gsap.killTweensOf([
            ".hero h1 .left-container span",
            ".hero h1 .right-container span",
            ".hero p",
            ".hero a",
            ".nav img.logo",
            ".nav ul",
            ".nav button"
        ]);
        
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onStart: () => console.log('Landing animation started'),
            onComplete: () => console.log('Landing animation completed')
        });

        // Set initial states
        gsap.set([".hero h1 .left-container span", ".hero h1 .right-container span"], {
            y: 100,
            opacity: 0
        });
        
        gsap.set([".hero p", ".hero a", ".nav img.logo", ".nav ul", ".nav button"], {
            y: 30,
            opacity: 0
        });

        // Build animation sequence
        tl.to(".nav img.logo", {
            y: 0,
            opacity: 1,
            duration: 0.8
        })
        .to(".nav ul", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.6")
        .to(".nav button", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.6")
        .to(".hero h1 .left-container span", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03
        }, "-=0.4")
        .to(".hero h1 .right-container span", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03
        }, "<")
        .to(".hero p", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.4")
        .to(".hero a", {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)"
        }, "-=0.6");

        return tl;
    }

    // About page animations with ScrollTrigger
    function createAboutAnimations() {
        if (!gsap.plugins.ScrollTrigger) {
            console.error('ScrollTrigger plugin not found. Please include it in your project.');
            return;
        }

        const elements = [".left-contain", ".top-image-container", ".bottom-left", ".bottom-right"];
        
        // Set initial states
        gsap.set(elements, {
            opacity: 0,
            y: 50
        });

        elements.forEach(element => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom-=100",
                    end: "top center",
                    toggleActions: "play none none reverse",
                    markers: false // Set to true for debugging
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            });
        });

        // Add hover effects
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) return;

            const img = element.querySelector('img');
            if (!img) return;

            element.addEventListener('mouseenter', () => {
                gsap.to(img, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
            });
        });
    }

    // Initialize animations
    window.addEventListener('load', () => {
        createLandingAnimations();
        createAboutAnimations();
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}





// Start animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);

function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    const itemsToShow = 4; // Changed to show 4 cards
    const totalItems = items.length;
    const gap = 24; // Changed gap between cards
    
    // Set up initial styles
    const setupStyles = () => {
        const containerWidth = track.parentElement.offsetWidth * 0.7;
        const itemWidth = (containerWidth - (itemsToShow - 1) * 24) / itemsToShow;

        track.style.cssText = `
            display: flex;
            gap: 1.9rem;
            transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
            width: fit-content;
            margin: 0 auto;
        `;

        items.forEach(item => {
            item.style.cssText = `
                min-width: ${itemWidth}px;
                height: 400px;
                position: relative;
                border-radius: 1rem;
                overflow: hidden;
                background-color: #f8f8f8;
                transition: all 0.4s ease;
                flex-shrink: 0;
            `;

            const img = item.querySelector('img');
            if (img) {
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                `;
            }
        });

        return itemWidth;
    };

    const itemWidth = setupStyles();
    
    let currentIndex = 0;
    let currentTranslate = 0;
    track.style.transform = `translateX(${currentTranslate}px)`;

    // Update button states
    const updateButtonStates = () => {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalItems - itemsToShow;
    };

    updateButtonStates();

    const updateCarousel = (direction) => {
        const totalWidth = itemWidth + 24;
        
        if (direction === 'next' && currentIndex < totalItems - itemsToShow) {
            currentIndex++;
            currentTranslate -= totalWidth + gap * 3; // Move by full card width
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
            currentTranslate += totalWidth + gap * 3; // Move by full card width
        }

        gsap.to(track, {
            x: currentTranslate,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                updateButtonStates();
            }
        });
    };

    // Add hover effects (previous hover effects remain the same)
    const addHoverEffects = () => {
        const items = document.querySelectorAll('.carousel-item');
    
        items.forEach(item => {
            const img = item.querySelector('img');
            const originalSrc = img.getAttribute('src');
            const hoverSrc = img.getAttribute('data-hover-src');
    
            item.addEventListener('mouseenter', () => {
                if (hoverSrc) img.setAttribute('src', hoverSrc);
                gsap.to(item, {
                    y: -10,
                    scale: 1.02,
                    opacity: 1,
                    x: 5,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    duration: 0.3
                });
                gsap.to(img, {
                    scale: 1.1,
                    opacity: 0.9,
                    duration: 0.3
                });
            });
    
            item.addEventListener('mouseleave', () => {
                if (hoverSrc) img.setAttribute('src', originalSrc);
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    duration: 0.3
                });
                gsap.to(img, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3
                });
            });
        });
    };
    
    addHoverEffects();

    let isAnimating = false;
    let isHovering = false;
    let wheelTimeout;

    // Add hover detection
    track.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    track.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    // Handle wheel events instead of scroll
    const handleWheel = (event) => {
        if (isHovering) {
            event.preventDefault();
            
            if (!isAnimating) {
                const wheelDelta = event.deltaY;
                
                clearTimeout(wheelTimeout);
                
                wheelTimeout = setTimeout(() => {
                    if (Math.abs(wheelDelta) > 10) { // Minimum wheel threshold
                        if (wheelDelta > 0 && currentIndex < totalItems - itemsToShow) {
                            isAnimating = true;
                            updateCarousel('next');
                            setTimeout(() => isAnimating = false, 600);
                        } else if (wheelDelta < 0 && currentIndex > 0) {
                            isAnimating = true;
                            updateCarousel('prev');
                            setTimeout(() => isAnimating = false, 600);
                        }
                    }
                }, 20); // Debounce wheel events
            }
        }
        // Prevent scrolling when at the first or last item
        if (
            (currentIndex === 0 && event.deltaY < 0) ||
            (currentIndex >= totalItems - itemsToShow && event.deltaY > 0)
        ) {
            event.preventDefault();
        }
    };

    // Add wheel event listener with passive: false to allow preventDefault
    track.addEventListener('wheel', handleWheel, { passive: false });

    // Button click handlers
    nextBtn.addEventListener('click', () => {
        if (!isAnimating && currentIndex < totalItems - itemsToShow) {
            isAnimating = true;
            updateCarousel('next');
            setTimeout(() => isAnimating = false, 600);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!isAnimating && currentIndex > 0) {
            isAnimating = true;
            updateCarousel('prev');
            setTimeout(() => isAnimating = false, 600);
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemWidth = setupStyles();
            currentTranslate = -(currentIndex * (newItemWidth + 24));
            track.style.transform = `translateX(${currentTranslate}px)`;
            updateButtonStates();
        }, 250);
    });
}

function addTouchSupport() {
    const track = document.querySelector('.carousel-track');
    const carouselItems = track.children;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let initialTransform = 0;
    
    // Calculate scroll limits
    const trackWidth = track.scrollWidth;
    const viewportWidth = track.parentElement.clientWidth;
    const maxScroll = -(trackWidth - viewportWidth);

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        initialTransform = new DOMMatrix(window.getComputedStyle(track).transform).e;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        const newPosition = initialTransform + swipeDistance * 2;
        
        // Enforce scroll limits with elastic effect
        const boundedPosition = Math.min(
            0, 
            Math.max(maxScroll, newPosition)
        );
        
        gsap.to(track, {
            x: boundedPosition,
            duration: 0,
            ease: "power1.out"
        });
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        const swipeDistance = touchEndX - touchStartX;
        const absSwipeDistance = Math.abs(swipeDistance);
        const currentTransform = new DOMMatrix(window.getComputedStyle(track).transform).e;
        
        if (absSwipeDistance > 50) {
            if (swipeDistance > 0) {
                updateCarousel('prev');
            } else {
                updateCarousel('next');
            }
        } else {
            // Snap back to original position within limits
            gsap.to(track, {
                x: Math.min(0, Math.max(maxScroll, currentTransform)),
                duration: 0.3,
                ease: "power1.out"
            });
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', addTouchSupport);

document.addEventListener('DOMContentLoaded', initializeCarousel);






// String Animation
var initialPath = "M 10 100 Q 500 100 990 100";
var finalPath = "M 10 100 Q 500 100 990 100";
var string = document.querySelector("#string");

string.addEventListener("mousemove", function(dets) {
    const rect = string.getBoundingClientRect();
    const x = dets.clientX - rect.left;
    const y = dets.clientY - rect.top;
    
    path = `M 10 100 Q ${x} ${y} 990 100`;
    gsap.to("svg path", {
        attr: { d: path },
        duration: 0.3,
        ease: "power3.out"
    });
});

string.addEventListener("mouseleave", function() {
    gsap.to("svg path", {
        attr: { d: finalPath },
        duration: 1.5,
        ease: "elastic.out(1,0.2)"
    });
});


// Function to update card details
function updateCard() {
    const fullName = document.getElementById('fullName').value || 'XXXX';
    const age = document.getElementById('age').value || 'XX';
    const gender = document.getElementById('gender').value || '-';
    const phone = document.getElementById('phone').value || '+XX XXX XXX XXXX';
    const email = document.getElementById('email').value || 'XXXX@GMAIL.COM';
    const appointmentDate = document.getElementById('appointmentDate').value 
        ? new Date(document.getElementById('appointmentDate').value).toLocaleDateString() 
        : 'XX-XX-XXXX';

    // Update character image based on gender
    const characterImage = document.getElementById('characterImage');
    if (gender === 'male') {
        characterImage.src = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";
    } else if (gender === 'female') {
        characterImage.src = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_female_user-512.png";
    } else {
        characterImage.src = "https://www.svgrepo.com/show/316857/profile-simple.svg";
    }

    // Update card fields
    document.getElementById('nameDisplay').textContent = `${fullName}`;
    document.getElementById('ageDisplay').textContent = `${age}`;
    document.getElementById('phoneDisplay').textContent = `${phone}`;
    document.getElementById('emailDisplay').textContent = `${email}`;
    document.getElementById('dateDisplay').textContent = `${appointmentDate}`;
}

// Add event listeners to all input fields
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', updateCard);
});

// Initial update
updateCard();


document.addEventListener('DOMContentLoaded', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Get all items
    const items = gsap.utils.toArray('#page4 .item');
    
    // Set initial state
    gsap.set(items, {
        scale: 0.5,
        opacity: 0
    });
    
    // Create the animation
    gsap.to(items, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.2)",
        
        scrollTrigger: {
            trigger: "#page4",
            start: "top 50%",
            // markers: true,
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav ul');
    const navLinks = document.querySelectorAll('.nav ul li');
    const menuBackground = document.querySelector('.menu-background');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        if (navMenu.classList.contains('active')) {
            // Background rows animation
            menuBackground.style.display = 'block';
            const rows = menuBackground.querySelectorAll('.bg-row');
            rows.forEach((row, index) => {
                row.style.width = '0%';
                setTimeout(() => {
                    row.style.width = '100%';
                    row.style.transition = 'width 0.5s ease';
                }, 100 * index);
            });

            // Links animation
            navLinks.forEach((link, index) => {
                link.style.transform = 'translateX(100%)';
                link.style.opacity = '0';
                
                setTimeout(() => {
                    link.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                    link.style.transform = 'translateX(0)';
                    link.style.opacity = '1';
                }, 300 * index);
            });
        } else {
            // Reset background when closing
            const rows = menuBackground.querySelectorAll('.bg-row');
            rows.forEach(row => {
                row.style.width = '0%';
            });
        }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});