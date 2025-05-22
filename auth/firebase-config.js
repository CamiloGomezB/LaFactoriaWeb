// Configura tu proyecto (sustituye con tus datos de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAscPqbFzJxZiXYo-2FCcOynMv6HJfJmaE",
    authDomain: "weblafactor.firebaseapp.com",
    projectId: "weblafactor",
    appId: "1:690032474707:web:e948852878cc6b6c8ee4a6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();



function registrarUsuario(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nombre = document.getElementById("nombre").value;
    const rol = document.getElementById("rol").value;

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Usuario registrado correctamente");

        // Puedes guardar nombre y rol en Firestore si luego lo necesitas
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
}


function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert("Sesión iniciada correctamente");
        // Redirige o muestra interfaz protegida aquí
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
}
