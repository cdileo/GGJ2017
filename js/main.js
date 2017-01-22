

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
}

var ggj = {};

function create() {
    game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.startSystem(Phaser.Physics.P2JS);

    // Waves
    ggj.horizon = game.add.sprite(0, 0, 'tempBackground');
    ggj.waveColliders = createWaveColliders();

    // Player
    ggj.player = game.add.sprite(50, 50, 'whaleGreen');

    game.physics.p2.enable(ggj.player, true);
    ggj.player.body.collideWorldBounds = true;
    ggj.player.body.mass = .1;
    ggj.player.body.fixedRotation = true;

    // ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    // ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);

    //bird
    ggj.bird = game.add.sprite(game.world.width/3, 200, 'bird');
    game.physics.p2.enable(ggj.bird, true);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.body.onBeginContact.add(hitBird);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    // ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
    // ggj.collisionText = game.add.text(16, 32, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {
    moveThing(ggj.player, ggj.keyboard, ggj.horizon);
    //displaySpeeds(ggj.player);
}

function render() {
    game.debug.inputInfo(32, 32);
    game.debug.pointer( game.input.activePointer );
    // for (let i in ggj.waveColliders) {
    //     game.debug.geom(ggj.waveColliders[i], '#0fffff');
    // }
}

// Simple test for overlap state
function displayOverlapState(hor) {
    // obj1.body.onBeginContact.add(handleOverlapListener, this);
    console.log(hor);
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

function createWaveColliders() {
    let xMin = 0;
    let xMax = game.world.width;
    let yMin = 0;
    let yMax = game.world.height;
    let widths       = [132, 36, 104,  58, 128,  82, 137, 183, 164];
    let startHeights = [434,466, 551, 506, 466, 514, 448, 508, 467];
    let rects = [];
    let curX = 0;

    for (let i in widths) {
        let rect = game.add.sprite( curX, 
                                    startHeights[i], 
                                    null);
        rect.width = widths[i];
        rect.height = yMax - startHeights[i];
        rect.x += 0.5 * rect.width;
        rect.y += 0.5 * rect.height;
        game.physics.p2.enable(rect, true); 
        rect.anchor.x = 0;
        rect.anchor.y = 0;
        rect.body.setRectangleFromSprite();
        rect.body.data.shapes[0].sensor = true;
        curX += widths[i];
    }
    return rects;
}