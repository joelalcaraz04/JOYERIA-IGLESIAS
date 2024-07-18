document.addEventListener('DOMContentLoaded', () => {
    const listaCarrito = document.getElementById('lista-producto');
    const iconoCarritoSpan = document.getElementById('icono-carrito-span');
    const precioTotalDiv = document.querySelector('.precio-total');

    let carrito = [];

    const obtenerCarritoDeLocalStorage = () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    };

    const obtenerProductosDeJson = async () => {
        try {
            const response = await fetch('/JSON/PULSERAS3.json'); // Asegúrate de que el archivo JSON esté disponible
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    };

    const mostrarCarrito = (carrito, listaPruductos) => {
        listaCarrito.innerHTML = '';
        let totalProductos = 0;
        let totalPrecio = 0;

        carrito.forEach(carritoItem => {
            totalProductos += carritoItem.quantity;
            const producto = listaPruductos.find(p => p.id == carritoItem.product_id);

            if (!producto) {
                console.error(`Producto con ID ${carritoItem.product_id} no encontrado.`);
                return;
            }

            totalPrecio += producto.price * carritoItem.quantity;

            const itemCarrito = document.createElement('div');
            itemCarrito.classList.add('producto');
            itemCarrito.innerHTML = `
                <div class="prod-imagen">
                    <img src="${producto.image}" alt="${producto.name}">
                </div>
                <div class="prod-nombre">
                    ${producto.name}
                </div>
                <div class="prod-precio">
                    ${producto.price * carritoItem.quantity}€
                </div>
                <div class="prod-cantidad">
                    <span class="minus" data-id="${producto.id}"><</span>
                    <span>${carritoItem.quantity}</span>
                    <span class="plus" data-id="${producto.id}">></span>
                </div>
            `;
            listaCarrito.appendChild(itemCarrito);
        });

        iconoCarritoSpan.innerText = totalProductos;
        precioTotalDiv.innerHTML = `<strong>Total:</strong> ${totalPrecio.toFixed(2)}€`;

        document.querySelectorAll('.prod-cantidad .minus').forEach(button => {
            button.addEventListener('click', (event) => {
                const product_id = event.target.dataset.id;
                updateCartQuantity(product_id, -1);
            });
        });

        document.querySelectorAll('.prod-cantidad .plus').forEach(button => {
            button.addEventListener('click', (event) => {
                const product_id = event.target.dataset.id;
                updateCartQuantity(product_id, 1);
            });
        });
    };

    const updateCartQuantity = (product_id, change) => {
        const index = carrito.findIndex(item => item.product_id == product_id);
        if (index >= 0) {
            carrito[index].quantity += change;
            if (carrito[index].quantity <= 0) {
                carrito.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(carrito));
            obtenerProductosDeJson().then(listaPruductos => mostrarCarrito(carrito, listaPruductos));
        }
    };

    const init = async () => {
        carrito = obtenerCarritoDeLocalStorage();
        const listaPruductos = await obtenerProductosDeJson();
        mostrarCarrito(carrito, listaPruductos);
    };

    init();
});
let iconoCarrito = document.querySelector('.icono-carrito');
let body = document.querySelector('body');
let cerrar = document.querySelector('.boton-cerrar');
let listaPruductos = [];
let listaCarrito = document.querySelector('.lista-producto');
let iconoCarritoSpan = document.querySelector('.icono-carrito span');

let carrito = [];

iconoCarrito.addEventListener('click', () => {
    body.classList.toggle('show-carrito');
});

cerrar.addEventListener('click', () => {
    body.classList.toggle('show-carrito');
});

