var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
    // game.load.script('gamepadHandler', 'js/gamepads.js');
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
    console.log('Entering gamepad check');
    if (pad && pad.connected) { 
        console.debug(pad);
    }
}
