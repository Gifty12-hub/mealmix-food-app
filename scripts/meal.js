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


// scripts/meal.js

const container = document.getElementById("menu-items");
const categoryBtns = document.querySelectorAll(".categories button");
const searchInput = document.getElementById("search");

let cart = JSON.parse(localStorage.getItem("mealMixCart")) || [];
let currentData = []; // stores the currently loaded items (meals or drinks)
let allAvailableData = []; // stores all items for searching across
let currentCategory = "all"; // track current category filter

// Static fallback Ghanaian dishes (your original local list)
const yourStaticGhanaianArray = [
    {
        idMeal: 1001,
        strMeal: "Jollof Rice with Chicken",
        strMealThumb: "images/jollof.webp",
        strCategory: "Lunch"
    },
    {
        idMeal: 1002,
        strMeal: "Hausa Kooko with Koose",
        strMealThumb: "images/kooko.webp",
        strCategory: "Breakfast"
    },
    {
        idMeal: 1003,
        strMeal: "Fufu with Goat Light Soup",
        strMealThumb: "images/fufu.webp",
        strCategory: "Dinner"
    },
    {
        idMeal: 1004,
        strMeal: "Banku & Okro Soup with Fish",
        strMealThumb: "images/banku.webp",
        strCategory: "Dinner"
    },
    {
        idMeal: 1005,
        strMeal: "Red Red with Plantain & Avocado",
        strMealThumb: "images/redred.webp",
        strCategory: "Lunch"
    },
    {
        idMeal: 1006,
        strMeal: "Spicy Kelewele",
        strMealThumb: "images/kelewele.webp",
        strCategory: "Snacks"
    },
    {
        idMeal: 1007,
        strMeal: "Kenkey with Fish & Shito",
        strMealThumb: "images/kenkey.webp",
        strCategory: "Lunch"
    },
    {
        idMeal: 1008,
        strMeal: "Groundnut Soup with Chicken",
        strMealThumb: "images/peanut.webp",
        strCategory: "Dinner"
    },
    {
        idMeal: 1009,
        strMeal: "Tuo Zaafi with Ayoyo Soup",
        strMealThumb: "images/tuo.webp",
        strCategory: "Dinner"
    },
    {
        idMeal: 1010,
        strMeal: "Boiled Yam with Kontomire Stew",
        strMealThumb: "images/yam.webp",
        strCategory: "Lunch"
    },
    {
        idMeal: 1011,
        strMeal: "Pineapple Ginger Sobolo",
        strMealThumb: "images/sobolo.webp",
        strCategory: "Drinks"
    }
];

// Ghanaian-focused search terms (for TheMealDB)
const ghanaianFoodKeywords = [
    "jollof", "waakye", "fufu", "banku", "red red", "kenkey", "groundnut", "peanut soup",
    "okro", "tilapia", "kelewele", "yam", "kontomire", "light soup", "tuo zaafi", "ayoyo", "sobolo",
];

// Helper: Save cart
function saveCart() {
    localStorage.setItem("mealMixCart", JSON.stringify(cart));
}

