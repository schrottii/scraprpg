// Get canvas
var canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}

// Create several variables
let buttons = [];
var saveNR = 0;

let currentScene = 0;
var inventoryPage = 0;

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

var fightaction = 0;
var fightselect = 1;

var mouseX;
var mouseY;

const enemies = {
    placeholder: {
        name: "Example Enemy",
        maxHP: 8,
        damage: 2,
        range: 3
    },
    placeholder2: {
        name: "PLACEHOLDER2",
        maxHP: 999,
        damage: 99,
        range: 1
    }
}

var currentEnemies = {
    enemy1: {},
    enemy2: {},
    enemy3: {},
    enemy4: {}
}


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
                        if (control) {
                            generate_tiles();
                            scene_map();
                        }
                    }
                }
                break;
            case 1:
                if (map[ypos + 8][xpos + 11] != undefined) {
                    if (map[ypos + 8][xpos + 11] != 2) {
                        xpos -= 1;
                        evilxpos += 1;
                        facing = "right";
                        if (control) {
                            generate_tiles();
                            scene_map();
                        }
                    }
                }
                break;
            case 2:
                if (map[ypos + 9] != undefined) {
                    if (map[ypos + 9][xpos + 12] != 2) {
                        ypos += 1;
                        evilypos -= 1;
                        facing = "down";
                        if (control) {
                            generate_tiles();
                            scene_map();
                        }
                    }
                }
                break;
            case 3:
                if (map[ypos + 8][xpos + 13] != undefined) {
                    if (map[ypos + 8][xpos + 13] != 2) {
                        xpos += 1;
                        evilxpos -= 1;
                        facing = "left";
                        if (control) {
                            generate_tiles();
                            scene_map();
                        }
                    }
                }
                break;
        }
    }
}

function gete(ind) {
    return currentEnemies["enemy" + ind];
}

function createEnemy(x, type) {
    // Do not touch this script unless you really know what you're doing
    // This can break pretty easily
    creatingEnemy = {};
    Object.assign(creatingEnemy, enemies[type]);
    creatingEnemy.maxHP = enemies[type].maxHP + (Math.round(Math.random() * enemies[type].range));
    creatingEnemy.damage = enemies[type].damage + (Math.round(Math.random() * enemies[type].range));
    creatingEnemy.HP = creatingEnemy.maxHP;

    currentEnemies["enemy" + x] = creatingEnemy;
}

function check_gameover() {
    if (characters[char1].HP < 1 || characters[char2].HP < 1) {
        changeScene(4);
        return;
    }
}

function addItem(who, what, amount=1) {
    if (characters[who].inventory[what] == undefined) {
        characters[who].inventory[what] = amount;
    }
    else {
        characters[who].inventory[what] += amount;
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
        if (this.img != false) {
            ctx.fillStyle = colors.top;
            ctx.fillRect(this.x, this.y, this.w, (this.h / 2));
            ctx.fillStyle = colors.bottom;
            ctx.fillRect(this.x, this.y + (this.h / 2), this.w, (this.h / 2));
            ctx.drawImage(this.img, this.x, this.y, 64, 64);
        }
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
    });
    var paddown = new Button(64, 416, 32, 32, images.arrowdown, () => {
        move(2);
    });
    var padleft = new Button(32, 384, 32, 32, images.arrowleft, () => {
        move(1);
    });
    var padright = new Button(96, 384, 32, 32, images.arrowright, () => {
        move(3);
    });
    padup.render();
    paddown.render();
    padleft.render();
    padright.render();
}

function load(x, altx) {
    return x !== undefined ? x : altx;
}

function saveGame() {
    let saveCopy = JSON.parse(JSON.stringify({ characters: characters, pos: [xpos, ypos]}));
    localStorage.setItem("SOTR" + saveNR, JSON.stringify(saveCopy));
}

function loadGame() {
    let saveCopy;
    saveCopy = localStorage.getItem("SOTR" + saveNR);

    if (saveCopy !== null && saveCopy !== "null") {
        try {
            saveCopy = JSON.parse(saveCopy);
        }

        catch (e) {
            alert("Error");
            return;
        }

        characters = load(saveCopy.characters, characters);
        xpos = load(saveCopy.pos[0], 0);
        ypos = load(saveCopy.pos[1], 0);
    }
}

