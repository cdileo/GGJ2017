var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
    //game.load.script('gamepadHandler', 'js/gamepads.js');
    game.load.script('input', 'js/input.js');
}

var ggj = {};

function create() {
    ggj.player = game.add.sprite(32, game.world.height - 150, 'star');
    game.physics.arcade.enable(ggj.player);

    // Gamepads
    ggj.gamepads = [];
    game.input.gamepad.start();
    ggj.gamepads[0] = game.input.gamepad.pad1;
    // ggj.gamepads[1] = game.input.gamepad.pad2;
    // ggj.gamepads[2] = game.input.gamepad.pad3;
    // ggj.gamepads[3] = game.input.gamepad.pad4;
    ggj.scoreText = game.add.text(16, 16, 'Not connected', { fontSize: '32px', fill: '#fff' });
    window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });
    //  Our controls (keyboard).
    ggj.keyboard = game.input.keyboard.createCursorKeys();
}

function update() {
    //For now just go through each pad each frame and see what was pressed
    if(game.input.gamepad.supported && game.input.gamepad.active)  {
        for (let i = 0; i < ggj.gamepads.length; i++){
            checkGamepad(ggj.gamepads[i]);
        }
    }
    moveThing(ggj.player, ggj.keyboard);
}

function checkGamepad (pad) {
    var gamepad0 = navigator.getGamepads()[0];
    var speed = 30;
    // Pad "connected or not" indicator
    var isConnected = [];
    if(gamepad0.connected) {
        isConnected[0] = 0;
        ggj.scoreText.text = "Gamepad 0 connected" +
            "\nA0: " + gamepad0.axes[0] +
            "\nA1: " + gamepad0.axes[1] +
            "\nA2: " + gamepad0.axes[2] +
            "\nA3: " + gamepad0.axes[3];

    } else {
        isConnected[0] = 1;
        ggj.scoreText.text = "Gamepad 0 NOT connected";
    }
    if(game.input.gamepad.pad2.connected) {
        isConnected[1] = 0;
         ggj.scoreText.text +=  "\nP2 Connected";
    } else {
        isConnected[1] = 1;
    }

    for (var i = 0; i < gamepad0.buttons.length; i++) {
        if (gamepad0.buttons[i].pressed) {
            console.log("button " + i + " pressed");
            console.log(gamepad0.buttons[i]);
        }
    }

    ggj.player.body.force.x += speed*gamepad0.axes[0];
    ggj.player.body.force.y += speed*gamepad0.axes[1];



    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1))
    {
        ggj.player.body.force.x = -200;
        console.log('left');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
        ggj.player.body.force.x = 200;
        console.log('right');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
        ggj.player.body.force.y = -200;
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
        ggj.player.body.force.y = 200;
    }
}