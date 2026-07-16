/* JavaScript Document - Sharma's Packers & Logistics Interactivity */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Slider Navigation Menu
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileMenuOverlay.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeMobileMenu() {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenuOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeMobileMenu();
        });
    });

    // ==========================================
    // 2. Header Scroll Effect
    // ==========================================
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. Scroll Fade-in Animation (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, scrollObserverOptions);

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // ==========================================
    // 4. Stats Counter Animation
    // ==========================================
    const counterElements = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseInt(target.getAttribute('data-target'), 10);
                animateCounter(target, targetVal);
                observer.unobserve(target); // Animate once
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    function animateCounter(element, targetVal) {
        let current = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            // Ease out quad formula
            const progress = frame / totalFrames;
            const easeVal = progress * (2 - progress);
            current = Math.round(easeVal * targetVal);

            if (frame >= totalFrames) {
                element.textContent = targetVal + '+';
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, frameRate);
    }

    // ==========================================
    // 5. Gallery Category Filter
    // ==========================================
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let visibleGalleryIndices = []; // Track currently visible indices for lightbox navigation

    function filterGallery(category) {
        visibleGalleryIndices = [];
        let count = 0;
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.setAttribute('data-visible-index', count);
                visibleGalleryIndices.push(index);
                count++;
            } else {
                item.classList.add('hidden');
                item.removeAttribute('data-visible-index');
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterVal = btn.getAttribute('data-filter');
            filterGallery(filterVal);
        });
    });

    // Initialize gallery index mapping on load
    filterGallery('all');

    // ==========================================
    // 6. Interactive Lightbox Modal
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeLightboxBtn = document.getElementById('close-lightbox-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    let currentVisibleIndex = 0;

    function openLightbox(indexInVisibleArray) {
        currentVisibleIndex = indexInVisibleArray;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const itemIndex = visibleGalleryIndices[currentVisibleIndex];
        const targetItem = galleryItems[itemIndex];
        const imgElement = targetItem.querySelector('img');
        
        lightboxImage.src = imgElement.src;
        lightboxImage.alt = imgElement.alt;
        lightboxCaption.textContent = imgElement.alt;
        lightboxCounter.textContent = `Image ${currentVisibleIndex + 1} of ${visibleGalleryIndices.length}`;
    }

    function showNextImage() {
        currentVisibleIndex = (currentVisibleIndex + 1) % visibleGalleryIndices.length;
        updateLightboxContent();
    }

    function showPrevImage() {
        currentVisibleIndex = (currentVisibleIndex - 1 + visibleGalleryIndices.length) % visibleGalleryIndices.length;
        updateLightboxContent();
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const visibleIdx = parseInt(item.getAttribute('data-visible-index'), 10);
            if (!isNaN(visibleIdx)) {
                openLightbox(visibleIdx);
            }
        });
    });

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

    // Keyboard support for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // ==========================================
    // 7. Service Areas Route Checker
    // ==========================================
    const searchInput = document.getElementById('route-search-input');
    const cityCards = document.querySelectorAll('.city-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchVal = e.target.value.toLowerCase().trim();
            
            cityCards.forEach(card => {
                const cityName = card.getAttribute('data-city').toLowerCase();
                if (cityName.includes(searchVal)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // ==========================================
    // 8. FAQ Accordion Logic
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        const body = item.querySelector('.faq-body');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-body').style.maxHeight = null;
                i.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
            });

            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // 9. Floating Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 10. Form Submission Mock Handling
    // ==========================================
    const inquiryForm = document.getElementById('lead-inquiry-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successModalOverlay = document.getElementById('success-modal-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page refresh
            
            // Basic custom validation check
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const pickupInput = document.getElementById('pickup');
            const dropInput = document.getElementById('drop');
            const serviceSelect = document.getElementById('service-type');
            const dateInput = document.getElementById('move-date');

            if (!nameInput.value || !phoneInput.value || !pickupInput.value || !dropInput.value || !serviceSelect.value || !dateInput.value) {
                alert('Please fill out all required fields.');
                return;
            }

            // Phone length check
            if (phoneInput.value.length < 10) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            // Visual Loading State
            const origText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            submitBtn.innerHTML = `
                <svg class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" style="animation: spin 1s linear infinite; margin-right: 8px; display: inline-block;">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity: 0.75;"></path>
                </svg>
                Processing Estimate...
            `;

            // Inject spin style locally
            if (!document.getElementById('spin-keyframes-style')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'spin-keyframes-style';
                styleSheet.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(styleSheet);
            }

            // Simulate server network latency of 1.5 seconds
            setTimeout(() => {
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = origText;

                // Show Success Pop-up modal
                successModalOverlay.classList.add('active');
                
                // Reset form fields
                inquiryForm.reset();
            }, 1500);
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModalOverlay.classList.remove('active');
        });
    }
    
    if (successModalOverlay) {
        successModalOverlay.addEventListener('click', (e) => {
            if (e.target === successModalOverlay) {
                successModalOverlay.classList.remove('active');
            }
        });
    }
});
