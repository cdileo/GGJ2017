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
    // Pad "connected or not" indicator
    var isConnected = [];
    if(game.input.gamepad.pad1.connected) {
        isConnected[0] = 0;
        console.log('pad1 connected');
    } else {
        isConnected[0] = 1;
    }
    if(game.input.gamepad.pad2.connected) {
        isConnected[1] = 0;
    } else {
        isConnected[1] = 1;
    }

    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    {
        ggj.player.x--;
        console.log('left');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
        ggj.player.x++;
        console.log('right');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
        ggj.player.y--;
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
        ggj.player.y++;
    }
}