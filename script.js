
// 1. Estado de la Aplicación
let products = JSON.parse(localStorage.getItem('vibe_products')) || [];
let cart = [];

// Configuración de la Tienda
const config = {
    whatsapp: "51987845932", // Cambia esto
    delivery: 10.00,
    minForDiscount: 100.00,
    discountRate: 0.10
};

// 2. Elementos del DOM
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const adminList = document.getElementById('admin-list');

// 3. Funciones de Renderizado
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach((p, index) => {
        productGrid.innerHTML += `
            <div class="card">
                <img src="${p.img || 'https://via.placeholder.com/400'}" alt="${p.name}">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p class="price-tag">S/ ${parseFloat(p.price).toFixed(2)}</p>
                    <button class="btn-add" onclick="addToCart(${index})">Comprar Ahora</button>
                </div>
            </div>
        `;
    });
}

function renderAdminList() {
    adminList.innerHTML = '<h3>Lista de Productos</h3>';
    products.forEach((p, index) => {
        const profit = p.price - p.cost;
        adminList.innerHTML += `
            <div style="background:#f9f9f9; padding:10px; margin:5px 0; border-radius:8px; font-size:13px;">
                <strong>${p.name}</strong> | Stock: ${p.stock} <br>
                Ganancia: S/ ${profit.toFixed(2)} (${((profit/p.cost)*100).toFixed(0)}%)
                <button onclick="deleteProduct(${index})" style="color:red; float:right; border:none; background:none; cursor:pointer;">Eliminar</button>
            </div>
        `;
    });
}

// 4. Lógica de Carrito
function addToCart(index) {
    cart.push(products[index]);
    updateCart();
}

function updateCart() {
    cartCount.innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += parseFloat(item.price);
        itemsDiv.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:10px 0;">
                <span>${item.name}</span>
                <span>S/ ${item.price} <button onclick="removeFromCart(${i})" style="border:none; background:none;">🗑️</button></span>
            </div>
        `;
    });

    const discount = subtotal >= config.minForDiscount ? subtotal * config.discountRate : 0;
    const total = subtotal - discount + config.delivery;

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('discount').innerText = discount.toFixed(2);
    document.getElementById('delivery-cost').innerText = config.delivery.toFixed(2);
    document.getElementById('total-price').innerText = total.toFixed(2);
}

function removeFromCart(i) {
    cart.splice(i, 1);
    updateCart();
}

// 5. WhatsApp Checkout
document.getElementById('btn-whatsapp').onclick = () => {
    const name = document.getElementById('client-name').value;
    const address = document.getElementById('client-address').value;
    
    if(!name || !address || cart.length === 0) {
        alert("Por favor completa tus datos y agrega productos.");
        return;
    }

    let message = `*NUEVO PEDIDO - MODAVIBE*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Dirección:* ${address}\n\n`;
    message += `📦 *Productos:*\n`;
    
    cart.forEach(item => {
        message += `- ${item.name} (S/ ${item.price})\n`;
    });

    const total = document.getElementById('total-price').innerText;
    message += `\n💰 *Total a pagar: S/ ${total}*\n\n`;
    message += `_Enviaré el comprobante de Yape a continuación._`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${config.whatsapp}&text=${encoded}`);
};

// 6. Gestión Admin
document.getElementById('product-form').onsubmit = (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById('p-name').value,
        img: document.getElementById('p-img').value,
        price: parseFloat(document.getElementById('p-price').value),
        cost: parseFloat(document.getElementById('p-cost').value),
        stock: parseInt(document.getElementById('p-stock').value),
        category: document.getElementById('p-category').value
    };

    products.push(newProduct);
    localStorage.setItem('vibe_products', JSON.stringify(products));
    renderProducts();
    renderAdminList();
    e.target.reset();
};

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('vibe_products', JSON.stringify(products));
    renderProducts();
    renderAdminList();
}

// 7. Modales e Interacción
document.getElementById('admin-btn').onclick = () => {
    document.getElementById('admin-modal').style.display = 'block';
    renderAdminList();
};
document.getElementById('cart-btn').onclick = () => document.getElementById('cart-modal').style.display = 'block';
document.getElementById('close-cart').onclick = () => document.getElementById('cart-modal').style.display = 'none';
document.getElementById('close-admin').onclick = () => document.getElementById('admin-modal').style.display = 'none';

// Inicialización
renderProducts();
