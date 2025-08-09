var zoom = 1;
var zswm = 1;
var kofs = [0, 0, 0];
var walkTime = 0;
var mapWidth = 0;
var animateTime = 0;
var direction = "none";
var inDialogue = false;
var currentDialogue;
var dialogueProgress = 0;
var dialogueType;
var dialogueEmotion = "neutral";
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

function startDialogue(cd) {
    if (typeof (cd) == "string") cd = map.dialogues[cd];
    inDialogue = true;
    currentDialogue = cd.lines;
    dialogueType = cd.type;
    dialogueProgress = 0;
    dialogueEmotion = currentDialogue[dialogueProgress].portrait;
    canMove = false;
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

let autoSaveText = controls.label({
    anchor: [.025, .98], offset: [12, -12],
    fontSize: 16, text: "Game saved!", alpha: 0,
});

scenes.game = () => {
    let head = 0;
    let pad = "";

    var scale;

    var enemies = [];
    var activenpcs = [];

    var areaNameBox = [];

    var currentFogAlpha = 2;

    var cutsceneElements = [];

    var tokenRunning = false;

    let dialogueObjects = [];

    // Walk Pad
    let walkPad = [];
    let walkPadIdle = 5;
    let walkPadSize = Math.max(32, 64 * settings.walkPadSize);

    // Joy Stick
    let padActive = false;
    let padAlpha = 0;
    let padPosition = [0, 0];
    let padThumbPosition = [0, 0];

    walkPad.push(controls.image({ // Up
        anchor: [.1, .9], offset: [0, -walkPadSize * 3], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 0, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
            reviveWalkPad();
            pad = "up";
        },
        onClick(args) {
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Middle
        anchor: [.1, .9], offset: [0, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [64, 0, 32, 32],
        isPressed: false,
        onDown(args) {
            reviveWalkPad();
            pad = "";
        },
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.1, .9], offset: [0, -walkPadSize], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 64, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
            reviveWalkPad();
            pad = "down";
        },
        onClick(args) {
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Left
        anchor: [.1, .9], offset: [-walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 96, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
            reviveWalkPad();
            pad = "left";
        },
        onClick(args) {
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Right
        anchor: [.1, .9], offset: [walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 32, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
            reviveWalkPad();
            pad = "right";
        },
        onClick(args) {
            this.snip[0] = 0;
            pad = "";
        }
    }));

    function reviveWalkPad() {
        walkPadIdle = 5;
        for (wp in walkPad) {
            walkPad[wp].alpha = 1;
        }
    }


    let nightEffect = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0, fill: "white", clickStop: false
    });
    let nightEffect2 = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0, fill: "white", clickStop: false
    });

    // This is for the inventory button. In the TOP RIGHT.
    let inventoryButton = controls.button({
        anchor: [1, 0], offset: [-128, 0], sizeOffset: [128, 128],
        alpha: 0,
        text: "",
        onClick(args) {
            if (canMove == true) {
                playSound("buttonClickSound");
                fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
            }
        }
    });
    let inventoryImage = controls.image({
        anchor: [1, 0], offset: [-128, 0], sizeOffset: [128, 128],
        alpha: 1,
        source: "inventory", clickstop: false
    });

    let poisonBlack = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0,
        fill: "black",
    });

    let dialogueNormalComponents = [];
    let dialogueInvisComponents = [];
    let dialogueNarratorComponents = [];
    let dialogueCutsceneComponents = [];

    function dialogueNext() {
        dialogueProgress += 1;
        textProgress = -1;

        if (dialogueProgress >= currentDialogue.length || currentDialogue[dialogueProgress] == undefined) {
            // Dialogue end
            currentDialogue = false;
            dialogueEmotion = "neutral";
            dialogueProgress = 0;
            canMove = true;
            actionButton.alpha = 1;

            if (dialogueObjects[0].at == 1 && (dialogueType == "normal" || dialogueType == "invis")) {
                dialogueObjects[0].at = 0.4;
                addAnimator(function (t) {
                    for (i in dialogueObjects) {
                        dialogueObjects[i].offset[1] = dialogueObjects[i].defoff[1] + Math.min(t, 500);
                    }
                    if (t > 499) {
                        for (i in dialogueObjects) {
                            dialogueObjects[i].at = 0;
                        }
                        if (canMove == true) inDialogue = false;
                        return true;
                    }
                    return false;
                });
            }
            else {
                for (i in dialogueObjects) {
                    dialogueObjects[i].alpha = 0;
                }
                if (canMove == true) inDialogue = false;
            }
        } // Continue dialogue
        else if (currentDialogue[dialogueProgress].script != undefined && currentDialogue[dialogueProgress].script != false) {
            if (typeof (currentDialogue[dialogueProgress].script) == "string") eval(currentDialogue[dialogueProgress].script());
            else currentDialogue[dialogueProgress].script();
        }
    }

    function dialogueBox() {
        let text;
        if (currentDialogue[dialogueProgress] == undefined) return false;
        if (typeof (currentDialogue[dialogueProgress].text) == "string") text = currentDialogue[dialogueProgress].text;
        else text = currentDialogue[dialogueProgress].text();

        if ((textProgress * 20) >= text.length) {
            dialogueNext();
        }
        else {
            textProgress = text.length * 20;
        }
    }

    dialogueNormalComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -200], defoff: [0, -200], sizeAnchor: [1, 0], sizeOffset: [0, 200], at: 0,
        clickthrough: false,
        fill: colors.bottomcolor,
        onClick(args) {
            if (this.alpha == 1) {
                dialogueBox();
            }
        },
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -200], defoff: [0, -200], sizeOffset: [136, 136], at: 0,
        clickthrough: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -54], defoff: [0, -54], sizeOffset: [128, 32], at: 0,
        clickthrough: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.label({
        anchor: [0.01, 1.01], offset: [64, -34], defoff: [64, -34], at: 0,
        align: "center", fontSize: 20, fill: "black",
        text: "Bleu",
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [164, -200], defoff: [164, -200], sizeOffset: [0, 178], sizeAnchor: [0.8, 0], at: 0,
        clickthrough: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.01, 1.01], offset: [0, -192], defoff: [0, -192], sizeOffset: [128, 128], snip: [0, 0, 64, 64], at: 0,
        source: "Portraits_Bleu",
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.label({ // 6
        anchor: [0, 1], offset: [196, -168], defoff: [196, -168], at: 0,
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.81, 1], sizeOffset: [64, 64], offset: [100, -96], defoff: [100, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0,
    }));

    dialogueInvisComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -200], defoff: [0, -200], sizeAnchor: [1, 0], sizeOffset: [0, 200], at: 0,
        clickthrough: false,
        fill: colors.bottomcolor,
        onClick(args) {
            if (this.alpha == 1) {
                dialogueBox();
            }
        },
        alpha: 0, falpha: 1,
    }));
    dialogueInvisComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -200], defoff: [0, -200], sizeOffset: [0, 180], sizeAnchor: [0.98, 0], at: 0,
        clickthrough: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueInvisComponents.push(controls.label({ // 2
        anchor: [0.02, 1], offset: [0, -168], defoff: [0, -168], at: 0,
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0, falpha: 1,
    }));
    dialogueInvisComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0,
    }));


    dialogueNarratorComponents.push(controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        clickthrough: false,
        source: "narratorbg",
        onClick(args) {
            if (this.alpha == 1 || dialogueType == "cinematic") {
                dialogueBox();
            }
        },
        alpha: 0, falpha: 1,
    }));
    dialogueNarratorComponents.push(controls.label({ // 1
        anchor: [0.5, 0.5],
        align: "center", fontSize: 16, fill: "white",
        text: "...",
        alpha: 0, falpha: 1,
    }));
    dialogueNarratorComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0,
    }));


    dialogueCutsceneComponents.push(controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        clickthrough: false,
        source: "narratorbg",
        onClick(args) {
            if (this.alpha == 0.01) {
                dialogueBox();
            }
        },
        alpha: 0, falpha: 0.01,
    }));
    dialogueCutsceneComponents.push(controls.label({ // 1
        anchor: [0.01, 1], offset: [0, -96], defoff: [0, -96], at: 0,
        align: "left", fontSize: 16, fill: "white",
        text: "...",
        alpha: 0, falpha: 1,
    }));
    dialogueCutsceneComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0,
    }));

    // end of the dialogue stuff. lol.
    let actionButton = controls.image({
        anchor: [1, 0.8], sizeOffset: [256, 128], offset: [-312, 0],
        alpha: 1,
        source: "mapbuttons", snip: [64, 96, 64, 32],
        isPressed: false,
        onDown(args) {
            this.snip[1] = 64;
        },
        onClick(args) {
            this.snip[1] = 96;

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

            if (inDialogue == false) {
                let map = maps[game.map];
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
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == xpos + xo && activenpcs[i].position[1] == ypos + yo) {
                        startDialogue(activenpcs[i].dialogues[1]);
                    }
                }

            }
        }
    });

    /*areaNameBox.push(controls.rect({
        anchor: [0.3, 0.2], sizeAnchor: [0.4, 0.2],
        fill: "purple", alpha: 0
    }))
    areaNameBox.push(controls.rect({
        anchor: [0.3, 0.2], sizeAnchor: [0.4, 0.2], sizeOffset: [-16, -16], offset: [8, 8],
        fill: "lightblue", alpha: 0
    }))*/
    areaNameBox.push(controls.image({
        anchor: [0.2, 0], sizeAnchor: [0.6, 0.4],
        source: "hangingsign", alpha: 0
    }))
    areaNameBox.push(controls.label({
        anchor: [0.5, 0.25],
        align: "center", fontSize: 32, fill: "black",
        text: "AREA UNDEFINED", alpha: 0,
    }))

    instantEffect = true;

    let areaTeleportFade = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "black", alpha: 0
    })

    // Weather time thing
    function setNightEffect(color, al = 0.5, type = "none") {
        //console.log(nightEffect.alpha, color, al, type, instantEffect);
        let transitionDuration = 15000; // Roughly how long it lasts. 1000 = 1 sec
        let fogAlphaChangeIntensity = 10; // How much the opacity during fog changes. Higher number = less
        // Speed in preRender

        if (instantEffect == true) {
            instantEffect = false;
            nightEffect.alpha = al;
            nightEffect2.alpha = 0;
            nightEffect.fill = color;
            return true;
        }

        if (type == "fog") {
            if (currentFogAlpha >= 1) al += (currentFogAlpha - 1) / fogAlphaChangeIntensity;
            else al -= ((currentFogAlpha) / fogAlphaChangeIntensity) - (1 / fogAlphaChangeIntensity);
            if (al > 1) al = 1;
            if (al <= 0) al = 0.01;
            //nightEffect.alpha = al;
        }

        if (color == "none" && nightEffect.alpha == 0.35) {
            addAnimator(function (t) {
                nightEffect.alpha = al - t / transitionDuration;

                if (t > (al * transitionDuration) - 1) {
                    nightEffect.alpha = 0;
                    return true;
                }
                return false;
            });
        }
        else if (nightEffect.fill != color) {
            nightEffect2.fill = nightEffect.fill;
            nightEffect.fill = color;
            nightEffect2.alpha = al;
            nightEffect.alpha = 0;

            addAnimator(function (t) {
                nightEffect.alpha = 0 + t / transitionDuration;
                nightEffect2.alpha = al - t / transitionDuration;

                if (t > (al * transitionDuration) - 1) {
                    nightEffect2.alpha = 0;
                    nightEffect.alpha = al;
                    return true;
                }
                return false;
            });
        }
    }

    function renderNPC(ctx, npc) {
        let tileX = npc.position[0];
        let tileY = npc.position[1];

        let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5) + npc.kofs[0] * (npc.kofs[2] / npc.walkingSpeed);
        let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5) + npc.kofs[1] * (npc.kofs[2] / npc.walkingSpeed);

        npc.kofs[2] = Math.max(npc.kofs[2] - delta / 166, 0);

        ctx.drawImage(images[npc.source],
            32 * Math.floor(walkTime), 32 * npc.head, 32, 32,
            ((zoom * scale) * (tileX - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (tileY - ofsY) - ((zoom - 1) * scale * 7),
            zswm, zswm)
        if (npc.talk == true) {
            ctx.drawImage(images.talk,
                ((zoom * scale) * (tileX + (map.worldmode ? 0.5 : 1) - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (tileY - (map.worldmode ? 0.5 : 1) - ofsY) - ((zoom - 1) * scale * 7),
                zswm, zswm)
        }
    }

    // Function used to figure out if anyone (player, NPCs, enemies) is on a tile
    function creaturesOnTile(map, x, y, player = true) {
        // Set player to false if you want to ignore the player
        // This functions returns true if anyone is there - false if nobody is there
        // do !creaturesOnTile(...) to check if nobody is there

        if (game.position[0] == x && game.position[1] == y && player == true) {
            return true;
        }
        for (cot in enemies) {
            if (enemies[cot].position[0] == x && enemies[cot].position[1] == y) {
                return true;
            }
        }
        for (cot in activenpcs) {
            if (activenpcs[cot].position[0] == x && activenpcs[cot].position[1] == y) {
                return true;
            }
        }
        // Nobody there
        return false;
    }

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
    function isWalkable(map, x, y, l = 1) {
        if (map.map[Math.round(y)] && getTile(map, x, y, l)) { // Check if tile exists
            for (i = 0; i < activenpcs.length; i++) {
                if (activenpcs[i].position[0] == x && activenpcs[i].position[1] == y) return false;
            }

            x = Math.floor(x);
            y = Math.floor(y);

            if (getTile(map, x, y, l).occupied != undefined) { // Check if occupied exists
                if (typeof (getTile(map, x, y, l).occupied) == "object") { // Config exists?
                    if (direction == "up" && getTile(map, x, y, l).occupied.includes("up")) {
                        return true;
                    }
                    else if (direction == "left" && getTile(map, x, y, l).occupied.includes("left")) {
                        return true;
                    }
                    else if (direction == "down" && getTile(map, x, y, l).occupied.includes("down")) {
                        return true;
                    }
                    else if (direction == "right" && getTile(map, x, y, l).occupied.includes("right")) {
                        return true;
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

    function isTeleport(map, x, y, l = 1) {
        // Is it a teleporter?

        let lay = ["map", "map", "mapbg2", "mapfg"][l];
        if (map[lay][y] && map[lay][y][(x * 3) + 2]) { // Check if tile exists
            if (getTile(map, x, y, l) != undefined) {
                if (getTile(map, x, y, l).teleport != undefined) { // Check if teleport exists
                    //It exists! A miracle
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
        if (isTeleport(map, x, y, l)) {
            let themap = getTile(map, x, y, l);
            let previousmap = game.map;
            // Set map and pos
            let nmapname = maps[themap.teleport[0]].name;

            canMove = false;
            playSound("teleport");
            fadeOut(1000 / 3, true);

            setTimeout(() => {
                if (nmapname != undefined) { // The box stuff. Only if the map has a name
                    areaNameBox[1].text = nmapname;
                    for (i in areaNameBox) {
                        areaNameBox[i].alpha = 1;
                        areaNameBox[i].offset = [0, 0];
                    }

                    setTimeout(() => { // Box disappear
                        addAnimator(function (t) {
                            for (i in areaNameBox) {
                                //areaNameBox[i].alpha = 1 - (t / 500);
                                areaNameBox[i].offset[1] = t * (-0.5);
                            }
                            if (t > 999) {
                                for (i in areaNameBox) {
                                    areaNameBox[i].alpha = 0;
                                }
                                return true;
                            }
                            return false;
                        });
                    }, 800);

                }

                enemies = [];
                mapWidth = 0;
                game.map = themap.teleport[0];
                game.map.tiles = Object.assign({}, game.map.tiles, loadPacks());
                loadNPCs();
                loadAreaMusic(previousmap);
                instantEffect = true;

                game.stats.tp++;

                game.position[0] = themap.teleport[1];
                game.position[1] = themap.teleport[2];

                fadeIn(1000 / 3, true);
                canMove = true;
            }, 750);
        }
    }

    function tryTalk(xo, yo) {
        for (i in activenpcs) {
            activenpcs[i].talk = false;
            if (activenpcs[i].position[0] == game.position[0] + xo && activenpcs[i].position[1] == game.position[1] + yo) {
                actionButton.snip = [64, 32, 64, 32];
                activenpcs[i].talk = true;
            }
        }
    }

    function drawTiles(ctx, layer) {
        let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5);
        let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5);

        map = maps[game.map];
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));

        let ani = 0;

        let Ts = "map";
        if (layer == 2) Ts = "mapbg2";
        if (layer == 3) Ts = "mapfg";

        for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
            if (map[Ts][y] && map[Ts][y][(x * 4) + 2] && map[Ts][y][(x * 4) + 2] != "-") {
                if (getTile(map, x, y, layer).ani != undefined) ani = Math.floor(getTile(map, x, y, layer).ani[0] * (animateTime / 2)) * (32 * getTile(map, x, y, layer).ani[1]);
                else ani = 0;
                if (getTile(map, x, y, layer).set != undefined) ctx.drawImage(images["tilesets/" + getTile(map, x, y, layer).set], ani + getTile(map, x, y, layer).snip[0] * 32, getTile(map, x, y, layer).snip[1] * 32, 32, 32,
                    ((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                else ctx.drawImage(images["tiles/" + getTile(map, x, y, layer).sprite],
                    ((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
            } else if (map.tiles.empty && layer == 1) {
                ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                    (zoom * scale) * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
            }
        }
    }

    function checkEnemyCollision(i) {
        if (game.position[0] == enemies[i].position[0] &&
            game.position[1] == enemies[i].position[1] &&
            enemies[i].map == game.map && canMove == true && tokenRunning == false) {
            // Fight !!!
            canMove = false;
            tokenRunning = true;
            clearCurrentEnemies();

            // It automatically grabs the enemies that can appear in the fight
            // based on what is defined in the enemies dict of the map enemy
            // change in map_enemies.js
            if (enemies[i].gen == undefined) {
                while (currentEnemies.length < enemies[i].minSize) {
                    for (let k = 0; k < 8; k++) {
                        for (let j in enemies[i].enemies) {
                            if (currentEnemies.length >= enemies[i].maxSize) break;
                            if (enemies[i].enemies[j] > (Math.random() * 100)) {
                                createEnemy(j);
                            }
                        }
                    }
                }
            }
            else {
                // already pre-generated
                console.log("from pregen")
                for (let j in enemies[i].gen){
                    createEnemy(enemies[i].gen[j]);
                }
            }

            playSound("encounter");
            defeatType = "default";

            areaTeleportFade.fill = "white";
            areaTeleportFade.alpha = 0;
            stopMusic();
            let previouszoom = zoom;
            setTimeout(() => {
                createImageAnimation(images.tokenattack, 10, 6, 4000, 1350, 50);
                addAnimator(function (t) {
                    zoom = 1 + (t / 500);
                    if (t > 1799 && t < 2500) {
                        areaTeleportFade.alpha = 0 + Math.min(((Math.min(t - 1800, 400)) / 400), 1);
                    }
                    if (t > 2499 && t < 2755) {
                        areaTeleportFade.fill = "rgb(" + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + ")";
                    }
                    if (t > 2999) {
                        startFight();

                        zoom = previouszoom;
                        tokenRunning = false;
                        return true;
                    }
                    return false;
                });
            }, 500);
        }
    }

    function checkItemCollision(map, i) {
        if (Math.floor(game.position[0]) == map.items[i][0] &&
            Math.floor(game.position[1]) == map.items[i][1]) {
            // Collision!

            map.items[i][4] = !addItem(map.items[i][2], map.items[i][3]);
        }
    }

    function ActionsOnMove() {
        let map = maps[game.map];
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
            for (i in game.characters) {
                if (game.characters[i].HP > highest) {
                    highest = game.characters[i].HP;
                    who = game.characters[i].name.toLowerCase();
                }
            }
            if (highest == 0 || who == "") {
                setScene(scenes.title());
            }
            else {
                game.leader = who;
            }
        }

        checkEnemySpawnAttempt();

        for (i = 0; i < enemies.length; i++) {
            checkEnemyCollision(i);
        }

        if (map.items != undefined) {
            for (i = 0; i < map.items.length; i++) {
                checkItemCollision(map, i);
            }
        }

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

    function checkEnemySpawnAttempt() {
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
                if (map.spawns[possibleSpawns] > Math.random() * 100) {
                    spawnMapEnemy(possibleSpawns);
                }
            }
        }
    }

    function spawnMapEnemy(possibleSpawns) {
        if (mapenemies[possibleSpawns] != undefined) {
            if (mapenemies[possibleSpawns]().time == "day" && !isDay()) return false;
            if (mapenemies[possibleSpawns]().time == "dawn" && !isDawn()) return false;
            if (mapenemies[possibleSpawns]().time == "noon" && !isNoon()) return false;
            if (mapenemies[possibleSpawns]().time == "dusk" && !isDusk()) return false;
            if (mapenemies[possibleSpawns]().time == "night" && !isNight()) return false;
        }
        else return false;

        if (mapWidth == 0) {
            for (i = 0; i < maps[game.map].map.length; i++) {
                if (maps[game.map].map[i].length > mapWidth) mapWidth = maps[game.map].map[i].length;
            }
        }

        // generate map enemy
        let posX = Math.floor(Math.random() * mapWidth);
        let posY = Math.floor(Math.random() * maps[game.map].map.length);

        if (posX == game.position[0]) return false;
        if (posY == game.position[1]) return false;
        if (getTile(map, posX, posY).occupied == true) return false;

        enemies.push(mapenemies[possibleSpawns]({
            position: [posX, posY], map: game.map,
        }));
        let latest = enemies[enemies.length - 1];

        // sprite gen
        if (latest.source == "gen") {
            let genSource = "";
            latest.gen = [];

            // grab the enemies in this map enemy, so we can then pick a random one
            while (latest.gen.length < latest.minSize) {
                for (let k = 0; k < 8; k++) {
                    for (let j in latest.enemies) {
                        if (currentEnemies.length >= latest.maxSize) break;
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
    }

    function loadNPCs() {
        activenpcs = [];
        for (i in npcs) {
            if (npcs[i].alpha != 0 && npcs[i].map == game.map) {
                activenpcs.push(npcs[i]);
            }
        }
        if (maps[game.map].npcs != undefined) for (i in maps[game.map].npcs) {
            if (maps[game.map].npcs[i].alpha != 0) {
                activenpcs.push(maps[game.map].npcs[i]);
            }
        }
        for (i in activenpcs) {
            for (j in npcs.default) {
                if (activenpcs[i][j] == undefined) activenpcs[i][j] = npcs.default[j];
            }
        }
    }

    cutsceneElements.push(controls.rect({
        anchor: [0, -1], sizeAnchor: [1, 0.15],
        fill: "black",
        alpha: 1,
        clickthrough: true,
    }));
    cutsceneElements.push(controls.rect({
        anchor: [0, 1.85], sizeAnchor: [1, 0.15],
        fill: "black",
        alpha: 1,
        clickthrough: true,
    }));

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

    let fallingRain = Particles({
        anchor: [-0.2, -0.2], spreadAnchor: [1, 0], sizeOffset: [64, 64],
        type: "img", source: "rain",
        direction: 0, speedAnchor: 0.3,
        direction2: 2, speedAnchor2: 0.05,
        movable: true, movable2: true, lifespan: 1.5, alpha: 1, amount: 60, spawnTime: 0.03, alphaChange: 0.2,
        dead: true, repeatMode: true,
    })
    let fogCloud = Particles({
        anchor: [-0.2, 0], spreadAnchor: [0, 1], sizeOffset: [96, 48], sizeOffsetVary: [2, 2], quadraticVary: true,
        type: "img", source: ["fog", "fog2"],
        direction: 2, speedAnchor: 0.02,
        movable: true, lifespan: 20, alpha: 0.75, amount: 30, spawnTime: 0.8,
        dead: true, repeatMode: true,
    })
    let darkCloud = Particles({
        anchor: [1.2, -0.8], spreadAnchor: [0.2, 1.5], sizeOffset: [128, 64], sizeOffsetVary: [2, 2], quadraticVary: true,
        type: "img", source: ["cloudshadow1", "cloudshadow2", "cloudshadow3"],
        direction: 0, speedAnchor: 0.015,
        direction2: 1, speedAnchor2: 0.015,
        movable: true, movable2: true, lifespan: 45, alpha: 0.75, amount: 25, spawnTime: 3,
        dead: true, repeatMode: true,
    })
    let dustParticles = Particles({
        anchor: [-0.2, 0], spreadAnchor: [0, 1], sizeOffset: [2, 2], sizeOffsetVary: [2, 2], quadraticVary: true,
        type: "rect", fill: "yellow",
        direction: 2, speedAnchor: 0.2,
        direction2: 3, speedAnchor2: 0.05, moveRandom2: 1,
        movable: true, movable2: true, lifespan: 5, alpha: 1, amount: 150, spawnTime: 0.02,
        dead: true, repeatMode: true,
    })


    function loadAreaMusic(prev = "none") {
        let map = maps[game.map];
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));
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

    loadNPCs();
    loadAreaMusic();

    /*let fallingLeaves = Particles({
        anchor: [0, -0.1], spreadAnchor: [1, 0], sizeOffset: [64, 64], spreadOffset: [0, -256], sizeOffsetVary: [1.5, 1.5], quadraticVary: true,
        type: "img", source: "items/brickyleaf",
        direction: 0, speedAnchor: 0.04,
        direction2: 1, speedOffset2: 10, moveRandom2: 5,
        offsetChange: [3, 3], repeatMode: true,
        movable: true, movable2: true, lifespan: 80, alpha: 1, amount: 8, spawnTime: 1, alphaChange: 0.04,
        onParticleClick(n) {
            this.p[n][3][0] *= 1.2;
            this.p[n][3][1] *= 1.2;
            this.p[n][4] -= 3;
            this.p[n][5] = 1;
        }
    })*/

    let backButton = controls.button({
        anchor: [0.01, 0.925], sizeAnchor: [0.05, 0.045],
        text: "<",
        onClick(args) {
            if (this.alpha == 1) {
                setScene(scenes.mapmaker());
            }
        },
        alpha: (isMapTestingMode ? 1 : 0),
    });

    let tTime = 1000 / 3;
    if (previousScene == "main" || previousScene == "title" || previousScene == undefined) tTime = 1500; // Not inventory or fight
    fadeIn(tTime, true);

    return {
        preRender(ctx, delta) {
            scale = window.innerHeight / 16;
            let map = maps[game.map];
            map.tiles = Object.assign({}, map.tiles, loadPacks(map));

            // Auto Save & Auto Save Text
            if (autoSaveTime > 14999) {
                // Animation
                addAnimator(function (t) {
                    autoSaveText.alpha = 1 - (1 / 2500) * t;
                    if (t > 2500) {
                        autoSaveTime = 0;
                        autoSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
                // Saving
                saveGame(true);
                autoSaveTime = -3; // To prevent saving multiple times!
            }

            // Weather
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


            if (map.weather == "none" || map.weather == undefined) {
                if (isNoon()) setNightEffect("#d92200", 0);
                else if (isDusk()) setNightEffect("#ff8c1a", 0.35);
                else if (isNight()) setNightEffect("#481365", 0.35);
                else if (isDawn()) setNightEffect("#d92200", 0.35);
            }
            if (map.weather == "rain") {
                if (isNoon()) setNightEffect("#cccccc", 0.4);
                else if (isDusk()) setNightEffect("#bf854c", 0.4);
                else if (isNight()) setNightEffect("#37293f", 0.4);
                else if (isDawn()) setNightEffect("#894337", 0.4);
            }
            if (map.weather == "fog" || map.weather == "dust") {
                if (isNoon()) setNightEffect("#b2b2b2", 0.5, "fog");
                else if (isDusk()) setNightEffect("#998572", 0.5, "fog");
                else if (isNight()) setNightEffect("#221c26", 0.5, "fog");
                else if (isDawn()) setNightEffect("#4c4241", 0.5, "fog");
            }

            // Check if it's time for enemies to move
            if (canMove == true) {
                for (i = 0; i < activenpcs.length; i++) {
                    activenpcs[i].movementTime += delta;
                    if (activenpcs[i].movement == 1 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingInterval * 1000 && !activenpcs[i].kofs[2]) {
                        activenpcs[i].movementTime = 0;
                        // Random moving
                        let xo;
                        let yo;
                        let head;

                        if (Math.random() > 0.40) { // Down
                            xo = 0;
                            yo = 1;
                            head = 0;
                        }
                        else if (Math.random() > 0.40) { // Left
                            xo = -1;
                            yo = 0;
                            head = 1;
                        }
                        else if (Math.random() > 0.40) { // Right
                            xo = 1;
                            yo = 0;
                            head = 2;
                        }
                        else if (Math.random() > 0.40) { // Up
                            xo = 0;
                            yo = -1;
                            head = 3;
                        }

                        if (xo != undefined) {
                            if (map.map[activenpcs[i].position[1] + yo] != undefined) {
                                if (map.map[activenpcs[i].position[1] + yo][activenpcs[i].position[0] + xo] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).occupied != true
                                            && getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).teleport == undefined) {
                                            if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 2) == undefined || (map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 2).occupied != true) {
                                                if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 3) == undefined || (map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 3).occupied != true) {
                                                    if (!creaturesOnTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo)) {
                                                        // "all layers" for getTile would be nice - remind me to add it later
                                                        // edit: still not a thing huh? this nested if here sucks
                                                        activenpcs[i].position[0] += xo;
                                                        activenpcs[i].position[1] += yo;
                                                        activenpcs[i].head = head;
                                                        activenpcs[i].kofs = [xo, yo, activenpcs[i].walkingSpeed];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }

                    if (activenpcs[i].movement == 2 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingInterval * 1000) {
                        activenpcs[i].movementTime = 0;
                        if (activenpcs[i].pathProgress > activenpcs[i].path.length) {
                            activenpcs[i].pathProgress = 0;
                        }

                        // Look at how amazingly optimized this is now YAY (xo & yo, more like that's awesome yo)
                        let xo = 0;
                        let yo = 0;
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 0) yo = 1; // Down
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 1) xo = -1; // Left
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 2) xo = 1; // Right
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 3) yo = -1; // Up


                        if (map.map[activenpcs[i].position[1]] != undefined) {
                            if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] + xo] != undefined) {
                                if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).occupied != true
                                        && getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).teleport == undefined) {
                                        if (!creaturesOnTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) || xo == 0 && yo == 0) {
                                            activenpcs[i].position[0] += xo;
                                            activenpcs[i].position[1] += yo;
                                            activenpcs[i].pathProgress += 1; // only increase it if something happens. lol
                                            if (activenpcs[i].path[activenpcs[i].pathProgress] != undefined) activenpcs[i].head = activenpcs[i].path[activenpcs[i].pathProgress];
                                            else activenpcs[i].head = activenpcs[i].path[activenpcs[i].pathProgress - 1];
                                            activenpcs[i].kofs = [xo, yo, activenpcs[i].walkingSpeed];
                                        }
                                    }
                                    else {
                                        activenpcs[i].pathProgress += 1; // or when you run against smth
                                    }
                                }
                            }
                        }

                    }
                }
                for (i = 0; i < enemies.length; i++) {
                    enemies[i].movementTime += delta;
                    if (enemies[i].movementTime > enemies[i].walkingInterval * 1000 && !enemies[i].kofs[2]) {
                        enemies[i].movementTime = 0;

                        if (enemies[i].spawntime > 899) {
                            // Random moving
                            let xo;
                            let yo;
                            let headTo;
                            if (Math.random() > 0.40) { // Down
                                xo = 0;
                                yo = 1;
                                headTo = 0;
                            }
                            if (Math.random() > 0.40) { // Left
                                xo = -1;
                                yo = 0;
                                headTo = 1;
                            }
                            if (Math.random() > 0.40) { // Right
                                xo = 1;
                                yo = 0;
                                headTo = 2;
                            }
                            if (Math.random() > 0.40) { // Up
                                xo = 0;
                                yo = -1;
                                headTo = 3;
                            }
                            if (map.map[enemies[i].position[1] + xo] != undefined && xo != undefined) {
                                if (map.map[enemies[i].position[1] + xo][enemies[i].position[0] + yo] != undefined) {
                                    if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo) != undefined) {
                                        if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo).occupied != true
                                            && getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo).teleport == undefined) {
                                            if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 2) == undefined || getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 2).occupied != true) {
                                                if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 3) == undefined || getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 3).occupied != true) {
                                                    if (!creaturesOnTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, false)) {
                                                        enemies[i].position[0] += xo;
                                                        enemies[i].position[1] += yo;
                                                        enemies[i].head = headTo;
                                                        enemies[i].kofs = [xo, yo, enemies[i].walkingSpeed];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // Respawn if on ocean or occupied
                        if (map.map[enemies[i].position[1]] != undefined) {
                            if (getTile(map, enemies[i].position[0], enemies[i].position[1]) == undefined) { // Undefined
                                enemies[i].alpha = 0;
                                enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                            }
                            else {
                                if (getTile(map, enemies[i].position[0], enemies[i].position[1]).occupied == true) { // occupied
                                    enemies[i].alpha = 0;
                                    enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                                }
                                else {
                                    enemies[i].alpha = enemies[i].alpha;
                                }
                            }
                        }
                        else { // Undefined
                            enemies[i].alpha = 0;
                            enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                        }

                        // Don't put this in a for loop. lol
                        checkEnemyCollision(i);
                    }
                }
            }

            // This is literally walking
            if (!kofs[2] && canMove == true) {
                let xo;
                let yo;
                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up")) {
                    head = 3;
                    direction = "up";
                    xo = 0;
                    yo = -1;
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down")) {
                    head = 0;
                    direction = "down";
                    xo = 0;
                    yo = 1;
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left")) {
                    head = 1;
                    direction = "left";
                    xo = -1;
                    yo = 0;
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right")) {
                    head = 2;
                    direction = "right";
                    xo = 1;
                    yo = 0;
                }
                // Optimized code pog
                if (xo != undefined) {
                    if (map.worldmode == true) {
                        // only move half a tile in world mode
                        xo /= 2;
                        yo /= 2;
                    }
                    actionButton.snip = [64, 96, 64, 32];
                    if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.snip = [64, 32, 64, 32]
                    else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.snip = [64, 32, 64, 32]

                    tryTalk(xo, yo);

                    // WALKING
                    if ((isWalkable(map, game.position[0] + xo, game.position[1] + yo)
                        && isWalkable(map, game.position[0] + xo, game.position[1] + yo, 2))
                        || (getTile(map, game.position[0] + xo, game.position[1] + yo) == undefined &&
                            getTile(map, game.position[0] + xo, game.position[1] + yo, 2) != undefined &&
                            isWalkable(map, game.position[0] + xo, game.position[1] + yo, 2))) { //Direction-change-against-wall

                        kofs = [xo, yo, 1];
                        game.position[0] += xo;
                        game.position[1] += yo;
                        game.stats.walk++;

                        ActionsOnMove();
                        tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]));
                        tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]), 2);

                        actionButton.snip = [64, 96, 64, 32];
                        if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.snip = [64, 32, 64, 32]
                        else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.snip = [64, 32, 64, 32]

                        tryTalk(xo, yo);
                    }
                }
            }

            // water
            let isInWater = 1;
            if (getTile(map, game.position[0], game.position[1]) != undefined) if (getTile(map, game.position[0], game.position[1]).swim == true) isInWater = 2;

            // anim
            kofs[2] = Math.max(kofs[2] - delta / 166 / isInWater, 0);
            walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;
            animateTime = (animateTime + delta / 1000) % 2;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            // Camera limit (corners of the map)
            // the min(0, does the limiting. CAMERA_LOCK_X and Y are some sorta offset
            // CAM_OX and Y range from 0 to inf, 0 = locked camera, value = distance to the lock
            CAM_OX = Math.min(0, (game.position[0] - width / 2 + 0.5) - CAMERA_LOCK_X);
            CAM_OY = Math.min(0, (game.position[1] - 7.5) - CAMERA_LOCK_Y);

            // draw tiles of BG and BG2 layers (behind player)
            drawTiles(ctx, 1);
            drawTiles(ctx, 2);

            let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5);
            let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5);

            if (map.items != undefined) {
                for (let item of map.items) {
                    if (item[4] == true) { // is visible
                        if (images["items/" + items[item[2]]().source] != undefined) ctx.drawImage(images["items/" + items[item[2]]().source],
                            ((zoom * scale) * (item[0] - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (item[1] - ofsY) - ((zoom - 1) * scale * 7),
                            zoom * scale, zoom * scale);
                    }
                }
            }

            // worldmode
            let wm = 1;
            if (map.worldmode == true) {
                wm = 2;
            }
            zswm = (zoom * scale) / wm;

            // draw NPCs
            for (i in activenpcs) {
                if (activenpcs[i].alpha > 0) {
                    ctx.globalAlpha = activenpcs[i].alpha;
                    renderNPC(ctx, activenpcs[i]);
                }
            }

            // draw enemies
            for (let enemy of enemies) {
                if (enemy.alpha > 0) {
                    ctx.globalAlpha = enemy.alpha;
                    enemy.render(ctx);
                }
            }

            // draw player / formation leader
            if (map.worldmode != true || images["wm_" + game.leader] == undefined) {
                ctx.drawImage(images[game.leader], 32 * Math.floor(walkTime), 32 * head, 32, 32 / isInWater,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zswm, zswm / isInWater)
                ctx.imageSmoothingEnabled = false;
            }
            else {
                ctx.drawImage(images["wm_" + game.leader], 16 * Math.floor(walkTime), 16 * head, 16, 16 / isInWater,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zswm, zswm / isInWater)
                ctx.imageSmoothingEnabled = false;
            }

            // draw FG tiles (in front of player)
            drawTiles(ctx, 3);

            // Joystick
            if (settings.joystick) {
                pad = "";
                if (pointerActive && canMove) {
                    if (padActive) {
                        padThumbPosition = pointerPos;
                        let offset = [padThumbPosition[0] - padPosition[0], padThumbPosition[1] - padPosition[1]]
                        let dist = Math.sqrt(offset[0] ** 2 + offset[1] ** 2);
                        if (dist > scale * 1.5 && !kofs[2]) {
                            if (Math.abs(offset[0]) > Math.abs(offset[1])) {
                                pad = offset[0] > 0 ? "right" : "left";
                            } else {
                                pad = offset[1] > 0 ? "down" : "up";
                            }
                        }
                        if (dist > scale * 2.5) {
                            padPosition = [
                                padPosition[0] + offset[0] / dist * (dist - scale * 2.5),
                                padPosition[1] + offset[1] / dist * (dist - scale * 2.5),
                            ]
                        }
                    } else {
                        padPosition = padThumbPosition = pointerPos;
                    }
                    padAlpha = Math.min(padAlpha + delta * .01, 1);
                    padActive = true;
                } else {
                    let lerp = 1 - (0.98 ** delta);
                    padThumbPosition = [
                        padThumbPosition[0] + (padPosition[0] - padThumbPosition[0]) * lerp,
                        padThumbPosition[1] + (padPosition[1] - padThumbPosition[1]) * lerp,
                    ]
                    padAlpha = Math.max(padAlpha - delta * .005, 0);
                    padActive = false;
                }

                ctx.globalAlpha = padAlpha;
                ctx.beginPath();
                ctx.arc(padPosition[0], padPosition[1], scale * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "#000000af";
                ctx.fill();
                if (pad || kofs[2]) {
                    let ang = { up: -0.75, right: -0.25, down: 0.25, left: 0.75 }[direction]
                    ctx.beginPath();
                    ctx.arc(padPosition[0], padPosition[1], scale * 2.5, Math.PI * ang, Math.PI * (ang + .5));
                    ctx.arc(padPosition[0], padPosition[1], scale * 1, Math.PI * (ang + .5), Math.PI * ang, true);
                    ctx.fillStyle = "#ffffff1f";
                    ctx.fill();
                }

                ctx.globalAlpha = padAlpha * 2;
                ctx.beginPath();
                ctx.arc(padThumbPosition[0], padThumbPosition[1], scale + 2, 0, Math.PI * 2);
                ctx.fillStyle = "#ffae38";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(padThumbPosition[0], padThumbPosition[1], scale, 0, Math.PI * 2);
                ctx.fillStyle = "#d18822";
                ctx.fill();

                if (walkPad[0].alpha == 1) {
                    for (wp in walkPad) {
                        walkPad[wp].alpha = 0;
                    }
                }
            }
            else {
                walkPadIdle -= delta / 1000;
                if (walkPadIdle <= 0 && walkPad[0].alpha == 1) {
                    addAnimator(function (t) {
                        for (wp in walkPad) {
                            walkPad[wp].alpha = Math.max(1 - (t * 0.004), 0.01);
                        }
                        if (t > 250) return true;

                        return false;
                    });
                }
                if (walkPad[0].alpha == 0) {
                    for (wp in walkPad) {
                        walkPad[wp].alpha = 1;
                    }
                }
            }

            //
            // DIALOGUES
            //

            let dNameID = dTextID = dPortraitID = dStarID = -1; // star and text must exist, rest optional

            // Set dialogueObjects (which will be used) to whatever our current type is
            // Cutscene, normal, invis., narrator

            if (inDialogue == true && cutsceneMode == true) {
                dialogueObjects = dialogueCutsceneComponents;
                dTextID = 1;
                dStarID = 2;
            }
            if (inDialogue == true && dialogueType == "normal" && cutsceneMode == false) {
                dialogueObjects = dialogueNormalComponents;
                dNameID = 3;
                dTextID = 6;
                dPortraitID = 5;
                dStarID = 7;
            }
            if (inDialogue == true && dialogueType == "invis" && cutsceneMode == false) {
                dialogueObjects = dialogueInvisComponents;
                dTextID = 2;
                dStarID = 3;
            }
            if (inDialogue == true && dialogueType == "narrator" && cutsceneMode == false) {
                dialogueNarratorComponents[0].falpha = 1;
                dialogueObjects = dialogueNarratorComponents;
                dTextID = 1;
                dStarID = 2;
            }
            if (inDialogue == true && dialogueType == "cinematic" && cutsceneMode == false) {
                dialogueNarratorComponents[0].falpha = 0;
                dialogueObjects = dialogueNarratorComponents;
                dTextID = 1;
                dStarID = 2;
            }

            if (inDialogue == true) {
                // Make / keep the dialogue objects visible
                for (i = 0; i < dialogueObjects.length; i++) {
                    dialogueObjects[i].alpha = dialogueObjects[i].falpha;
                }

                // Slide them in
                if (dialogueObjects[0].at == 0) {
                    dialogueObjects[0].at = 0.5;
                    for (i in dialogueObjects) {
                        dialogueObjects[i].offset[1] = dialogueObjects[i].defoff[1] + 500;
                    }
                    addAnimator(function (t) {
                        for (i in dialogueObjects) {
                            dialogueObjects[i].offset[1] = dialogueObjects[i].defoff[1] + 500 - Math.min(t, 500);
                        }
                        if (t > 499) {
                            for (i in dialogueObjects) {
                                dialogueObjects[i].at = 1;
                            }
                            return true;
                        }
                        return false;
                    });
                }

                // They are there, visible
                if (dialogueObjects[0].at != 0.4) {
                    // Update text
                    if (currentDialogue[dialogueProgress].text == undefined) {
                        // Broken dialogue (undefined)
                        alert("This dialogue is broken!\nPlease report it to the devs!");
                        dialogueNext();
                    }
                    else if (typeof (currentDialogue[dialogueProgress].text) == "string") dialogueObjects[dTextID].text = animatedText(currentDialogue[dialogueProgress].text);
                    else dialogueObjects[dTextID].text = animatedText(currentDialogue[dialogueProgress].text());

                    if (currentDialogue != false) {
                        if (dNameID != -1) { // Change name display if it exists
                            if (currentDialogue[dialogueProgress].name != undefined) dialogueObjects[dNameID].text = currentDialogue[dialogueProgress].name;
                            else dialogueObjects[dNameID].text = "Bleu";
                        }
                        if (dPortraitID != -1) { // Change portrait display if it exists
                            dialogueEmotion = currentDialogue[dialogueProgress].emotion;
                            if (currentDialogue[dialogueProgress].portrait != undefined) {
                                dialogueObjects[dPortraitID].source = currentDialogue[dialogueProgress].portrait;
                                if (dialogueEmotion != undefined) dialogueObjects[dPortraitID].snip = getEmotion(dialogueEmotion);
                                else dialogueObjects[dPortraitID].snip = getEmotion("neutral");
                            }
                            else { // doesn't exist - use default
                                dialogueObjects[dPortraitID].source = "Bleu_Portrait";
                                dialogueObjects[dPortraitID].snip = getEmotion("neutral");
                            }
                        }

                        if (currentDialogue[dialogueProgress + 1] != undefined) dialogueObjects[dStarID].alpha = 1; // Star
                        actionButton.alpha = 0;
                    }
                }
            }

            // Keybinds

            // action
            if (currentKeys[" "]) {
                actionButton.onClick();
            }

            // ...leave?
            if (currentKeys["q"]) {
                setScene(scenes.title());
            }
            // open inventory
            if (currentKeys["e"]) {
                fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
            }
        },
        controls: [
            poisonBlack, nightEffect, nightEffect2, fallingRain, fogCloud, darkCloud, dustParticles,
            ...walkPad, inventoryButton, inventoryImage, actionButton, backButton,
            ...cutsceneElements, ...dialogueNormalComponents, ...dialogueInvisComponents, ...dialogueNarratorComponents, ...dialogueCutsceneComponents,
            autoSaveText, ...areaNameBox, areaTeleportFade,
        ],
        name: "game"
    }
}