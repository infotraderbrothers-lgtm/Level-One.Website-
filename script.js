// LED Rain Background
const ledCanvas = document.getElementById('ledRain');
const ledCtx = ledCanvas.getContext('2d');
ledCanvas.width = window.innerWidth;
ledCanvas.height = window.innerHeight;

let ledRainActive = true;
let ledDrops = [];

class LEDDrop {
    constructor() {
        this.x = Math.random() * ledCanvas.width;
        this.y = Math.random() * -ledCanvas.height;
        this.length = 80 + Math.random() * 120;
        this.speed = 2 + Math.random() * 3;
        this.opacity = 0.3 + Math.random() * 0.4;
    }

    update() {
        if (ledRainActive) {
            this.y += this.speed;
        }
        
        if (this.y > ledCanvas.height) {
            this.y = -this.length;
            this.x = Math.random() * ledCanvas.width;
        }
    }

    draw() {
        const gradient = ledCtx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
        gradient.addColorStop(0, `rgba(255, 140, 60, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 160, 80, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 180, 100, ${this.opacity * 0.5})`);
        
        ledCtx.strokeStyle = gradient;
        ledCtx.lineWidth = 3;
        ledCtx.beginPath();
        ledCtx.moveTo(this.x, this.y);
        ledCtx.lineTo(this.x, this.y + this.length);
        ledCtx.stroke();
    }
}

function initLEDRain() {
    ledDrops = [];
    const numDrops = 40;
    for (let i = 0; i < numDrops; i++) {
        ledDrops.push(new LEDDrop());
    }
}

function animateLEDRain() {
    ledCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ledCtx.fillRect(0, 0, ledCanvas.width, ledCanvas.height);
    
    ledDrops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    
    requestAnimationFrame(animateLEDRain);
}

window.addEventListener('resize', () => {
    ledCanvas.width = window.innerWidth;
    ledCanvas.height = window.innerHeight;
});

initLEDRain();
animateLEDRain();

// Loading Animation
const loaderText = document.getElementById('loaderText');
const text = 'LEVEL ONE';

setTimeout(() => {
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'hex-letter';
        span.textContent = char;
        span.style.color = '#ffffff';
        loaderText.appendChild(span);
        
        setTimeout(() => {
            span.classList.add('active');
            
            const colors = ['#00d4ff', '#a78bfa', '#ec4899', '#8b5cf6', '#ffffff'];
            let colorIndex = 0;
            const colorInterval = setInterval(() => {
                if (colorIndex < colors.length - 1) {
                    span.style.color = colors[colorIndex];
                    colorIndex++;
                } else {
                    span.style.color = '#ffffff';
                    clearInterval(colorInterval);
                }
            }, 100);
        }, index * 150);
    });
}, 3000);

// Fade out text from right to left
setTimeout(() => {
    const letters = document.querySelectorAll('.hex-letter');
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add('fade-out');
        }, (letters.length - 1 - index) * 100);
    });
}, 5500);

// Hide loader and show home page
setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('home').classList.add('visible');
}, 7000);

// Global state
let currentPage = 'home';
let specialMenuOpen = false;
let selectedCase = null;

// Navigation functions
function navigateToHome() {
    if (currentPage === 'home') return;
    navigateTo('home');
}

function navigateTo(pageId) {
    if (currentPage === pageId) return;
    
    // Fade out current page
    const currentPageEl = document.getElementById(currentPage);
    currentPageEl.classList.add('fade-out');
    
    // Show mini loader
    setTimeout(() => {
        currentPageEl.classList.remove('visible', 'fade-out');
        currentPageEl.classList.add('hidden');
        
        document.getElementById('miniLoader').classList.remove('hidden');
        document.getElementById('miniLoader').classList.add('active');
    }, 800);
    
    // Hide mini loader and show new page
    setTimeout(() => {
        document.getElementById('miniLoader').classList.remove('active');
        
        setTimeout(() => {
            document.getElementById('miniLoader').classList.add('hidden');
            const newPageEl = document.getElementById(pageId);
            newPageEl.classList.remove('hidden');
            
            setTimeout(() => {
                newPageEl.classList.add('visible');
                currentPage = pageId;
            }, 100);
        }, 500);
    }, 3000);
}