// AÑADIR PRODUCTOS DESDE EL JSON(BD SOON...)
const añadirProdHTML = () => {
    const container = document.getElementById('producto-container');
    container.innerHTML = '';
    
    listaPruductos.forEach(product => {
        let nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4'); // Añadir clases Bootstrap
        nuevoProducto.dataset.id = product.id;
        nuevoProducto.innerHTML = `
            <div class="card" data-id="${product.id}">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <div class="titulo-producto">
                        <h5>${product.name}</h5>
                    </div>
                    <div class="desc-producto">
                        <p>${product.desc}</p>
                    </div>
                    <div class="precio-boton d-flex justify-content-between align-items-center">
                        <div class="precio">
                            <span>${product.price}€</span>
                        </div>
                        <div class="boton-comprar">
                            <button class="comprar btn btn-primary">
                                <span class="comprar">COMPRAR</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(nuevoProducto);
    });
};

document.getElementById('producto-container').addEventListener('click', (event) => {
    let positionclick = event.target;
    if(positionclick.classList.contains('comprar')){
        let product_id = positionclick.closest('.card').dataset.id;
        addtocart(product_id);
    }
});

const addtocart = (product_id) => {
    let posicioncarrito = carrito.findIndex((value) => value.product_id == product_id);
    if(posicioncarrito < 0){
        carrito.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carrito[posicioncarrito].quantity += 1;
    }
    añadircarritoHTMLmemory();
    añadircarritoHTML();
};

const updateCartQuantity = (product_id, change) => {
    let posicioncarrito = carrito.findIndex((value) => value.product_id == product_id);
    if(posicioncarrito >= 0) {
        carrito[posicioncarrito].quantity += change;
        if (carrito[posicioncarrito].quantity <= 0) {
            carrito.splice(posicioncarrito, 1); // Remove product if quantity is zero
        }
        añadircarritoHTMLmemory();
        añadircarritoHTML();
    }
};

const añadircarritoHTMLmemory = () => {
    localStorage.setItem('cart', JSON.stringify(carrito));
};

const añadircarritoHTML = () => {
    const listaCarrito = document.getElementById('lista-producto');
    const iconoCarritoSpan = document.getElementById('icono-carrito-span');
    const precioTotalDiv = document.querySelector('.precio-total');
    listaCarrito.innerHTML = '';
    let totalProductos = 0;
    let totalPrecio = 0;
    
    if (carrito.length > 0) {
        carrito.forEach(carritoItem => {
            totalProductos += carritoItem.quantity;
            let nuevocarrito = document.createElement('div');
            nuevocarrito.classList.add('producto');
            let posicionProducto = listaPruductos.findIndex((value) => value.id == carritoItem.product_id);
            if (posicionProducto === -1) {
                console.error(`Product with ID ${carritoItem.product_id} not found.`);
                return;
            }
            let info = listaPruductos[posicionProducto];
            totalPrecio += info.price * carritoItem.quantity; // Calcular el precio total
            nuevocarrito.innerHTML = `
                <div class="prod-imagen">
                    <img src="${info.image}" alt="${info.name}">
                </div>
                <div class="prod-nombre">
                    ${info.name}
                </div>
                <div class="prod-precio">
                    ${info.price * carritoItem.quantity}€
                </div>
                <div class="prod-cantidad">
                    <span class="minus" data-id="${info.id}"><</span>
                    <span>${carritoItem.quantity}</span>
                    <span class="plus" data-id="${info.id}">></span>
                </div>
            `;
            listaCarrito.appendChild(nuevocarrito);
        });
    }
    
    // Mostrar el total de productos en el icono del carrito
    iconoCarritoSpan.innerText = totalProductos;
    
    // Mostrar el precio total al final del carrito
    precioTotalDiv.innerHTML = `
        <div class="total-precio">
            <strong>Total:</strong> ${totalPrecio.toFixed(2)}€
        </div>
    `;

    // Add event listeners for plus and minus buttons
    document.querySelectorAll('.prod-cantidad .minus').forEach(button => {
        button.addEventListener('click', (event) => {
            const product_id = event.target.dataset.id;
            updateCartQuantity(product_id, -1);
        });
    });
    
    document.querySelectorAll('.prod-cantidad .plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const product_id = event.target.dataset.id;
            updateCartQuantity(product_id, 1);
        });
    });
};

const initApp = () => {
    fetch('/JSON/PULSERAS3.json')
    .then(response => response.json())
    .then(data => {
        listaPruductos = data;
        añadirProdHTML();

        if(localStorage.getItem('cart')){
            carrito = JSON.parse(localStorage.getItem('cart'));
            añadircarritoHTML();
        }
    });
};

initApp();
