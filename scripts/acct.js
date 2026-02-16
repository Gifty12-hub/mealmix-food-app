// footer //
const currentYear = new Date().getFullYear();
const yearElem = document.getElementById("currentyear");
if (yearElem) yearElem.innerHTML = currentYear;

const lastModified = document.lastModified;
const modifiedElem = document.getElementById("lastModified");
if (modifiedElem) modifiedElem.innerHTML = "Last Modified: " + lastModified;


// scripts/acct.js

// Mock user data (in real app use backend + localStorage/session)
let currentUser = null; // { name, email, address }

const authSection = document.getElementById("auth-section");
const profileSection = document.getElementById("profile-section");
const authForm = document.getElementById("auth-form");
const authBtn = document.getElementById("auth-btn");
const authMessage = document.getElementById("auth-message");
const tabBtns = document.querySelectorAll(".tab-btn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("full-name");
const addressInput = document.getElementById("address");
const saveAddressBtn = document.getElementById("save-address");
const logoutBtn = document.getElementById("logout");
const orderHistory = document.getElementById("order-history");
const noOrders = document.getElementById("no-orders");

// Mock order history (replace with real data later)
const mockOrders = [
  { id: "ORD-001", date: "Feb 10, 2026", total: 85.00, items: "Jollof Rice ×2, Sobolo ×1" },
  { id: "ORD-002", date: "Feb 5, 2026", total: 120.00, items: "Fufu & Light Soup, Banku & Okro" }
];

// Tab switch (Login / Register)
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    authBtn.textContent = tab === "login" ? "Login" : "Register";
    nameInput.style.display = tab === "register" ? "block" : "none";
    authMessage.textContent = "";
  });
});

// Handle login/register (mock)
authForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password) {
    authMessage.textContent = "Please fill in all fields";
    authMessage.style.color = "#e74c3c";
    return;
  }

  const isRegister = authBtn.textContent === "Register";

  if (isRegister && !name) {
    authMessage.textContent = "Please enter your full name";
    return;
  }

  // Mock success
  currentUser = {
    name: isRegister ? name : email.split("@")[0],
    email,
    address: localStorage.getItem("deliveryAddress") || ""
  };

  localStorage.setItem("mealMixUser", JSON.stringify(currentUser));
  authMessage.textContent = isRegister ? "Account created! Logging in..." : "Welcome back!";
  authMessage.style.color = "#27ae60";

  setTimeout(() => {
    authSection.style.display = "none";
    profileSection.style.display = "block";
    loadProfile();
  }, 1200);
});

// Load profile
function loadProfile() {
  const savedUser = JSON.parse(localStorage.getItem("mealMixUser"));
  if (savedUser) {
    currentUser = savedUser;
    document.getElementById("user-name").textContent = currentUser.name;
    document.getElementById("user-email").textContent = currentUser.email;
    addressInput.value = currentUser.address || "";

    // Load mock orders
    if (mockOrders.length > 0) {
      orderHistory.innerHTML = "";
      mockOrders.forEach(order => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <strong>Order #${order.id}</strong>
                    <div>Date: ${order.date}</div>
                    <div>Items: ${order.items}</div>
                    <div>Total: GHS ${order.total.toFixed(2)}</div>
                `;
        orderHistory.appendChild(li);
      });
      noOrders.style.display = "none";
    } else {
      noOrders.style.display = "block";
    }
  }
}

// Save address
saveAddressBtn.addEventListener("click", () => {
  const newAddress = addressInput.value.trim();
  if (newAddress && currentUser) {
    currentUser.address = newAddress;
    localStorage.setItem("mealMixUser", JSON.stringify(currentUser));
    localStorage.setItem("deliveryAddress", newAddress);
    document.getElementById("address-message").textContent = "Address saved!";
    setTimeout(() => document.getElementById("address-message").textContent = "", 3000);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("mealMixUser");
    currentUser = null;
    profileSection.style.display = "none";
    authSection.style.display = "block";
    authForm.reset();
    authMessage.textContent = "You have been logged out.";
    authMessage.style.color = "#27ae60";
  }
});

// Init
if (localStorage.getItem("mealMixUser")) {
  loadProfile();
  authSection.style.display = "none";
  profileSection.style.display = "block";
}