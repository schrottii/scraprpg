var zoom = 1;
var zswm = 1;
var kofs = [0, 0, 0];
var head = 0;

var mapWidth = 0;
var map;

var walkTime = 0;
var animateTime = 0;
var spaceBarTime = 0;

var direction = "none";
var inDialogue = false;
var currentDialogue;
var dialogueProgress = 0;
var dialogueType;
var dialogueEmotion = "neutral";
var dialogueObjects = "";
var overWorldStatsScroll = 0;
var cutsceneMode = false;

const ROWBOOST = 0.33;
const ELEMENTBOOST = 0.5; // 0.33 = 33%, 0.5 = 50%
const CRITBOOST = 2;

const CAMERA_LOCK_X = -2;
const CAMERA_LOCK_Y = -2;

var CAM_OX = 0;
var CAM_OY = 0;

// Function used to grab tiles
function getTile(map, x, y, l = 1) {
    //console.log(map, x, y, l)

    if (y < 0) return undefined;

    let thetile;
    x = Math.floor(x);
    y = Math.floor(y);

    if (l == 1) {
        if (map.map[y] != undefined) {
            thetile = map.map[y][x * 4] + map.map[y][(x * 4) + 1] + map.map[y][(x * 4) + 2];
        }
    }
    if (l == 2) {
        if (map.mapbg2[y] != undefined) {
            thetile = map.mapbg2[y][x * 4] + map.mapbg2[y][(x * 4) + 1] + map.mapbg2[y][(x * 4) + 2];
        }
    }
    if (l == 3) {
        if (map.mapfg[y] != undefined) {
            thetile = map.mapfg[y][x * 4] + map.mapfg[y][(x * 4) + 1] + map.mapfg[y][(x * 4) + 2];
        }
    }

    if (map.tiles[thetile] != undefined) return map.tiles[thetile];
    if (commontiles[thetile] != undefined) return commontiles[thetile];

    let fallBack = map.tiles.empty;
    if (l == 1) fallBack.occupied = true;
    else fallBack.occupied = false;
    return fallBack;
}

function getTileCondition(map, x, y, l) {
    let tile = getTile(map, x, y, l);

    if (tile.condition == undefined || !isValid(tile.condition)) return true; // enabled

    if (!isValid(tile.condinv)) {
        // tile exists if condition, else it does not exist
        return typeof (tile.condition) == "string" ? eval(tile.condition) : tile.condition();
    }
    else {
        // invert, so it exists if condition false
        return typeof (tile.condition) == "string" ? !eval(tile.condition) : !tile.condition();
    }
}

function getNPCCondition(npc) {
    if (npc.condition == undefined || !isValid(npc.condition)) return true; // enabled

    if (!isValid(npc.condinv)) {
        // tile exists if condition, else it does not exist
        return typeof (npc.condition) == "string" ? eval(npc.condition) : npc.condition();
    }
    else {
        // invert, so it exists if condition false
        return typeof (npc.condition) == "string" ? !eval(npc.condition) : !npc.condition();
    }
}

var activeEnemies = [];
var activeNPCs = [];

function isTeleport(map, x, y, l = 1) {
    // Is it a teleporter?
    if (map == undefined) map = maps[game.map];

    let lay = ["map", "map", "mapbg2", "mapfg"][l];
    if (map[lay][y] && map[lay][y][(x * 3) + 2]) { // Check if tile exists
        if (getTile(map, x, y, l) != undefined) {
            if (getTile(map, x, y, l).teleport != undefined) { // Check if teleport exists
                // It exists! A miracle
                return true;
            }
            else {
                // It does not exist
                return false;
            }
        }
    }
    return false;
}

function tryTeleport(map, x, y, l = 1) {
    if (map == undefined) map = maps[game.map];
    let tele = getTile(map, x, y, l).teleport;
    if (isTeleport(map, x, y, l)) teleportPlayer(tele[0], tele[1], tele[2]);
}

function teleportPlayer(mmap, x, y) {
    let previousmap = game.map;

    canMove = false;
    playSound("teleport");
    fadeOut(1000 / 3, true);

    setTimeout(() => {
        enemies = [];
        mapWidth = 0;

        game.map = mmap;
        map = maps[game.map];
        game.map.tiles = Object.assign({}, game.map.tiles, loadPacks());

        loadNPCs();
        loadAreaMusic(previousmap);
        trySpawnEnemy(42);
        checkTileDialogue();

        game.stats.tp++;

        game.position[0] = x;
        game.position[1] = y;

        fadeIn(1000 / 3, true);
        if (!isValid(currentDialogue) || currentDialogue === false) canMove = true;
    }, 750);
}

function checkTileDialogue() {
    if (inDialogue) return false;
    if (getTile(map, game.position[0], game.position[1]) != undefined) {
        if (getTile(map, game.position[0], game.position[1]).dialogue != undefined) {
            startDialogue(map.dialogues[getTile(map, game.position[0], game.position[1]).dialogue]);
        }
    }
    if (getTile(map, game.position[0], game.position[1], 2) != undefined) {
        if (getTile(map, game.position[0], game.position[1], 2).dialogue != undefined) {
            startDialogue(map.dialogues[getTile(map, game.position[0], game.position[1], 2).dialogue]);
        }
    }
}

function loadNPCs() {
    activeNPCs = [];
    for (i in npcs) {
        if (npcs[i].alpha != 0 && npcs[i].map == game.map) {
            activeNPCs.push(npcs[i]);
        }
    }
    if (maps[game.map].npcs != undefined) for (i in maps[game.map].npcs) {
        if (maps[game.map].npcs[i].alpha != 0) {
            activeNPCs.push(maps[game.map].npcs[i]);
        }
    }
    for (i in activeNPCs) {
        for (j in npcs.default) {
            if (activeNPCs[i][j] == undefined && j != "dialogues") activeNPCs[i][j] = npcs.default[j];
        }
    }
}

