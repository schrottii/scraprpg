var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}

function UI_UpdateCharacters() {
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "lightblue";

    ctx.fillText("Bleu", 612, 328);
    ctx.fillText("Corelle", 612, 392);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "green";

    ctx.fillText("HP: 2000", 612, 348);
    ctx.fillText("HP: 1700", 612, 412);

    ctx.fillStyle = "yellow";

    ctx.fillText("Level 99", 612, 364);
    ctx.fillText("Level 99", 612, 428);

    ctx.fillStyle = "black";

    ctx.fillText("EP: 0", 708, 348);
    ctx.fillText("EP: 0", 708, 412);
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

    // images
    ctx.drawImage(images.paper, 608, 436, 64, 64);
    ctx.drawImage(images.inventory, 672, 436, 64, 64);
    ctx.drawImage(images.gear, 736, 436, 64, 64);

    // Write text
    UI_UpdateCharacters();
};