// Add to cart (works for both meal.idMeal and drink.idDrink)
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
        const name = item.strMeal || item.strDrink || "Unknown Dish";
        const thumb = item.strMealThumb || item.strDrinkThumb || "https://via.placeholder.com/300x200?text=Ghanaian+Food";
        const id = item.idMeal || item.idDrink || Date.now();

        const card = document.createElement("div");
        card.className = "meal-card";
        card.innerHTML = `
            <img src="${thumb}" alt="${name}" loading="lazy">
            <h3>${name}</h3>
            <p class="price">GHS ${(Math.random() * 30 + 15).toFixed(2)}</p>
            <button onclick="addToCart(${id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Fetch Ghanaian-relevant meals from TheMealDB with fallback
async function fetchGhanaianMeals() {
    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:4rem;"><div class="spinner"></div>Loading local Ghanaian dishes...</div>';

    try {
        // Search for multiple Ghanaian terms in parallel
        const searches = ghanaianFoodKeywords.map(async (keyword) => {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`);
            const data = await res.json();
            return data.meals || [];
        });

        const allResults = await Promise.all(searches);
        let combined = allResults.flat();  // all API results together

        // Fallback to static Ghanaian dishes if too few results from API
        if (combined.length < 5) {
            // Simple dedupe by name to avoid duplicates
            const existingNames = new Set(combined.map(m => (m.strMeal || "").toLowerCase()));
            const uniqueStatic = yourStaticGhanaianArray.filter(s =>
                !existingNames.has((s.strMeal || "").toLowerCase())
            );
            combined = combined.concat(uniqueStatic);
        }

        // Optional: Fetch full details for some items (2nd endpoint)
        const detailed = await Promise.all(
            combined.slice(0, 12).map(async (m) => {
                if (!m.strInstructions) { // only fetch if basic info
                    const detail = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
                    const d = await detail.json();
                    return d.meals?.[0] || m;
                }
                return m;
            })
        );

        currentData = detailed;
        allAvailableData = detailed; // Store all data for searching
        renderMeals(detailed);
    } catch (err) {
        console.error("MealDB error:", err);
        // Fallback even on error
        currentData = yourStaticGhanaianArray;
        allAvailableData = yourStaticGhanaianArray;
        renderMeals(yourStaticGhanaianArray);
    }
}

// Fetch drinks from TheCocktailDB
async function fetchDrinks() {
    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:4rem;"><div class="spinner"></div>Loading refreshing drinks...</div>';

    try {
        // Get local drinks first
        const localDrinks = yourStaticGhanaianArray.filter(item => item.strCategory === "Drinks");

        // Try hibiscus first (closest to sobolo/bissap)
        let res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Hibiscus');
        let data = await res.json();
        let drinks = data.drinks || [];

        // Fallback to ginger or non-alcoholic if nothing found
        if (!drinks.length) {
            res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Ginger');
            data = await res.json();
            drinks = data.drinks || [];
        }

        // Full details
        const detailed = await Promise.all(
            drinks.slice(0, 10).map(async (d) => {
                const detailRes = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${d.idDrink}`);
                const dData = await detailRes.json();
                return dData.drinks?.[0] || d;
            })
        );

        // Combine local drinks with API drinks
        const combined = [...localDrinks, ...detailed];
        currentData = combined;
        allAvailableData = combined;
        renderMeals(combined);
    } catch (err) {
        console.error("CocktailDB error:", err);
        // Show local drinks if API fails
        const localDrinks = yourStaticGhanaianArray.filter(item => item.strCategory === "Drinks");
        currentData = localDrinks;
        allAvailableData = localDrinks;
        renderMeals(localDrinks);
    }
}

// Category click handler
categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.dataset.category;
        currentCategory = category;
        searchInput.value = ""; // Clear search when changing category

        if (category === "Drinks") {
            fetchDrinks();
        } else if (category === "all") {
            currentData = yourStaticGhanaianArray;
            allAvailableData = yourStaticGhanaianArray;
            renderMeals(yourStaticGhanaianArray);
        } else {
            // Filter by the selected category (Breakfast, Lunch, Dinner, Snacks)
            const filtered = yourStaticGhanaianArray.filter(item => item.strCategory === category);
            currentData = filtered;
            allAvailableData = yourStaticGhanaianArray; // Keep all data for search
            renderMeals(filtered);
        }
    });
});

// Live search on all available data
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    let searchPool = allAvailableData.length > 0 ? allAvailableData : currentData;

    // If searching, search the full pool
    let filtered = searchPool.filter(item =>
        (item.strMeal || item.strDrink || "").toLowerCase().includes(query)
    );

    // If a category filter is active (not "all"), apply category filter to search results
    if (currentCategory !== "all" && currentCategory !== "Drinks" && query) {
        filtered = filtered.filter(item => item.strCategory === currentCategory);
    }

    renderMeals(filtered);
});

// Initial load: Ghanaian-focused meals
fetchGhanaianMeals();