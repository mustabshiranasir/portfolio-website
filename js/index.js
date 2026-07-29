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

    // Apply saved theme immediately on load
    const savedTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

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

            // 1. Manage active sticky styles (bg & shadow)
            if (currentScrollY > 50) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }

            // 2. Collapse mobile menu drawer if open when scrolling
            const menuToggle = document.getElementById('navbarSupportedContent');
            if (menuToggle && menuToggle.classList.contains('show')) {
                if (window.bootstrap && window.bootstrap.Collapse) {
                    const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(menuToggle);
                    if (bsCollapse) bsCollapse.hide();
                } else {
                    menuToggle.classList.remove('show');
                    const toggler = document.querySelector('.navbar-toggler');
                    if (toggler) {
                        toggler.setAttribute('aria-expanded', 'false');
                        toggler.classList.add('collapsed');
                    }
                }
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

        // Scroll to top when clicking on the hamburger toggler button
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Close collapsed menu when nav link is clicked
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const menuToggle = document.getElementById('navbarSupportedContent');
        if (menuToggle) {
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (menuToggle.classList.contains('show')) {
                        if (window.bootstrap && window.bootstrap.Collapse) {
                            const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(menuToggle);
                            if (bsCollapse) {
                                bsCollapse.hide();
                            }
                        } else {
                            menuToggle.classList.remove('show');
                            const toggler = document.querySelector('.navbar-toggler');
                            if (toggler) {
                                toggler.setAttribute('aria-expanded', 'false');
                                toggler.classList.add('collapsed');
                            }
                        }
                    }
                });
            });
        }

        // Add button shatter click listener
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // If we are currently performing the shatter action, let the event pass through naturally
                if (this.dataset.shattering === 'true') {
                    return;
                }
                
                // If it is a submit button, validate form first before intercepting
                if (this.type === 'submit') {
                    const form = this.closest('form');
                    if (form && !form.checkValidity()) {
                        // Let the browser show validation tooltip naturally
                        return;
                    }
                }
                
                this.dataset.shattering = 'true';
                e.preventDefault();
                e.stopPropagation();
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
        const currentTransform = computedStyle.transform && computedStyle.transform !== 'none' ? computedStyle.transform : '';
        button.style.pointerEvents = 'none';
        button.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease';
        button.style.transform = `${currentTransform} scale(0.6)`;
        button.style.opacity = '0';
        
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
        let startTime = Date.now();
        let actionExecuted = false;
        
        function executeAction() {
            if (isSubmit) {
                // Trigger natural button click now that dataset.shattering is 'true'
                button.click();
            } else if (isLink) {
                const link = button.tagName === 'A' ? button : button.closest('a');
                // Trigger natural link click
                link.click();
            }
        }
        
        function animate() {
            const elapsed = Date.now() - startTime;
            
            // Trigger target redirection at the peak of the shatter (300ms)
            if (elapsed >= 300 && !actionExecuted) {
                actionExecuted = true;
                executeAction();
            }
            
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
                    button.style.transform = '';
                    button.style.opacity = '';
                    button.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                    
                    setTimeout(() => {
                        button.style.transition = '';
                        button.style.pointerEvents = '';
                    }, 400);
                }, 500);
            }
        }
        
        animate();
    }
})();
