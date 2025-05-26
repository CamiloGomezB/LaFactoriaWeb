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

// Función para convertir archivo a base64
function convertirABase64(file) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(file);
    lector.onload = () => resolve(lector.result);
    lector.onerror = error => reject(error);
  });
}

// 🔐 FUNCIÓN EXPORTADA: Guardar datos del vendedor en Firestore con imagen en base64
export async function guardarVendedorEnFirestore({ nombre, email, rol, telefono, ocupacion, fotoFile }) {
  try {
    let imagenBase64 = "";
    if (fotoFile) {
      imagenBase64 = await convertirABase64(fotoFile);
    }

    await setDoc(doc(firestore, "vendedores", email), {
      nombre,
      email,
      rol,
      telefono,
      ocupacion,
      imagen_base64: imagenBase64
    });

    console.log("✅ Datos del vendedor guardados en Firestore.");
  } catch (error) {
    console.error("❌ Error al guardar vendedor:", error);
  }
}