// Menu functions
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuOverlay.classList.contains('hidden')) {
        menuOverlay.classList.remove('hidden');
        setTimeout(() => {
            menuOverlay.classList.add('active');
        }, 10);
    } else {
        menuOverlay.classList.remove('active');
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
        }, 500);
    }
}

// Special menu functions
function toggleSpecialMenu() {
    const specialMenu = document.getElementById('specialMenu');
    const mainNav = document.getElementById('mainNav');
    const currentPageEl = document.getElementById(currentPage);
    
    if (!specialMenuOpen) {
        // Opening special menu
        specialMenuOpen = true;
        
        // Fade out content
        currentPageEl.classList.add('fade-out');
        
        setTimeout(() => {
            // Stop LED rain
            ledRainActive = false;
            
            // Show special menu
            specialMenu.classList.remove('hidden');
            setTimeout(() => {
                specialMenu.classList.add('active');
            }, 10);
        }, 500);
    } else {
        // Closing special menu
        specialMenuOpen = false;
        
        // Fade out special menu
        specialMenu.classList.remove('active');
        
        setTimeout(() => {
            specialMenu.classList.add('hidden');
            
            // Restart LED rain
            ledRainActive = true;
            
            // Fade in content
            currentPageEl.classList.remove('fade-out');
        }, 500);
    }
}

function selectSpecialPage(caseId) {
    selectedCase = caseId;
    
    // Highlight selected button
    document.querySelectorAll('.special-menu-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Stop pyramid rotation and position to correct face
    const pyramid = document.getElementById('floatingPyramid');
    pyramid.classList.add('paused');
    
    // Rotate to show selected face
    const rotations = {
        'case1': 'rotateY(0deg) rotateX(10deg)',
        'case2': 'rotateY(90deg) rotateX(10deg)',
        'case3': 'rotateY(270deg) rotateX(10deg)',
        'case4': 'rotateY(180deg) rotateX(10deg)'
    };
    
    pyramid.style.transform = rotations[caseId];
    
    // Add glow to selected face
    setTimeout(() => {
        document.querySelectorAll('.pyramid-face-float').forEach(face => {
            face.classList.remove('glow');
            if (face.getAttribute('data-case') === caseId) {
                face.classList.add('glow');
            }
        });
    }, 500);
}

// Pyramid face click handler
document.addEventListener('click', (e) => {
    if (e.target.closest('.pyramid-face-float.glow')) {
        const caseId = e.target.closest('.pyramid-face-float').getAttribute('data-case');
        loadCasePage(caseId);
    }
});

function loadCasePage(caseId) {
    const specialMenu = document.getElementById('specialMenu');
    
    // Fade out special menu
    specialMenu.classList.remove('active');
    
    setTimeout(() => {
        specialMenu.classList.add('hidden');
        
        // Restart LED rain
        ledRainActive = true;
        
        // Show mini loader
        document.getElementById('miniLoader').classList.remove('hidden');
        document.getElementById('miniLoader').classList.add('active');
    }, 500);
    
    // Hide mini loader and show case page
    setTimeout(() => {
        document.getElementById('miniLoader').classList.remove('active');
        
        setTimeout(() => {
            document.getElementById('miniLoader').classList.add('hidden');
            
            // Hide current page
            const currentPageEl = document.getElementById(currentPage);
            currentPageEl.classList.remove('visible');
            currentPageEl.classList.add('hidden');
            
            // Show case page
            const casePageEl = document.getElementById(caseId);
            casePageEl.classList.remove('hidden');
            
            setTimeout(() => {
                casePageEl.classList.add('visible');
                currentPage = caseId;
                specialMenuOpen = false;
                selectedCase = null;
                
                // Reset pyramid
                const pyramid = document.getElementById('floatingPyramid');
                pyramid.classList.remove('paused');
                pyramid.style.transform = '';
                document.querySelectorAll('.pyramid-face-float').forEach(face => {
                    face.classList.remove('glow');
                });
                document.querySelectorAll('.special-menu-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
            }, 100);
        }, 500);
    }, 3000);
}

// Form Submission
function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Close menu when clicking menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menuOverlay = document.getElementById('menuOverlay');
        menuOverlay.classList.remove('active');
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
        }, 500);
    });
});
