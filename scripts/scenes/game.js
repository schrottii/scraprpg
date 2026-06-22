// Init
let pad = "";
//let scale;
let currentFogAlpha = 2;
let tokenRunning = false;
let previousMap = "";

// Walk Pad
let walkPad = [];
let walkPadIdle = 5;
let walkPadSize = Math.max(32, 64 * settings.walkPadSize);

// Joy Stick
let padActive = false;
let padAlpha = 0;
let padPosition = [0, 0];
let padThumbPosition = [0, 0];

scenes["game"] = new Scene(
    () => {
        // objects
        //createSquare("BG", 0, 0, 1, 1, "#000000");

        createButton("walkPadUp", 0.1, 0.9, 0, 0, "mapbuttons", () => useWalkPad("up"),
            {
                offset: [0, -walkPadSize * 3], sizeOffset: [walkPadSize, walkPadSize],
                snip: [0, 0, 32, 32],
                onHold: () => downWalkPad("up")
            });
        createButton("walkPadRight", 0.1, 0.9, 0, 0, "mapbuttons", () => useWalkPad("right"),
            {
                offset: [walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
                snip: [0, 32, 32, 32],
                onHold: () => downWalkPad("right")
            });
        createButton("walkPadDown", 0.1, 0.9, 0, 0, "mapbuttons", () => useWalkPad("down"),
            {
                offset: [0, -walkPadSize * 1], sizeOffset: [walkPadSize, walkPadSize],
                snip: [0, 64, 32, 32],
                onHold: () => downWalkPad("down")
            });
        createButton("walkPadLeft", 0.1, 0.9, 0, 0, "mapbuttons", () => useWalkPad("left"),
            {
                offset: [-walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
                snip: [0, 96, 32, 32],
                onHold: () => downWalkPad("left")
            });
        createButton("walkPadMiddle", 0.1, 0.9, 0, 0, "mapbuttons", () => { },
            {
                offset: [0, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
                snip: [64, 0, 32, 32],
                onHold: () => reviveWalkPad()
            });

        createSquare("nightEffect", 0, 0, 1, 1, "#FFFFFF", { alpha: 0 });
        createSquare("nightEffect2", 0, 0, 1, 1, "#FFFFFF", { alpha: 0 });
        createSquare("areaTeleportFade", 0, 0, 1, 1, "#FFFFFF", { alpha: 0 });
        createSquare("poisonBlack", 0, 0, 1, 1, "lime", { alpha: 0 }); // lime instead of black now

        // This is for the inventory button. In the TOP RIGHT.
        createButton("inventoryButton", 1, 0, 0, 0, "inventory", () => {
            if (canMove == true) {
                playSound("buttonClickSound");
                game.stats.inventory++;
                fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
            }
        }, { offset: [-128, 0], sizeOffset: [128, 128] });
        createImage("inventoryButtonPing", 1, 0, 0, 0, "ping",
            { offset: [-64, 64], sizeOffset: [64, 64] });

        createButton("actionButton", 1, 0.8, 0, 0, "mapbuttons", (c) => { objects[c].snip[1] = 96; clickActionButton(); },
            {
                sizeOffset: [256, 128], offset: [-312, 0], snip: [64, 96, 64, 32],
                onDown: (c) => { objects[c].snip[1] = 64; }
            });

        createText("autoSaveText", 0.025, 0.98, "Game saved", { offset: [12, -12], size: 16, alpha: 0 });

        // DIALOGUE STUFF
        createButton("dialogue_normal_squareBG", 0, 1, 1, 0, colors.bottomcolor, (c) => { if (objects[c].alpha > 0) dialogueBox(); }, {
            offset: [0, -200], sizeOffset: [0, 200], alpha: 0, falpha: 1
        });
        createSquare("dialogue_normal_square2", 0.01, 1.01, 0, 0, colors.topcolor, {
            offset: [0, -200], sizeOffset: [136, 136], alpha: 0, falpha: 1
        });
        createSquare("dialogue_normal_square3", 0.01, 1.01, 0, 0, colors.topcolor, {
            offset: [0, -54], sizeOffset: [128, 32], alpha: 0, falpha: 1
        });
        createText("dialogue_normal_charactername", 0.01, 1.01, "", {
            align: "center", size: 20, color: "black",
            offset: [64, -24], alpha: 0, falpha: 1
        });
        createSquare("dialogue_normal_square4", 0.01, 1.01, 0.8, 0, colors.topcolor, {
            offset: [164, -200], sizeOffset: [0, 178], alpha: 0, falpha: 1
        });
        createImage("dialogue_normal_image", 0.01, 1.01, 0, 0, "Portraits_NAN", {
            offset: [0, -192], sizeOffset: [128, 128], alpha: 0, falpha: 1,
            snip: [0, 0, 64, 64]
        });
        createSmartText("dialogue_normal_maintext", 0, 1, "...", {
            align: "left", size: 20, color: "black",
            maxW: 0.7, autoLinebreak: 160,
            offset: [196, -168], alpha: 0, falpha: 1
        });
        createImage("dialogue_normal_continuestar", 0.81, 1, 0, 0, "star", {
            sizeOffset: [64, 64], offset: [100, -96], alpha: 0, falpha: 0
        });

        createGroup("dialogue_normal", ["dialogue_normal_squareBG", "dialogue_normal_square2", "dialogue_normal_square3",
            "dialogue_normal_charactername", "dialogue_normal_square4",
            "dialogue_normal_image", "dialogue_normal_maintext", "dialogue_normal_continuestar"
        ]);
        groups["dialogue_normal"].set("at", 0);
        groups["dialogue_normal"].set("defoff", (c) => c.offset);
        groups["dialogue_normal"].set("falpha", (c) => c.config.falpha);

        createButton("dialogue_invis_squareBG", 0, 1, 1, 0, colors.bottomcolor, (c) => { if (objects[c].alpha > 0) dialogueBox(); }, {
            offset: [0, -200], sizeOffset: [0, 200], alpha: 0, falpha: 1
        });
        createSquare("dialogue_invis_square2", 0.01, 1.01, 0.98, 0, colors.topcolor, {
            offset: [0, -200], sizeOffset: [0, 180], alpha: 0, falpha: 1
        });
        createSmartText("dialogue_invis_maintext", 0.02, 1, "...", {
            align: "left", size: 20, color: "black",
            maxW: 0.75, autoLinebreak: 160,
            offset: [0, -168], alpha: 0, falpha: 1
        });
        createImage("dialogue_invis_continuestar", 0.8, 1, 0, 0, "star", {
            sizeOffset: [64, 64], offset: [0, -96], alpha: 0, falpha: 0
        });

        createGroup("dialogue_invis", ["dialogue_normal_squareBG", "dialogue_invis_square2",
            "dialogue_invis_maintext", "dialogue_invis_continuestar"]);
        groups["dialogue_invis"].set("at", 0);
        groups["dialogue_invis"].set("defoff", (c) => c.offset);
        groups["dialogue_invis"].set("falpha", (c) => c.config.falpha);

        createButton("dialogue_narrator_squareBG", 0, 0, 1, 1, "narratorbg", (c) => { if (objects[c].alpha > 0) dialogueBox(); }, {
            alpha: 0, falpha: 1
        });
        createSmartText("dialogue_narrator_maintext", 0.5, 0.5, "...", {
            align: "center", size: 20, color: "white",
            maxW: 0.6, autoLinebreak: 120,
            alpha: 0, falpha: 1
        });
        createImage("dialogue_narrator_continuestar", 0.8, 1, 0, 0, "star", {
            sizeOffset: [64, 64], offset: [0, -96], alpha: 0, falpha: 0
        });

        createGroup("dialogue_narrator", ["dialogue_narrator_squareBG", "dialogue_narrator_maintext", "dialogue_narrator_continuestar"]);
        groups["dialogue_narrator"].set("at", 0);
        groups["dialogue_narrator"].set("defoff", (c) => c.offset);
        groups["dialogue_narrator"].set("falpha", (c) => c.config.falpha);

        createButton("dialogue_cutscene_squareBG", 0, 0, 1, 1, "narratorbg", (c) => { if (objects[c].alpha > 0) dialogueBox(); }, {
            alpha: 0, falpha: 0.1
        });
        createSmartText("dialogue_cutscene_maintext", 0.01, 1, "...", {
            align: "left", size: 16, color: "white",
            maxW: 0.98, autoLinebreak: 200,
            offset: [0, -96], alpha: 0, falpha: 1
        });
        createImage("dialogue_cutscene_continuestar", 0.8, 1, 0, 0, "star", {
            sizeOffset: [64, 64], offset: [0, -96], alpha: 0, falpha: 0
        });

        createGroup("dialogue_cutscene", ["dialogue_cutscene_squareBG", "dialogue_cutscene_maintext", "dialogue_cutscene_continuestar"]);
        groups["dialogue_cutscene"].set("at", 0);
        groups["dialogue_cutscene"].set("defoff", (c) => c.offset);
        groups["dialogue_cutscene"].set("falpha", (c) => c.config.falpha);

        /*
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
        movable: true, lifespan: 30, alpha: 0.75, amount: 80, spawnTime: 0.8,
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

    let fallingLeaves = Particles({
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
    })
        */

        createButton("backButton", 0.01, 0.925, 0.05, 0.045, "button", () => {
            setScene(scenes.mapmaker());
        }, { aText: { text: "<", size: 24 }, power: (isMapTestingMode ? 1 : 0) });



        // enter game scene, fade in
        map = maps[game.map];
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));

        try {
            loadNPCs();
            loadAreaMusic();
            trySpawnEnemy(42);
            checkTileDialogue();

            let tTime = 1000 / 3;
            if (previousScene == "main" || previousScene == "title" || previousScene == undefined) tTime = 1500; // Not inventory or fight
            fadeIn(tTime, true, () => canMove = true);
        }
        catch {
            console.log("| ⚠️ | Error while loading the map");
        }

    },
    (tick) => {
        // Loop
        scale = window.innerHeight / 16;
        map = maps[game.map];
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));

        // worldmode
        let wm = 1;
        if (map.worldmode == true) {
            wm = 2;
        }
        zswm = (zoom * scale) / wm;

        // Auto Save & Auto Save Text
        if (autoSaveTime > 14999) {
            // Animation
            addAnimator(function (t) {
                objects["autoSaveText"].alpha = 1 - (1 / 2500) * t;
                if (t > 2500) {
                    autoSaveTime = 0;
                    objects["autoSaveText"].alpha = 0;
                    return true;
                }
                return false;
            })
            // Saving
            saveGame(true);
            autoSaveTime = -3; // To prevent saving multiple times!
        }

        // map sign
        /*
        if (previousMap != maps[game.map].name) {
            previousMap = maps[game.map].name;
            areaNameBox[1].text = maps[game.map].name;

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
        */

        // stuffs
        //renderWeather();
        renderNightEffect();

        walkNPCs();
        walkEnemies();

        // This is literally player walking
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
                objects["actionButton"].snip = [64, 96, 64, 32];
                if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.snip = [64, 32, 64, 32]
                else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.snip = [64, 32, 64, 32]

                tryTalk(xo, yo);

                // WALKING
                // walk player
                if (getTileAllLayersWalkable(map, game.position[0] + xo, game.position[1] + yo, "player")) {
                    kofs = [xo, yo, 1];
                    game.position[0] += xo;
                    game.position[1] += yo;
                    game.stats.walk++;
                    questProgress("walk");

                    ActionsOnMove();
                    tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]));
                    tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]), 2);

                    objects["actionButton"].snip = [64, 96, 64, 32];
                    if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.snip = [64, 32, 64, 32]
                    else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.snip = [64, 32, 64, 32]

                    tryTalk(xo, yo);
                    tryLookAtChest(xo, yo);
                }
            }
        }

        // water
        let isInWater = 1;
        if (getTile(map, game.position[0], game.position[1]) != undefined) if (getTile(map, game.position[0], game.position[1]).swim == true) isInWater = 2;

        // anim
        kofs[2] = Math.max(kofs[2] - delta / 166 / 1.5 / isInWater, 0);
        walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;
        animateTime = (animateTime + delta / 1000) % 2;
        spaceBarTime += delta;

        wggjCTX.imageSmoothingEnabled = false;
        wggjCTX.globalAlpha = 1;

        // Camera limit (corners of the map)
        // the min(0, does the limiting. CAMERA_LOCK_X and Y are some sorta offset
        // CAM_OX and Y range from 0 to inf, 0 = locked camera, value = distance to the lock
        CAM_OX = Math.min(0, (game.position[0] - width / 2 + 0.5) - CAMERA_LOCK_X);
        CAM_OY = Math.min(0, (game.position[1] - 7.5) - CAMERA_LOCK_Y);

        // draw tiles of BG and BG2 layers (behind player)
        drawTiles(1);
        drawTiles(2);

        let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5);
        let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5);

        let posX = 0;
        let posY = 0;

        // render items
        if (map.items != undefined) {
            for (let item of map.items) {
                if (game.mItems.includes(getItemDatName(map, item))) item[4] = false; // hide if you already got dat
                if (item[4] == true) { // is visible
                    posX = ((zoom * scale) * (item[0] - ofsX)) - ((zoom - 1) * scale * (width / 2));
                    posY = (zoom * scale) * (item[1] - ofsY) - ((zoom - 1) * scale * 7);
                    if (settings.circles == "all") {
                        wggjCTX.drawImage(images.itemCircle,
                            posX - (zswm / 4), posY - (zswm / 4),
                            zswm * 1.5, zswm * 1.5);
                    }
                    if (images["items/" + items[item[2]]().source] != undefined) wggjCTX.drawImage(images["items/" + items[item[2]]().source],
                        posX, posY,
                        zoom * scale, zoom * scale);
                }
            }
        }

        // draw NPCs
        for (i in activeNPCs) {
            if (activeNPCs[i].alpha > 0) {
                wggjCTX.globalAlpha = isValid(activeNPCs[i].alpha) ? activeNPCs[i].alpha : 1;
                renderNPC(activeNPCs[i]);
            }
        }
        wggjCTX.globalAlpha = 1;

        // draw enemies
        for (let enemy of activeEnemies) {
            if (enemy.alpha > 0) {
                wggjCTX.globalAlpha = isValid(enemy.alpha) ? enemy.alpha : 1;
                enemy.render();
            }
        }
        wggjCTX.globalAlpha = 1;

        // draw player / formation leader
        if (map.worldmode != true || images["wm_" + game.leader] == undefined) {
            wggjCTX.drawImage(images[game.leader], 32 * Math.floor(walkTime), 32 * head, 32, 32 / isInWater,
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                Math.ceil(zoom * scale) * (7.5) - ((zoom - 1) * scale * 7),
                zswm, zswm / isInWater);
            wggjCTX.imageSmoothingEnabled = false;
        }
        else {
            wggjCTX.drawImage(images["wm_" + game.leader], 16 * Math.floor(walkTime), 16 * head, 16, 16 / isInWater,
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                Math.ceil(zoom * scale) * (7.5) - ((zoom - 1) * scale * 7),
                zswm, zswm / isInWater);
            wggjCTX.imageSmoothingEnabled = false;
        }

        // draw FG tiles (in front of player)
        drawTiles(3);

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

            wggjCTX.globalAlpha = padAlpha;
            wggjCTX.beginPath();
            wggjCTX.arc(padPosition[0], padPosition[1], scale * 2.5, 0, Math.PI * 2);
            wggjCTX.fillStyle = "#000000af";
            wggjCTX.fill();
            if (pad || kofs[2]) {
                let ang = { up: -0.75, right: -0.25, down: 0.25, left: 0.75 }[direction]
                wggjCTX.beginPath();
                wggjCTX.arc(padPosition[0], padPosition[1], scale * 2.5, Math.PI * ang, Math.PI * (ang + .5));
                wggjCTX.arc(padPosition[0], padPosition[1], scale * 1, Math.PI * (ang + .5), Math.PI * ang, true);
                wggjCTX.fillStyle = "#ffffff1f";
                wggjCTX.fill();
            }

            wggjCTX.globalAlpha = padAlpha * 2;
            wggjCTX.beginPath();
            wggjCTX.arc(padThumbPosition[0], padThumbPosition[1], scale + 2, 0, Math.PI * 2);
            wggjCTX.fillStyle = "#ffae38";
            wggjCTX.fill();
            wggjCTX.beginPath();
            wggjCTX.arc(padThumbPosition[0], padThumbPosition[1], scale, 0, Math.PI * 2);
            wggjCTX.fillStyle = "#d18822";
            wggjCTX.fill();

            if (objects["walkPadMiddle"].alpha == 1) {
                realphaWalkPad(0);
            }
        }
        else {
            walkPadIdle -= delta / 1000;
            if (walkPadIdle <= 0 && objects["walkPadMiddle"].alpha == 1) {
                addAnimator(function (t) {
                    realphaWalkPad(Math.max(1 - (t * 0.004), 0.01));
                    if (t > 250) return true;
                    return false;
                });
            }
            if (objects["walkPadMiddle"].alpha == 0) {
                reviveWalkPad();
            }
        }

        objects["inventoryButtonPing"].alpha = notifications.length > 0 ? 1 : 0;

        // DIALOGUES
        renderDialogue();

        // Keybinds
        // action
        if (currentKeys[" "] && spaceBarTime > 199) {
            objects["actionButton"].onClick("actionButton");
            dialogueBox();
            spaceBarTime = 0;
        }

        // ...leave?
        if (currentKeys["q"]) {
            if (confirm("Do you want to go back to the main menu?")) {
                loadScene("title");
            }
            else currentKeys["q"] = false;
        }
        // open inventory
        if (currentKeys["e"] && canMove) {
            canMove = false;
            game.stats.inventory++;
            fadeOut(1000 / 3, true, () => {
                loadScene("inventory");
                canMove = true;
            });
        }

        // emergency
        if (currentKeys["f"]) {
            currentKeys["f"] = false;
            if (isElectron() || prompt("Press F to pay respect") == "SPIT") {
                teleportPlayer("castleSplit", 56, 20);
            }
        }
    }
);



