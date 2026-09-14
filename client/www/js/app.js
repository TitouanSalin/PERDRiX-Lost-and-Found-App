$(document).ready(function () {

    function connexion() {
        if (Object.prototype.hasOwnProperty.call(localStorage, 'access_token')) {
            var accessToken = localStorage.getItem('access_token');
            $.post(url + "/connect.php", {
                access_token: accessToken
            }, function (data) {
                if (data.success) {
                    route();
                }
                if (data.error) {
                    route_nonco();
                }
            });
        }
        else {
            route_nonco();
        }
    }

    function route_nonco() {
        var hash = window.location.hash;
        console.log("fonction route_nonco");
        $("#my-nav").html("");
        switch (hash) {
            default:
            case "#login":
                $.get("template/login.tpl.html", function (template) {
                    $("#my-content").html(template);
                    $("#seconnecter").on("click", function () {
                        oAuthConnect()
                            .done(function (data) {
                                localStorage.setItem('access_token', data.access_token);
                                $("#loggedModal").modal('show');
                                $("#fermer-login").on("click", function () {
                                    window.location.hash = "#home";
                                })
                                // si le tableau data contient un access_token, on l'enregistre dans un localStorage
                            })
                            .fail(function () {
                                $("#shitModal").modal('show');
                                // si l'authentification oAuth ne se passe pas bien, on récupère le message d'erreur dans le tableau err
                            });
                    });
                    $("#nouveau").on("click", function () {
                        window.location.hash = "#register";
                    });
                }, "html");
                break;
            case "#register":
                $.get("template/register.tpl.html", function (template) {
                    $("#my-content").html(template);
                    $("#sinscrire").on("click", function () {
                        var login = $("#lelogin").val();
                        var mdp = $("#lemdp").val();
                        var confirmation = $("#laconfirmation").val();
                        var nom = $("#lenom").val();
                        var prenom = $("#leprenom").val();
                        var email = $("#lemail").val();
                        var phone_number = $('#phone_number').val();
                        $.post(url + "/register.php", { login: login, mdp: mdp, confirmation: confirmation, nom: nom, prenom: prenom, email: email, phone_number: phone_number }, function (data) {
                            let champ = data.champ;
                            let diff = data.diff;
                            let dejacompte = data.dejacompte;
                            let reussie = data.reussie;
                            console.log("la");
                            if (champ) {
                                console.log("champ");
                                $("#champModal").modal('show');
                            }
                            if (diff) {
                                console.log("diff");
                                $("#diffModal").modal('show');
                            }
                            if (dejacompte) {
                                console.log("dejacompte");
                                $("#dejaModal").modal('show');
                            }
                            if (reussie) {
                                console.log("reussie");
                                $("#reussieModal").modal('show');
                                oAuthConnect()
                                    .done(function (data) {
                                        localStorage.setItem('access_token', data.access_token);
                                    })
                                $("#fermer-register").on("click", function () {
                                    route()
                                })
                            }
                        }, "json");
                    });
                }, "html");
                break;
        }
    }

    function handleNavbarScroll() {
        let lastScrollTop = 0;
        const navbar = document.querySelector("#nav-bas");

        window.addEventListener('scroll', function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                // Si on défile vers le bas, cacher la navbar
                navbar.style.bottom = '-80px';  // Cacher vers le bas
            } else {
                // Si on défile vers le haut, montrer la navbar
                navbar.style.bottom = '0';  // Montrer en bas de l'écran
            }
            lastScrollTop = scrollTop;
        });
    }

    function handleNavbarActive() {
        const navContainer = $('#nav-bas');

        // Fonction pour mettre à jour le lien actif
        function updateActiveLink(hash) {
            navContainer.find('.nav-link').removeClass('active'); // Supprime l'ancienne classe active
            if (hash == "#uploadposte" || hash == "#uploadpostephoto") {
                navContainer.find(`.nav-link[href="${"#poster"}"]`).addClass('active');
            }
            if (hash == "#message") {
                navContainer.find(`.nav-link[href="${"#messagerie"}"]`).addClass('active');
            }
            if (hash == "#moncomptemodifiable") {
                navContainer.find(`.nav-link[href="${"#moncompte"}"]`).addClass('active');
            }
            if (hash == "#selection2") {
                navContainer.find(`.nav-link[href="${"#home"}"]`).addClass('active');
            }
            else {
                navContainer.find(`.nav-link[href="${hash}"]`).addClass('active'); // Ajoute 'active' au lien actuel
            }
        }

        // Gestion de l'activation initiale au chargement de la page
        const initialHash = window.location.hash || '#home'; // Définit #home par défaut si aucun hash
        updateActiveLink(initialHash);

        // Gestion des clics sur la barre de navigation
        navContainer.on('click', '.nav-link', function (event) {
            updateActiveLink($(this).attr('href')); // Met à jour le lien actif en fonction du lien cliqué
        });
    }

    function datation(laDate) {
        retour = laDate[8] + laDate[9] + "/" + laDate[5] + laDate[6] + "/" + laDate[2] + laDate[3] + " à " + laDate.slice(11, 16);
        return retour;
    }    

    function route() {
        var hash = window.location.hash;
        $.get("template/navbar.tpl.html", function (template) {
            $("#my-nav").html(template);
            handleNavbarScroll();
            handleNavbarActive();
            switch (hash) {
                case "#logout":
                    localStorage.removeItem('access_token');
                    window.location.reload();
                    break;
                case "#messagerie":
                    $.get("template/messagerie.tpl.html", function (template) {
                        const accessToken = localStorage.getItem('access_token');
                        $.post(url + "/message.php", { access_token: accessToken }, function (data) {
                            if (data.users && data.users.length) {
                                console.log(data.users[1])
                                const rendered = Mustache.render(template, { users: data.users });
                                $("#my-content").html(rendered);
                                $(".converser").on("click", function () {
                                    const autreId = $(this).data("receiver-id");
                                    localStorage["autreId"] = autreId;
                                    window.location.hash = "#message";
                                });

                            } else {
                                $("#my-content").html(template);
                                $("#noConversationsMessage").show();
                                $("#conversationsList").hide();
                            }
                        }, "json");
                    }, "html");
                    break;
                case "#message":
                    var autreId = localStorage.getItem('autreId');
                    var accessToken = localStorage.getItem('access_token');
                    $.get("template/message.tpl.html", function (template) {
                        $.post(url + "/message.php", { access_token: accessToken, autreId: autreId, action: "converser" }, function (data) {
                            console.log(data)
                            if (data.messages) {
                                for (let j = 0; j < data.messages.length; j++) {
                                    data.messages[j].sent_at = datation(data.messages[j].sent_at);
                                }
                                var rendered = Mustache.render(template, {
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    messages: data.messages,
                                    image: data.image
                                });
                                $("#my-content").html(rendered);
                                var teneur = localStorage.getItem('teneur');
                                var posteCategorie = sessionStorage['posteCategorie'];
                                var posteMarque = sessionStorage['posteMarque'];
                                var posteCouleur = sessionStorage['posteCouleur'];
                                if (teneur == "true") {
                                    var messageInput = "Bonjour, je cherche ceci : " + posteCategorie + " " + posteCouleur + " " + posteMarque + ".";
                                    $.post(url + "/message.php", {
                                        access_token: accessToken,
                                        autreId: autreId,
                                        messageInput: messageInput,
                                        action: "envoyer"
                                    }, function (response) {
                                        console.log(response);
                                        $("#messages").append(`
                                            <div class="message sent">
                                                <div class="card monbg-primary text-dark text-end ms-5 mb-2">
                                                    <div class="card-body">
                                                        <p class="card-text">${messageInput}</p>
                                                        <small class="text-muted">Maintenant</small>
                                                    </div>
                                                </div>
                                            </div>
                                        `);
                                        $("#messageInput").val("");
                                    }).done(function () {
                                        localStorage.removeItem('teneur');
                                    });
                                }
                                else if (teneur == "false") {
                                    var messageInput = "Bonjour, je cherche ceci : " + posteCategorie + " " + posteCouleur + " " + posteMarque + ". (Attention : l'utilisateur qui vous envoie ce message n'a pas réussi à dire vers où il avait égaré son objet, il pourrait ne pas être le propriétaire du dit objet)";
                                    $.post(url + "/message.php", {
                                        access_token: accessToken,
                                        autreId: autreId,
                                        messageInput: messageInput,
                                        action: "envoyer"
                                    }, function (response) {
                                        console.log(response);
                                        $("#messages").append(`
                                            <div class="message sent">
                                                <div class="card monbg-primary text-dark text-end ms-5 mb-2">
                                                    <div class="card-body">
                                                        <p class="card-text">${messageInput}</p>
                                                        <small class="text-muted">Maintenant</small>
                                                    </div>
                                                </div>
                                            </div>
                                        `);
                                        $("#messageInput").val("");
                                    }).done(function () {
                                        localStorage.removeItem('teneur');
                                    });
                                };
                                $("#sendMessageBtn").on("click", function () {
                                    var messageInput = $("#messageInput").val().trim();
                                    if (messageInput === "") return;
                                    $.post(url + "/message.php", {
                                        access_token: accessToken,
                                        autreId: autreId,
                                        messageInput: messageInput,
                                        action: "envoyer"
                                    }, function (response) {
                                        console.log(response);
                                        $("#messages").append(`
                                            <div class="message sent">
                                                <div class="card monbg-primary text-dark text-end ms-5 mb-2">
                                                    <div class="card-body">
                                                        <p class="card-text">${messageInput}</p>
                                                        <small class="text-muted">Maintenant</small>
                                                    </div>
                                                </div>
                                            </div>
                                        `);
                                        $("#messageInput").val("");
                                    });
                                });
                            } else {
                                $("#my-content").html("<p>Aucun message trouvé.</p>");
                            }
                        }, "json");
                    }, "html");
                    break;
                case "#poster":
                    $.get("template/poster.tpl.html", function (template) {
                        var accessToken = localStorage.getItem('access_token');
                        $.post(url + "/getposte.php", { access_token: accessToken }, function (data) {
                            console.log(data)
                            for (let j = 0; j < data.length; j++) {
                                data[j].sent_at = datation(data[j].sent_at);
                            }
                            var res = Mustache.render(template, data);
                            $("#my-content").html(res);
                            $("#poster").on("click", function () {
                                window.location.hash = "#uploadposte";
                            })
                        }, "json");
                    }, "html");
                    break;
                case "#suppressionposte":
                    $.get("template/suppressionposte.tpl.html", function (template) {
                        $("#my-content").html(template);
                        $("#supprModal").modal('show');
                        $("#annuler").on("click", function () {
                            window.location.hash = "#poster";
                        })
                        $("#annuler2").on("click", function () {
                            window.location.hash = "#poster";
                        })
                        $("#ouijeconfirme").on("click", function () {
                            var poste_id = sessionStorage['poste_id'];
                            $.post(url + "/supprposte.php", { poste_id: poste_id }, function (data) {
                                if (data.reussie) {
                                    window.location.hash = "#poster";
                                }
                                else {
                                    $("#supprModalError").modal('show');
                                }
                            })
                        })
                    }, "html");
                    break;
                case "#uploadposte":
                    $.get("template/uploadposte.tpl.html", function (template) {
                        $("#my-content").html(template);
                        var accessToken = localStorage.getItem('access_token');
                        $("#poster").on("click", function () {
                            var categorie = $("#categorie").val();
                            var couleur = $("#couleur").val();
                            var marque = $("#marque").val();
                            var loctrouve = $("#loctrouve").val();
                            var locstockage = $("#locstockage").val();
                            var infosup = $('#infosup').val();

                            $.post(url + "/poste.php", { access_token: accessToken, categorie: categorie, couleur: couleur, marque: marque, loctrouve: loctrouve, locstockage: locstockage, infosup: infosup }, function (data) {
                                let champ = data.champ;
                                let reussie = data.reussie;

                                if (champ) {
                                    $("#champpbModal").modal('show');
                                }
                                if (reussie) {
                                    window.location.hash = "#uploadpostephoto";
                                }
                            }, "json");
                        });
                        $("#retouramespostes").on("click", function () {
                            window.location.hash = "#poster";
                        })
                    }, "html");
                    break;
                case "#uploadpostephoto":
                    $.get("template/uploadpostephoto.tpl.html", function (template) {
                        $("#my-content").html(template);
                        $("#spinner").hide();
                        $("#passecela").on("click", function () {
                            window.location.hash = "#poster";
                        })
                        $("#fermer-uploadpostephoto").on("click", function () {
                            window.location.hash = "#home";
                        })
                    }, "html");
                    break;
                case "#moncompte":
                    $.get("template/moncompte.tpl.html", function (template) {
                        var accessToken = localStorage.getItem('access_token');
                        $.post(url + "/galerie.php", { access_token: accessToken }, function (data) {
                            console.log(data[0])
                            let res = Mustache.render(template, data[0]);
                            $("#my-content").html(res);
                            $("#modif").on("click", function () {
                                window.location.hash = "#moncomptemodifiable";
                            })
                        }, "json");
                    }, "html");
                    break;
                case "#uploadphoto":
                    $.get("template/uploadphoto.tpl.html", function (template) {
                        $("#my-content").html(template);
                        $("#spinner").hide();
                        $("#retouravant").on("click", function () {
                            window.location.hash = "#moncomptemodifiable";
                        })
                        $("#fermer-uploadphoto").on("click", function () {
                            window.location.hash = "#moncomptemodifiable";
                        })
                    }, "html");
                    break;
                case "#moncomptemodifiable":
                    $.get("template/moncomptemodifiable.tpl.html", function (template) {
                        var accessToken = localStorage.getItem('access_token');
                        $.post(url + "/galerie.php", { access_token: accessToken }, function (data) {
                            let res = Mustache.render(template, data[0]);
                            $("#my-content").html(res);
                            $("#enregistrer").on("click", function () {
                                var mdp = $("#lemdp").val();
                                var confirmation = $("#lemdpconf").val();
                                var nom = $("#leNom").val();
                                var prenom = $("#lePrenom").val();
                                var email = $("#lEmail").val();
                                var phone_number = $('#leNum').val();
                                $.post(url + "/uploaddonnee.php", { access_token: accessToken, mdp: mdp, confirmation: confirmation, nom: nom, prenom: prenom, email: email, phone_number: phone_number }, function (data) {
                                    let diff = data.diff;
                                    let reussie = data.reussie;
                                    if (diff) {
                                        console.log("diff");
                                        $("#diffModalpb").modal('show');
                                    }
                                    if (reussie && !diff) {
                                        window.location.hash = "#moncompte";
                                    }
                                }, "json");
                            });
                            $("#retour").on("click", function () {
                                window.location.hash = "#moncompte";
                            })                                                                  
                        }, "json");
                    }, "html");
                    break;
                case "#testcontact":
                    $.get("template/testcontact.tpl.html", function (template) {
                        let poste_id = sessionStorage['poste_id'];
                        let listeFakes = ["en .K", "au Batac", "dans le grand Hall", "en T6", "en salle info", "au magnan", "en Cauchy", "PC1", "PC2", "PC3", "PC5", "PC16", "PC12", "PC18", "PC21", "PC23", "PC31", "en Arago", "à la manute"];
                        $.post(url + "/getUNposte.php", { poste_id: poste_id }, function (data) {
                            var localisation = data.localisation[0].localisation;
                            var autreId = data.autreId[0].sender_login;
                            localStorage['autreId'] = autreId;
                            console.log(autreId);
                            longueur = listeFakes.length;
                            var nbAlea1 = Math.floor(Math.random() * (longueur));
                            var nbAlea2 = Math.floor(Math.random() * (longueur));
                            var nbAlea3 = Math.floor(Math.random() * (longueur));
                            while (localisation == listeFakes[nbAlea1] || localisation == listeFakes[nbAlea2] || nbAlea1 == nbAlea2 || nbAlea1 == nbAlea3 || nbAlea2 == nbAlea3) {
                                nbAlea1 = Math.floor(Math.random() * (longueur));
                                nbAlea2 = Math.floor(Math.random() * (longueur));
                            }
                            if ((nbAlea1 < nbAlea2) && (nbAlea2 < nbAlea3)) {
                                dataUse = [{ localisation: listeFakes[nbAlea1], teneur: false }, { localisation: listeFakes[nbAlea2], teneur: false }, { localisation: localisation, teneur: true }];
                            }
                            if ((nbAlea1 < nbAlea3) && (nbAlea3 < nbAlea2)) {
                                dataUse = [{ localisation: listeFakes[nbAlea1], teneur: false }, { localisation: localisation, teneur: true }, { localisation: listeFakes[nbAlea2], teneur: false }];
                            }
                            if ((nbAlea2 < nbAlea1) && (nbAlea1 < nbAlea3)) {
                                dataUse = [{ localisation: listeFakes[nbAlea2], teneur: false }, { localisation: listeFakes[nbAlea1], teneur: false }, { localisation: localisation, teneur: true }];

                            }
                            if ((nbAlea2 < nbAlea3) && (nbAlea3 < nbAlea1)) {
                                dataUse = [{ localisation: listeFakes[nbAlea2], teneur: false }, { localisation: localisation, teneur: true }, { localisation: listeFakes[nbAlea1], teneur: false }];
                            }
                            if ((nbAlea3 < nbAlea2) && (nbAlea2 < nbAlea1)) {
                                dataUse = [{ localisation: localisation, teneur: true }, { localisation: listeFakes[nbAlea2], teneur: false }, { localisation: listeFakes[nbAlea1], teneur: false }];
                            }
                            if ((nbAlea3 < nbAlea1) && (nbAlea1 < nbAlea2)) {
                                dataUse = [{ localisation: localisation, teneur: true }, { localisation: listeFakes[nbAlea1], teneur: false }, { localisation: listeFakes[nbAlea2], teneur: false }];
                            }
                            let res = Mustache.render(template, dataUse);
                            $("#my-content").html(res);
                            $("#etCaRepart").on("click", function () {
                                window.location.hash = "#selection2";
                            })
                        }, "json");
                    }, "html");
                    break;
                case "#selection2":
                    $.get("template/home.tpl.html", function (template) {
                        var categorie = sessionStorage['categorie'];
                        var couleur = sessionStorage['couleur'];
                        var marque = sessionStorage['marque'];
                        console.log(categorie);
                        $.post(url + "/getTOUTposte.php", { categorie: categorie, couleur: couleur, marque: marque }, function (data) {
                            categoriess = [];
                            couleurss = [];
                            marquess = [];
                            for (let i = 0; i < data.length; i++) {
                                if (!categoriess.includes(data[i].categorie)) {
                                    categoriess.push(data[i].categorie);
                                }
                                if (!couleurss.includes(data[i].couleur)) {
                                    couleurss.push(data[i].couleur);
                                }
                                if (!marquess.includes(data[i].marque)) {
                                    marquess.push(data[i].marque);
                                }
                            }
                            for (let j = 0; j < data.length; j++) {
                                data[j].sent_at = datation(data[j].sent_at);
                            }
                            dataC = { objets: data, categories: categoriess, couleurs: couleurss, marques: marquess };
                            let res = Mustache.render(template, dataC);
                            $("#my-content").html(res);
                            $("#supprfiltre").on("click", function () {
                                window.location.hash = "#home";
                            })
                        }, "json");
                    }, "html");
                    break;
                case "#selection":
                    window.location.hash = "#selection2";
                    break;
                default:
                case "#home":
                    $.get("template/home.tpl.html", function (template) {
                        sessionStorage['categorie'] = "pasdef";
                        sessionStorage['couleur'] = "pasdef";
                        sessionStorage['marque'] = "pasdef";
                        var categorie = sessionStorage['categorie'];
                        var couleur = sessionStorage['couleur'];
                        var marque = sessionStorage['marque'];
                        $.post(url + "/getTOUTposte.php", { categorie: categorie, couleur: couleur, marque: marque }, function (data) {
                            categoriess = [];
                            couleurss = [];
                            marquess = [];
                            for (let i = 0; i < data.length; i++) {
                                if (!categoriess.includes(data[i].categorie)) {
                                    categoriess.push(data[i].categorie);
                                }
                                if (!couleurss.includes(data[i].couleur)) {
                                    couleurss.push(data[i].couleur);
                                }
                                if (!marquess.includes(data[i].marque)) {
                                    marquess.push(data[i].marque);
                                }
                            }
                            for (let j = 0; j < data.length; j++) {
                                data[j].sent_at = datation(data[j].sent_at);
                            }
                            dataC = { objets: data, categories: categoriess, couleurs: couleurss, marques: marquess };
                            let res = Mustache.render(template, dataC);
                            $("#my-content").html(res);
                            $("#supprfiltre").on("click", function () {
                                window.location.hash = "#home";
                            })
                        }, "json");
                    }, "html");
                    break;
            }
        }, "html");

    }

    $(window).on('hashchange', connexion);
    connexion();
});