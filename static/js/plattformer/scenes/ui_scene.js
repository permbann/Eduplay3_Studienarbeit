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

class UIScene extends Phaser.Scene {
    jump_count;
    currency_text;
    currency;
    tokens = 0;
    main_game;

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
        this.load_currency();
        this.ending = false;

        //  Text object to display the Score
        this.get_jumps();
        this.currency_text = this.add.text(10, 10, 'Tokens: ' + this.tokens, {
            font: '48px Trebuchet MS',
            fill: "#000000"
        }, this);

        // Setting up a mute button
        this.muted = false;
        this.mute_button = this.add.image(730, 20, "speaker").setOrigin(0, 0);
        this.mute_button.setInteractive();
            this.mute_button.on('pointerdown', () => {
                this.toggle_mute();
            }, this);

        //  Reference to the Game Scene
        this.main_game = this.scene.get('GameScene');

        //  Listen for events from it
        this.main_game.events.on('jumped', function () {
            this.update_jumps();
            this.main_game.jump_count = this.jump_count;
        }, this);

        this.main_game.events.on('finished', function () {
            if(!this.ending)
                this.update_currency();
                this.draw_finished();
        }, this);

        this.main_game.events.on('failed', function () {
            if(!this.ending)
                this.draw_finished(false);
        }, this);


        this.main_game.events.on('collected', function () {
            this.update_tokens();
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
                parent.jump_count = response['jumps'];
                document.getElementById("jumps_label").innerHTML = response['jumps'];
            }
        });
    }

    update_tokens() {
        /*
        Adds +1 to the local token counter after collection
         */
        this.tokens += 1;
        let parent = this;
        parent.currency_text.setText('Tokens: ' + this.tokens);
    }

    update_currency() {
        /*
        Makes API call to update the currency with currency + collected tokens after level completion
        */
        $.ajax({
            type: 'PATCH',
            data: {currency: this.tokens},
            url: '/api/update_currency',
            success: function (response) {
                this.currency = parseInt(response['currency']);
                document.getElementById('tokens_all').innerHTML = "Tokens Gesamt: " + this.currency;
            }
        });
    }


    draw_finished(win = true) {
        /*
            Creates the text objects on the screen indicating giving options of what to do next.
            Options:
              only on win:
                 - increase difficulty
                 - go to shop
              - restart game
         */
        this.ending = true;
        let retry;
        let shop;
        let label_text;
        let increase_difficulty;
        this.main_game.cameras.main.fadeOut(1000, 250, 250, 250);

        if (win) {
            // Clickable, hoverable text
            increase_difficulty = this.add.text(400, 150, " Nächste Swierigkeitsstufe aktivieren ", {
                font: '44px Trebuchet MS', fill: "#8888FF", backgroundColor: "#11221166"
            }, this);
            increase_difficulty.setOrigin(0.5);
            this.add_text_hover(increase_difficulty, "#8888FF", "#8888BB");
            increase_difficulty.setInteractive();
            increase_difficulty.on('pointerdown', () => {
                this.update_difficulty();
                increase_difficulty.destroy();
            });

            // Plain text
            label_text = this.add.text(400, 260, " Gesammelte Teile: " + this.tokens + " ", {
                font: '38px Trebuchet MS', fill: "#222222"
            }, this);
            label_text.setOrigin(0.5);

            // Clickable, hoverable text
            shop = this.add.text(400, 310, ' Zum Shop ', {
                font: '48px Trebuchet MS', fill: "#005353", backgroundColor: "#11221166"
            }, this);
            shop.setOrigin(0.5);
            this.add_text_hover(shop, "#117373", "#33CC77");
            shop.setInteractive();
            shop.on('pointerdown', () => {
                retry.destroy();
                shop.destroy();
                label_text.destroy();
                window.location.href = "/shop/hats";
            });

            // Plain text -> will be made Clickable and hoverable
            retry = this.add.text(400, 420, ' Weiter zum nächsten Level ', {
                font: '54px Trebuchet MS', fill: "#FAFAFA", backgroundColor: "#11221166"
            }, this);
            retry.setOrigin(0.5);
        }
        else {
            // Plain text
            label_text = this.add.text(400, 260, "Leider nicht geschafft.", {
                font: '48px Trebuchet MS', fill: "#222222"
            }, this);
            label_text.setOrigin(0.5);

            // Plain text -> will be made Clickable and hoverable
            retry = this.add.text(400, 420, ' Nochmal versuchen ', {
                font: '58px Trebuchet MS', fill: "#FAFAFA", backgroundColor: "#11221166"
            }, this);
            retry.setOrigin(0.5);
        }

        // Adding Clickable and hover to text
        this.add_text_hover(retry, "#FAFAFA", "#12AA21");
        retry.setInteractive();
        retry.on('pointerdown', () => {
            retry.destroy();
            this.tokens = 0;
            this.currency_text.setText('Tokens: ' + this.tokens);
            label_text.destroy();
            if(increase_difficulty) increase_difficulty.destroy();
            if(shop) shop.destroy();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.cameras.main.fadeIn(500, 0, 0, 0);
                this.main_game.scene.restart();
                this.ending = false;
            }, this);

        });
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
            Updates the current balance variable to the api value asynchronously.
        */
        let scene = this;
        $.ajax({
            type: 'GET',
            url: '/api/currency',
            success: function (response) {
                scene.balance = parseInt(response['currency']);
            }
        });
    }

     update_difficulty() {
         /*
            Makes API call to increase the difficulty by 1.
         */
        let parent = this;
        $.ajax({
            type: 'PATCH',
            data: {change: 1},
            url: '/api/update_difficulty',
            success: function (response) {
                document.getElementById("difficulty_label").innerHTML = response['active_difficulty'];
            }
        });
    }

    toggle_mute() {
        /*
            Toggles the mute of all game sounds. They will continue playing muted.
         */
        game.sound.mute = !game.sound.mute;
        this.muted = !this.muted;  //game.sound.mute does not update in a reliable time
        if(this.muted)
        {
            this.muted_line = this.add.image(this.mute_button.x, this.mute_button.y, "mute").setOrigin(0, 0);
        }
        else
        {
            this.muted_line.destroy()
        }
    }
}

export default UIScene;