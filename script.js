/* =========================================
   JJR Construction - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            // Accessibility support
            mobileToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when a link is clicked
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
    // Note: For this to work, your HTML buttons need 'data-filter' attributes 
    // (e.g., data-filter="all", data-filter="renovations") and project cards need 
    // matching 'data-category' attributes.

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projects.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter') || 'all';

                projects.forEach(project => {
                    const category = project.getAttribute('data-category');

                    if (filterValue === 'all' || filterValue === category) {
                        project.style.display = 'block';
                        // Simple fade animation
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.display = 'none';
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.95)';
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

            // Close all other open items (Accordion style)
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // --- 5. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return; // Don't scroll for empty hashes

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ensure mobile menu is closed before scrolling
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 6. Quote Form Handling (Simulation) ---
    const quoteForm = document.querySelector('.contact-form') || document.querySelector('#quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Basic Validation Simulation
            const requiredInputs = quoteForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444'; // Red border
                } else {
                    input.style.borderColor = ''; // Reset to CSS default
                }
            });

            if (isValid) {
                // Visual feedback for success
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    submitBtn.innerText = 'Message Sent!';
                    submitBtn.style.background = '#10b981'; // Green
                    submitBtn.style.color = '#fff';

                    quoteForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 3000);
                }, 1500);

            } else {
                alert('Please fill in all required fields to get a quote.');
            }
        });
    }
});