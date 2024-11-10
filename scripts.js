// Function to split text into two halves
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
    
    // Split into two containers for left and right
    splitText.forEach((char, index) => {
        if (index < halfPoint) {
            newHTML.left += `<span>${char}</span>`;
        } else {
            newHTML.right += `<span>${char}</span>`;
        }
    });
    
    // Create container structure
    heroH1.innerHTML = `
        <div class="left-container">${newHTML.left}</div>
        <div class="right-container">${newHTML.right}</div>
    `;
}

// Main animation timeline
function createAnimations() {
    // Split the text first
    breakText();
    
    // Create main timeline
    let tl = gsap.timeline();
    
    // Set initial states
    gsap.set(".hero h1 .left-container span", {
        y: 100,
        opacity: 0
    });
    
    gsap.set(".hero h1 .right-container span", {
        y: 100,
        opacity: 0
    });
    
    gsap.set(".hero p", {
        y: 50,
        opacity: 0
    });
    
    gsap.set(".hero a", {
        y: 30,
        opacity: 0
    });
    
    // Animate nav items
    tl.from(".nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
    
    // Animate heading halves simultaneously
    tl.to(".hero h1 .left-container span", {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: "power3.out"
    }, "text");
    
    tl.to(".hero h1 .right-container span", {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: -0.05,
        ease: "power3.out"
    }, "text"); 
    
    // Animate paragraph
    tl.to(".hero p", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
    
    // Animate button
    tl.to(".hero a", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.8");
}

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

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', createAnimations);