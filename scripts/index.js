import { meals } from "./data.js";

const container = document.getElementById("featured-meals");
const categoryButtons = document.querySelectorAll(".categories button");

// Function to display meals
function displayMeals(mealList) {
    container.innerHTML = "";

    mealList.forEach(meal => {
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

// Show all meals by default
displayMeals(meals);

// Category click event
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;
        const filteredMeals = meals.filter(meal => meal.category === category);
        displayMeals(filteredMeals);
    });
});

// Add to cart
window.addToCart = function (id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
};

