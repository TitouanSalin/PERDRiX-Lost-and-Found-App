<?php
//Ce php permet d'uploader un nouveau poste sur la plateforme 

require 'includes/database.class.php';
require 'headers/cors_header.php';
require_once __DIR__ . '/server.php';
$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$login = $token['user_id'];
$categorie = $_POST["categorie"];
$couleur = $_POST["couleur"];
$marque = $_POST["marque"];
$loctrouve = $_POST["loctrouve"];
$locstockage = $_POST["locstockage"];
$infosup = $_POST["infosup"];
$champ = false;
$reussie = false;
$dbh = Database::connect();

if (!isset($_POST["categorie"],$_POST["loctrouve"])||empty($_POST["categorie"])||empty($_POST["loctrouve"])) {
    $champ = true;
}

if (!$champ) {
        Database::insertPoste($dbh, $login, $categorie, $couleur, $marque, $loctrouve, $locstockage, $infosup);
        $reussie = true;
    }

$retour = ["champ" => $champ, "reussie" => $reussie];
echo json_encode($retour);