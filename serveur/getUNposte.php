<?php
//Ce php permet de récupérer les informations relatives à un poste en particulier

require 'includes/database.class.php';
require 'headers/cors_header.php';

$poste_id = $_POST["poste_id"];
$dbh = Database::connect();

$localisation = Database::getUNPoste($dbh, $poste_id);
$autreId = Database::getLogin($dbh, $poste_id);
$reponse = ['localisation' => $localisation, 'autreId' => $autreId];

echo json_encode($reponse);