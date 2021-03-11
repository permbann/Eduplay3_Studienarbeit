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

class UIScene extends Phaser.Scene {
    jumps_text;
    jump_count;
    currency_text;
    currency;
    main_game;
    colors = {};

    constructor() {
        /*
            Initializes the Phaser.Scene with a key/name.
         */
        super({key: 'UIScene'});
    }

    create() {
        /*
            Phaser.Scene function that is executed once on the start of the scene.
            Initialize all elements of the ui.
            Also set the event handlers for events emitted by the GameScene.
         */
        this.colors.score = '#000000';
        this.colors.retry = '#000000';
        this.colors.retry_hover = '#33aa33';
        this.colors.shop = '#444444';
        this.colors.shop_hover = '#aa3333';
        this.load_currency();

        //  Our Text object to display the Score
        this.jumps_text = this.add.text(10, 10, '', {font: '48px Trebuchet MS', fill: this.colors.score}, this);
        this.get_jumps();
        this.currency_text = this.add.text(10, 65, '', {font: '48px Trebuchet MS', fill: this.colors.score}, this);
        this.get_currency();

        //  Grab a reference to the Game Scene
        this.main_game = this.scene.get('GameScene');

        //  Listen for events from it
        this.main_game.events.on('jumped', function () {
            this.update_jumps();
            this.main_game.jump_count = this.jump_count;
        }, this);

        this.main_game.events.on('finished', function () {
            this.draw_finished();
        }, this);

        this.main_game.events.on('collected', function () {
            this.update_currency();
            this.main_game.currency = this.currency;
        }, this);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    get_jumps() {
        /*
        Makes API call to get the users jump counter and updates the ingame text.
         */
        let parent = this;
        $.ajax({
            type: 'GET',
            url: '/api/jumps',
            success: function (response) {
                parent.jump_count = parseInt(response['jumps']);
                parent.jumps_text.setText('Sprünge: ' + parent.jump_count);
            }
        });
    }

    update_jumps() {
        /*
        Makes API call to reduce the jump counter by 1 and updates both Jump counter elements (ingame and outside)
         */
        let parent = this;
        $.ajax({
            type: 'PATCH',
            data: {change: -1},
            url: '/api/update_jumps',
            success: function (response) {
                parent.jumps_text.setText('Sprünge: ' + response['jumps']);
                parent.jump_count = response['jumps'];
                document.getElementById("jumps_label").innerHTML = response['jumps'];
            }
        });
    }

    get_currency() {
        /*
        Makes API call to get the users currency counter and updates the ingame text.
         */
        let parent = this;
        $.ajax({
            type: 'GET',
            url: '/api/currency',
            success: function (response) {
                parent.currency = parseInt(response['currency']);
                parent.currency_text.setText('Tokens: ' + parent.currency);
            }
        });
    }

    update_currency() {
        /*
        Makes API call to increase the currency counter by 1 and updates both currency counter elements (ingame and outside)
         */
        let parent = this;
        $.ajax({
            type: 'PATCH',
            data: {currency: 1},
            url: '/api/update_currency',
            success: function (response) {
                parent.currency_text.setText('Tokens: ' + response['currency']);
                parent.currency = response['currency'];
            }
        });
    }

    draw_finished() {
        /*
            Creates the text objects on the screen indicating giving options of what to do next.
            Options:
             - restart game
             - go to shop
         */
        let retry = this.add.text(22, 360, 'Nochmal', {
            font: '58px Trebuchet MS', fill: this.colors.retry
        }, this);
        let shop = this.add.text(22, 310, 'Öffne die Garderobe', {
            font: '48px Trebuchet MS', fill: this.colors.retry
        }, this);
        let currency = this.add.text(22, 260, "Gesammelte Teile: " + this.currency, {
            font: '38px Trebuchet MS', fill: this.colors.retry
        }, this);

        retry.setInteractive();
        retry.on('pointerdown', () => {
            retry.destroy();
            shop.destroy();
            currency.destroy();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.cameras.main.fadeIn(500, 0, 0, 0);
                this.main_game.scene.restart();
            }, this);

        });
        shop.setInteractive();
        shop.on('pointerdown', () => {
            //TODO send to shop
            //retry.destroy();
            shop.destroy();
            currency.destroy();
        });

        this.add_text_hover(retry, this.colors.retry, this.colors.retry_hover);
        this.add_text_hover(shop, this.colors.shop, this.colors.shop_hover);
    }

    add_text_hover(text, color, hover_color) {
        /*
            Adds color change on over for provided text object with provided colors.
         */
        text.on('pointerover', () => {
            text.setStyle({fill: hover_color});
        });
        text.on('pointerout', () => {
            text.setStyle({fill: color});
        });
    }


    load_currency() {
        /*
            Updates the current currency variable to the api value asynchronously.
        */
        let scene = this;
        $.ajax({
            type: 'GET',
            url: '/api/currency',
            success: function (response) {
                scene.currency = parseInt(response['currency']);
            }
        });
    }
}

export default UIScene;