var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}

let buttons = [];

function canvasClicked(e) {
    
        mouseX = e.clientX;
        mouseY = e.clientY;

    //console.log(buttons);
    //console.log(mouseX, mouseY);

    for (i = 0; i < buttons.length; i++) {
        if (buttons[i] != undefined) {
            if (mouseX > buttons[i][0] && mouseX < buttons[i][1] && mouseY > buttons[i][2] && mouseY < buttons[i][3]) {
                buttons[i][4]();
            }
        }
    }
}

class Button {
    constructor(x, y, w, h, img, onclick) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.onclick = onclick;
    }

    isVisible() {
        return true;
    }

    onclick() {
    }

    render() {
        buttons.push([this.x, this.x + this.w, this.y, this.y + this.h, this.onclick]);
        ctx.fillStyle = colors.top;
        ctx.fillRect(this.x, this.y, this.w, (this.h/2));
        ctx.fillStyle = colors.bottom;
        ctx.fillRect(this.x, this.y + (this.h / 2), this.w, (this.h / 2));
        ctx.drawImage(this.img, this.x, this.y, 64, 64);
    }
}

function UI_UpdateCharacters() {
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "lightblue";

    ctx.fillText(characters[char1].name, 612, 328);
    ctx.fillText(characters[char2].name, 612, 392);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "green";

    ctx.fillText("HP: " + characters[char1].HP + "/" + characters[char1].maxHP, 612, 348);
    ctx.fillText("HP: " + characters[char2].HP + "/" + characters[char2].maxHP, 612, 412);

    ctx.fillStyle = "yellow";

    ctx.fillText("Level " + characters[char1].level, 612, 364);
    ctx.fillText("Level " + characters[char2].level, 612, 428);

    ctx.fillStyle = "black";

    ctx.fillText("EP: " + characters[char1].EP + "/" + calculateEPNeeded(characters[char1].level), 708, 348);
    ctx.fillText("EP: " + characters[char2].EP + "/" + calculateEPNeeded(characters[char2].level), 708, 412);
}


canvas.addEventListener("click", canvasClicked, false);

images.gear.onload = function draw() {
    // Black rectangle that fills the entire background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 800, 500);

    // Bottom right rect (Menu)
    //ctx.fillStyle = colors.top;
    //ctx.fillRect(608, 436, 192, 32);
    let worldButton1 = new Button(608, 436, 64, 64, images.paper, () => { console.log("click1") });
    worldButton1.render();
    let worldButton2 = new Button(672, 436, 64, 64, images.inventory, () => { console.log("click2") });
    worldButton2.render();
    let worldButton3 = new Button(736, 436, 64, 64, images.gear, () => { console.log("click3") });
    worldButton3.render();
    /*let worldButton2 = new Button(672, 436, 64, 64);
    worldButton2.render();
    let worldButton3 = new Button(736, 436, 64, 64);
    worldButton3.render();*/
    //ctx.fillStyle = colors.bottom;
    //ctx.fillRect(608, 468, 192, 32);

    //ctx.fillRect(608, 308, 192, 128);

    // images
    //ctx.drawImage(images.inventory, 672, 436, 64, 64);
    //ctx.drawImage(images.gear, 736, 436, 64, 64);

    // Write text
    UI_UpdateCharacters();
};