function calculate_EXP(level) {
    return 10 + (level * 5); //Placeholder formula... maybe different for each char?
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

    ctx.fillText("EP: " + characters[char1].EP + "/" + characters[char1].EP, 708, 348);
    ctx.fillText("EP: " + characters[char2].EP + "/" + characters[char2].EP, 708, 412);
}

function UI_FightE(x = 0) {
    ctx.fillStyle = "rgb(131, 50, 78)";
    ctx.fillRect(600, 375, 200, 125);
    ctx.fillStyle = "rgb(245, 145, 178)";
    ctx.fillRect(610, 385, 180, 105);

    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "black";
    if (x == 0) {
        ctx.fillText("4 " + gete(1).name + "s!", 620, 405);
        ctx.fillText("Evil Helter Skelter", 620, 425);
    }
    else {
        ctx.fillText(gete(x).name + " #" + x, 620, 405);
        ctx.fillText("HP " + gete(x).HP + "/" + gete(x).maxHP, 620, 425);
    }
}

// Startup & some drawing
function draw() {
    // Black rectangle that fills the entire background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 800, 500);

    buttons = []; // Delete buttons every new scene (important)
    saveGame();
    switch (currentScene) { // Load scene
        case 0: // Main menu
            scene_menu();
            break;
        case 1: // Map
            buttons.push([384, 416, 224, 256, () => { // Up
                move(0);
            }]);
            buttons.push([384, 416, 288, 320, () => { // Down
                move(2);
            }]);
            buttons.push([352, 384, 256, 288, () => { // Right
                move(1);
            }]);
            buttons.push([416, 448, 256, 288, () => { // Left
                move(3);
            }]);

            pad();
            autoMove();
            scene_map();
            break;
        case 2: // Alabama cutscene
            cutscene(images.placeholder, "Test Island");
            setTimeout(() => { changeScene(1) }, 4000); // CHANGE SCENE TO 1 NOT TO 3 THAT'S FOR TESTING
            break;
        case 3: // Fight
            // Create enemies
            createEnemy(1, "placeholder");
            createEnemy(2, "placeholder");
            createEnemy(3, "placeholder");
            createEnemy(4, "placeholder");

            //All the buttons
            let fightE1 = new Button(600, 200, 32, 32, false, () => { if (gete(1).HP > 0) { fightselect = 1; if (fightaction == 2) { fight_enemy(fightselect) } scene_fight(); UI_FightE(fightselect);}});
            fightE1.render();
            let fightE2 = new Button(550, 250, 32, 32, false, () => { if (gete(2).HP > 0) { fightselect = 2; if (fightaction == 2) { fight_enemy(fightselect) } scene_fight(); UI_FightE(fightselect);}});
            fightE2.render();
            let fightE3 = new Button(650, 200, 32, 32, false, () => { if (gete(3).HP > 0) { fightselect = 3; if (fightaction == 2) { fight_enemy(fightselect) } scene_fight(); UI_FightE(fightselect);}});
            fightE3.render();
            let fightE4 = new Button(600, 250, 32, 32, false, () => { if (gete(4).HP > 0) { fightselect = 4; if (fightaction == 2) { fight_enemy(fightselect) } scene_fight(); UI_FightE(fightselect);}});
            fightE4.render();

            let buttonActions = new Button(35, 12, 96, 58, false, () => { if (fightaction == 0) { fightaction = 1; scene_fight(); } });
            buttonActions.render();

            let buttonAttack = new Button(145, 12, 96, 58, false, () => { if (fightaction == 1) { fightaction = 2; scene_fight(); } });
            buttonAttack.render();

            let buttonInventory = new Button(145, 12, 96, 58, false, () => { if (fightaction == 0) { inventoryPage = 1; seeInventory(); } });
            buttonInventory.render();
            let buttonInventoryItem = new Button(120, 140, 560, 210, false, () => { if (inventoryPage > 0) { inventoryClicked(); } });
            buttonInventoryItem.render();

            let buttonInventoryClose = new Button(665, 120, 40, 40, false, () => { if (inventoryPage > 0) { inventoryPage = 0; scene_fight(); } });
            buttonInventoryClose.render();

            let buttonTechniques = new Button(255, 12, 96, 58, false, () => { if (fightaction == 0) { console.log("click1") } });
            buttonTechniques.render();

            let buttonSwitch = new Button(365, 12, 96, 58, false, () => { if (fightaction == 0) { alert("No!"); } });
            buttonSwitch.render();

            let buttonFlee = new Button(475, 12, 96, 58, false, () => { if (fightaction == 0) { characters[char1].HP -= 10; characters[char2].HP -= 10; control = true; changeScene(1); }});
            buttonFlee.render();

            //That's only for graphics and some basic ifs and stuff
            scene_fight();
            break;
        case 4: //Game Over
            control = false;
            setTimeout(() => { ctx.drawImage(images.gameover, 0, 0, 800, 500) }, 10);
            setTimeout(() => { changeScene(0); control = true; }, 5000);
            characters[char1].HP = characters[char1].maxHP;
            characters[char2].HP = characters[char2].maxHP;
            break;
    }
}

