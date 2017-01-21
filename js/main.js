

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
    game.load.script('input', 'js/input.js');
}

var ggj = {};

function create() {
    ggj.player = game.add.sprite(32, game.world.height - 150, 'star');
    game.physics.arcade.enable(ggj.player);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();
}

function update() {

    moveThing(ggj.player, ggj.keyboard);
}
