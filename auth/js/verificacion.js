
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyAscPqbFzJxZiXYo-2FCcOynMv6HJfJmaE",
authDomain: "weblafactor.firebaseapp.com",
projectId: "weblafactor",
appId: "1:690032474707:web:e948852878cc6b6c8ee4a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
const miCuenta = document.querySelector(".btn-group");

if (user) {
    // Si está logueado, reemplaza el menú por un botón al dashboard
    miCuenta.innerHTML = `
    <a href="auth/comprador.html" class="btn btn-sm btn-light">Cuenta</a>
    <button class="btn btn-sm btn-danger" id="logoutBtn">Cerrar sesión</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => {
        window.location.reload();
    });
    });

} else {
    // Si no está logueado, se muestra el menú por defecto (ya está en el HTML original)
}
});
