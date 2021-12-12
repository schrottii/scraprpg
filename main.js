// Get canvas
var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}

// Create several variables
let buttons = [];

let currentScene = 0;

var control = true;
var xpos = 0;
var ypos = 0;

var facing = "down";
var sprite_pr = 0;

var evilxpos = 12;
var evilypos = 4;

var evilfacing = "down";
var evilsprite_pr = 0;

var ai = 0;

/////////////// Some general functions
function changeScene(to) {
    currentScene = to;
    draw();
}

function move(move) {
    if (control) {
        switch (move) { // Player is 08 / 12
            case 0:
                if (map[ypos + 7] != undefined) {
                    if (map[ypos + 7][xpos + 12] != 2) {
                        ypos -= 1;
                        evilypos += 1;
                        facing = "up";
                    }
                }
                break;
            case 1:
                if (map[ypos + 8][xpos + 11] != undefined) {
                    if (map[ypos + 8][xpos + 11] != 2) {
                        xpos -= 1;
                        evilxpos += 1;
                        facing = "right";
                    }
                }
                break;
            case 2:
                if (map[ypos + 9] != undefined) {
                    if (map[ypos + 9][xpos + 12] != 2) {
                        ypos += 1;
                        evilypos -= 1;
                        facing = "down";
                    }
                }
                break;
            case 3:
                if (map[ypos + 8][xpos + 13] != undefined) {
                    if (map[ypos + 8][xpos + 13] != 2) {
                        xpos += 1;
                        evilxpos -= 1;
                        facing = "left";
                    }
                }
                break;
        }
    }
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

function cutscene(x, y) {
    ctx.drawImage(x, 0, 0, 800, 500);
    ctx.drawImage(images.cutscene_fade, 0, 0, 80, 50, 0, 0, 800, 500);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 0, 80, 50, 0, 0, 800, 500) }, 150);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 0, 80, 50, 0, 0, 800, 500) }, 300);

    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 51, 80, 50, 0, 0, 800, 500) }, 450);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 51, 80, 50, 0, 0, 800, 500) }, 600);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 51, 80, 50, 0, 0, 800, 500) }, 750);

    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 102, 80, 50, 0, 0, 800, 500) }, 900);
    setTimeout(() => {
        ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 102, 80, 50, 0, 0, 800, 500);
        ctx.fillStyle = "white";
        ctx.font = "32px NotoSans, sans-serif";
        ctx.fillText(y, 325, 490);
    }, 1050);

    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 102, 80, 50, 0, 0, 800, 500) }, 3150);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 153, 80, 50, 0, 0, 800, 500) }, 3300);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 81, 153, 80, 50, 0, 0, 800, 500) }, 3450);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 162, 153, 80, 50, 0, 0, 800, 500) }, 3600);
    setTimeout(() => { ctx.drawImage(x, 0, 0, 800, 500); ctx.drawImage(images.cutscene_fade, 0, 0, 80, 50, 0, 0, 800, 500) }, 3750);
}

function pad() {
    var padup = new Button(64, 352, 32, 32, images.arrowup, () => {
        move(0);
        if (control) {
            generate_tiles();
            scene_map();
        }
    });
    var paddown = new Button(64, 416, 32, 32, images.arrowdown, () => {
        move(2);
        if (control) {
            generate_tiles();
            scene_map();
        }
    });
    var padleft = new Button(32, 384, 32, 32, images.arrowleft, () => {
        move(1);
        if (control) {
            generate_tiles();
            scene_map();
        }
    });
    var padright = new Button(96, 384, 32, 32, images.arrowright, () => {
        move(3);
        if (control) {
            generate_tiles();
            scene_map();
        }
    });
    padup.render();
    paddown.render();
    padleft.render();
    padright.render();
}

/////////////// UI update functions

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

