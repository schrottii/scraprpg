function showSelect() {
    let dif = document.querySelector("div.loadiv");
    dif.style.display = "block";

    let canvas = document.querySelector("canvas");
    canvas.style.display = "none";
}

function hideSelect() {
    let dif = document.querySelector("div.loadiv");
    dif.style.display = "none";

    let canvas = document.querySelector("canvas");
    canvas.style.display = "block";
}

var lmresult = "none";

function loadMap() {
    hideSelect();

    let file = document.getElementById("myFile").files[0];

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        // Jesus sweet fucking christ
        let result = e.target.result;
        let name = result.split("id: ");
        name = name[1];
        if (name != undefined) {
            name = name.split(",");
            let finalname = name[0];
            finalname = finalname.split('\"');
            finalname = finalname[1];
            lmresult = finalname;
        }
        else {
            let mapobj = JSON.parse(result);
            try {
                lmresult = JSON.parse(mapobj);
            }
            catch{
                lmresult = mapobj;
            }
        }
    }
}

scenes.mapmaker = () => {

    let walkPad = [];
    let walkPadSize = Math.max(32, 64 * settings.walkPadSize);
    let pad;
    let modeButtons = [];
    let updateTiles = false;

    let tilesMenuControls = [];
    let tilesMenuTiles = [];
    let loadMapButtons = [];
    let pageWidth = 1;
    let pageSize = 1;
    let tileSource = "common";
    let prot = false;
    let prott = 0;

    let ttp = "001"; // tile to place
    let editingLayer = 0;

    var activenpcs = [];
    var currentMap = "map2";
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

    modeButtons.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 0], sizeOffset: [0, 96],
        fill: "brown", alpha: 0.8,
        onClick(args) {
            prot = true;
            prott = 100;
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 0],
        source: "move", alpha: 0,
        onClick(args) {
            moveMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 0],
        source: "place", alpha: 1,
        onClick(args) {
            placeMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 6, 0],
        source: "erase", alpha: 1,
        onClick(args) {
            eraseMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 9, 0],
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
    for (i = 0; i < 3; i++) {
        modeButtons.push(controls.image({
            anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * i, 0],
            source: "layerbuttons", snip: [32 * i, 0, 32, 32], alpha: 1, i: i,
            onClick(args) {
                editingLayer = this.i;
            }
        }));
    }
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 11, 0],
        source: "loadmap", alpha: 1,
        onClick(args) {
            toggleLoadButtons();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 12, 0],
        source: "savemap", alpha: 1,
        onClick(args) {
            saveFile();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.025, 0.025], sizeOffset: [64, 64], offset: [72 * 13, 0],
        source: "newmap", alpha: 1,
        onClick(args) {
            currentMap = "newMap";
            map = {
                id: "newMap",
                tiles: {
                    empty: {
                        sprite: "water1",
                    },
                },
                map: ["---"],
                mapbg2: ["---"],
                mapfg: ["---"],
            }
            newMap();
        }
    }));

    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.3], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from file...", alpha: 0,
        onClick(args) {
            showSelect();
        }
    }));

    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.5], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from name...", alpha: 0,
        onClick(args) {
            let newMapn = prompt("Map name? (e. g. test)");
            if (maps[newMapn] != undefined) currentMap = newMapn;
            map = maps[currentMap];
            if (loadMapButtons[0].alpha == 1) toggleLoadButtons();
            newMap();
        }
    }));

    // Tiles menu ahahyahahaaaa
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.4],
        fill: colors.buttonbottom, alpha: 0,
    }));
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.4], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    tilesMenuControls.push(controls.button({
        anchor: [0.05, 0.15], sizeAnchor: [0.15, 0.05],
        text: "Common",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSource = "common";
                openTilesMenu();
            }
        }
    }));
    tilesMenuControls.push(controls.button({
        anchor: [0.8, 0.15], sizeAnchor: [0.15, 0.05],
        text: "Map",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSource = "map";
                openTilesMenu();
            }
        }
    }));

    for (t = 0; t < 100; t++) {
        tilesMenuTiles.push(controls.image({
            anchor: [0.05, 0.2], offset: [32 + (72 * (t % 25)), 32 + (72 * Math.floor(t / 25))], sizeOffset: [64, 64],
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

    function newMap() {
        // Function called when the map has changed - not for creating a new map
        game.position[0] = Math.round(game.position[0]);
        game.position[1] = Math.round(game.position[1]);

        activenpcs = [];
        for (i in tnpcs) {
            tnpcs[i].alpha = 0;
        }
        loadNPCs();

        updateTiles = true;
    }

    function saveFile() {
        let toExport = JSON.stringify(map);

        var blob = new Blob([toExport], { type: "text/plain" });
        var anchor = document.createElement("a");
        anchor.download = currentMap + ".sotrm";
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = "_blank";
        anchor.style.display = "none"; // just to be safe!
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    function toggleLoadButtons() {
        if (loadMapButtons[0].alpha == 0) {
            for (i in loadMapButtons) {
                loadMapButtons[i].offset = [0, -600];
                loadMapButtons[i].alpha = 1;
            }
            addAnimator(function (t) {
                for (i in loadMapButtons) {
                    loadMapButtons[i].offset[1] = -600 + t;
                }
                if (t > 599) {
                    for (i in loadMapButtons) {
                        loadMapButtons[i].offset[1] = 0;
                    }
                    return true;
                }
                return false;
            })
        }
        else {
            for (i in loadMapButtons) {
                loadMapButtons[i].offset = [0, 0];
            }
            addAnimator(function (t) {
                for (i in loadMapButtons) {
                    loadMapButtons[i].offset[1] = -t;
                }
                if (t > 599) {
                    for (i in loadMapButtons) {
                        loadMapButtons[i].offset[1] = -600;
                        loadMapButtons[i].alpha = 0;
                    }
                    return true;
                }
                return false;
            })
        }
    }

    function moveMode() {
        mode = "move";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        modeButtons[1].alpha = 0;
        modeButtons[2].alpha = 1;
        modeButtons[3].alpha = 1;
    }

    function placeMode() {
        mode = "place";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        modeButtons[1].alpha = 1;
        modeButtons[2].alpha = 0;
        modeButtons[3].alpha = 1;
    }

    function eraseMode() {
        mode = "erase";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        modeButtons[1].alpha = 1;
        modeButtons[2].alpha = 1;
        modeButtons[3].alpha = 0;
    }

    function openTilesMenu() {
        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 1;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
        }
        for (t = 0; t < 25; t++) {
            if (tilesMenuTiles[t].offset[0] <= width * scale * 0.85) pageWidth = t;
        }
        for (r = 0; r < 4; r++) {
            if (tilesMenuTiles[r * 25].offset[1] <= width * scale * 0.5) pageSize = pageWidth * r;
        }
        let nr = 0;
        let til;
        let grb;

        for (t = 0; t < pageSize; t++) {
            if ((t % 25) % pageWidth == 0 && t > 0) t += (25 - pageWidth) * Math.ceil(t / 25);
            if (tileSource == "common") {
                til = Object.keys(commontiles)[nr];
                grb = commontiles[til];
            }
            if (tileSource == "map") {
                til = Object.keys(map.tiles)[nr];
                grb = map.tiles[til];
            }
            if (til != undefined) {
                if (til != "empty") {
                    tilesMenuTiles[t].source = "tiles/" + grb.sprite;
                    tilesMenuTiles[t].tile = grb;
                    tilesMenuTiles[t].tileid = til;
                    tilesMenuTiles[t].alpha = 1;
                }
            }
            nr += 1;
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

    function placeTile(x, y, layer) {
        if (x < 0 || y < 0) {
            return false;
        }
        let mp = map[layer][y];
        let def = "---";
        //if (layer == "map") def = "002";

        if (mode == "place") {
            if (mp == undefined) {
                while (mp == undefined) {
                    map[layer].push(def);
                    mp = map[layer][y];
                }
                map[layer][y] = ttp;
            }
            if (x * 4 > mp.length + 4) {
                while (x * 4 > mp.length + 4) {
                    map[layer][y] = mp + " " + def;
                    mp = map[layer][y];
                }
            }
            if (x * 4 > mp.length) map[layer][y] = mp + " " + ttp;
            else map[layer][y] = mp.substr(0, x * 4) + ttp + " " + mp.substr((1 + x) * 4);
            map[layer][y] = map[layer][y].replace(/  /gi, " ");
            updateTiles = true;
        }
    }

    function eraseTile(x, y, layer) {
        if (x < 0 || y < 0) {
            return false;
        }
        let mp = map[layer][y];

        if (mode == "erase" && mp != undefined && x * 4 <= mp.length) {
            if(layer == "map") map[layer][y] = mp.substr(0, x * 4) + "002 " + mp.substr((1 + x) * 4);
            else map[layer][y] = mp.substr(0, x * 4) + "--- " + mp.substr((1 + x) * 4);
            map[layer][y] = map[layer][y].replace(/  /gi, " ");
            updateTiles = true;
        }
    }

    for (i = 0; i < 800; i++) {
        tiles_bg.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            pos: [-999999999, -999999999],
            source: "gear",
            alpha: 0, ri: true,
            onClick(args) {
                if (!prot) {
                    if (editingLayer == 0) {
                        if (mode == "erase") eraseTile(this.pos[0], this.pos[1], "map");
                        else placeTile(this.pos[0], this.pos[1], "map");
                    }
                }
            }
        }));
        tiles_bg2.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0, ri: true,
            onClick(args) {
                if (!prot) {
                    if (editingLayer == 1) {
                        if (mode == "erase") eraseTile(this.pos[0], this.pos[1], "mapbg2");
                        else placeTile(this.pos[0], this.pos[1], "mapbg2");
                    }
                }
            }
        }));
        tiles_fg.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0, ri: true,
            onClick(args) {
                if (!prot) {
                    if (editingLayer == 2) {
                        if (mode == "erase") eraseTile(this.pos[0], this.pos[1], "mapfg");
                        else placeTile(this.pos[0], this.pos[1], "mapfg");
                    }
                }
            }
        }));
        titems.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2],
            source: "gear",
            alpha: 0, ri: true,
        }));
        tnpcs.push(controls.image({
            offset: [-1000, -1000], sizeOffset: [2, 2], snip: [0, 0, 32, 32],
            source: "gear",
            alpha: 0, ri: true,
        }));
    }

    loadNPCs();
    fadeIn(250, true);
    canMove = true;

    return {
        // Pre-render function
        preRender(ctx, delta) {
            prott -= delta;
            if (prott <= 0) prot = false;

            if (lmresult != "none") {
                if (loadMapButtons[0].alpha == 1) toggleLoadButtons();

                if (lmresult != "justhide") {
                    if (typeof (lmresult) == "string") {
                        // The map you have loaded already exists :)
                        currentMap = lmresult;
                        map = maps[currentMap];
                        newMap();
                    }
                    else {
                        // It does not hmm
                        map = lmresult;
                        if (map.map == undefined) {
                            map.map = ["--- --- 001 001 001", "--- --- 001 001 001", "--- --- 001 001 001"];
                            console.log(map);
                        }
                        if (map.mapbg2 == undefined) {
                            map.mapbg2 = ["--- --- ---", "--- --- ---", "--- --- ---"];
                        }
                        if (map.mapfg == undefined) {
                            map.mapfg = ["--- --- ---", "--- --- ---", "--- --- ---"];
                        }
                        newMap();
                    }
                }

                lmresult = "none";
            }


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
            currentMapText.text = "Current Map: " + currentMap + " | Pos: x" + game.position[0] + " y" + game.position[1] + " z" + editingLayer + " | Mode: " + mode;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;


            let wm = 1;

            if (map == undefined) return false;
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
                    tiles_bg2[ti].pos = [-999999999, -999999999];
                    tiles_fg[ti].pos = [-999999999, -999999999];
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
                    if (tiles_bg[b] == undefined) return false;

                    tiles_bg[b].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                    tiles_bg[b].sizeOffset = [zoom * scale, zoom * scale];
                    tiles_bg[b].alpha = 1;
                    if (map.map[y] && map.map[y][(x * 4) + 2]) {
                        if (map.map[y][(x * 4) + 2] != "-") {
                            tiles_bg[b].source = "tiles/" + getTile(map, x, y).sprite;
                        }
                        else {
                            tiles_bg[b].source = "tiles/" + map.tiles.empty.sprite;
                        }
                        tiles_bg[b].pos = [x, y];
                    }
                    else if (map.tiles.empty) {
                        if (x == -1) tiles_bg[b].source = "tiles/border";
                        else if (y == -1) tiles_bg[b].source = "tiles/border2";
                        else tiles_bg[b].source = "tiles/" + map.tiles.empty.sprite;
                        tiles_bg[b].pos = [x, y];
                    }

                    b2 += 1;
                    tiles_bg2[b2].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                    tiles_bg2[b2].sizeOffset = [zoom * scale, zoom * scale];
                    tiles_bg2[b2].pos = [x, y];
                    if (map.mapbg2[y] && map.mapbg2[y][(x * 4) + 2]) {
                        if (map.mapbg2[y][(x * 4) + 2] != "-") {
                            tiles_bg2[b2].source = "tiles/" + getTile(map, x, y, 2).sprite;
                            tiles_bg2[b2].alpha = 1;
                        }
                    }

                    t += 1;
                    tiles_fg[t].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                    tiles_fg[t].sizeOffset = [zoom * scale, zoom * scale];
                    tiles_fg[t].pos = [x, y];
                    if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                        if (map.mapfg[y][(x * 4) + 2] != "-") {
                            tiles_fg[t].source = "tiles/" + getTile(map, x, y, 3).sprite;
                            tiles_fg[t].alpha = 1;
                        }
                    }
                }
            }

            middlei.sizeOffset = [zoom * scale, zoom * scale];
            middlei.offset = [-zoom * scale / 2, -zoom * scale / 2];
        },
        // Controls
        controls: [
            ...tiles_bg, ...tiles_bg2, ...titems, ...tnpcs, ...tiles_fg,
            ...walkPad, middlei, currentMapText, backButton, ...modeButtons,
            ...tilesMenuControls, ...loadMapButtons, ...tilesMenuTiles,
        ],
        name: "mapmaker"
    }
}