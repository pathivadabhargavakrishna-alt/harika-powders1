document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       HELPERS
    ========================= */

    function getBag() {
        return JSON.parse(localStorage.getItem('bag')) || [];
    }

    function saveBag(bag) {
        localStorage.setItem('bag', JSON.stringify(bag));
    }

    /* =========================
       UPDATE CART UI
    ========================= */

    function updateBagDisplay() {
        const bagItemsContainer = document.getElementById('bag-items');
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');

        // If not cart page, safely exit
        if (!bagItemsContainer || !totalItemsElement || !totalPriceElement) {
            return;
        }

        const bag = getBag();
        bagItemsContainer.innerHTML = '';

        if (bag.length === 0) {
            bagItemsContainer.innerHTML = '<li>Your cart is empty</li>';
            totalItemsElement.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return;
        }

        let totalItems = 0;
        let totalPrice = 0;

        bag.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'bag-item';

            li.innerHTML = `
                <img src="${item.image}" width="60" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <p>Weight: ${item.weight}</p>
                    <strong>₹${item.price}</strong>
                    <br>
                    <button class="remove-item" data-index="${index}">
                        Remove
                    </button>
                </div>
            `;

            bagItemsContainer.appendChild(li);
            totalItems++;
            totalPrice += item.price;
        });

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    /* =========================
       ADD TO CART
    ========================= */

    document.body.addEventListener('click', (e) => {

        /* ---- ADD ITEM ---- */
        if (e.target.classList.contains('add-to-cart')) {

            const product = e.target.closest('.product');
            if (!product) return;

            const weightSelect = product.querySelector('.weight-select');
            const [weight, price] = weightSelect.value.split('-');

            const item = {
                name: product.querySelector('h3').innerText,
                description: product.querySelector('p').innerText,
                image: product.querySelector('img').src,
                weight: weight,
                price: Number(price)
            };

            const bag = getBag();
            bag.push(item);
            saveBag(bag);

            alert('Item added to cart');
            updateBagDisplay();
        }

        /* ---- REMOVE ITEM ---- */
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            const bag = getBag();
            bag.splice(index, 1);
            saveBag(bag);
            updateBagDisplay();
        }
    });

    /* =========================
       WHATSAPP ORDER
    ========================= */

    function sendBagToWhatsApp() {
        const bag = getBag();
        if (bag.length === 0) {
            alert('Your cart is empty');
            return;
        }

        let message = '🛒 *New Order Request* \n\n';

        bag.forEach((item, i) => {
            message += `${i + 1}. ${item.name}\n`;
            message += `   ${item.weight} - ₹${item.price}\n\n`;
        });

        const total = bag.reduce((sum, i) => sum + i.price, 0);
        message += `💰 *Total: ₹${total}*`;

        const phone = '919701187805'; // change if needed
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    /* =========================
       WHATSAPP BUTTON
    ========================= */

    const bagSection = document.querySelector('.bag');
    if (bagSection) {
        const btn = document.createElement('button');
        btn.textContent = 'Order via WhatsApp';
        btn.className = 'whatsapp-button';
        btn.addEventListener('click', sendBagToWhatsApp);
        bagSection.appendChild(btn);
    }

    /* =========================
       INITIAL LOAD
    ========================= */

    updateBagDisplay();

});
