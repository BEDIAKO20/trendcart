/* =====================================================================
   TrendCart Fashion Store - Main JavaScript
   Handles: mobile menu toggle, product search/filter, FAQ accordion,
            cart quantity controls, add-to-cart feedback, on-page search,
            newsletter & contact form handling, dynamic cart counter.
   Pure vanilla JavaScript - no libraries required.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initProductSearchAndFilter();
    initFaqAccordion();
    initCartControls();
    initAddToCart();
    initForms();
    initHeaderSearch();
    updateCartCount();
});

/* ---------------------------------------------------------------------
   1. MOBILE MENU TOGGLE
   Toggles the vertical navigation menu open/closed on small screens.
   --------------------------------------------------------------------- */
function initMobileMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
        menu.classList.toggle("open");
        // Update ARIA state for accessibility
        var expanded = menu.classList.contains("open");
        toggle.setAttribute("aria-expanded", expanded);
    });

    // Close the menu when a link is clicked (better mobile UX)
    var links = menu.querySelectorAll("a");
    links.forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* ---------------------------------------------------------------------
   2. PRODUCT SEARCH & CATEGORY FILTER (products.html)
   Filters product cards live as the user types or clicks a category.
   --------------------------------------------------------------------- */
function initProductSearchAndFilter() {
    var searchInput = document.getElementById("productSearch");
    var filterButtons = document.querySelectorAll(".filter-btn");
    var products = document.querySelectorAll(".product-grid .product-card");
    var noResults = document.getElementById("noResults");

    // If we are not on a page with the product grid filter, stop here.
    if (!products.length || (!searchInput && !filterButtons.length)) return;

    var activeCategory = "all";

    function applyFilters() {
        var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var visibleCount = 0;

        products.forEach(function (card) {
            var name = (card.getAttribute("data-name") || "").toLowerCase();
            var category = (card.getAttribute("data-category") || "").toLowerCase();

            var matchesText = name.indexOf(term) !== -1;
            var matchesCategory = activeCategory === "all" || category === activeCategory;

            if (matchesText && matchesCategory) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Show / hide the "no results" message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    // Live text search
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // Category filter buttons
    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterButtons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            activeCategory = (btn.getAttribute("data-filter") || "all").toLowerCase();
            applyFilters();
        });
    });
}

/* ---------------------------------------------------------------------
   3. FAQ ACCORDION (faq.html)
   Expands / collapses answers. Closes other items for a clean look.
   --------------------------------------------------------------------- */
