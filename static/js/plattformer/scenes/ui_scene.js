/*
__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"
 */

class UIScene extends Phaser.Scene {
    jumps_text;
    jump_count;

    constructor() {
        super({key: 'UIScene'});
    }

    create() {
        /*
        When scene is activated initialize all elements of the ui.
         */

        //  Our Text object to display the Score
        this.jumps_text = this.add.text(10, 10, '', {font: '48px Trebuchet MS', fill: '#000000'});
        this.get_jumps();

        //  Grab a reference to the Game Scene
        let main_game = this.scene.get('GameScene');

        //  Listen for events from it
        main_game.events.on('jumped', function () {
            this.update_jumps();
            main_game.jump_count = this.jump_count;
        }, this);
    }

    get_jumps() {
        /*
        Makes API call to get the users jump counter and updates the ingame text.
         */
        let parent = this;
        $.ajax({
            type: 'GET',
            url: '/api/jumps',
            success: function (response) {
                parent.jump_count = parseInt(response['jumps']);
                parent.jumps_text.setText('Sprünge: ' + parent.jump_count);
            }
        });
    }

    update_jumps() {
        /*
        Makes API call to reduce the jump counter by 1 and updates both Jump counter elements (ingame and outside)
         */
        let parent = this;
        $.ajax({
            type: 'PUT',
            data: {change: -1},
            url: '/api/update_jumps',
            success: function (response) {
                parent.jumps_text.setText('Sprünge: ' + response['jumps']);
                parent.jump_count = response['jumps'];
                document.getElementById("jumps_label").innerHTML = response['jumps'];
            }
        });
    }
}

export default UIScene;