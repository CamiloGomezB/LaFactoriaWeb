// Importa los módulos de Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { getDatabase, ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Configuración única (usa solo una vez)
const firebaseConfig = {
    apiKey: "AIzaSyAscPqbFzJxZiXYo-2FCcOynMv6HJfJmaE",
    authDomain: "weblafactor.firebaseapp.com",
    databaseURL: "https://weblafactor.firebaseio.com",
    projectId: "weblafactor",
    storageBucket: "weblafactor.appspot.com",
    messagingSenderId: "690032474707",
    appId: "1:690032474707:web:e948852878cc6b6c8ee4a6"
};

// Inicializa la app solo si no está ya inicializada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa los servicios
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

// ----------- Manejo de formulario de productos -----------
const form = document.getElementById("producto-form");
const mensaje = document.getElementById("mensaje");

if (form) {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").files[0];

    if (!imagen) {
        mensaje.textContent = "Por favor selecciona una imagen.";
        return;
    }

    const rutaImagen = `productos/${Date.now()}-${imagen.name}`;
    const imagenRef = storageRef(storage, rutaImagen);

    try {
        await uploadBytes(imagenRef, imagen);
        const imagenURL = await getDownloadURL(imagenRef);

        const nuevoProductoRef = push(dbRef(database, "productos"));
        await set(nuevoProductoRef, {
        nombre,
        descripcion,
        precio,
        categoria,
        imagenURL
    });

    mensaje.textContent = "Producto agregado correctamente.";
    form.reset();
    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al subir el producto.";
    }
    });
}