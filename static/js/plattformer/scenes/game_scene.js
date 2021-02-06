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

import {game} from "../main_game.js";

class GameScene extends Phaser.Scene {
    world_width = 1600;
    wolrd_height = 2160;
    walk_sound;
    jump_sound;
    cant_jump_sound;
    landing_sound;
    collect_sound;
    finish_sound;

    constructor() {
        super({key: "GameScene"});
    }

    create() {
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.init_sounds()

        this.physics.world.setBounds(0, 0, this.world_width, this.wolrd_height);
        this.platforms = this.physics.add.staticGroup(); //Static Physics Group and assigns it to the local variable.

        //Groups are capable of creating their own Game Objects. A Physics Group will automatically create physics enabled children.
        this.platforms.create(this.world_width / 2,
            this.wolrd_height - this.textures.get('ground').getSourceImage().height / 2, 'ground');

        this.collectables = this.physics.add.staticGroup();
        this.load_level();


        this.player = this.physics.add.sprite(100,
            this.wolrd_height - this.textures.get('ground').getSourceImage().height - 100, 'player');
        this.player.body.setGravityY(600) //simulate the effects of gravity on a sprite
        this.player.setDrag(250);
        this.player.setBounce(0.2); //after jumping it will bounce ever so slightly.
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);


        //There are 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1
        }); //animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.

        this.anims.create({
            key: 'turn',
            frames: [{key: 'player', frame: 2}],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 3, end: 4}),
            frameRate: 3,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms, this.landing, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.music = this.sound.add('bg_music', {volume: 0.5, loop: true});
        window.setTimeout(() => {
            this.music.play();
        }, 500);

        //this.spawn_random(1000);
        this.physics.add.overlap(this.player, this.collectables, this.collect, null, this);
    }

    update() {
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
        if (!this.player.is_walking) {
            this.walk_sound.stop();
        }

        let steering_keys = {
            'left': this.cursors.left.isDown,
            'right': this.cursors.right.isDown,
            'up': this.cursors.up.isDown,
            'none': !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown
        }
        this.handle_player_input(steering_keys);
    }

    handle_player_input(input_keys) {
        if (this.player.body.touching.down) {
            this.player.setDrag(300);
            for (const [input, is_true] of Object.entries(input_keys)) {
                if (is_true) {
                    this.steer(input);
                }
            }
        } else {
            this.player.setDrag(50);
            this.player.is_walking = false;
            for (const [input, is_true] of Object.entries(input_keys)) {
                if (is_true) {
                    this.steer(input, false);
                }
            }
        }
    }

    steer(direction, on_ground = true, max_speed = 200) {
        if (on_ground) {
            switch (direction) {
                case 'left':
                    this.accelerate_player(-20, max_speed);
                    this.player.anims.play(direction, true);
                    if (!this.player.is_walking) {
                        this.walk_sound.play();
                        this.player.is_walking = true;
                    }
                    break;
                case 'right':
                    this.accelerate_player(20, max_speed);
                    this.player.anims.play(direction, true);
                    if (!this.player.is_walking) {
                        this.walk_sound.play();
                        this.player.is_walking = true;
                    }
                    break;
                case 'up':
                    if (this.scene.get('UIScene').jump_count > 0) {
                        this.player.setVelocityY(-550);
                        this.player.is_walking = false;
                        this.jump_sound.play();
                        this.player.is_jumping = true;
                        this.events.emit('jumped');
                    } else {
                        this.cant_jump_sound.play();
                    }
                    break;
                default:
                    this.player.anims.play('turn');
                    this.player.is_walking = false;
                    break;
            }
        } else {
            switch (direction) {
                case 'left':
                    this.accelerate_player(-2, max_speed);
                    //player.setVelocityX(-50);
                    this.player.anims.play(direction, true);
                    break;
                case 'right':
                    this.accelerate_player(2, max_speed);
                    //player.setVelocityX(50);
                    this.player.anims.play(direction, true);
                    break;
                case 'up':
                    if (this.player.body.velocity.y > 100) {
                        this.player.setVelocityY(this.player.body.velocity.y - 10);
                    }
                    break;
                default:
                    this.player.anims.play('turn');
                    break;
            }
        }
    }

    accelerate_player(value, max_speed) {
        if (this.player.body.velocity.x <= max_speed && this.player.body.velocity.x >= -max_speed) {
            this.player.setVelocityX(this.player.body.velocity.x + value);
        } else if (this.player.body.velocity.x > 0) {
            this.player.setVelocityX(max_speed);
        } else {
            this.player.setVelocityX(-max_speed);
        }
    }

    load_level() {
        let scene = this;
        $.getJSON("/api/level/level1", function (level_data) {

            $.each(level_data["platforms"], function (index) {
                switch (level_data["platforms"][index].type) {
                    case 'example':
                        break;
                    default:
                        let x = level_data["platforms"][index].x + scene.textures.get('platform_blue').getSourceImage().width / 2;
                        let y = level_data["platforms"][index].y + scene.textures.get('platform_blue').getSourceImage().height / 2;
                        scene.platforms.create(x, y, 'platform_blue');
                }
            });

            scene.platforms.children.each(function (platform, index) {
                if(index>0){  // skip the ground platform
                    scene.collectables.create(platform.x, platform.y - 80, 'collectable').alpha = 0.6;
                }
            });
        });


    }

    init_sounds() {
        this.walk_sound = this.sound.add('walk_sound', {volume: 1, loop: true});  // delay to allow landing sound
        this.jump_sound = this.sound.add('jump_sound', {volume: 0.3});
        this.cant_jump_sound = this.sound.add('cant_jump_sound', {volume: 1});
        this.landing_sound = this.sound.add('landing_sound', {volume: 2});
        this.collect_sound = this.sound.add('collect_sound', {volume: 1});
        this.finish_sound = this.sound.add('finish_sound', {volume: 1});
    }

    spawn_random(amount) {

        for (let i = 0; i < amount; i++) {
            let x = Phaser.Math.Between(0, this.world_width);
            let y = Phaser.Math.Between(0, this.wolrd_height);
            this.collectables.create(x, y, 'collectable').alpha = 0.5;
        }

    }

    collect(player, collectable) {
        this.collect_sound.play();
        collectable.disableBody(true, true);
    }

    landing() {
        if (this.player.is_jumping) {
            if (this.player.body.touching.down) {  // allow sounds to play when bumping and landing
                this.player.is_jumping = false;
            }
            this.landing_sound.play();
        }
    }
}


export default GameScene;