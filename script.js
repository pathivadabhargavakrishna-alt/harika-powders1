document.addEventListener("DOMContentLoaded", () => {

  const bagItemsContainer = document.querySelector(".bag-items");
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.getElementById("total-price");

  function getBag() {
    return JSON.parse(localStorage.getItem("bag")) || [];
  }

  function saveBag(bag) {
    localStorage.setItem("bag", JSON.stringify(bag));
  }

  function updateBagDisplay() {
    if (!bagItemsContainer) return;

    const bag = getBag();
    bagItemsContainer.innerHTML = "";

    if (bag.length === 0) {
      bagItemsContainer.innerHTML = "<li>Your bag is empty.</li>";
      totalItemsElement.textContent = "0";
      totalPriceElement.textContent = "₹0";
      return;
    }

    let total = 0;

    bag.forEach(product => {
      const li = document.createElement("li");
      li.className = "bag-item";
      li.innerHTML = `
        <img src="${product.image}" width="50">
        <div>
          <strong>${product.name}</strong><br>
          ${product.weight}<br>
          ₹${product.price}
        </div>
      `;
      bagItemsContainer.appendChild(li);
      total += product.price;
    });

    totalItemsElement.textContent = bag.length;
    totalPriceElement.textContent = `₹${total}`;
  }

  document.body.addEventListener("click", e => {
    if (!e.target.classList.contains("add-to-cart")) return;

    const productItem = e.target.closest(".product");
    const name = productItem.querySelector("h3").innerText;
    const desc = productItem.querySelector("p").innerText;
    const image = productItem.querySelector("img").src;
    const [weight, price] = productItem.querySelector(".weight-select").value.split("-");

    const bag = getBag();
    bag.push({ name, description: desc, image, weight, price: Number(price) });
    saveBag(bag);

    alert(`${name} added to cart`);
  });

  window.sendBagToWhatsApp = function () {
    const bag = getBag();
    if (!bag.length) {
      alert("Cart is empty");
      return;
    }

    let msg = "Hello, I would like to order:\n";
    bag.forEach((p, i) => {
      msg += `${i + 1}. ${p.name} (${p.weight}) - ₹${p.price}\n`;
    });

    window.open(`https://wa.me/919701187805?text=${encodeURIComponent(msg)}`);
  };

  updateBagDisplay();
});
