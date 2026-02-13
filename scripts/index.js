import { meals } from "./data.js";

const container = document.getElementById("featured-meals") ||
    document.getElementById("menu-items");

if (container) {
    meals.forEach(meal => {
        container.innerHTML += `
      <div class="meal-card">
        <img src="${meal.image}" width="150">
        <h3>${meal.name}</h3>
        <p>GHS ${meal.price}</p>
        <button onclick="addToCart(${meal.id})">Add to Cart</button>
      </div>
    `;
    });
}

window.addToCart = function (id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}
