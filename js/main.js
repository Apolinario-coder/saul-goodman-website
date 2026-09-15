/**
 * SAUL GOODMAN - PARALLAX & ANIMATION ENGINE
 * Integrates Lenis Smooth Scroll, GSAP ScrollTrigger, Mouse Lerp Parallax & UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    const lenis = new Lenis({
        lerp: 0.07,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.7,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // MOUSE TRACKING WITH LERP
    // ============================================
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    const MOUSE_LERP = 0.06;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // ============================================
    // CURSOR GLOW (desktop only)
    // ============================================
    const cursorGlow = document.getElementById('cursorGlow');
    const isMobile = window.innerWidth < 768;

    if (!isMobile && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }, { passive: true });
    }

    // ============================================
    // FLOATING PARTICLES
    // ============================================
    if (!isMobile) {
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.width = (Math.random() * 2 + 1) + 'px';
                particle.style.height = particle.style.width;
                particle.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particle.style.animationDelay = (Math.random() * 15) + 's';
                particle.style.opacity = Math.random() * 0.3 + 0.05;
                particlesContainer.appendChild(particle);
            }
        }
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        scrollProgress.style.width = '100%';

        gsap.to(scrollProgress, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3,
            }
        });
    }

    // ============================================
    // CINEMATIC INTRO
    // ============================================
    const introOverlay = document.getElementById('introOverlay');
    const introLogo = document.getElementById('introLogo');

    if (introOverlay && introLogo) {
        const introTl = gsap.timeline();
        introTl
            .to(introLogo, { opacity: 1, scale: 1.05, duration: 1.2, ease: 'power2.out' })
            .to(introLogo, { opacity: 0, scale: 1.1, duration: 0.8, ease: 'power2.in' }, '+=0.8')
            .to(introOverlay, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    introOverlay.style.display = 'none';
                }
            }, '-=0.3');
    }

    // ============================================
    // HERO ENTRANCE ANIMATIONS
    // ============================================
    const heroTl = gsap.timeline({ delay: 2.8 });

    heroTl
        .fromTo('.title-wrapper img',
            { opacity: 0, y: 60, rotateX: 15 },
            { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power4.out' }
        )
        .fromTo('.subtitle',
            { opacity: 0, y: 20, letterSpacing: '20px' },
            { opacity: 1, y: 0, letterSpacing: '8px', duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        )
        .fromTo('#heroScrollIndicator',
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.4'
        );

    // ============================================
    // HERO PARALLAX ON SCROLL
    // ============================================
    gsap.to('.title-wrapper', {
        y: 200,
        opacity: 0,
        scale: 0.95,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    gsap.to('.subtitle', {
        y: 150,
        opacity: 0,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '80% top', scrub: 0.5 }
    });

    gsap.to('#heroScrollIndicator', {
        opacity: 0,
        y: 20,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true }
    });

    gsap.to('.vignette', {
        boxShadow: 'inset 0 0 400px rgba(0,0,0,1)',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // ============================================
    // MOUSE PARALLAX (RAF loop)
    // ============================================
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function animateParallax() {
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, MOUSE_LERP);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, MOUSE_LERP);

        parallaxElements.forEach(el => {
            const factor = parseFloat(el.getAttribute('data-parallax')) || 0;
            const moveX = smoothMouse.x * factor * 40;
            const moveY = smoothMouse.y * factor * 25;

            el.style.transform = `translate(${moveX}px, ${moveY}px) ${el.style.transform.replace(/translate\([^)]+\)\s*/g, '')}`;
        });

        requestAnimationFrame(animateParallax);
    }

    if (!isMobile) {
        requestAnimationFrame(animateParallax);
    }

    // ============================================
    // HERO 3D TILT ON MOUSE (desktop only)
    // ============================================
    if (!isMobile) {
        const titleWrapper = document.querySelector('.title-wrapper');
        function updateHeroTilt() {
            if (titleWrapper) {
                const rotateX = smoothMouse.y * 3;
                const rotateY = smoothMouse.x * 5;
                titleWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
            requestAnimationFrame(updateHeroTilt);
        }
        requestAnimationFrame(updateHeroTilt);
    }

    // ============================================
    // DUALITY (SPLIT-SCREEN) 3D DEPTH & PARALLAX
    // ============================================
    const dualityBg = document.getElementById('dualityBg');
    const dualityGlow = document.getElementById('dualityGlow');
    const dualitySection = document.getElementById('dualitySection');

    // 1. Scroll-driven 3D Zoom & Multi-plane Parallax
    if (dualityBg) {
        gsap.fromTo(dualityBg,
            { scale: 1.12, yPercent: -4 },
            {
                scale: 1.03,
                yPercent: 4,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.transition',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            }
        );
    }

    // 2. Continuous 3D Tilt on Mouse Move for Background Depth
    if (!isMobile && dualityBg && dualitySection) {
        function updateDuality3D() {
            // Calculate if section is in or near viewport
            const rect = dualitySection.getBoundingClientRect();
            if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
                // Smooth subtle 3D rotation + depth translation that preserves face visibility
                const rotX = smoothMouse.y * -3.5;
                const rotY = smoothMouse.x * 4.5;
                const transX = smoothMouse.x * 20;
                const transY = smoothMouse.y * 12;
                const transZ = 15; // Subtle 3D pop

                dualityBg.style.transform = `translate3d(${transX}px, ${transY}px, ${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;

                if (dualityGlow) {
                    const glowX = 50 + smoothMouse.x * 15;
                    const glowY = 50 - smoothMouse.y * 15;
                    dualityGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(201, 169, 97, 0.16) 0%, transparent 60%)`;
                }
            }
            requestAnimationFrame(updateDuality3D);
        }
        requestAnimationFrame(updateDuality3D);
    }

    // 3. Entrance & Differential Content Parallax
    gsap.fromTo('.split-left > div', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.transition', start: 'top 70%' }
        }
    );

    gsap.fromTo('.split-right > div',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.transition', start: 'top 70%' }
        }
    );

    gsap.to('.split-left > div', {
        y: -60,
        scrollTrigger: { trigger: '.transition', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });

    gsap.to('.split-right > div', {
        y: 60,
        scrollTrigger: { trigger: '.transition', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });

    // ============================================
    // SERVICES SECTION PARALLAX
    // ============================================
    gsap.utils.toArray('.service-row').forEach((row, i) => {
        gsap.to(row, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: row,
                start: 'top bottom-=100',
                end: 'top center',
                scrub: 1
            }
        });

        const number = row.querySelector('.service-number');
        if (number) {
            gsap.to(number, {
                y: -30 - (i * 10),
                scrollTrigger: {
                    trigger: row,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5
                }
            });
        }
    });

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
              scrollTrigger: { trigger: title, start: 'top 85%' }
            }
        );
    });

    gsap.utils.toArray('.section-subtitle').forEach(sub => {
        gsap.fromTo(sub,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: sub, start: 'top 85%' }
            }
        );
    });

    // ============================================
    // ABOUT / PHILOSOPHY SECTION
    // ============================================
    gsap.fromTo('.big-quote', 
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.big-quote', start: 'top 80%' }
        }
    );

    gsap.fromTo('.quote-author',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.quote-author', start: 'top 85%' }
        }
    );

    gsap.fromTo('.callout-box',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.callout-box', start: 'top 80%' }
        }
    );

    // ============================================
    // TIMELINE SECTION
    // ============================================
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const dot = item.querySelector('.timeline-dot');
        const content = item.querySelector('.timeline-content');
        const isOdd = i % 2 === 0;

        if (dot) {
            gsap.fromTo(dot,
                { scale: 0 },
                { scale: 1, duration: 0.5, ease: 'back.out(2)',
                  scrollTrigger: { trigger: item, start: 'top 75%' },
                  onStart: () => dot.classList.add('active')
                }
            );
        }

        if (content) {
            gsap.fromTo(content,
                { opacity: 0, x: isOdd ? -60 : 60, y: 20 },
                { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: item, start: 'top 75%' }
                }
            );

            gsap.to(content, {
                y: -(i % 3 + 1) * 15,
                scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
            });
        }
    });

    // ============================================
    // CONTACT SECTION
    // ============================================
    gsap.fromTo('.contact-title',
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.contact', start: 'top 70%' }
        }
    );

    gsap.fromTo('.phone-large',
        { opacity: 0, y: 40, letterSpacing: '15px' },
        { opacity: 1, y: 0, letterSpacing: '3px', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.phone-large', start: 'top 80%' }
        }
    );

    gsap.utils.toArray('.contact-info').forEach((info, i) => {
        gsap.fromTo(info,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
              scrollTrigger: { trigger: info, start: 'top 85%' }
            }
        );
    });

    gsap.fromTo('.final-quote',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: '.final-quote', start: 'top 85%' }
        }
    );

    // ============================================
    // NAVBAR & MOBILE MENU
    // ============================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            if (self.scroll() > 100) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        }
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    const target = document.querySelector(href);
                    if (target) {
                        lenis.scrollTo(target, { offset: -80 });
                    }
                }
            });
        });
    }

});
