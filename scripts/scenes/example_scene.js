scenes.SCENENAME = () => {

    // Default black fade transition
    let blackFadeTransition = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1], // (fullscreen)
        fill: "black",
        alpha: 1
    })
    addAnimator(function (t) {
        blackFadeTransition.alpha = 1 - (t / 200);
        if (t > 499) {
            blackFadeTransition.alpha = 0;
            return true;
        }
        return false;
    })
    // black fade transition end

    return {
        // Pre-render function
        preRender(ctx, delta) {

        },
        // Controls
        controls: [
            blackFadeTransition
        ],
        name: "ex"
    }
}