function loadAreaMusic(prev = "none") {
    if (maps[prev] != undefined) {
        if (maps[prev].music != map.music) {
            stopMusic();
        }
        if (map.music == undefined) return false;

        if (map.intro != undefined) playMusic(map.music, map.intro);
        else playMusic(map.music);
    }
    else {
        if (map.music == undefined) return false;

        if (map.intro != undefined) playMusic(map.music, map.intro);
        else playMusic(map.music);
    }
}

function trySpawnEnemy(amount = 1) {
    // Calculate how many enemies can still be spawned.
    let maxEnemies = maps[game.map].maxEnemies;
    let enemiesOnThisMap = 0;
    let spawned = false;

    for (i in activeEnemies) {
        if (activeEnemies[i].map == maps[game.map]) {
            enemiesOnThisMap += 1;
        }
    }

    // Spawn enemies (sometimes)
    for (let e = 0; e < amount; e++) {
        for (possibleSpawns in maps[game.map].spawns) {
            if (enemiesOnThisMap < maxEnemies) {
                if (maps[game.map].spawns[possibleSpawns] > Math.random() * 100) {
                    spawned = spawnMapEnemy(possibleSpawns);
                    if (spawned == true) enemiesOnThisMap++;
                }
            }
            else break;
        }
    }
}

function spawnMapEnemy(enemyToSpawn) {
    if (mapenemies[enemyToSpawn] != undefined) {
        if (mapenemies[enemyToSpawn]().time == "day" && !isDay()) return false;
        if (mapenemies[enemyToSpawn]().time == "dawn" && !isDawn()) return false;
        if (mapenemies[enemyToSpawn]().time == "noon" && !isNoon()) return false;
        if (mapenemies[enemyToSpawn]().time == "dusk" && !isDusk()) return false;
        if (mapenemies[enemyToSpawn]().time == "night" && !isNight()) return false;
    }
    else return false;

    if (mapWidth == 0) {
        for (i = 0; i < maps[game.map].map.length; i++) {
            if (maps[game.map].map[i] != undefined && maps[game.map].map[i].length > mapWidth) mapWidth = maps[game.map].map[i].length / 4;
        }
    }

    // generate map enemy
    let posX = Math.floor(Math.random() * mapWidth);
    let posY = Math.floor(Math.random() * maps[game.map].map.length);

    if (getTile(map, posX, posY).occupied == true || getTile(map, posX, posY).swim == true) return false;

    // do not spawn near the player
    if (posX - game.position[0] < 5 && posX - game.position[0] > -5) return false;
    if (posY - game.position[1] < 5 && posY - game.position[1] > -5) return false;

    activeEnemies.push(mapenemies[enemyToSpawn]({
        position: [posX, posY], map: game.map,
    }));
    let latest = activeEnemies[activeEnemies.length - 1];

    // sprite gen
    if (latest.source == "gen") {
        let genSource = "";
        latest.gen = [];

        // grab the enemies in this map enemy, so we can then pick a random one
        // pregen both for the sprite gen and the enemy encounter later
        while (latest.gen.length < latest.minSize) {
            for (let k = 0; k < 8; k++) {
                for (let j in latest.enemies) {
                    if (latest.gen.length >= latest.maxSize) break;
                    if (latest.enemies[j] > (Math.random() * 100)) {
                        latest.gen.push(j);
                    }
                }
            }
        }

        // set a random as source (random enemy)
        genSource = "enemies/" + enemyTypes[latest.gen[Math.floor(Math.random() * latest.gen.length)]].source;

        if (images[genSource] == undefined) {
            console.log("| ⚠️ | Enemy Sprite (gen) undefined: " + genSource);
            latest.source = "enemies/black";
        }
        else {
            // works fine
            latest.source = genSource;
        }
    }

    return true; // it spawned
}

function startDialogue(cd) {
    if (inDialogue) return false;
    if (typeof (cd) == "string") cd = map.dialogues[cd];

    inDialogue = true;
    currentDialogue = cd.lines;
    dialogueType = cd.type;
    dialogueProgress = 0;
    dialogueEmotion = currentDialogue[dialogueProgress].portrait;

    game.stats.npcsTalked++;
    canMove = false;
    dialogueScript();
}

function dialogueScript() {
    if (isValid(currentDialogue[dialogueProgress].script)) {
        if (typeof (currentDialogue[dialogueProgress].script) == "string") eval(currentDialogue[dialogueProgress].script);
        else currentDialogue[dialogueProgress].script();
    }
}

