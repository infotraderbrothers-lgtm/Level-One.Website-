// Hexagonal Background with fade effect around pyramid
const canvas = document.getElementById('hexBackground');
const ctx = canvas.getContext('2d');
let hexagons = [];
let mouse = { x: 0, y: 0 };
let pyramidCenter = { x: 0, y: 0 };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Hexagon {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseColor = 'rgba(200, 200, 200, 0.3)';
        this.scale = 1;
        this.targetScale = 1;
    }

    draw() {
        const dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
        const maxDist = 150;
        const intensity = Math.max(0, 1 - dist / maxDist);
        
        // Calculate distance from pyramid center for fade effect
        const pyramidDist = Math.hypot(pyramidCenter.x - this.x, pyramidCenter.y - this.y);
        const fadeRadius = 250;
        const fadeIntensity = Math.min(1, Math.max(0, (pyramidDist - 100) / fadeRadius));
        
        this.targetScale = 1 + intensity * 0.15;
        this.scale += (this.targetScale - this.scale) * 0.1;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.x, -this.y);
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = this.x + this.size * Math.cos(angle);
            const hy = this.y + this.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        
        if (intensity > 0) {
            const r = Math.floor(139 + intensity * 50);
            const g = Math.floor(92 + intensity * 50);
            const b = Math.floor(246);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(0.15 + intensity * 0.15) * fadeIntensity})`;
            ctx.lineWidth = 1 + intensity * 0.5;
            ctx.shadowBlur = intensity * 5;
            ctx.shadowColor = `rgba(139, 92, 246, ${intensity * 0.3 * fadeIntensity})`;
        } else {
            ctx.strokeStyle = `rgba(200, 200, 200, ${0.3 * fadeIntensity})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
        ctx.restore();
    }
}

function initHexagons() {
    hexagons = [];
    const size = 30;
    const spacing = size * Math.sqrt(3);
    
    for (let y = -size; y < canvas.height + size; y += spacing * 0.75) {
        for (let x = -size; x < canvas.width + size; x += spacing) {
            const offset = (Math.floor(y / (spacing * 0.75)) % 2) * (spacing / 2);
            hexagons.push(new Hexagon(x + offset, y, size));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hexagons.forEach(hex => hex.draw());
    requestAnimationFrame(animate);
}

function updatePyramidCenter() {
    const container = document.getElementById('hologram-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        pyramidCenter.x = rect.left + rect.width / 2;
        pyramidCenter.y = rect.top + rect.height / 2;
    }
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initHexagons();
    updatePyramidCenter();
});

initHexagons();
animate();
updatePyramidCenter();

// Loading Animation with hexagon text effect
const loaderText = document.getElementById('loaderText');
const text = 'LEVEL ONE';

// Create hexagon-based text after triangles stop
setTimeout(() => {
    // Create individual letter spans
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'hex-letter';
        span.textContent = char;
        loaderText.appendChild(span);
        
        // Stagger the animation from left to right
        setTimeout(() => {
            span.classList.add('active');
            
            // Color change effect during animation
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

setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('home').classList.add('visible');
}, 6000);

// Glass Shatter Effect
const glassCanvas = document.getElementById('glassCanvas');
const glassCtx = glassCanvas.getContext('2d');
glassCanvas.width = window.innerWidth;
glassCanvas.height = window.innerHeight;

class GlassShard {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.opacity = 1;
        this.glowIntensity = Math.random();
        this.vertices = this.generateVertices();
    }

    generateVertices() {
        const vertices = [];
        const numVertices = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * Math.PI * 2;
            const radius = this.size * (0.5 + Math.random() * 0.5);
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        return vertices;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotationSpeed;
        this.opacity -= 0.008;
        this.glowIntensity = Math.sin(Date.now() * 0.005 + this.x) * 0.5 + 0.5;
    }

    draw() {
        glassCtx.save();
        glassCtx.translate(this.x, this.y);
        glassCtx.rotate(this.angle);
        glassCtx.globalAlpha = this.opacity;

        // Enhanced purple glow between shards
        glassCtx.shadowBlur = 30 + this.glowIntensity * 20;
        glassCtx.shadowColor = `rgba(139, 92, 246, ${this.glowIntensity})`;

        // Draw glass shard with gradient
        const gradient = glassCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(240, 240, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(220, 220, 240, 0.7)');

        glassCtx.beginPath();
        this.vertices.forEach((v, i) => {
            if (i === 0) glassCtx.moveTo(v.x, v.y);
            else glassCtx.lineTo(v.x, v.y);
        });
        glassCtx.closePath();
        
        glassCtx.fillStyle = gradient;
        glassCtx.fill();
        
        // Glass edge with purple tint
        glassCtx.strokeStyle = `rgba(139, 92, 246, ${0.6 * this.opacity})`;
        glassCtx.lineWidth = 2;
        glassCtx.stroke();

        // Additional glow layer
        glassCtx.strokeStyle = `rgba(139, 92, 246, ${0.3 * this.opacity * this.glowIntensity})`;
        glassCtx.lineWidth = 6;
        glassCtx.stroke();

        glassCtx.restore();
    }
}

let glassShards = [];
let animatingGlass = false;

function createGlassShatter() {
    glassShards = [];
    const numShards = 80;
    const centerX = glassCanvas.width / 2;
    const centerY = glassCanvas.height / 2;

    for (let i = 0; i < numShards; i++) {
        const angle = (i / numShards) * Math.PI * 2;
        const radius = Math.random() * 250;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = 40 + Math.random() * 60;
        glassShards.push(new GlassShard(x, y, size));
    }
}

function animateGlass() {
    if (!animatingGlass) return;

    glassCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    glassCtx.fillRect(0, 0, glassCanvas.width, glassCanvas.height);

    // Add background purple glow effect
    glassCtx.fillStyle = 'rgba(139, 92, 246, 0.02)';
    glassCtx.fillRect(0, 0, glassCanvas.width, glassCanvas.height);

    let allFaded = true;
    glassShards.forEach(shard => {
        shard.update();
        shard.draw();
        if (shard.opacity > 0) allFaded = false;
    });

    if (allFaded) {
        animatingGlass = false;
        glassCanvas.classList.remove('active');
        glassCtx.clearRect(0, 0, glassCanvas.width, glassCanvas.height);
        return;
    }

    requestAnimationFrame(animateGlass);
}

// 3D Pyramid Interaction
const hologram = document.getElementById('hologram');
const pyramid = document.querySelector('.pyramid');
const homeTitle = document.querySelector('.home-title');
const homeSubtitle = document.querySelector('.home-subtitle');
const mainNav = document.getElementById('mainNav');
const homePage = document.getElementById('home');

let isDragging = false;
let autoRotate = true;
let rotX = -20;
let rotY = 0;
let startX, startY;
let autoRotateInterval;
let isAnimating = false;
let currentSymbol = '';

function updatePyramid() {
    hologram.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function startAutoRotate() {
    autoRotate = true;
    autoRotateInterval = setInterval(() => {
        if (autoRotate && !isDragging && !isAnimating) {
            rotY += 0.3;
            updatePyramid();
        }
    }, 30);
}

function stopAutoRotate() {
    autoRotate = false;
    clearInterval(autoRotateInterval);
}

hologram.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('pyramid-face') || isAnimating) return;
    isDragging = true;
    stopAutoRotate();
    hologram.classList.add('dragging');
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
});

hologram.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('pyramid-face') || isAnimating) return;
    isDragging = true;
    stopAutoRotate();
    hologram.classList.add('dragging');
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    rotY += deltaX * 0.5;
    rotX -= deltaY * 0.5;
    rotX = Math.max(-90, Math.min(0, rotX));
    startX = e.clientX;
    startY = e.clientY;
    updatePyramid();
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    rotY += deltaX * 0.5;
    rotX -= deltaY * 0.5;
    rotX = Math.max(-90, Math.min(0, rotX));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    updatePyramid();
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        hologram.classList.remove('dragging');
        setTimeout(() => {
            startAutoRotate();
        }, 2000);
    }
});

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        hologram.classList.remove('dragging');
        setTimeout(() => {
            startAutoRotate();
        }, 2000);
    }
});

