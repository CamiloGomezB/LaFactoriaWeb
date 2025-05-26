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
  const vendedoresPorProducto = {
  "Máscara Indígena": { img: "img/vendor-1.png", nombre: "Juan, carpintero especializado en muebles rústicos" },
  "Lagartija de porcelana": { img: "img/vendor-2.png", nombre: "Luisa, ceramista artesanal" },
  "Corazon de mamá": { img: "img/vendor-3.png", nombre: "Carlos, experto en cuero" },
  "Sobre mesa": { img: "img/vendor-4.png", nombre: "Diana, diseñadora de ropa" },
  "mochila wuayu": { img: "img/vendor-5.png", nombre: "Oscar, escultor artesanal" },
  "Buho Tejido": { img: "img/vendor-6.png", nombre: "María, bordadora tradicional" }
  };
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

  btn.textContent = "Contactar";

  btn.addEventListener("click", async () => {
    const correo = data.correo;
    if (!correo) {
        alert("Este producto no tiene vendedor asignado.");
        return;
    }

    try {
        const vendedorRef = doc(firestore, "vendedores", correo);
        const vendedorSnap = await getDoc(vendedorRef);

        if (!vendedorSnap.exists()) {
            alert("No se encontró información del vendedor.");
            return;
        }

        const vendedor = vendedorSnap.data();

        // Validación opcional por rol
        if (vendedor.rol !== "vendedor") {
            alert("El usuario asociado no está registrado como vendedor.");
            return;
        }

        // Mostrar información
        const panel = document.getElementById("info-contacto");
        const imagenVendedor = document.getElementById("foto");
        const contenido = document.getElementById("telefono");

        imagenVendedor.src = vendedor.foto || 'img/vendor-default.jpg';
        imagenVendedor.alt = vendedor.nombre || "Vendedor";

        contenido.innerHTML = `
            Para más información sobre <strong>${data.nombre_producto}</strong>, comunícate al número:<br>
            <span style="font-size: 1.2rem;">${vendedor.telefono || 'No disponible'}</span><br><br>
            <span style="font-size: 0.95rem;">Atendido por: ${vendedor.nombre || 'Sin nombre'}</span><br>
            <span style="font-size: 0.85rem;">Ocupación: ${vendedor.ocupacion || 'No indicada'}</span>
        `;

        panel.style.display = "block";
    } catch (error) {
        console.error("Error al obtener el vendedor:", error);
        alert("No se pudo obtener la información del vendedor.");
    }
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