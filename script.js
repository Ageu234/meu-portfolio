/**
 * Ageu Rafael - Premium Portfolio
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initHeroCanvasAnimation();
    initScrollReveal();
});

/* ==========================================================================
   Scroll Reveal Animation
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ==========================================================================
   Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        if (nav.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            icon.classList.replace('ph-x', 'ph-list');
        });
    });
}

/* ==========================================================================
   Hero Canvas Image Sequence Animation
   ========================================================================== */
function initHeroCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to match window size exactly
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Image Sequence Configuration
    const frameCount = 80; // 000 to 079
    const imagePathPrefix = 'Imagens/Abstract_scene_particle_202603201457_0';
    const images = [];
    let imagesLoaded = 0;

    // Helper to format numbers with leading zeros (e.g. 01, 12, 00)
    // The user's image names use 3 digits (e.g., 000, 045, 079)
    const padNumber = (num, size) => {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    // Preload images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        // Construct filename: Abstract_scene_particle_202603201457_000.jpg
        img.src = `${imagePathPrefix}${padNumber(i, 2)}.jpg`;
        images.push(img);
        
        img.onload = () => {
            imagesLoaded++;
            // Draw first frame immediately when it's loaded to prevent blank screen
            if (imagesLoaded === 1) {
                drawImageToCanvas(images[0]);
            }
        };
    }

    let currentFrame = 0;
    
    // Function to draw image maintaining aspect ratio and covering the screen (like object-fit: cover)
    function drawImageToCanvas(img) {
        if (!img.complete || img.naturalWidth === 0) return;

        // Calculate size to "cover" the canvas
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
    }

    // Animation Loop
    let lastTime = 0;
    const fps = 24; // Limit to 24fps for a cinematic feel and performance
    const interval = 1000 / fps;

    function animate(timestamp) {
        requestAnimationFrame(animate);

        const deltaTime = timestamp - lastTime;
        
        if (deltaTime > interval) {
            if (images.length > 0 && imagesLoaded > currentFrame) {
                drawImageToCanvas(images[currentFrame]);
                
                // Advance frame and loop back
                currentFrame = (currentFrame + 1) % frameCount;
            }
            
            // Adjust lastTime taking into account the excess time
            lastTime = timestamp - (deltaTime % interval);
        }
    }

    // Start animation loop
    requestAnimationFrame(animate);
}
