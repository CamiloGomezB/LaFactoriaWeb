function validarRegistro() {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
  
    if (!nombre || !email || !pass) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    if (!email.includes("@")) {
      alert("Correo inválido.");
      return false;
    }
    if (pass.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
  
    return true;
  }
  
  function validarLogin() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
  
    if (!email || !pass) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
  
    return true;
  }
  