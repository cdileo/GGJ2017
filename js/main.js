//add body (force) to sprite to make it move

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { 
    preload: preload, 
    create: create, 
    update: update,
    render: render });


function preload() {
    game.load.image('whaleGreen', 'assets/whale_gr.png');
    game.load.image('whaleRed', 'assets/whale_re.png');
    game.load.image('whaleBlue', 'assets/whale_blu.png');
    game.load.image('whaleBlack', 'assets/whale_bl.png');

    game.load.image('bird', 'assets/bird.png');
    game.load.image('lazybound', 'assets/lazybound.png');
    game.load.script('input', 'js/input.js');
    game.load.image('tempBackground', 'assets/tempBackground.png');
}

var ggj = {};
var birds = [];
var birdsAdded = 0;
ggj.roundMS = 10000;
ggj.roundOver = false;
ggj.WAVE_COLLIDER_COUNT = 9;


function create() {
    ggj.startTime = Date.now();

    //game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.setBoundsToWorld();
    game.physics.startSystem(Phaser.Physics.P2JS);


    // Waves
    ggj.horizon = game.add.sprite(0, 0, 'tempBackground');
    ggj.waveColliders = createWaveColliders();

    // Player
    ggj.players = [];
    ggj.players[0] = createPlayer("whaleRed", 0);
    ggj.players[1] = createPlayer("whaleGreen", 1);
    ggj.players[2] = createPlayer("whaleBlue", 2);
    ggj.players[3] = createPlayer("whaleBlack", 3);

    ggj.score = {Red: 0, Green: 0, Blue: 0, Black: 0};

    ggj.horizon = game.add.sprite(0, game.world.height/2, 'lazybound');
    ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);
    
    window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });

    //spawn a bird every 3 seconds
    ggj.birdInterval = setInterval(createBird, 1000);

    ggj.roundInterval = setInterval(endRound, ggj.roundMS);

    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();
    ggj.scoreText = game.add.text(16, 16, 'Hey', { fontSize: '32px', fill: '#fff' });
    ggj.timerText = game.add.text(16, 64, 'Hey timer', { fontSize: '32px', fill: '#fff' });

    // ggj.collisionText = game.add.text(16, 32, 'Hey', { fontSize: '32px', fill: '#fff' });

}

function render() {
    game.debug.inputInfo(32, 32);
    game.debug.pointer( game.input.activePointer );
    // for (let i in ggj.waveColliders) {
    //     game.debug.geom(ggj.waveColliders[i], '#0fffff');
    // }
}


function update() {

    moveThing(ggj.players[3], ggj.keyboard);    
    // moveThing(ggj.players[3], navigator.getGamepads()[3]);    
    for (var i = 0; i < 3; i++) {
        moveThing(ggj.players[i], navigator.getGamepads()[i]);    
    }
    for (var i = 0; i < birds.length; i++) {
        if (birds[i].body && birds[i].body.x > game.world.width) {
            birds[i].destroy();
        }
    }
    if (!ggj.roundOver) {
        showScore();
        ggj.timerText.text = ggj.roundMS - (Date.now() - ggj.startTime);
    }
    
}

function endRound() {
    ggj.roundOver = true;
    clearInterval(ggj.birdInterval);
    ggj.timerText.text = "ROUND OVER, ";

    var max = 0;
    var winners = 0;
    // Get Highest score
    for (whale in ggj.score) {
        max = Math.max(max, ggj.score[whale]);
    }
    // Determine winners
    for (whale in ggj.score) {
        if (ggj.score[whale] == max) {
            winners++;
            ggj.timerText.text += whale + " ";
        }
    }

    ggj.timerText.text += winners > 1? "WIN!!!!" : "WINS!!!!!";
}

function showScore() {

    var str = "";
    for (whale in ggj.score) {
        str += whale + ": " + ggj.score[whale] + "  ";
    }

    ggj.scoreText.text = str;
}

function render() {
    //game.debug.inputInfo(32, 32);
}

function createBird() {
    ggj.bird = game.add.sprite(0, Math.random()*200 + 50, 'bird');
    game.physics.p2.enable(ggj.bird);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.events.onOutOfBounds.destroy = true;
    ggj.bird.body.velocity.x = 500;
    var found = false;
    ggj.bird.body.onBeginContact.add(hitBird);
    // Place bird in array
    for (var i = 0; i < birds.length; i++) {
        if (birds[i].body == null) {
            found = true;
            birds[i] = ggj.bird;
        }
    } 
    if (!found) birds.push(ggj.bird);
}

function hitBird(playerBody, player2P, birdShape, playerShape, eq) {
    if (playerBody == null || !playerBody.sprite.key.includes("whale"))
        return;
    var bird = birdShape.body.parent.sprite;
    bird.destroy();

    var whaleColor = playerBody.sprite.key.slice(5);
    console.log(whaleColor);
    ggj.score[whaleColor]++;

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
        2 * game.world.height/3, 
        sprite);

    game.physics.p2.enable(newSprite);
    newSprite.body.collideWorldBounds = true;
    newSprite.body.mass = .1;
    newSprite.body.fixedRotation = true;
    newSprite.isUnderWater = true;
    newSprite.name = `whale ${player}`;
    newSprite.isUnderWaterCount = 0;
    newSprite.body.onBeginContact.add(setIsUnderwater);
    newSprite.body.onEndContact.add(setIsNotUnderwater);
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

function setIsUnderwater(otherBody, otherBodyP2, thisShape, otherShape, eq) {
    if (otherBody == null || otherBody.sprite == null || !otherBody.sprite.name.includes('wave')) return;
    let thisWhale = thisShape.body.parent.sprite;
    thisWhale.isUnderWaterCount = Math.min(ggj.WAVE_COLLIDER_COUNT, thisWhale.isUnderWaterCount + 1);
    console.debug(`${thisWhale.name}: Entering ${otherBody.sprite.name}. 
    Colliding with ${thisWhale.isUnderWaterCount} waves.`);
}

function setIsNotUnderwater(otherBody, otherBodyP2, thisShape, otherShape, eq) {
    if (otherBody == null || otherBody.sprite == null || !otherBody.sprite.name.includes('wave')) return;
    let thisWhale = thisShape.body.parent.sprite;
    thisWhale.isUnderWaterCount = Math.max(0, thisWhale.isUnderWaterCount - 1);
    console.debug(`${thisWhale.name}: Leaving ${otherBody.sprite.name}. 
    Colliding with ${thisWhale.isUnderWaterCount} waves.`);
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
        rect.visible = false;
        rect.name = `waveCollider ${i}`;
        rect.bitMask = 1 << i;
        curX += widths[i];
    }
}