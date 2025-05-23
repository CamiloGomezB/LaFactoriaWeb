// ==== FUNCIONALIDAD DE CARRITO DE COMPRAS ====

const carrito = [];
const listaCarrito = document.getElementById("lista-carrito");
const subtotalElem = document.getElementById("precio");
const impuestoElem = document.getElementById("impuesto");
const totalElem = document.getElementById("total");
const carritoBadge = document.querySelector(".fa-shopping-cart + .badge");
const favoritosBadge = document.querySelector(".fa-heart + .badge");
let favoritosCount = 0;

function actualizarResumenCarrito() {
  let subtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  let impuesto = +(subtotal * 0.035).toFixed(2);
  let total = +(subtotal + impuesto).toFixed(2);

  subtotalElem.textContent = `$${subtotal.toLocaleString()}`;
  impuestoElem.textContent = `$${impuesto.toLocaleString()}`;
  totalElem.textContent = `$${total.toLocaleString()}`;

  listaCarrito.innerHTML = "";
  carrito.forEach((prod, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${prod.nombre} - $${prod.precio.toLocaleString()} x ${prod.cantidad} ` +
      `<button onclick="eliminarDelCarrito(${index})">Eliminar</button> ` +
      `<button onclick="aumentarCantidad(${index})">+</button> ` +
      `<button onclick="disminuirCantidad(${index})">-</button>`;
    listaCarrito.appendChild(li);
  });

  carritoBadge.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarResumenCarrito();
}

function aumentarCantidad(index) {
  if (carrito[index].cantidad < 10) {
    carrito[index].cantidad++;
    actualizarResumenCarrito();
  }
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  actualizarResumenCarrito();
}

function vaciarCarrito() {
  carrito.length = 0;
  actualizarResumenCarrito();
}

function aplicarEstiloBoton(boton) {
  boton.style.backgroundColor = '#007BFF';
  boton.style.color = '#fff';
  boton.style.border = 'none';
  boton.style.borderRadius = '8px';
  boton.style.padding = '5px 10px';
  boton.style.margin = '5px 3px';
  boton.style.cursor = 'pointer';
}

const botonesCompra = document.querySelectorAll(".buy-button");
botonesCompra.forEach((btn) => {
  aplicarEstiloBoton(btn);

  const producto = btn.parentElement;
  const nombre = producto.querySelector("h2").textContent;
  const precio = parseFloat(producto.querySelectorAll("p")[1].textContent.replace(/[^\d.]/g, ""));
  const categoria = producto.querySelectorAll("p")[2].textContent;

  if (!producto.querySelector(".heart-button")) {
    const heartBtn = document.createElement("button");
    heartBtn.textContent = "❤";
    heartBtn.classList.add("heart-button");
    heartBtn.onclick = () => {
      favoritosCount++;
      favoritosBadge.textContent = favoritosCount;
    };
    aplicarEstiloBoton(heartBtn);
    producto.appendChild(heartBtn);

    const infoBtn = document.createElement("button");
    infoBtn.textContent = "ℹ️";
    infoBtn.classList.add("info-button");
    infoBtn.onclick = () => {
      alert(producto.querySelectorAll("p")[0].textContent);
    };
    aplicarEstiloBoton(infoBtn);
    producto.appendChild(infoBtn);
  }

  btn.addEventListener("click", () => {
    const existente = carrito.find(p => p.nombre === nombre);
    if (existente) {
      if (existente.cantidad < 10) existente.cantidad++;
    } else {
      carrito.push({ nombre, precio, categoria, cantidad: 1 });
    }
    actualizarResumenCarrito();
  });
});

const btnVaciar = document.createElement("button");
btnVaciar.textContent = "Vaciar Carrito";
btnVaciar.onclick = vaciarCarrito;
aplicarEstiloBoton(btnVaciar);
document.querySelector(".resumen-carrito").appendChild(btnVaciar);

// ==== FUNCIONALIDAD DE FILTROS ====
const filtroCategoria = document.getElementById("catFilter");
const inputBusqueda = document.getElementById("txtSearch");
const productos = document.querySelectorAll(".product");

const categoriasUnicas = [...new Set(Array.from(productos).map(p => p.querySelectorAll("p")[2].textContent))];
filtroCategoria.innerHTML = '<option value="">Todas</option>';
categoriasUnicas.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  filtroCategoria.appendChild(option);
});

function aplicarFiltros() {
  const categoria = filtroCategoria.value.toLowerCase();
  const texto = inputBusqueda.value.toLowerCase();

  productos.forEach(prod => {
    const nombre = prod.querySelector("h2").textContent.toLowerCase();
    const precio = prod.querySelectorAll("p")[1].textContent;
    const cat = prod.querySelectorAll("p")[2].textContent.toLowerCase();

    const coincideCategoria = categoria === "" || cat.includes(categoria);
    const coincideTexto = nombre.includes(texto) || precio.includes(texto);

    prod.style.display = coincideCategoria && coincideTexto ? "block" : "none";
  });
}

filtroCategoria.addEventListener("change", aplicarFiltros);
inputBusqueda.addEventListener("input", aplicarFiltros);

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product").forEach(producto => {
    if (!producto.querySelector(".heart-button")) {
      const heartBtn = document.createElement("button");
      heartBtn.textContent = "❤";
      heartBtn.classList.add("heart-button");
      heartBtn.onclick = () => {
        favoritosCount++;
        favoritosBadge.textContent = favoritosCount;
      };
      aplicarEstiloBoton(heartBtn);
      producto.appendChild(heartBtn);

      const infoBtn = document.createElement("button");
      infoBtn.textContent = "ℹ️";
      infoBtn.classList.add("info-button");
      infoBtn.onclick = () => {
        alert(producto.querySelectorAll("p")[0].textContent);
      };
      aplicarEstiloBoton(infoBtn);
      producto.appendChild(infoBtn);
    }
  });
});

const inputBusquedaTop = document.getElementById("txtSearchTop");

// Detectar cambios en la barra de búsqueda superior
inputBusquedaTop.addEventListener("input", () => {
  inputBusqueda.value = inputBusquedaTop.value;
  aplicarFiltros();
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  if (query) {
    inputBusqueda.value = query;
    inputBusquedaTop.value = query; // si usas barra superior también aquí
    aplicarFiltros();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const categoriaParam = params.get("categoria");

  if (query) {
    inputBusqueda.value = query;
    aplicarFiltros();
  }

  if (categoriaParam) {
    filtroCategoria.value = categoriaParam;
    aplicarFiltros();
  }
});