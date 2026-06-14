// Veloce Tech — Landing Page Application Script

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let cart = [];

  // --- UI SELECTORS ---
  const spotlightGrid = document.getElementById('main-spotlight-grid');
  const navbar = document.getElementById('main-navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer-container');
  const uiBackdrop = document.getElementById('ui-backdrop-overlay');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartItemsWrapper = document.getElementById('cart-items-wrapper');
  const cartEmptyMessage = document.getElementById('cart-empty-message');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
  const toastContainer = document.getElementById('toast-notifications-container');
  const faqItems = document.querySelectorAll('.faq-item');
  const newsletterForm = document.getElementById('newsletter-subscription-form');
  const tiltCards = document.querySelectorAll('.tilt-card');
  const addToCartTriggers = document.querySelectorAll('.add-to-cart-trigger');

  // --- 1. SPOTLIGHT GRID BACKGROUND ---
  if (spotlightGrid) {
    window.addEventListener('mousemove', (e) => {
      // Use client coordinates relative to window viewport since grid is fixed
      spotlightGrid.style.setProperty('--mouse-x', `${e.clientX}px`);
      spotlightGrid.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }

  // --- 2. 3D TILT CARD EFFECT ---
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update variables for hover glow direction
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Calculate rotation angles based on cursor position relative to center of card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Max tilt rotation 10 degrees
      const rotateX = -((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      // Combine tilt and slightly lift card towards camera (translateZ)
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset card transform to neutral
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  // --- 3. NAVBAR SCROLL EFFECT ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 4. MOBILE DRAWER TOGGLE ---
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu when clicking nav links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  function openMobileMenu() {
    mobileNavDrawer.classList.add('open');
    mobileMenuBtn.classList.add('active');
    // Simple hamburger line transform
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'translateY(8px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
  }

  function closeMobileMenu() {
    mobileNavDrawer.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }

  // --- 5. SHOPPING CART DRAWER ACTIONS ---
  if (cartToggleBtn && cartCloseBtn && cartDrawer && uiBackdrop) {
    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    uiBackdrop.addEventListener('click', () => {
      closeCart();
      closeMobileMenu();
    });
  }

  function openCart() {
    cartDrawer.classList.add('open');
    uiBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock main scroll
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    uiBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll
  }

  // --- 6. ADD TO CART TRIGGER LOGIC ---
  addToCartTriggers.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering card tilts unexpectedly
      
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      const image = button.getAttribute('data-image');

      addItemToCart(id, name, price, image);
    });
  });

  function addItemToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1, image });
    }

    showToast(`Added ${name} to cart.`);
    updateCartUI();
    animateCartBadge();
  }

  // Update quantities
  function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
      removeItemFromCart(id);
    } else {
      updateCartUI();
    }
  }

  function removeItemFromCart(id) {
    const item = cart.find(item => item.id === id);
    cart = cart.filter(item => item.id !== id);
    if (item) {
      showToast(`Removed ${item.name} from cart.`);
    }
    updateCartUI();
  }

  // Animate shopping cart badge
  function animateCartBadge() {
    cartBadgeCount.classList.add('bounce');
    setTimeout(() => {
      cartBadgeCount.classList.remove('bounce');
    }, 300);
  }

  // Redraw Shopping Cart
  function updateCartUI() {
    // 1. Calculate count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeCount.textContent = totalItems;

    // 2. Clear items wrapper (except empty template message)
    const existingItemElements = cartItemsWrapper.querySelectorAll('.cart-item');
    existingItemElements.forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmptyMessage.style.display = 'flex';
      cartSubtotalVal.textContent = '$0.00';
    } else {
      cartEmptyMessage.style.display = 'none';
      let subtotal = 0;

      // Generate nodes for each cart item
      cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const cartItemNode = document.createElement('div');
        cartItemNode.className = 'cart-item';
        cartItemNode.innerHTML = `
          <div class="cart-item-img-wrapper">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          </div>
          <div class="cart-item-details">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
              <div class="quantity-controls">
                <button class="quantity-btn dec-btn" data-id="${item.id}">-</button>
                <span class="quantity-val">${item.quantity}</span>
                <button class="quantity-btn inc-btn" data-id="${item.id}">+</button>
              </div>
              <button class="cart-item-remove-btn remove-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>
        `;
        cartItemsWrapper.appendChild(cartItemNode);
      });

      // Update total
      cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;

      // Attach event listeners for dynamic controls inside cart drawer
      cartItemsWrapper.querySelectorAll('.dec-btn').forEach(btn => {
        btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), -1));
      });
      cartItemsWrapper.querySelectorAll('.inc-btn').forEach(btn => {
        btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), 1));
      });
      cartItemsWrapper.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItemFromCart(btn.getAttribute('data-id')));
      });
    }
  }

  // Checkout process simulation
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty. Add products to checkout.', 'error');
        return;
      }

      // Simulate success
      showToast('Order placed successfully! Integration simulated.', 'success');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // --- 7. TOAST NOTIFICATION CONTROLLER ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const isSuccess = type === 'success';
    const isError = type === 'error';
    
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-indicator ${isSuccess ? 'success' : ''}"></span>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Close action
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(toast);
    }, 4000);
  }

  function removeToast(toast) {
    if (toast.parentNode) {
      toast.classList.add('removing');
      // Wait for CSS fadeout animation before removal
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }

  // --- 8. FAQ ACCORDION INTERACTION ---
  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other accordion blocks
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- 9. NEWSLETTER FORM ACTIONS ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email-input');
      showToast(`Subscription successful for ${emailInput.value}!`, 'success');
      emailInput.value = '';
    });
  }
});
