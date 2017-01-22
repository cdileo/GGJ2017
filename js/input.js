ggj.drag = 55;
ggj.speed = 160;
ggj.gravity = 50;

function moveThing(player, input) {

    var sky = inSky(player);

    if (sky) {
        airMovement(player, input);
    } else {
        seaMovement(player, input);
    }

    var upperBound = sky? 500 : 10;

    //play(name, frameRate, loop, killOnComplete)
    if (player.body.velocity.x <= upperBound && player.body.velocity.x >= -upperBound ) {
        player.animations.stop();
    } else if (player.body.velocity.x > 0) {
        player.animations.play('right');
    } else if (player.body.velocity.x < 0) {
        player.animations.play('left');
    }
}

function inSky(player) {
    return player.isUnderWaterCount <= 0;
}

function airMovement(player, input) {
    player.body.force.y += ggj.gravity;
    if (player.body.velocity.x + player.body.velocity.y > ggj.soundEffects['audioThreshold']) {
        let wsNum = Math.round(Math.random());
        if (!ggj.soundEffects['whaleSounds'][wsNum].isPlaying) {
            ggj.soundEffects['whaleSounds'][wsNum].play();
        }
    }
}

function seaMovement(player, input) {

    // Drag
    if (player.body.velocity.x > 0)
        player.body.force.x -= ggj.drag;

    if (player.body.velocity.x < 0)
         player.body.force.x += ggj.drag;

    if (player.body.velocity.y <= 10 && player.body.velocity.y >= -10) {
        player.body.force.y += (ggj.drag);
    } else if (player.body.velocity.y > 0) {
        player.body.force.y -= ggj.drag;
    } else if(player.body.velocity.y < 0) {
        player.body.force.y += ggj.drag;
    }

    if (input == null) {
        return;
    }

    // Swim
    if (ggj.roundOver) return;   
    var x = 0, y = 0;
    // debugger;
    if (input.id && input.id.includes("360 Controller")) {
        x = parseFloat(input.axes[0].toFixed(1));
        y = parseFloat(input.axes[1].toFixed(1));
    } else {

        // Keyboard??
        if (input.left.isDown) {
            x = -1;
        } else if (input.right.isDown) {
            x = 1;
        }

        if (input.up.isDown) {
            y = -1;
        } else if (input.down.isDown) {
            y = 1;
        }
    }

    player.body.force.x += ggj.speed*x;
    player.body.force.y += ggj.speed*y;
// debugger;
    // Attach audio to movement
    if (player.body.velocity.x + player.body.velocity.y > ggj.soundEffects['audioThreshold']) {
        if (!ggj.soundEffects['bubbles'].isPlaying) {
            ggj.soundEffects['bubbles'].play();
        }
    }
}

