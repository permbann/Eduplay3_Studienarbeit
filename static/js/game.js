var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config);

function preload() {

}

function create ()
{
    //var graphics = this.add.graphics();
    //var points = [100, 100, 150, 150, 150, 200, 100, 250];
    //var polygon = new Phaser.Geom.Polygon(points);
    //graphics.fillPoints(polygon.points, true);

    var r1 = this.add.rectangle(200, 200, 148, 148, 0x6666ff);

    var r2 = this.add.rectangle(400, 200, 148, 148, 0x9966ff);

    r2.setStrokeStyle(4, 0xefc53f);

    var r3 = this.add.rectangle(600, 200, 148, 148);

    r3.setStrokeStyle(2, 0x1a65ac);

    var r4 = this.add.rectangle(200, 400, 148, 148, 0xff6699);

    var r5 = this.add.rectangle(400, 400, 148, 148, 0xff33cc);

    var r6 = this.add.rectangle(600, 400, 148, 148, 0xff66ff);

    this.tweens.add({

        targets: r4,
        scaleX: 0.25,
        scaleY: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });

    this.tweens.add({

        targets: r5,
        alpha: 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });

    this.tweens.add({

        targets: r6,
        angle: 90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });
}

function update() {
    if (game.input.mousePointer.isDown)
    {
        console.log('mouse at:' + game.input.mousePointer.x + '|' + game.input.mousePointer.y)
        var r = this.add.rectangle(game.input.mousePointer.x, game.input.mousePointer.y, 148, 148, 0xaaaaff);
        //fading out and destorying it after
        this.tweens.add({
                targets: r,
                ease: 'Sine.easeInOut',
                alpha:0.0,
                duration: 500,
                yoyo: true,
                onComplete:function(){
                    r.destroy();
                },
            });
    }
}
