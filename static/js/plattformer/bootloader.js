class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "bootloader"});

    }

    preload() {
        console.log('hello');
        this.load.image('background', 'static/assets/game/background.png');
        this.load.image('ground', 'static/assets/game/ground.png');
        this.load.image('checkpoint', 'static/assets/game/checkpoint.png');
        this.load.image('plattform_blue', 'static/assets/game/plattform_blue_100.png');
        this.load.image('star', 'static/assets/star.png');
        this.load.spritesheet('player', 'static/assets/game/player.png', {frameWidth: 35, frameHeight: 45});
    }

    update() {
        this.scene.start('game_scene');
    }

}

export default Bootloader;