ggj.drag = 55;
ggj.speed = 160;
ggj.gravity = 50;

function moveThing(player, input) {

    var sky = inSky(player, ggj.horizon);

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

        // (player.body.velocity.x <= 10 && player.body.velocity.x >= -10)
}

function inSky(player, bound) {

    return player.body.y <= bound.y;

}

function airMovement(player, input) {
    player.body.force.y += ggj.gravity;
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
    var x = 0, y = 0;
    if (input.id && input.id.includes("Xbox 360 Controller")) {
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

}

