class GameScene extends Phaser.Scene {

    constructor() {
        super({key: "game_scene"});
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.platforms = this.physics.add.staticGroup(); //Static Physics Group and assigns it to the local variable.

        //Groups are capable of creating their own Game Objects. A Physics Group will automatically create physics enabled children.
        this.platforms.create(400, 710, 'ground') //refreshBody() is required to tell the physics world about the scaled object.

        this.platforms.create(0, 200, 'plattform_blue');
        this.platforms.create(100, 200, 'plattform_blue');
        this.platforms.create(200, 200, 'plattform_blue');
        this.platforms.create(250, 400, 'plattform_blue');
        this.platforms.create(350, 400, 'plattform_blue');
        this.platforms.create(550, 400, 'plattform_blue');
        this.platforms.create(650, 500, 'plattform_blue');
        this.platforms.create(400, 500, 'plattform_blue');
        this.platforms.create(600, 650, 'plattform_blue');
        this.platforms.create(750, 650, 'plattform_blue');


        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.body.setGravityY(600) //simulate the effects of gravity on a sprite
        this.player.setDrag(250);


        this.player.setBounce(0.2); //after jumping it will bounce ever so slightly.
        this.player.setCollideWorldBounds(true);


        //There are 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 3,
            repeat: -1
        }); //animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.

        this.anims.create({
            key: 'turn',
            frames: [{key: 'player', frame: 4}],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 5, end: 8}),
            frameRate: 3,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);
        //this.physics.add.collider(this.player, this.platforms2);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        let steering_keys = {
            'left': this.cursors.left.isDown,
            'right': this.cursors.right.isDown,
            'up': this.cursors.up.isDown,
            'none': !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown
        }
        handle_player_input(this.player, steering_keys);
    }
}

function handle_player_input(player, input_keys) {
    if (player.body.touching.down) {
        player.setDrag(300);
        for (let input in input_keys) {
            if (input_keys[input]) {
                steer(player, input);
            }
        }
    } else {
        player.setDrag(50);
        for (let input in input_keys) {
            if (input_keys[input]) {
                steer(player, input, false);
                break;
            }
        }
    }
}

function steer(player, direction, on_ground = true, max_speed = 200) {
    if (on_ground) {
        switch (direction) {
            case 'left':
                accelerate_player(player, -20, max_speed);
                //player.setVelocityX(-200);
                player.anims.play(direction, true);
                break;
            case 'right':
                accelerate_player(player, 20, max_speed);
                //player.setVelocityX(200);
                player.anims.play(direction, true);
                break;
            case 'up':
                player.setVelocityY(-500);
                break;
            default:
                player.anims.play('turn');
                break;
        }
    } else {
        switch (direction) {
            case 'left':
                accelerate_player(player, -2, max_speed);
                //player.setVelocityX(-50);
                player.anims.play(direction, true);
                break;
            case 'right':
                accelerate_player(player, 2, max_speed);
                //player.setVelocityX(50);
                player.anims.play(direction, true);
                break;
            case 'up':
                //this.player.setVelocityY(-500);
                break;
            default:
                player.anims.play('turn');
                break;
        }
    }
}

function accelerate_player(player, value, max_speed) {
    if (player.body.velocity.x <= max_speed && player.body.velocity.x >= -max_speed) {
        player.setVelocityX(player.body.velocity.x + value);
    } else if (player.body.velocity.x > 0) {
        player.setVelocityX(max_speed);
    } else {
        player.setVelocityX(-max_speed);
    }
}

export default GameScene;