function seeInventory() {
    ctx.fillStyle = "rgb(114, 95, 57)";
    ctx.fillRect(100, 120, 600, 250);
    ctx.fillStyle = "rgb(186, 154, 89)";
    ctx.fillRect(120, 140, 560, 210);

    ctx.font = "20px NotoSans, sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("X", 685, 140);
    ctx.fillStyle = "black";
    ctx.fillText("Inventory", 120, 140);

    ctx.font = "16px NotoSans, sans-serif";

    ctx.fillText(characters[char1].name, 210, 150);
    for (p = 0; p < 5; p++) {
        if (Object.keys(characters[char1].inventory)[p] != undefined) {
            ctx.fillText(characters[char1].inventory[Object.keys(characters[char1].inventory)[p]] + "  " + Object.keys(characters[char1].inventory)[p], 200, 170 + (32 * p));
            ctx.drawImage(items[Object.keys(characters[char1].inventory)[p]], 170, 144 + (32 * p), 32, 32);
        }
        else {
            ctx.fillText("---", 200, 170 + (32 * p));
        }
    }
    ctx.fillText(characters[char2].name, 510, 150);
    for (p = 0; p < 5; p++) {
        if (Object.keys(characters[char2].inventory)[p] != undefined) {
            ctx.fillText(characters[char2].inventory[Object.keys(characters[char2].inventory)[p]] + "  " + Object.keys(characters[char2].inventory)[p], 500, 170 + (32 * p));
            ctx.drawImage(items[Object.keys(characters[char2].inventory)[p]], 470, 144 + (32 * p), 32, 32);
        }
        else {
            ctx.fillText("---", 500, 170 + (32 * p));
        }
    }
}

function inventoryClicked() {
    // Char1 Items
    for (x = 0; x < 5; x++) {
        if (mouseX > 170 && mouseX < 300 && mouseY > 145 + (32 * x) && mouseY < 177 + (32 * x)) {
            useItem(Object.keys(characters[char1].inventory)[x], char1);
        }
    }

    // Char2 Items
    for (x = 0; x < 5; x++) {
        if (mouseX > 470 && mouseX < 700 && mouseY > 145 + (32 * x) && mouseY < 177 + (32 * x)) {
            useItem(Object.keys(characters[char2].inventory)[x], char2);
        }
    }
}

function useItem(item, who) {
    if (item == undefined) { return };
    characters[who].inventory[item] -= 1;

    switch (item) {
        case "potion":
            characters[who].HP += 20;
            if (characters[who].HP > characters[who].maxHP) { characters[who].HP = characters[who].maxHP };
            break;
        case "bigpotion":
            characters[who].HP += 50;
            if (characters[who].HP > characters[who].maxHP) { characters[who].HP = characters[who].maxHP };
            break;
    }

    scene_fight();
    seeInventory();
}

