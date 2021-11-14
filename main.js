function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgb(0,25,255)";
        ctx.fillRect(600, 400, 55, 50);
    }
}

draw();