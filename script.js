document.addEventListener("DOMContentLoaded", () => {

  const bagItemsContainer = document.querySelector(".bag-items");
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.getElementById("total-price");

  function getBag() {
    return JSON.parse(localStorage.getItem("bag")) || [];
  }

  function updateBagDisplay() {
    if (!bagItemsContainer) return;

    const bag = getBag();
    bagItemsContainer.innerHTML = "";

    if (bag.length === 0) {
      bagItemsContainer.innerHTML = "<li>Your bag is empty.</li>";
      totalItemsElement.textContent = "0";
      totalPriceElement.textContent = "0.00";
      return;
    }

    let total = 0;

    bag.forEach(item => {
      const li = document.createElement("li");
      li.className = "bag-item";
      li.innerHTML = `
        <img src="${item.image}" width="50">
        <div>
          <strong>${item.name}</strong><br>
          ${item.weight}<br>
          ₹${item.price}
        </div>
      `;
      bagItemsContainer.appendChild(li);
      total += item.price;
    });

    totalItemsElement.textContent = bag.length;
    totalPriceElement.textContent = total.toFixed(2);
  }

  window.sendBagToWhatsApp = function () {
    const bag = getBag();
    if (!bag.length) {
      alert("Your bag is empty");
      return;
    }

    let msg = "Hello, I would like to order:\n";
    bag.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} (${item.weight}) - ₹${item.price}\n`;
    });

    window.open(`https://wa.me/919701187805?text=${encodeURIComponent(msg)}`);
  };

  updateBagDisplay();
});
