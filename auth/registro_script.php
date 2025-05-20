<?php
include("conexion.php");

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$rol = $_POST['rol'];

// Verifica si el usuario ya existe
$verificar = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
$verificar->bind_param("s", $email);
$verificar->execute();
$resultado = $verificar->get_result();

if ($resultado->num_rows > 0) {
    echo "El correo ya está registrado.";
    exit();
}

// Insertar nuevo usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $password, $rol);

if ($stmt->execute()) {
    // ✅ Redirección al index predeterminado en la raíz del sitio
    header("index.html");
    exit();
} else {
    echo "Error al registrar: " . $stmt->error;
}
?>

