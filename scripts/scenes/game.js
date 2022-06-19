var zoom = 1;
var kofs = [0, 0, 0];
var walkTime = 0;
var direction = "none";
var inDialogue = false;
var currentDialogue;
var dialogueProgress = 0;
var dialogueEmotion = "neutral";

// Function used to create enemies
function createEnemy(type) {
    if (currentEnemies.length < 9) {
        currentEnemies.push([type, Math.ceil(Math.random() * 2), Math.ceil(Math.random() * 2)]);
    }
}

function clearCurrentEnemies() {
    currentEnemies = [];
}

function checkLevelUps() {
    if (game.characters.bleu.EXP > 24) {
        game.characters.bleu.EXP -= 25;
        game.characters.bleu.level += 1;

        game.characters.bleu.strength = 3 + game.characters.bleu.level;
        game.characters.bleu.maxHP = 18 + (game.characters.bleu.level*2);

        game.characters.bleu.HP = game.characters.bleu.maxHP;
    }
    if (game.characters.corelle.EXP > 24) {
        game.characters.corelle.EXP -= 25;
        game.characters.corelle.level += 1;

        game.characters.corelle.strength = 2 + game.characters.corelle.level;
        game.characters.corelle.maxHP = 14 + (game.characters.corelle.level * 2);

        game.characters.corelle.HP = game.characters.corelle.maxHP;
    }
}

function getEmotion(emotion) { //How do you spell portrait?
    switch (emotion) {
        case "neutral":
            return [0, 0, 64, 64];
            break;
        case "happy":
            return [0, 64, 64, 64];
            break;
        case "disappointed":
            return [0, 128, 64, 64];
            break;
        case "sad":
            return [0, 192, 64, 64];
            break;
        case "angry":
            return [0, 256, 64, 64];
            break;
        default:
            return [0, 0, 64, 64];
            break;
    }
}

