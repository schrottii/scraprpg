var zoom = 1;
var kofs = [0, 0, 0];
var walkTime = 0;

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
        text: game.characters.bleu.name,
    }));
    let mapDisplayStats1 = controls.label({
        anchor: [.99, .705], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + game.characters.bleu.HP + "/" + game.characters.bleu.maxHP + "   EP: " + game.characters.bleu.EP,
    });
    let mapDisplayLevel1 = controls.label({
        anchor: [.99, .73], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + game.characters.bleu.level,
    }); 

    mapDisplay.push(controls.label({
        anchor: [.99, .76], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 18, fill: "#000000",
        text: game.characters.corelle.name,
    }));
    let mapDisplayStats2 = controls.label({
        anchor: [.99, .785], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + game.characters.corelle.HP + "/" + game.characters.corelle.maxHP + "   EP: " + game.characters.corelle.EP,
    });
    let mapDisplayLevel2 = controls.label({
        anchor: [.99, .81], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + game.characters.corelle.level,
    });

    // Buttons, then images over them
    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.button({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 255,
            text: "",
            onClick(args) {
                if (this.offset[0] == -220) {
                    enemies.push(mapenemies.default({
                        position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                    }));
                    console.log(enemies);
                }
                if (this.offset[0] == -145) {
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
                if (this.offset[0] == -70) {
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
            return map.tiles[map.map[y][x * 4] + map.map[y][(x * 4) + 1] + map.map[y][(x * 4) + 2]];
        }
        if (l == 2) {
            return map.tiles[map.mapfg[y][x * 4] + map.mapfg[y][(x * 4) + 1] + map.mapfg[y][(x * 4) + 2]];
        }
    }

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
    function isWalkable(map, x, y) {
        if (map.map[y] && getTile(map, x, y)) { //Check if tile exists
            if (getTile(map, x, y).occupied != undefined) { //Check if occupied exists
                if (typeof (getTile(map, x, y).occupied) == "object") { // Config exists?
                    if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up") && getTile(map, x, y).occupied.includes("up")) {
                        return true
                    }
                    else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left") && getTile(map, x, y).occupied.includes("left")) {
                        return true
                    }
                    else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down") && getTile(map, x, y).occupied.includes("down")) {
                        return true
                    }
                    else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right") && getTile(map, x, y).occupied.includes("right")) {
                        return true
                    }
                    else { // Config denies passing
                        return false;
                    }
                }
                return !getTile(map, x, y).occupied // No config, is it occupied?
            }
        // Unoccupied, you can pass!
            return true;
        } else return false;
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
        }
    }

    function check_EnemyCollision() {
        if (game.position[0] == enemies[i].position[0] &&
            game.position[1] == enemies[i].position[1]) {
            // Fight !!!
            console.log("touch");
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
        }
    }

    function ActionsOnMove(){
        // Everything performed when the player moves successfully

        // Spawn enemies (sometimes)
        if (enemies.length < 8) {
            if (Math.random() > 0.95) { // For the stupid: Somewhat unlikely
                enemies.push(mapenemies.default({
                    position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                }));
            }
        }

        for (i = 0; i < enemies.length; i++) {
            check_EnemyCollision();
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
                                        }
                                    }
                                }
                            }
                        }

                        if (Math.random() > 0.40) { // Left
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] -= 1;
                                            enemies[i].head = 1;
                                        }
                                    }
                                }
                            }
                        }

                        if (Math.random() > 0.40) { // Right
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] += 1;
                                            enemies[i].head = 2;
                                        }
                                    }
                                }
                            }
                        }

                        if (Math.random() > 0.40) { // Up
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0] - 1] != undefined) {
                                    if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1) != undefined) {
                                        if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1).occupied != true) {
                                            enemies[i].position[1] -= 1;
                                            enemies[i].head = 3;
                                        }
                                    }
                                }
                            }
                        }

                        if (map.map[enemies[i].position[1]] == undefined
                            || getTile(map, enemies[i].position[0], enemies[i].position[1]).occupied == true) { // Respawn if on ocean or occupied
                            enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                        }

                        if (game.position[0] == enemies[i].position[0] &&
                            game.position[1] == enemies[i].position[1]) {
                            check_EnemyCollision();
                        }
                    }
                }
            }

            if (!kofs[2] && canMove == true) {
                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up") && isWalkable(map, game.position[0], game.position[1] - 1)) {
                    kofs = [0, -1, 1];
                    game.position[1]--;
                    head = 3;
                    ActionsOnMove();
                    tryTeleport(map, game.position[0], game.position[1]);
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down") && isWalkable(map, game.position[0], game.position[1] + 1)) {
                    kofs = [0, 1, 1];
                    game.position[1]++;
                    head = 0;
                    ActionsOnMove();
                    tryTeleport(map, game.position[0], game.position[1]);
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left") && isWalkable(map, game.position[0] - 1, game.position[1])) {
                    kofs = [-1, 0, 1];
                    game.position[0]--;
                    head = 1;
                    ActionsOnMove();
                    tryTeleport(map, game.position[0], game.position[1]);
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right") && isWalkable(map, game.position[0] + 1, game.position[1])) {
                    kofs = [1, 0, 1];
                    game.position[0]++;
                    head = 2;
                    ActionsOnMove();
                    tryTeleport(map, game.position[0], game.position[1]);
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
                if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                    if (map.mapfg[y][(x * 4) + 2] != "-") {
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

            ctx.drawImage(images["bleu"], 32 * Math.floor(walkTime), 32 * head, 32, 32,
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5) ),
                scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zoom * scale, zoom * scale)
            ctx.imageSmoothingEnabled = true;


            // ...leave?
            if (currentKeys["q"]) {
                setScene(scenes.title());
            }


            // Update bottom right texts
            // I think this method is inefficient, but I was not able to find a better one.
            // I searched and tried several things for hours.
            mapDisplayLevel1.text = "Level: " + game.characters.bleu.level;
            mapDisplayStats1.text = "HP: " + game.characters.bleu.HP + "/" + game.characters.bleu.maxHP + "   EP: " + game.characters.bleu.EP;
            mapDisplayLevel2.text = "Level: " + game.characters.corelle.level;
            mapDisplayStats2.text = "HP: " + game.characters.corelle.HP + "/" + game.characters.corelle.maxHP + "   EP: " + game.characters.corelle.EP;
        },
        controls: [
            ...walkPad, autoSaveText, ...mapDisplay,
            mapDisplayStats1, mapDisplayStats2,
            mapDisplayLevel1, mapDisplayLevel2,
        ],
    }
}

// TBD - to be developed