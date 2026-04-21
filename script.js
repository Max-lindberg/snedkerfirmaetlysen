// Multi-page functionality for Snedkerfirmaet Ly'sén
document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Smooth scrolling for anchor links (only on same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            // Only prevent default if target exists on current page
            if (target) {
                e.preventDefault();
                const offset = 100; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced form handling for contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            const required = ['firstName', 'lastName', 'email', 'phone', 'description', 'consent'];
            let isValid = true;
            let errorMessage = '';

            for (let field of required) {
                const value = data[field];
                if (!value || (field === 'consent' && value !== 'on')) {
                    isValid = false;
                    errorMessage += `${field === 'firstName' ? 'Fornavn' :
                                   field === 'lastName' ? 'Efternavn' :
                                   field === 'email' ? 'Email' :
                                   field === 'phone' ? 'Telefon' :
                                   field === 'description' ? 'Projektbeskrivelse' :
                                   field === 'consent' ? 'Samtykke' : field} er påkrævet.\n`;
                }
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                errorMessage += 'Ugyldig email adresse.\n';
            }

            if (!isValid) {
                alert('Fejl i formularen:\n\n' + errorMessage);
                return;
            }

            // Show success message
            const name = `${data.firstName} ${data.lastName}`;
            alert(`Tak for din henvendelse, ${name}!\n\nVi har modtaget dine oplysninger og vil kontakte dig inden for 24 timer på telefon ${data.phone} eller email ${data.email}.\n\nVenlig hilsen\nSnedkerfirmaet Ly'sén`);

            // Reset form
            contactForm.reset();
        });
    }

    // Add scroll effect to navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-2xl');
            } else {
                navbar.classList.remove('shadow-2xl');
            }
        });
    }

    // Project filter functionality (for projekter.html)
    const filterButtons = document.querySelectorAll('button[class*="px-6 py-2"]');
    if (filterButtons.length > 0 && window.location.pathname.includes('projekter')) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active state from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('bg-white', 'text-primary', 'border', 'border-gray-300');
                });

                // Add active state to clicked button
                this.classList.remove('bg-white', 'text-primary', 'border', 'border-gray-300');
                this.classList.add('bg-primary', 'text-white');

                // Filter projects (simple show/hide based on category)
                const filterText = this.textContent.trim();
                const projects = document.querySelectorAll('.grid > div[class*="bg-white rounded-xl shadow-lg"]');

                projects.forEach(project => {
                    if (filterText === 'Alle') {
                        project.style.display = 'block';
                    } else {
                        const categoryTag = project.querySelector('[class*="absolute top-4 right-4"]');
                        if (categoryTag) {
                            const category = categoryTag.textContent.trim();
                            if (category.includes(filterText.split(' ')[0]) || filterText.includes(category)) {
                                project.style.display = 'block';
                            } else {
                                project.style.display = 'none';
                            }
                        }
                    }
                });
            });
        });
    }

    // FAQ accordion functionality (for kontakt.html)
    const faqButtons = document.querySelectorAll('button[class*="w-full px-6 py-4"]');
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = !answer.classList.contains('hidden');

            // Close all other FAQ items
            faqButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    const otherAnswer = otherButton.nextElementSibling;
                    otherAnswer.classList.add('hidden');
                    otherButton.classList.remove('bg-light-gray');
                }
            });

            // Toggle current FAQ item
            if (isOpen) {
                answer.classList.add('hidden');
                this.classList.remove('bg-light-gray');
            } else {
                answer.classList.remove('hidden');
                this.classList.add('bg-light-gray');
            }
        });
    });

    // Initialize FAQ items as hidden
    document.querySelectorAll('button[class*="w-full px-6 py-4"] + div').forEach(answer => {
        answer.classList.add('hidden');
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe various elements for animation
    const animatedElements = document.querySelectorAll(`
        .bg-white.rounded-xl.shadow-lg,
        .bg-white.rounded-xl.p-8.shadow-lg,
        .service-card,
        .bg-white.p-6.rounded-lg,
        .bg-light-gray.rounded-lg,
        .bg-primary.rounded-full
    `);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });

    // Phone number formatting (for contact form)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 8) {
                value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
            }
            e.target.value = value;
        });
    }

    // Add loading state to form submission
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            contactForm.addEventListener('submit', function() {
                submitButton.textContent = 'Sender...';
                submitButton.disabled = true;

                setTimeout(() => {
                    submitButton.textContent = 'Send anmodning';
                    submitButton.disabled = false;
                }, 2000);
            });
        }
    }
});