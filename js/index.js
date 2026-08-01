// Theme Management Script
(function () {
    const THEME_KEY = 'portfolio_theme';

    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || 'dark';
    }

    function getParticlesConfig(theme) {
        const isLight = theme === 'light';
        return {
            background: {
                color: {
                    value: isLight ? '#EBF3FA' : '#2C3E50'
                }
            },
            particles: {
                number: {
                    value: 55,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    // Elegant shades of grey combo matching the light theme slate typography & cards
                    value: isLight
                        ? ["#334155", "#475569", "#64748B", "#94A3B8"]
                        : ["#BDC3C7", "#7F8C8D", "#ECF0F1"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: isLight ? 0.65 : 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.25,
                        sync: false
                    }
                },
                size: {
                    value: 3.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: isLight ? "#64748B" : "#7F8C8D",
                    opacity: isLight ? 0.45 : 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    },
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: {
                        enable: true,
                        mode: "grab"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 180,
                        links: {
                            opacity: 1
                        }
                    },
                    push: {
                        quantity: 4
                    }
                }
            },
            retina_detect: true
        };
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleIcon(theme);
        updateParticlesTheme(theme);
    }

    function updateToggleIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        if (theme === 'light') {
            toggleBtn.setAttribute('title', 'Switch to Dark Mode');
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        } else {
            toggleBtn.setAttribute('title', 'Switch to Light Mode');
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        }
    }

    function updateParticlesTheme(theme) {
        if (typeof tsParticles === 'undefined') return;
        try {
            const config = getParticlesConfig(theme);
            tsParticles.load("tsparticles", config);
        } catch (e) {
            console.log('Particles theme reload error', e);
        }
    }

    function toggleTheme(e) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        const toggleBtn = document.getElementById('theme-toggle');
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && (e.clientX !== 0 || e.clientY !== 0)) {
            x = e.clientX;
            y = e.clientY;
        } else if (toggleBtn) {
            const rect = toggleBtn.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        const maxDist = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );
        const burstSize = maxDist * 2.2;
        const burstBgColor = newTheme === 'light' ? '#EBF3FA' : '#2C3E50';

        const burst = document.createElement('div');
        burst.className = 'theme-burst-overlay';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.style.width = `${burstSize}px`;
        burst.style.height = `${burstSize}px`;
        burst.style.backgroundColor = burstBgColor;

        document.body.appendChild(burst);

        setTimeout(() => {
            localStorage.setItem(THEME_KEY, newTheme);
            applyTheme(newTheme);
        }, 220);

        setTimeout(() => {
            if (burst && burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 1200);
    }

    const savedTheme = getSavedTheme();

    // Scroll to top button functionality
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (!scrollTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic navbar scroll visibility & sticky class toggling
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Manage active sticky styles (bg & shadow)
            if (currentScrollY > 50) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(savedTheme);
        initScrollToTop();
        initNavbarScroll();

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => toggleTheme(e));
        }

        // Close offcanvas drawer when nav link is clicked
        function closeDrawer() {
            const offcanvasEl = document.getElementById('offcanvasNavbar');
            if (!offcanvasEl || !offcanvasEl.classList.contains('show')) return;
            if (window.bootstrap && window.bootstrap.Offcanvas) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
                if (bsOffcanvas) bsOffcanvas.hide();
            } else {
                offcanvasEl.classList.remove('show');
            }
        }

        // Close drawer when nav link is clicked — smooth scroll handles navigation
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', function () {
                this.classList.add('glass-click');
                setTimeout(() => this.classList.remove('glass-click'), 400);
                closeDrawer();
            });
        });

        // Glass click effect on hero section buttons
        document.querySelectorAll('.btn-flip-wrapper .btn').forEach(btn => {
            btn.addEventListener('click', function () {
                this.classList.add('glass-click');
                setTimeout(() => this.classList.remove('glass-click'), 400);
            });
        });

        // Experience & Education timeline scroll-progress lines
        document.querySelectorAll('.experience-timeline').forEach(timelineTrack => {
            const timelineFill = timelineTrack.querySelector('.timeline-line-fill');
            const timelineDots = timelineTrack.querySelectorAll('.timeline-center-dot');
            if (!timelineFill || timelineDots.length === 0) return;
            let ticking = false;
            const filledDots = new Set();

            const positionDots = () => {
                const trackRect = timelineTrack.getBoundingClientRect();
                timelineDots.forEach(dot => {
                    const card = dot.parentElement.querySelector('.flip-card');
                    if (!card) return;
                    const cardRect = card.getBoundingClientRect();
                    dot.style.top = (cardRect.top - trackRect.top + cardRect.height / 2) + 'px';
                });
            };

            const updateTimeline = () => {
                ticking = false;
                const vh = window.innerHeight || document.documentElement.clientHeight;
                const rect = timelineTrack.getBoundingClientRect();
                const progress = (vh * 0.5 - rect.top) / rect.height;
                const p = Math.min(1, Math.max(0, progress));
                timelineFill.style.height = (p * 100) + '%';
                positionDots();

                const centerY = vh * 0.5;
                timelineDots.forEach(dot => {
                    if (filledDots.has(dot)) return;
                    if (dot.getBoundingClientRect().top <= centerY) {
                        dot.classList.add('filled');
                        filledDots.add(dot);
                    }
                });
            };

            const onScroll = () => {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(updateTimeline);
                }
            };

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            updateTimeline();
        });

        // GSAP infinite marquee for the info stats strip
        const marqueeTrack = document.querySelector('.info-grid-track');
        if (marqueeTrack && window.gsap) {
            const firstSet = marqueeTrack.querySelector('.info-set');
            const marqueeStrip = marqueeTrack.closest('.info-grid-strip');
            let marqueeTween = null;
            let loopWidth = 0;

            const buildMarquee = () => {
                const width = firstSet ? firstSet.offsetWidth : marqueeTrack.scrollWidth / 2;
                if (width <= 0) return;

                let startX = 0;
                if (marqueeTween) {
                    startX = loopWidth ? gsap.getProperty(marqueeTrack, 'x') % loopWidth : 0;
                    marqueeTween.kill();
                    marqueeTween = null;
                }

                loopWidth = width;
                gsap.set(marqueeTrack, { x: startX });
                marqueeTween = gsap.to(marqueeTrack, {
                    x: startX - loopWidth,
                    duration: loopWidth / 60,
                    ease: 'none',
                    repeat: -1,
                    modifiers: {
                        x: gsap.utils.unitize(x => parseFloat(x) % loopWidth)
                    }
                });
            };

            buildMarquee();

            if (marqueeStrip) {
                marqueeStrip.addEventListener('mouseenter', () => {
                    if (marqueeTween) gsap.to(marqueeTween, { timeScale: 0.3, duration: 0.5, ease: 'power2.out', overwrite: true });
                });
                marqueeStrip.addEventListener('mouseleave', () => {
                    if (marqueeTween) gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
                });
            }

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(buildMarquee, 150);
            });

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => setTimeout(buildMarquee, 100));
            }
            window.addEventListener('load', () => setTimeout(buildMarquee, 100));
        }

        // Add button shatter click listener (excluding scroll-top-btn, navbar-toggler, and btn-close-custom)
        const buttons = document.querySelectorAll('.btn:not(.scroll-top-btn):not(.navbar-toggler):not(.btn-close-custom), .skills-tabs .nav-link');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Skip if already shattering or if button is inside a form with validation
                if (this.dataset.shattering === 'true') {
                    return;
                }
                if (this.type === 'submit') {
                    const form = this.closest('form');
                    if (form && !form.checkValidity()) {
                        return;
                    }
                }
                // Fire shatter effect without blocking navigation
                shatterButton(this, e);
            });
        });
    });

    window.addEventListener('load', () => {
        updateParticlesTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });

    window.loadParticlesForTheme = updateParticlesTheme;

    // Contact Form Validation & Feedback Handler
    window.sendMail = function (event) {
        if (event) event.preventDefault();
        const nameEl = document.getElementById('contactName');
        const emailEl = document.getElementById('contactEmail');
        const subjectEl = document.getElementById('contactSubject');
        const messageEl = document.getElementById('contactMessage');
        const alertEl = document.getElementById('formAlert');

        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const subject = subjectEl ? subjectEl.value.trim() : '';
        const message = messageEl ? messageEl.value.trim() : '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !message) {
            if (alertEl) {
                alertEl.className = 'alert alert-danger mb-3';
                alertEl.textContent = 'Please fill out all required fields before submitting.';
            }
            return;
        }

        if (!emailRegex.test(email)) {
            if (alertEl) {
                alertEl.className = 'alert alert-danger mb-3';
                alertEl.textContent = 'Please enter a valid email address.';
            }
            return;
        }

        if (alertEl) {
            alertEl.className = 'alert alert-success mb-3';
            alertEl.textContent = 'Thank you! Opening Gmail to compose the message...';
        }

        setTimeout(() => {
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=fa23-bcs-063@cuiatk.edu.pk&su=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
            window.open(gmailLink, '_blank');
        }, 800);
    };

    function shatterButton(button, e) {
        const isLink = button.tagName === 'A' || button.closest('a');
        const isSubmit = button.type === 'submit';
        
        // Mark as shattering to prevent re-entry, but don't prevent default navigation
        button.dataset.shattering = 'true';
        setTimeout(() => { delete button.dataset.shattering; }, 600);

        const rect = button.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(button);
        const bgColor = computedStyle.backgroundColor;
        const borderColor = computedStyle.borderColor;
        const textColor = computedStyle.color;
        
        // Build a palette of colors for the particles
        const colors = [];
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            colors.push(bgColor);
        }
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
            colors.push(borderColor);
        }
        if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
            colors.push(textColor);
        }
        if (colors.length === 0) {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            colors.push(isLight ? '#0f172a' : '#ecf0f1');
        }
        
        // Create full-screen Canvas overlay
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999999';
        document.body.appendChild(canvas);
        
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Smoothly shrink and fade the button, maintaining any 3D hover rotation
        // (skip for tab nav-links so active state stays visible immediately)
        if (!button.classList.contains('nav-link')) {
            const currentTransform = computedStyle.transform && computedStyle.transform !== 'none' ? computedStyle.transform : '';
            button.style.pointerEvents = 'none';
            button.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease';
            button.style.transform = `${currentTransform} scale(0.6)`;
            button.style.opacity = '0';
        }
        
        // Generate particles
        const particles = [];
        const particleCount = 120;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const px = rect.left + Math.random() * rect.width;
            const py = rect.top + Math.random() * rect.height;
            const size = Math.random() * 5 + 2.5; // Tiny square sizes (2.5px to 7.5px)
            
            const angle = Math.atan2(py - centerY, px - centerX) + (Math.random() - 0.5) * 0.6;
            const speed = Math.random() * 5.5 + 2.5;
            
            const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5;
            const vy = Math.sin(angle) * speed - (Math.random() * 4 + 2); // Initial upward boost
            
            particles.push({
                x: px,
                y: py,
                vx: vx,
                vy: vy,
                size: size,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                vRotation: (Math.random() - 0.5) * 0.25,
                gravity: 0.22,
                friction: 0.965,
                alpha: 1.0,
                fadeSpeed: Math.random() * 0.015 + 0.012
            });
        }
        
        let animationFrameId;
        
        function animate() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            
            let alive = false;
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha <= 0) continue;
                
                alive = true;
                
                // Physics updates
                p.vx *= p.friction;
                p.vy = p.vy * p.friction + p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRotation;
                p.alpha -= p.fadeSpeed;
                
                if (p.alpha < 0) p.alpha = 0;
                
                // Draw square particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
            
            if (alive) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                // Cleanup canvas
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
                cancelAnimationFrame(animationFrameId);
                
                // Gracefully fade the button back into view after completion
                setTimeout(() => {
                    delete button.dataset.shattering; // reset state to allow click next time
                    if (!button.classList.contains('nav-link')) {
                        button.style.transform = '';
                        button.style.opacity = '';
                        button.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                        
                        setTimeout(() => {
                            button.style.transition = '';
                            button.style.pointerEvents = '';
                        }, 400);
                    }
                }, 500);
            }
        }
        
        animate();
    }

    // Swipe / drag / trackpad to switch skill tabs
    const skillTabContent = document.querySelector('#skills .tab-content');
    if (skillTabContent) {
        function switchTab(diff) {
            if (Math.abs(diff) < 50) return;
            const tabs = document.querySelectorAll('.skills-tabs .nav-link');
            const active = document.querySelector('.skills-tabs .nav-link.active');
            const idx = Array.from(tabs).indexOf(active);
            if (diff > 0 && idx < tabs.length - 1) {
                skillTabContent.dataset.slideDir = 'next';
                tabs[idx + 1].click();
            } else if (diff < 0 && idx > 0) {
                skillTabContent.dataset.slideDir = 'prev';
                tabs[idx - 1].click();
            }
        }

        // Touch swipe (mobile)
        let touchStartX = 0;
        skillTabContent.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        skillTabContent.addEventListener('touchend', e => {
            switchTab(touchStartX - e.changedTouches[0].screenX);
        }, { passive: true });

        // Mouse drag (desktop)
        let mouseStartX = 0;
        let isMouseDown = false;
        skillTabContent.addEventListener('mousedown', e => {
            isMouseDown = true;
            mouseStartX = e.screenX;
        });
        skillTabContent.addEventListener('mouseup', e => {
            if (!isMouseDown) return;
            isMouseDown = false;
            switchTab(mouseStartX - e.screenX);
        });
        skillTabContent.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        skillTabContent.addEventListener('dragstart', e => e.preventDefault());

        // Two-finger trackpad swipe (desktop) — debounced to avoid multi-fire
        let lastWheelTime = 0;
        skillTabContent.addEventListener('wheel', e => {
            if (Math.abs(e.deltaX) < 30) return;
            const now = Date.now();
            if (now - lastWheelTime < 500) return;
            lastWheelTime = now;
            e.preventDefault();
            switchTab(e.deltaX);
        }, { passive: false });
    }

    // Apply slide direction on tab switch
    document.querySelectorAll('.skills-tabs .nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', e => {
            const targetId = e.target.getAttribute('data-bs-target');
            if (!targetId) return;
            const pane = document.querySelector(targetId);
            if (!pane) return;
            const dir = skillTabContent?.dataset.slideDir === 'prev' ? 'left' : 'right';
            pane.classList.add('slide-in-' + dir);
            setTimeout(() => {
                pane.classList.remove('slide-in-right', 'slide-in-left');
                if (skillTabContent) delete skillTabContent.dataset.slideDir;
            }, 450);
        });
});
    // Flip cards: tap-to-flip on touch devices (links still clickable)
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a, button')) return;
                card.classList.toggle('is-flipped');
            });
        });
    }

    // Also handle flip on non-touch for accessibility
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('is-flipped');
            }
        });
    });
})();
