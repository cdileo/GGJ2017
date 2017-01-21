function checkGamepad (pad) {
    console.log('Entering gamepad check');
    if (pad && pad.connected) { 
        console.debug(pad._axes);
    }
}