<?php
//Ce php permet de récupérer tous les postes présents sur la plateforme 

require 'includes/database.class.php';
require 'headers/cors_header.php';
$categorie = $_POST["categorie"];
$couleur = $_POST["couleur"];
$marque = $_POST["marque"];
$dbh = Database::connect();
$galerie = Database::getTOUTPoste($dbh, $categorie, $couleur, $marque);
echo json_encode($galerie);