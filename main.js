var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}



images.gear.onload = function draw() {
    // Black rectangle that fills the entire background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 800, 500);

    // Bottom right rect (Menu)
    ctx.fillStyle = colors.top;
    ctx.fillRect(608, 436, 192, 32);
    ctx.fillStyle = colors.bottom;
    ctx.fillRect(608, 468, 192, 32);

    ctx.fillRect(608, 308, 192, 128);

    // Draw images
    ctx.drawImage(images.gear, 736, 436);

    // Write text
    ctx.fillStyle = "black";
    ctx.fillText("Character 1", 608, 328);
    ctx.fillText("Character 2", 608, 360);
};