// Startup & some drawing
    function draw() {
    // Black rectangle that fills the entire background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 800, 500);

    buttons = []; // Delete buttons every new scene (important)
    switch (currentScene) { // Load scene
        case 0: // Main menu
            scene_menu();
            break;
        case 1: // Map
            buttons.push([384, 416, 224, 256, () => { // Up
                move(0);
                if (control) {
                    generate_tiles();
                    scene_map();
                }
            }]);
            buttons.push([384, 416, 288, 320, () => { // Down
                move(2);
                if (control) {
                    generate_tiles();
                    scene_map();
                }
            }]);
            buttons.push([352, 384, 256, 288, () => { // Right
                move(1);
                if (control) {
                    generate_tiles();
                    scene_map();
                }
            }]);
            buttons.push([416, 448, 256, 288, () => { // Left
                move(3);
                if (control) {
                    generate_tiles();
                    scene_map();
                }
            }]);

            pad();
            scene_map();
            break;
        case 2: // Alabama cutscene
            cutscene(images.placeholder, "Alabama");
            setTimeout(() => { changeScene(1) }, 4000);
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
    ctx.fillText("Developed by Schrottii", 50, 400);
    ctx.fillText("Concept by Decastar and Barduzzi", 50, 412);
    ctx.fillText("Graphics by Decastar, Barduzzi and Schrottii", 50, 424);
    ctx.fillText("Music by Decastar, zedoreku, Lexi and Schrottii", 50, 436);
    ctx.fillText("Special Thanks: Endte and Rasputin", 50, 448);

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
    evilsprite_pr += 20;
    if (evilsprite_pr == 40) { evilsprite_pr = 0; }

    ai = Math.ceil(Math.random() * 4);
    switch (ai) {
        case 1:
            evilxpos += 1;
            evilfacing = "right";
            break;
        case 2:
            evilxpos -= 1;
            evilfacing = "left";
            break;
        case 3:
            evilypos += 1;
            evilfacing = "up";
            break;
        case 4:
            evilypos -= 1;
            evilfacing = "down";
            break;
    }

    if (evilxpos == 11) {
        evilxpos += 1;
    }
    else if (evilypos == 7) {
        evilypos += 1;
    }

    if (evilxpos > 25 || evilxpos < 0) { evilxpos = 12 };
    if (evilypos > 16 || evilypos < 0) { evilypos = 4 };

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

    switch (evilfacing) {
        case "up":
            ctx.drawImage(sprites.evil, evilsprite_pr, 68, 20, 34, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "left":
            ctx.drawImage(sprites.evil, evilsprite_pr, 102, 20, 34, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "down":
            ctx.drawImage(sprites.evil, evilsprite_pr, 0, 20, 34, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "right":
            ctx.drawImage(sprites.evil, evilsprite_pr, 34, 20, 34, evilxpos * 32, evilypos * 32, 32, 32);
            break;
    }

    if (12 == evilxpos && 8 == evilypos) {
        evilxpos = 12;
        evilypos = 4;

        // could be optimized using a for loop?
        control = false;
        ctx.drawImage(images.tokenattack, 71, 78, 51, 52, 0, 0, 800, 500);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 166, 76, 62, 65, 0, 0, 800, 500); }, 150);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 266, 65, 89, 64, 0, 0, 800, 500); }, 300);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 396, 66, 118, 116, 0, 0, 800, 500); }, 450);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 38, 197, 103, 95, 0, 0, 800, 500); }, 600);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 178, 190, 136, 129, 0, 0, 800, 500); }, 750);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 346, 196, 172, 157, 0, 0, 800, 500); }, 900);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 546, 189, 191, 152, 0, 0, 800, 500); }, 1050);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 768, 217, 240, 95, 0, 0, 800, 500); }, 1200);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 51, 394, 261, 47, 0, 0, 800, 500); }, 1350);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 378, 374, 257, 107, 0, 0, 800, 500); }, 1500);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 700, 338, 263, 169, 0, 0, 800, 500); }, 1650);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 64, 500, 275, 196, 0, 0, 800, 500); }, 1800);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 366, 496, 315, 204, 0, 0, 800, 500); }, 1950);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 717, 527, 305, 202, 0, 0, 800, 500); }, 2100);

        setTimeout(() => { ctx.drawImage(images.tokenattack, 48, 750, 322, 219, 0, 0, 800, 500); }, 2250);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 370, 750, 335, 226, 0, 0, 800, 500); }, 2400);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 698, 747, 371, 240, 0, 0, 800, 500); }, 2550);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 7, 1015, 89, 64, 0, 0, 800, 500); }, 2700);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 377, 1077, 350, 163, 0, 0, 800, 500); }, 2850);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 759, 1138, 281, 110, 0, 0, 800, 500); control = true; }, 3000);
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

// Register arrow key movement
document.body.onkeydown = function (e) {
    if (currentScene == 1) {
        if (e.keyCode == 37) {
            move(1);
        }
        if (e.keyCode == 38) {
            move(0);
        }
        if (e.keyCode == 39) {
            move(3);
        }
        if (e.keyCode == 40) {
            move(2);
        }
        if (control) {
            generate_tiles();
            scene_map();
        }
    }
}

// Start the game
images.gear.onload = function start() {
    draw();
}