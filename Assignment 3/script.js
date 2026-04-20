/* ═══════════════════════════════════════════════════
   AURUM — Luxury Fashion Store
   script.js
═══════════════════════════════════════════════════ */

/* ─── 1. CUSTOM CURSOR ───────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  // Follow mouse
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    // Ring follows with slight lag
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 80);
  });

  // Scale up on interactive elements
  const interactables = 'a, button, .product-card, .cat-card, .filter-btn';
  document.querySelectorAll(interactables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      ring.style.width    = '50px';
      ring.style.height   = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      ring.style.width    = '36px';
      ring.style.height   = '36px';
    });
  });
})();


/* ─── 2. NAVBAR — SCROLL EFFECT ──────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
})();


/* ─── 3. CART STATE ──────────────────────────────── */
let cartItems = [];
let cartCount = 0;

/**
 * Add a product to the cart.
 * @param {HTMLElement} btn - The "Add to Bag" button clicked.
 */
function addToCart(btn) {
  const card      = btn.closest('.product-card');
  const name      = card.querySelector('.product-name').textContent;
  const price     = parseInt(card.dataset.price, 10);
  const id        = card.dataset.id;
  const iconClass = card.querySelector('.product-icon').className;

  const existing = cartItems.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ id, name, price, qty: 1, icon: iconClass });
  }

  cartCount++;
  updateCartBadge();
  renderCart();
  showToast(`${name} added to bag`, 'fa-bag-shopping');
}

/**
 * Re-render the cart sidebar contents.
 */
function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('cartTotal');

  if (!cartItems.length) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    totalEl.textContent = '₹0';
    return;
  }

  let total = 0;

  container.innerHTML = cartItems
    .map((item) => {
      total += item.price * item.qty;
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <i class="${item.icon}" style="font-size:22px;color:rgba(0,0,0,0.15)"></i>
          </div>
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="remove-item" onclick="removeItem('${item.id}')">
            <i class="fa fa-trash-alt"></i>
          </button>
        </div>`;
    })
    .join('');

  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

/**
 * Increment or decrement quantity of a cart item.
 * @param {string} id    - Product ID.
 * @param {number} delta - +1 or -1.
 */
function changeQty(id, delta) {
  const item = cartItems.find((i) => i.id === id);
  if (!item) return;

  item.qty   += delta;
  cartCount  += delta;

  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  updateCartBadge();
  renderCart();
}

/**
 * Remove an item from the cart entirely.
 * @param {string} id - Product ID.
 */
function removeItem(id) {
  const item = cartItems.find((i) => i.id === id);
  if (!item) return;

  cartCount  -= item.qty;
  cartItems   = cartItems.filter((i) => i.id !== id);

  updateCartBadge();
  renderCart();
}

/** Update the cart badge number shown in the navbar. */
function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cartCount < 0 ? 0 : cartCount;
}


/* ─── 4. CART SIDEBAR TOGGLE ─────────────────────── */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}


/* ─── 5. PRODUCT FILTER ──────────────────────────── */
/**
 * Filter the product grid by category.
 * @param {string}           cat - Category key ('all', 'women', 'men', etc.)
 * @param {HTMLElement|null} btn - The filter button clicked (optional).
 */
function filterProducts(cat, btn = null) {
  // Update active button state
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // Show / hide products
  document.querySelectorAll('.product-card').forEach((card) => {
    const match = cat === 'all' || card.dataset.cat === cat;
    card.style.display   = match ? '' : 'none';
    card.style.animation = match ? 'heroReveal 0.5s ease both' : '';
  });

  // Scroll to products section if triggered from category cards
  if (!btn) {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });

    // Sync filter bar button
    document.querySelectorAll('.filter-btn').forEach((b) => {
      b.classList.toggle('active', b.textContent.trim().toLowerCase() === cat);
    });
  }
}


/* ─── 6. WISHLIST TOGGLE ─────────────────────────── */
/**
 * Toggle heart / wishlist state on a product.
 * @param {HTMLElement} btn - The wish button.
 */
function toggleWish(btn) {
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');

  if (btn.classList.contains('active')) {
    icon.className = 'fa fa-heart';
    showToast('Added to wishlist', 'fa-heart');
  } else {
    icon.className = 'fa-regular fa-heart';
  }
}


/* ─── 7. SEARCH OVERLAY ──────────────────────────── */
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  overlay.classList.toggle('open');

  if (overlay.classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 300);
  }
}

// Close search on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('searchOverlay').classList.remove('open');
  }
});


/* ─── 8. TOAST NOTIFICATIONS ─────────────────────── */
/**
 * Show a brief toast notification.
 * @param {string} msg  - Message text.
 * @param {string} icon - FontAwesome icon class (e.g. 'fa-heart').
 */
function showToast(msg, icon) {
  const el      = document.createElement('div');
  el.className  = 'toast-msg';
  el.innerHTML  = `<i class="fa ${icon}"></i> ${msg}`;
  document.getElementById('toastContainer').appendChild(el);

  // Auto-remove after animation completes
  setTimeout(() => el.remove(), 3100);
}


/* ─── 9. NEWSLETTER SUBSCRIPTION ────────────────── */
function subscribeNewsletter() {
  const input = document.getElementById('emailInput');
  const val   = input.value.trim();

  if (!val || !val.includes('@')) {
    showToast('Please enter a valid email', 'fa-exclamation');
    return;
  }

  showToast('Welcome to the circle!', 'fa-check');
  input.value = '';
}


/* ─── 10. MOBILE MENU ────────────────────────────── */
function toggleMobileMenu() {
  showToast('Mobile menu coming soon', 'fa-bars');
}


/* ─── 11. SCROLL REVEAL (Intersection Observer) ─── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();