function scene_fight() {
    ctx.drawImage(images.fight_bg, 0, 100, 800, 400);

    ctx.fillStyle = "rgb(114, 95, 57)";
    ctx.fillRect(0, 0, 800, 100);
    ctx.fillRect(0, 480, 800, 20);
    ctx.fillStyle = "rgb(186, 154, 89)";
    ctx.fillRect(0, 10, 800, 70);
    ctx.fillRect(0, 400, 800, 80);

    // Buttons

    if (fightaction == 0) {
        ctx.fillStyle = "rgb(47, 95, 191)";
        ctx.fillRect(35, 12, 96, 58);
        ctx.fillStyle = "rgb(191, 212, 255)";
        ctx.fillRect(40, 17, 86, 48);

        ctx.drawImage(images.actions, 40, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(0, 32, 102)";
        ctx.fillText("Battle", 80, 35);
        ctx.fillText("Actions", 80, 48);

        ctx.fillStyle = "rgb(47, 191, 71)";
        ctx.fillRect(145, 12, 96, 58);
        ctx.fillStyle = "rgb(191, 255, 202)";
        ctx.fillRect(150, 17, 86, 48);

        ctx.drawImage(images.inventory, 150, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(0, 102, 13)";
        ctx.fillText("Battle", 180, 35);
        ctx.fillText("Inventory", 180, 48);

        ctx.fillStyle = "rgb(191, 47, 167)";
        ctx.fillRect(255, 12, 96, 58);
        ctx.fillStyle = "rgb(255, 191, 244)";
        ctx.fillRect(260, 17, 86, 48);

        ctx.drawImage(images.techniques, 260, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(102, 0, 83)";
        ctx.fillText("Mastery", 280, 35);
        ctx.fillText("Techniques", 280, 48);

        ctx.fillStyle = "rgb(191, 143, 47)";
        ctx.fillRect(365, 12, 96, 58);
        ctx.fillStyle = "rgb(255, 234, 191)";
        ctx.fillRect(370, 17, 86, 48);

        ctx.drawImage(images.switch, 370, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(102, 68, 0)";
        ctx.fillText("Switch", 400, 35);
        ctx.fillText("Scrapper", 400, 48);

        ctx.fillStyle = "rgb(119, 119, 119)";
        ctx.fillRect(475, 12, 96, 58);
        ctx.fillStyle = "rgb(223, 223, 223)";
        ctx.fillRect(480, 17, 86, 48);

        ctx.drawImage(images.flee, 480, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(102, 102, 102)";
        ctx.fillText("Flee", 530, 35);
        ctx.fillText("Fight", 530, 48);
    }
    else if (fightaction == 1) {
        ctx.fillStyle = "rgb(47, 95, 191)";
        ctx.fillRect(145, 12, 96, 58);
        ctx.fillStyle = "rgb(191, 212, 255)";
        ctx.fillRect(150, 17, 86, 48);
        
        ctx.drawImage(images.actions, 150, 17, 48, 48);
        ctx.font = "12px NotoSans, sans-serif";
        ctx.fillStyle = "rgb(0, 32, 102)";
        ctx.fillText("Attack", 180, 35);
    }

    /*
    ctx.fillStyle = "black";
    ctx.font = "16px NotoSans, sans-serif";
    ctx.fillStyle = "lightblue";

    ctx.fillText(characters[char1].name, 612, 30);
    ctx.fillText(characters[char2].name, 612, 58);

    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "green";

    ctx.fillText("HP: " + characters[char1].HP + "/" + characters[char1].maxHP, 612, 44);
    ctx.fillText("HP: " + characters[char2].HP + "/" + characters[char2].maxHP, 612, 72);
    */

    ctx.fillStyle = "rgb(50, 78, 131)";
    ctx.fillRect(0, 375, 200, 125);
    ctx.fillStyle = "rgb(145, 178, 245)";
    ctx.fillRect(10, 385, 180, 105);

    ctx.font = "10px NotoSans, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("Battle has started!", 20, 395);
    ctx.fillText("All actions will be logged here!", 20, 405);

    UI_FightE();

    ctx.fillStyle = "yellow";
    ctx.fillRect(225, 375, 75, 75);
    ctx.drawImage(portraits.bleu, 230, 380, 65, 65);
    ctx.font = "20px NotoSans, sans-serif";
    ctx.fillText("Level " + characters[char1].level, 230, 480);
    ctx.fillStyle = "blue";
    ctx.fillText(characters[char1].name, 240, 465);

    ctx.fillStyle = "rgb(0, 145, 40)";
    ctx.fillRect(310, 410, 60, 20);
    ctx.fillStyle = "rgb(145, 0, 105)";
    ctx.fillRect(310, 430, 60, 20);

    ctx.fillStyle = "black";
    ctx.fillText(characters[char1].HP + "/" + characters[char1].maxHP, 310, 425);
    ctx.fillText(characters[char1].EP + "/" + characters[char1].EP, 310, 445);

    ctx.fillStyle = "yellow";
    ctx.fillRect(395, 375, 75, 75);
    ctx.drawImage(portraits.corelle, 400, 380, 65, 65);
    ctx.font = "20px NotoSans, sans-serif";
    ctx.fillText("Level " + characters[char1].level, 400, 480);
    ctx.fillStyle = "blue";
    ctx.fillText(characters[char2].name, 400, 465);

    ctx.fillStyle = "rgb(0, 145, 40)";
    ctx.fillRect(480, 410, 60, 20);
    ctx.fillStyle = "rgb(145, 0, 105)";
    ctx.fillRect(480, 430, 60, 20);

    ctx.fillStyle = "black";
    ctx.fillText(characters[char2].HP + "/" + characters[char2].maxHP, 480, 425);
    ctx.fillText(characters[char2].EP + "/" + characters[char2].EP, 480, 445);

    draw_fighters();
}

function fight_enemy(x) {
    gete(x).HP -= characters[char1].strength;
    fightaction = 0;

    if (gete(x).HP < 1) {
        x = 0;
    }

    if (gete(1).HP < 1 && gete(2).HP < 1 && gete(3).HP < 1 && gete(4).HP < 1) { //WON!!!
        characters[char1].EXP += 10;
        characters[char2].EXP += 10;

        // Placeholder. This will be reworked later.
        if (Math.random() > 0.6) {
            addItem(char1, "potion", 1);
        }
        if (Math.random() > 0.6) {
            addItem(char2, "potion", 1);
        }
        if (Math.random() > 0.95) {
            addItem(char1, "bigpotion", 1);
        }
        if (Math.random() > 0.95) {
            addItem(char2, "bigpotion", 1);
        }

        if (characters[char1].EXP >= calculate_EXP(characters[char1].level)) {
            characters[char1].level += 1;
            characters[char1].EXP -= calculate_EXP(characters[char1].level);
            characters[char1].maxHP += Math.round(characters[char1].maxHP / 8);
            characters[char1].HP = characters[char1].maxHP;
            characters[char1].strength += Math.round(characters[char1].strength / 8);
        }
        if (characters[char2].EXP >= calculate_EXP(characters[char1].level)) {
            characters[char2].level += 1;
            characters[char2].EXP -= calculate_EXP(characters[char1].level);
            characters[char2].maxHP += Math.round(characters[char2].maxHP / 8);
            characters[char2].HP = characters[char2].maxHP;
            characters[char2].strength += Math.round(characters[char2].strength / 8);
        }
        control = true;
        changeScene(1);
    }
    else {
        // U god addacked hmmmm
        for (i = 0; i < Object.keys(currentEnemies).length; i++) {
            if (Math.random() > 0.5) {
                var curattack = char1;
            }
            else{
                var curattack = char2;
            }
            if (Math.random() > 0.7) {
                characters[curattack].HP -= gete(i + 1).damage;
            }
        }

        check_gameover();

        scene_fight();
        UI_FightE(x);
    }
}

function draw_fighters() {
    ctx.drawImage(sprites.bleu, 0, 64, 64, 64, 100, 200, 32, 32);
    ctx.drawImage(sprites.bleu, 0, 64, 64, 64, 140, 240, 32, 32);


    if (gete(1).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 600, 200, 32, 32) };
    if (fightselect == 1) { ctx.drawImage(images.selected32, 600, 200, 32, 32) };

    if (gete(2).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 550, 250, 32, 32) };
    if (fightselect == 2) { ctx.drawImage(images.selected32, 550, 250, 32, 32) };

    if (gete(3).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 650, 200, 32, 32) };
    if (fightselect == 3) { ctx.drawImage(images.selected32, 650, 200, 32, 32) };

    if (gete(4).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 600, 250, 32, 32) };
    if (fightselect == 4) { ctx.drawImage(images.selected32, 600, 250, 32, 32) };
}

function loadsavebutton(x) {
    ctx.fillStyle = "rgb(47, 95, 191)";
    ctx.fillRect(35 + (100*x), 12, 96, 58);
    ctx.fillStyle = "rgb(191, 212, 255)";
    ctx.fillRect(40 + (100*x), 17, 86, 48);

    ctx.drawImage(images.paper, 40 + (100*x), 27, 32, 32);
    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "rgb(0, 32, 102)";

    if (localStorage["SOTR" + (x + 1)] != null && localStorage["SOTR" + (x + 1)] != "null") {
        ctx.fillText("Save " + (x + 1), 80 + (x * 100), 40);
        ctx.fillStyle = "rgb(162, 162, 0)";
        ctx.fillText("LVL " + (JSON.parse(localStorage["SOTR" + (x+1)]).characters.bleu.level), 80 + (x * 100), 55);
    }
    else { ctx.fillText("EMPTY", 80 + (x * 100), 40); }
}

function deletesavebutton(x) {
    ctx.fillStyle = "rgb(47, 95, 191)";
    ctx.fillRect(35 + (x * 100), 112, 96, 58);
    ctx.fillStyle = "rgb(191, 212, 255)";
    ctx.fillRect(40 + (x * 100), 117, 86, 48);

    ctx.drawImage(images.gear, 40 + (x * 100), 127, 32, 32);
    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "rgb(0, 32, 102)";
    if (localStorage["SOTR" + (x + 1)] != null && localStorage["SOTR" + (x + 1)] != "null") {
        ctx.fillText("DELETE " + (x + 1), 70 + (x * 100), 140);
    }
    else {
        ctx.fillText("Deleted!", 70 + (x * 100), 140);
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
    buttons.push([0, 800, 0, 500, () => {
        buttons = [];
        localStorage["SOTR0"] = null;

        loadsavebutton(0);
        let loadSave1 = new Button(35, 12, 96, 58, false, () => { saveNR = 1; loadGame(); changeScene(2); });
        loadSave1.render();

        loadsavebutton(1);
        let loadSave2 = new Button(135, 12, 96, 58, false, () => { saveNR = 2; loadGame(); changeScene(2); });
        loadSave2.render();

        loadsavebutton(2);
        let loadSave3 = new Button(235, 12, 96, 58, false, () => { saveNR = 3; loadGame(); changeScene(2); });
        loadSave3.render();

        if (localStorage["SOTR1"] != null && localStorage["SOTR1"] != "null") {
            deletesavebutton(0);
            let delSave1 = new Button(35, 112, 96, 58, false, () => { localStorage["SOTR1"] = null; loadsavebutton(0); deletesavebutton(0); });
            delSave1.render();
        }

        if (localStorage["SOTR2"] != null && localStorage["SOTR2"] != "null") {
            deletesavebutton(1);
            let delSave2 = new Button(135, 112, 96, 58, false, () => { localStorage["SOTR2"] = null; loadsavebutton(1); deletesavebutton(1); });
            delSave2.render();
        }

        if (localStorage["SOTR3"] != null && localStorage["SOTR3"] != "null") {
            deletesavebutton(2);
            let delSave3 = new Button(235, 112, 96, 58, false, () => { localStorage["SOTR3"] = null; loadsavebutton(2); deletesavebutton(2); });
            delSave3.render();
        }
    }]);
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
    check_gameover();

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
    switch (evilfacing) {
        case "up":
            ctx.drawImage(sprites.evil, evilsprite_pr, 128, 64, 64, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "left":
            ctx.drawImage(sprites.evil, evilsprite_pr, 192, 64, 64, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "down":
            ctx.drawImage(sprites.evil, evilsprite_pr, 0, 64, 64, evilxpos * 32, evilypos * 32, 32, 32);
            break;
        case "right":
            ctx.drawImage(sprites.evil, evilsprite_pr, 64, 64, 64, evilxpos * 32, evilypos * 32, 32, 32);
            break;
    }

    triggerFight();

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

    //ctx.font = "12px NotoSans, sans-serif";
    //ctx.fillStyle = "white";
    //ctx.fillText("x" + evilxpos + " y " + evilypos, 11, 145);
};

function autoMove() {
    if (currentScene == 1 && control == true) {
        evilMove();
        triggerFight();
        scene_map();
        setTimeout("autoMove()", 250);
    }
}

function evilMove() {
    evilsprite_pr += 64;
    if (evilsprite_pr == 128) { evilsprite_pr = 0; }

    ai = Math.ceil(Math.random() * 4);
    switch (ai) {
        case 1:
            if (map[evilypos + ypos] != undefined) {
                if (map[evilypos + ypos][evilxpos + xpos + 1] != 2) {
                    evilxpos += 1;
                    evilfacing = "right";
                }
            }
            break;
        case 2:
            if (map[evilypos + ypos] != undefined) {
                if (map[evilypos + ypos][evilxpos + xpos - 1] != 2) {
                    evilxpos -= 1;
                    evilfacing = "left";
                }
            }
            break;
        case 3:
            if (map[evilypos + ypos + 1] != undefined) {
                if (map[evilypos + ypos + 1][evilxpos + xpos] != 2) {
                    evilypos += 1;
                    evilfacing = "up";
                }
            }
            break;
        case 4:
            if (map[evilypos + ypos - 1] != undefined) {
                if (map[evilypos + ypos - 1][evilxpos + xpos] != 2) {
                    evilypos -= 1;
                    evilfacing = "down";
                }
            }
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

    if (map[evilypos + ypos] != undefined) {
        if (map[evilypos + ypos][evilxpos + xpos] == 2) {
            var attempts = 0;
            while (map[evilypos + ypos] != undefined && map[evilypos + ypos][evilxpos + xpos] == 2 && attempts < 1000) {
                evilxpos = Math.round(Math.random() * 25);
                evilypos = Math.round(Math.random() * 16);
                attempts += 1;
            }
        }
    }
    if (map[evilypos + ypos] == undefined) {
        var attempts = 0;
        while (map[evilypos + ypos] == undefined && attempts < 1000) {
            evilxpos = Math.round(Math.random() * 25);
            evilypos = Math.round(Math.random() * 16);
            attempts += 1;
        }
    }
}

function triggerFight() {
    if (12 == evilxpos && 8 == evilypos) {
        evilxpos = 12;
        evilypos = 4;

        // could be optimized using a for loop?
        control = false;
        var offsetx = 200;
        var offsety = 125;
        ctx.drawImage(images.tokenattack, 71, 78, 51, 52, offsetx, offsety, 50, 50);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 166, 76, 62, 65, offsetx, offsety, 62, 62); }, 100);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 266, 65, 89, 64, offsetx, offsety, 86, 92); }, 200);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 396, 66, 118, 116, offsetx, offsety, 116, 114); }, 300);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 38, 197, 103, 95, offsetx, offsety, 100, 92); }, 400);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 178, 190, 136, 129, offsetx, offsety, 133, 126); }, 500);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 346, 196, 172, 157, offsetx, offsety, 168, 154); }, 600);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 546, 189, 191, 152, offsetx, offsety, 187, 149); }, 700);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 768, 217, 240, 95, offsetx, offsety, 237, 91); }, 800);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 51, 394, 261, 47, offsetx, offsety, 258, 44); }, 900);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 378, 374, 257, 107, offsetx, offsety, 253, 103); }, 1000);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 700, 338, 263, 169, offsetx, offsety, 260, 107); }, 1100);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 64, 500, 275, 196, offsetx, offsety, 272, 194); }, 1200);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 366, 496, 315, 204, offsetx, offsety, 311, 201); }, 1300);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 717, 527, 305, 202, offsetx, offsety, 302, 199); }, 1400);

        setTimeout(() => { ctx.drawImage(images.tokenattack, 48, 750, 322, 219, offsetx, offsety, 320, 217); }, 1500);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 370, 750, 335, 226, offsetx, offsety, 333, 223); }, 1600);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 698, 747, 371, 240, offsetx, offsety, 368, 238); }, 1700);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 7, 1015, 89, 64, offsetx, offsety, 372, 204); }, 1800);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 377, 1077, 350, 163, offsetx, offsety, 347, 160); }, 1900);
        setTimeout(() => { ctx.drawImage(images.tokenattack, 759, 1138, 281, 110, offsetx, offsety, 279, 107); changeScene(3); }, 2000);
    }
}

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
    }
}

// Start the game
tiles.water2.onload = function start() {
    draw();
}