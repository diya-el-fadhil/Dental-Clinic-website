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
        for (let i = 0; i < itemsToShow; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        
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
        
        if (currentIndex <= itemsToShow) {
            prevBtn.disabled = true;
        }
        
        if (currentIndex >= totalItems) {
            nextBtn.disabled = true;
        }
    };

    updateButtonStates();

    const updateCarousel = (direction) => {
        const totalWidth = itemWidth + 160;
        
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

    // Add hover effects
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
    let isHovering = false;
    let lastWheelDelta = 0;
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
            event.preventDefault(); // Prevent default scroll
            
            if (!isAnimating) {
                const wheelDelta = event.deltaY;
                
                clearTimeout(wheelTimeout);
                
                wheelTimeout = setTimeout(() => {
                    if (Math.abs(wheelDelta) > 20) { // Minimum wheel threshold
                        if (wheelDelta > 0 && !nextBtn.disabled) {
                            isAnimating = true;
                            updateCarousel('next');
                            setTimeout(() => isAnimating = false, 600);
                        } else if (wheelDelta < 0 && !prevBtn.disabled) {
                            isAnimating = true;
                            updateCarousel('prev');
                            setTimeout(() => isAnimating = false, 600);
                        }
                    }
                }, 50); // Debounce wheel events
                
                lastWheelDelta = wheelDelta;
            }
        }
    };

    // Add wheel event listener with passive: false to allow preventDefault
    track.addEventListener('wheel', handleWheel, { passive: false });

    // Button click handlers
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