//add body (force) to sprite to make it move

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'mainDiv', { 
    preload: preload, 
    create: create, 
    update: update,
    render: render });

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Knewave']
    }

};


function preload() {
    game.load.image('background', 'assets/background.png');
    
    game.load.spritesheet('whaleRed', 'assets/red.png', 128, 92);
    game.load.spritesheet('whaleGreen', 'assets/green.png', 128, 92);
    game.load.spritesheet('whaleBlue', 'assets/blue.png', 128, 92);
    game.load.spritesheet('whaleBlack', 'assets/black.png', 128, 92);
    game.load.spritesheet('eatBirdEffect', 'assets/EatBirdEffect.png', 88, 88);
    game.load.spritesheet('splashEffect', 'assets/splashEffect.png', 128, 128);

    game.load.image('gameTitle', 'assets/GameTitle.png')

    //game.load.image('bird', 'assets/bird.png');
    game.load.spritesheet('bird', 'assets/birdani.png', 88, 46);
    game.load.script('input', 'js/input.js');
    game.load.image('tempBackground', 'assets/tempBackground.png');

    game.load.audio('backing', 'assets/audio/Backing.ogg');
    game.load.audio('melody1', 'assets/audio/Melody1.ogg');
    game.load.audio('melody2', 'assets/audio/Melody2.ogg');

    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    // Sound Effects
    game.load.audio('birdExplode', 'assets/audio/effects/birdExplode.ogg');
    game.load.audio('whaleJump', 'assets/audio/effects/whaleJump.ogg');
    game.load.audio('whaleLand', 'assets/audio/effects/whaleLand.ogg');
    game.load.audio('whaleBump', 'assets/audio/effects/whaleBump.ogg');
    game.load.audio('whaleSounds2', 'assets/audio/effects/whaleSounds2.ogg');
    game.load.audio('whaleSounds3', 'assets/audio/effects/whaleSounds3.ogg');
    game.load.audio('bubbles', 'assets/audio/effects/bubbles.ogg');
}

var ggj = {};
var birds = [];
var birdsAdded = 0;
ggj.roundMS = 45000;
ggj.roundOver = false;
ggj.title = true;
ggj.pregame = false;
ggj.WAVE_COLLIDER_COUNT = 9;
ggj.WELCOME_STRING = "SWIM IN THE SEA WITH EITHER \n\tXBox controllers: Use the left joystick, OR\n" +
    "\tKeyboard: One player can use WASD, one can use\n the arrow keys.\n\n" +
    "The faster you are swimming when you leave the water, the \nhigher you will jump! You can't control your whale in the air.\n\n" +
    "To win the game, EAT THE MOST BIRDS.\n" +
    "PRESS THE SPACEBAR TO START"; 
ggj.CREDITS = "Chris Dileo - Programmer\n" +
    "Madoka Nara - Artist\n" +
    "Roxanne Taylor - Programmer\n" +
    "Angela Chen - Project Manager\n" +
    "Soundtrack by: Michael Fraser from Tree of Audio";

ggj.scoreStyle = { font: '40px Knewave', fill: '#fff' };
ggj.timerStyle = { font: '36px Knewave', fill: '#000', stroke: '#fff', strokeThickness: 2 };

function create() {
    //game.world.setBounds(0, 0, game.world.width,  game.world.height);
    game.physics.setBoundsToWorld();
    game.physics.startSystem(Phaser.Physics.P2JS);


    // Waves
    ggj.horizon = game.add.sprite(0, 0, 'tempBackground');
    ggj.waveColliders = createWaveColliders();

    ggj.score = {Red: 0, Green: 0, Blue: 0, Black: 0};

    ggj.horizon.scale.setTo(1, ggj.horizon.scaleMax);
    
    window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(startRound, this);
  
    //  Our controls.
    ggj.keyboard = game.input.keyboard.createCursorKeys();
    ggj.keyboardLeft = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

    ggj.music = createMusic();
    ggj.soundEffects = createSoundEffects();
    ggj.music.tracks[0].play();

    ggj.titleSprite = game.add.sprite(0, 0, 'gameTitle');
    ggj.scoreText = game.add.text(16, 16, 'PRESS SPACEBAR TO CONTINUE', ggj.scoreStyle);
}

