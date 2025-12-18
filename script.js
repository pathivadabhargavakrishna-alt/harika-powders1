document.addEventListener("DOMContentLoaded", function () {

  function getBag() {
    return JSON.parse(localStorage.getItem("bag")) || [];
  }

  function updateCartCount() {
    const count = getBag().length;
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;
  }

  document.body.addEventListener("click", function (e) {

    if (!e.target.classList.contains("add-to-cart")) return;

    const product = e.target.closest(".product-item");
    if (!product) {
      alert("Product not found");
      return;
    }

    const name = product.querySelector("h3").innerText;
    const image = product.querySelector("img").src;
    const select = product.querySelector(".weight-select");

    const [weight, price] = select.value.split("-");

    const bag = getBag();
    bag.push({
      name: name,
      image: image,
      weight: weight,
      price: Number(price)
    });

    localStorage.setItem("bag", JSON.stringify(bag));

    updateCartCount();
    alert(name + " added to cart");
  });

  updateCartCount();
});
