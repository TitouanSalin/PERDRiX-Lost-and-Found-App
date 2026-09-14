document.addEventListener("deviceready", init, false);

function init() {
    console.log("Device is ready !");
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  // Corrects Android orientation quirks
    }
    return options;
}

function openCamera(selection) {
    if (selection == "album") {
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    } else if (selection == "camera") {
        var srcType = Camera.PictureSourceType.CAMERA;
    } else {
        return;
    }

    var options = setOptions(srcType);

    navigator.camera.getPicture(
        function (imageURI) {
            resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                // fileEntry is usable for uploading without holding image in memory...
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        displayImage(this.result);
                    }

                    reader.readAsDataURL(file);
                }, cameraError);
            }, cameraError);
        }, cameraError, options);
}

function cameraError(error) {
    console.debug("Unable to obtain picture: " + error, "app");
}

function displayImage(imgUri) {
    $('#myImage').attr("src", imgUri);
}

function uploadImg() {
    $("#spinner").show();  // Afficher le spinner
    var imageData = $('#myImage').attr("src");
    var accessToken = localStorage.getItem('access_token');

    if (!imageData) {
        $("#no-pdp").modal("show");
        $("#spinner").hide();
        return;
    }

    $.post(url + "/upload.php", {
        image: imageData,
        access_token: accessToken
    }, function (data) {
        $("#spinner").hide();
        if (data.success) {
            $("#photo-success").modal("show");
        } else if (data.error) {
            $("#photo-error").modal("show");
        }
    }).fail(function () {
        $("#spinner").hide();
        $("#photo-error").modal("show");
    });
}

function uploadImgPoste() {
    $("#spinner").show();  // Afficher le spinner
    var imageData = $('#myImage').attr("src");
    var accessToken = localStorage.getItem('access_token');

    if (!imageData) {
        $("#no-img").modal("show");
        $("#spinner").hide();
        return;
    }

    $.post(url + "/posteimage.php", {
        image: imageData,
        access_token: accessToken
    }, function (data) {
        $("#spinner").hide();
        if (data.success) {
            $("#upload-success").modal("show");
        } else if (data.error) {
            $("#upload-error").modal("show");
        }
    }).fail(function () {
        $("#spinner").hide();
        $("#upload-error").modal("show");
    });
}