function render() {
    game.debug.inputInfo(32, 32);
    game.debug.pointer( game.input.activePointer );
}

function update() {

    if (ggj.title) return;

    // optional keyboard control
    if (navigator.getGamepads()[2] == null)
        moveThing(ggj.players[2], ggj.keyboard);    
    else 
        moveThing(ggj.players[2], navigator.getGamepads()[2]);

    if (navigator.getGamepads()[3] == null)
        moveThing(ggj.players[3], ggj.keyboardLeft);
    else 
        moveThing(ggj.players[3], navigator.getGamepads[3]);

    // Move each player    
    for (var i = 0; i < 2; i++) {
        moveThing(ggj.players[i], navigator.getGamepads()[i]);    

    }
    for (var i = 0; i < birds.length; i++) {
        //birds.animations.play('right');
        if (birds[i].body && birds[i].body.x > game.world.width) {
            birds[i].destroy();
        }
    }

    showTimer();
}

function startRound() {

    // Game is done, restart
    if (ggj.roundOver) {
        location.reload();
    }

    // Game in progress, do nothing
    if (!ggj.title && !ggj.pregame) return;

    if (ggj.title) {
        ggj.titleSprite.destroy();
        ggj.title = false;
        ggj.pregame = true;
        ggj.scoreText.text = 'WHALES HATE BIRDS';
        ggj.timerText = game.add.text(16, 64, ggj.WELCOME_STRING, ggj.timerStyle);

        // Player
        ggj.players = [];
        ggj.players[0] = createPlayer("whaleRed", 0);
        ggj.players[1] = createPlayer("whaleGreen", 1);
        ggj.players[2] = createPlayer("whaleBlue", 2);
        ggj.players[3] = createPlayer("whaleBlack", 3);

        return;

    }

    // Game read to start
    ggj.pregame = false;

    ggj.startTime = Date.now();
    ggj.timerText.fill = '#000';

    //spawn a bird every 3 seconds
    ggj.birdInterval = setInterval(createBird, 900);

    ggj.roundInterval = setInterval(endRound, ggj.roundMS);
}

function showTimer() {
    if (!ggj.roundOver && !ggj.title && !ggj.pregame) {
        showScore();
        var timeLeft = (ggj.roundMS - (Date.now() - ggj.startTime)) /1000
        if (timeLeft <= 10) {
            ggj.timerText.fill = '#F00';
        }
        ggj.timerText.text = Math.ceil(timeLeft);
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
            game.add.sprite(150*winners, 150, 'whale' + whale);
        }
    }



    ggj.timerText.fill = '#000';
    ggj.timerText.text += winners > 1? "WIN!!!!" : "WINS!!!!!";
    ggj.timerText.text += "\n\n\nPress the spacebar to play again" +
        "\n\nCredits:\n" + ggj.CREDITS;

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
    // game.debug.spriteInfo(ggj.players[3], 32, 32);
}

