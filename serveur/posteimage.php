<?php
//Ce php permet de modifier la photo d'un poste présent sur la plateforme

// entête CORS pour autoriser l'accès au fichier
require_once 'headers/cors_header.php';
// ma classe Database
require 'includes/database.class.php';
// serveur oAuth
require_once __DIR__ . '/server.php';

// on vérifie l'access_token envoyé
// si l'utilisateur n'est pas connecté ou si son token a expiré, on nevoie une erreur
if (!$server->verifyResourceRequest(OAuth2\Request::createFromGlobals())) {
    $msg = array('error' => 'Invalid or expired token');
    echo json_encode($msg);
    //array_push($msgJson, $msg);
    //echo json_encode($msgJson);
    exit();
}

$dbh = Database::connect();

if (!isset($_POST['image'])) {
    $msg = array('error' => 'Incomplete datas');
    echo json_encode($msg);
    exit();
}

$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$login = $token['user_id'];
Database::posteImage($dbh, $_POST['image'], $login);

echo json_encode(array('success' => 'Image uploaded !'));