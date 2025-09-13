// Modal Functionality for both Book Site Visit and Contact forms
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = '✕';
                
                // Remove the existing mobile nav and create a new one
                mobileNav.remove();
                
                // Create a completely new mobile nav element
                const newMobileNav = document.createElement('nav');
                newMobileNav.id = 'mobileNav';
                newMobileNav.className = 'mobile-nav';
                newMobileNav.innerHTML = `
                    <a href="#" class="nav-item">About</a>
                    <a href="#" class="nav-item">Farmstay</a>
                    <a href="#" class="nav-item nav-cta book-visit-btn">Book Site Visit</a>
                `;
                
                // Apply styles directly to the new element
                newMobileNav.style.cssText = `
                    display: flex !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(33, 59, 44, 0.95) !important;
                    z-index: 99999 !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                    backdrop-filter: blur(10px) !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    box-sizing: border-box !important;
                `;
                
                // Style the nav items - ensure all have consistent styling
                const navItems = newMobileNav.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    // Special styling for "Book Site Visit" button
                    const isBookVisit = item.textContent.includes('Book Site Visit');
                    
                    item.style.cssText = `
                        color: white !important;
                        font-size: ${isBookVisit ? '14px' : '16px'} !important;
                        margin: 12px 0 !important;
                        padding: ${isBookVisit ? '20px 35px' : '25px 35px'} !important;
                        text-decoration: none !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 8px !important;
                        display: block !important;
                        text-align: center !important;
                        width: 320px !important;
                        border: none !important;
                        font-weight: normal !important;
                        white-space: normal !important;
                        box-sizing: border-box !important;
                        line-height: ${isBookVisit ? '1.2' : '1.3'} !important;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        min-height: ${isBookVisit ? '60px' : 'auto'} !important;
                    `;
                });
                
                // Add the new element to the body
                document.body.appendChild(newMobileNav);
                
                // Add event listeners to the mobile menu buttons
                const bookVisitBtn = newMobileNav.querySelector('.book-visit-btn');
                if (bookVisitBtn) {
                    bookVisitBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        // Close mobile menu first
                        newMobileNav.remove();
                        mobileMenuToggle.innerHTML = '☰';
                        // Open the book visit modal
                        const bookVisitModal = document.getElementById('bookVisitModal');
                        if (bookVisitModal) {
                            bookVisitModal.style.display = 'block';
                        }
                    });
                }
                
                // Update the reference
                window.currentMobileNav = newMobileNav;
            } else {
                mobileMenuToggle.innerHTML = '☰';
                const currentNav = window.currentMobileNav || document.getElementById('mobileNav');
                if (currentNav) {
                    currentNav.remove();
                }
            }
        });

        // Close mobile menu when clicking on nav items (using event delegation)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-item')) {
                const currentNav = window.currentMobileNav || document.getElementById('mobileNav');
                if (currentNav) {
                    currentNav.remove();
                }
                mobileMenuToggle.innerHTML = '☰';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target)) {
                const currentNav = window.currentMobileNav || document.getElementById('mobileNav');
                if (currentNav) {
                    currentNav.remove();
                }
                mobileMenuToggle.innerHTML = '☰';
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const currentNav = window.currentMobileNav || document.getElementById('mobileNav');
                if (currentNav) {
                    currentNav.remove();
                }
                mobileMenuToggle.innerHTML = '☰';
            }
        });
    }
    // Simple Image Sliding
    const carouselGroup = document.querySelector('.image-carousel-group');
    const carouselSvg = document.querySelector('.carousel-svg');
    
    if (carouselGroup && carouselSvg) {
        let translateX = 0;
        let isDragging = false;
        let startX = 0;
        let startTranslateX = 0;
        
        // Mouse events
        carouselGroup.addEventListener('mousemove', handleMouseMove);
        carouselGroup.addEventListener('mouseleave', handleMouseLeave);
        carouselGroup.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events for mobile
        carouselGroup.addEventListener('touchstart', handleTouchStart, { passive: false });
        carouselGroup.addEventListener('touchmove', handleTouchMove, { passive: false });
        carouselGroup.addEventListener('touchend', handleTouchEnd);
        
        function handleMouseMove(e) {
            if (isDragging) return;
            
            const rect = carouselGroup.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const centerX = rect.width / 2;
            
            // Simple slide based on cursor position
            const slideAmount = -(mouseX - centerX) / centerX * 30; // Small slide amount
            translateX = slideAmount;
            
            carouselSvg.style.transform = `translateX(${translateX}px)`;
        }
        
        function handleMouseLeave() {
            if (!isDragging) {
                translateX = 0;
                carouselSvg.style.transform = 'translateX(0px)';
            }
        }
        
        function startDrag(e) {
            isDragging = true;
            carouselGroup.style.cursor = 'grabbing';
            
            if (e.type === 'mousedown') {
                startX = e.clientX;
            } else {
                startX = e.touches[0].clientX;
            }
            
            startTranslateX = translateX;
            carouselSvg.style.transition = 'none';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            let currentX;
            if (e.type === 'mousemove') {
                currentX = e.clientX;
            } else {
                currentX = e.touches[0].clientX;
            }
            
            const deltaX = currentX - startX;
            translateX = startTranslateX + deltaX;
            
            // Limit drag range
            const maxDrag = 100;
            translateX = Math.max(-maxDrag, Math.min(maxDrag, translateX));
            
            carouselSvg.style.transform = `translateX(${translateX}px)`;
        }
        
        function endDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            carouselGroup.style.cursor = 'grab';
            carouselSvg.style.transition = 'transform 0.3s ease-out';
            
            // Auto-return to center
            setTimeout(() => {
                if (!isDragging) {
                    translateX = 0;
                    carouselSvg.style.transform = 'translateX(0px)';
                }
            }, 800);
        }
        
        function handleTouchStart(e) {
            e.preventDefault();
            startDrag(e);
        }
        
        function handleTouchMove(e) {
            e.preventDefault();
            drag(e);
        }
        
        function handleTouchEnd() {
            endDrag();
        }
    }
    
    // Book Site Visit Modal
    const bookVisitModal = document.getElementById('bookVisitModal');
    const bookVisitBtn = document.querySelector('.book-visit-btn');
    const bookVisitForm = document.getElementById('bookVisitForm');
    
    // Contact Modal
    const contactModal = document.getElementById('contactModal');
    const contactBtn = document.querySelector('.contact-btn');
    const contactForm = document.getElementById('contactForm');
    

    
    // Close buttons for both modals
    const closeBtns = document.querySelectorAll('.close');
    
    // Open Book Site Visit modal
    if (bookVisitBtn) {
        bookVisitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            bookVisitModal.style.display = 'block';
        });
    }
    
    // Open Contact modal
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.style.display = 'block';
        });
    }
    
    // Close modals when X is clicked
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals when clicking outside of them
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                openModal.style.display = 'none';
            }
        }
    });
    
    // Book Site Visit form submission handling
    if (bookVisitForm) {
        bookVisitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookVisitForm);
            const submitBtn = bookVisitForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;
            
            // Submit form to PHP
            fetch('process_booking.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showSuccessState(bookVisitForm, 'Thank you! Your site visit has been booked successfully. We will contact you soon to confirm the details.');
                    bookVisitForm.reset();
                    
                    // Close modal after 1 second
                    setTimeout(() => {
                        bookVisitModal.style.display = 'none';
                        // Show floating success message after modal closes
                        showFloatingSuccess('Your site visit has been booked successfully! We will contact you soon to confirm your booking.');
                    }, 1000);
                } else {
                    // Show error message
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while booking your visit. Please try again.');
            })
            .finally(() => {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
        // Contact form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit form to PHP
            fetch('process_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showSuccessState(contactForm, 'Thank you! Your message has been sent successfully. We will get back to you soon.');
                    contactForm.reset();
                    
                    // Close modal after 1 second
                    setTimeout(() => {
                        contactModal.style.display = 'none';
                        // Show floating success message after modal closes
                        showFloatingSuccess('Your message has been sent successfully! We will get back to you soon.');
                    }, 1000);
                } else {
                    // Show error message
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while sending your message. Please try again.');
            })
            .finally(() => {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    
    // Set minimum date for visit date picker (today)
    const visitDateInput = document.getElementById('visitDate');
    const today = new Date().toISOString().split('T')[0];
    visitDateInput.min = today;
    
    // Form validation and real-time feedback
    const inputs = contactForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        // Remove existing error styling
        field.classList.remove('error');
        
        if (isRequired && !value) {
            field.classList.add('error');
            return false;
        }
        
        // Specific validation for different field types
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }
        
        return true;
    }
    
    function showMessage(form, message, type) {
        // Remove existing messages from this specific form
        const existingMessage = form.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Insert message after form
        form.appendChild(messageDiv);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    function showSuccessState(form, message) {
        // Remove existing messages
        const existingMessage = form.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message with better styling
        const successDiv = document.createElement('div');
        successDiv.className = 'message message-success success-animation';
        successDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-text">${message}</div>
        `;
        
        // Insert success message
        form.appendChild(successDiv);
        
        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 2000);
    }
    
    function showFloatingSuccess(message) {
        // Remove existing floating success messages
        const existingFloating = document.querySelector('.floating-success');
        if (existingFloating) {
            existingFloating.remove();
        }
        
        // Create floating success message
        const floatingDiv = document.createElement('div');
        floatingDiv.className = 'floating-success';
        floatingDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-text">${message}</div>
        `;
        
        // Add to body
        document.body.appendChild(floatingDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (floatingDiv.parentNode) {
                floatingDiv.remove();
            }
        }, 5000);
    }
    }
});

// Add CSS for form validation errors
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error {
        border-color: #ff6b6b;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }
`;
document.head.appendChild(style);