function createBird() {
    ggj.bird = game.add.sprite(0, Math.random()*200 + 50, 'bird');
    game.physics.p2.enable(ggj.bird);
    ggj.bird.body.data.shapes[0].sensor = true;
    ggj.bird.events.onOutOfBounds.destroy = true;
    ggj.bird.body.velocity.x = Math.random()*300 + 200;
    //add(name, frames, frameRate, loop, useNumericIndex)
    ggj.bird.animations.add('right', [8, 9, 10, 11 , 12, 13, 14, 15], 10, true);
    ggj.bird.animations.play('right');
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

    var x = birdShape.body.parent.x;
    var y = birdShape.body.parent.y;
    var deadBird = game.add.sprite(x, y, 'eatBirdEffect');
    deadBird.animations.add('explode', [0, 1, 2, 3, 4, 5]);
    deadBird.animations.play('explode', 10, false, true);

    bird.destroy();
    ggj.soundEffects['birdExplode'].play();

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

    newSprite.animations.add('right', [0,  1,  2,  3,  4,  5,  6,  7,  8], 10, true);
    newSprite.animations.add('left',  [10, 11, 12, 13, 14, 15, 16, 17, 18], 10, true);

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
    if (otherBody != null && otherBody.sprite != null) {        
        //This should probably be separated, but works here for now.
        if (otherBody.sprite.name.includes('whale')) {
            ggj.soundEffects['whaleBump'].play();
            return;
        }
        if (!otherBody.sprite.name.includes('wave')) {
            return;
        }
    } else { return; }
    let thisWhale = thisShape.body.parent.sprite;

    let oldCount = thisWhale.isUnderWaterCount;
    thisWhale.isUnderWaterCount = Math.min(ggj.WAVE_COLLIDER_COUNT, thisWhale.isUnderWaterCount + 1);
    // If we're leaving the water, play the splash animation
    if (thisWhale.isUnderWaterCount >= 0 && oldCount == 0) {
        let xVec = thisWhale.body.velocity.x;
        let yVec = thisWhale.body.velocity.y;
        let angleRads = Math.atan2(yVec, xVec) - Math.PI / 2;
        let angleDeg = (angleRads * 180 / Math.PI);
        let dirMod = xVec > 0 ? 1 : -1;
        let splashSprite = game.add.sprite( thisWhale.x - thisWhale.width / 2,
                                            thisWhale.y - thisWhale.height, 
                                            'splashEffect');
        splashSprite.rotation = angleRads;
        let anim = splashSprite.animations.add('splash');
        game.world.swapChildren(splashSprite, thisWhale);
        splashSprite.animations.play('splash', 30, false);
        anim.onComplete.add(function() { splashSprite.kill(); }, splashSprite);
        ggj.soundEffects['whaleLand'].play();
    }
}

function setIsNotUnderwater(otherBody, otherBodyP2, thisShape, otherShape, eq) {
    if (otherBody == null || otherBody.sprite == null || !otherBody.sprite.name.includes('wave')) return;
    let thisWhale = thisShape.body.parent.sprite;
    thisWhale.isUnderWaterCount = Math.max(0, thisWhale.isUnderWaterCount - 1);
    
    if (thisWhale.isUnderWaterCount == 0)
        ggj.soundEffects['whaleJump'].play(); 
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
        game.physics.p2.enable(rect); 
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

function createMusic () {
    let music = {};
    music.currentTrack = 0;
    music.tracks = [];
    music.tracks[0] = game.add.audio('backing');
    music.tracks[0].onStop.add(nextMusic, this, 0, 1);
    music.tracks[1] = game.add.audio('melody1');
    music.tracks[1].onStop.add(nextMusic, this, 0, 2);
    music.tracks[2] = game.add.audio('melody2');
    music.tracks[2].onStop.add(nextMusic, this, 0, 0);
    return music;
}

function nextMusic (context, pri, nextTrackNo) {
    ggj.music.tracks[nextTrackNo].play();
}

function createSoundEffects () {
    let effects = {};
    effects['birdExplode'] = game.add.audio('birdExplode');
    effects['whaleJump'] = game.add.audio('whaleJump');
    effects['whaleLand'] = game.add.audio('whaleLand');
    effects['whaleBump'] = game.add.audio('whaleBump');
    effects['whaleSounds'] = [];
    effects['bubbles'] = game.add.audio('bubbles');
    for (let i in effects) {
        effects[i].allowMultiple = true;
    }

    effects['whaleSounds'][0] = game.add.audio('whaleSounds2');
    effects['whaleSounds'][1] = game.add.audio('whaleSounds3');
    // Point at which movement audio will be triggered
    effects['audioThreshold'] = 60;
    return effects;
}