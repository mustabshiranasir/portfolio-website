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
        }, 650);
    }

    // Apply saved theme immediately on load
    const savedTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(savedTheme);

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => toggleTheme(e));
        }
    });

    window.addEventListener('load', () => {
        updateParticlesTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });

    window.loadParticlesForTheme = updateParticlesTheme;
})();
