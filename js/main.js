

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { 
    preload: preload, 
    create: create, 
    update: update,
    render: render });

function preload() {
    game.load.image('whaleGreen', 'assets/whale_gr.png');
    game.load.image('bird', 'assets/bird.png');
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
    game.load.image('tempBackground', 'assets/tempBackground.png');
    game.load.physics('tempBackgroundCollider', 'assets/tempBackgroundCollider.json');
}

var ggj = {};

function create() {
    game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.startSystem(Phaser.Physics.P2JS);


    // Waves
    ggj.horizon = game.add.sprite(game.world.width, game.world.height, 'tempBackground');
    var hor = ggj.horizon;
    game.physics.p2.enable([hor], true);
    hor.body.clearShapes();
    if (hor.body.loadPolygon('tempBackgroundCollider', 'tempBackground')) console.log('Succeded in loading new wave poly');
    // Change our polygon to be only a sensor, not a physics collider.
    for (let i in hor.body.data.shapes) {
        hor.body.data.shapes[i].sensor = true;
    }
    hor.anchor.x = 1;
    hor.anchor.y = 1;
    hor.body.onBeginContact.add(displayOverlapState, this);
    let horDebugGraphic = new Phaser.Graphics(game, 0, game.world.height);
    for (let i in hor.body.data.shapes) {
        horDebugGraphic.beginFill(0xff0000);
        horDebugGraphic.drawPolygon(hor.body.data.shapes[i].vertices);
        horDebugGraphic.endFill();
    }

    // Player
    ggj.player = game.add.sprite(50, 50, 'whaleGreen');

    game.physics.p2.enable(ggj.player, true);
    ggj.player.body.collideWorldBounds = true;
    ggj.player.body.mass = .1;
    ggj.player.body.fixedRotation = true;

    // ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    // ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);

    ggj.bird = game.add.sprite(game.world.width/3, 200, 'bird');
    game.physics.p2.enable(ggj.bird, true);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.body.onBeginContact.add(hitBird);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
    ggj.collisionText = game.add.text(16, 32, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {
    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
    displaySpeeds(ggj.player);
}

function render() {

}

// Simple test for overlap state
function displayOverlapState(e) {
    // obj1.body.onBeginContact.add(handleOverlapListener, this);
    console.log(e);
}

function handleOverlapListener() {
    console.log('Overlap!');
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