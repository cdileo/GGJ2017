

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
    ggj.player = game.add.sprite(32, game.world.height - 150, 'star');
    game.physics.p2.enable(ggj.player, true);
    ggj.player.body.collideWorldBounds = true;
    ggj.player.body.mass = .1;

    ggj.horizon = game.add.sprite(0, game.world.height, 'waves');
    game.physics.p2.enable([ggj.horizon], true);
    ggj.horizon.body.clearShapes();
    ggj.horizon.body.loadPolygon('waveCollider');

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {
    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
    displaySpeeds(ggj.player);
}

function displaySpeeds(player) {
    ggj.scoreText.text = player.body.velocity.x + "\n" + player.body.force.x;

}

function displayKeys(){
    ggj.scoreText.text = "";

    if (ggj.keyboard.left.isDown)
        ggj.scoreText.text += "left. ";

    if (ggj.keyboard.right.isDown)
        ggj.scoreText.text += "right. ";

    if (ggj.keyboard.down.isDown)
        ggj.scoreText.text += "down. ";

    if (ggj.keyboard.up.isDown)
        ggj.scoreText.text += "up. ";
}