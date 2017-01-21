

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
    game.load.image('waves', 'assets/tempBackground.png');
    game.load.physics('waveCollider', 'assets/tempBackgroundCollider.json');
}

var ggj = {};

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    ggj.player = game.add.sprite(0, 0, 'star');
    game.physics.p2.enable(ggj.player);
    ggj.player.body.collideWorldBounds = true;

    ggj.horizon = game.add.sprite(0, game.world.height, 'waves');
    game.physics.p2.enable([ggj.horizon], true);
    ggj.horizon.body.clearShapes();
    ggj.horizon.body.loadPolygon('waveCollider');

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();
}

function update() {
    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
}
