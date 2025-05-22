document.addEventListener("DOMContentLoaded", () => {
  const CSV_URL   = "productos.csv";
  const selCat    = document.getElementById("catFilter");
  const txtSearch = document.getElementById("txtSearch");
  const table     = document.getElementById("table");
  const carousel  = document.getElementById("carousel-container");
  const prevBtn   = document.getElementById("prevSlide");
  const nextBtn   = document.getElementById("nextSlide");
  const catSect   = document.getElementById("category-section");
  let products  = [];
  let carouselIndex = 0;

  fetch(CSV_URL)
    .then(res => res.ok ? res.text() : Promise.reject("CSV no encontrado"))
    .then(parseCSV)
    .then(data => {
      products = data;
      buildFilters(products);
      renderAll(products);
    })
    .catch(err => {
      console.error(err);
      table.innerHTML = "<p>Error cargando productos.</p>";
    });

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const hdr   = lines.shift().split(";");
    return lines.map(l => {
      const cols = l.split(";");
      let o = {};
      hdr.forEach((h,i) => o[h] = cols[i] || "");
      return o;
    });
  }

  function buildFilters(data) {
    selCat.innerHTML = `<option value="all">Todas</option>`;
    [...new Set(data.map(p => p.category))].forEach(c => {
      selCat.insertAdjacentHTML(
        "beforeend",
        `<option value="${c}">${c}</option>`
      );
    });
    selCat.addEventListener("change", renderAll);
    txtSearch.addEventListener("input", renderAll);
    prevBtn.onclick = () => { carouselIndex = Math.max(0, carouselIndex-1); updateCarousel(); };
    nextBtn.onclick = () => { carouselIndex = Math.min(products.length-1, carouselIndex+1); updateCarousel(); };
  }

  function applyFilters() {
    const cat  = selCat.value;
    const term = txtSearch.value.toLowerCase();
    return products.filter(p => {
      const okCat  = cat === "all" || p.category === cat;
      const okTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        p.price.toLowerCase().includes(term);
      return okCat && okTerm;
    });
  }

  function renderAll() {
    const list = applyFilters();
    drawPolaroids(list);
    renderCarousel(list);
    renderByCategory(list);
  }

  function drawPolaroids(data) {
    table.innerHTML = "";
    const { width, height } = table.getBoundingClientRect();
    data.forEach(p => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.style.top = `${rand(0, height-150)}px`;
      fig.style.left = `${rand(0, width -120)}px`;
      fig.style.setProperty("--angle", `${rand(-10,10)}deg`);
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name;
      img.onerror = () => {
        img.replaceWith(Object.assign(document.createElement("div"), {
          className: "no-image",
          textContent: "Imagen no encontrada"
        }));
      };
      fig.appendChild(img);
      fig.addEventListener("click", () => fig.classList.toggle("selected"));
      table.appendChild(fig);
    });
  }

  function renderCarousel(data=products) {
    carousel.innerHTML = "";
    data.slice(0, 10).forEach(p => {
      const div = document.createElement("div");
      div.className = "carousel-item";
      div.innerHTML = `<img src="${p.image}" alt="${p.name}">`;
      carousel.appendChild(div);
    });
    carouselIndex = 0;
    updateCarousel();
  }

  function updateCarousel() {
    const offset = -carouselIndex * 216;
    carousel.style.transform = `translateX(${offset}px)`;
  }

  function renderByCategory(data) {
    catSect.innerHTML = "";
    const groups = data.reduce((g,p) => {
      (g[p.category] ||= []).push(p);
      return g;
    }, {});
    Object.entries(groups).forEach(([cat, items]) => {
      const box = document.createElement("div");
      box.className = "category-group";
      box.innerHTML = `<h3>${cat}</h3>`;
      items.slice(0,5).forEach((p,i) => {
        const img = document.createElement("img");
        img.src = p.image;
        img.className = "item";
        box.appendChild(img);
      });
      catSect.appendChild(box);
    });
  }

  function rand(min, max) {
    return Math.random() * (max-min) + min;
  }
});