function renderDialogue() {
    let dNameID = dTextID = dPortraitID = dStarID = -1; // star and text must exist, rest optional

    // Set dialogueObjects (which will be used) to whatever our current type is
    // Cutscene, normal, invis., narrator

    /*
    if (inDialogue == true && cutsceneMode == true) {
    }
    */

    if (inDialogue == true && cutsceneMode == false) {
        switch (dialogueType) {
            case "normal":
                dialogueObjects = "dialogue_normal";

                dNameID = "dialogue_normal_charactername";
                dTextID = "dialogue_normal_maintext";
                dPortraitID = "dialogue_normal_image";
                dStarID = "dialogue_normal_continuestar";
                break;
            case "invis":
                dialogueObjects = "dialogue_invis";
                dTextID = "dialogue_invis_maintext";
                dStarID = "dialogue_invis_continuestar";
                break;
            case "narrator":
                //dialogueNarratorComponents[0].falpha = 1;
                dialogueObjects = "dialogue_narrator";
                dTextID = "dialogue_narrator_maintext";
                dStarID = "dialogue_narrator_continuestar";
                break;
            case "cinematic":
                //dialogueNarratorComponents[0].falpha = 0;
                dialogueObjects = "dialogue_cutscene";
                dTextID = "dialogue_cutscene_maintext";
                dStarID = "dialogue_cutscene_continuestar";
                break;
        }
    }
    if (dTextID != -1) objects[dTextID].text = "";

    if (inDialogue == true) {
        // Make / keep the dialogue objects visible
        groups[dialogueObjects].set("alpha", (c) => c.falpha);

        // Slide them in
        if (objects[dTextID].at == 0) {
            objects[dTextID].at = 0.5;
            groups[dialogueObjects].set("offset", (c) => [c.defoff[0], c.defoff[1] + 500]);

            addAnimator(function (t) {
                for (i in dialogueObjects) {
                    groups[dialogueObjects].set("offset", (c) => [c.defoff[0], c.defoff[1] + 500 - Math.min(t, 500)]);
                }
                if (t > 499) {
                    groups[dialogueObjects].set("at", 1);
                    return true;
                }
                return false;
            });
        }

        // They are there, visible
        if (objects[dTextID].at == 1) {
            if (currentDialogue != false) {
                // Update text
                if (currentDialogue[dialogueProgress].text == undefined) {
                    // Broken dialogue (undefined)
                    alert("This dialogue is broken!\nPlease report it to the devs!");
                    dialogueNext();
                }
                else if (typeof (currentDialogue[dialogueProgress].text) == "string") objects[dTextID].text = animatedText(currentDialogue[dialogueProgress].text);
                else objects[dTextID].text = animatedText(currentDialogue[dialogueProgress].text());

                // Change (character) name display if it exists
                if (dNameID != -1) {
                    if (currentDialogue[dialogueProgress].name != undefined) objects[dNameID].text = currentDialogue[dialogueProgress].name;
                    else objects[dNameID].text = "Bleu";
                }
                // Change portrait display if it exists
                if (dPortraitID != -1) {
                    dialogueEmotion = currentDialogue[dialogueProgress].emotion;
                    if (currentDialogue[dialogueProgress].portrait != undefined) {
                        objects[dPortraitID].image = currentDialogue[dialogueProgress].portrait;
                        if (dialogueEmotion != undefined) objects[dPortraitID].snip = getEmotion(dialogueEmotion);
                        else objects[dPortraitID].snip = getEmotion("neutral");
                    }
                    else {
                        // doesn't exist - use default
                        objects[dPortraitID].image = "Bleu_Portrait";
                        objects[dPortraitID].snip = getEmotion("neutral");
                    }
                }

                // appearance of star and action button
                if (currentDialogue[dialogueProgress + 1] != undefined) objects[dStarID].alpha = 1; // Star
                objects["actionButton"].alpha = 0;
            }
        }
    }
}

function dialogueNext() {
    dialogueProgress += 1;
    textProgress = -1;

    let c = "dialogue_" + dialogueType + "_maintext";

    if (dialogueProgress >= currentDialogue.length || currentDialogue.dialogueProgress == undefined) {
        // Dialogue end
        currentDialogue = false;
        dialogueEmotion = "neutral";
        dialogueProgress = 0;
        canMove = true;
        objects["actionButton"].alpha = 1;

        if (objects[c].at == 1 && (dialogueType == "normal" || dialogueType == "invis")) {
            objects[c].at = 0.4;
            addAnimator(function (t) {
                groups[dialogueObjects].set("offset", (c) => [c.offset[0], c.offset[1] + Math.min(t, 500)]);
                if (t > 499) {
                    groups[dialogueObjects].set("at", 0);
                    if (canMove == true) inDialogue = false;
                    return true;
                }
                return false;
            });
        }
        else {
            groups[dialogueObjects].set("alpha", 0);
            if (canMove == true) inDialogue = false;
        }
    }
    else {
        // it is not over yet
        dialogueScript();
    }
}

function dialogueBox() {
    let text;
    if (currentDialogue == undefined || currentDialogue[dialogueProgress] == undefined) return false;
    if (typeof (currentDialogue[dialogueProgress].text) == "string") text = currentDialogue[dialogueProgress].text;
    else text = currentDialogue[dialogueProgress].text();

    // always assumes text speed is 20
    if ((textProgress * 20) >= text.length) {
        //console.log("next text");
        dialogueNext(c);
    }
    else {
        //console.log("speed up text");
        textProgress = text.length * 20;
    }
}

function startFight(type = "default", enemies = "default") {
    defeatType = type;

    if (enemies != "default") {
        clearCurrentEnemies();
        currentEnemies = enemies;
    }

    for (let i in characters) {
        tempBuffRemoveAll(characters[i]);
    }

    if (type == "nogameover") playMusic("bgm/boss");
    else playMusic("bgm/fight");

    game.stats.fights++;
    setScene(scenes.fight());
}

function showItemPopup(itemName, amount = 1, found = true) {
    let item = items[itemName]();
    //console.log(itemName, item)

    groups["itempopup"].set("offset", (c) => [c.offset[0], c.defoff[1] - 800]);
    groups["itempopup"].set("alpha", 1);

    addAnimator(function (t) {
        if (t < 800) {
            groups["itempopup"].set("offset", (c) => [c.offset[0], c.defoff[1] - 800 + t]);
        }
        if (t > 799) {
            groups["itempopup"].set("offset", (c) => [c.offset[0], c.defoff[1]]);
        }
        if (t > 3799) {
            groups["itempopup"].set("offset", (c) => [c.offset[0], c.defoff[1] - (t - 3000)]);
        }
        if (t > 4599) {
            groups["itempopup"].set("alpha", 0);
            return true;
        }
        return false;
    });

    objects["itempopup_image"].image = "items/" + item.source;
    objects["itempopup_text1"].text = found ? "Item found" : "Item received";
    objects["itempopup_text2"].text = item.name + "  x" + amount;
    objects["itempopup_text3"].text = item.desc;
}