startAutoRotate();
updatePyramid();

// Page mapping
const pageMapping = {
    'front': 'about',
    'back': 'services',
    'left': 'technology',
    'right': 'contact'
};

function openPyramid(face) {
    if (isAnimating) return;
    isAnimating = true;
    stopAutoRotate();

    const targetPage = pageMapping[face];
    const clickedFace = document.querySelector(`.face-${face}`);
    currentSymbol = clickedFace.getAttribute('data-symbol');

    // Fade out home page content
    homePage.classList.add('fade-out');

    // Fade out pyramid
    setTimeout(() => {
        pyramid.classList.add('fade-out');
    }, 500);

    // Create and animate glass shatter
    setTimeout(() => {
        glassCanvas.classList.add('active');
        createGlassShatter();
        animatingGlass = true;
        animateGlass();
    }, 1000);

    // Show new page after glass animation peaks
    setTimeout(() => {
        homePage.classList.add('hidden');
        document.getElementById(targetPage).classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById(targetPage).classList.add('visible');
        }, 100);
    }, 2500);

    // Clean up
    setTimeout(() => {
        pyramid.classList.remove('fade-out');
        isAnimating = false;
    }, 3000);
}

function returnHome() {
    if (isAnimating) return;
    isAnimating = true;

    const currentPage = document.querySelector('.page.visible:not(#home)');
    
    // Fade out current page
    currentPage.classList.add('fade-out');

    // Create glass shatter effect
    setTimeout(() => {
        glassCanvas.classList.add('active');
        createGlassShatter();
        animatingGlass = true;
        animateGlass();
    }, 500);

    // Hide current page and show home
    setTimeout(() => {
        currentPage.classList.remove('visible', 'fade-out');
        currentPage.classList.add('hidden');
        homePage.classList.remove('hidden', 'fade-out');
    }, 1500);

    // Fade in home page
    setTimeout(() => {
        homePage.classList.add('visible');
        isAnimating = false;
        startAutoRotate();
    }, 2000);
}

// Page Navigation from nav buttons
function showPage(pageId) {
    if (pageId === 'home') {
        returnHome();
        return;
    }

    const pages = ['about', 'services', 'technology', 'contact'];
    if (pages.includes(pageId)) {
        // Find which face corresponds to this page
        const faceMap = {
            'about': 'front',
            'services': 'back',
            'technology': 'left',
            'contact': 'right'
        };
        openPyramid(faceMap[pageId]);
    }
}

// Form Submission
function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Update pyramid center on scroll and resize
window.addEventListener('scroll', updatePyramidCenter);
setInterval(updatePyramidCenter, 100);
