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
    world_height = 2160;
    sounds = {};
    moving_platforms;
    enemy_list;

    constructor() {
        /*
            Initializes the Phaser.Scene with a key/name.
         */
        super({key: "GameScene"});
    }

    create() {
        /*
            Phaser.Scene function that is executed once on the start of the scene.
            Initialize all elements (sound, background, platforms, player, ...) of the the game.
         */
        var scene = this;

        this.moving_platforms = [];
        this.enemy_list = [];

        this.init_sounds();
        this.time.addEvent({
            delay: 200,                // ms
            callback: function () {
                scene.sounds.music.play();
            },
        });

        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0); //places the background image in the top left corner.
        this.physics.world.setBounds(0, 0, this.world_width, this.world_height);

        //Static Physics Group and assigns it to the local variable.
        //Groups are capable of creating their own Game Objects. A Physics Group will automatically create physics enabled children.
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(this.world_width / 2,
            this.world_height - this.textures.get('ground').getSourceImage().height / 2, 'ground');

        this.collectables = this.physics.add.staticGroup();
        this.load_level_gen();


        this.spinning_platforms = this.physics.add.group();
        this.spinning_platforms.immovable = true;

        this.init_player();
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.enemies = this.physics.add.group();
        this.enemies.immovable = true;

        this.init_animations();
        this.init_colliders();

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        /*
            Phaser.Scene function that executes each game cycle.
            Resumes suspended sound context (to not get a warning message in the browser).
            Stops walking sound if movement keys are no longer pressed.
            Passes steering keys state to handle_player_input function.
         */
        for (let i = 0; i < this.moving_platforms.length; i++) {
            this.moving_platforms[i].turn();
        }
        for (let i = 0; i < this.enemy_list.length; i++)
        {
            this.enemy_list[i].turn();
        }
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
        if (!this.player.is_walking) {
            this.sounds.walk_sound.stop();
        }
        let steering_keys = {
            'left': this.cursors.left.isDown,
            'right': this.cursors.right.isDown,
            'up': Phaser.Input.Keyboard.JustDown(this.cursors.up),
            'none': !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown
        }

        this.handle_player_input(steering_keys);
    }

    handle_player_input(input_keys) {
        /*
            Sets drag according to the players ground connection.
            Invokes the steer function for each input key, passing on ground status and input key.
            :param input_keys:  Dictionary of steering keys and their state.
         */
        if (this.player.body.touching.down) {
            this.player.setDrag(300);
        } else {
            this.player.setDrag(50);
            this.player.is_walking = false;
        }
        for (const [input, is_true] of Object.entries(input_keys)) {
            if (is_true) {
                this.steer(input, this.player.body.touching.down);
            }
        }
    }

    steer(direction, on_ground = true, max_speed = 200) {
        /*
            Depending on the on_ground status go into switch case for the given input direction.
            :param direction: movement direction
            :param on_ground: player on ground status
            :param max_speed: players max movement speed
         */
        if (on_ground) {
            switch (direction) {
                case 'left':
                    this.accelerate_player(-20, max_speed);
                    this.player.anims.play(direction, true);
                    if (!this.player.is_walking) {
                        this.sounds.walk_sound.play();
                        this.player.is_walking = true;
                    }
                    break;
                case 'right':
                    this.accelerate_player(20, max_speed);
                    this.player.anims.play(direction, true);
                    if (!this.player.is_walking) {
                        this.sounds.walk_sound.play();
                        this.player.is_walking = true;
                    }
                    break;
                case 'up':
                    if (this.scene.get('UIScene').jump_count > 0) {  // only allow jumping if jump count is > 0
                        this.player.setVelocityY(-550);
                        this.player.is_walking = false;
                        this.sounds.jump_sound.play();
                        this.player.is_jumping = true;
                        this.events.emit('jumped');
                    } else {
                        this.sounds.cant_jump_sound.play();
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
                    this.accelerate_player(-4, max_speed);  // mid air speed = on ground speed/10
                    this.player.anims.play(direction, true);
                    break;
                case 'right':
                    this.accelerate_player(4, max_speed);  // mid air speed = on ground speed/10
                    this.player.anims.play(direction, true);
                    break;
                case 'up':
                    if (this.player.body.velocity.y > 100) {  // Allows slower falling when up is held
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
        /*
            Increases player horizontal velocity until max_speed is reached.
            :param value: integer value for the increase
            :param max_speed: limit for the increase
         */
        if (this.player.body.velocity.x <= max_speed && this.player.body.velocity.x >= -max_speed) {
            this.player.setVelocityX(this.player.body.velocity.x + value);
        } else if (this.player.body.velocity.x > 0) {
            this.player.setVelocityX(max_speed);
        } else {
            this.player.setVelocityX(-max_speed);
        }
    }

    load_level(level) {
        /*
            Makes an api call to receive level data json and places elements in game.
            :param level: specifies which level is to be loaded (passed with api call)
         */
        let scene = this;
        $.getJSON("/api/level/level" + level, function (level_data) {

            $.each(level_data["platforms"], function (index) {
                let x;
                let y;
                switch (level_data["platforms"][index].type) {
                    case 'final':
                        x = level_data["platforms"][index].x + scene.textures.get('platform_basic').getSourceImage().width / 2;
                        y = level_data["platforms"][index].y + scene.textures.get('platform_basic').getSourceImage().height / 2;
                        scene.platforms.create(x, y, 'platform_basic');
                        scene.collectables.create(x, y - 80, 'trophy');
                        scene.collectables.getChildren()[scene.collectables.getLength() - 1].name = "trophy";
                        break;
                    default:
                        x = level_data["platforms"][index].x + scene.textures.get('platform_basic').getSourceImage().width / 2;
                        y = level_data["platforms"][index].y + scene.textures.get('platform_basic').getSourceImage().height / 2;
                        scene.platforms.create(x, y, 'platform_basic');
                }
                if (level_data["platforms"][index].has_collectable) {
                    scene.collectables.create(x, y - 80, 'collectable').alpha = 0.6;
                }
            });
        });
    }

    load_level_gen() {
        let scene = this;
        $.getJSON("/api/genlevel", function (level_data) {
            $.each(level_data["platforms"], function (index) {
                var platform_data = level_data["platforms"][index]
                let x = platform_data.x + scene.textures.get('platform_basic').getSourceImage().width / 2;
                let y = platform_data.y + scene.textures.get('platform_basic').getSourceImage().height / 2;
                switch (platform_data.type) {
                    case 'horizontal':
                        scene.moving_platforms.push(new MovingPlatform(x, y, scene.spinning_platforms, platform_data.velocity))
                        break;
                    case 'vertical':
                        scene.moving_platforms.push(new MovingPlatform(x, y, scene.spinning_platforms, platform_data.velocity))
                        break;
                    case 'final':
                        scene.platforms.create(x, y, 'platform_basic');
                        scene.collectables.create(x, y - 80, 'trophy');
                        scene.collectables.getChildren()[scene.collectables.getLength() - 1].name = "trophy";
                        break;
                    default:
                        scene.platforms.create(x, y, 'platform_basic');
                }
                if (level_data["platforms"][index].has_collectable) {
                    scene.collectables.create(x, y - 80, 'collectable').alpha = 0.6;
                }
                if (level_data["platforms"][index].has_enemy) {
                    scene.enemy_list.push(new Enemy(x, y - 100, scene.enemies, {"x": 40, "y": 0}));
                }
            });
        });
    }

    init_player() {
        /*
            Initializes the player sprite as physics object and defines gravity, drag, bounds and world bounds collider.
         */
        this.player = this.physics.add.sprite(100,
            this.world_height - this.textures.get('ground').getSourceImage().height - 100, 'player');
        this.player.body.setGravityY(600)   //simulate the effects of gravity on a sprite
        this.player.setDrag(250);           //set friction for movement
        this.player.setBounce(0.2);         //after jumping it will bounce ever so slightly.
        this.player.setCollideWorldBounds(true);
    }

    init_sounds() {
        /*
            Initializes all game sounds and background music for the game.
         */
        this.sounds.music = this.sound.add('bg_music', {volume: 0.5, loop: true});
        this.sounds.walk_sound = this.sound.add('walk_sound', {volume: 1, loop: true});  // delay to allow landing sound
        this.sounds.jump_sound = this.sound.add('jump_sound', {volume: 0.3});
        this.sounds.cant_jump_sound = this.sound.add('cant_jump_sound', {volume: 1});
        this.sounds.landing_sound = this.sound.add('landing_sound', {volume: 2});
        this.sounds.collect_sound = this.sound.add('collect_sound', {volume: 1});
        this.sounds.finish_sound = this.sound.add('finish_sound', {volume: 1});
    }

    init_animations() {
        /*
            Defines all animations for the game.
         */
        //There are 5 frames in total, 2 for running left, 1 for facing the camera and 2 for running right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        }); //animation uses frames 0, 1 and runs at 4 frames per second.

        this.anims.create({
            key: 'turn',
            frames: [{key: 'player', frame: 2}],
            frameRate: 5
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 3, end: 4}),
            frameRate: 4,
            repeat: -1
        });
    }

    init_colliders() {
        /*
            Defines all behavior for collisions and overlapping of game objects.
         */
        this.physics.add.collider(this.player, this.platforms, this.landing, null, this);
        this.physics.add.overlap(this.player, this.collectables, this.collect, null, this);
        this.physics.add.collider(this.player, this.spinning_platforms, this.landing, null, this);
        this.physics.add.collider(this.player, this.enemies, this.game_over, null, this);
    }

    collect(player, collectable) {
        /*
            Function called from a collider destroys the collectable and emits finished event (to the ui) as well as
            pausing the game in case the trophy of the level is picked up.
         */
        if (collectable.name === "trophy") {
            let scene = this;
            scene.events.emit('finished');
            scene.time.addEvent({
                delay: 500,                // ms
                callback: function () {
                    scene.stop_sounds();
                    scene.sounds.finish_sound.play();
                    scene.scene.pause();
                },
            });
        } else {
            this.events.emit('collected');
        }
        this.sounds.collect_sound.play();
        collectable.disableBody(true, true);
    }

    stop_sounds() {
        /*
            Iterates over all game sounds and music and stops them.
         */
        $.each(this.sounds, function (k, sound) {
            sound.stop();
        }, this)
    }

    landing() {
        /*
            Plays landing sound on collider (player with platform) but only if the player is not in the air.
         */
        this.player.added_velocity = {"x": 0, "y": 0};
        if (this.player.is_jumping) {
            if (this.player.body.touching.down) {  // allow sounds to play when bumping and landing
                this.player.is_jumping = false;
            }
            this.sounds.landing_sound.play();
        }
    }

    game_over() {
        let scene = this;
        scene.events.emit('failed');
        scene.time.addEvent({
            delay: 200,                // ms
            callback: function () {
                scene.stop_sounds();
                scene.sounds.finish_sound.play();
                scene.scene.pause();
            },
        });
    }
}

class MovingPlatform {
    constructor(x, y, group, velocity) {
        this.platform = group.create(x, y, 'platform_basic');
        this.starting_position = {"x": this.platform.x, "y": this.platform.y}
        this.platform.body.immovable = true;
        this.velocity = velocity;
        this.direction = Math.sign(velocity.x)
        this.platform.body.velocity.x = velocity.x;
        this.platform.body.velocity.y = velocity.y;
        this.platform.setFrictionX(1);
    }

    turn() {
        if (this.direction > 0) {
            if (this.platform.x >= this.starting_position.x + 300) {
                this.platform.x = this.starting_position.x + 300;
                this.platform.body.velocity.x = -Math.abs(this.velocity.x);
            } else if (this.platform.x <= this.starting_position.x) {
                this.platform.x = this.starting_position.x;
                this.platform.body.velocity.x = Math.abs(this.velocity.x);
            }
        } else {
            if (this.platform.x <= this.starting_position.x - 300) {
                this.platform.x = this.starting_position.x - 300;
                this.platform.body.velocity.x = Math.abs(this.velocity.x);
            } else if (this.platform.x >= this.starting_position.x) {
                this.platform.x = this.starting_position.x;
                this.platform.body.velocity.x = -Math.abs(this.velocity.x);
            }
        }
        if (this.platform.y <= this.starting_position.y - 200) {
            this.platform.y = this.starting_position.y - 200;
            this.platform.body.velocity.y = Math.abs(this.velocity.y);
        } else if (this.platform.y >= this.starting_position.y) {
            this.platform.y = this.starting_position.y;
            this.platform.body.velocity.y = -Math.abs(this.velocity.y);
        }
    }
}

class Enemy {
    constructor(x, y, group, velocity) {
        this.sprite = group.create(x, y, 'enemy');
        this.starting_position = {"x": this.sprite.x, "y": this.sprite.y}
        this.sprite.body.immovable = true;
        this.velocity = velocity;
        this.sprite.body.velocity.x = velocity.x;
        this.sprite.body.velocity.y = velocity.y;
    }

    turn() {
        if (this.sprite.x >= this.starting_position.x + 200) {
            this.sprite.x = this.starting_position.x + 200;
            this.sprite.body.velocity.x = -Math.abs(this.velocity.x);
        } else if (this.sprite.x <= this.starting_position.x - 200) {
            this.sprite.x = this.starting_position.x - 200;
            this.sprite.body.velocity.x = Math.abs(this.velocity.x);
        }
    }
}

export default GameScene;