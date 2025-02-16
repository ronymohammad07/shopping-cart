let cart = [];
let promoApplied = false;

document.addEventListener("DOMContentLoaded", () => {
    // Load data from localStorage on page load
    loadCartFromLocalStorage();
    loadProducts();
});

function loadProducts() {
    const products = [
        { id: 1, name: "Organic Turmeric Immune Booster", price: 2000, img: "photo/organicturmericimmunebooster (1).png" },
        { id: 2, name: "Organic Turmeric Immune Booster", price: 2000, img: "photo/organicturmericimmunebooster (2).png" },
        { id: 3, name: "Organic Turmeric Immune Booster", price: 2000, img: "photo/organicturmericimmunebooster (3).png" },
        { id: 4, name: "Organic Turmeric Immune Booster", price: 2000, img: "photo/organicturmericimmunebooster (4).png" },
        { id: 5, name: "Product A", price: 50, img: "photo/product1.jpg.png" },
        { id: 6, name: "Product B", price: 75, img: "photo/product2.jpg.png" }
    ];

    const productList = document.getElementById("product-list");
    products.forEach(product => {
        let productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });

    // Add event listeners dynamically after products are loaded
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(id, name, price);
        });
    });
}

function showCart() {
    const cartSection = document.querySelector(".cart");
    cartSection.classList.add("show");
}

function hideCart() {
    const cartSection = document.querySelector(".cart");
    cartSection.classList.remove("show");
}

function addToCart(id, name, price) {
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    showCart(); // Show the cart when an item is added
}

function updateCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
            let itemElement = document.createElement("p");
            itemElement.innerText = `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;
            cartItems.appendChild(itemElement);
        });
    }

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("total").innerText = subtotal.toFixed(2);
    document.getElementById("cart-count").innerText = totalItems;
}

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
}

function applyPromo() {
    const promoCode = document.getElementById("promoCode").value;
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");

    if (promoApplied) {
        errorMsg.innerText = "Promo code already applied.";
        successMsg.innerText = "";
        return;
    }

    let discount = 0;
    let discountPercentage = 0;

    switch (promoCode.trim()) {
        case "ostad10":
            discountPercentage = 0.1; // 10% discount
            break;
        case "ostad5":
            discountPercentage = 0.05; // 5% discount
            break;
        default:
            errorMsg.innerText = "Invalid promo code.";
            successMsg.innerText = "";
            return;
    }

    const subtotal = parseFloat(document.getElementById("subtotal").innerText);
    discount = subtotal * discountPercentage;
    const total = subtotal - discount;

    discountElement.innerText = discount.toFixed(2);
    totalElement.innerText = total.toFixed(2);
    promoApplied = true;

    // Save promo state to localStorage
    localStorage.setItem("promoApplied", true);
    localStorage.setItem("discount", discount.toFixed(2));
    localStorage.setItem("total", total.toFixed(2));

    successMsg.innerText = `Promo code "${promoCode}" applied successfully!`;
    errorMsg.innerText = "";
}

function loadPromoFromLocalStorage() {
    const promoState = localStorage.getItem("promoApplied");
    if (promoState) {
        promoApplied = true;
        const discount = localStorage.getItem("discount");
        const total = localStorage.getItem("total");
        document.getElementById("discount").innerText = discount;
        document.getElementById("total").innerText = total;
    }
}

function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
}
// Call this function when the page loads to check for promo code application state
loadPromoFromLocalStorage();