function initFaqAccordion() {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
        var question = item.querySelector(".faq-question");
        question.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");

            // Close all items first (single-open accordion)
            faqItems.forEach(function (other) {
                other.classList.remove("open");
                var q = other.querySelector(".faq-question");
                if (q) q.setAttribute("aria-expanded", "false");
            });

            // Toggle the clicked one
            if (!isOpen) {
                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
}

/* ---------------------------------------------------------------------
   4. CART QUANTITY CONTROLS (cart.html)
   Increase / decrease item quantity, remove item, recalc totals.
   --------------------------------------------------------------------- */
function initCartControls() {
    var cartItems = document.querySelector(".cart-items");
    if (!cartItems) return;

    cartItems.addEventListener("click", function (e) {
        var target = e.target;

        // Quantity increase
        if (target.classList.contains("qty-increase")) {
            var valEl = target.parentElement.querySelector(".qty-value");
            valEl.textContent = parseInt(valEl.textContent, 10) + 1;
            recalculateCart();
        }

        // Quantity decrease (minimum of 1)
        if (target.classList.contains("qty-decrease")) {
            var valEl2 = target.parentElement.querySelector(".qty-value");
            var current = parseInt(valEl2.textContent, 10);
            if (current > 1) {
                valEl2.textContent = current - 1;
                recalculateCart();
            }
        }

        // Remove item
        if (target.classList.contains("remove-item") ||
            target.closest(".remove-item")) {
            var item = target.closest(".cart-item");
            if (item) {
                item.remove();
                recalculateCart();
                checkEmptyCart();
            }
        }
    });

    // Initial calculation on load
    recalculateCart();
    checkEmptyCart();
}

/* Recalculate subtotal, shipping and grand total */
function recalculateCart() {
    var items = document.querySelectorAll(".cart-item");
    var subtotal = 0;

    items.forEach(function (item) {
        var price = parseFloat(item.getAttribute("data-price")) || 0;
        var qtyEl = item.querySelector(".qty-value");
        var qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
        var lineTotal = price * qty;

        // Update the per-item line total display if present
        var lineEl = item.querySelector(".line-total");
        if (lineEl) lineEl.textContent = "$" + lineTotal.toFixed(2);

        subtotal += lineTotal;
    });

    var shipping = subtotal > 0 ? 12.0 : 0;
    var total = subtotal + shipping;

    setText("summarySubtotal", "$" + subtotal.toFixed(2));
    setText("summaryShipping", "$" + shipping.toFixed(2));
    setText("summaryTotal", "$" + total.toFixed(2));
}

/* Show an "empty cart" message when no items remain */
function checkEmptyCart() {
    var items = document.querySelectorAll(".cart-item");
    var emptyMsg = document.getElementById("emptyCart");
    var summary = document.getElementById("cartSummary");
    if (!emptyMsg) return;

    if (items.length === 0) {
        emptyMsg.style.display = "block";
        if (summary) summary.style.display = "none";
    } else {
        emptyMsg.style.display = "none";
        if (summary) summary.style.display = "";
    }
}

/* ---------------------------------------------------------------------
   5. ADD TO CART (products & home pages)
   Increments a counter stored in localStorage and shows a toast.
   --------------------------------------------------------------------- */
function initAddToCart() {
    var buttons = document.querySelectorAll(".add-to-cart");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var count = getCartCount() + 1;
            localStorage.setItem("trendcart_count", count);
            updateCartCount();

            var name = btn.getAttribute("data-name") || "Item";
            showToast(name + " added to cart!");
        });
    });
}

/* Read cart count from localStorage */
function getCartCount() {
    return parseInt(localStorage.getItem("trendcart_count"), 10) || 0;
}

/* Update the little badge on the cart icon across pages */
function updateCartCount() {
    var badges = document.querySelectorAll(".cart-count");
    var count = getCartCount();
    badges.forEach(function (b) { b.textContent = count; });
}

/* ---------------------------------------------------------------------
   6. TOAST NOTIFICATION
   --------------------------------------------------------------------- */
var toastTimer;
function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;

    toast.querySelector(".toast-msg").textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

/* ---------------------------------------------------------------------
   7. FORM HANDLING (newsletter + contact)
   Prevents real submission (no backend) and shows a success note.
   --------------------------------------------------------------------- */
function initForms() {
    var forms = document.querySelectorAll(".js-form");
    forms.forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var note = form.querySelector(".form-note");
            if (note) {
                note.style.display = "block";
            }
            form.reset();
        });
    });
}

/* ---------------------------------------------------------------------
   8. HEADER ON-PAGE TEXT SEARCH
   On the products page, typing redirects the query into the filter.
   On other pages, it sends the user to products.html with a query string.
   --------------------------------------------------------------------- */
function initHeaderSearch() {
    var headerForms = document.querySelectorAll(".search-box");
    headerForms.forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var input = form.querySelector("input");
            var query = input ? input.value.trim() : "";

            var productSearch = document.getElementById("productSearch");
            if (productSearch) {
                // We're already on the products page - filter directly.
                productSearch.value = query;
                productSearch.dispatchEvent(new Event("input"));
                productSearch.scrollIntoView({ behavior: "smooth" });
            } else {
                // Redirect to the products page carrying the search term.
                window.location.href = "products.html?q=" + encodeURIComponent(query);
            }
        });
    });

    // If we land on products.html?q=..., apply the search automatically.
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var productSearch = document.getElementById("productSearch");
    if (q && productSearch) {
        productSearch.value = q;
        productSearch.dispatchEvent(new Event("input"));
    }
}

/* ---------------------------------------------------------------------
   Small helper: safely set text content by element id
   --------------------------------------------------------------------- */
function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}
