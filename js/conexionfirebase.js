const admin = require("firebase-admin");

// Leer la variable de entorno con la clave (en formato JSON)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://weblafacto.firebaseapp.com/" // Reemplaza con tu URL real
});

// Ahora puedes usar Firestore
const db = admin.firestore();

// Ejemplo: Leer documentos de la colección "usuarios"
db.collection("usuarios").get().then(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
});
