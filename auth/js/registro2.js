import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAscPqbFzJxZiXYo-2FCcOynMv6HJfJmaE",
  authDomain: "weblafactor.firebaseapp.com",
  projectId: "weblafactor",
  storageBucket: "weblafactor.appspot.com",
  messagingSenderId: "690032474707",
  appId: "1:690032474707:web:e948852878cc6b6c8ee4a6"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

// DOM
const registroForm = document.getElementById("registroForm");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputRol = document.getElementById("rol");
const inputTelefono = document.getElementById("telefono");
const inputOcupacion = document.getElementById("ocupacion");
const inputFoto = document.getElementById("foto");
const mensajeDiv = document.getElementById("mensaje");

// Función para convertir archivo a base64
    function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.readAsDataURL(file);
        lector.onload = () => resolve(lector.result); // Esto da el string base64 completo
        lector.onerror = error => reject(error);
    });
    }
    export async function guardarDatosVendedor() {
    registroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const correo = inputEmail.value.trim();
    const nombre = inputNombre.value.trim();
    const rol = inputRol.value.trim();
    const telefeno = inputTelefono.value.trim();
    const ocupacion = inputOcupacion.value.trim();
    const archivoImagen = inputFoto.files[0];

    if (!archivoImagen) {
        mensajeDiv.textContent = "⚠️ Debes seleccionar una imagen.";
        mensajeDiv.style.color = "orange";
        return;
    }

    try {
        // Convertir imagen a base64
        const imagenBase64 = await convertirABase64(archivoImagen);

        // Guardar en Firestore
        await setDoc(doc(firestore, "vendedores", correo), {
        nombre: nombre,
        rol: rol,
        telefono: telefeno,
        ocupacion: ocupacion,
        imagen_base64: imagenBase64,
        correo: correo
        });

        mensajeDiv.textContent = "✅ Producto guardado";
        mensajeDiv.style.color = "green";
        productoform.reset();
    } catch (error) {
        console.error("❌ Error al guardar producto:", error);
        mensajeDiv.textContent = "❌ Error al guardar producto.";
        mensajeDiv.style.color = "red";
    }

});
    }
