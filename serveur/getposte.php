<?php
//Ce php permet de récupérer les postes postés par l'utilisateur

require 'includes/database.class.php';
require 'headers/cors_header.php';
require __DIR__ . '/server.php';
$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$login = $token['user_id'];
$dbh = Database::connect();
$galerie = Database::getPoste($dbh, $login);
echo json_encode($galerie);