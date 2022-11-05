scenes.mapmaker = () => {

    let walkPad = [];
    let walkPadSize = Math.max(32, 64 * settings.walkPadSize);
    let pad;
    let modeButtons = [];
    let updateTiles = false;

    let tilesMenuControls = [];
    let tilesMenuTiles = [];
    let pageSize = 1;

    let ttp = "001"; // tile to place

    var activenpcs = [];
    var currentMap = "test";
    var map = maps[currentMap];
    var mode = "move";

    var tiles_bg = [];
    var tiles_bg2 = [];
    var tiles_fg = [];
    var titems = [];
    var tnpcs = [];

    game.position = [4, 4];
    let prePos = [-3483493, 934030];

    function loadNPCs() {
        activenpcs = [];
        for (i in Object.keys(npcs)) {
            j = Object.keys(npcs)[i];
            let npc = npcs[j]();
            if (npc.alpha > 0 && npc.map == currentMap) {
                activenpcs.push(npcs[j]());
            }
        }
    }

    modeButtons.push(controls.image({
        anchor: [.025, .6], sizeOffset: [48, 48],
        source: "move", alpha: 0,
        onClick(args) {
            moveMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [.025, .6], sizeOffset: [48, 48], offset: [0, 64],
        source: "place", alpha: 1,
        onClick(args) {
            placeMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [.025, .6], sizeOffset: [48, 48], offset: [0, -64],
        source: "tilesmenu", alpha: 1,
        onClick(args) {
            if (tilesMenuControls[0].alpha == 0) {
                moveMode();
                openTilesMenu();
            }
            else {
                placeMode();
                closeTilesMenu();
            }
        }
    }));

    // Tiles menu ahahyahahaaaa
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.1], sizeAnchor: [0.9, 0.4],
        fill: colors.buttonbottom, alpha: 0,
    }));
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.1], sizeAnchor: [0.9, 0.4], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));

    for (t = 0; t < 25; t++) {
        tilesMenuTiles.push(controls.image({
            anchor: [0.05, 0.1], offset: [32 + (72 * t), 32], sizeOffset: [64, 64],
            source: "gear", alpha: 0,
            // tile: the tile, with sprite, occupied, etc.
            // tileid: 001, 002, etc.
            onClick(args) {
                if (this.alpha == 1) {
                    ttp = this.tileid;
                }
            }
        }));
    }

    walkPad.push(controls.image({ // Up
        anchor: [.1, .9], offset: [0, -walkPadSize * 3], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 0, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
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
            pad = "";
        },
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.1, .9], offset: [0, -walkPadSize], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 64, 32, 32],
        isPressed: false,
        onDown(args) {
            this.snip[0] = 32;
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
            pad = "right";
        },
        onClick(args) {
            this.snip[0] = 0;
            pad = "";
        }
    }));

    let backButton = controls.button({
        anchor: [0.02, 0.925], sizeAnchor: [0.05, 0.045],
        text: "<",
        onClick(args) {
            setScene(scenes.pretitle());
        },
        alpha: 1,
    });

    let currentMapText = controls.label({
        anchor: [0.075, 0.95],
        text: "ERROR",
        align: "left", fontSize: 32, fill: "black",
        outline: "white", outlineSize: 4,
        alpha: 1,
    });

    let middlei = controls.image({
        anchor: [0.5, 0.5], sizeOffset: [zswm, zswm],
        source: "grid",
        alpha: 1,
    });

    function moveMode() {
        mode = "move";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        modeButtons[0].alpha = 0;
        modeButtons[1].alpha = 1;
    }

    function placeMode() {
        mode = "preplace";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        modeButtons[0].alpha = 1;
        modeButtons[1].alpha = 0;
    }

    function openTilesMenu() {
        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 1;
        }
        for (t in tilesMenuTiles) {
            if (tilesMenuTiles[t].offset[0] <= width * scale * 0.85) pageSize = t;
        }
        for (t = 0; t < pageSize; t++) {
            if (Object.keys(commontiles)[t] != undefined) {
                if (Object.keys(commontiles)[t] != "empty") {
                    tilesMenuTiles[t].source = "tiles/" + commontiles[Object.keys(commontiles)[t]].sprite;
                    tilesMenuTiles[t].tile = commontiles[Object.keys(commontiles)[t]];
                    tilesMenuTiles[t].tileid = Object.keys(commontiles)[t];
                    tilesMenuTiles[t].alpha = 1;
                }
            }
        }
    }

    function closeTilesMenu() {
        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 0;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
        }
    }

    for (i = 0; i < 800; i++) {
        tiles_bg.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            pos: [-999999999, -999999999],
            source: "gear",
            alpha: 0,
            onClick(args) {
                if (this.pos[0] < 0 || this.pos[1] < 0) {
                    if (mode == "preplace") mode = "place";
                    return false;
                }
                let mp = maps[currentMap].map[this.pos[1]];

                if (mode == "place") {
                    if (mp == undefined) {
                        while (mp == undefined) {
                            maps[currentMap].map.push("002");
                            mp = maps[currentMap].map[this.pos[1]];
                        }
                        maps[currentMap].map[this.pos[1]] = ttp;
                    }
                    if (this.pos[0] * 4 > mp.length + 4) {
                        while (this.pos[0] * 4 > mp.length + 4) {
                            maps[currentMap].map[this.pos[1]] = mp + " 002";
                            mp = maps[currentMap].map[this.pos[1]];
                        }
                    }
                    if (this.pos[0] * 4 > mp.length) maps[currentMap].map[this.pos[1]] = mp + " " + ttp;
                    else maps[currentMap].map[this.pos[1]] = mp.substr(0, this.pos[0] * 4) + ttp + " " + mp.substr((1 + this.pos[0]) * 4);
                    maps[currentMap].map[this.pos[1]] = maps[currentMap].map[this.pos[1]].replace(/  /gi, " ");
                    updateTiles = true;
                }
                if (mode == "preplace") mode = "place";
            }
        }));
        tiles_bg2.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0,
        }));
        tiles_fg.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0,
        }));
        titems.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0,
        }));
        tnpcs.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2], snip: [0, 0, 32, 32],
            source: "gear",
            alpha: 0,
        }));
    }

    loadNPCs();
    fadeIn(250, true);
    canMove = true;

    return {
        // Pre-render function
        preRender(ctx, delta) {
            if (!kofs[2] && canMove == true && mode == "move") {
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
                        xo /= 2;
                        yo /= 2;
                    }
                    kofs = [xo, yo, 0.1];
                    game.position[0] += xo;
                    game.position[1] += yo;
                }
            }

            kofs[2] = Math.max(kofs[2] - delta / 166, 0);

            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;

            // Why is this HERE?
            currentMapText.text = "Current Map: " + currentMap + " | Pos: x" + game.position[0] + " y" + game.position[1];

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;


            let wm = 1;

            if (map.worldmode == true) {
                wm = 2;
            }
            zswm = (zoom * scale) / wm;


            if (game.position[0] != prePos[0] || game.position[1] != prePos[1] || updateTiles) {
                updateTiles = false;
                prePos[0] = game.position[0];
                prePos[1] = game.position[1];

                for (ti in tiles_fg) {
                    tiles_bg[ti].alpha = 0;
                    tiles_bg2[ti].alpha = 0;
                    tiles_fg[ti].alpha = 0;
                    titems[ti].alpha = 0;
                    tiles_bg[ti].pos = [-999999999, -999999999];
                }

                let b = 0;
                let b2 = 0;
                let t = 0;
                let it = 0;
                let np = 0;

                if (map.items != undefined) {
                    for (let item of map.items) {
                        if (item[4] == true) {
                            titems[it].offset = [(((zoom * scale) * (item[0] + kofs[0] * kofs[2] - (game.position[0] - width / 2 + 0.5))) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), ((zoom * scale) * (item[1] + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7)) - (height / 2)];
                            titems[it].sizeOffset = [zoom * scale, zoom * scale];
                            titems[it].source = "items/" + items[item[2]]().source;
                            titems[it].alpha = 1;
                            it += 1;
                        }
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].alpha > 0) {
                        let npc = activenpcs[i];
                        tnpcs[np].offset = [(((zoom * scale) * (npc.position[0] + kofs[0] * kofs[2] - (game.position[0] - width / 2 + 0.5))) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), ((zoom * scale) * (npc.position[1] + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7)) - (height / 2)];
                        tnpcs[np].sizeOffset = [zswm, zswm];
                        tnpcs[np].source = npc.skin;
                        tnpcs[np].alpha = 1;
                        np += 1;
                    }
                }
                for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                    b += 1;
                    tiles_bg[b].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                    tiles_bg[b].sizeOffset = [zoom * scale, zoom * scale];
                    tiles_bg[b].alpha = 1;
                    if (map.map[y] && map.map[y][(x * 4) + 2]) {
                        if (map.map[y][(x * 4) + 2] != "-") {
                            tiles_bg[b].source = "tiles/" + getTile(map, x, y).sprite;
                            tiles_bg[b].pos = [x, y];
                        }
                    }
                    else if (map.tiles.empty) {
                        if (x == -1) tiles_bg[b].source = "tiles/border";
                        else if (y == -1) tiles_bg[b].source = "tiles/border2";
                        else tiles_bg[b].source = "tiles/" + map.tiles.empty.sprite;
                        tiles_bg[b].pos = [x, y];
                    }
                    if (map.mapbg2[y] && map.mapbg2[y][(x * 4) + 2]) {
                        if (map.mapbg2[y][(x * 4) + 2] != "-") {
                            t += 1;
                            tiles_bg2[b2].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                            tiles_bg2[b2].sizeOffset = [zoom * scale, zoom * scale];
                            tiles_bg2[b2].source = "tiles/" + getTile(map, x, y, 2).sprite;
                            tiles_bg2[b2].alpha = 1;
                        }
                    }
                    if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                        if (map.mapfg[y][(x * 4) + 2] != "-") {
                            t += 1;
                            tiles_fg[t].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                            tiles_fg[t].sizeOffset = [zoom * scale, zoom * scale];
                            tiles_fg[t].source = "tiles/" + getTile(map, x, y, 3).sprite;
                            tiles_fg[t].alpha = 1;
                        }
                    }
                }
            }

            middlei.sizeOffset = [zswm * 2, zswm * 2];
            middlei.offset = [-zswm, -zswm];
        },
        // Controls
        controls: [
            ...tiles_bg, ...tiles_bg2, ...titems, ...tnpcs, ...tiles_fg,
            ...walkPad, middlei, currentMapText, backButton, ...modeButtons,
            ...tilesMenuControls, ...tilesMenuTiles,
        ],
        name: "mapmaker"
    }
}