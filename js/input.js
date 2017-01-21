ggj.drag = 10;
ggj.speed = 20;
ggj.gravity = 10;

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
    player.body.velocity.y += ggj.gravity;
}

function seaMovement(player, input) {

    // Drag
    if (player.body.velocity.x > 0)
        player.body.velocity.x = Math.max(player.body.velocity.x - ggj.drag, 0);

    if (player.body.velocity.x < 0)
         player.body.velocity.x = Math.min(player.body.velocity.x  + ggj.drag, 0);

    if (player.body.velocity.y > 0)
        player.body.velocity.y = Math.max(player.body.velocity.y - ggj.drag, 0);

    if (player.body.velocity.y < 0)
        player.body.velocity.x = Math.max(player.body.velocity.y + ggj.drag, 0);
    
    //Swim
    if (input.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x += -ggj.speed;
    }
    if (input.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x += ggj.speed;
    }
    if (input.up.isDown)
    {
        player.body.velocity.y += -ggj.speed;
    }
    if (input.down.isDown)
    {
        player.body.velocity.y += ggj.speed;
    }

}