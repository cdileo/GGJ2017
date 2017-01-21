ggj.drag = 40;
ggj.speed = 50;
ggj.gravity = 30;

function moveThing(player, input, horizon) {
    if (inSky(player, horizon)) {
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
        player.body.force.x = Math.max(player.body.force.x - ggj.drag, 0);

    if (player.body.velocity.x < 0)
         player.body.force.x = Math.min(player.body.force.x  + ggj.drag, 0);

    if (player.body.velocity.y > 0)
        player.body.force.y = Math.max(player.body.force.y - ggj.drag, 0);

    if (player.body.velocity.y < 0)
        player.body.force.x = Math.max(player.body.force.y + ggj.drag, 0);

    //Swim
    if (input.left.isDown)
    {
        //  Move to the left
        player.body.force.x += -ggj.speed;
    }
    if (input.right.isDown)
    {
        //  Move to the right
        player.body.force.x += ggj.speed;
    }
    if (input.up.isDown)
    {
        player.body.force.y += -ggj.speed;
    }
    if (input.down.isDown)
    {
        player.body.force.y += ggj.speed;
    }

}

