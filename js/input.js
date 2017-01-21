
function moveThing(player, input) {
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if (input.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
    }
    else if (input.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
    }
    else if (input.up.isDown)
    {
        player.body.velocity.y = -150;
    }
    else if (input.down.isDown)
    {
        player.body.velocity.y = 150;
    }
}