$(document).ready(function () {
    $.get("/api/get_mascot")
        .done(function (response) {
            mascot = parseInt(response['mascot']);
            switch (mascot) {
                case 1:
                    document.getElementById("mascot_panda").style.display = "block";
                    break;
                case 2:
                    document.getElementById("mascot_dino").style.display = "block";
                    break;
                case 3:
                    document.getElementById("mascot_alien").style.display = "block";
                    break;
            }
        });
});





$(document).ready(function () {
    $.get("/api/get_equipped")
        .done(function (data) {
            $.each(data, function (key, value) {
                switch (value.hat) {
                    case"hat_11":
                        document.getElementById("blue_cap").style.display = "block";
                        break;
                    case"hat_12":
                        document.getElementById("crown").style.display = "block";
                        break;
                    case"hat_13":
                        document.getElementById("top_hat").style.display = "block";
                        break;
                    case"hat_14":
                        document.getElementById("headband").style.display = "block";
                        break;
                    case"hat_21":
                        document.getElementById("flower").style.display = "block";
                        break;
                    case"hat_22":
                        document.getElementById("butterfly").style.display = "block";
                        break;
                    case"hat_23":
                        document.getElementById("santa_hat").style.display = "block";
                        break;
                    case"hat_24":
                        document.getElementById("bunny_ears").style.display = "block";
                        break;
                }
                switch (value.shoe) {
                    case"shoe_11":
                        document.getElementById("rain_boots").style.display = "block";
                        break;
                    case"shoe_12":
                        document.getElementById("blue_socks").style.display = "block";
                        break;
                    case"shoe_13":
                        document.getElementById("red_socks").style.display = "block";
                        break;
                    case"shoe_14":
                        document.getElementById("sneakers").style.display = "block";
                        break;
                    case"shoe_21":
                        document.getElementById("crocs").style.display = "block";
                        break;
                    case"shoe_22":
                        document.getElementById("boots").style.display = "block";
                        break;
                    case"shoe_23":
                        document.getElementById("ribbon_shoes").style.display = "block";
                        break;
                    case"shoe_24":
                        document.getElementById("black_boots").style.display = "block";
                        break;
                }
                switch (value.shirt) {
                    case"shirt_11":
                        document.getElementById("flower_top").style.display = "block";
                        break;
                    case"shirt_12":
                        document.getElementById("green_shirt").style.display = "block";
                        break;
                    case"shirt_13":
                        document.getElementById("red_sweater").style.display = "block";
                        break;
                    case"shirt_14":
                        document.getElementById("pink_jacket").style.display = "block";
                        break;
                    case"shirt_21":
                        document.getElementById("simley_top").style.display = "block";
                        break;
                    case"shirt_22":
                        document.getElementById("purple_shirt").style.display = "block";
                        break;
                    case"shirt_23":
                        document.getElementById("blue_hoodie").style.display = "block";
                        break;
                    case"shirt_24":
                        document.getElementById("leather_jacket").style.display = "block";
                        break;
                }
                switch (value.accessory) {
                    case"accessory_11":
                        document.getElementById("lightsaber").style.display = "block";
                        break;
                    case"accessory_12":
                        document.getElementById("necklace").style.display = "block";
                        break;
                    case"accessory_13":
                        document.getElementById("plush").style.display = "block";
                        break;
                    case"accessory_14":
                        document.getElementById("scarf_blue").style.display = "block";
                        break;
                    case"accessory_21":
                        document.getElementById("scarf_red").style.display = "block";
                        break;
                    case"accessory_22":
                        document.getElementById("glasses").style.display = "block";
                        break;
                    case"accessory_23":
                        document.getElementById("sunglasses").style.display = "block";
                        break;
                    case"accessory_24":
                        document.getElementById("cat").style.display = "block";
                        break;
                }
            });
        });
});

/*
   Makes API call to get the users currency counter and updates the sidebar text.
    */
$.ajax({
    type: 'GET',
    url: '/api/currency',
    success: function (response) {
        currency = parseInt(response['currency']);
        document.getElementById('tokens_all').innerHTML = "Tokens Gesamt: " + currency;
    }
});

/*
gets a praise quote out of the database and prints it into the speechbubble
 */
function get_praise() {
    $(document).ready(function () {
        $.get("/api/quote/praise")
            .done(function (response) {
                quote = response;
                document.getElementById('speech_text').innerHTML = quote.quote;
            });
    });
}

/*
gets an encouraging quote out of the database and prints it into the speechbubble
 */
function get_encouragement() {
    $(document).ready(function () {
        $.get("/api/quote/encouragement")
            .done(function (response) {
                quote = response;
                document.getElementById('speech_text').innerHTML = quote.quote;
            });
    });
}


