import { meals } from "./data.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartContainer = document.getElementById("cart-items");
let total = 0;

cart.forEach(id => {
    let meal = meals.find(m => m.id === id);
    total += meal.price;

    cartContainer.innerHTML += `
    <div>
      <h4>${meal.name}</h4>
      <p>GHS ${meal.price}</p>
    </div>
  `;
});

document.getElementById("total").textContent = total;
