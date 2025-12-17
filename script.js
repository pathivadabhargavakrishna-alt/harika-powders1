document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const bagItemsContainer = document.querySelector('.bag-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    const bag = JSON.parse(localStorage.getItem('bag')) || [];

    if (!bag.length) {
        console.log('Bag is empty or localStorage is not working.');
        alert('Your cart is empty. Please add items again.');
    }

    // Example bag items (replace with dynamic data)
    const bagItems = [
        { name: "Product 1", price: 10.99, quantity: 2 },
        { name: "Product 2", price: 5.49, quantity: 1 },
        { name: "Product 3", price: 7.99, quantity: 3 },
        { name: "Product 4", price: 12.49, quantity: 1 },
        { name: "Product 5", price: 3.99, quantity: 5 },
        { name: "Product 6", price: 8.99, quantity: 2 },
        { name: "Product 7", price: 6.49, quantity: 4 },
        { name: "Product 8", price: 9.99, quantity: 1 },
        { name: "Product 9", price: 4.99, quantity: 6 },
        { name: "Product 10", price: 11.99, quantity: 2 },
        { name: "Product 11", price: 14.99, quantity: 1 },
        { name: "Product 12", price: 2.99, quantity: 7 }
    ];

    // Function to update the bag display
    function updateBagDisplay() {
        const bagItemsContainer = document.querySelector('.bag-items');
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');

        // Fetch the latest bag data from localStorage
        const bag = JSON.parse(localStorage.getItem('bag')) || [];
        console.log('Updating bag display with items:', bag);

        if (!bagItemsContainer) return;

        bagItemsContainer.innerHTML = '';

        if (bag.length === 0) {
            bagItemsContainer.innerHTML = '<li>Your bag is empty.</li>';
            totalItemsElement.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return;
        }

        let totalItems = 0;
        let totalPrice = 0;

        bag.forEach((product) => {
            const bagItem = document.createElement('li');
            bagItem.classList.add('bag-item');

            bagItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                <div>
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p>Weight: ${product.weight}</p>
                    <p>Price: ₹${product.price}</p>
                </div>
            `;

            bagItemsContainer.appendChild(bagItem);

            totalItems += 1;
            totalPrice += product.price;
        });

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Event delegation for "Add to Cart" buttons
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            console.log('Add to Cart button clicked');
            const button = event.target;
            const productItem = button.parentElement;
            const productName = productItem.querySelector('h3').innerText;
            const productDescription = productItem.querySelector('p').innerText;
            const productImage = productItem.querySelector('img').src;
            const weightSelect = productItem.querySelector('.weight-select');
            const [weight, price] = weightSelect.value.split('-');

            const product = {
                name: productName,
                description: productDescription,
                image: productImage,
                weight: weight,
                price: parseInt(price, 10)
            };

            try {
                const bag = JSON.parse(localStorage.getItem('bag')) || [];
                bag.push(product);
                localStorage.setItem('bag', JSON.stringify(bag));
                console.log(`${productName} (${weight}) added to bag for ₹${price}.`);
                alert(`${productName} (${weight}) has been added to your bag for ₹${price}.`);
                updateBagDisplay();
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Unable to add item to cart. Please try again.');
            }
        }
    });

    // Function to send bag details to WhatsApp
    function sendBagToWhatsApp() {
        if (bag.length === 0) {
            alert('Your bag is empty!');
            return;
        }

        let message = 'Hello, I would like to order the following items:\n';

        bag.forEach((product, index) => {
            message += `${index + 1}. ${product.name} - ${product.description} (Weight: ${product.weight}, Price: ₹${product.price})\n`;
        });

        const whatsappUrl = `https://wa.me/919701187805?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Add WhatsApp button to the bag section
    const bagSection = document.querySelector('.bag');
    const whatsappButton = document.createElement('button');
    whatsappButton.innerText = 'Order via WhatsApp';
    whatsappButton.classList.add('whatsapp-button');
    whatsappButton.addEventListener('click', sendBagToWhatsApp);
    bagSection.appendChild(whatsappButton);

    // Initial bag display
    console.log('Current bag contents:', bag);
    if (window.location.pathname.includes('bag.html')) {
        console.log('Bag page detected. Updating bag display.');
        updateBagDisplay();
    }

    // Ensure the bag display updates on bag.html page load
    if (window.location.pathname.includes('bag.html')) {
        document.addEventListener('DOMContentLoaded', updateBagDisplay);
    }

    updateBagUI();
});