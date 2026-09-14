<?php
//Ce php permet de connecter l'utilisateur directement s'il a un access token valide

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
    exit();
}

echo json_encode(array('success' => 'token good !'));