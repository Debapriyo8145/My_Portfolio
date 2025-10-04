// Portfolio Navigation System
class PortfolioNav {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navItems = document.querySelectorAll('.nav-item');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileClose = document.querySelector('.mobile-close');
        this.mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        this.themeToggles = document.querySelectorAll('.theme-checkbox');
        this.ctaButtons = document.querySelectorAll('.cta-btn, .hero-cta');
        
        this.init();
    }

    init() {
        // Initialize all components
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupAnimations();
        this.setupInteractions();
        
        // Handle initial load
        this.handleScroll();
    }

    setupTheme() {
        // Load saved theme or use system preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            // Sync all theme toggles
            this.themeToggles.forEach(toggle => {
                toggle.checked = true;
            });
        }

        // Theme toggle event for all toggles
        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const isDark = e.target.checked;
                document.body.classList.toggle('dark-mode', isDark);
                localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
                
                // Sync all other toggles
                this.themeToggles.forEach(otherToggle => {
                    if (otherToggle !== e.target) {
                        otherToggle.checked = isDark;
                    }
                });
                
                this.animateThemeChange();
            });
        });
    }

    animateThemeChange() {
        document.body.style.transition = 'none';
        document.body.style.opacity = '0.8';
        
        setTimeout(() => {
            document.body.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.opacity = '1';
        }, 50);
    }

    setupNavigation() {
        // Nav item click handlers
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveNavItem(item);
                this.animateNavClick(item);
                
                // Get target section and scroll to it
                const targetId = item.getAttribute('href');
                this.scrollToSection(targetId);
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });

            // Hover effects
            item.addEventListener('mouseenter', () => {
                this.animateNavHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.animateNavHover(item, false);
            });
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    scrollToSection(targetId) {
        if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    setActiveNavItem(activeItem) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    animateNavClick(item) {
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: var(--accent);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = item.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateNavHover(item, isHover) {
        if (isHover) {
            item.style.transform = 'translateY(-2px)';
        } else {
            item.style.transform = 'translateY(0)';
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.navbar.style.background = 'var(--surface)';
            this.navbar.style.backdropFilter = 'blur(20px)';
            this.navbar.style.boxShadow = 'var(--shadow)';
        } else {
            this.navbar.style.background = 'var(--surface)';
            this.navbar.style.backdropFilter = 'blur(20px)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    setupMobileMenu() {
        if (!this.mobileToggle || !this.mobileMenu || !this.mobileClose) {
            return;
        }

        // Mobile toggle click event
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close button click event
        this.mobileClose.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Mobile nav items click events
        this.mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveMobileItem(item);
                
                // Get target section and scroll to it
                const targetId = item.getAttribute('href');
                this.scrollToSection(targetId);
                
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.add('active');
        this.mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate mobile menu items
        this.animateMobileMenuItems();
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset mobile menu items animation
        this.mobileNavItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
        });
    }

    animateMobileMenuItems() {
        this.mobileNavItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    setActiveMobileItem(activeItem) {
        this.mobileNavItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
        
        // Also update desktop nav items
        const targetId = activeItem.getAttribute('href');
        const correspondingNavItem = document.querySelector(`.nav-item[href="${targetId}"]`);
        if (correspondingNavItem) {
            this.setActiveNavItem(correspondingNavItem);
        }
    }

    setupAnimations() {
        // Logo animation on load
        const logoDots = document.querySelectorAll('.logo-dot');
        logoDots.forEach((dot, index) => {
            dot.style.animation = `bounce 0.6s ease ${index * 0.1}s`;
        });

        // Nav items entrance animation
        this.navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 500 + (index * 100));
        });
    }

    setupInteractions() {
        // CTA button interactions
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick(button);
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    handleCTAClick(button) {
        // Ripple effect for CTA buttons
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Get the target section from href (if it's a link)
        if (button.tagName === 'A') {
            const targetId = button.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                this.scrollToSection(targetId);
            }
        } else {
            // If it's a button without href, scroll to contact section
            this.scrollToSection('#contact');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioNav();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        /* Ensure mobile menu has proper initial state */
        .mobile-menu {
            display: none;
        }
        
        .mobile-menu.active {
            display: flex;
        }
    `;
    document.head.appendChild(style);
});

// Handle page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileMenu && mobileToggle) {
            mobileMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
// ====================About Section Animations
class AboutAnimations {
    constructor() {
        this.aboutSection = document.querySelector('.about');
        this.paragraphs = document.querySelectorAll('.about-paragraph');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateParagraphs();
                }
            });
        }, { threshold: 0.3 });

        if (this.aboutSection) {
            this.observer.observe(this.aboutSection);
        }
    }

    animateParagraphs() {
        this.paragraphs.forEach((paragraph, index) => {
            const delay = paragraph.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                paragraph.style.opacity = '1';
                paragraph.style.transform = 'translateY(0)';
                paragraph.classList.add('visible');
            }, delay * 1000);
        });

        // Stop observing after animation
        this.observer.unobserve(this.aboutSection);
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.aboutAnimations = new AboutAnimations();

// Skills Section Animations
class SkillsAnimations {
    constructor() {
        this.skillsSection = document.querySelector('.skills');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSkillInteractions();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                }
            });
        }, { threshold: 0.3 });

        if (this.skillsSection) {
            this.observer.observe(this.skillsSection);
        }
    }

    animateSkills() {
        this.skillItems.forEach((item, index) => {
            const delay = item.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.classList.add('visible');
            }, delay * 1000);
        });

        // Stop observing after animation
        this.observer.unobserve(this.skillsSection);
    }

    setupSkillInteractions() {
        this.skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px)';
            });

            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('visible')) return;
                item.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.skillsAnimations = new SkillsAnimations();

// Projects Section Animations
class ProjectsAnimations {
    constructor() {
        this.projectsSection = document.querySelector('.projects');
        this.projectCards = document.querySelectorAll('.project-card');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupProjectInteractions();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProjects();
                }
            });
        }, { threshold: 0.3 });

        if (this.projectsSection) {
            this.observer.observe(this.projectsSection);
        }
    }

    animateProjects() {
        this.projectCards.forEach((card, index) => {
            const delay = card.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('visible');
            }, delay * 1000);
        });

        // Stop observing after animation
        this.observer.unobserve(this.projectsSection);
    }

    setupProjectInteractions() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('visible')) return;
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.projectsAnimations = new ProjectsAnimations();


// Education Section Animations
class EducationAnimations {
    constructor() {
        this.educationSection = document.querySelector('.education');
        this.educationCards = document.querySelectorAll('.education-card');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupEducationInteractions();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEducation();
                }
            });
        }, { threshold: 0.3 });

        if (this.educationSection) {
            this.observer.observe(this.educationSection);
        }
    }

    animateEducation() {
        this.educationCards.forEach((card, index) => {
            const delay = card.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('visible');
            }, delay * 1000);
        });

        // Stop observing after animation
        this.observer.unobserve(this.educationSection);
    }

    setupEducationInteractions() {
        this.educationCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('visible')) return;
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.educationAnimations = new EducationAnimations();


// Experience Section Animations
class ExperienceAnimations {
    constructor() {
        this.experienceSection = document.querySelector('.experience');
        this.experienceCards = document.querySelectorAll('.experience-card');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupExperienceInteractions();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateExperience();
                }
            });
        }, { threshold: 0.3 });

        if (this.experienceSection) {
            this.observer.observe(this.experienceSection);
        }
    }

    animateExperience() {
        this.experienceCards.forEach((card, index) => {
            const delay = card.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('visible');
            }, delay * 1000);
        });

        // Stop observing after animation
        this.observer.unobserve(this.experienceSection);
    }

    setupExperienceInteractions() {
        this.experienceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('visible')) return;
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.experienceAnimations = new ExperienceAnimations();


// Contact Form Functionality
class ContactForm {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.submitBtn = this.contactForm?.querySelector('.submit-btn');
        this.contactItems = document.querySelectorAll('.contact-item');
        this.contactFormWrapper = document.querySelector('.contact-form-wrapper');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateContactItems();
                }
            });
        }, { threshold: 0.3 });

        const contactSection = document.querySelector('.contact');
        if (contactSection) {
            this.observer.observe(contactSection);
        }
    }

    animateContactItems() {
        this.contactItems.forEach((item, index) => {
            const delay = item.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.classList.add('visible');
            }, delay * 1000);
        });

        // Animate form wrapper
        setTimeout(() => {
            if (this.contactFormWrapper) {
                this.contactFormWrapper.style.opacity = '1';
                this.contactFormWrapper.style.transform = 'translateX(0)';
                this.contactFormWrapper.classList.add('visible');
            }
        }, 1500);

        // Stop observing after animation
        const contactSection = document.querySelector('.contact');
        this.observer.unobserve(contactSection);
    }

    setupFormValidation() {
        if (!this.contactForm) return;

        const inputs = this.contactForm.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');

        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (!value) {
            this.showError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }

        // Phone validation
        if (field.name === 'phone' && !this.isValidPhone(value)) {
            this.showError(field, 'Please enter a valid phone number');
            return false;
        }

        // Message length validation
        if (field.name === 'message' && value.length < 10) {
            this.showError(field, 'Message must be at least 10 characters long');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    showError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }

    clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }

    validateForm() {
        const fields = this.contactForm.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setupFormSubmission() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    async handleFormSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);

        // Simulate form submission (replace with actual API call later)
        try {
            await this.simulateApiCall();
            this.showSuccessMessage();
            this.contactForm.reset();
        } catch (error) {
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }

    setLoadingState(isLoading) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        // Create success message element
        let successElement = this.contactForm.querySelector('.form-success');
        
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-success';
            successElement.innerHTML = `
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
            `;
            this.contactForm.appendChild(successElement);
        }

        successElement.classList.add('show');

        // Remove success message after 5 seconds
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 5000);
    }

    showErrorMessage(message) {
        alert(message); // Replace with better error UI
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.contactForm = new ContactForm();

// Footer Functionality
class FooterManager {
    constructor() {
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        this.footerElements = document.querySelectorAll('.footer-content > *, .footer-bottom > *');
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupFooterAnimations();
        this.setupFooterInteractions();
    }

    setupScrollToTop() {
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });

            // Show/hide scroll to top button based on scroll position
            window.addEventListener('scroll', () => {
                this.toggleScrollToTop();
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleScrollToTop() {
        if (!this.scrollToTopBtn) return;

        if (window.scrollY > 500) {
            this.scrollToTopBtn.style.opacity = '1';
            this.scrollToTopBtn.style.visibility = 'visible';
            this.scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            this.scrollToTopBtn.style.opacity = '0';
            this.scrollToTopBtn.style.visibility = 'hidden';
            this.scrollToTopBtn.style.transform = 'translateY(10px)';
        }
    }

    setupFooterAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFooter();
                }
            });
        }, { threshold: 0.1 });

        const footer = document.querySelector('.footer');
        if (footer) {
            this.observer.observe(footer);
        }
    }

    animateFooter() {
        this.footerElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Stop observing after animation
        const footer = document.querySelector('.footer');
        this.observer.unobserve(footer);
    }

    setupFooterInteractions() {
        // Smooth scroll for footer links
        const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Download CV button
        const downloadBtn = document.querySelector('.footer-cta');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCV();
            });
        }
    }

    downloadCV() {
        // Simulate download (replace with actual CV file)
        const link = document.createElement('a');
        link.href = '#'; // Replace with actual CV file path
        link.download = 'Debapriyo_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show download confirmation
        this.showDownloadToast();
    }

    showDownloadToast() {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'download-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>CV download started</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: var(--primary);
            color: var(--background);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize in your main PortfolioNav class
// Add this to your existing init method:
this.footerManager = new FooterManager();