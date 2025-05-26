import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Códigos fijos para roles especiales
const CODIGO_ADMIN = "CODIGOADMIN123456789012345";
const CODIGO_VENDEDOR = "CODIGOVENDEDOR123456789012";

// Función para convertir archivo a base64
async function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.readAsDataURL(file);
        lector.onload = () => resolve(lector.result); // Esto da el string base64 completo
        lector.onerror = error => reject(error);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const rolSelect = document.getElementById("rol");
    const codigoContainer = document.getElementById("codigoContainer");
    const errorMensaje = document.getElementById("errorMensaje");

    rolSelect.addEventListener("change", () => {
        const rol = rolSelect.value;
        codigoContainer.style.display = (rol === "admin") ? "block" : "none";
        document.getElementById("codigo").required = (rol === "admin");
    });

    document.getElementById("registroForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMensaje.style.display = "none";

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const rol = document.getElementById("rol").value;
        const codigoIngresado = document.getElementById("codigo").value;
        const telefono = document.getElementById("telefono").value;
        const ocupacion = document.getElementById("ocupacion").value;
        const fotoFile = document.getElementById("foto").files[0];

        // Validar código si es admin
        if (rol === "admin" && codigoIngresado !== CODIGO_ADMIN) {
            errorMensaje.textContent = "Código incorrecto para Administrador.";
            errorMensaje.style.display = "block";
            return;
        }

        try {
            // Crear usuario en Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: nombre });

            // Convertir imagen a base64 si existe
            let imagenBase64 = null;
            if (fotoFile) {
                imagenBase64 = await convertirABase64(fotoFile);
            }

            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, "vendedores", email), {
                nombre: nombre,
                rol: rol,
                telefono: telefono || "",
                ocupacion: ocupacion || "",
                imagen_base64: imagenBase64,
                correo: email
            });

            alert("Usuario registrado correctamente");
            window.location.href = "login.html";

        } catch (error) {
            console.error("Error en el registro:", error);
            errorMensaje.textContent = error.code === 'auth/email-already-in-use' 
                ? "Este correo ya está en uso. Por favor, usa otro."
                : "Error: " + error.message;
            errorMensaje.style.display = "block";
        }
    });
});