// Weather time thing
function setNightEffect(color, al = 0.5, instant = false, type = "none") {
    //console.log(nightEffect.alpha, color, al, type);
    let transitionDuration = 12000; // Roughly how long it lasts. 1000 = 1 sec
    let fogAlphaChangeIntensity = 10; // How much the opacity during fog changes. Higher number = less
    // Speed in preRender

    if (instant == true) {
        objects["nightEffect"].alpha = al;
        objects["nightEffect2"].alpha = 0;
        objects["nightEffect"].color = color;
        return true;
    }

    if (type == "fog") {
        if (currentFogAlpha >= 1) al += (currentFogAlpha - 1) / fogAlphaChangeIntensity;
        else al -= ((currentFogAlpha) / fogAlphaChangeIntensity) - (1 / fogAlphaChangeIntensity);
        if (al > 1) al = 1;
        if (al <= 0) al = 0.01;
        //nightEffect.alpha = al;
    }

    if (color != "none" && objects["nightEffect"].alpha == 0) {
        // changing from nothing
        addAnimator(function (t) {
            objects["nightEffect"].alpha = al * t / transitionDuration;

            if (t > transitionDuration) {
                objects["nightEffect"].alpha = al;
                return true;
            }
            return false;
        });
    }
    else if (color == "none" && objects["nightEffect"].alpha == 0.35) {
        // changing to nothing
        addAnimator(function (t) {
            objects["nightEffect"].alpha = al - t / transitionDuration;

            if (t > al * transitionDuration) {
                objects["nightEffect"].alpha = 0;
                return true;
            }
            return false;
        });
    }
    else if (objects["nightEffect"].color != color) {
        objects["nightEffect2"].color = objects["nightEffect"].color;
        objects["nightEffect"].color = color;
        objects["nightEffect2"].alpha = al;
        objects["nightEffect"].alpha = 0;

        // smooth transition
        addAnimator(function (t) {
            objects["nightEffect"].alpha = 0 + t / transitionDuration;
            objects["nightEffect2"].alpha = al - t / transitionDuration;

            if (t > al * transitionDuration) {
                objects["nightEffect2"].alpha = 0;
                objects["nightEffect"].alpha = al;
                return true;
            }
            return false;
        });
    }
}

