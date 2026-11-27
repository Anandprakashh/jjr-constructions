document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle (Accessibility Fixes) ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('mobileMenu');

    if (mobileToggle && navLinks) {

        // Helper to toggle menu state
        function toggleMenu() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';

            // Toggle the visual class
            navLinks.classList.toggle('active');

            // Update accessibility attribute
            mobileToggle.setAttribute('aria-expanded', String(!isExpanded));

            // Update aria-label based on state for screen readers
            if (!isExpanded) {
                mobileToggle.setAttribute('aria-label', 'Close navigation menu');
            } else {
                mobileToggle.setAttribute('aria-label', 'Open navigation menu');
            }
        }

        // Click event
        mobileToggle.addEventListener('click', toggleMenu);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
                mobileToggle.focus(); // Return focus to button
            }
        });

        // Close when a link is selected
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                    mobileToggle.focus(); // Return focus to button for re-accessibility
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
        // Click handler
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Optional: Close others (Accordion behavior)
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) faqItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard handler for Arrow Keys, Enter, Space, Escape
        question.addEventListener('keydown', (e) => {
            const currentItemIndex = Array.from(faqQuestions).indexOf(question);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault(); // Prevent page scroll
                    if (currentItemIndex < faqQuestions.length - 1) {
                        faqQuestions[currentItemIndex + 1].focus();
                    } else {
                        faqQuestions[0].focus(); // Wrap around
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault(); // Prevent page scroll
                    if (currentItemIndex > 0) {
                        faqQuestions[currentItemIndex - 1].focus();
                    } else {
                        faqQuestions[faqQuestions.length - 1].focus(); // Wrap around
                    }
                    break;

                case 'Escape':
                    // Close the currently open item if any
                    const activeItem = document.querySelector('.faq-item.active');
                    if (activeItem) {
                        const activeBtn = activeItem.querySelector('.faq-question');
                        activeItem.classList.remove('active');
                        activeBtn.setAttribute('aria-expanded', 'false');
                        activeBtn.focus(); // Return focus to the button
                    }
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault(); // Prevent space scrolling on buttons
                    question.click(); // Trigger the click handler
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

                // Focus management for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    // --- 6. Quote Form Handling (Formspree Integration) ---
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {

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

                // Move focus to the input after a short delay so user sees message first or focuses immediately?
                // Usually better to focus the input on validation failure.
                const input = document.getElementById(fieldId);
                if (input) {
                    setTimeout(() => input.focus(), 500);
                }
            }
        }

        // Helper: Validate Email format
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Helper: Validate Phone number (loose format)
        function isValidPhone(phone) {
            return phone.replace(/\D/g, '').length >= 7;
        }

        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerText;

            // 1. Honeypot Check (Bot Protection)
            if (quoteForm.querySelector('[name="_gotcha"]').value !== "") return;

            // 2. Get Values
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const postcode = document.getElementById('postcode').value.trim();
            const service = document.getElementById('service').value;
            const propertyType = document.getElementById('propertyType').value;
            const budget = document.getElementById('budget').value;
            const contactMethod = document.getElementById('contactMethod').value;
            const details = document.getElementById('projectDetails').value.trim();
            const consent = document.getElementById('consent').checked;

            let isValid = true;

            // 3. Validation Checks
            if (!fullName) { showFieldError('fullName', 'Please enter your name.'); isValid = false; }

            if (!email || !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                isValid = false;
            }

            if (!phone || !isValidPhone(phone)) {
                showFieldError('phone', 'Please enter a valid phone number.');
                isValid = false;
            }

            if (postcode) {
                // Basic UK Postcode Regex validation
                const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
                if (!postcodeRegex.test(postcode)) {
                    showFieldError('postcode', 'Please enter a valid UK Postcode.');
                    isValid = false;
                }
            } else {
                showFieldError('postcode', 'Postcode is required.');
                isValid = false;
            }

            if (!service) { showFieldError('service', 'Please select a service.'); isValid = false; }
            if (!propertyType) { showFieldError('propertyType', 'Please select property type.'); isValid = false; }
            if (!budget) { showFieldError('budget', 'Please select a budget range.'); isValid = false; }
            if (!contactMethod) { showFieldError('contactMethod', 'Please select contact method.'); isValid = false; }

            if (!details) { showFieldError('projectDetails', 'Please describe your project.'); isValid = false; }
            if (!consent) {
                const consentGroup = document.getElementById('consent').closest('.form-group');
                const consentMsg = document.getElementById('consentError');

                // Add visual error state to the wrapper div since it has no specific element
                if (consentGroup) {
                    consentGroup.classList.add('invalid');
                    // Also update the span for screen readers
                    if (consentMsg) consentMsg.textContent = 'You must agree to be contacted.';
                }
                isValid = false;
            }

            if (!isValid) return;

            // 4. Submission Preparation
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(quoteForm);
            formData.append('_form-name', 'jjr-quote-form');

            try {
                const response = await fetch(quoteForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success State
                    const successMsg = document.getElementById('formSuccessMsg');
                    successMsg.style.display = 'block';

                    // Announce to screen reader
                    successMsg.setAttribute('role', 'status');

                    quoteForm.reset();

                    // Scroll to message for mobile users
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.innerText = 'Sent Successfully!';
                        submitBtn.style.backgroundColor = '#10b981'; // Green
                        submitBtn.style.borderColor = '#10b981';

                        setTimeout(() => {
                            submitBtn.innerText = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = '';
                            submitBtn.style.borderColor = '';

                            // Hide message again after a while
                            successMsg.style.display = 'none';
                        }, 3000);
                    }, 2000);

                } else {
                    // Formspree Error State
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        throw new Error(data.errors.map(error => error.message).join(", "));
                    } else {
                        throw new Error('Oops! There was a problem submitting your form.');
                    }
                }

            } catch (error) {
                // General Network/Server Error
                const errorMsg = document.getElementById('formErrorMsg');
                errorMsg.innerText = error.message;
                errorMsg.style.display = 'block';

                submitBtn.innerText = 'Try Again';
                submitBtn.disabled = false;
            }
        });
    }
});