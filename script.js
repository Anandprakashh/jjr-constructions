document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const bars = document.querySelectorAll('.bar');
        if (nav.classList.contains('active')) {
            bars[0].style.transform = "rotate(45deg) translate(5px, 6px)";
            bars[1].style.opacity = "0";
            bars[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
        } else {
            bars[0].style.transform = "none";
            bars[1].style.opacity = "1";
            bars[2].style.transform = "none";
        }
    });

    // --- Configurator Logic ---
    const bType = document.getElementById('bType');
    const bWidth = document.getElementById('bWidth');
    const bDepth = document.getElementById('bDepth');
    const bCladding = document.getElementById('bCladding');
    const bGlazing = document.getElementById('bGlazing');

    // Display values
    const widthVal = document.getElementById('widthVal');
    const depthVal = document.getElementById('depthVal');
    const areaCalc = document.getElementById('areaCalc');
    const totalPrice = document.getElementById('totalPrice');

    // Extras checkboxes
    const extras = document.querySelectorAll('input[name="extras"]');

    // Base prices per sqm (indicative)
    const BASE_PRICES = {
        'garden-room': 600,
        'annexe': 750,
        'home-office': 550,
        'sauna': 900,
        'spa-deck': 400
    };

    function calculatePrice() {
        // Dimensions
        const w = parseFloat(bWidth.value);
        const d = parseFloat(bDepth.value);

        widthVal.textContent = w;
        depthVal.textContent = d;

        const area = w * d;
        areaCalc.textContent = area.toFixed(1);

        // Base Cost
        const typeCost = BASE_PRICES[bType.value] * area;

        // Extras Costs
        let extrasCost = 0;
        extras.forEach(box => {
            if (box.checked) {
                if (box.value === 'underfloor') extrasCost += 1500;
                if (box.value === 'loft-ladder') extrasCost += 800;
                if (box.value === 'skylights') extrasCost += 600;
            }
        });

        // Cladding & Glazing adjustments (simplified multiplier or fixed)
        let claddingCost = 0;
        if (bCladding.value === 'cedar') claddingCost = area * 20; // £20/sqm premium
        if (bCladding.value === 'charred') claddingCost = area * 35;

        let glazingCost = 0;
        if (bGlazing.value === 'triple') glazingCost += 1200;
        if (bGlazing.value === 'smart') glazingCost += 3500;

        // Total
        const total = typeCost + extrasCost + claddingCost + glazingCost;

        // Format currency
        totalPrice.textContent = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(total);
    }

    // Attach event listeners to all inputs
    [bType, bWidth, bDepth, bCladding, bGlazing].forEach(el => el.addEventListener('input', calculatePrice));
    extras.forEach(box => box.addEventListener('change', calculatePrice));

    // Initial calc
    calculatePrice();

    // --- Gallery Filter & Lightbox ---
    const filterBtns = document.querySelectorAll('.filter-buttons .btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = item.querySelector('img').src;
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    const hideLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    };

    closeLightbox.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            nav.classList.remove('active'); // Close mobile menu if open
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Populate Hidden Form Field for Formspree ---
    const leadForm = document.getElementById('lead-form');
    const hiddenInput = document.getElementById('email-summary');

    leadForm.addEventListener('submit', (e) => {
        // Optional: Add a custom message to the email summary before sending
        const type = bType.options[bType.selectedIndex].text;
        const dims = `${bWidth.value}m x ${bDepth.value}m`;
        hiddenInput.value = `Configurator Estimate - Type: ${type}, Size: ${dims}. I'd like a fixed quote.`;
    });
});