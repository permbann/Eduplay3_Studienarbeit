/*

Loading all assets from disk.

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

class Bootloader extends Phaser.Scene {
    constructor() {
        /*
            Initializes the Phaser.Scene with a key/name.
         */
        super({key: "Bootloader"});
    }

    preload() {
        /*
            Phaser.Scene function that is executed once before the scene is active.
            Loads all images and sound assets into the Phaser engine memory.
         */
        this.load.image('background', 'static/assets/game/background.png');
        this.load.image('ground', 'static/assets/game/ground.png');
        this.load.image('checkpoint', 'static/assets/game/checkpoint.png');
        this.load.image('platform_basic', 'static/assets/game/platform_basic.png');
        this.load.image('star', 'static/assets/star.png');
        this.load.image('collectable', 'static/assets/game/collectable.png');
        this.load.image('trophy', 'static/assets/game/trophy.png');
        this.load.image('enemy', 'static/assets/game/enemy.png');
        this.load.image('speaker', 'static/assets/game/speaker.png');
        this.load.image('mute', 'static/assets/game/mute.png');
        this.load.spritesheet('player', 'static/assets/game/player.png', {frameWidth: 45, frameHeight: 60});
        this.load.audio('bg_music1', ['static/assets/game/music/04007 miami sunset.mp3']);
        this.load.audio('bg_music2', ['static/assets/game/music/04012 lost in space.mp3']);
        this.load.audio('bg_music3', ['static/assets/game/music/04017 fragile.mp3']);
        this.load.audio('bg_music4', ['static/assets/game/music/04020 polaris.mp3']);
        this.load.audio('bg_music5', ['static/assets/game/music/04022 sadness instrumental.mp3']);
        this.load.audio('walk_sound', ['static/assets/game/sounds/slime_walk.wav']);
        this.load.audio('jump_sound', ['static/assets/game/sounds/slime_jump.wav']);
        this.load.audio('cant_jump_sound', ['static/assets/game/sounds/cant_jump.wav']);
        this.load.audio('landing_sound', ['static/assets/game/sounds/slime_landing.wav']);
        this.load.audio('collect_sound', ['static/assets/game/sounds/collect.wav']);
        this.load.audio('finish_sound', ['static/assets/game/sounds/level_done.wav']);
    }

    update() {
        /*
            Phaser.Scene function that executes each game cycle.
            Switches to the Start screen.
         */
        this.scene.start('StartScene');
    }

}

export default Bootloader;