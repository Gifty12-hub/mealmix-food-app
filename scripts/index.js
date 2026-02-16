// script/index.js

import { meals } from "./data.js";

// ────────────────────────────────────────────────
// DOM Elements
// ────────────────────────────────────────────────
const container = document.getElementById("featured-meals");
const categoryButtons = document.querySelectorAll(".categories button");
const searchInput = document.getElementById("search");

// ────────────────────────────────────────────────
// Cart Management
// ────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("mealMixCart")) || [];

function saveCart() {
    localStorage.setItem("mealMixCart", JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (!cartLink) return;

    let badge = cartLink.querySelector(".cart-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        cartLink.appendChild(badge);
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems || "";
    badge.style.display = totalItems > 0 ? "inline-flex" : "none";
}

window.addToCart = function (id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveCart();
    showToast("Added to cart ✓");
};

// Simple toast notification
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast";
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 500);
    }, 1800);
}

// ────────────────────────────────────────────────
// Render Meals (safer than innerHTML concatenation)
// ────────────────────────────────────────────────
function renderMeals(mealList) {
    container.innerHTML = ""; // clear previous content

    if (mealList.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:3rem;">No meals found in this category.</p>';
        return;
    }

    mealList.forEach(meal => {
        const card = document.createElement("div");
        card.className = "meal-card";
        card.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}" loading="lazy">
            <h3>${meal.name}</h3>
            <p class="price">GHS ${meal.price.toFixed(2)}</p>
            <button class="add-btn">Add to Cart</button>
        `;

        // Add click handler to button
        card.querySelector(".add-btn").addEventListener("click", () => {
            window.addToCart(meal.id);
        });

        container.appendChild(card);
    });
}

// ────────────────────────────────────────────────
// Category Filtering
// ────────────────────────────────────────────────
function filterAndRender(category) {
    let filtered = meals;

    if (category !== "all") {
        filtered = meals.filter(meal => meal.category === category);
    }

    renderMeals(filtered);
}

// Handle category buttons
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove active from all buttons
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;
        filterAndRender(category);
    });
});

// Add "All" button dynamically (recommended)
const allButton = document.createElement("button");
allButton.textContent = "All";
allButton.dataset.category = "all";
allButton.classList.add("active");
document.querySelector(".categories").prepend(allButton);

allButton.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    allButton.classList.add("active");
    filterAndRender("all");
});

// ────────────────────────────────────────────────
// Live Search (optional but useful)
// ────────────────────────────────────────────────
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Get current active category
        const activeBtn = document.querySelector(".categories button.active");
        const currentCategory = activeBtn ? activeBtn.dataset.category : "all";

        let filtered = meals;
        if (currentCategory !== "all") {
            filtered = filtered.filter(m => m.category === currentCategory);
        }

        if (query) {
            filtered = filtered.filter(meal =>
                meal.name.toLowerCase().includes(query)
            );
        }

        renderMeals(filtered);
    });
}

// ────────────────────────────────────────────────
// Initialization
// ────────────────────────────────────────────────
renderMeals(meals);           // Show all by default
updateCartBadge();            // Show initial cart count