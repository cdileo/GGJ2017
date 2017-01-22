ggj.drag = 75;
ggj.speed = 160;
ggj.gravity = 50;

function moveThing(player, input) {

    if (input == null) {
        ggj.scoreText.text = "input for " + player.key + " is null";
        return;
    }

    if (inSky(player, ggj.horizon)) {
        airMovement(player, input);
    } else {
        seaMovement(player, input);
    }
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

    if (player.body.velocity.y <= 1 && player.body.velocity.y >= -1) {
        player.body.force.y -= (ggj.drag/10);
    } else if (player.body.velocity.y > 0) {
        player.body.force.y -= ggj.drag;
    } else if(player.body.velocity.y < 0) {
        player.body.force.y += ggj.drag;
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

