<?php
//Ce php permet de récupérer des messages et envoyer des messages à un autre utilisateur

require 'includes/database.class.php';
require 'headers/cors_header.php';
require_once __DIR__ . '/server.php';

if (!$server->verifyResourceRequest(OAuth2\Request::createFromGlobals())) {
    $msg = array('error' => 'Invalid or expired token');
    echo json_encode($msg);
    exit();
}

$token = $server->getAccessTokenData(OAuth2\Request::createFromGlobals());
$user_id = $token['user_id'];

$dbh = Database::connect();

$response = [];

if (isset($_POST["action"])) {
    $action = $_POST["action"];
    switch ($action) {
        case "converser":
            $autreId = $_POST["autreId"];
            $messages = Database::getMessage($dbh, $user_id, $autreId);
            $user = Database::getUser($dbh, $autreId); // Récupérer les détails de l'utilisateur

            $response = [
                'messages' => $messages,
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'image' => $user['image']
            ];
            break;

        case "envoyer":
            $autreId = $_POST["autreId"];
            $text = $_POST["messageInput"];
            Database::sendMessage($dbh, $user_id, $autreId, $text);

            $response = ['status' => 'Message envoyé'];
            break;

        default:
            $response = ['error' => 'Action non reconnue'];
            break;
    }
} else {
    // Si aucune action n'est spécifiée, récupérer les utilisateurs de la messagerie
    $users = Database::getChatUsers($dbh, $user_id);
    $response = ['users' => $users];
}

echo json_encode($response);