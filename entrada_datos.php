<?php
$host = "medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com";  // Endpoint de tu base de datos en AWS
$user = "admin";   // Usuario de la base de datos
$password = "AZS12ADSFsa1";  // Contraseña del usuario
$dbname = "medidor_temperatura";  // Nombre de la base de datos

// Crear la conexión
$mysqli = new mysqli($host, $user, $password, $dbname);

// Verificar si hay errores en la conexión
if ($mysqli->connect_error) {
    die("Error en la conexión: " . $mysqli->connect_error);
}

// Obtener los datos de la solicitud POST, con validación
$serie = isset($_POST['serie']) ? $mysqli->real_escape_string($_POST['serie']) : '';
$temperatura = isset($_POST['temp']) ? $mysqli->real_escape_string($_POST['temp']) : '';

if (!empty($serie) && !empty($temperatura)) {
    // Preparar la consulta
    $stmt = $mysqli->prepare("INSERT INTO datos (Fecha, Serie, Temperatura) VALUES (current_timestamp(), ?, ?)");
    
    // Verificar si la consulta fue preparada correctamente
    if ($stmt) {
        // Enlazar los parámetros
        $stmt->bind_param('ss', $serie, $temperatura);
        
        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo "Datos ingresados correctamente";
        } else {
            echo "Error al ingresar los datos: " . $stmt->error;
        }
        
        // Cerrar la declaración preparada
        $stmt->close();
    } else {
        echo "Error en la preparación de la consulta: " . $mysqli->error;
    }
} else {
    echo "Faltan datos de entrada";
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>