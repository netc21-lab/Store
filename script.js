
// 1. CONFIGURACIÓN DE SEGURIDAD
const ADMIN_PASSWORD = "miadmin2026"; // CAMBIA ESTA CLAVE AQUÍ
let isAdminAuthenticated = false;

// 2. ESTADO
let products = JSON.parse(localStorage.getItem('vibe_products')) || [];
let cart = [];
const config = {
    whatsapp: "51987845932", // Cambia a tu número
    delivery: 8.00
};

// 3. FUNCIONES DE PROTECCIÓN
function checkAdminAccess() {
    if (isAdminAuthenticated) {
        openModal('admin-modal');
        renderAdminList();
    } else {
        const pass = prompt("Introduce la contraseña de administrador:");
        if (pass === ADMIN_PASSWORD) {
            isAdminAuthenticated = true;
            openModal('admin-modal');
            renderAdminList();
        } else {
            alert("Contraseña incorrecta. Acceso denegado.");
        }
    }
}

function logoutAdmin() {
    isAdminAuthenticated = false;
    closeModal('admin-modal');
    alert("Sesión cerrada.");
}

// 4. RENDERIZADO PÚBLICO
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    products.forEach((p, index) => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.img || 'https://via.placeholder.com/300'}" alt="${p.name}">
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p class="price">S/ ${parseFloat(p.price).toFixed(2)}</p>
                    <button class="btn-buy" onclick="addToCart(${index})">Agregar</button>
                </div>
            </div>
        `;
    });
}

// 5. RENDERIZADO PRIVADO (Solo si es admin)
function renderAdminList() {
    const list = document.getElementById('admin-list');
    list.innerHTML = '<h3 style="margin:20px 0 10px 0">Inventario y Ganancias</h3>';
    products.forEach((p, index) => {
        const profit = p.price - p.cost;
        list.innerHTML += `
            <div style="background:#f4f4f4; padding:10px; border-radius:8px; margin-bottom:8px; font-size:12px; border-left:4px solid var(--primary);">
                <strong>${p.name}</strong><br>
                Costo: S/ ${p.cost} | Venta: S/ ${p.price}<br>
                <span style="color:green; font-weight:bold;">Ganancia: S/ ${profit.toFixed(2)}</span>
                <button onclick="deleteProduct(${index})" style="float:right; color:red; border:none; background:none; cursor:pointer;">Eliminar</button>
            </div>
        `;
    });
}

// 6. CARRITO Y WHATSAPP
function addToCart(index) {
    cart.push(products[index]);
    document.getElementById('cart-count').innerText = cart.length;
    updateCartUI();
}

function updateCartUI() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += parseFloat(item.price);
        itemsDiv.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span>${item.name}</span><span>S/ ${item.price}</span></div>`;
    });
    const total = subtotal + config.delivery;
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-cost').innerText = config.delivery.toFixed(2);
    document.getElementById('total-price').innerText = total.toFixed(2);
}

document.getElementById('btn-whatsapp').onclick = () => {
    const name = document.getElementById('client-name').value;
    const addr = document.getElementById('client-address').value;
    if(!name || !addr || cart.length === 0) return alert("Completa los datos del pedido");

    let text = `🛍️ *PEDIDO MODAVIBE*\n\nCliente: ${name}\nDirección: ${addr}\n\n*Productos:*\n`;
    cart.forEach(i => text += `- ${i.name} (S/ ${i.price})\n`);
    text += `\n*Total a pagar: S/ ${document.getElementById('total-price').innerText}*`;
    
    window.open(`https://api.whatsapp.com/send?phone=${config.whatsapp}&text=${encodeURIComponent(text)}`);
};

// 7. EVENTOS ADMIN
document.getElementById('product-form').onsubmit = (e) => {
    e.preventDefault();
    const p = {
        name: document.getElementById('p-name').value,
        img: document.getElementById('p-img').value,
        price: parseFloat(document.getElementById('p-price').value),
        cost: parseFloat(document.getElementById('p-cost').value),
        stock: parseInt(document.getElementById('p-stock').value),
        category: document.getElementById('p-category').value
    };
    products.push(p);
    localStorage.setItem('vibe_products', JSON.stringify(products));
    renderProducts();
    renderAdminList();
    e.target.reset();
};

function deleteProduct(i) {
    if(confirm("¿Eliminar este producto?")) {
        products.splice(i, 1);
        localStorage.setItem('vibe_products', JSON.stringify(products));
        renderProducts();
        renderAdminList();
    }
}

// 8. UTILIDADES MODAL
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
document.getElementById('admin-btn').onclick = checkAdminAccess;
document.getElementById('cart-btn').onclick = () => openModal('cart-modal');

renderProducts();

