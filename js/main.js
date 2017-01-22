//add body (force) to sprite to make it move

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('whaleGreen', 'assets/whale_gr.png');
    game.load.image('bird', 'assets/bird.png');
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
}

var ggj = {};
var birds = [];
var birdsAdded = 0;

function create() {
    game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.startSystem(Phaser.Physics.P2JS);
    ggj.player = game.add.sprite(32, game.world.height - 150, 'whaleGreen');
    game.physics.p2.enable(ggj.player, true);
    ggj.player.body.collideWorldBounds = true;
    ggj.player.body.mass = .1;
    ggj.player.body.fixedRotation = true;

    ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);

    //spawn a bird every 3 seconds
    setInterval(createBird, 1000);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {

    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
    displaySpeeds(ggj.player);
    // if (ggj.bird.body.x > game.world.width - 500) {
    //     ggj.bird.destroy();
    // } 
}

function createBird() {
    ggj.bird = game.add.sprite(0, 50, 'bird');
    game.physics.p2.enable(ggj.bird, true);
    ggj.bird.body.velocity.x = 200;
}

function addBird() {

    //collide with bird and bird won't move
    // ggj.bird.body.data.shapes[0].sensor = true;
    // ggj.bird.body.onBeginContact.add(hitBird);
    
}

function removeBird() {

}

function hitBird(bird, player) {
    console.log("Hit bird");

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