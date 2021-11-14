function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, 800, 500);

        ctx.fillStyle = "rgb(0,25,255)";
        ctx.fillRect(600, 400, 55, 50);
    }
}

draw();