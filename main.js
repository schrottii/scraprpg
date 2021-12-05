// Get canvas
var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}

let buttons = [];

let currentScene = 0;

var xpos = 0;
var ypos = 0;

var facing = "down";
var sprite_pr = 0;

function changeScene(to) {
    currentScene = to;
    draw();
}

// Buttons
function canvasClicked(e) {
    // I think this function / button clicking system is not optimal, but it should do it's job

    // Get the position of mouse
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Check íf any buttons are pressed and exec
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i] != undefined) {
            if (mouseX > buttons[i][0] && mouseX < buttons[i][1] && mouseY > buttons[i][2] && mouseY < buttons[i][3]) {
                buttons[i][4]();
            }
        }
    }
}

// Button class. Use this to create buttons
// Example for ya nebs: new Button(608, 436, 64, 64, images.paper, () => { console.log("click1") });
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

// Update text related to the characters
function UI_UpdateCharacters() {
    ctx.fillStyle = "black";
    ctx.font = "20px NotoSans, sans-serif";
    ctx.fillStyle = "lightblue";

    ctx.fillText(characters[char1].name, 612, 328);
    ctx.fillText(characters[char2].name, 612, 392);

    ctx.font = "16px NotoSans, sans-serif";
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

function pad() {
    var padup = new Button(64, 352, 32, 32, images.arrowup, () => {
        ypos -= 1;
        facing = "up";
        generate_tiles();
        scene_map();
    });
    var paddown = new Button(64, 416, 32, 32, images.arrowdown, () => {
        ypos += 1;
        facing = "down";
        generate_tiles();
        scene_map();
    });
    var padleft = new Button(32, 384, 32, 32, images.arrowleft, () => {
        xpos -= 1;
        facing = "right";
        generate_tiles();
        scene_map();
    });
    var padright = new Button(96, 384, 32, 32, images.arrowright, () => {
        xpos += 1;
        facing = "left";
        generate_tiles();
        scene_map();
    });
    padup.render();
    paddown.render();
    padleft.render();
    padright.render();
}

// Startup & some drawing
    function draw() {
    // Black rectangle that fills the entire background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 800, 500);

    buttons = []; // Delete buttons every new scene (important)
    switch (currentScene) { // Load scene
        case 0:
            scene_menu();
            break;
        case 1:
            buttons.push([384, 416, 224, 256, () => { // Up
                ypos -= 1;
                facing = "up";
                generate_tiles();
                scene_map();
            }]);
            buttons.push([384, 416, 288, 320, () => { // Down
                ypos += 1;
                facing = "down";
                generate_tiles();
                scene_map();
            }]);
            buttons.push([352, 384, 256, 288, () => { // Right
                xpos -= 1;
                facing = "right";
                generate_tiles();
                scene_map();
            }]);
            buttons.push([416, 448, 256, 288, () => { // Left
                xpos += 1;
                facing = "left";
                generate_tiles();
                scene_map();
            }]);

            pad();
            scene_map();
            break;
        case 2:
            ctx.drawImage(images.placeholder, 0, 0, 800, 500);
            ctx.drawImage(images.cutscene_fade, 0, 0, 80, 50, 0, 0, 800, 500);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 0, 80, 50, 0, 0, 800, 500) }, 250);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 0, 80, 50, 0, 0, 800, 500) }, 500);

            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 51, 80, 50, 0, 0, 800, 500) }, 750);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 51, 80, 50, 0, 0, 800, 500) }, 1000);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 51, 80, 50, 0, 0, 800, 500) }, 1250);

            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 102, 80, 50, 0, 0, 800, 500) }, 1500);
            setTimeout(() => {
                ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 102, 80, 50, 0, 0, 800, 500);
                ctx.font = "32px NotoSans, sans-serif";
                ctx.fillText("Alabama", 200, 450);
            }, 1750);

            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 102, 80, 50, 0, 0, 800, 500) }, 4750);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 153, 80, 50, 0, 0, 800, 500) }, 5000);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 153, 80, 50, 0, 0, 800, 500) }, 5250);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 153, 80, 50, 0, 0, 800, 500) }, 5500);
            setTimeout(() => { ctx.drawImage(images.placeholder, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 0, 80, 50, 0, 0, 800, 500) }, 5750);
            setTimeout(() => { changeScene(1) }, 6250);
            break;
    }
}

