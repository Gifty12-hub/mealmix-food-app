// footer //
const currentYear = new Date().getFullYear();
const yearElem = document.getElementById("currentyear");
if (yearElem) yearElem.innerHTML = currentYear;

const lastModified = document.lastModified;
const modifiedElem = document.getElementById("lastModified");
if (modifiedElem) modifiedElem.innerHTML = "Last Modified: " + lastModified;


const mainnav = document.querySelector('.navbar');
const hambutton = document.querySelector('#menu');

if (mainnav && hambutton) {
  hambutton.addEventListener('click', () => {
    mainnav.classList.toggle('open');
    hambutton.classList.toggle('open');
  });
}

// scripts/cart.js

// Meal data (minimal – names, prices, images)
const meals = [
  { id: 1, name: "Jollof Rice with Chicken", price: 35, image: "images/jollof.jpg" },
  { id: 2, name: "Waakye Special", price: 30, image: "images/waakye.jpg" },
  { id: 3, name: "Grilled Tilapia & Banku", price: 50, image: "images/tilapia.jpg" },
  { id: 4, name: "Sobolo Drink", price: 10, image: "images/sobolo.jpg" },
  { id: 5, name: "Fufu with Goat Light Soup", price: 45, image: "images/fufu-light-soup.jpg" },
  { id: 6, name: "Red Red with Plantain & Avocado", price: 38, image: "images/red-red.jpg" },
  { id: 7, name: "Spicy Kelewele", price: 15, image: "images/kelewele.jpg" },
  { id: 8, name: "Banku & Okro Soup with Fish", price: 40, image: "images/banku-okro.jpg" },
  { id: 9, name: "Kenkey with Fish & Shito", price: 42, image: "images/kenkey-fish.jpg" },
  { id: 10, name: "Groundnut Soup with Chicken", price: 48, image: "images/peanut-soup.jpg" },
  { id: 11, name: "Haussa Koko & Koose", price: 25, image: "images/hausa-koko.jpg" },
  { id: 12, name: "Pineapple Ginger Sobolo", price: 12, image: "images/sobolo-pineapple.jpg" },
  { id: 13, name: "Boiled Yam with Kontomire Stew", price: 35, image: "images/yam-kontomire.jpg" },
  { id: 14, name: "Tuo Zaafi with Ayoyo Soup", price: 40, image: "images/tuo-zaafi.jpg" }
];

const cartItemsContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const itemCountElement = document.getElementById("item-count");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clear-cart");
const emptyMessage = document.getElementById("empty-message");

let cart = JSON.parse(localStorage.getItem("mealMixCart")) || [];

function saveCart() {
  localStorage.setItem("mealMixCart", JSON.stringify(cart));
  renderCart();
}

function getMeal(id) {
  return meals.find(m => m.id === id);
}

function calculateTotal() {
  return cart.reduce((sum, item) => {
    const meal = getMeal(item.id);
    return sum + (meal ? meal.price * (item.quantity || 1) : 0);
  }, 0);
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    totalElement.textContent = "0.00";
    itemCountElement.textContent = "0 items";
    checkoutBtn.disabled = true;
    clearCartBtn.style.display = "none";
    return;
  }

  emptyMessage.style.display = "none";
  checkoutBtn.disabled = false;
  clearCartBtn.style.display = "inline-block";

  const total = calculateTotal();
  totalElement.textContent = total.toFixed(2);
  itemCountElement.textContent = `${cart.reduce((sum, i) => sum + (i.quantity || 1), 0)} items`;

  cart.forEach(item => {
    const meal = getMeal(item.id);
    if (!meal) return;

    const qty = item.quantity || 1;
    const itemTotal = meal.price * qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}">
            <div class="cart-item-info">
                <h4>${meal.name}</h4>
                <p class="cart-item-price">GHS ${meal.price.toFixed(2)}</p>
                <p class="cart-item-subtotal">Subtotal: GHS ${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity-display">${qty}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
    cartItemsContainer.appendChild(div);
  });
}

// Event delegation for quantity & remove
cartItemsContainer.addEventListener("click", (e) => {
  const btn = e.target;
  const id = parseInt(btn.dataset.id);

  if (btn.dataset.action === "increase") {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity = (item.quantity || 1) + 1;
    saveCart();
  } else if (btn.dataset.action === "decrease") {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, (item.quantity || 1) - 1);
      if (item.quantity === 1) item.quantity = 1; // min 1
      saveCart();
    }
  } else if (btn.classList.contains("remove-btn")) {
    if (confirm("Remove this item from your cart?")) {
      cart = cart.filter(i => i.id !== id);
      saveCart();
    }
  }
});

// Clear entire cart
clearCartBtn.addEventListener("click", () => {
  if (confirm("Clear your entire cart?")) {
    cart = [];
    saveCart();
  }
});

// Checkout placeholder
checkoutBtn.addEventListener("click", () => {
  alert(`Proceeding to checkout!\nTotal: GHS ${totalElement.textContent}\n\n(WhatsApp order or payment coming soon!)`);
  // Future: window.location = "checkout.html";
});

// Load on start
renderCart();