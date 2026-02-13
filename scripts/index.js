document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.food-card');
            const foodName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = Number(priceText.replace('GH₵', ''));

            const item = {
                name: foodName,
                price: price
            };

            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));

            button.textContent = 'Added!';
            button.style.backgroundColor = '#4caf50';

            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#388e3c';
            }, 1500);
        });
    });
});
