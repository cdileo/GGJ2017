function checkGamepad (pad) {
    // Pad "connected or not" indicator
    var isConnected = [];
    if(game.input.gamepad.pad1.connected) {
        isConnected[0] = 0;
        console.log('pad1 connected');
    } else {
        isConnected[0] = 1;
    }
    if(game.input.gamepad.pad2.connected) {
        isConnected[1] = 0;
    } else {
        isConnected[1] = 1;
    }

    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.5)
    {
        ggj.player.x--;
        console.log('left');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.5)
    {
        ggj.player.x++;
        console.log('right');
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.5)
    {
        ggj.player.y--;
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.5)
    {
        ggj.player.y++;
    }

    //Pad 2
    // if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    // {
    //     player.x--;
    // }
    // if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    // {
    //     player.x++;
    // }
    // if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    // {
    //     player.y--;
    // }
    // if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    // {
    //     player.y++;
    // }

    var buttonsDown = [0,0,0,0];
    // isDown on game.input.gamepad checks ALL gamepad buttons
    if (game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT))
    {
        buttonsDown[0] = 1;
    }
    if (game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT))
    {
        buttonsDown[1] = 1;
    }
    if (game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP))
    {
        buttonsDown[2] = 1;
    }
    if (game.input.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN))
    {
        buttonsDown[3] = 1;
    }
}