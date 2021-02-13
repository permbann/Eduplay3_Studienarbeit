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

class StartScene extends Phaser.Scene {
    constructor() {
        /*
            Initializes Phaser.Scene with a key/name.
         */
        super({key: "StartScene"});
    }

    create() {
        /*
            Phaser function that executes on activating this scene.
            Displays hint text and animate it to bounce in place.
            Reads any keyboard key press to start the main game.
         */
        this.hint_text = this.add.text(400, 460, 'Drücke eine Taste um Loszulegen!', {
            font: '38px Trebuchet MS',
            fill: '#dadada'
        }).setOrigin(0.5);

        var tween = this.tweens.add({
            targets: this.hint_text,
            alpha: {from: 0.8, to: 1},
            ease: 'Elastic',
            y: "+=5",
            duration: 2000,
            repeat: -1,            // -1: infinity
            yoyo: true
        }, this);

        this.input.keyboard.on("keyup", function (e) {
            this.scene.launch('GameScene');
            this.scene.start("UIScene");
        }, this);
    }
}

export default StartScene;