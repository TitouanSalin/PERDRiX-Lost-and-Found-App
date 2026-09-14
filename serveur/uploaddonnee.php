<?php
//Ce php permet de modifier les données personnels d'un utilisateur

require 'includes/database.class.php';
require 'headers/cors_header.php';
require_once __DIR__ . '/server.php';
$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$login = $token['user_id'];
$mdp = $_POST["mdp"];
$confirmation = $_POST["confirmation"];
$nom = $_POST["nom"];
$prenom = $_POST["prenom"];
$email = $_POST["email"];
$phone_number = $_POST["phone_number"];
$champmdp = false;
$diff = false;
$reussie = false;
$dbh = Database::connect();
//if ((!isset($_POST['login']))||(!isset($_POST['mdp']))||(!isset($_POST['confirmation']))){
//if (($mdp == '') || ($confirmation == '') || ($login == '') || ($nom == '') || ($prenom == '') || ($email == '')|| ($phone_number == '')) {
if (!isset($_POST["mdp"],$_POST["confirmation"])||empty($_POST["mdp"])||empty($_POST["confirmation"])) {
    $champmdp = true;
}

if ($mdp != $confirmation) {
    $diff = true;
}

if ((!$champmdp) && (!$diff)) {
    Database::modifyMdp($dbh, $login, $mdp);
    $reussie = true;
}

if (isset($_POST["nom"])&&!empty($_POST["nom"])) {
    Database::modifyNom($dbh, $login, $nom);
    $reussie = true;
}

if (isset($_POST["prenom"])&&!empty($_POST["prenom"])) {
    Database::modifyPrenom($dbh, $login, $prenom);
    $reussie = true;
}

if (isset($_POST["email"])&&!empty($_POST["email"])) {
    Database::modifyEmail($dbh, $login, $email);
    $reussie = true;
}

if (isset($_POST["phone_number"])&&!empty($_POST["phone_number"])) {
    Database::modifyNum($dbh, $login, $phone_number);
    $reussie = true;
}

$retour = ["diff" => $diff,"reussie" => $reussie];
echo json_encode($retour);