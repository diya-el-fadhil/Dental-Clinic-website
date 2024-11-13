// Helper function to split text for animation
function breakText() {
    let heroH1 = document.querySelector(".hero h1");
    if (!heroH1) return;
    
    let text = heroH1.textContent;
    let splitText = text.split("");
    let halfPoint = Math.floor(splitText.length / 2);
    let newHTML = {
        left: "",
        right: ""
    };
    
    splitText.forEach((char, index) => {
        if (index < halfPoint) {
            newHTML.left += `<span>${char}</span>`;
        } else {
            newHTML.right += `<span>${char}</span>`;
        }
    });
    
    heroH1.innerHTML = `
        <div class="left-container">${newHTML.left}</div>
        <div class="right-container">${newHTML.right}</div>
    `;
}

// Main animation function
function initializeAnimations() {
    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
        .hero h1 {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
        }
        .hero h1 .left-container,
        .hero h1 .right-container {
            display: inline-flex;
        }
        .hero h1 span {
            display: inline-block;
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
    document.head.appendChild(style);

    // Landing page animations
    function createLandingAnimations() {
        breakText();
        
        let tl = gsap.timeline();
        
        // Set initial states
        gsap.set([".hero h1 .left-container span", ".hero h1 .right-container span"], {
            y: 100,
            opacity: 0
        });
        gsap.set([".hero p", ".hero a", ".nav img.logo", ".nav ul", ".nav button"], {
            y: 30,
            opacity: 0
        });
        
        // Animation sequence
        tl.to(".nav img.logo", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        })
        .to(".nav ul", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .to(".nav button", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .to(".hero h1 .left-container span", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out"
        }, "-=0.5")
        .to(".hero h1 .right-container span", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: -0.05,
            ease: "power3.out"
        }, "<")  // Start at the same time as left container
        .to(".hero p", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        .to(".hero a", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.8)"
        }, "-=0.7");

        // Add hover effect to nav items
        const navItems = document.querySelectorAll('.nav ul li a');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    y: -2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Add hover effect to button
        const button = document.querySelector('.nav button');
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    // About page animations
    function createAboutAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Set initial states
        gsap.set([".left-contain", ".top-image-container", ".bottom-left", ".bottom-right"], {
            opacity: 0,
            y: 50
        });

        // Create scroll-triggered timeline
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#page2",
                start: "top center",
                end: "+=300",
                toggleActions: "play none none reverse"
            }
        });

        tl.to(".left-contain", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        })
        .to(".top-image-container", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.7")
        .to([".bottom-left", ".bottom-right"], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.5");

        // Enhanced hover animations
        const hoverElements = document.querySelectorAll('.top-image-container, .bottom-left, .bottom-right');
        
        hoverElements.forEach(element => {
            const img = element.querySelector('img');
            
            element.addEventListener('mouseenter', () => {
                gsap.to(img, {
                    scale: 1.03,
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(element, {
                    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                    duration: 0.4
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
                gsap.to(element, {
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    duration: 0.4
                });
            });
        });
    }

    // Initialize all animations
    createLandingAnimations();
    createAboutAnimations();
}

// Start animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations);

function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    const itemsToShow = 3;
    const totalItems = items.length;
    
    // Clone items for infinite scroll
    const cloneItems = () => {
        // Clone beginning items and append to end
        for (let i = 0; i < itemsToShow; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        
        // Clone end items and prepend to beginning
        for (let i = totalItems - itemsToShow; i < totalItems; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.prepend(clone);
        }
    };

    // Set up initial styles
    const setupStyles = () => {
        const containerWidth = track.parentElement.offsetWidth * 0.8;
        const itemWidth = (containerWidth - (itemsToShow - 1) * 24) / itemsToShow;

        track.style.cssText = `
            display: flex;
            gap: 1.5rem;
            transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
            width: fit-content;
            margin: 0 auto;
        `;

        const allItems = track.querySelectorAll('.carousel-item');
        allItems.forEach(item => {
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

    cloneItems();
    const itemWidth = setupStyles();
    
    let currentIndex = itemsToShow;
    let currentTranslate = -(currentIndex * (itemWidth + 24));
    track.style.transform = `translateX(${currentTranslate}px)`;

    // Update button states
    const updateButtonStates = () => {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Adjust the limits to ensure the last item is fully visible
        if (currentIndex <= itemsToShow) {
            prevBtn.disabled = true;
        }
        
        // Changed this condition to prevent cutting off the last item
        if (currentIndex >= totalItems) {
            nextBtn.disabled = true;
        }
    };

    // Initial button state
    updateButtonStates();

    const updateCarousel = (direction) => {
        const allItems = track.querySelectorAll('.carousel-item');
        const totalWidth = itemWidth + 160; // Item width plus gap
        
        if (direction === 'next' && currentIndex < totalItems) {
            currentIndex++;
            currentTranslate -= totalWidth;
        } else if (direction === 'prev' && currentIndex > itemsToShow) {
            currentIndex--;
            currentTranslate += totalWidth;
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

    // Rest of the carousel code remains the same...
    const addHoverEffects = () => {
        const allItems = track.querySelectorAll('.carousel-item');
        allItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    y: -10,
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    duration: 0.3
                });
                gsap.to(item.querySelector('img'), {
                    scale: 1.1,
                    duration: 0.3
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    duration: 0.3
                });
                gsap.to(item.querySelector('img'), {
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    };

    addHoverEffects();

    let isAnimating = false;
    
    nextBtn.addEventListener('click', () => {
        if (!isAnimating && !nextBtn.disabled) {
            isAnimating = true;
            updateCarousel('next');
            setTimeout(() => isAnimating = false, 600);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!isAnimating && !prevBtn.disabled) {
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

document.addEventListener('DOMContentLoaded', initializeCarousel);