function scene_menu() {
    // Draw background and icon
    ctx.drawImage(images.mainmenu_bg, 0, 0, 800, 500);
    ctx.drawImage(images.gameicon, 215, 50, 370, 200);

    // Text
    ctx.fillStyle = "white";
    ctx.font = "32px NotoSans, sans-serif";
    ctx.fillText("Click anywhere to continue...", 200, 300);

    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillText("Credits:", 50, 388);
    ctx.fillText("Developed by Schrottii and ziem", 50, 400);
    ctx.fillText("Concept by Decastar and Barduzzi", 50, 412);
    ctx.fillText("Graphics by Decastar, Barduzzi and Schrottii", 50, 424);
    ctx.fillText("Music by Decastar, zedoreku and Lexi", 50, 436);
    ctx.fillText("Special Thanks: Endte", 50, 448);

    ctx.font = "20px NotoSans, sans-serif";
    ctx.fillText("v0.1", 700, 475);

    // Invisible button that covers the whole screen
    buttons.push([0, 800, 0, 500, () => { changeScene(2) }]);
}

function generate_tiles() {
    for (i = 0; i < 25; i++) {
        for (j = 0; j < 16; j++) {
            if (map[j + ypos] != undefined) {
                if (map[j + ypos][i + xpos] != undefined) {
                    ctx.drawImage(tileids[map[j + ypos][i + xpos]], i * 32, j * 32);
                }
                else {
                    ctx.drawImage(tiles.water1, i * 32, j * 32);
                }
            }
            else {
                ctx.drawImage(tiles.water1, i * 32, j * 32);
            }
        }
    }
}

function scene_map() {
    // Tiles
    generate_tiles();

    sprite_pr += 64;
    if (sprite_pr == 128) { sprite_pr = 0; }
    
    switch (facing) {
        case "up":
            ctx.drawImage(sprites.bleu, sprite_pr, 0, 64, 64, 384, 256, 32, 32);
            break;
        case "left":
            ctx.drawImage(sprites.bleu, sprite_pr, 64, 64, 64, 384, 256, 32, 32);
            break;
        case "down":
            ctx.drawImage(sprites.bleu, sprite_pr, 128, 64, 64, 384, 256, 32, 32);
            break;
        case "right":
            ctx.drawImage(sprites.bleu, sprite_pr, 192, 64, 64, 384, 256, 32, 32);
            break;
    }


    ctx.drawImage(images.arrowmiddle, 64, 384, 32, 32);
    ctx.drawImage(images.arrowup, 64, 352, 32, 32);
    ctx.drawImage(images.arrowdown, 64, 416, 32, 32);
    ctx.drawImage(images.arrowleft, 32, 384, 32, 32);
    ctx.drawImage(images.arrowright, 96, 384, 32, 32);

    // Bottom right rect (Menu)

    let worldButton1 = new Button(608, 436, 64, 64, images.paper, () => { console.log("click1") });
    worldButton1.render();
    let worldButton2 = new Button(672, 436, 64, 64, images.inventory, () => { console.log("click2") });
    worldButton2.render();
    let worldButton3 = new Button(736, 436, 64, 64, images.gear, () => { console.log("click3") });
    worldButton3.render();

    ctx.fillStyle = colors.bottom;
    ctx.fillRect(608, 308, 192, 128);

    // Some nice black borders
    ctx.fillStyle = "black";
    ctx.fillRect(606, 306, 192, 2);
    ctx.fillRect(606, 306, 2, 194);
    ctx.fillRect(606, 434, 192, 2);

    // Write text
    UI_UpdateCharacters();
};

canvas.addEventListener("click", canvasClicked, false);

document.body.onkeydown = function (e) {
    if (currentScene == 1) {
        if (e.keyCode == 37) {
            xpos -= 1;
            facing = "right";
        }
        if (e.keyCode == 38) {
            ypos -= 1;
            facing = "up";
        }
        if (e.keyCode == 39) {
            xpos += 1;
            facing = "left";
        }
        if (e.keyCode == 40) {
            ypos += 1;
            facing = "down";
        }
        generate_tiles();
        scene_map();
    }
}

images.gear.onload = function start() {
    draw();
}