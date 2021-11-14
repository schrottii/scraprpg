function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        // Black rectangle that fills the entire background
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, 800, 500);

        // Bottom right blue rect
        ctx.fillStyle = "rgb(0,25,255)";
        ctx.fillRect(600, 400, 55, 50);

        ctx.drawImage(images.gear, 500, 500);
    }
}

draw();