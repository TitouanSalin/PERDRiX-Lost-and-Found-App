<?php
//Ce php permet de créer un nouveau compte

require 'includes/database.class.php';
require 'headers/cors_header.php';
$login = $_POST["login"];
$mdp = $_POST["mdp"];
$confirmation = $_POST["confirmation"];
$nom = $_POST["nom"];
$prenom = $_POST["prenom"];
$email = $_POST["email"];
$phone_number = $_POST["phone_number"];
$champ = false;
$diff = false;
$dejacompte = false;
$reussie = false;
$dbh = Database::connect();
//if ((!isset($_POST['login']))||(!isset($_POST['mdp']))||(!isset($_POST['confirmation']))){
//if (($mdp == '') || ($confirmation == '') || ($login == '') || ($nom == '') || ($prenom == '') || ($email == '')|| ($phone_number == '')) {
if (!isset($_POST["login"],$_POST["mdp"],$_POST["confirmation"])||empty($_POST["login"])||empty($_POST["mdp"])||empty($_POST["confirmation"])) {
    $champ = true;
}

if ($mdp != $confirmation) {
    $diff = true;
}

if ((!$champ) && (!$diff)) {
  if (Database::getIfUserExists($dbh, $login)) {
      $dejacompte = true;
    } else {
        //echo print_r($_POST,true);
        Database::insertUser($dbh, $login, $mdp, $nom, $prenom, $email, $phone_number);
        $reussie = true;
    }
}

$retour = ["champ" => $champ, "diff" => $diff, "dejacompte" => $dejacompte, "reussie" => $reussie];
echo json_encode($retour);