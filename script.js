/**
 * NovaDent Main Script
 * Handles navigation, animations, sliders, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Mobile Navigation
       ========================================= */
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle Menu
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }

    // Close Menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* =========================================
       2. Scroll Animations (Intersection Observer)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    /* =========================================
       3. Reviews Slider
       ========================================= */
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    
    if (track && prevBtn && nextBtn) {
        const cards = document.querySelectorAll('.review-card');
        let currentIndex = 0;

        function updateSlider() {
            const cardWidth = cards[0].offsetWidth;
            // Add gap logic if margin is involved, but here flex layout handles it
            // However, our CSS .review-card is min-width: 100% so we slide by 100%
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cards.length - 1; // Loop to end
            }
            updateSlider();
        });

        // Handle window resize to reset alignment if needed
        window.addEventListener('resize', updateSlider);
    }

    /* =========================================
       4. Form Validation & Submission
       ========================================= */
    const form = document.getElementById('appointmentForm');
    const modal = document.getElementById('notificationModal');
    const modalClose = document.getElementById('modalClose');

    // Phone Mask (Simple implementation)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x[2]) {
                 e.target.value = x[1] ? '+7' : '';
                 return; 
            }
            e.target.value = !x[3] ? `+7 (${x[2]}` : `+7 (${x[2]}) ${x[3]}` + (x[4] ? `-${x[4]}` : '') + (x[5] ? `-${x[5]}` : '');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            
            // Reset errors
            removeError(name);
            removeError(phone);

            // Validate Name
            if (name.value.trim().length < 2) {
                showError(name, 'Введите корректное имя');
                isValid = false;
            }

            // Validate Phone
            if (phone.value.length < 10) { // Simple length check
                showError(phone, 'Введите корректный номер телефона');
                isValid = false;
            }

            if (isValid) {
                // Simulate API call
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                
                submitBtn.disabled = true;
                submitBtn.innerText = 'Отправка...';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                    form.reset();
                    showModal();
                }, 1500);
            }
        });
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        input.classList.add('input-error');
        
        let error = formGroup.querySelector('.error-message');
        if (!error) {
            error = document.createElement('span');
            error.className = 'error-message';
            formGroup.appendChild(error);
        }
        error.innerText = message;
    }

    function removeError(input) {
        const formGroup = input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    /* =========================================
       5. Modal Logic
       ========================================= */
    function showModal() {
        if (modal) {
            modal.classList.add('active');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    /* =========================================
       6. Header Scroll Effect
       ========================================= */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

});
