//add body (force) to sprite to make it move

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', 'assets/background.png');
    
    game.load.spritesheet('whaleRed', 'assets/red.png', 128, 92);
    game.load.spritesheet('whaleGreen', 'assets/green.png', 128, 92);
    game.load.spritesheet('whaleBlue', 'assets/blue.png', 128, 92);
    game.load.spritesheet('whaleBlack', 'assets/black.png', 128, 92);

    //game.load.image('bird', 'assets/bird.png');
    game.load.spritesheet('bird', 'assets/birdani.png', 88, 46);
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
}

var ggj = {};
var birds = [];
var birdsAdded = 0;

function create() {
    //game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.setBoundsToWorld();
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.add.sprite(0, 0, 'background');

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

    window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });

    setInterval(createBird, 1000);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();

    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
}

function update() {

    //moveThing(ggj.players[i], ggj.keyboard); 
    for (var i = 0; i < 4; i++) {
        moveThing(ggj.players[i], navigator.getGamepads()[i]);   
    }


    for (var i = 0; i < birds.length; i++) {
        //birds.animations.play('right');
        if (birds[i].body && birds[i].body.x > game.world.width) {
            birds[i].destroy();
        }
    }
    ggj.scoreText.text = birds.length; 
}

function createBird() {
    ggj.bird = game.add.sprite(0, 50, 'bird');
    game.physics.p2.enable(ggj.bird);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.events.onOutOfBounds.destroy = true;
    ggj.bird.body.velocity.x = 500;
    //add(name, frames, frameRate, loop, useNumericIndex)
    ggj.bird.animations.add('right', [8, 9, 10, 11 , 12, 13, 14, 15], 10, true);
    ggj.bird.animations.play('right');
    var found = false;
    //ggj.bird.body.onBeginContact.add(hitBird);

    // Place bird in array
    for (var i = 0; i < birds.length; i++) {
        if (birds[i].body == null) {
            found = true;
            birds[i] = ggj.bird;
        }
    } 
    if (!found) birds.push(ggj.bird);
}

function addBird() {

    //collide with bird and bird won't move
    // ggj.bird.body.data.shapes[0].sensor = true;
    // ggj.bird.body.onBeginContact.add(hitBird);
    
}

// function birdOut(bird) {
//     bird.reset(bird.x, 0);
// }

function hitBird(playerBody, birdBody, shape, shape, eq) {
    var bird = birdBody.sprite;
    console.log(bird);
    ggj.bird.kill();

    var player = playerBody.sprite;
    ggj.scoreText.text = player.key + " Won!";

}

function createPlayer(sprite, player) {
    if (navigator.getGamepads()[player] &&
        navigator.getGamepads()[player].connected) {
        console.log("gamepad " + player + " connected");
    }
    else {
        console.log("gamepad " + player + " NOT connected");
    }

    var newSprite = game.add.sprite(
        (player*150)+50, 
        game.world.height/3, 
        sprite);

    game.physics.p2.enable(newSprite);
    newSprite.body.collideWorldBounds = true;
    newSprite.body.mass = .1;
    newSprite.body.fixedRotation = true;

    newSprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    newSprite.animations.add('left', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);

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