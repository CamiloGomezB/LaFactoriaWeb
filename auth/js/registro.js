import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAscPqbFzJxZiXYo-2FCcOynMv6HJfJmaE",
    authDomain: "weblafactor.firebaseapp.com",
    projectId: "weblafactor",
    storageBucket: "weblafactor.firebasestorage.app",
    messagingSenderId: "690032474707",
    appId: "1:690032474707:web:e948852878cc6b6c8ee4a6",
    measurementId: "G-XFFS2Z77EY"
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  
  const productoform = document.getElementById("productoform");
  const inputnombre_producto = document.getElementById("nombre_producto");
  const inputdescripcion = document.getElementById("descripcion");
  const inputprecio = document.getElementById("precio");
  const inputcantidad = document.getElementById("Cantidad");
  const inputcategoria = document.getElementById("categoria");
  const inputimagen = document.getElementById("imagen");

  productoform.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = inputnombre_producto;
    const descrip = inputdescripcion;
    const pre = inputprecio;
    const cant = inputcantidad;
    const cate = inputcategoria;
    const ima = inputimagen;

    try {
      await addDoc(collection(firestore, "usuarios"), {
        nombre_producto : nombre,
        descripcion : descrip,
        precio : pre,
        Cantidad: cant,
        categoria: cate,

      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  });
  
  


// Explicacion (X, Y, Z) 
//X hace referencia al "id" (#) del input de entrada de datos
//inputX hace referencia al elemento "input" + el atributo id que posee
//Y hace referencia al nombre de campo (base de datos)
//Z hace referencia al nombre de la colección (base de datos)


