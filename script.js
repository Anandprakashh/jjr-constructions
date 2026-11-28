document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle (Updated selectors for class-based nav) ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {

        function toggleMenu() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';

            navLinks.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', String(!isExpanded));

            // Update aria-label for screen readers
            if (!isExpanded) {
                mobileToggle.setAttribute('aria-label', 'Close navigation menu');
            } else {
                mobileToggle.setAttribute('aria-label', 'Open navigation menu');
            }
        }

        mobileToggle.addEventListener('click', toggleMenu);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
                mobileToggle.focus();
            }
        });

        // Close when a link is selected
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                    mobileToggle.focus();
                }
            });
        });
    }

    // --- 2. Sticky Navbar Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. Project Filtering System ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projects.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active states for tabs
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                const filterValue = button.getAttribute('data-filter') || 'all';

                projects.forEach(project => {
                    const category = project.getAttribute('data-category');

                    if (filterValue === 'all' || filterValue === category) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.95)';

                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // --- 4. FAQ Accordion (Keyboard Accessible) ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Optional: Close others (Accordion behavior)
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) faqItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard handler
        question.addEventListener('keydown', (e) => {
            const currentItemIndex = Array.from(faqQuestions).indexOf(question);
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentItemIndex < faqQuestions.length - 1) {
                        faqQuestions[currentItemIndex + 1].focus();
                    } else {
                        faqQuestions[0].focus(); // Wrap around
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (currentItemIndex > 0) {
                        faqQuestions[currentItemIndex - 1].focus();
                    } else {
                        faqQuestions[faqQuestions.length - 1].focus(); // Wrap around
                    }
                    break;

                case 'Escape':
                    const activeItem = document.querySelector('.faq-item.active');
                    if (activeItem) {
                        const activeBtn = activeItem.querySelector('.faq-question');
                        activeItem.classList.remove('active');
                        activeBtn.setAttribute('aria-expanded', 'false');
                        activeBtn.focus();
                    }
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault();
                    question.click();
                    break;
            }
        });
    });

    // --- 5. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    toggleMenu();
                }

                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Focus management
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    // --- 6. Quote Form Handling (Updated for new HTML IDs) ---
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        const submitBtn = document.querySelector('.submit-btn');

        // Helper: Clear all validation errors
        function clearErrors() {
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
            document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');

            const successMsg = document.getElementById('formSuccessMsg');
            const errorMsg = document.getElementById('formErrorMsg');
            if (successMsg) successMsg.style.display = 'none';
            if (errorMsg) errorMsg.style.display = 'none';
        }

        // Helper: Show error for a specific field
        function showFieldError(fieldId, message) {
            const group = document.querySelector(`label[for="${fieldId}"]`).closest('.form-group');
            const msgBox = document.getElementById(`${fieldId}Error`);

            if (group && msgBox) {
                group.classList.add('invalid');
                msgBox.textContent = message;

                const input = document.getElementById(fieldId);
                if (input) setTimeout(() => input.focus(), 500);
            } else if (fieldId === 'consent') {
                // Handle consent checkbox error specifically
                const consentGroup = document.querySelector('.consent-label');
                const consentMsg = document.getElementById('consentError');
                if (consentGroup) {
                    consentGroup.classList.add('invalid');
                    if (consentMsg) consentMsg.textContent = message;
                }
            }
        }

        // Helpers: Validation Regex
        function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
        function isValidPhone(phone) { return phone.replace(/\D/g, '').length >= 7; }

        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            // Update IDs to match new HTML structure
            const fullName = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const postcode = document.getElementById('postcode').value.trim();
            const service = document.getElementById('service').value;
            const propertyType = document.getElementById('property-type').value;
            const budget = document.getElementById('budget').value;
            const contactMethod = document.getElementById('contact-method').value;
            const details = document.getElementById('details').value.trim();
            const consent = document.getElementById('consent').checked;

            let isValid = true;

            // Validation Checks
            if (!fullName) { showFieldError('name', 'Please enter your name.'); isValid = false; }

            if (!email || !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                isValid = false;
            }

            if (!phone || !isValidPhone(phone)) {
                showFieldError('phone', 'Please enter a valid phone number.');
                isValid = false;
            }

            if (!postcode) {
                showFieldError('postcode', 'Postcode is required.');
                isValid = false;
            } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode)) {
                // Strict UK Postcode Regex
                showFieldError('postcode', 'Please enter a valid UK Postcode.');
                isValid = false;
            }

            if (!service) { showFieldError('service', 'Please select a service.'); isValid = false; }
            if (!propertyType) { showFieldError('property-type', 'Please select property type.'); isValid = false; }
            if (!budget) { showFieldError('budget', 'Please select budget range.'); isValid = false; }
            if (!contactMethod) { showFieldError('contact-method', 'Please select contact method.'); isValid = false; }
            if (!details) { showFieldError('details', 'Please describe your project.'); isValid = false; }

            if (!consent) {
                showFieldError('consent', 'You must agree to be contacted.');
                isValid = false;
            }

            if (!isValid) return;

            // Submission Preparation
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(quoteForm);

            try {
                // Note: Replace with your actual endpoint (e.g., Formspree action URL)
                const response = await fetch(quoteForm.action || '/api/submit-form', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success State
                    const successMsg = document.getElementById('formSuccessMsg');
                    if (successMsg) successMsg.style.display = 'block';

                    quoteForm.reset();

                    setTimeout(() => {
                        submitBtn.innerText = 'Sent Successfully!';
                        submitBtn.style.backgroundColor = '#10b981'; // Green

                        setTimeout(() => {
                            submitBtn.innerText = 'Send Enquiry';
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = '';
                            if (successMsg) successMsg.style.display = 'none';
                        }, 3000);
                    }, 1500);

                } else {
                    throw new Error('Oops! There was a problem submitting your form.');
                }
            } catch (error) {
                const errorMsg = document.getElementById('formErrorMsg');
                if (errorMsg) {
                    errorMsg.innerText = error.message;
                    errorMsg.style.display = 'block';
                }
                submitBtn.innerText = 'Try Again';
                submitBtn.disabled = false;
            }
        });
    }

    // --- 7. Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Run once per element
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }
});