/*
scenes.game = () => {
    let pad = "";

    var scale;

    var areaNameBox = [];

    var currentFogAlpha = 2;

    var cutsceneElements = [];
    let itemPopupElements = [];

    var tokenRunning = false;

    let dialogueObjects = [];

    var previousMap = "";

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
                game.stats.inventory++;
                fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
            }
        }
    });
    let inventoryImage = controls.image({
        anchor: [1, 0], offset: [-128, 0], sizeOffset: [128, 128],
        alpha: 1,
        source: "inventory", clickstop: false
    });
    let inventoryNotif = controls.image({
        anchor: [1, 0], offset: [-64, 64], sizeOffset: [64, 64],
        alpha: 1,
        source: "ping", clickstop: false
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

    let autoSaveText = controls.label({
        anchor: [.025, .98], offset: [12, -12],
        fontSize: 16, text: "Game saved!", alpha: 0,
    });

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
        clickthrough: false, clickstop: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -54], defoff: [0, -54], sizeOffset: [128, 32], at: 0,
        clickthrough: false, clickstop: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.label({
        anchor: [0.01, 1.01], offset: [64, -34], defoff: [64, -34], at: 0,
        align: "center", fontSize: 20, fill: "black",
        text: "Bleu",
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [164, -200], defoff: [164, -200], sizeOffset: [0, 178], sizeAnchor: [0.8, 0], at: 0,
        clickthrough: false, clickstop: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.01, 1.01], offset: [0, -192], defoff: [0, -192], sizeOffset: [128, 128], snip: [0, 0, 64, 64], at: 0,
        source: "Portraits_NAN",
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueNormalComponents.push(controls.label({ // 6
        anchor: [0, 1], offset: [196, -168], defoff: [196, -168], at: 0,
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.81, 1], sizeOffset: [64, 64], offset: [100, -96], defoff: [100, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0, clickstop: false,
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
        clickthrough: false, clickstop: false,
        fill: colors.topcolor,
        alpha: 0, falpha: 1,
    }));
    dialogueInvisComponents.push(controls.label({ // 2
        anchor: [0.02, 1], offset: [0, -168], defoff: [0, -168], at: 0,
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueInvisComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0, clickstop: false,
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
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueNarratorComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0, clickstop: false,
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
        alpha: 0, falpha: 1, clickstop: false,
    }));
    dialogueCutsceneComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96], defoff: [0, -96], at: 0,
        source: "star",
        alpha: 0, falpha: 0, clickstop: false,
    }));
    // end of the dialogue stuff. lol.

    // item popup
    itemPopupElements.push(controls.rect({
        anchor: [0.35, 0.15], sizeAnchor: [0.3, 0.1], sizeOffset: [128, 128], offset: [-64, -64], defoff: [-64, -64],
        clickstop: false,
        fill: colors.topcolor,
        alpha: 0,
        onClick(args) {
            removeNotification("item");
            for (let e in itemPopupElements) {
                itemPopupElements[e].alpha = 0;
            }
        }
    }));
    itemPopupElements.push(controls.rect({
        anchor: [0.35, 0.15], sizeAnchor: [0.3, 0.1], sizeOffset: [112, 112], offset: [-64 + 8, -64 + 8], defoff: [-64 + 8, -64 + 8],
        clickstop: false,
        fill: colors.bottomcolor,
        alpha: 0,
    }));
    itemPopupElements.push(controls.image({
        anchor: [0.35, 0.2], sizeOffset: [128, 128], offset: [-64, -64], defoff: [-64, -64],
        source: "items/potion",
        alpha: 0, clickstop: false,
    }));
    itemPopupElements.push(controls.label({
        anchor: [0.4, 0.15], offset: [0, 0], defoff: [0, 0],
        align: "left", fontSize: 16, fill: "white",
        text: "...",
        alpha: 0, clickstop: false,
    }));
    itemPopupElements.push(controls.label({
        anchor: [0.4, 0.2], offset: [0, 0], defoff: [0, 0],
        align: "left", fontSize: 24, fill: "white",
        text: "...",
        alpha: 0, clickstop: false,
    }));
    itemPopupElements.push(controls.label({
        anchor: [0.4, 0.25], offset: [0, 0], defoff: [0, 0],
        align: "left", fontSize: 20, fill: "white",
        text: "...",
        alpha: 0, clickstop: false,
    }));

    

    // core
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

                        if (!game.mChests.includes(chestName)){
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

                        actionButton.snip = [64, 96, 64, 32];
                    }
                }
            }
        }
    });

    areaNameBox.push(controls.image({
        anchor: [0.2, 0], sizeAnchor: [0.6, 0.4],
        source: "hangingsign", alpha: 0
    }));
    areaNameBox.push(controls.label({
        anchor: [0.5, 0.25],
        align: "center", fontSize: 32, fill: "black",
        text: "AREA UNDEFINED", alpha: 0,
    }));

    let areaTeleportFade = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "black", alpha: 0
    });

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
        movable: true, lifespan: 30, alpha: 0.75, amount: 80, spawnTime: 0.8,
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

    let fallingLeaves = Particles({
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
    })

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

    // enter game scene, fade in
    map = maps[game.map];
    map.tiles = Object.assign({}, map.tiles, loadPacks(map));

    try {
        loadNPCs();
        loadAreaMusic();
        trySpawnEnemy(42);
        checkTileDialogue();

        let tTime = 1000 / 3;
        if (previousScene == "main" || previousScene == "title" || previousScene == undefined) tTime = 1500; // Not inventory or fight
        fadeIn(tTime, true, () => canMove = true);
    }
    catch {
        console.log("| ⚠️ | Error while loading the map");
    }



    // le pre rendero
    return {
        preRender(ctx, delta) {
            scale = window.innerHeight / 16;
            map = maps[game.map];
            map.tiles = Object.assign({}, map.tiles, loadPacks(map));

            // worldmode
            let wm = 1;
            if (map.worldmode == true) {
                wm = 2;
            }
            zswm = (zoom * scale) / wm;

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

            // map sign
            if (previousMap != maps[game.map].name) {
                previousMap = maps[game.map].name;
                areaNameBox[1].text = maps[game.map].name;

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

            // stuffs
            renderWeather();

            walkNPCs();
            walkEnemies();

            // This is literally player walking
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
                    // walk player
                    if (getTileAllLayersWalkable(map, game.position[0] + xo, game.position[1] + yo, "player")) {
                        kofs = [xo, yo, 1];
                        game.position[0] += xo;
                        game.position[1] += yo;
                        game.stats.walk++;
                        questProgress("walk");

                        ActionsOnMove();
                        tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]));
                        tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]), 2);

                        actionButton.snip = [64, 96, 64, 32];
                        if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.snip = [64, 32, 64, 32]
                        else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.snip = [64, 32, 64, 32]

                        tryTalk(xo, yo);
                        tryLookAtChest(xo, yo);
                    }
                }
            }

            // water
            let isInWater = 1;
            if (getTile(map, game.position[0], game.position[1]) != undefined) if (getTile(map, game.position[0], game.position[1]).swim == true) isInWater = 2;

            // anim
            kofs[2] = Math.max(kofs[2] - delta / 166 / 1.5 / isInWater, 0);
            walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;
            animateTime = (animateTime + delta / 1000) % 2;
            spaceBarTime += delta;

            wggjCTX.imageSmoothingEnabled = false;
            wggjCTX.globalAlpha = 1;

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

            let posX = 0;
            let posY = 0;

            // render items
            if (map.items != undefined) {
                for (let item of map.items) {
                    if (game.mItems.includes(getItemDatName(map, item))) item[4] = false; // hide if you already got dat
                    if (item[4] == true) { // is visible
                        posX = ((zoom * scale) * (item[0] - ofsX)) - ((zoom - 1) * scale * (width / 2));
                        posY = (zoom * scale) * (item[1] - ofsY) - ((zoom - 1) * scale * 7);
                        if (settings.circles == "all") {
                            wggjCTX.drawImage(images.itemCircle,
                                posX - (zswm / 4), posY - (zswm / 4),
                                zswm * 1.5, zswm * 1.5);
                        }
                        if (images["items/" + items[item[2]]().source] != undefined) wggjCTX.drawImage(images["items/" + items[item[2]]().source],
                            posX, posY,
                            zoom * scale, zoom * scale);
                    }
                }
            }

            // draw NPCs
            for (i in activeNPCs) {
                if (activeNPCs[i].alpha > 0) {
                    wggjCTX.globalAlpha = isValid(activeNPCs[i].alpha) ? activeNPCs[i].alpha : 1;
                    renderNPC(ctx, activeNPCs[i]);
                }
            }
            wggjCTX.globalAlpha = 1;
            
            // draw enemies
            for (let enemy of activeEnemies) {
                if (enemy.alpha > 0) {
                    wggjCTX.globalAlpha = isValid(enemy.alpha) ? enemy.alpha : 1;
                    enemy.render(ctx);
                }
            }
            wggjCTX.globalAlpha = 1;

            // draw player / formation leader
            if (map.worldmode != true || images["wm_" + game.leader] == undefined) {
                wggjCTX.drawImage(images[game.leader], 32 * Math.floor(walkTime), 32 * head, 32, 32 / isInWater,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    Math.ceil(zoom * scale) * (7.5) - ((zoom - 1) * scale * 7),
                    zswm, zswm / isInWater);
                wggjCTX.imageSmoothingEnabled = false;
            }
            else {
                wggjCTX.drawImage(images["wm_" + game.leader], 16 * Math.floor(walkTime), 16 * head, 16, 16 / isInWater,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    Math.ceil(zoom * scale) * (7.5) - ((zoom - 1) * scale * 7),
                    zswm, zswm / isInWater);
                wggjCTX.imageSmoothingEnabled = false;
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

                wggjCTX.globalAlpha = padAlpha;
                wggjCTX.beginPath();
                wggjCTX.arc(padPosition[0], padPosition[1], scale * 2.5, 0, Math.PI * 2);
                wggjCTX.fillStyle = "#000000af";
                wggjCTX.fill();
                if (pad || kofs[2]) {
                    let ang = { up: -0.75, right: -0.25, down: 0.25, left: 0.75 }[direction]
                    wggjCTX.beginPath();
                    wggjCTX.arc(padPosition[0], padPosition[1], scale * 2.5, Math.PI * ang, Math.PI * (ang + .5));
                    wggjCTX.arc(padPosition[0], padPosition[1], scale * 1, Math.PI * (ang + .5), Math.PI * ang, true);
                    wggjCTX.fillStyle = "#ffffff1f";
                    wggjCTX.fill();
                }

                wggjCTX.globalAlpha = padAlpha * 2;
                wggjCTX.beginPath();
                wggjCTX.arc(padThumbPosition[0], padThumbPosition[1], scale + 2, 0, Math.PI * 2);
                wggjCTX.fillStyle = "#ffae38";
                wggjCTX.fill();
                wggjCTX.beginPath();
                wggjCTX.arc(padThumbPosition[0], padThumbPosition[1], scale, 0, Math.PI * 2);
                wggjCTX.fillStyle = "#d18822";
                wggjCTX.fill();

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

            inventoryNotif.alpha = notifications.length > 0 ? 1 : 0;

            // Keybinds

            // action
            if (currentKeys[" "] && spaceBarTime > 199) {
                actionButton.onClick();
                dialogueBox();
                spaceBarTime = 0;
            }

            // ...leave?
            if (currentKeys["q"]) {
                if (confirm("Do you want to go back to the main menu?")) {
                    setScene(scenes.title());
                }
                else currentKeys["q"] = false;
            }
            // open inventory
            if (currentKeys["e"] && canMove) {
                canMove = false;
                game.stats.inventory++;
                fadeOut(1000 / 3, true, () => {
                    setScene(scenes.inventory());
                    canMove = true;
                });
            }

            // emergency
            if (currentKeys["f"]) {
                currentKeys["f"] = false;
                if (isElectron() || prompt("Press F to pay respect") == "SPIT") {
                    teleportPlayer("castleSplit", 56, 20);
                }
            }
        },
        controls: [
            poisonBlack, nightEffect, nightEffect2, fallingRain, fogCloud, darkCloud, dustParticles,
            ...walkPad, inventoryButton, inventoryImage, inventoryNotif, actionButton, backButton,
            ...itemPopupElements,
            ...cutsceneElements, ...dialogueNormalComponents, ...dialogueInvisComponents, ...dialogueNarratorComponents, ...dialogueCutsceneComponents,
            autoSaveText, ...areaNameBox, areaTeleportFade,
        ],
        name: "game"
    }
}
*/