function renderNPC(npc) {
    if (!getNPCCondition(npc)) return false;

    let tileX = npc.position[0];
    let tileY = npc.position[1];

    let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5) + npc.kofs[0] * (npc.kofs[2] / npc.walkingSpeed);
    let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5) + npc.kofs[1] * (npc.kofs[2] / npc.walkingSpeed);

    npc.kofs[2] = Math.max(npc.kofs[2] - delta / 166, 0);

    // circle
    if (settings.circles == "all" || settings.circles == "npcs") {
        wggjCTX.drawImage(images.npcCircle,
            ((zoom * scale) * (tileX - ofsX)) - ((zoom - 1) * scale * (width / 2)) - (zswm / 4), (zoom * scale) * (tileY - ofsY) - ((zoom - 1) * scale * 7) - (zswm / 4),
            zswm * 1.5, zswm * 1.5);
    }
    // the actual npc
    wggjCTX.drawImage(images[npc.source],
        32 * Math.floor(walkTime), 32 * npc.head, 32, 32,
        ((zoom * scale) * (tileX - ofsX)) - ((zoom - 1) * scale * (width / 2)),
        Math.ceil(zoom * scale) * (tileY - ofsY) - ((zoom - 1) * scale * 7),
        zswm, zswm);
    // dialogue image
    if (npc.talk == true && isValid(npc.dialogues)) {
        wggjCTX.drawImage(images.talk,
            ((zoom * scale) * (tileX + (map.worldmode ? 0.5 : 1) - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (tileY - (map.worldmode ? 0.5 : 1) - ofsY) - ((zoom - 1) * scale * 7),
            zswm, zswm);
    }
}

// Function used to figure out if anyone (player, NPCs, enemies) is on a tile
function isSomeoneOnTile(map, x, y, source = "") {
    // Set player to false if you want to ignore the player
    // This functions returns true if anyone is there - false if nobody is there
    // do !isSomeoneOnTile(...) to check if nobody is there

    if (game.position[0] == x && game.position[1] == y && source == "npc") {
        return true;
    }
    if (source != "player") {
        for (cot in activeEnemies) {
            if (activeEnemies[cot].position[0] == x && activeEnemies[cot].position[1] == y) {
                return true;
            }
        }
    }
    for (cot in activeNPCs) {
        if (activeNPCs[cot].position[0] == x && activeNPCs[cot].position[1] == y && getNPCCondition(activeNPCs[cot])) {
            return true;
        }
    }
    // Nobody there
    return false;
}

// Function to check if a tile is, well, walkable
// Define if a tile (e. g. water) is walkable in the sprites dict
function isWalkable(map, x, y, l = 1, source = "player", char = undefined) {
    // rounding cuz world mode
    x = Math.floor(x);
    y = Math.floor(y);

    if (map.map[y] && getTile(map, x, y, l)) { // Check if tile exists
        if (!getTileCondition(map, x, y, l)) return true;
        let tile = getTile(map, x, y, l);

        // block collision for non-player if there is a teleport or water
        if (source != "player") {
            if (isTeleport(map, x, y, l)) return false;
        }
        if (source == "npc" && tile.swim == true) return false;
        if (source == "enemy" && tile.swim == true && !char.canSwim) return false;

        // occupied, let's see how
        if (tile.occupied != undefined) { // Check if occupied exists
            if (source == "player" && typeof (tile.occupied) == "object") { // Config exists?
                if (direction == "up" && tile.occupied.includes("up")) {
                    return true;
                }
                else if (direction == "left" && tile.occupied.includes("left")) {
                    return true;
                }
                else if (direction == "down" && tile.occupied.includes("down")) {
                    return true;
                }
                else if (direction == "right" && tile.occupied.includes("right")) {
                    return true;
                }
                else { // Config denies passing
                    return false;
                }
            }
            return !tile.occupied // No config, is it occupied?
        }

        // Unoccupied, you can pass!
        return true;
    } else {
        if (l == 1) return false;
        return true;
    }
}

/*
function getEnemyOnTile(map, x, y) {
    for (let e of activeEnemies) {
        console.log(map, x, y, e);
        if (e.x == x && e.y == y && e.map == map) return e;
    }

    return false;
}
*/

function getTileAllLayersWalkable(map, x, y, source, char = undefined) {
    // checks if u can walk on all layers and no ppl there
    return isWalkable(map, x, y, 1, source, char)
        && isWalkable(map, x, y, 2, source, char)
        && isWalkable(map, x, y, 3, source, char)
        && !isSomeoneOnTile(map, x, y, source, char);
}

function tryTalk(xo, yo) {
    for (i in activeNPCs) {
        activeNPCs[i].talk = false;
        if (activeNPCs[i].position[0] == game.position[0] + xo && activeNPCs[i].position[1] == game.position[1] + yo && getNPCCondition(activeNPCs[i])) {
            objects["actionButton"].snip = [64, 32, 64, 32];
            activeNPCs[i].talk = true;
        }
    }
}

function tryLookAtChest(xo, yo) {
    if (map.chests == undefined) return false;
    let isLooking = false;
    let isOpened = false;

    xo = game.position[0] + xo;
    yo = game.position[1] + yo;

    for (let m in map.chests) {
        isOpened = game.mChests.includes(map.id + "," + xo + "," + yo + ",map") ||
            game.mChests.includes(map.id + "," + xo + "," + yo + ",mapbg2") ||
            game.mChests.includes(map.id + "," + xo + "," + yo + ",mapfg");

        if (map.chests[m][0] == xo && map.chests[m][1] == yo && !isOpened) {
            isLooking = true;
            break;
        }
    }

    if (isLooking) {
        objects["actionButton"].snip = [64, 32, 64, 32];
    }
    else objects["actionButton"].snip = [64, 96, 64, 32];
}

function drawTiles(layer) {
    let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5);
    let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5);

    map = maps[game.map];
    map.tiles = Object.assign({}, map.tiles, loadPacks(map));

    let ani = 0;
    let tileSrc = "";
    let tileSnip;

    let Ts = "map";
    if (layer == 2) Ts = "mapbg2";
    if (layer == 3) Ts = "mapfg";

    let px, py, pw, ph;

    for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
        ani = 0;
        tileSrc = "tiles/" + map.tiles.empty.sprite; // fallback
        tileSnip = [0, 0];

        if (map[Ts][y] && map[Ts][y][(x * 4) + 2] && map[Ts][y][(x * 4) + 2] != "-" && getTileCondition(map, x, y, layer)) {
            if (getTile(map, x, y, layer).ani != undefined) ani = Math.floor(getTile(map, x, y, layer).ani[0] * (animateTime / 2)) * (32 * getTile(map, x, y, layer).ani[1]);

            if (getTile(map, x, y, layer).set != undefined) tileSrc = "tilesets/" + getTile(map, x, y, layer).set;
            if (getTile(map, x, y, layer).snip != undefined) tileSnip = getTile(map, x, y, layer).snip;
            else tileSrc = "tiles/" + getTile(map, x, y, layer).sprite;
        }

        if (tileSrc == "tiles/" + map.tiles.empty.sprite && layer != 1) continue; // empty tiles only on mapbg 1
        if (!isValid(images[tileSrc])) tileSrc = "tiles/" + map.tiles.empty.sprite; // crash prevention 666

        // drawing
        px = Math.ceil((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width / 2));
        py = Math.ceil(zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7);

        pw = Math.ceil(zoom * scale - ((zoom - 1) * scale * (width / 2))) + 1;
        ph = Math.ceil(zoom * scale - ((zoom - 1) * scale * 7)) + 1;

        // chest? 
        if (map.chests != undefined && game.mChests.includes(map.id + "," + x + "," + y + "," + Ts)) ani += 32;

        // draw
        wggjCTX.drawImage(images[tileSrc],
            Math.floor(ani + tileSnip[0] * 32) + 0.005, Math.floor(tileSnip[1] * 32) + 0.005, 31.99, 31.99,
            px,
            py,
            pw,
            ph);
    }
}

