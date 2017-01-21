

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
    game.load.image('backgroundWaves', 'assets/tempBackground.png');
    game.load.physics('waveCollider', 'assets/tempBackgroundCollider.json');
}

var ggj = {};

function create() {
    ggj.player = game.add.sprite(32, game.world.height - 150, 'star');
    game.physics.arcade.enable(ggj.player);
    ggj.player.body.collideWorldBounds = true;

    ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();
}

function update() {
    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
}
