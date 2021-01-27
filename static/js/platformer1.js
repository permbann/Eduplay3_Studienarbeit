

//The config object is how you configure your Phaser Game.
var config = {
    type: Phaser.AUTO, //automatically tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas.
    width: 800, //size of the canvas element that Phaser will create.
    height: 720, //size of the canvas element that Phaser will create.
    physics: { //include physics support. | there are other systems too: Impact Physics and Matter.js Physics.
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var score = 0;
var scoreText;
var jump_count;
var jumps_text;

var game = new Phaser.Game(config);

function preload ()
{
    //first value here is a key to the loaded resource
    this.load.image('sky', 'static/assets/181.png');
    this.load.image('ground', 'static/assets/platform.png');
    this.load.image('star', 'static/assets/star.png');
    this.load.image('bomb', 'static/assets/bomb.png');
    this.load.spritesheet('dude', 'static/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('matrix0', 'static/assets/matrix_gif/frame_00_delay-0.1s.gif');
    this.load.image('matrix1', 'static/assets/matrix_gif/frame_01_delay-0.1s.gif');
    this.load.image('matrix2', 'static/assets/matrix_gif/frame_02_delay-0.1s.gif');
    this.load.image('matrix3', 'static/assets/matrix_gif/frame_03_delay-0.1s.gif');
    this.load.image('matrix4', 'static/assets/matrix_gif/frame_04_delay-0.1s.gif');
    this.load.image('matrix5', 'static/assets/matrix_gif/frame_05_delay-0.1s.gif');
    this.load.image('matrix6', 'static/assets/matrix_gif/frame_06_delay-0.1s.gif');
    this.load.image('matrix7', 'static/assets/matrix_gif/frame_07_delay-0.1s.gif');
    this.load.image('matrix8', 'static/assets/matrix_gif/frame_08_delay-0.1s.gif');
    this.load.image('matrix9', 'static/assets/matrix_gif/frame_09_delay-0.1s.gif');
    this.load.image('matrix10', 'static/assets/matrix_gif/frame_10_delay-0.1s.gif');
    this.load.image('matrix11', 'static/assets/matrix_gif/frame_11_delay-0.1s.gif');
    this.load.image('matrix12', 'static/assets/matrix_gif/frame_12_delay-0.1s.gif');
    this.load.image('matrix13', 'static/assets/matrix_gif/frame_13_delay-0.1s.gif');
    this.load.image('matrix14', 'static/assets/matrix_gif/frame_14_delay-0.1s.gif');
    this.load.image('matrix15', 'static/assets/matrix_gif/frame_15_delay-0.1s.gif');
    this.load.image('matrix16', 'static/assets/matrix_gif/frame_16_delay-0.1s.gif');
    this.load.image('matrix17', 'static/assets/matrix_gif/frame_17_delay-0.1s.gif');
    this.load.image('matrix18', 'static/assets/matrix_gif/frame_18_delay-0.1s.gif');
    this.load.image('matrix19', 'static/assets/matrix_gif/frame_19_delay-0.1s.gif');
    this.load.image('matrix20', 'static/assets/matrix_gif/frame_20_delay-0.1s.gif');
    this.load.image('matrix21', 'static/assets/matrix_gif/frame_21_delay-0.1s.gif');
    this.load.image('matrix22', 'static/assets/matrix_gif/frame_22_delay-0.1s.gif');
    this.load.image('matrix23', 'static/assets/matrix_gif/frame_23_delay-0.1s.gif');
    this.load.image('matrix24', 'static/assets/matrix_gif/frame_24_delay-0.1s.gif');
    this.load.image('matrix25', 'static/assets/matrix_gif/frame_25_delay-0.1s.gif');
    this.load.image('matrix26', 'static/assets/matrix_gif/frame_26_delay-0.1s.gif');
    //creating a new Image Game Object and adding it to the current Scenes display list. This list is where all of your Game Objects live.
}

function create ()
{
    //this.add.image(400, 300, 'sky');
    //this.add.image(0, 0, 'sky').setOrigin(0, 0);

    this.anims.create({
        key: 'matrix_bg',
        frames: [
            { key: 'matrix0' },
            { key: 'matrix1' },
            { key: 'matrix2' },
            { key: 'matrix3' },
            { key: 'matrix4' },
            { key: 'matrix5' },
            { key: 'matrix6' },
            { key: 'matrix7' },
            { key: 'matrix8' },
            { key: 'matrix9' },
            { key: 'matrix10' },
            { key: 'matrix11' },
            { key: 'matrix12' },
            { key: 'matrix13' },
            { key: 'matrix14' },
            { key: 'matrix15' },
            { key: 'matrix16' },
            { key: 'matrix17' },
            { key: 'matrix18' },
            { key: 'matrix19' },
            { key: 'matrix20' },
            { key: 'matrix21' },
            { key: 'matrix22' },
            { key: 'matrix23' },
            { key: 'matrix24' },
            { key: 'matrix25' },
            { key: 'matrix26' }
        ],
        frameRate: 20,
        repeat: -1
    });

    this.add.sprite(800/2, 720/2, 'matrix0').anims.play('matrix_bg', false);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }); //Text Game Object
    jumps_text = this.add.text(16, 50, 'Sprünge: ' + get_jumps(), { fontSize: '32px', fill: '#000' })

    //In Arcade Physics there are two types of physics bodies: Dynamic and Static.
    platforms = this.physics.add.staticGroup(); //Static Physics Group and assigns it to the local variable.

    //Groups are capable of creating their own Game Objects. A Physics Group will automatically create physics enabled children.
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //refreshBody() is required to tell the physics world about the scaled object.

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    player = this.physics.add.sprite(100, 450, 'dude');
    player.body.setGravityY(600) //simulate the effects of gravity on a sprite

    player.setBounce(0.2); //after jumping it will bounce ever so slightly.
    player.setCollideWorldBounds(true);

    //There are 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    }); //animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    //In Phaser 3 the Animation Manager is a global system. Animations created within it are globally available to all
    // Game Objects. They share the base animation data while managing their own timelines. This allows you to define a
    // single animation once and apply it to as many Game Objects as you require.

    this.physics.add.collider(player, platforms);
    //This object monitors two physics objects (which can include Groups) and checks for collisions or overlap between
    // them. If that occurs it can then optionally invoke your own callback

    cursors = this.input.keyboard.createCursorKeys();
    //built-in Keyboard manager This populates the cursors object with
    // four properties: up, down, left, right, that are all instances of Key objects.


    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    }); //creates 12 stars in total every 70 px

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);



    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (cursors.left.isDown) //left key is being held down.
    {
        player.setVelocityX(-220);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(220);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down && jump_count > 0)
    {
        player.setVelocityY(-580);
        update_jumps();
        console.log("jumped");
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 420;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); //always on the opposite side of the screen to the player

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

function get_jumps()
{
    $.ajax({
        async: false,
        type: 'GET',
        url: '/api/jumps',
        success: function(data) {
            jump_count = parseInt(data['jumps']);
        }
    });
    return jump_count;
}

function update_game_jumps_label(change=-1)
{
    if (jump_count)
    {
        jump_count += change;
        jumps_text.setText('Sprünge: ' + jump_count);
    }
    else
    {
        jumps_text.setText('Sprünge: ' + get_jumps());
    }
}

function update_jumps()
{
    $.ajax({
        async: false,
        type: 'PUT',
        data: {change: -1},
        url: '/api/update_jumps',
        success: function(response) {
            console.log("updating jumps: " + response);
            update_game_jumps_label();
            document.getElementById("jumps_label").innerHTML =
                parseInt(document.getElementById("jumps_label").innerHTML) - 1;
        }
    });
    console.log(jump_count);
}