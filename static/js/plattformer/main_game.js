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

import Bootloader from './bootloader.js';
import GameScene from './scenes/game_scene.js';
import UIScene from './scenes/ui_scene.js';
import StartScene from './scenes/start_scene.js';

//The config object is how you configure your Phaser Game.
var config = {
    type: Phaser.AUTO,  //automatically tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas.
    width: 800,         //size of the canvas element that Phaser will create.
    height: 720,        //size of the canvas element that Phaser will create.
    physics: {          //include physics support. | there are other systems too: Impact Physics and Matter Physics.
        default: 'arcade',
        arcade: {
            overlapBias: 8,
            debug: false
        }
    },
    parent: 'game',     //canvas html element id
    scene: [Bootloader, StartScene, GameScene, UIScene],
    callbacks: {
        postBoot: function (game) {
            game.scene.dump();
        }
    }
};

var game = new Phaser.Game(config);

function update_game_jumps_label(change = -1) {
    /*
        Exported funciton that can be accessed by the Math-Minigame and updates the jump count on the ui.
     */
    let scene = game.scene.scenes[3]; //ui scene
    if (scene.jump_count) {
        scene.jump_count = change;
        scene.jumps_text.setText('Sprünge: ' + scene.jump_count);
    } else {
        if (scene.jumps_text) {
            scene.get_jumps();
        }
    }
}
export {game};
export default update_game_jumps_label;