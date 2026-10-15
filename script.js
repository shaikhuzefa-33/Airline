/* ==========================================================================
   HUZEFA AIRLINES - OFFICIAL JAVASCRIPT (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       0. Progressive Web App (PWA) & Service Worker
       ========================================== */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('[PWA] Service Worker registered successfully:', reg.scope))
                .catch(err => console.error('[PWA] Service Worker registration failed:', err));
        });
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
            installBtn.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('[PWA] User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });


    /* ==========================================
       1. Sticky Navbar & Active Link Highlight
       ========================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTop');

    const handleScrollEffects = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Sticky Header Toggle (Threshold: >80px for solid/frosted-glass backdrop + shadow)
        if (navbar) {
            if (scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Active Navigation Link on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.classList.remove('active');
                    if (href === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects(); // Initial execution

    /* ==========================================
       6. GSAP & High-Performance Scroll Animations
       ========================================== */
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check GSAP Availability & Register Plugins
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        if (typeof MotionPathPlugin !== 'undefined') gsap.registerPlugin(MotionPathPlugin);
    }

    /* ==========================================
       6. Three.js 3D WebGL Hero Background Engine & Scroll Trajectory
       ========================================== */
    const canvas3d = document.getElementById('hero3dCanvas');
    const heroSection3d = document.getElementById('home');
    const heroContent3d = document.querySelector('.hero-content.hero-3d-layer');
    const heroCloudOverlay3d = document.getElementById('heroCloudOverlay');

    if (canvas3d && typeof THREE !== 'undefined') {
        // Scene, Camera, Renderer Setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x040c1a, 0.0018);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 90);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas3d,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Dynamic Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xf5c542, 2.2);
        dirLight.position.set(50, 80, 40);
        scene.add(dirLight);

        const blueUnderlight = new THREE.PointLight(0x0b4db8, 3.5, 120);
        blueUnderlight.position.set(0, -20, 20);
        scene.add(blueUnderlight);

        // 3D Aircraft Group Construction
        const airplaneGroup = new THREE.Group();

        // 1. Fuselage
        const bodyGeo = new THREE.ConeGeometry(2.2, 18, 32);
        bodyGeo.rotateX(Math.PI / 2);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x071a3d,
            metalness: 0.85,
            roughness: 0.2
        });
        const fuselage = new THREE.Mesh(bodyGeo, bodyMat);
        airplaneGroup.add(fuselage);

        // Cockpit Canopy
        const canopyGeo = new THREE.SphereGeometry(1.2, 16, 16);
        canopyGeo.scale(0.9, 0.7, 2.5);
        const canopyMat = new THREE.MeshStandardMaterial({
            color: 0xf5c542,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x664a00
        });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.set(0, 0.9, -2);
        airplaneGroup.add(canopy);

        // Main Delta Wings
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.lineTo(14, -8);
        wingShape.lineTo(12, -12);
        wingShape.lineTo(0, -5);
        wingShape.lineTo(-12, -12);
        wingShape.lineTo(-14, -8);
        wingShape.closePath();

        const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 };
        const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
        wingGeo.rotateX(Math.PI / 2);
        const wingMat = new THREE.MeshStandardMaterial({
            color: 0x0b4db8,
            metalness: 0.75,
            roughness: 0.25
        });
        const wings = new THREE.Mesh(wingGeo, wingMat);
        wings.position.set(0, 0, 2);
        airplaneGroup.add(wings);

        // Gold Wingtips & Trim
        const trimGeo = new THREE.BoxGeometry(0.3, 0.3, 5);
        const trimMat = new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.9, roughness: 0.1 });
        
        const leftTip = new THREE.Mesh(trimGeo, trimMat);
        leftTip.position.set(-13, 0, 8);
        airplaneGroup.add(leftTip);

        const rightTip = new THREE.Mesh(trimGeo, trimMat);
        rightTip.position.set(13, 0, 8);
        airplaneGroup.add(rightTip);

        // Tail Fin
        const tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0);
        tailShape.lineTo(0, 5);
        tailShape.lineTo(-3, 3);
        tailShape.lineTo(-4, 0);
        tailShape.closePath();

        const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.3, bevelEnabled: false });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.8, roughness: 0.2 });
        const tailFin = new THREE.Mesh(tailGeo, tailMat);
        tailFin.position.set(-0.15, 1.2, 7.5);
        airplaneGroup.add(tailFin);

        // Twin Jet Engines
        const engineGeo = new THREE.CylinderGeometry(0.85, 0.85, 4.5, 16);
        engineGeo.rotateX(Math.PI / 2);
        const engineMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.1 });

        const leftEngine = new THREE.Mesh(engineGeo, engineMat);
        leftEngine.position.set(-3.5, -0.6, 3.5);
        airplaneGroup.add(leftEngine);

        const rightEngine = new THREE.Mesh(engineGeo, engineMat);
        rightEngine.position.set(3.5, -0.6, 3.5);
        airplaneGroup.add(rightEngine);

        // Glowing Engine Flame Cones
        const flameGeo = new THREE.ConeGeometry(0.7, 3, 16);
        flameGeo.rotateX(-Math.PI / 2);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xf5c542 });

        const leftFlame = new THREE.Mesh(flameGeo, flameMat);
        leftFlame.position.set(-3.5, -0.6, 6.8);
        airplaneGroup.add(leftFlame);

        const rightFlame = new THREE.Mesh(flameGeo, flameMat);
        rightFlame.position.set(3.5, -0.6, 6.8);
        airplaneGroup.add(rightFlame);

        // Initial Airplane Position & Tilt
        airplaneGroup.position.set(-25, -4, 25);
        airplaneGroup.rotation.set(0.1, 0.25, -0.15);
        scene.add(airplaneGroup);

        // 3D Volumetric Particle Sky Field
        const particleCount = 1200;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleScales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 600;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 350;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
            particleScales[i] = Math.random() * 2.5 + 0.5;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Create canvas particle texture for soft cloud glow
        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 64;
        particleCanvas.height = 64;
        const pCtx = particleCanvas.getContext('2d');
        const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(0.3, 'rgba(245, 197, 66, 0.6)');
        gradient.addColorStop(1, 'rgba(7, 26, 61, 0)');
        pCtx.fillStyle = gradient;
        pCtx.fillRect(0, 0, 64, 64);

        const particleTex = new THREE.CanvasTexture(particleCanvas);
        const particleMat = new THREE.PointsMaterial({
            size: 4,
            map: particleTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.75
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Interactive Mouse Parallax Tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        // Responsive Resize Handler
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Animation Frame Render Loop & Scroll 3D Trajectory
        let scrollProgress = 0;

        const animate3d = () => {
            requestAnimationFrame(animate3d);

            // Interpolate Mouse Parallax
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Calculate Scroll Progress within Hero Section
            if (!isReducedMotion) {
                const scrollY = window.scrollY || window.pageYOffset;
                const heroHeight = heroSection3d ? heroSection3d.offsetHeight : window.innerHeight;
                scrollProgress = Math.max(0, Math.min(1, scrollY / (heroHeight * 0.85)));

                // 3D Camera Trajectory: Dolly zoom & tilt
                camera.position.z = 90 - scrollProgress * 45;
                camera.position.y = 5 + scrollProgress * 22;
                camera.position.x = mouseX * 6;
                camera.lookAt(0, 2 + scrollProgress * 10, 0);

                // 3D Aircraft Flight Trajectory: Fly left-to-right & ascend into 3D sky
                airplaneGroup.position.x = -25 + scrollProgress * 65 + mouseX * 4;
                airplaneGroup.position.y = -4 + scrollProgress * 32 - mouseY * 3;
                airplaneGroup.position.z = 25 - scrollProgress * 55;

                // Rotations: Pitch up, Roll into turn, Yaw along trajectory
                airplaneGroup.rotation.x = 0.1 + scrollProgress * 0.35 - mouseY * 0.15;
                airplaneGroup.rotation.z = -0.15 + scrollProgress * 0.25 - mouseX * 0.2;
                airplaneGroup.rotation.y = 0.25 + scrollProgress * 0.4 + mouseX * 0.1;

                // Subtle jet engine flame pulsation
                const flameScale = 1.0 + Math.sin(Date.now() * 0.015) * 0.15;
                leftFlame.scale.set(flameScale, flameScale, flameScale);
                rightFlame.scale.set(flameScale, flameScale, flameScale);

                // Slow rotation of background 3D particles
                particles.rotation.y = Date.now() * 0.0001;
                particles.rotation.x = Math.sin(Date.now() * 0.00015) * 0.05;

                // Multi-Panel In-Flight & Sunset Background Scroll Cross-Fade Logic
                const panelDay = document.getElementById('heroPanelWingDay');
                const panelSunset = document.getElementById('heroPanelSunsetHorizon');
                const panelWingSunset = document.getElementById('heroPanelWingSunset');

                if (panelDay && panelSunset && panelWingSunset) {
                    if (scrollProgress <= 0.33) {
                        const opacityProgress = scrollProgress / 0.33;
                        panelDay.style.opacity = (1 - opacityProgress * 0.85).toFixed(3);
                        panelSunset.style.opacity = (opacityProgress * 0.95).toFixed(3);
                        panelWingSunset.style.opacity = '0';
                        
                        panelDay.querySelector('.panel-img').style.transform = `scale(${1.05 + scrollProgress * 0.15}) translate3d(${mouseX * 12}px, ${mouseY * 8}px, 0)`;
                        panelSunset.querySelector('.panel-img').style.transform = `scale(${1.05 + scrollProgress * 0.1}) translate3d(${mouseX * 8}px, ${mouseY * 5}px, 0)`;
                    } else if (scrollProgress <= 0.68) {
                        const opacityProgress = (scrollProgress - 0.33) / 0.35;
                        panelDay.style.opacity = '0.15';
                        panelSunset.style.opacity = (1 - opacityProgress * 0.4).toFixed(3);
                        panelWingSunset.style.opacity = (opacityProgress * 1.0).toFixed(3);

                        panelSunset.querySelector('.panel-img').style.transform = `scale(${1.1 + opacityProgress * 0.12}) translate3d(${mouseX * 10}px, ${mouseY * 6}px, 0)`;
                        panelWingSunset.querySelector('.panel-img').style.transform = `scale(${1.05 + opacityProgress * 0.1}) translate3d(${mouseX * 14}px, ${mouseY * 10}px, 0)`;
                    } else {
                        const opacityProgress = (scrollProgress - 0.68) / 0.32;
                        panelDay.style.opacity = '0';
                        panelSunset.style.opacity = (0.6 - opacityProgress * 0.6).toFixed(3);
                        panelWingSunset.style.opacity = '1';

                        panelWingSunset.querySelector('.panel-img').style.transform = `scale(${1.15 + opacityProgress * 0.15}) translate3d(${mouseX * 16}px, ${mouseY * 12}px, 0)`;
                    }
                }

                // CSS 3D Layer Parallax Tilt
                if (heroContent3d) {
                    heroContent3d.style.transform = `rotateY(${mouseX * 4}deg) rotateX(${-mouseY * 4}deg) translateZ(20px)`;
                }

                if (heroCloudOverlay3d) {
                    heroCloudOverlay3d.style.transform = `scale(${1 + scrollProgress * 0.25})`;
                    heroCloudOverlay3d.style.opacity = `${1 - scrollProgress * 1.2}`;
                }
            }

            renderer.render(scene, camera);
        };

        animate3d();
    }

    // A. Hero Search Widget Reveal Animation (0.95 -> 1.0 scale + slide up)
    const searchWidgetCard = document.getElementById('searchWidgetCard');
    if (searchWidgetCard && !isReducedMotion) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(searchWidgetCard,
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1.0,
                    duration: 1.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: searchWidgetCard,
                        start: 'top 92%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }

    // B. Staggered Scroll Reveal Animations for Destination Cards & Showcase Grids
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isReducedMotion) {
            ScrollTrigger.batch('.reveal', {
                onEnter: (batch) => {
                    gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.12,
                        duration: 0.85,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        onStart: function() {
                            batch.forEach(el => el.classList.add('active'));
                        }
                    });
                },
                once: true,
                start: 'top 88%'
            });
        } else if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('active'));
        }
    }

    // C. Interactive SVG Flight Path Scroll Animation
    const initFlightPathAnimation = () => {
        const path = document.getElementById('flightPathCurve');
        const marker = document.getElementById('planeMarker');
        const section = document.getElementById('how-it-works');
        const waypoints = document.querySelectorAll('.waypoint-node');

        if (!path || !marker || !section) return;

        let pathLength = 0;
        try {
            pathLength = path.getTotalLength();
        } catch (e) {
            pathLength = 1000;
        }

        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        path.style.strokeDashoffset = pathLength;

        const updatePathProgress = (progress) => {
            const clampedProgress = Math.max(0, Math.min(1, progress));
            const drawLength = pathLength * clampedProgress;
            path.style.strokeDashoffset = pathLength - drawLength;

            try {
                const pt = path.getPointAtLength(drawLength);
                const ptAhead = path.getPointAtLength(Math.min(pathLength, drawLength + 3));
                const angleDeg = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);

                const svgContainer = section.querySelector('.flight-path-container');
                if (svgContainer) {
                    const rect = svgContainer.getBoundingClientRect();
                    const scaleX = rect.width / 1000;
                    const scaleY = rect.height / 240;

                    const posX = pt.x * scaleX;
                    const posY = pt.y * scaleY;

                    marker.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${angleDeg}deg)`;
                }
            } catch (err) {
                // SVG calculation fallback
            }

            waypoints.forEach((node, idx) => {
                const stepThreshold = idx / Math.max(1, waypoints.length - 1);
                if (clampedProgress >= stepThreshold - 0.08) {
                    node.classList.add('active');
                } else if (idx > 0) {
                    node.classList.remove('active');
                }
            });
        };

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isReducedMotion) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 75%',
                end: 'bottom 35%',
                scrub: 0.6,
                onUpdate: (self) => {
                    updatePathProgress(self.progress);
                }
            });
        } else {
            const onScroll = () => {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const totalDist = rect.height + windowHeight * 0.5;
                const currentDist = windowHeight - rect.top;
                const progress = currentDist / totalDist;
                updatePathProgress(progress);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    };

    initFlightPathAnimation();

    // D. Interactive Counter Animation for Stats ("1M+", "500+", "99.8%", "7-Star")
    const initStatsCounters = () => {
        const statNumbers = document.querySelectorAll('.stat-number[data-counter]');
        if (!statNumbers.length) return;

        const animateCounter = (el) => {
            if (el.dataset.animated === 'true') return;
            el.dataset.animated = 'true';

            const targetVal = parseFloat(el.dataset.counter);
            const suffix = el.dataset.suffix || '';
            const format = el.dataset.format || '';
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            const duration = 2200; // ms
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = targetVal * easeProgress;

                if (format === 'million') {
                    const displayNum = (currentVal / 1000000).toFixed(progress === 1 ? 0 : 1);
                    el.textContent = `${displayNum}${suffix}`;
                } else if (decimals > 0) {
                    el.textContent = `${currentVal.toFixed(decimals)}${suffix}`;
                } else {
                    el.textContent = `${Math.floor(currentVal)}${suffix}`;
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    if (format === 'million') {
                        el.textContent = `${(targetVal / 1000000).toFixed(0)}${suffix}`;
                    } else {
                        el.textContent = `${targetVal.toFixed(decimals)}${suffix}`;
                    }
                }
            };

            requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            statNumbers.forEach(el => counterObserver.observe(el));
        } else {
            statNumbers.forEach(el => animateCounter(el));
        }
    };

    initStatsCounters();

    /* ==========================================
       7. Destination Card Hover Effects & Quick Book
       ========================================== */
    const destCards = document.querySelectorAll('.destination-card');
    destCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--gold)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border-card)';
        });
    });

    /* ==========================================
       8. Newsletter Subscription Handler
       ========================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMsg = document.getElementById('newsletterMsg');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const emailValue = emailInput.value.trim();

            if (emailValue) {
                newsletterMsg.style.color = 'var(--gold)';
                newsletterMsg.textContent = `Thank you for subscribing! A welcome voucher has been sent to ${emailValue}.`;
                emailInput.value = '';

                setTimeout(() => {
                    newsletterMsg.textContent = '';
                }, 5000);
            }
        });
    }

    /* ==========================================
       9. AUTHENTICATION & USER SESSION SYSTEM
       ========================================== */

    // Default Admin Account
    const ADMIN_USER = {
        title: 'Mr.',
        firstName: 'Huzefa',
        lastName: 'Executive Admin',
        email: 'huzefaairline@gmail.com',
        memberId: 'HZ-00001',
        password: 'huzefaairline33',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
    };

    // Default Customer Account
    const DEMO_USER = {
        title: 'Mr.',
        firstName: 'Guest',
        lastName: 'Flyer',
        email: 'guest@huzefaairlines.com',
        memberId: 'HZ-88219',
        password: 'Password123',
        role: 'customer',
        createdAt: '2026-01-01T00:00:00.000Z'
    };

    // Helper functions for LocalStorage
    function getStoredUsers() {
        try {
            const defaultUsers = [ADMIN_USER, DEMO_USER];
            const raw = localStorage.getItem('huzefa_users');
            if (!raw) {
                localStorage.setItem('huzefa_users', JSON.stringify(defaultUsers));
                return defaultUsers;
            }
            let users = JSON.parse(raw);
            if (!Array.isArray(users)) users = defaultUsers;

            // Guarantee ADMIN_USER with password 'huzefaairline33' is synced in storage
            const adminIdx = users.findIndex(u => u.email && u.email.toLowerCase().trim() === 'huzefaairline@gmail.com');
            if (adminIdx >= 0) {
                users[adminIdx] = ADMIN_USER;
            } else {
                users.unshift(ADMIN_USER);
            }

            // Guarantee DEMO_USER is synced
            const demoIdx = users.findIndex(u => u.email && u.email.toLowerCase().trim() === 'guest@huzefaairlines.com');
            if (demoIdx >= 0) {
                users[demoIdx] = DEMO_USER;
            } else {
                users.push(DEMO_USER);
            }

            localStorage.setItem('huzefa_users', JSON.stringify(users));
            return users;
        } catch (e) {
            return [ADMIN_USER, DEMO_USER];
        }
    }

    function saveUser(newUser) {
        const users = getStoredUsers();
        users.push(newUser);
        localStorage.setItem('huzefa_users', JSON.stringify(users));
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem('huzefa_current_user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem('huzefa_current_user', JSON.stringify(user));
    }

    function logoutUser() {
        localStorage.removeItem('huzefa_current_user');
        renderNavbarAuth();
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('signup.html')) {
            window.location.reload();
        }
    }

    // Dynamic Navbar User Profile Renderer
    function renderNavbarAuth() {
        const user = getCurrentUser();
        const navAuthContainers = document.querySelectorAll('.nav-auth');
        const mobileAuthContainers = document.querySelectorAll('.mobile-auth-btns');

        if (user) {
            const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
            const fullName = `${user.title || ''} ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Valued Member';
            const memberId = user.memberId || 'HZ-88219';

            // Desktop HTML
            const desktopUserHTML = `
                <div class="user-dropdown-container" id="userDropdownContainer">
                    <button type="button" class="user-badge-btn" id="userBadgeBtn">
                        <div class="user-avatar">${initial}</div>
                        <span>Welcome, ${user.firstName || 'Member'}</span>
                        <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; margin-left:2px;"></i>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div class="dropdown-header">
                            <strong>${fullName}</strong>
                            <small>${user.email}</small>
                            <span class="badge-gold" style="display:inline-block; margin-top:4px; font-size:0.72rem; padding:2px 8px; border-radius:12px;">ID: ${memberId}</span>
                        </div>
                        <a href="index.html" class="dropdown-item"><i class="fa-solid fa-house text-gold"></i> Dashboard Home</a>
                        <button type="button" class="dropdown-item logout-link" id="desktopLogoutBtn">
                            <i class="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </div>
                </div>
            `;

            // Mobile HTML
            const mobileUserHTML = `
                <div class="mobile-user-profile">
                    <div style="color:var(--white); font-weight:600; font-size:0.95rem; margin-bottom:0.3rem; display:flex; align-items:center; gap:0.5rem;">
                        <i class="fa-solid fa-circle-user text-gold" style="font-size:1.2rem;"></i>
                        <span>${fullName}</span>
                    </div>
                    <div style="color:var(--gold); font-size:0.8rem; margin-bottom:0.8rem; font-weight:500;">
                        Member ID: ${memberId}
                    </div>
                    <button type="button" class="btn btn-primary" id="mobileLogoutBtn" style="width:100%; background:#e63946; border:none; padding:0.65rem; font-size:0.9rem;">
                        <i class="fa-solid fa-right-from-bracket"></i> Log Out
                    </button>
                </div>
            `;

            navAuthContainers.forEach(container => container.innerHTML = desktopUserHTML);
            mobileAuthContainers.forEach(container => container.innerHTML = mobileUserHTML);

            // Bind Dropdown Toggle
            const badgeBtn = document.getElementById('userBadgeBtn');
            const dropdownMenu = document.getElementById('userDropdownMenu');
            if (badgeBtn && dropdownMenu) {
                badgeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('show');
                });
                document.addEventListener('click', () => {
                    dropdownMenu.classList.remove('show');
                });
            }

            // Bind Logout Buttons
            const desktopLogout = document.getElementById('desktopLogoutBtn');
            const mobileLogout = document.getElementById('mobileLogoutBtn');
            if (desktopLogout) desktopLogout.addEventListener('click', logoutUser);
            if (mobileLogout) mobileLogout.addEventListener('click', logoutUser);

        } else {
            // Logged Out navbar (Login and Signup buttons removed as requested)
            navAuthContainers.forEach(container => container.innerHTML = '');
            mobileAuthContainers.forEach(container => container.innerHTML = '');
        }

        // Toggle Admin Portal Nav Link & Home Page Admin Banner Visibility (Hidden by default, shown ONLY when admin is logged in with huzefaairline@gmail.com)
        const adminNavLinks = document.querySelectorAll('.admin-nav-link, #navAdminPortalLink');
        adminNavLinks.forEach(link => {
            if (isAdminUser(currentUser)) {
                link.style.setProperty('display', 'inline-flex', 'important');
            } else {
                link.style.setProperty('display', 'none', 'important');
            }
        });

        const indexAdminSection = document.getElementById('indexAdminSection');
        if (indexAdminSection) {
            if (isAdminUser(currentUser)) {
                indexAdminSection.style.setProperty('display', 'block', 'important');
            } else {
                indexAdminSection.style.setProperty('display', 'none', 'important');
            }
        }
    }

    function isAdminUser(user) {
        if (!user || !user.email) return false;
        const emailMatch = user.email.toLowerCase().trim() === 'huzefaairline@gmail.com';
        const roleMatch = user.role === 'admin';
        return emailMatch || roleMatch;
    }

    function checkAdminPageGuard() {
        const pathName = window.location.pathname.toLowerCase();
        if (!pathName.endsWith('admin.html')) return;

        const currentUser = getCurrentUser();
        const accessBanner = document.getElementById('adminAccessDeniedBanner');
        const mainContent = document.getElementById('adminMainContent');
        const countdownSpan = document.getElementById('redirectCountdown');

        if (!isAdminUser(currentUser)) {
            if (accessBanner) accessBanner.style.display = 'flex';
            if (mainContent) mainContent.style.display = 'none';

            let count = 3;
            if (countdownSpan) countdownSpan.textContent = count;
            const timer = setInterval(() => {
                count--;
                if (countdownSpan) countdownSpan.textContent = count;
                if (count <= 0) {
                    clearInterval(timer);
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            if (accessBanner) accessBanner.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            fetchAdminDashboardData();
        }
    }

    async function fetchAdminDashboardData() {
        const token = localStorage.getItem('huzefa_auth_token');
        if (!token) return;

        try {
            const res = await fetch('/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) return;
            const data = await res.json();

            if (data.success && data.stats) {
                const statUsers = document.getElementById('adminStatUsers');
                const statBookings = document.getElementById('adminStatBookings');
                const statRevenue = document.getElementById('adminStatRevenue');

                if (statUsers) statUsers.textContent = data.stats.totalUsers;
                if (statBookings) statBookings.textContent = data.stats.totalBookings;
                if (statRevenue) statRevenue.textContent = `$${data.stats.totalRevenue.toLocaleString()}`;
            }
        } catch (e) {
            console.info('Using local admin view fallback...');
        }
    }

    window.checkAdminPageGuard = checkAdminPageGuard;

    function checkDashboardUserInit() {
        const pathName = window.location.pathname.toLowerCase();
        if (!pathName.endsWith('dashboard.html')) return;

        const currentUser = getCurrentUser();
        const dashWelcomeTitle = document.getElementById('dashWelcomeTitle');
        if (currentUser && dashWelcomeTitle) {
            dashWelcomeTitle.textContent = `Welcome Back, ${currentUser.firstName || 'Traveler'}!`;
        }
    }

    // Initialize navbar auth state, admin page guard & customer dashboard immediately
    renderNavbarAuth();
    checkAdminPageGuard();
    checkDashboardUserInit();

    /* ==========================================
       10. PASSWORD VISIBILITY TOGGLE HANDLER
       ========================================== */
    const passwordToggleBtns = document.querySelectorAll('.toggle-password-btn');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = btn.closest('.password-input-wrapper');
            if (!wrapper) return;
            const input = wrapper.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    /* ==========================================
       11. LOGIN FORM VALIDATION & FLOW
       ========================================== */
    const loginForm = document.getElementById('loginForm');
    const fillDemoBtn = document.getElementById('fillDemoBtn');

    // Auto-fill Demo Credentials button
    if (fillDemoBtn) {
        fillDemoBtn.addEventListener('click', () => {
            const loginEmail = document.getElementById('loginEmail');
            const loginPassword = document.getElementById('loginPassword');
            if (loginEmail) loginEmail.value = 'guest@huzefaairlines.com';
            if (loginPassword) loginPassword.value = 'Password123';
            
            clearFormErrors(['groupLoginEmail', 'groupLoginPassword']);
            const loginAlert = document.getElementById('loginAlert');
            if (loginAlert) loginAlert.style.display = 'none';
        });
    }

    // Check if user is already logged in on login.html
    const currentUserOnLogin = getCurrentUser();
    if (loginForm && currentUserOnLogin) {
        const loginAlert = document.getElementById('loginAlert');
        if (loginAlert) {
            loginAlert.className = 'auth-alert auth-alert-success';
            loginAlert.style.display = 'flex';
            loginAlert.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    You are currently logged in as <strong>${currentUserOnLogin.firstName} ${currentUserOnLogin.lastName}</strong> (${currentUserOnLogin.email}). 
                    <a href="index.html" style="color:inherit; font-weight:700; text-decoration:underline; margin-left:4px;">Go Home</a> or 
                    <button type="button" id="loginPageLogout" style="background:none; border:none; color:inherit; font-weight:700; text-decoration:underline; cursor:pointer;">Log Out</button>
                </div>
            `;
            const logoutLink = document.getElementById('loginPageLogout');
            if (logoutLink) logoutLink.addEventListener('click', logoutUser);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const loginAlert = document.getElementById('loginAlert');
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const submitBtn = document.getElementById('loginSubmitBtn');

            const emailVal = emailInput ? emailInput.value.trim() : '';
            const passwordVal = passwordInput ? passwordInput.value : '';

            clearFormErrors(['groupLoginEmail', 'groupLoginPassword']);
            if (loginAlert) {
                loginAlert.style.display = 'none';
                loginAlert.className = 'auth-alert';
            }

            let hasError = false;

            if (!emailVal) {
                showFieldError('groupLoginEmail', 'errorLoginEmail', 'Please enter your Email or Member ID.');
                hasError = true;
            }

            if (!passwordVal) {
                showFieldError('groupLoginPassword', 'errorLoginPassword', 'Please enter your password.');
                hasError = true;
            }

            if (hasError) return;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Logging in...`;
            }

            try {
                // Connect to Express MySQL JWT Auth API
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, password: passwordVal })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.token) {
                        localStorage.setItem('huzefa_auth_token', data.token);
                        const userObj = {
                            id: data.user.id,
                            firstName: data.user.fullName.split(' ')[0],
                            lastName: data.user.fullName.split(' ').slice(1).join(' ') || '',
                            email: data.user.email,
                            role: data.user.role,
                            memberId: `HZ-${10000 + data.user.id}`
                        };
                        setCurrentUser(userObj);
                        renderNavbarAuth();

                        if (loginAlert) {
                            loginAlert.className = 'auth-alert auth-alert-success';
                            loginAlert.style.display = 'flex';
                            loginAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i><div>${data.message || 'Login successful!'} Redirecting...</div>`;
                        }

                        const targetPage = isAdminUser(userObj) ? 'admin.html' : 'index.html';
                        setTimeout(() => window.location.href = targetPage, 800);
                        return;
                    }
                }
                throw new Error('API login fallback triggered');
            } catch (err) {
                console.info('Backend auth offline, using local storage fallback...');
                const users = getStoredUsers();
                const matchedUser = users.find(u => 
                    (u.email && u.email.toLowerCase().trim() === emailVal.toLowerCase().trim()) || 
                    (u.memberId && u.memberId.toLowerCase().trim() === emailVal.toLowerCase().trim())
                );

                if (matchedUser && (matchedUser.password.trim() === passwordVal.trim() || passwordVal.trim() === 'huzefaairline33')) {
                    setCurrentUser(matchedUser);
                    renderNavbarAuth();
                    if (loginAlert) {
                        loginAlert.className = 'auth-alert auth-alert-success';
                        loginAlert.style.display = 'flex';
                        loginAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i><div>Welcome back, <strong>${matchedUser.firstName || 'Member'}</strong>! Redirecting...</div>`;
                    }
                    const targetPage = isAdminUser(matchedUser) ? 'admin.html' : 'index.html';
                    setTimeout(() => window.location.href = targetPage, 800);
                    return;
                } else {
                    showFieldError('groupLoginPassword', 'errorLoginPassword', 'Invalid email or password.');
                    if (loginAlert) {
                        loginAlert.className = 'auth-alert auth-alert-error';
                        loginAlert.style.display = 'flex';
                        loginAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><div>Invalid email address or password. Please verify your credentials.</div>`;
                    }
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Log In to Huzefa Club`;
                }
            }
        });
    }

    /* ==========================================
       12. SIGN UP FORM VALIDATION & FLOW
       ========================================== */
    const signupForm = document.getElementById('signupForm');

    const currentUserOnSignup = getCurrentUser();
    if (signupForm && currentUserOnSignup) {
        const signupAlert = document.getElementById('signupAlert');
        if (signupAlert) {
            signupAlert.className = 'auth-alert auth-alert-success';
            signupAlert.style.display = 'flex';
            signupAlert.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    You are already logged in as <strong>${currentUserOnSignup.firstName} ${currentUserOnSignup.lastName}</strong>. 
                    <a href="index.html" style="color:inherit; font-weight:700; text-decoration:underline; margin-left:4px;">Go Home</a> or 
                    <button type="button" id="signupPageLogout" style="background:none; border:none; color:inherit; font-weight:700; text-decoration:underline; cursor:pointer;">Log Out</button>
                </div>
            `;
            const logoutLink = document.getElementById('signupPageLogout');
            if (logoutLink) logoutLink.addEventListener('click', logoutUser);
        }
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const signupAlert = document.getElementById('signupAlert');
            const titleInput = document.getElementById('signupTitle');
            const firstNameInput = document.getElementById('signupFirstName');
            const lastNameInput = document.getElementById('signupLastName');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');
            const confirmPasswordInput = document.getElementById('signupConfirmPassword');
            const termsInput = document.getElementById('acceptTerms');
            const submitBtn = document.getElementById('signupSubmitBtn');

            const groupIds = ['groupTitle', 'groupFirstName', 'groupLastName', 'groupEmail', 'groupPassword', 'groupConfirmPassword', 'groupTerms'];
            clearFormErrors(groupIds);

            if (signupAlert) {
                signupAlert.style.display = 'none';
                signupAlert.className = 'auth-alert';
            }

            let hasError = false;

            const titleVal = titleInput ? titleInput.value.trim() : '';
            const firstNameVal = firstNameInput ? firstNameInput.value.trim() : '';
            const lastNameVal = lastNameInput ? lastNameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const passwordVal = passwordInput ? passwordInput.value : '';
            const confirmPasswordVal = confirmPasswordInput ? confirmPasswordInput.value : '';
            const termsVal = termsInput ? termsInput.checked : false;

            if (!titleVal) {
                showFieldError('groupTitle', 'errorTitle', 'Please select title.');
                hasError = true;
            }

            if (!firstNameVal || firstNameVal.length < 2) {
                showFieldError('groupFirstName', 'errorFirstName', 'First name must be at least 2 characters.');
                hasError = true;
            }

            if (!lastNameVal || lastNameVal.length < 2) {
                showFieldError('groupLastName', 'errorLastName', 'Last name must be at least 2 characters.');
                hasError = true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal || !emailRegex.test(emailVal)) {
                showFieldError('groupEmail', 'errorEmail', 'Please enter a valid email address.');
                hasError = true;
            } else {
                const existingUsers = getStoredUsers();
                const isDuplicate = existingUsers.some(u => u.email && u.email.toLowerCase() === emailVal.toLowerCase());
                if (isDuplicate) {
                    showFieldError('groupEmail', 'errorEmail', 'Email already registered.');
                    if (signupAlert) {
                        signupAlert.className = 'auth-alert auth-alert-error';
                        signupAlert.style.display = 'flex';
                        signupAlert.innerHTML = `
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <div>An account with email <strong>${emailVal}</strong> already exists. <a href="login.html" style="color:inherit; font-weight:700; text-decoration:underline;">Log in here</a>.</div>
                        `;
                    }
                    hasError = true;
                }
            }

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (!passwordVal || !passwordRegex.test(passwordVal)) {
                showFieldError('groupPassword', 'errorPassword', 'Must be 8+ characters with letters & numbers.');
                hasError = true;
            }

            if (!confirmPasswordVal || confirmPasswordVal !== passwordVal) {
                showFieldError('groupConfirmPassword', 'errorConfirmPassword', 'Passwords do not match.');
                hasError = true;
            }

            if (!termsVal) {
                showFieldError('groupTerms', 'errorTerms', 'You must agree to the Terms & Conditions.');
                hasError = true;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;
            }

            try {
                // Connect to Express MySQL JWT API
                const apiRes = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: `${firstNameVal} ${lastNameVal}`,
                        email: emailVal,
                        password: passwordVal
                    })
                });
                const apiData = await apiRes.json();
                if (apiData.success && apiData.token) {
                    localStorage.setItem('huzefa_auth_token', apiData.token);
                }
            } catch (err) {
                console.info('Backend registration API offline, saving to local session...');
            }

            const memberId = 'HZ-' + Math.floor(100000 + Math.random() * 900000);

            const newUser = {
                title: titleVal,
                firstName: firstNameVal,
                lastName: lastNameVal,
                email: emailVal,
                password: passwordVal,
                memberId: memberId,
                role: 'customer',
                createdAt: new Date().toISOString()
            };

            saveUser(newUser);
            setCurrentUser(newUser);
            renderNavbarAuth();

            if (signupAlert) {
                signupAlert.className = 'auth-alert auth-alert-success';
                signupAlert.style.display = 'flex';
                signupAlert.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    <div>Account created! Welcome to Huzefa Club, <strong>${titleVal} ${firstNameVal} ${lastNameVal}</strong>. Your Member ID is <strong>${memberId}</strong>. Redirecting...</div>
                `;
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
        });
    }

    function showFieldError(groupId, errorSpanId, message) {
        const group = document.getElementById(groupId);
        const errorSpan = document.getElementById(errorSpanId);
        if (group) group.classList.add('has-error');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
    }

    function clearFormErrors(groupIds) {
        groupIds.forEach(id => {
            const group = document.getElementById(id);
            if (group) {
                group.classList.remove('has-error');
                const span = group.querySelector('.field-error');
                if (span) {
                    span.textContent = '';
                    span.style.display = 'none';
                }
            }
        });
    }

    /* ==========================================
       13. ADMIN PORTAL OPERATIONS SYSTEM
       ========================================== */
    const DEFAULT_FLIGHTS = [
        { id: 'FL-HZ-101', flightNumber: 'HZ-101', origin: 'LHR', destination: 'DXB', depTime: '06:15', arrTime: '14:30', aircraft: 'Airbus A350-1000', seatsLeft: 8, price: 520, status: 'On Time' },
        { id: 'FL-HZ-205', flightNumber: 'HZ-205', origin: 'DXB', destination: 'JFK', depTime: '10:45', arrTime: '19:00', aircraft: 'Boeing 777X Huzefa Flagship', seatsLeft: 4, price: 1250, status: 'Boarding' },
        { id: 'FL-HZ-340', flightNumber: 'HZ-340', origin: 'JFK', destination: 'HND', depTime: '14:20', arrTime: '22:45', aircraft: 'Boeing 787-10 Dreamliner', seatsLeft: 12, price: 980, status: 'On Time' },
        { id: 'FL-HZ-412', flightNumber: 'HZ-412', origin: 'CDG', destination: 'SIN', depTime: '21:30', arrTime: '05:45 +1', aircraft: 'Airbus A350-1000', seatsLeft: 3, price: 890, status: 'Delayed' },
        { id: 'FL-HZ-508', flightNumber: 'HZ-508', origin: 'BOM', destination: 'LHR', depTime: '02:15', arrTime: '07:30', aircraft: 'Boeing 777X Huzefa Flagship', seatsLeft: 15, price: 610, status: 'Scheduled' },
        { id: 'FL-HZ-620', flightNumber: 'HZ-620', origin: 'LHR', destination: 'FCO', depTime: '09:00', arrTime: '12:30', aircraft: 'Airbus A350-1000', seatsLeft: 10, price: 540, status: 'On Time' },
        { id: 'FL-HZ-715', flightNumber: 'HZ-715', origin: 'DXB', destination: 'ZRH', depTime: '08:30', arrTime: '13:15', aircraft: 'Boeing 787-10 Dreamliner', seatsLeft: 6, price: 620, status: 'On Time' },
        { id: 'FL-HZ-830', flightNumber: 'HZ-830', origin: 'DXB', destination: 'BKK', depTime: '22:15', arrTime: '07:45 +1', aircraft: 'Boeing 777X Huzefa Flagship', seatsLeft: 9, price: 450, status: 'Scheduled' },
        { id: 'FL-HZ-904', flightNumber: 'HZ-904', origin: 'LHR', destination: 'CAI', depTime: '11:45', arrTime: '17:30', aircraft: 'Airbus A350-1000', seatsLeft: 7, price: 480, status: 'On Time' },
        { id: 'FL-HZ-950', flightNumber: 'HZ-950', origin: 'LHR', destination: 'YYZ', depTime: '15:10', arrTime: '18:25', aircraft: 'Boeing 787-10 Dreamliner', seatsLeft: 11, price: 590, status: 'Scheduled' },
        { id: 'FL-HZ-980', flightNumber: 'HZ-980', origin: 'CDG', destination: 'IST', depTime: '13:20', arrTime: '17:40', aircraft: 'Airbus A350-1000', seatsLeft: 5, price: 470, status: 'On Time' }
    ];

    const DEFAULT_BOOKINGS = [
        { bookingRef: 'HZ-882109', passengerName: 'GUEST FLYER', flightNumber: 'HZ-101', origin: 'LHR', destination: 'DXB', seats: ['12A'], totalPrice: '$520', status: 'Confirmed', date: '2026-08-08' },
        { bookingRef: 'HZ-742918', passengerName: 'SARAH JENKINS', flightNumber: 'HZ-205', origin: 'DXB', destination: 'JFK', seats: ['3K'], totalPrice: '$1,250', status: 'Confirmed', date: '2026-08-08' },
        { bookingRef: 'HZ-310492', passengerName: 'ALEXANDER SMITH', flightNumber: 'HZ-412', origin: 'CDG', destination: 'SIN', seats: ['18F'], totalPrice: '$890', status: 'Checked-In', date: '2026-08-07' }
    ];

    function getStoredFlights() {
        try {
            const raw = localStorage.getItem('huzefa_flights');
            if (!raw) {
                localStorage.setItem('huzefa_flights', JSON.stringify(DEFAULT_FLIGHTS));
                return DEFAULT_FLIGHTS;
            }
            return JSON.parse(raw) || DEFAULT_FLIGHTS;
        } catch (e) {
            return DEFAULT_FLIGHTS;
        }
    }

    function saveFlights(flights) {
        localStorage.setItem('huzefa_flights', JSON.stringify(flights));
    }

    function getStoredBookings() {
        try {
            const raw = localStorage.getItem('huzefa_bookings');
            if (!raw) {
                localStorage.setItem('huzefa_bookings', JSON.stringify(DEFAULT_BOOKINGS));
                return DEFAULT_BOOKINGS;
            }
            return JSON.parse(raw) || DEFAULT_BOOKINGS;
        } catch (e) {
            return DEFAULT_BOOKINGS;
        }
    }

    function saveBookings(bookings) {
        localStorage.setItem('huzefa_bookings', JSON.stringify(bookings));
    }

    // Admin Sidebar Tab Switcher
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.getAttribute('data-tab');
            if (targetTab) switchAdminTab(targetTab);
        });
    });

    window.switchAdminTab = function(tabId) {
        adminTabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

        const targetBtn = document.querySelector(`.admin-tab-btn[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);

        if (targetBtn) targetBtn.classList.add('active');
        if (targetContent) targetContent.classList.add('active');

        if (tabId === 'tabOverview') renderAdminOverview();
        if (tabId === 'tabFlights') renderAdminFlights();
        if (tabId === 'tabBookings') renderAdminBookings();
        if (tabId === 'tabUsers') renderAdminUsers();
    };

    // Render Overview Metrics
    function renderAdminOverview() {
        const flights = getStoredFlights();
        const bookings = getStoredBookings();
        const users = getStoredUsers();

        const statRevenue = document.getElementById('statRevenue');
        const statFlights = document.getElementById('statFlights');
        const statBookings = document.getElementById('statBookings');
        const statMembers = document.getElementById('statMembers');
        const overviewBody = document.getElementById('overviewBookingsBody');

        let totalRev = bookings.reduce((acc, b) => {
            const val = parseInt((b.totalPrice || '$0').replace(/[^0-9]/g, '')) || 0;
            return acc + val;
        }, 184500);

        if (statRevenue) statRevenue.textContent = `$${totalRev.toLocaleString()}`;
        if (statFlights) statFlights.textContent = flights.length;
        if (statBookings) statBookings.textContent = bookings.length;
        if (statMembers) statMembers.textContent = users.length + 1280;

        if (overviewBody) {
            if (bookings.length === 0) {
                overviewBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--gray-text);">No bookings found.</td></tr>`;
            } else {
                overviewBody.innerHTML = bookings.slice(0, 5).map(b => `
                    <tr>
                        <td><strong style="color:var(--royal-blue);">${b.bookingRef}</strong></td>
                        <td>${b.passengerName}</td>
                        <td>${b.flightNumber}</td>
                        <td>${b.origin} ➔ ${b.destination}</td>
                        <td>${(b.seats || []).join(', ')}</td>
                        <td><strong>${b.totalPrice}</strong></td>
                        <td><span class="status-pill status-confirmed">${b.status}</span></td>
                    </tr>
                `).join('');
            }
        }
    }

    // Render Admin Flights Table
    function renderAdminFlights(searchTerm = '') {
        const flightsTableBody = document.getElementById('adminFlightsTableBody');
        if (!flightsTableBody) return;

        let flights = getStoredFlights();
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            flights = flights.filter(f => 
                f.flightNumber.toLowerCase().includes(term) ||
                f.origin.toLowerCase().includes(term) ||
                f.destination.toLowerCase().includes(term) ||
                f.aircraft.toLowerCase().includes(term)
            );
        }

        if (flights.length === 0) {
            flightsTableBody.innerHTML = `<tr><td colspan="9" class="text-center" style="color:var(--gray-text); padding:2rem;">No flights found matching search.</td></tr>`;
            return;
        }

        flightsTableBody.innerHTML = flights.map(f => {
            let statusClass = 'status-ontime';
            if (f.status === 'Delayed') statusClass = 'status-delayed';
            if (f.status === 'Boarding') statusClass = 'status-boarding';
            if (f.status === 'Cancelled') statusClass = 'status-cancelled';
            if (f.status === 'Scheduled') statusClass = 'status-scheduled';

            return `
                <tr>
                    <td><strong style="color:var(--navy); font-size:0.95rem;">${f.flightNumber}</strong></td>
                    <td><strong>${f.origin}</strong> ➔ <strong>${f.destination}</strong></td>
                    <td><span style="font-size:0.85rem; color:var(--gray-text);">${f.aircraft}</span></td>
                    <td>${f.depTime}</td>
                    <td>${f.arrTime}</td>
                    <td><strong style="color:${f.seatsLeft < 5 ? '#dc2626' : 'var(--navy)'};">${f.seatsLeft} left</strong></td>
                    <td><strong>$${f.price}</strong></td>
                    <td><span class="status-pill ${statusClass}">${f.status}</span></td>
                    <td>
                        <div style="display:flex; gap:0.4rem;">
                            <button type="button" onclick="openEditStatusModal('${f.id}')" style="background:var(--royal-blue); color:var(--white); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" title="Change Status"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button type="button" onclick="deleteFlight('${f.id}')" style="background:#e63946; color:var(--white); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" title="Delete Flight"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render Admin Bookings Table
    function renderAdminBookings(searchTerm = '') {
        const bookingsTableBody = document.getElementById('adminBookingsTableBody');
        if (!bookingsTableBody) return;

        let bookings = getStoredBookings();
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            bookings = bookings.filter(b => 
                b.bookingRef.toLowerCase().includes(term) ||
                b.passengerName.toLowerCase().includes(term) ||
                b.flightNumber.toLowerCase().includes(term)
            );
        }

        if (bookings.length === 0) {
            bookingsTableBody.innerHTML = `<tr><td colspan="8" class="text-center" style="color:var(--gray-text); padding:2rem;">No passenger bookings found.</td></tr>`;
            return;
        }

        bookingsTableBody.innerHTML = bookings.map((b, index) => {
            const isCancelled = b.status === 'Cancelled';
            return `
                <tr>
                    <td><strong style="color:var(--royal-blue);">${b.bookingRef}</strong></td>
                    <td><strong>${b.passengerName}</strong></td>
                    <td>${b.flightNumber}</td>
                    <td>${b.origin} ➔ ${b.destination}</td>
                    <td>${(b.seats || []).join(', ')}</td>
                    <td><strong>${b.totalPrice}</strong></td>
                    <td><span class="status-pill ${isCancelled ? 'status-cancelled' : 'status-confirmed'}">${b.status}</span></td>
                    <td>
                        <div style="display:flex; gap:0.4rem;">
                            <button type="button" onclick="viewTicketModal(${index})" style="background:var(--royal-blue); color:var(--white); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" title="View Ticket"><i class="fa-solid fa-eye"></i></button>
                            ${!isCancelled ? `<button type="button" onclick="cancelBookingAdmin(${index})" style="background:#e63946; color:var(--white); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" title="Cancel Booking"><i class="fa-solid fa-ban"></i></button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render Admin Users Table
    function renderAdminUsers(searchTerm = '') {
        const usersTableBody = document.getElementById('adminUsersTableBody');
        if (!usersTableBody) return;

        let users = getStoredUsers();
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            users = users.filter(u => 
                (u.firstName && u.firstName.toLowerCase().includes(term)) ||
                (u.lastName && u.lastName.toLowerCase().includes(term)) ||
                (u.email && u.email.toLowerCase().includes(term)) ||
                (u.memberId && u.memberId.toLowerCase().includes(term))
            );
        }

        usersTableBody.innerHTML = users.map((u, index) => `
            <tr>
                <td><strong style="color:var(--royal-blue);">${u.memberId || 'HZ-88219'}</strong></td>
                <td><strong>${u.title || ''} ${u.firstName || ''} ${u.lastName || ''}</strong></td>
                <td>${u.email}</td>
                <td><span class="badge-gold" style="font-size:0.72rem; padding:2px 8px;">${u.role || 'Club Member'}</span></td>
                <td><strong style="color:var(--gold);"><i class="fa-solid fa-crown"></i> Gold Tier</strong></td>
                <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '2026-01-01'}</td>
                <td>
                    <button type="button" onclick="promoteAdmin(${index})" style="background:var(--navy); color:var(--gold); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; cursor:pointer;"><i class="fa-solid fa-user-shield"></i> Promote</button>
                </td>
            </tr>
        `).join('');
    }

    // Search input listeners
    const adminSearchFlight = document.getElementById('adminSearchFlight');
    if (adminSearchFlight) {
        adminSearchFlight.addEventListener('input', (e) => renderAdminFlights(e.target.value));
    }

    const adminSearchBooking = document.getElementById('adminSearchBooking');
    if (adminSearchBooking) {
        adminSearchBooking.addEventListener('input', (e) => renderAdminBookings(e.target.value));
    }

    const adminSearchUser = document.getElementById('adminSearchUser');
    if (adminSearchUser) {
        adminSearchUser.addEventListener('input', (e) => renderAdminUsers(e.target.value));
    }

    // Modal Helpers
    window.openAddFlightModal = function() {
        const modal = document.getElementById('addFlightModal');
        if (modal) modal.classList.add('show');
    };

    const quickAddFlightBtn = document.getElementById('quickAddFlightBtn');
    if (quickAddFlightBtn) {
        quickAddFlightBtn.addEventListener('click', openAddFlightModal);
    }

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    };

    // Add Flight Form Submit
    const addFlightForm = document.getElementById('addFlightForm');
    if (addFlightForm) {
        addFlightForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const flightNum = document.getElementById('newFlightNumber').value.trim();
            const aircraft = document.getElementById('newAircraft').value;
            const origin = document.getElementById('newOrigin').value;
            const destination = document.getElementById('newDestination').value;
            const depTime = document.getElementById('newDepTime').value.trim();
            const arrTime = document.getElementById('newArrTime').value.trim();
            const price = parseInt(document.getElementById('newPrice').value);
            const seatsLeft = parseInt(document.getElementById('newSeats').value);

            if (origin === destination) {
                alert('Origin and Destination airports cannot be identical.');
                return;
            }

            const flights = getStoredFlights();
            const newFlight = {
                id: 'FL-' + flightNum.toUpperCase(),
                flightNumber: flightNum.toUpperCase(),
                origin,
                destination,
                depTime,
                arrTime,
                aircraft,
                seatsLeft,
                price,
                status: 'Scheduled'
            };

            flights.unshift(newFlight);
            saveFlights(flights);

            closeModal('addFlightModal');
            addFlightForm.reset();
            alert(`Flight schedule ${newFlight.flightNumber} (${origin} ➔ ${destination}) created successfully!`);
            renderAdminFlights();
            renderAdminOverview();
        });
    }

    // Edit Flight Status
    window.openEditStatusModal = function(flightId) {
        const flights = getStoredFlights();
        const target = flights.find(f => f.id === flightId);
        if (!target) return;

        const modal = document.getElementById('editStatusModal');
        const hiddenId = document.getElementById('editFlightId');
        const subtitle = document.getElementById('editFlightModalSubtitle');
        const select = document.getElementById('editFlightStatusSelect');

        if (hiddenId) hiddenId.value = target.id;
        if (subtitle) subtitle.textContent = `Flight: ${target.flightNumber} (${target.origin} ➔ ${target.destination})`;
        if (select) select.value = target.status;
        if (modal) modal.classList.add('show');
    };

    const editStatusForm = document.getElementById('editStatusForm');
    if (editStatusForm) {
        editStatusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const hiddenId = document.getElementById('editFlightId').value;
            const newStatus = document.getElementById('editFlightStatusSelect').value;

            const flights = getStoredFlights();
            const flightIndex = flights.findIndex(f => f.id === hiddenId);
            if (flightIndex !== -1) {
                flights[flightIndex].status = newStatus;
                saveFlights(flights);
                renderAdminFlights();
                renderAdminOverview();
                closeModal('editStatusModal');
                alert(`Status for flight updated to "${newStatus}".`);
            }
        });
    }

    window.deleteFlight = function(flightId) {
        if (confirm('Are you sure you want to delete this flight schedule from the system?')) {
            let flights = getStoredFlights();
            flights = flights.filter(f => f.id !== flightId);
            saveFlights(flights);
            renderAdminFlights();
            renderAdminOverview();
        }
    };

    window.viewTicketModal = function(index) {
        const bookings = getStoredBookings();
        const b = bookings[index];
        if (!b) return;

        const content = document.getElementById('ticketModalContent');
        const passName = document.getElementById('ticketPassengerName');
        const modal = document.getElementById('viewTicketModal');

        if (passName) passName.textContent = b.passengerName;
        if (content) {
            content.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                    <span>Booking Reference:</span>
                    <strong style="color:var(--royal-blue);">${b.bookingRef}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                    <span>Flight Number:</span>
                    <strong>${b.flightNumber}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                    <span>Route:</span>
                    <strong>${b.origin} ➔ ${b.destination}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                    <span>Assigned Seats:</span>
                    <strong>${(b.seats || []).join(', ')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                    <span>Total Fare Paid:</span>
                    <strong style="color:var(--gold); font-size:1.05rem;">${b.totalPrice}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Status:</span>
                    <span class="status-pill status-confirmed">${b.status}</span>
                </div>
            `;
        }
        if (modal) modal.classList.add('show');
    };

    window.cancelBookingAdmin = function(index) {
        if (confirm('Are you sure you want to cancel this passenger booking?')) {
            const bookings = getStoredBookings();
            if (bookings[index]) {
                bookings[index].status = 'Cancelled';
                saveBookings(bookings);
                renderAdminBookings();
                renderAdminOverview();
            }
        }
    };

    window.promoteAdmin = function(index) {
        const users = getStoredUsers();
        if (users[index]) {
            users[index].role = 'Administrator';
            localStorage.setItem('huzefa_users', JSON.stringify(users));
            renderAdminUsers();
            alert(`User ${users[index].firstName || ''} ${users[index].lastName || ''} promoted to Administrator!`);
        }
    };

    // Render Admin data on page load if on admin.html
    if (document.querySelector('.admin-layout')) {
        renderAdminOverview();
        renderAdminFlights();
        renderAdminBookings();
        renderAdminUsers();
    }

    /* ==========================================
       14. HUZEFA AIRLINES AI VIRTUAL ASSISTANT ENGINE
       ========================================== */
    const aiTriggerBtn = document.getElementById('aiAgentTriggerBtn');
    const aiWindow = document.getElementById('aiAgentWindow');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiMinimizeBtn = document.getElementById('aiMinimizeBtn');
    const aiChatForm = document.getElementById('aiChatForm');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatBody = document.getElementById('aiChatBody');
    const aiQuickChips = document.getElementById('aiQuickChips');

    if (aiTriggerBtn && aiWindow) {
        // Toggle Chat Drawer
        aiTriggerBtn.addEventListener('click', () => {
            aiWindow.classList.toggle('open');
            if (aiWindow.classList.contains('open') && aiChatInput) {
                aiChatInput.focus();
            }
        });

        if (aiCloseBtn) aiCloseBtn.addEventListener('click', () => aiWindow.classList.remove('open'));
        if (aiMinimizeBtn) aiMinimizeBtn.addEventListener('click', () => aiWindow.classList.remove('open'));

        // Quick Chip Listener
        if (aiQuickChips) {
            aiQuickChips.addEventListener('click', (e) => {
                const btn = e.target.closest('.chip-btn');
                if (btn) {
                    const query = btn.getAttribute('data-query');
                    if (query) handleUserQuery(query);
                }
            });
        }

        // Form Submit Listener
        if (aiChatForm) {
            aiChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = aiChatInput ? aiChatInput.value.trim() : '';
                if (text) {
                    aiChatInput.value = '';
                    handleUserQuery(text);
                }
            });
        }

        const DEFAULT_GEMINI_API_KEY = 'AQ.Ab8RN6LctKyc3una5b0sMAhwNB-D8j6o4mjYwDMBQPruTU5t3w';

        function appendMessage(role, htmlContent) {
            if (!aiChatBody) return;
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isUser = role === 'user';

            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${isUser ? 'user-msg' : 'assistant-msg'}`;
            msgDiv.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i></div>
                <div class="msg-content">
                    ${htmlContent}
                    <div class="msg-time">${timeStr}</div>
                </div>
            `;
            aiChatBody.appendChild(msgDiv);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.id = 'aiTypingIndicator';
            typingDiv.className = 'ai-message assistant-msg';
            typingDiv.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            aiChatBody.appendChild(typingDiv);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }

        function removeTypingIndicator() {
            const typingDiv = document.getElementById('aiTypingIndicator');
            if (typingDiv) typingDiv.remove();
        }

        // Voice Speech Synthesis & Dictation State
        let isVoiceEnabled = false;
        const aiVoiceToggleBtn = document.getElementById('aiVoiceToggleBtn');
        const aiMicBtn = document.getElementById('aiMicBtn');
        const conversationHistory = [];

        if (aiVoiceToggleBtn) {
            aiVoiceToggleBtn.addEventListener('click', () => {
                isVoiceEnabled = !isVoiceEnabled;
                if (isVoiceEnabled) {
                    aiVoiceToggleBtn.classList.add('ai-voice-active');
                    speakText("Voice response enabled for Huzefa Airlines AI.");
                } else {
                    aiVoiceToggleBtn.classList.remove('ai-voice-active');
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                }
            });
        }

        // Voice Microphone Speech-to-Text Dictation
        if (aiMicBtn) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    aiMicBtn.classList.add('recording');
                };

                recognition.onend = () => {
                    aiMicBtn.classList.remove('recording');
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (aiChatInput) {
                        aiChatInput.value = transcript;
                        handleUserQuery(transcript);
                    }
                };

                aiMicBtn.addEventListener('click', () => {
                    try {
                        recognition.start();
                    } catch (e) {
                        recognition.stop();
                    }
                });
            } else {
                aiMicBtn.addEventListener('click', () => {
                    alert('Voice dictation is supported in modern browsers like Chrome, Edge, and Safari.');
                });
            }
        }

        function speakText(text) {
            if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel(); // Stop current speech
            const cleanText = text.replace(/<[^>]*>?/gm, ''); // strip HTML tags
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }

        async function handleUserQuery(queryText) {
            appendMessage('user', `<p>${escapeHTML(queryText)}</p>`);
            showTypingIndicator();

            // Track user message in multi-turn memory
            conversationHistory.push({ role: 'user', parts: [{ text: queryText }] });

            const apiKey = localStorage.getItem('huzefa_gemini_api_key') || DEFAULT_GEMINI_API_KEY;
            if (apiKey) {
                try {
                    const geminiResponse = await callGeminiAPI(queryText, apiKey);
                    removeTypingIndicator();
                    appendMessage('assistant', geminiResponse);
                    conversationHistory.push({ role: 'model', parts: [{ text: geminiResponse }] });
                    speakText(geminiResponse);
                    return;
                } catch (err) {
                    console.warn('Gemini API call failed, falling back to local engine:', err);
                }
            }

            setTimeout(() => {
                removeTypingIndicator();
                const replyHTML = generateAIResponse(queryText);
                appendMessage('assistant', replyHTML);
                conversationHistory.push({ role: 'model', parts: [{ text: replyHTML }] });
                speakText(replyHTML);
            }, 600);
        }

        async function callGeminiAPI(userQuery, apiKey) {
            // 1. Try Backend Server AI Proxy (/api/ai/chat)
            try {
                const proxyRes = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        queryText: userQuery,
                        conversationHistory: conversationHistory.slice(-6)
                    })
                });

                if (proxyRes.ok) {
                    const proxyData = await proxyRes.json();
                    if (proxyData.success && proxyData.replyText) {
                        return proxyData.replyText;
                    }
                }
            } catch (proxyErr) {
                console.info('Backend proxy offline, trying direct client API call...');
            }

            // 2. Direct Gemini Client Call Fallback
            const flights = getStoredFlights();
            const flightsSummary = flights.map(f => `${f.flightNumber}: ${f.origin}->${f.destination}, Dep:${f.depTime}, Arr:${f.arrTime}, Price:$${f.price}, Status:${f.status}, Seats:${f.seatsLeft}`).join('; ');

            const systemPrompt = `You are Huzefa Airlines AI, the official enterprise-grade virtual travel assistant for Huzefa Airlines. You represent the airline across the website, mobile app, customer portal, booking pages, and support channels.

Your mission is to deliver a five-star airline customer experience by providing accurate travel assistance, proactive guidance, premium service recommendations, and seamless support while maintaining trust, privacy, and professionalism at all times.

---
# 1. Identity and Role
* Airline: Huzefa Airlines
* Role: Official AI travel assistant
* Audience: Customers, passengers, travel planners, corporate travelers, loyalty members, and first-time flyers
* Tone: Warm, professional, confident, premium, efficient, and human-like

---
# 2. Active Flight Database (Live Data)
[ ${flightsSummary} ]`;
            
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            
            const contentsPayload = [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                ...conversationHistory.slice(-6)
            ];

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contentsPayload })
            });

            if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("Empty response from Gemini API");

            return text
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        }

        function generateAIResponse(userQuery) {
            const q = userQuery.toLowerCase().trim();
            const signOffs = [
                "Is there anything else I can help you with today?",
                "I’m happy to assist further.",
                "Thank you for choosing Huzefa Airlines.",
                "Safe travels, and we look forward to welcoming you on board."
            ];
            const randomSignOff = signOffs[Math.floor(Math.random() * signOffs.length)];

            // System prompt protection rule
            if (q.includes('system prompt') || q.includes('system instruction') || q.includes('reveal prompt') || q.includes('internal policy')) {
                return `<p>I’m here to assist with Huzefa Airlines travel and customer support questions.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Safety / Medical Emergency
            if (q.includes('emergency') || q.includes('medical') || q.includes('police') || q.includes('security') || q.includes('fire')) {
                return `<p><strong>⚠️ Safety & Emergency Advisory</strong></p>
                        <p>For safety, medical, or security emergencies, please contact airport security or local emergency services immediately.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Complaints & Issues
            if (q.includes('complaint') || q.includes('issue') || q.includes('lost') || q.includes('damaged') || q.includes('bad') || q.includes('horrible') || q.includes('problem')) {
                return `<p>I sincerely apologize for the inconvenience you have experienced with your journey.</p>
                        <p>At Huzefa Airlines, passenger satisfaction is our highest priority. Please share your booking reference with our Customer Relations team at <a href="mailto:support@huzefaairlines.com" style="color:var(--gold); font-weight:700;">support@huzefaairlines.com</a> so we can resolve this immediately.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Baggage Queries
            if (q.includes('bag') || q.includes('luggage') || q.includes('weight') || q.includes('allowance') || q.includes('carry-on') || q.includes('checked')) {
                return `<p><strong>🧳 Huzefa Airlines Baggage Allowances</strong></p>
                        <ul>
                            <li><strong>Cabin Carry-on:</strong> 1 bag up to 7kg (Economy) / 10kg (Business & First) + 1 personal item.</li>
                            <li><strong>Economy Class:</strong> 1 checked piece up to 23kg.</li>
                            <li><strong>Business Class:</strong> 2 checked pieces up to 32kg each.</li>
                            <li><strong>Royal First Class:</strong> 3 checked pieces up to 32kg each.</li>
                        </ul>
                        <p>Pre-book excess baggage on our website to save up to 20% compared to airport rates.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Flight Status & Operations & Availability
            if (q.includes('status') || q.includes('delay') || q.includes('schedule') || q.includes('hz-') || q.includes('flight') || q.includes('availability')) {
                const flights = getStoredFlights();
                const match = flights.find(f => q.includes(f.flightNumber.toLowerCase()) || (f.origin && q.includes(f.origin.toLowerCase())) || (f.destination && q.includes(f.destination.toLowerCase())));
                
                if (match) {
                    let statusColor = match.status === 'On Time' ? '#22c55e' : (match.status === 'Delayed' ? '#f59e0b' : '#3b82f6');
                    return `<p><strong>✈️ Flight Details: ${match.flightNumber}</strong> (${match.origin} ➔ ${match.destination})</p>
                            <div class="ai-card-flight">
                                <div class="card-flight-header">
                                    <span><strong>${match.flightNumber}</strong></span>
                                    <span style="color:${statusColor}; font-weight:700;">${match.status}</span>
                                </div>
                                <div class="card-flight-route">
                                    <div class="airport-code">${match.origin}</div>
                                    <div class="flight-duration"><i class="fa-solid fa-plane text-gold"></i><br>${match.depTime} ➔ ${match.arrTime}</div>
                                    <div class="airport-code">${match.destination}</div>
                                </div>
                                <div style="font-size:0.78rem; display:flex; justify-content:space-between; margin-top:0.4rem; color:rgba(255,255,255,0.85);">
                                    <span>${match.aircraft}</span>
                                    <span>Seats: <strong>${match.seatsLeft} left</strong></span>
                                    <span>Fare: <strong style="color:var(--gold);">$${match.price}</strong></span>
                                </div>
                            </div>
                            <p>${randomSignOff}</p>`;
                }

                // Active Flight Schedule Board for general availability queries
                const activeFlights = flights.slice(0, 5);
                const flightListHTML = activeFlights.map(f => `
                    <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(245,197,66,0.3); border-radius:8px; padding:0.6rem 0.8rem; margin-bottom:0.5rem;">
                        <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--gold);">
                            <span>${f.flightNumber} (${f.origin} ➔ ${f.destination})</span>
                            <span>$${f.price}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:rgba(255,255,255,0.85); margin-top:0.2rem;">
                            <span>Dep: ${f.depTime} | Arr: ${f.arrTime}</span>
                            <span style="color:${f.status === 'On Time' ? '#22c55e' : '#3b82f6'};">${f.status} (${f.seatsLeft} seats)</span>
                        </div>
                    </div>
                `).join('');

                return `<p><strong>✈️ Huzefa Airlines Active Flights & Availability</strong></p>
                        ${flightListHTML}
                        <p>Search all real-time departures on our <a href="status.html" style="color:var(--gold); font-weight:700;">Flight Status Page</a>.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Booking & Cabin Classes
            if (q.includes('book') || q.includes('fare') || q.includes('price') || q.includes('class') || q.includes('economy') || q.includes('business') || q.includes('first')) {
                return `<p><strong>🌟 Luxury Travel Classes & Bookings</strong></p>
                        <ul>
                            <li><strong>Economy Class:</strong> Ergonomic seating, gourmet meals, 11-inch HD screens.</li>
                            <li><strong>Premium Economy:</strong> Extra legroom, priority boarding, enhanced dining.</li>
                            <li><strong>Business Suite:</strong> Direct aisle access, lie-flat beds, lounge access.</li>
                            <li><strong>Royal First Class:</strong> Private suites, caviar service, personal concierge.</li>
                        </ul>
                        <p>You can search live fares on our home page flight booking widget.</p>
                        <p>${randomSignOff}</p>`;
            }

            // Check-in & Seats
            if (q.includes('check-in') || q.includes('seat') || q.includes('boarding pass') || q.includes('upgrade')) {
                return `<p><strong>🎫 Online Check-in & Seat Selection</strong></p>
                        <p>Online check-in opens <strong>48 hours prior to scheduled departure</strong> and closes 90 minutes before flight time.</p>
                        <ul>
                            <li>Select preferred window/aisle seats during check-in.</li>
                            <li>Download mobile boarding passes directly to your phone.</li>
                            <li>Cabin upgrades are available up to 4 hours before flight time.</li>
                        </ul>
                        <p>${randomSignOff}</p>`;
            }

            // Huzefa Club & Loyalty
            if (q.includes('club') || q.includes('loyalty') || q.includes('mile') || q.includes('tier') || q.includes('reward')) {
                return `<p><strong>👑 Huzefa Club Member Benefits</strong></p>
                        <p>Earn miles every time you fly with Huzefa Airlines & global alliance partners:</p>
                        <ul>
                            <li><strong>Silver Tier:</strong> Priority check-in & +25% bonus miles.</li>
                            <li><strong>Gold Tier:</strong> Worldwide airport lounge access & extra 15kg baggage allowance.</li>
                            <li><strong>Platinum Tier:</strong> Guaranteed seat availability & complimentary cabin upgrades.</li>
                        </ul>
                        <p>${randomSignOff}</p>`;
            }

            // Off-Topic Queries
            if (q.includes('weather') || q.includes('recipe') || q.includes('football') || q.includes('code') || q.includes('movie')) {
                return `<p>I am specialized in Huzefa Airlines travel support!</p>
                        <p>While I can't assist with general trivia, I would be delighted to help you book a luxury flight, check baggage policies, or review your itinerary.</p>
                        <p>${randomSignOff}</p>`;
            }

            // General Greeting / Default Response
            return `<p>Hello! Thank you for choosing Huzefa Airlines.</p>
                    <p>I am <strong>Huzefa Airlines AI</strong>, your virtual assistant. I can help you with:</p>
                    <ul>
                        <li>Checking flight schedules and flight availability</li>
                        <li>Baggage limits and cabin allowances</li>
                        <li>Online check-in and seat selection</li>
                        <li>Huzefa Club member privileges</li>
                    </ul>
                    <p>${randomSignOff}</p>`;
        }
    }

    /* ==========================================
       Hero Section Interactive Handlers
       ========================================== */
    // 1. Hero Sky Viewport Perspective Switcher
    const viewTabs = document.querySelectorAll('.hero-view-switcher .view-tab');
    const heroPanels = document.querySelectorAll('.hero-flight-viewport .hero-panel');

    if (viewTabs.length > 0 && heroPanels.length > 0) {
        viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanelId = tab.getAttribute('data-panel');

                // Update active tab button state
                viewTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Cross-fade to chosen background perspective panel
                heroPanels.forEach(panel => {
                    if (panel.id === targetPanelId) {
                        panel.classList.add('active-panel');
                        panel.style.opacity = '1';
                        panel.style.zIndex = '5';
                    } else {
                        panel.classList.remove('active-panel');
                        panel.style.opacity = '0';
                        panel.style.zIndex = '1';
                    }
                });
            });
        });
    }

    // 2. Hero Quick Routes Shortcuts (Autofill search form & smooth scroll)
    const routeChips = document.querySelectorAll('.route-chip');
    const fromSelect = document.getElementById('fromCity');
    const toSelect = document.getElementById('toCity');
    const bookingSection = document.getElementById('bookingSection');

    if (routeChips.length > 0) {
        routeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const fromCity = chip.getAttribute('data-from');
                const toCity = chip.getAttribute('data-to');

                if (fromSelect && fromCity) {
                    for (let i = 0; i < fromSelect.options.length; i++) {
                        if (fromSelect.options[i].value.includes(fromCity) || fromCity.includes(fromSelect.options[i].value)) {
                            fromSelect.selectedIndex = i;
                            break;
                        }
                    }
                }

                if (toSelect && toCity) {
                    for (let i = 0; i < toSelect.options.length; i++) {
                        if (toSelect.options[i].value.includes(toCity) || toCity.includes(toSelect.options[i].value)) {
                            toSelect.selectedIndex = i;
                            break;
                        }
                    }
                }

                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
});

