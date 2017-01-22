//add body (force) to sprite to make it move

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('whaleGreen', 'assets/whale_gr.png');
    game.load.image('whaleRed', 'assets/whale_re.png');
    game.load.image('whaleBlue', 'assets/whale_blu.png');
    game.load.image('whaleBlack', 'assets/whale_bl.png');

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

    ggj.players = [];
    ggj.players[0] = createPlayer("whaleRed", 0);
    ggj.players[1] = createPlayer("whaleGreen", 1);
    ggj.players[2] = createPlayer("whaleBlue", 2);
    ggj.players[3] = createPlayer("whaleBlack", 3);

    ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);


    ggj.bird = game.add.sprite(game.world.width/3, 200, 'bird');
    game.physics.p2.enable(ggj.bird);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.body.onBeginContact.add(hitBird);
    //spawn a bird every 3 seconds
    // setInterval(createBird, 1000);

    window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {

    for (var i = 0; i < 4; i++) {
        moveThing(ggj.players[i], navigator.getGamepads()[i]);    
    }
    displaySpeeds(ggj.players[2]);
    //checkGamepad(navigator.getGamepads()[0]);
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

function hitBird(playerBody, birdBody, shape, shape, eq) {
    var bird = birdBody.sprite;
    console.log(bird);
    ggj.bird.kill();

    var player = playerBody.sprite;
    ggj.scoreText.text = player.key + " Won!";

}

function createPlayer(sprite, player) {
    var newSprite = game.add.sprite(
        (player*150)+50, 
        game.world.height/3, 
        sprite);

    game.physics.p2.enable(newSprite);
    newSprite.body.collideWorldBounds = true;
    newSprite.body.mass = .1;
    newSprite.body.fixedRotation = true;
    return newSprite;
}

function checkGamepad (gamepad) {
    if (gamepad == null) {
        ggj.scoreText = "GP not connected";
        return;
    }
    var speed = 30;
    // Pad "connected or not" indicator
    var isConnected = [];
    if(gamepad.connected) {
        isConnected[0] = 0;
        ggj.scoreText.text = "Gamepad 0 connected" +
            "\nA0: " + gamepad.axes[0] +
            "\nA1: " + gamepad.axes[1] +
            "\nA2: " + gamepad.axes[2] +
            "\nA3: " + gamepad.axes[3];

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

    for (var i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed) {
            console.log("button " + i + " pressed");
            console.log(gamepad.buttons[i]);
        }
    }
}

function displaySpeeds(player) {
    ggj.scoreText.text = player.body.velocity.y + "\n" + player.body.force.y;

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