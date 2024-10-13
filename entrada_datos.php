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
// Obtener los datos de la solicitud POST
$serie = $_POST['serie'];
$temperatura = $_POST['temp'];

// Ejecutar la consulta de inserción
$res = $mysqli->query("INSERT INTO `datos` (`ID`, `Fecha`, `Serie`, `Temperatura`) VALUES (NULL, current_timestamp(), '$serie', '$temperatura');");

// Verificar si la inserción fue exitosa
if ($res) {
    echo "Datos ingresados correctamente";
} else {
    echo "Error al ingresar los datos: " . $mysqli->error;
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>