scenes.game = () => {
    
    let head = 0;
    let pad = "";

    var scale;

    var enemies = [];

    let walkPad = [];
    walkPad.push(controls.image({ // Up
        anchor: [.1, .75], offset: [0, 0], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowup",
        onClick(args) {
            pad = "up";
        }
    }));
    walkPad.push(controls.image({ // Middle
        anchor: [.1, .75], offset: [0, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowmiddle",
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.1, .75], offset: [0, 80], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowdown",
        onClick(args) {
            pad = "down";
        }
    }));
    walkPad.push(controls.image({ // Left
        anchor: [.1, .75], offset: [-40, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowleft",
        onClick(args) {
            pad = "left";
        }
    }));
    walkPad.push(controls.image({ // Right
        anchor: [.1, .75], offset: [40, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowright",
        onClick(args) {
            pad = "right";
        }
    }));


    let autoSaveText = controls.label({
        anchor: [.025, .98], offset: [12, -12],
        fontSize: 16, text: "Game saved!", alpha: 0,
    });



    // Alright, alright, we need comments, so let me comment this
    // This is for the map's display. In the BOTTOM RIGHT. No idea what else to call it.
    let mapDisplay = []

    // The top bg rect
    mapDisplay.push(controls.rect({
        anchor: [.9925, .68], offset: [-220, 0], sizeOffset: [250, 250],
        fill: "#B58542",
    }));

    // Names, stats, etc.
    mapDisplay.push(controls.label({
        anchor: [.99, .68], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer().name,
    }));
    let mapDisplayStats1 = controls.label({
        anchor: [.99, .705], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer().HP + "/" + getPlayer().maxHP + "   EP: " + getPlayer().EP + "/" + getPlayer().maxEP,
    });
    let mapDisplayLevel1 = controls.label({
        anchor: [.99, .73], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + getPlayer().level,
    }); 

    mapDisplay.push(controls.label({
        anchor: [.99, .76], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer(2).name,
    }));
    let mapDisplayStats2 = controls.label({
        anchor: [.99, .785], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer(2).HP + "/" + getPlayer(2).maxHP + "   EP: " + getPlayer(2).EP + "/" + getPlayer(2).maxEP,
    });
    let mapDisplayLevel2 = controls.label({
        anchor: [.99, .81], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + getPlayer(2).level,
    });


    let dialogueComponents = []
    dialogueComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -140], sizeAnchor: [1, 0], sizeOffset: [0, 140],
        clickthrough: false,
        fill: "#B58542",
        alpha: 0,
    }));
    dialogueComponents.push(controls.image({
        anchor: [0, 1], offset: [0, -128], sizeOffset: [128, 128], snip: [0, 0, 64, 64],
        source: "Portraits_Bleu",
        alpha: 0,
    }));
    dialogueComponents.push(controls.label({
        anchor: [0, 1], offset: [156, -105],
        align: "left", fontSize: 14, fill: "black",
        text: "...",
        alpha: 0,
    }));
    dialogueComponents.push(controls.button({
        anchor: [0.8, 1], offset: [0, -105], sizeAnchor: [0.2, 0.05],
        text: "Continue...",
        onClick(args) {
            if (this.alpha == 255) {
                dialogueProgress += 1;
                if (dialogueProgress >= maps[game.map].dialogues[currentDialogue].length || maps[game.map].dialogues[currentDialogue][dialogueProgress] == undefined) {
                    inDialogue = false;
                    currentDialogue = false;
                    dialogueEmotion = "neutral";
                    dialogueProgress = 0;
                    canMove = true;
                }
            }
        },
        alpha: 0,
    }));



    let actionButton = controls.image({
        anchor: [0.8, 0.8], sizeOffset: [64, 64],
        alpha: 255,
        source: "actionbutton",
        onClick(args) {
            let map = maps[game.map];
            if (head == 0) { // Down
                if (getTile(map, game.position[0], game.position[1] + 1) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) {
                        getTile(map, game.position[0], game.position[1] + 1).action();
                    }
                }
            }
            else if (head == 1) { // Left
                if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) {
                    if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) {
                        getTile(map, game.position[0] - 1, game.position[1]).action();
                    }
                }
            }
            else if (head == 2) { // Right
                if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) {
                    if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) {
                        getTile(map, game.position[0] + 1, game.position[1]).action();
                    }
                }
            }
            else if (head == 3) { // Up
                if (getTile(map, game.position[0], game.position[1] - 1) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) {
                        getTile(map, game.position[0], game.position[1] - 1).action();
                    }
                }
            }   
        }
    });

    // Buttons, then images over them
    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.button({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 255,
            text: "",
            onClick(args) {
                if (this.offset[0] == -220 && canMove == true) {
                    enemies.push(mapenemies.itsalivemap({
                        position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                    }));
                    console.log(enemies);
                }
                if (this.offset[0] == -145 && canMove == true) {
                    if (zoom == 2) {
                        zoom = 3;
                    }
                    else if (zoom == 3) {
                        zoom = 1;
                    }
                    else if (zoom == 1) {
                        zoom = 2;
                    }
                }
                if (this.offset[0] == -70 && canMove == true) {
                    if (this.alpha == 255) {
                        for (i = 0; i < mapDisplay.length; i++) {
                            mapDisplay[i].alpha = 0;
                        }
                        mapDisplayStats1.alpha = 0;
                        mapDisplayStats2.alpha = 0;
                        mapDisplayLevel1.alpha = 0;
                        mapDisplayLevel2.alpha = 0;
                    }
                    else {
                        for (i = 0; i < mapDisplay.length; i++) {
                            mapDisplay[i].alpha = 255;
                        }
                        mapDisplayStats1.alpha = 255;
                        mapDisplayStats2.alpha = 255;
                        mapDisplayLevel1.alpha = 255;
                        mapDisplayLevel2.alpha = 255;
                    }
                }
            }
        }));
    }

    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.image({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 255,
            source: ["paper", "inventory", "gear"][i],
        }));
    }
    

    // Function used to grab tiles
    function getTile(map, x, y, l = 1) {
        if (y < 0) return undefined;
        if (l == 1) {
            if (map.map[y] != undefined) {
                return map.tiles[map.map[y][x * 4] + map.map[y][(x * 4) + 1] + map.map[y][(x * 4) + 2]];
            }
        }
        if (l == 2) {
            return map.tiles[map.mapbg2[y][x * 4] + map.mapbg2[y][(x * 4) + 1] + map.mapbg2[y][(x * 4) + 2]];
        }
        if (l == 3) {
            return map.tiles[map.mapfg[y][x * 4] + map.mapfg[y][(x * 4) + 1] + map.mapfg[y][(x * 4) + 2]];
        }
    }

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
    function isWalkable(map, x, y, l=1) {
        if (map.map[y] && getTile(map, x, y, l)) { //Check if tile exists
            if (getTile(map, x, y, l).occupied != undefined) { //Check if occupied exists
                if (typeof (getTile(map, x, y, l).occupied) == "object") { // Config exists?
                    if (direction == "up" && getTile(map, x, y, l).occupied.includes("up")) {
                        return true
                    }
                    else if (direction == "left" && getTile(map, x, y, l).occupied.includes("left")) {
                        return true
                    }
                    else if (direction == "down" && getTile(map, x, y, l).occupied.includes("down")) {
                        return true
                    }
                    else if (direction == "right" && getTile(map, x, y, l).occupied.includes("right")) {
                        return true
                    }
                    else { // Config denies passing
                        return false;
                    }
                }
                return !getTile(map, x, y, l).occupied // No config, is it occupied?
            }
            // Unoccupied, you can pass!
            return true;
        } else {
            if (l == 1) return false;
            return true;
        }
    }

    function isTeleport(map, x, y) {
        if (map.map[y] && map.map[y][(x * 3) + 2]) { //Check if tile exists
            if (getTile(map, x, y).teleport != undefined) { //Check if occupied exists
                //It exists! A miracle
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    function tryTeleport(map, x, y) {
        if (isTeleport(map, x, y)) {
            let themap = getTile(map, x, y);
            // Set map and pos
            game.map = themap.teleport[0];
            game.position[0] = themap.teleport[1];
            game.position[1] = themap.teleport[2];
            playSound("teleport");
        }
    }

    function check_EnemyCollision(i) {
        if (game.position[0] == enemies[i].position[0] &&
            game.position[1] == enemies[i].position[1] &&
            enemies[i].map == game.map) {
            // Fight !!!
            clearCurrentEnemies();

            // It automatically grabs the enemies that can appear in the fight
            // based on what is defined in the enemies dict of the map enemy
            // change in map_enemies.js
            while (currentEnemies.length < 1) {
            for (k = 0; k < 5; k++) {
                for (j in enemies[i].enemies) {
                        if (enemies[i].enemies[j] > (Math.random() * 100)) {
                            createEnemy(j);
                        }
                }
                }
            }

            image_animation(images.tokenattack, [71, 78, 51, 52,
                166, 76, 62, 65,
                266, 65, 89, 64,
                396, 66, 118, 116,
                38, 197, 103, 95,
                178, 190, 136, 129,
                346, 196, 172, 157,
                546, 189, 191, 152,
                768, 217, 240, 95,
                51, 394, 261, 47,
                378, 374, 257, 107,
                700, 338, 263, 169,
                64, 500, 275, 196,
                366, 496, 315, 204,
                717, 527, 305, 202,
                48, 750, 322, 219,
                370, 750, 335, 226,
                698, 747, 371, 240,
                7, 1015, 89, 64,
                377, 1077, 350, 163,
                759, 1138, 281, 110]);
            let previouszoom = zoom;
            setTimeout(() => { zoom = 1.5; }, 250);
            setTimeout(() => { zoom = 2; }, 500);
            setTimeout(() => { zoom = 2.5; }, 750);
            setTimeout(() => { zoom = 3; }, 1000);
            setTimeout(() => { zoom = 4; }, 1250);
            setTimeout(() => { setScene(scenes.fight()); }, 2000);
            setTimeout(() => { zoom = previouszoom; }, 2200);
        }
    }

    function ActionsOnMove() {
        let map = maps[game.map];
        // Everything performed when the player moves successfully

        // Calculate how many enemies can still be spawned.
        // The limit is now 8/map. This calculates how many are on the current map
        let maxEnemies = map.maxEnemies;
        let enemiesOnThisMap = 0;
        for (i in enemies) {
            if (enemies[i].map == game.map) {
                enemiesOnThisMap += 1;
            }
        }

        // Spawn enemies (sometimes)
        if (enemiesOnThisMap < maxEnemies) {
            for (possibleSpawns in map.spawns) {
                if (map.spawns[possibleSpawns] > Math.random() * 100) { // For the stupid: Somewhat unlikely
                        enemies.push(mapenemies[possibleSpawns]({
                            position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                        }));
                    }
            }
        }

        for (i = 0; i < enemies.length; i++) {
            check_EnemyCollision(i);
        }

        if (getTile(map, game.position[0], game.position[1]).dialogue != undefined) {
            inDialogue = true;
            currentDialogue = getTile(map, game.position[0], game.position[1]).dialogue;
            dialogueProgress = 0;
            dialogueEmotion = map.dialogues[currentDialogue][dialogueProgress][1];
            canMove = false;
        }
    }

    return {
        preRender(ctx, delta) {
            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;
            let map = maps[game.map];

            // Auto Save & Auto Save Text (ft. Last Christmas)
            if (autoSaveTime > 9999) {
                // Animation
                addAnimator(function (t) {
                    autoSaveText.alpha = t / 10;
                    if (t > 2500) {
                        autoSaveTime = 0;
                        autoSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
                // Saving
                saveGame();
                autoSaveTime = -3; // To prevent saving multiple times!
            }

            // Check if it's time for enemies to move
            if (moveEnemiesTime > 499) {
                moveEnemiesTime = 0;
                if (canMove == true) {
                    for (i = 0; i < enemies.length; i++) {
                        // Random moving
                        if (Math.random() > 0.40) { // Down
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0] + 1] != undefined) {
                                    if (getTile(map, enemies[i].position[0], enemies[i].position[1] + 1) != undefined) {
                                        if (getTile(map, enemies[i].position[0], enemies[i].position[1] + 1).occupied != true) {
                                            enemies[i].position[1] += 1;
                                            enemies[i].head = 0;
                                            enemies[i].kofs = [0, 1, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Left
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] -= 1;
                                            enemies[i].head = 1;
                                            enemies[i].kofs = [-1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Right
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] += 1;
                                            enemies[i].head = 2;
                                            enemies[i].kofs = [1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Up
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0] - 1] != undefined) {
                                    if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1) != undefined) {
                                        if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1).occupied != true) {
                                            enemies[i].position[1] -= 1;
                                            enemies[i].head = 3;
                                            enemies[i].kofs = [0, -1, 1];
                                        }
                                    }
                                }
                            }
                        }

                        // Respawn if on ocean or occupied
                        if (map.map[enemies[i].position[1]] != undefined) {
                            if (getTile(map, enemies[i].position[0], enemies[i].position[1]) == undefined) {
                                enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                            }
                            else {
                                if (getTile(map, enemies[i].position[0], enemies[i].position[1]).occupied == true) {
                                    enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                                }
                            }
                        }
                        else {
                            enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                        }

                        // Don't put this in a for loop. lol
                        check_EnemyCollision(i);
                    }
                }
            }

            if (!kofs[2] && canMove == true) {
                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up")) {
                    head = 3;
                    direction = "up";
                    if (getTile(map, game.position[0], game.position[1] - 1) != undefined) if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) actionButton.source = "actionbutton_active"
                    else actionButton.source = "actionbutton"
                    if (isWalkable(map, game.position[0], game.position[1] - 1)
                        && isWalkable(map, game.position[0], game.position[1] - 1, 2)) { //Direction-change-against-wall
                        kofs = [0, -1, 1];
                        game.position[1]--;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);
                        if (getTile(map, game.position[0], game.position[1] - 1) != undefined) if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) actionButton.source = "actionbutton_active"
                        else actionButton.source = "actionbutton"
                    }
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down")) {
                    head = 0;
                    direction = "down";
                    if (getTile(map, game.position[0], game.position[1] + 1) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) actionButton.source = "actionbutton_active"
                    else actionButton.source = "actionbutton"
                    if (isWalkable(map, game.position[0], game.position[1] + 1)
                        && isWalkable(map, game.position[0], game.position[1] + 1, 2)) { //Direction-change-against-wall
                        kofs = [0, 1, 1];
                        game.position[1]++;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);
                        if (getTile(map, game.position[0], game.position[1] + 1) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) actionButton.source = "actionbutton_active"
                        else actionButton.source = "actionbutton"
                    }
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left")) {
                    head = 1;
                    direction = "left";
                    if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                    else actionButton.source = "actionbutton"
                    if (isWalkable(map, game.position[0] - 1, game.position[1])
                        && isWalkable(map, game.position[0] - 1, game.position[1], 2)) { //Direction-change-against-wall
                        kofs = [-1, 0, 1];
                        game.position[0]--;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);
                        if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                        else actionButton.source = "actionbutton"
                    }
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right")) {
                    head = 2;
                    direction = "right";
                    if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                    else actionButton.source = "actionbutton"
                    if (isWalkable(map, game.position[0] + 1, game.position[1])
                        && isWalkable(map, game.position[0] + 1, game.position[1], 2)) { //Direction-change-against-wall
                        kofs = [1, 0, 1];
                        game.position[0]++;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);
                        if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                        else actionButton.source = "actionbutton"
                    }
                }
                pad = "";
            }
            kofs[2] = Math.max(kofs[2] - delta / 166, 0);
            walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;


            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.map[y] && map.map[y][(x * 4) + 2]) {
                    ctx.drawImage(images["tiles/" + getTile(map, x, y).sprite],
                        ((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width/2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                } else if (map.tiles.empty) {
                    ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                        (zoom * scale) * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                }
            }
            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapbg2[y] && map.mapbg2[y][(x * 4) + 2]) {
                    if (map.mapbg2[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 2).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                    }
                }
            }

            for (let enemy of enemies) {
                if (enemy.alpha > 0) {
                    ctx.globalAlpha = enemy.alpha;
                    enemy.render(ctx);
                }
            }

            ctx.drawImage(images[game.char1], 32 * Math.floor(walkTime), 32 * head, 32, 32,
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5) ),
                scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zoom * scale, zoom * scale)
            ctx.imageSmoothingEnabled = true;


            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                    if (map.mapfg[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 3).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                    }
                }
            }


            if (inDialogue == true) {
                for (i = 0; i < dialogueComponents.length; i++) {
                    dialogueComponents[i].alpha = 255;
                }
                if (map.dialogues[currentDialogue][dialogueProgress] != undefined) {
                    dialogueComponents[2].text = map.dialogues[currentDialogue][dialogueProgress][0];
                    dialogueEmotion = map.dialogues[currentDialogue][dialogueProgress][1];
                    dialogueComponents[1].snip = getEmotion(dialogueEmotion);
                }
            }
            else if (dialogueComponents[0].alpha != 0) {
                for (i = 0; i < dialogueComponents.length; i++) {
                    dialogueComponents[i].alpha = 0;
                }
            }

            // ...leave?
            if (currentKeys["q"]) {
                setScene(scenes.title());
            }


            // Update bottom right texts
            // I think this method is inefficient, but I was not able to find a better one.
            // I searched and tried several things for hours.
            mapDisplayLevel1.text = "Level: " + getPlayer().level + "  EXP: " + getPlayer().EXP + "/25";
            mapDisplayStats1.text = "HP: " + getPlayer().HP + "/" + getPlayer().maxHP + "   EP: " + getPlayer().EP + "/" + getPlayer().maxEP;
            mapDisplayLevel2.text = "Level: " + getPlayer(2).level + "  EXP: " + getPlayer(2).EXP + "/25";
            mapDisplayStats2.text = "HP: " + getPlayer(2).HP + "/" + getPlayer(2).maxHP + "   EP: " + getPlayer(2).EP + "/" + getPlayer(2).maxEP;
        },
        controls: [
            ...walkPad, autoSaveText, ...mapDisplay, actionButton,
            mapDisplayStats1, mapDisplayStats2,
            mapDisplayLevel1, mapDisplayLevel2, ...dialogueComponents
        ],
    }
}

// TBD - to be developed