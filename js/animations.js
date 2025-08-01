const ANIMATION_CONFIG = {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// =====  CONTROLLER =====
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupTypingEffects();
        this.setupParticleSystem();
    }

    setupIntersectionObservers() {
        this.createObserver('.fade-in-on-scroll', 'fade-in');
        this.createObserver('.scale-in-on-scroll', 'scale-in');
        this.createObserver('.slide-in-left-on-scroll', 'slide-in-left');
        this.createObserver('.slide-in-right-on-scroll', 'slide-in-right');
        this.createObserver('.flip-in-x-on-scroll', 'flip-in-x');
        this.createObserver('.flip-in-y-on-scroll', 'flip-in-y');
        this.createObserver('.rotate-in-on-scroll', 'rotate-in');
        this.createObserver('.bounce-in-on-scroll', 'bounce-in');
        this.createObserver('.zoom-in-on-scroll', 'zoom-in');
    }

    createObserver(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target, animationClass);
                    this.animatedElements.add(entry.target);
                }
            });
        }, ANIMATION_CONFIG);

        elements.forEach(element => observer.observe(element));
        this.observers.set(selector, observer);
    }

    animateElement(element, animationClass) {
        element.classList.add(animationClass);
        
        const stagger = element.getAttribute('data-stagger');
        if (stagger) {
            element.style.animationDelay = `${stagger}ms`;
        }

        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }

    setupScrollAnimations() {
        this.setupParallaxScroll();
        
        this.setupStickyElements();
        
        this.setupProgressIndicators();
    }

    setupParallaxScroll() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupStickyElements() {
        const stickyElements = document.querySelectorAll('[data-sticky]');
        
        stickyElements.forEach(element => {
            const offset = element.getAttribute('data-sticky-offset') || 0;
            
            window.addEventListener('scroll', () => {
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                if (scrolled > offset) {
                    element.classList.add('sticky');
                } else {
                    element.classList.remove('sticky');
                }
            });
        });
    }

    setupProgressIndicators() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress') || 0;
            const fill = bar.querySelector('.progress-fill');
            
            if (fill) {
                setTimeout(() => {
                    fill.style.width = `${progress}%`;
                }, 500);
            }
        });
    }

    setupHoverEffects() {
        this.setupMagneticEffect();
        
        this.setupTiltEffect();
        
        this.setupGlowEffects();
    }

    setupMagneticEffect() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    setupGlowEffects() {
        const glowElements = document.querySelectorAll('[data-glow]');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow-active');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow-active');
            });
        });
    }

    setupParallaxEffects() {
        this.setupMouseParallax();
        
        this.setupBackgroundParallax();
    }

    setupMouseParallax() {
        const mouseParallaxElements = document.querySelectorAll('[data-mouse-parallax]');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            mouseParallaxElements.forEach(element => {
                const speed = element.getAttribute('data-mouse-parallax') || 1;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    setupBackgroundParallax() {
        const bgParallaxElements = document.querySelectorAll('[data-bg-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            bgParallaxElements.forEach(element => {
                const speed = element.getAttribute('data-bg-parallax') || 0.5;
                const yPos = scrolled * speed;
                element.style.backgroundPositionY = `${yPos}px`;
            });
        });
    }

    setupTypingEffects() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.getAttribute('data-typing');
            const speed = element.getAttribute('data-typing-speed') || 100;
            
            if (text) {
                this.typeText(element, text, speed);
            }
        });
    }

    typeText(element, text, speed) {
        let index = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                element.classList.add('typing-complete');
            }
        }, speed);
    }

    setupParticleSystem() {
        const particleContainers = document.querySelectorAll('[data-particles]');
        
        particleContainers.forEach(container => {
            const count = container.getAttribute('data-particles') || 20;
            this.createParticles(container, count);
        });
    }

    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(212, 168, 68, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: particleFloat ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
    }

        setupMorphingShapes() {
        const morphElements = document.querySelectorAll('[data-morph]');
        
        morphElements.forEach(element => {
            element.addEventListener('click', () => {
                element.classList.toggle('morphed');
            });
        });
    }

    setupWaveEffects() {
        const waveElements = document.querySelectorAll('[data-wave]');
        
        waveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createWave(e, element);
            });
        });
    }

    createWave(event, element) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        wave.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(212, 168, 68, 0.3);
            transform: translate(-50%, -50%);
            animation: waveExpand 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 600);
    }

        throttleScroll(callback) {
        let ticking = false;
        
        return function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    callback();
                    ticking = false;
                });
                ticking = true;
            }
        };
    }

    debounceResize(callback, delay = 250) {
        let timeoutId;
        
        return function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        };
    }

        getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    addAnimationStyles() {
        const styles = `
            @keyframes waveExpand {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
            
            .glow-active {
                box-shadow: 0 0 30px rgba(212, 168, 68, 0.6);
            }
            
            .typing-complete::after {
                animation: blink 1s infinite;
            }
            
            .morphed {
                border-radius: 50% !important;
                transform: rotate(180deg) scale(1.1);
            }
            
            .sticky {
                position: fixed;
                top: 0;
                z-index: 1000;
            }
            
            .progress-fill {
                transition: width 1s ease;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    animationController.addAnimationStyles();
    
    window.AnimationController = animationController;
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
} 