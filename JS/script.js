// ========================================
// MAIN.JS - Discover Lebanon Website
// ========================================

// ========================================
// 1. ACTIVE NAVIGATION INDICATOR
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('nav ul li a');
  
  // Loop through links and add 'active' class to current page
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});

// ========================================
// 2. FEEDBACK FORM VALIDATION
// ========================================
const feedbackForm = document.getElementById('feedbackForm');

if (feedbackForm) {
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validation flags
    let isValid = true;
    
    // Validate Name (not empty)
    if (name === '') {
      showError('name', 'nameError', 'Please enter your name');
      isValid = false;
    }
    
    // Validate Email (format check)
    if (!validateEmail(email)) {
      showError('email', 'emailError', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate Message (minimum 10 characters)
    if (message.length < 10) {
      showError('message', 'messageError', 'Please enter a message (at least 10 characters)');
      isValid = false;
    }
    
    // If all validations pass
    if (isValid) {
      // Save to localStorage
      saveFeedbackToLocalStorage(name, email, subject, message);
      
      // Show success message
      showSuccessMessage();
      
      // Reset form after 2 seconds
      setTimeout(() => {
        feedbackForm.reset();
        hideSuccessMessage();
      }, 3000);
      
      // Optional: Open mailto (uncomment if you want this feature)
      // openMailto(name, email, subject, message);
    }
  });
}

// Email validation helper function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show error message and highlight field
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(errorId);
  
  if (field && errorElement) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Clear all error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  const errorFields = document.querySelectorAll('.error');
  
  errorMessages.forEach(error => {
    error.classList.remove('show');
    error.textContent = '';
  });
  
  errorFields.forEach(field => {
    field.classList.remove('error');
  });
}

// Save feedback to localStorage
function saveFeedbackToLocalStorage(name, email, subject, message) {
  const feedback = {
    name: name,
    email: email,
    subject: subject,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  // Get existing feedback array or create new one
  let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
  
  // Add new feedback
  feedbackList.push(feedback);
  
  // Save back to localStorage
  localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
  
  console.log('Feedback saved successfully!', feedback);
}

// Show success message
function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.classList.add('show');
  }
}

// Hide success message
function hideSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.classList.remove('show');
  }
}

// Optional: Open mailto with prefilled data
function openMailto(name, email, subject, message) {
  const mailtoSubject = subject || 'Feedback from Discover Lebanon';
  const mailtoBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
  
  window.location.href = mailtoLink;
}

// ========================================
// 3. GALLERY LIGHTBOX (Modal)
// ========================================
// Create modal elements dynamically
function createLightbox() {
  if (document.getElementById('lightbox')) return; // Already exists
  
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-image" src="" alt="">
    <div class="lightbox-caption"></div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Add lightbox styles
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      display: none;
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease;
    }
    
    .lightbox.show {
      display: flex;
    }
    
    .lightbox-image {
      max-width: 90%;
      max-height: 85%;
      object-fit: contain;
      animation: zoomIn 0.3s ease;
    }
    
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 40px;
      color: white;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .lightbox-close:hover {
      transform: scale(1.2);
    }
    
    .lightbox-caption {
      position: absolute;
      bottom: 30px;
      color: white;
      font-size: 1.2rem;
      text-align: center;
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 5px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes zoomIn {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize lightbox for gallery images
document.addEventListener('DOMContentLoaded', function() {
  const galleryImages = document.querySelectorAll('.gallery-item img, .thumb img');
  
  if (galleryImages.length > 0) {
    createLightbox();
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Add click event to all gallery images
    galleryImages.forEach(img => {
      img.style.cursor = 'pointer';
      
      img.addEventListener('click', function(e) {
        // Prevent navigation if image is inside a link
        const parentLink = this.closest('a');
        if (parentLink) {
          e.preventDefault();
        }
        
        lightboxImg.src = this.src;
        lightboxCaption.textContent = this.alt || 'Monument Image';
        lightbox.classList.add('show');
      });
    });
    
    // Close lightbox when clicking close button
    closeBtn.addEventListener('click', function() {
      lightbox.classList.remove('show');
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('show');
      }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        lightbox.classList.remove('show');
      }
    });
  }
});

// ========================================
// 4. SMOOTH SCROLL (BONUS FEATURE)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// 5. BACK TO TOP BUTTON (BONUS FEATURE)
// ========================================
// Create back to top button
function createBackToTopButton() {
  if (document.getElementById('backToTop')) return;
  
  const button = document.createElement('button');
  button.id = 'backToTop';
  button.innerHTML = '↑';
  button.title = 'Back to Top';
  
  document.body.appendChild(button);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #backToTop {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 24px;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    #backToTop.show {
      display: flex;
      animation: fadeInUp 0.3s ease;
    }
    
    #backToTop:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  });
  
  // Scroll to top when clicked
  button.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// ========================================
// 6. MOBILE MENU TOGGLE (if needed)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('nav');
  
  if (nav && window.innerWidth <= 768) {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
      const menuToggle = document.createElement('button');
      menuToggle.className = 'mobile-menu-toggle';
      menuToggle.innerHTML = '☰';
      menuToggle.setAttribute('aria-label', 'Toggle menu');
      
      nav.parentElement.insertBefore(menuToggle, nav);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          color: white;
          cursor: pointer;
          padding: 5px;
        }
        
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
          
          nav ul {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            padding: 20px;
          }
          
          nav ul.show {
            display: flex;
          }
          
          nav ul li {
            margin: 10px 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Toggle menu
      menuToggle.addEventListener('click', function() {
        const navList = nav.querySelector('ul');
        navList.classList.toggle('show');
      });
    }
  }
});

console.log('✅ Discover Lebanon JavaScript loaded successfully!');