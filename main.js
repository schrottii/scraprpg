function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        // Black rectangle that fills the entire background
        /*ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, 800, 500);

        // Bottom right rect
        ctx.fillStyle = colors.top;
        ctx.fillRect(600, 400, 200, 50);
        ctx.fillStyle = colors.bottom;
        ctx.fillRect(600, 450, 200, 50);

        ctx.fillRect(600, 200, 200, 200);*/

        // Draw image
        ctx.drawImage(images.gear, 500, 500);
    }
}

draw();