function checkEnemyCollision(i) {
    if (game.position[0] == activeEnemies[i].position[0] &&
        game.position[1] == activeEnemies[i].position[1] &&
        activeEnemies[i].map == game.map && canMove == true && tokenRunning == false) {
        // Fight !!!
        canMove = false;
        tokenRunning = true;
        clearCurrentEnemies();

        // It automatically grabs the enemies that can appear in the fight
        // based on what is defined in the enemies dict of the map enemy
        // change in map_enemies.js
        if (activeEnemies[i].gen == undefined) {
            while (currentEnemies.length < activeEnemies[i].minSize) {
                for (let k = 0; k < 8; k++) {
                    for (let j in activeEnemies[i].enemies) {
                        if (currentEnemies.length >= activeEnemies[i].maxSize) break;
                        if (activeEnemies[i].enemies[j] > (Math.random() * 100)) {
                            createEnemy(j);
                        }
                    }
                }
            }
        }
        else {
            // already pre-generated
            //console.log("from pregen")
            for (let j in activeEnemies[i].gen) {
                createEnemy(activeEnemies[i].gen[j]);
            }
        }

        playSound("encounter");
        defeatType = "default";

        objects["areaTeleportFade"].color = "white";
        objects["areaTeleportFade"].alpha = 0;
        stopMusic();
        let previouszoom = zoom;
        setTimeout((enemyID) => {
            createImageAnimation(images.tokenattack, 10, 6, 4000, 1350, 50);
            addAnimator(function (t) {
                zoom = 1 + (t / 500);
                if (t > 1799 && t < 2500) {
                    objects["areaTeleportFade"].alpha = 0 + Math.min(((Math.min(t - 1800, 400)) / 400), 1);
                }
                if (t > 2499 && t < 2755) {
                    objects["areaTeleportFade"].color = "rgb(" + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + ")";
                }
                if (t > 2999) {
                    startFight();

                    activeEnemies.splice(enemyID, 1);

                    zoom = previouszoom;
                    tokenRunning = false;
                    return true;
                }
                return false;
            });
        }, 500);
    }
}

function getItemDatName(map, item) {
    return "" + map.id + item[0] + "." + item[1];
}

function checkItemCollision(map, i) {
    // item is x, y, what, amount, visible
    if (Math.floor(game.position[0]) == map.items[i][0] &&
        Math.floor(game.position[1]) == map.items[i][1] &&
        !game.mItems.includes(getItemDatName(map, map.items[i]))) {
        // Collided! gimme item
        let collected = addItem(map.items[i][2], map.items[i][3]);
        map.items[i][4] = !collected;
        if (collected) {
            game.mItems.push(getItemDatName(map, map.items[i]));
            questProgress("findItem", map.items[i][2]);
            showItemPopup(map.items[i][2], map.items[i][3], true);
        }
    }
}

function ActionsOnMove() {
    map.tiles = Object.assign({}, map.tiles, loadPacks(map));
    // Everything performed when the player moves successfully

    // Poison
    for (i = 0; i < game.chars.length; i++) {
        if (getPlayer(i + 1).effect[0] == "poison" && getPlayer(i + 1).HP > 0) {
            getPlayer(i + 1).HP -= 1;
            if (poisonBlack.alpha == 0) {
                poisonBlack.alpha = 1;
                poisonBlack.fill = "black";
                addAnimator(function (t) {
                    poisonBlack.fill = "rgb(" + (0 + (t / 3)) + "," + (0 + (t / 3)) + "," + (0 + (t / 3)) + ")";
                    if (t > 400) {
                        poisonBlack.fill = "black";
                        poisonBlack.alpha = 0.1;
                    }
                    if (t > 700) {
                        poisonBlack.alpha = 0;
                        return true;
                    }
                })
            }
        }
    }

    // Leader dead?
    if (game.characters[game.leader].HP < 1) {
        let highest = 0;
        let who = "";
        for (i in game.chars) {
            if (game.characters[game.chars[i]].HP > highest) {
                highest = game.characters[game.chars[i]].HP;
                who = game.characters[game.chars[i]].name.toLowerCase();
            }
        }
        if (highest == 0 || who == "") {
            setScene(scenes.title());
        }
        else {
            game.leader = who;
        }
    }

    trySpawnEnemy();

    for (i = 0; i < activeEnemies.length; i++) {
        checkEnemyCollision(i);
    }

    if (map.items != undefined) {
        for (i = 0; i < map.items.length; i++) {
            checkItemCollision(map, i);
        }
    }

    checkTileDialogue();
}

function startCutscene() {
    canMove = false;
    cutsceneMode = true;
    textProgress = -1;

    addAnimator(function (t) {
        cutsceneElements[0].anchor[1] = -1 + (t / 1000);
        cutsceneElements[1].anchor[1] = 1.85 - (t / 1000);

        if (t > 999) {
            cutsceneElements[0].anchor[1] = 0;
            cutsceneElements[1].anchor[1] = 0.85;

            return true;
        }
        return false;
    });
}

function endCutscene() {
    canMove = true;
    cutsceneMode = false;

    addAnimator(function (t) {
        cutsceneElements[0].anchor[1] = 0 - (t / 1000);
        cutsceneElements[1].anchor[1] = 0.85 + (t / 1000);

        if (t > 999) {
            cutsceneElements[0].anchor[1] = -1;
            cutsceneElements[1].anchor[1] = 1.85;

            return true;
        }
        return false;
    });
}

function renderWeather() {
    if (map.worldmode) {
        darkCloud.dead = false;
        darkCloud.speedAnchor = 0.01 * map.weatherStrength;
        darkCloud.speedAnchor2 = 0.01 * map.weatherStrength;
    }
    else {
        darkCloud.dead = true;
    }

    if (map.weather != undefined) {
        if (map.weather == "rain") {
            fallingRain.dead = false;
            fallingRain.speedAnchor = 0.3 * map.weatherStrength;
            fallingRain.speedAnchor2 = 0.05 * map.weatherStrength;
        }
        else {
            fallingRain.dead = true;
        }
        if (map.weather == "fog") {
            currentFogAlpha -= 0.0003 * delta; // Adjust how quickly the fog opacity changes here! Lower = slower
            if (currentFogAlpha < 0) currentFogAlpha = 2;
            fogCloud.dead = false;
            fogCloud.speedAnchor = 0.02 * map.weatherStrength;
        }
        else {
            fogCloud.dead = true;
        }
        if (map.weather == "dust") {
            dustParticles.dead = false;
            dustParticles.speedAnchor = 0.1 * map.weatherStrength;
        }
        else {
            dustParticles.dead = true;
        }
    }
}

