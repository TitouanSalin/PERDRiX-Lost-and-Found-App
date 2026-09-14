<?php
//Ce php permet de supprimer un poste

require 'includes/database.class.php';
require 'headers/cors_header.php';
require_once __DIR__ . '/server.php';
$poste_id = $_POST["poste_id"];
$reussie = false;
$dbh = Database::connect();

if (isset($_POST["poste_id"])) {
    Database::supprPoste($dbh,$poste_id);
    $reussie = true;
}

$retour = ["reussie" => $reussie];
echo json_encode($retour);