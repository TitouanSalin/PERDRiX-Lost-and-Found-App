<?php

class Database
{

    public static function connect()
    {
        $dbName = 'unebase';
        $dbServer = '127.0.0.1';
        $dbUser = 'root';
        $dbPass = 'Jfumdinfo!';

        $dsn = 'mysql:dbname=' . $dbName . ';host=' . $dbServer;
        $dbh = null;
        try {
            $dbh = new PDO($dsn, $dbUser, $dbPass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"));
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            return false;
        }

        return $dbh;
    }

    public static function getIfUserExists($dbh, $login)
    {
        $query = "SELECT * FROM oauth_users WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$login]);
        $nbrdelogin = $sth->rowCount();
        if ($nbrdelogin > 0) {
            return true;
        }
        return false;
    }

    public static function insertUser($dbh, $login, $password, $nom, $prenom, $email, $phone_number)
    {
        require "includes/defaultimage.php";
        $query = "INSERT INTO oauth_users (username, password, first_name, last_name, email, phone_number, image) VALUES (?,SHA1(?),?,?,?,?,?)";
        $sth = $dbh->prepare($query);
        $sth->execute([$login, $password, $prenom, $nom, $email, $phone_number, $imagenoir]);
        return;

    }

    public static function insertPoste($dbh, $login, $categorie, $couleur, $marque, $loctrouve, $locstockage, $infosup)
    {
        require "includes/defaultimage.php";
        $query = "INSERT INTO postes (sender_login, text, categorie, couleur, marque, localisation, locstockage, image) VALUES (?,?,?,?,?,?,?,?)";
        $sth = $dbh->prepare($query);
        $sth->execute([$login, $infosup, $categorie, $couleur, $marque, $loctrouve, $locstockage, $imageposte]);
        return;

    }

    public static function supprPoste($dbh, $poste_id)
    {
        $query = "DELETE FROM postes WHERE poste_id = (?)";
        $sth = $dbh->prepare($query);
        $sth->execute([$poste_id]);
        return;

    }

    public static function posteImage($dbh, $image, $login)
    {
        $query = "SELECT poste_id FROM postes WHERE sender_login = ? ORDER BY poste_id DESC LIMIT 1";
        $sth = $dbh->prepare($query);
        $sth->execute([$login]);
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $query = "UPDATE postes SET image = (?) WHERE poste_id = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$image, $result['poste_id']]);
        return;
    }

    public static function insertImage($dbh, $image)
    {
        $query = "INSERT INTO oauth_users (image) VALUES (?)";
        $sth = $dbh->prepare($query);
        $sth->execute([$image]);
        return;
    }

    public static function modifyImage($dbh, $image, $login)
    {
        $query = "UPDATE oauth_users SET image = (?) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$image, $login]);
        return;
    }

    public static function modifyMdp($dbh, $login, $mdp)
    {
        $query = "UPDATE oauth_users SET password = (SHA1(?)) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$mdp, $login]);
        return;
    }

    public static function modifyNom($dbh, $login, $nom)
    {
        $query = "UPDATE oauth_users SET last_name = (?) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$nom, $login]);
        return;
    }

    public static function modifyPrenom($dbh, $login, $prenom)
    {
        $query = "UPDATE oauth_users SET first_name = (?) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$prenom, $login]);
        return;
    }

    public static function modifyEmail($dbh, $login, $email)
    {
        $query = "UPDATE oauth_users SET email = (?) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$email, $login]);
        return;
    }

    public static function modifyNum($dbh, $login, $phone_number)
    {
        $query = "UPDATE oauth_users SET phone_number = (?) WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$phone_number, $login]);
        return;
    }

    public static function getGalerie($dbh, $login)
    {
        $query = "SELECT * FROM oauth_users WHERE username = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$login]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function getPoste($dbh, $login)
    {
        $query = "SELECT * FROM postes WHERE sender_login = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$login]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function getUNPoste($dbh, $poste_id)
    {
        $query = "SELECT localisation FROM postes WHERE poste_id = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$poste_id]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function getLogin($dbh, $poste_id)
    {
        $query = "SELECT sender_login FROM postes WHERE poste_id = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$poste_id]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function getTOUTPoste($dbh, $categorie, $couleur, $marque)
    {
        if (($categorie=="pasdef")&&($couleur=="pasdef")&&($marque=="pasdef")){
            $query = "SELECT * FROM postes ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute();
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($categorie=="pasdef")&&($couleur=="pasdef")){
            $query = "SELECT * FROM postes WHERE marque = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$marque]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($categorie=="pasdef")&&($marque=="pasdef")){
            $query = "SELECT * FROM postes WHERE couleur = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$couleur]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($marque=="pasdef")&&($couleur=="pasdef")){
            $query = "SELECT * FROM postes WHERE categorie = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$categorie]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($marque=="pasdef")){
            $query = "SELECT * FROM postes WHERE categorie = ? AND couleur = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$categorie, $couleur]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($couleur=="pasdef")){
            $query = "SELECT * FROM postes WHERE categorie = ? AND marque = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$categorie, $marque]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        if (($categorie=="pasdef")){
            $query = "SELECT * FROM postes WHERE marque = ? AND couleur = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$marque, $couleur]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        $query = "SELECT * FROM postes WHERE marque = ? AND couleur = ? AND categorie = ? ORDER BY poste_id DESC";
            $sth = $dbh->prepare($query);
            $sth->execute([$marque, $couleur, $categorie]);
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $result; 
    }

    // Envoi d'un nouveau message
    public static function sendMessage($dbh, $sender, $receiver, $text)
    {
        $query = "INSERT INTO messages (sender_id, receiver_id, text, sent_at) VALUES (?, ?, ?, NOW())";
        $sth = $dbh->prepare($query);
        $sth->execute([$sender, $receiver, $text]);
    }

    // Conversation entre 2 utilisateurs
    public static function getMessage($dbh, $person1, $person2)
{
    $query = "SELECT *, sender_id = ? AS is_sender FROM messages WHERE (sender_id=? AND receiver_id=?) OR (receiver_id=? AND sender_id=?) ORDER BY sent_at ASC";
    $sth = $dbh->prepare($query);
    $sth->execute([$person1, $person1, $person2, $person1, $person2]);
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);

    // Convertir la valeur de `is_sender` en booléen
    foreach ($result as &$message) {
        $message['is_sender'] = (bool)$message['is_sender'];
    }

    return $result;
}

    // Tous les messages d'un utilisateur
    public static function getUserMessages($dbh, $userId)
    {
        $query = "SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at ASC";
        $sth = $dbh->prepare($query);
        $sth->execute([$userId, $userId]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    // Effacer un message
    public static function deleteMessage($dbh, $messageId)
    {
        $query = "DELETE FROM messages WHERE id = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$messageId]);
        return;
    }

    // Marquer un message comme lu
    public static function markAsRead($dbh, $messageId)
    {
        $query = "UPDATE messages SET is_read = 1 WHERE id = ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$messageId]);
        return;
    }

    // Compter les messages non lus
    public static function getUnreadCount($dbh, $userId)
    {
        $query = "SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND is_read = 0";
        $sth = $dbh->prepare($query);
        $sth->execute([$userId]);
        return $sth->fetchColumn();
    }

    // Trouver tous les utilisateurs qui conversent avec un certain utilisateur
    public static function getChatUsers($dbh, $userId)
    {
        $query = "
        SELECT DISTINCT 
            CASE WHEN m.sender_id = :user THEN m.receiver_id ELSE m.sender_id END AS username,
            u.first_name,
            u.last_name,
            u.image
        FROM messages m
        JOIN oauth_users u ON u.username = CASE WHEN m.sender_id = :user THEN m.receiver_id ELSE m.sender_id END
        WHERE m.sender_id = :user OR m.receiver_id = :user
    ";
        $sth = $dbh->prepare($query);
        $sth->execute(['user' => $userId]);
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }


    // Avoir les 10 derniers messages d'une conversation
    public static function getLatestMessages($dbh, $senderId, $receiverId, $limit = 10)
    {
        $query = "SELECT * FROM messages WHERE (receiver_id = ? AND sender_id = ?) OR (receiver_id = ? AND sender_id = ?) ORDER BY sent_at DESC LIMIT ?";
        $sth = $dbh->prepare($query);
        $sth->execute([$senderId, $receiverId, $senderId, $receiverId, $limit]);
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    // Informations sur un utilisateur
    public static function getUser($dbh, $username)
{
    $query = "SELECT username, first_name, last_name, email, image FROM oauth_users WHERE username = ?";
    $sth = $dbh->prepare($query);

    try {
        $sth->execute([$username]);
        $result = $sth->fetch(PDO::FETCH_ASSOC);

        // Vérifier si l'utilisateur a été trouvé
        if ($result) {
            return $result;
        } else {
            return null; // Utilisateur non trouvé
        }
    } catch (PDOException $e) {
        error_log("Erreur lors de la récupération de l'utilisateur : " . $e->getMessage());
        return null;
    }
}

}