function renderNightEffect() {
    let nightInstant = false;
    if (objects["nightEffect"].alpha == 0 && objects["nightEffect2"].alpha == 0 && objects["nightEffect"].color == "#FFFFFF" && objects["nightEffect2"].color == "#FFFFFF") {
        nightInstant = true;
        //console.log("instant");
    }
    if (map.weather == "none" || map.weather == undefined) {
        if (isNoon()) setNightEffect("#A88A84", 0.35, nightInstant);
        else if (isDusk()) setNightEffect("#FFA44F", 0.35, nightInstant);
        else if (isNight()) setNightEffect("#481365", 0.35, nightInstant);
        else if (isDawn()) setNightEffect("#d92200", 0.35, nightInstant);
    }
    if (map.weather == "rain") {
        if (isNoon()) setNightEffect("#6F7291", 0.6, nightInstant);
        else if (isDusk()) setNightEffect("#60435A", 0.6, nightInstant);
        else if (isNight()) setNightEffect("#120089", 0.6, nightInstant);
        else if (isDawn()) setNightEffect("#542984", 0.6, nightInstant);
    }
    if (map.weather == "fog" || map.weather == "dust") {
        if (isNoon()) setNightEffect("#b2b2b2", 0.5, nightInstant, "fog");
        else if (isDusk()) setNightEffect("#998572", 0.5, nightInstant, "fog");
        else if (isNight()) setNightEffect("#494949", 0.5, nightInstant, "fog");
        else if (isDawn()) setNightEffect("#777777", 0.5, nightInstant, "fog");
    }
}

function walkNPCs() {
    if (!canMove) return false;
    for (i = 0; i < activeNPCs.length; i++) {
        if (!getNPCCondition(activeNPCs[i])) continue;
        activeNPCs[i].movementTime += delta;
        let xo = 0;
        let yo = 0;
        let head;

        // movement 0: none, 1: random, 2: path
        if (activeNPCs[i].movement == 1 && activeNPCs[i].talk == false && activeNPCs[i].movementTime > activeNPCs[i].walkingInterval * 1000 && !activeNPCs[i].kofs[2]) {
            activeNPCs[i].movementTime = 0;
            // Random moving
            let randy = Math.random();
            if (randy > 0.75) { // Down
                xo = 0;
                yo = 1;
                head = 0;
            }
            else if (randy > 0.50) { // Left
                xo = -1;
                yo = 0;
                head = 1;
            }
            else if (randy > 0.25) { // Right
                xo = 1;
                yo = 0;
                head = 2;
            }
            else { // Up
                xo = 0;
                yo = -1;
                head = 3;
            }

        }

        let before = [activeNPCs[i].position[0], activeNPCs[i].position[1]];
        if (activeNPCs[i].movement == 2 && activeNPCs[i].talk == false && activeNPCs[i].movementTime > activeNPCs[i].walkingInterval * 1000) {
            activeNPCs[i].movementTime = 0;
            if (activeNPCs[i].pathProgress >= activeNPCs[i].path.length) {
                activeNPCs[i].pathProgress = 0;
            }

            if (activeNPCs[i].path[activeNPCs[i].pathProgress] == 0) {
                // Down
                yo = 1;
                head = 0;
            }
            if (activeNPCs[i].path[activeNPCs[i].pathProgress] == 1) {
                // Left
                xo = -1;
                head = 1;
            }
            if (activeNPCs[i].path[activeNPCs[i].pathProgress] == 2) {
                // Right
                xo = 1;
                head = 2;
            }
            if (activeNPCs[i].path[activeNPCs[i].pathProgress] == 3) {
                // Up
                yo = -1;
                head = 3;
            }
        }

        if (map.worldmode) {
            xo /= 2;
            yo /= 2;
        }

        // walk npc
        if (xo != 0 || yo != 0) {
            if (getTileAllLayersWalkable(map, activeNPCs[i].position[0] + xo, activeNPCs[i].position[1] + yo, "npc")) {
                activeNPCs[i].position[0] += xo;
                activeNPCs[i].position[1] += yo;
                activeNPCs[i].head = head;
                activeNPCs[i].kofs = [xo, yo, activeNPCs[i].walkingSpeed];

                if (activeNPCs[i].movement == 2 && (activeNPCs[i].position[0] != before[0] || activeNPCs[i].position[1] != before[1])) activeNPCs[i].pathProgress++;
            }
        }
    }
}

