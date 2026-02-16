// scripts/meal.js

const container = document.getElementById("menu-items");
const categoryBtns = document.querySelectorAll(".categories button");
const searchInput = document.getElementById("search");

let cart = JSON.parse(localStorage.getItem("mealMixCart")) || [];
let currentData = []; // stores the currently loaded items (meals or drinks)

// Helper: Save cart
function saveCart() {
    localStorage.setItem("mealMixCart", JSON.stringify(cart));
}

// Add to cart (works for both meal.idMeal and drink.idDrink → we use idMeal/idDrink as id)
window.addToCart = function (id) {
    let item = cart.find(i => i.id === id);
    if (item) item.quantity = (item.quantity || 1) + 1;
    else cart.push({ id, quantity: 1 });
    saveCart();

    const toast = document.createElement("div");
    toast.textContent = "Added ✓";
    toast.style.cssText = `position:fixed; bottom:30px; right:30px; background:#27ae60; color:white; padding:10px 20px; border-radius:8px; z-index:1000; box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
};

// Unified render function (works for both MealDB and CocktailDB data)
function renderMeals(list) {
    container.innerHTML = "";
    if (!list.length) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:5rem 1rem; font-size:1.4rem;">No items found.</p>';
        return;
    }

    list.forEach(item => {
        const card = document.createElement("div");
        card.className = "meal-card";
        card.innerHTML = `
            <img src="${item.strMealThumb || item.strDrinkThumb}" alt="${item.strMeal || item.strDrink}" loading="lazy">
            <h3>${item.strMeal || item.strDrink}</h3>
            <p class="price">GHS ${(Math.random() * 30 + 10).toFixed(2)}</p> <!-- mock price -->
            <button onclick="addToCart(${item.idMeal || item.idDrink})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Fetch meals from TheMealDB
async function fetchMeals(category = 'All') {
    try {
        let url;
        if (category === 'All') {
            url = 'https://www.themealdb.com/api/json/v1/1/search.php?s='; // broad search (limited results)
        } else {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        let meals = data.meals || [];

        // Fetch full details (2nd endpoint) for richer info
        const detailed = await Promise.all(
            meals.slice(0, 12).map(async (m) => { // limit to avoid too many requests
                const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
                const detail = await detailRes.json();
                return detail.meals?.[0] || m;
            })
        );

        currentData = detailed;
        renderMeals(detailed);
    } catch (err) {
        console.error("MealDB error:", err);
        container.innerHTML = '<p style="color:#e74c3c; text-align:center;">Error loading meals. Try again.</p>';
    }
}

// Fetch drinks from TheCocktailDB
async function fetchDrinks() {
    try {
        // Endpoint 1: Filter by category (e.g., Non_Alcoholic for mocktails like Sobolo-style)
        const filterUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'; // or 'c=Cocktail'

        const filterRes = await fetch(filterUrl);
        const filterData = await filterRes.json();
        let drinks = filterData.drinks || [];

        // Endpoint 2: Get full details (ingredients, instructions, etc.)
        const detailedDrinks = await Promise.all(
            drinks.slice(0, 12).map(async (d) => {
                const detailRes = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${d.idDrink}`);
                const detail = await detailRes.json();
                return detail.drinks?.[0] || d;
            })
        );

        currentData = detailedDrinks;
        renderMeals(detailedDrinks);
    } catch (err) {
        console.error("CocktailDB error:", err);
        container.innerHTML = '<p style="color:#e74c3c; text-align:center;">Error loading drinks. Try again.</p>';
    }
}

// Category click handler – switch API based on category
categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.dataset.category;

        if (category === "Drinks") {
            fetchDrinks(); // Use TheCocktailDB
        } else {
            fetchMeals(category); // Use TheMealDB
        }
    });
});

// Live search (filters the current loaded data)
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = currentData.filter(item =>
        (item.strMeal || item.strDrink || "").toLowerCase().includes(query)
    );
    renderMeals(filtered);
});

// Initial load – show All meals from TheMealDB
fetchMeals('All');

container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';