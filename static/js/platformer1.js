

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

var game = new Phaser.Game(config);

function preload ()
{
    //first value here is a key to the loaded resource
    this.load.image('sky', 'static/assets/sky.png');
    this.load.image('ground', 'static/assets/platform.png');
    this.load.image('star', 'static/assets/star.png');
    this.load.image('bomb', 'static/assets/bomb.png');
    this.load.spritesheet('dude', 'static/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    //creating a new Image Game Object and adding it to the current Scenes display list. This list is where all of your Game Objects live.
}

function create ()
{
    //this.add.image(400, 300, 'sky');
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }); //Text Game Object

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

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-580);
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