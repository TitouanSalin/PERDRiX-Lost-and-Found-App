var url = "http://royce.polytechnique.fr:60471/projet/";
var client_id = "testclient";
var client_secret = "testpass";

function oAuthConnect() {
    // récupérez ici avec Jquery les valeurs contenus dans vos champs <input> du template de login
    var username = $("#lelogin").val();
    var password = $("#lemdp").val();

    return $.post(url + "/token.php", {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "password",
        username: username,
        password: password,
    });

}