function walkEnemies() {
    if (!canMove) return false;
    let px = game.position[0];
    let py = game.position[1];

    for (i = 0; i < activeEnemies.length; i++) {
        activeEnemies[i].movementTime += delta;

        if (activeEnemies[i].movementTime > activeEnemies[i].walkingInterval * 1000 && !activeEnemies[i].kofs[2]) {
            activeEnemies[i].movementTime = 0;

            if (activeEnemies[i].spawntime > 899) {
                let x = activeEnemies[i].position[0];
                let y = activeEnemies[i].position[1];

                // semi - random moving
                let xo = 0;
                let yo = 0;
                let headTo;

                if (Math.random() > (y > py ? 0.8 : 0.2)) { // Down
                    xo += 0;
                    yo += 1;
                    headTo = 0;
                }
                else if (Math.random() > (y < py ? 0.8 : 0.3)) { // Up
                    xo += 0;
                    yo += -1;
                    headTo = 3;
                }

                if (Math.random() > (x > px ? 0.8 : 0.2)) { // Left
                    xo += 1;
                    yo += 0;
                    headTo = 2;
                }
                else if (Math.random() > (x < px ? 0.8 : 0.3)) { // Right
                    xo += -1;
                    yo += 0;
                    headTo = 1;
                }

                if (map.worldmode) {
                    xo /= 2;
                    yo /= 2;
                }

                // walk enemy
                if (xo != 0 || yo != 0) {
                    if (getTileAllLayersWalkable(map, activeEnemies[i].position[0] + xo, activeEnemies[i].position[1] + yo, "enemy", activeEnemies[i])) {
                        activeEnemies[i].position[0] += xo;
                        activeEnemies[i].position[1] += yo;
                        activeEnemies[i].head = headTo;
                        activeEnemies[i].kofs = [xo, yo, activeEnemies[i].walkingSpeed];
                    }
                }
            }

            // Respawn if on undefined, ocean or occupied
            let currentTile = getTile(map, Math.floor(activeEnemies[i].position[0]), Math.floor(activeEnemies[i].position[1]));
            if (map.map[Math.floor(activeEnemies[i].position[1])] != undefined) {
                if (currentTile == undefined) { // Undefined
                    activeEnemies[i].alpha = 0;
                    activeEnemies[i].position = [Math.floor(Math.random() * mapWidth), Math.floor(Math.random() * maps[game.map].map.length)];
                }
                else {
                    if (currentTile.occupied == true || (currentTile.swim && !activeEnemies[i].canSwim)) { // occupied or water
                        activeEnemies[i].alpha = 0;
                        activeEnemies[i].position = [Math.floor(Math.random() * mapWidth), Math.floor(Math.random() * maps[game.map].map.length)];
                    }
                    else {
                        activeEnemies[i].alpha = activeEnemies[i].alpha;
                    }
                }
            }
            else { // Undefined
                activeEnemies[i].alpha = 0;
                activeEnemies[i].position = [Math.floor(Math.random() * mapWidth), Math.floor(Math.random() * maps[game.map].map.length)];
            }

            // Don't put this in a for loop. lol
            checkEnemyCollision(i);
        }
    }
}

function reviveWalkPad() {
    walkPadIdle = 5;
    realphaWalkPad(1);
    pad = "";
}

function realphaWalkPad(alp = 1) {
    objects["walkPadUp"].alpha = alp;
    objects["walkPadRight"].alpha = alp;
    objects["walkPadDown"].alpha = alp;
    objects["walkPadLeft"].alpha = alp;
    objects["walkPadMiddle"].alpha = alp;
}

function useWalkPad(direction) {
    switch (direction) {
        case "up":
            objects["walkPadUp"].snip[0] = 0;
            pad = "";
            break;
        case "right":
            objects["walkPadRight"].snip[0] = 0;
            pad = "";
            break;
        case "down":
            objects["walkPadDown"].snip[0] = 0;
            pad = "";
            break;
        case "left":
            objects["walkPadLeft"].snip[0] = 0;
            pad = "";
            break;
    }
}

function downWalkPad(direction) {
    switch (direction) {
        case "up":
            objects["walkPadUp"].snip[0] = 32;
            reviveWalkPad();
            pad = "up";
            break;
        case "right":
            objects["walkPadRight"].snip[0] = 32;
            reviveWalkPad();
            pad = "right";
            break;
        case "down":
            objects["walkPadDown"].snip[0] = 32;
            reviveWalkPad();
            pad = "down";
            break;
        case "left":
            objects["walkPadLeft"].snip[0] = 32;
            reviveWalkPad();
            pad = "left";
            break;
    }
}

function clickActionButton() {
    // Look at how amazingly optimized this is now YAY (xo & yo, more like that's awesome yo)
    let xo = 0;
    let yo = 0;
    if (head == 0) yo = 1; // Down
    if (head == 1) xo = -1; // Left
    if (head == 2) xo = 1; // Right
    if (head == 3) yo = -1; // Up

    let xpos = game.position[0];
    let ypos = game.position[1];

    if (maps[game.map].worldmode == true) {
        xo /= 2;
        yo /= 2;
    }

    // start dialogue
    if (inDialogue == false) {
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));
        if (getTile(map, xpos + xo, ypos + yo) != undefined) {
            if (getTile(map, xpos + xo, ypos + yo).action != undefined) {
                getTile(map, xpos + xo, ypos + yo).action();
            }
        }
        if (getTile(map, xpos + xo, ypos + yo, 2) != undefined) {
            if (getTile(map, xpos + xo, ypos + yo, 2).action != undefined) {
                getTile(map, xpos + xo, ypos + yo, 2).action();
            }
        }
        for (i in activeNPCs) {
            if (activeNPCs[i].position[0] == xpos + xo && activeNPCs[i].position[1] == ypos + yo && isValid(activeNPCs[i].dialogues) && activeNPCs[i].talk && getNPCCondition(activeNPCs[i])) {
                startDialogue(activeNPCs[i].dialogues[1]);
            }
        }
    }

    // open chest
    // chests are saved as [x, y, item, amount]
    if (isValid(map.chests)) {
        for (let m in map.chests) {
            if (map.chests[m][0] == xpos + xo && map.chests[m][1] == ypos + yo) {
                // im looking at chest wow
                let chestName = "" + map.id + "," + map.chests[m][0] + "," + map.chests[m][1] + "," + map.chests[m][2];

                if (!game.mChests.includes(chestName)) {
                    // open me owo
                    let collected = addItem(map.chests[m][3], map.chests[m][4]);
                    if (collected) {
                        game.mChests.push(chestName);
                        questProgress("findItem", map.chests[m][3]);
                        showItemPopup(map.chests[m][3], map.chests[m][4], true);
                    }
                }
                else {
                    // is already open
                }

                objects["actionButton"].snip = [64, 96, 64, 32];
            }
        }
    }
}