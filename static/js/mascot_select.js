/*

Mascot selection logic.

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/04/27"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"
 */

function update_mascot(mascot_id) {
    deselect_mascot();
    /*
    Makes API call to update the currency with currency + collected tokens after level completion
    */
    $.ajax({
        type: 'PATCH',
        data: {mascot: mascot_id},
        url: '/api/update_mascot',
        success: function (response) {
            mascot = parseInt(response['mascot']);
        }
    });
    select_mascot();
}

function select_mascot() {
    $.get("/api/get_mascot")
        .done(function (response) {
            mascot = parseInt(response['mascot']);
            switch (mascot) {
                case 1:
                    document.getElementById("mascot_panda").style.border = "5px solid #00d0d1";
                    break;
                case 2:
                    document.getElementById("mascot_dino").style.border = "5px solid #00d0d1";
                    break;
                case 3:
                    document.getElementById("mascot_alien").style.border = "5px solid #00d0d1";
                    break;
            }
        });
}

function deselect_mascot() {
    $.get("/api/get_mascot")
        .done(function (response) {
            mascot = parseInt(response['mascot']);
            switch (mascot) {
                case 1:
                    document.getElementById("mascot_panda").style.border = "none";
                    break;
                case 2:
                    document.getElementById("mascot_dino").style.border = "none";
                    break;
                case 3:
                    document.getElementById("mascot_alien").style.border = "none";
                    break;
            }
        });
}