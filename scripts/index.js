document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Find the food name from the closest card
            const card = event.target.closest('.food-card');
            const foodName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;

            console.log(`Added to cart: ${foodName} - ${priceText}`);

            // Optional: Give visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4caf50';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#388e3c';
            }, 1500);
        });
    });
});