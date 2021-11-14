function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        // Black rectangle that fills the entire background
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, 800, 500);

        // Bottom right rect
        ctx.fillStyle = "rgb(212, 159, 82)";
        ctx.fillRect(650, 400, 150, 50);
        ctx.fillStyle = "rgb(181, 133, 66)";
        ctx.fillRect(650, 450, 150, 50);

        ctx.drawImage(images.gear, 500, 500);
    }
}

draw();