import Bootloader from './bootloader.js';
import GameScene from './scenes/game_scene.js'

//The config object is how you configure your Phaser Game.
var config = {
    type: Phaser.AUTO, //automatically tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas.
    width: 800, //size of the canvas element that Phaser will create.
    height: 720, //size of the canvas element that Phaser will create.
    physics: { //include physics support. | there are other systems too: Impact Physics and Matter.js Physics.
        default: 'arcade',
        arcade: {
            //gravity: {y: 600},
            debug: false
        }
    },
    parent: 'game',
    scene: [Bootloader, GameScene],
    callbacks: {
        postBoot: function (game) {
            game.scene.dump();
        }
    }
};


var game = new Phaser.Game(config);

function update_game_jumps_label() {
}

export default update_game_jumps_label;