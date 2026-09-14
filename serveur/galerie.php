<?php
//Ce php permet de récupérer la photo de profil de l'utilisateur

require 'includes/database.class.php';
require 'headers/cors_header.php';
require __DIR__ . '/server.php';
$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$login = $token['user_id'];
$dbh = Database::connect();
$galerie = Database::getGalerie($dbh, $login);
echo json_encode($galerie);