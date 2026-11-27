document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
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
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

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

    // --- 4. FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

    // --- 5. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            }
        }

        // Helper: Validate Email format
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Helper: Validate UK Phone (loosely handles various formats)
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
                if (consentGroup && consentMsg) {
                    consentGroup.classList.add('invalid');
                    consentMsg.textContent = 'You must agree to be contacted.';
                }
                isValid = false;
            }

            if (!isValid) return;

            // 4. Submission Preparation
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(quoteForm);
            // Append the Formspree identifier for routing
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
                    quoteForm.reset();

                    // Scroll to message
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
                            successMsg.style.display = 'none'; // Hide message after a while
                        }, 3000);
                    }, 2000);

                } else {
                    // Formspree Error State (e.g., invalid form key)
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