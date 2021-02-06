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

class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "Bootloader"});

    }

    preload() {
        this.load.image('background', 'static/assets/game/background.png');
        this.load.image('ground', 'static/assets/game/ground.png');
        this.load.image('checkpoint', 'static/assets/game/checkpoint.png');
        this.load.image('platform_blue', 'static/assets/game/plattform_basic.png');
        this.load.image('star', 'static/assets/star.png');
        this.load.image('collectable', 'static/assets/game/collectable.png');
        this.load.spritesheet('player', 'static/assets/game/player.png', {frameWidth: 45, frameHeight: 60});
        this.load.audio('bg_music', ['static/assets/game/sounds/Lost-Jungle.mp3']);
        this.load.audio('walk_sound', ['static/assets/game/sounds/slime_walk.wav']);
        this.load.audio('jump_sound', ['static/assets/game/sounds/slime_jump.wav']);
        this.load.audio('cant_jump_sound', ['static/assets/game/sounds/cant_jump.wav']);
        this.load.audio('landing_sound', ['static/assets/game/sounds/slime_landing.wav']);
        this.load.audio('collect_sound', ['static/assets/game/sounds/collect.wav']);
        this.load.audio('finish_sound', ['static/assets/game/sounds/level_done.wav']);
    }

    update() {
        this.scene.start('StartScene');
    }

}

export default Bootloader;