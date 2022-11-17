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
        let name = result.split('id":');
        let noid = false;

        name = name[1];
        if (name != undefined) {
            console.log("map maker load: has id");
            let finalname = name.split(",");
            finalname = name[0];
            finalname = finalname.split('\"');
            finalname = finalname[1];
            if (maps[finalname] != undefined) {
                lmresult = finalname;
            }
            else {
                noid = true;
            }
        }
        else {
            noid = true;
        }
        if(noid) {
            console.log("map maker load: no id");
            result = result.split('"] =');
            result = result[1];
            let mapobj = JSON.parse(result);
            try {
                lmresult = JSON.parse(mapobj);
            }
            catch {
                console.log("map maker load: single parse");
                lmresult = mapobj;
            }
        }
        //console.log(lmresult);
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
    let createTileButtons = [];
    let loadMapButtons = [];
    let expandMapButtons = [];
    let undoButtons = [];
    let mapInfoControls = [];

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
    var prevmode = "move";

    var tiles_bg = [];
    var tiles_bg2 = [];
    var tiles_fg = [];
    var titems = [];
    var tnpcs = [];

    // For creating new tiles
    let tileID = "";
    let tileSprite = "";
    let tileSet = "";
    let tileSetSnip = "";
    let tileAni = "";
    let tileOccupied = "";

    var undoLog = [];
    var redoLog = [];

    game.position = [4, 4];
    let prePos = [-3483493, 934030];

    modeButtons.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 0], sizeOffset: [0, 96],
        fill: "brown", alpha: 0.8,
        onClick(args) {
            prot = true;
            prott = 100;
        }
    }));
    for (i = 0; i < 3; i++) {
        modeButtons.push(controls.image({
            anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * i, 0],
            source: "layerbuttons", snip: [32 * i, 0, 32, 32], alpha: 1, i: i,
            onClick(args) {
                editingLayer = this.i;
            }
        }));
    }
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 3 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 0],
        source: "move", alpha: 0,
        onClick(args) {
            moveMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 0],
        source: "place", alpha: 1,
        onClick(args) {
            placeMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 0],
        source: "erase", alpha: 1,
        onClick(args) {
            eraseMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 6, 0],
        source: "movenplace", alpha: 1,
        onClick(args) {
            moveAndPlaceMode();
        }
    }));
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 8 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 8, 0],
        source: "tilesmenu", alpha: 1,
        onClick(args) {
            if (tilesMenuControls[0].alpha == 0) {
                prevmode = mode;
                moveMode();
                openTilesMenu();
            }
            else {
                if (prevmode == "moveandplace") moveAndPlaceMode();
                else placeMode();
                closeTilesMenu();
            }
        }
    }));
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 9 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 9, 0],
        source: "loadmap", alpha: 1,
        onClick(args) {
            toggleLoadButtons();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 10, 0],
        source: "savemap", alpha: 1,
        onClick(args) {
            saveFile("sotrm");
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 11, 0],
        source: "savemap", alpha: 1,
        onClick(args) {
            saveFile("js");
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 12, 0],
        source: "newmap", alpha: 1,
        onClick(args) {
            if (confirm("Do you really want to create a new map?") == true) {
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
        }
    }));
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 13 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 13, 0],
        source: "mmzoom", alpha: 1,
        onClick(args) {
            switch (zoom) {
                case 1:
                    zoom = 1.25;
                    updateTiles = true;
                    break;
                case 1.25:
                    zoom = 1.5;
                    updateTiles = true;
                    break;
                case 1.5:
                    zoom = 2;
                    updateTiles = true;
                    break;
                case 2:
                    zoom = 4;
                    updateTiles = true;
                    break;
                case 4:
                    zoom = 1;
                    updateTiles = true;
                    break;
            }
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 14, 0],
        source: "newmap", alpha: 1,
        onClick(args) {
            toggleCreateTileButtons();
        }
    }));
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 15 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    undoButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 15, 0],
        source: "undo", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                placeTile(undoLog[0][0], undoLog[0][1], undoLog[0][2], undoLog[0][3], "undo");
                undoLog.shift();
            }
        }
    }));
    undoButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 16, 0],
        source: "redo", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                placeTile(redoLog[0][0], redoLog[0][1], redoLog[0][2], redoLog[0][3]);
                redoLog.shift();
            }
        }
    }));

    createTileButtons.push(controls.button({
        anchor: [0.3, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile ID", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            tileID = prompt('New map tile ID? (e. g. 001)');
            this.text = "Tile ID: " + tileID;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Sprite", alpha: 0,
        onClick(args) {
            tileSprite = prompt('New map tile sprite? (e. g. water1 - must be the name from resources)');
            this.text = "Tile Sprite: " + tileSprite;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Occupied", alpha: 0,
        onClick(args) {
            tileOccupied = prompt('New map tile occupied? YES / NO / up.right.left.down');
            this.text = "Tile Occ: " + tileOccupied;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.55, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Set", alpha: 0,
        onClick(args) {
            tileSet = prompt('New map tile set? (e. g. castle - must be the name from resources)');
            this.text = "Tile Set: " + tileSet;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.55, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Set Snip", alpha: 0,
        onClick(args) {
            tileSetSnip = prompt('New map tile set snip? X.Y (e. g. 1.1)');
            this.text = "Set Snip: " + tileSetSnip;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.55, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Animation", alpha: 0,
        onClick(args) {
            tileAni = prompt('New map tile set snip? X.Y (e. g. 1.1)');
            this.text = "Animation: " + tileAni;
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "CREATE!", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (tileSprite == "" && tileSet == "") {
                alert("You have to set a sprite or a set!");
                return false;
            }
            try {
                if (tileSet == "") {
                    map.tiles[tileID] = {
                        "sprite": tileSprite
                    }
                }
                else {
                    if (tileSetSnip == "") tileSetSnip = "0.0";
                    map.tiles[tileID] = {
                        "set": tileSet,
                        "snip": [parseInt(tileSetSnip.split(".")[0]), parseInt(tileSetSnip.split(".")[1])],
                    }
                }

                if (tileOccupied.toLowerCase() == "yes") map.tiles[tileID].occupied = true;
                else if (tileOccupied.toLowerCase() != "no" && tileOccupied.toLowerCase() != "") map.tiles[tileID].occupied = tileOccupied.split(".");

                if (tileAni != "") map.tiles[tileID].ani = [parseInt(tileAni.split(".")[0]), parseInt(tileAni.split(".")[1])];

                tileID = "";
                tileSprite = "";
                tileOccupied = "";
                tileSet = "";
                tileSetSnip = "";
                tileAni = "";

                createTileButtons[0].text = "Tile ID";
                createTileButtons[1].text = "Tile Sprite";
                createTileButtons[2].text = "Tile Occupied";
                createTileButtons[3].text = "Tile Set";
                createTileButtons[4].text = "Tile Set Snip";
            }
            catch {
                alert("An error occured!");
            }
            toggleCreateTileButtons();
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

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "newmap", alpha: 1, ri: true,
        onClick(args) {
            for (x in map.map) {
                map.map[x] = "--- " + map.map[x];
            }
            for (x in map.mapbg2) {
                map.mapbg2[x] = "--- " + map.mapbg2[x];
            }
            for (x in map.mapfg) {
                map.mapfg[x] = "--- " + map.mapfg[x];
            }
            newMap();
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "newmap", alpha: 1, ri: true,
        onClick(args) {
            map.map.unshift("---");
            map.mapbg2.unshift("---");
            map.mapfg.unshift("---");
            updateTiles = true;
            newMap();
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "newmap", alpha: 1, ri: true,
        onClick(args) {
            for (x in map.map) {
                map.map[x] = map.map[x].slice(4);
            }
            for (x in map.mapbg2) {
                map.mapbg2[x] = map.mapbg2[x].slice(4);
            }
            for (x in map.mapfg) {
                map.mapfg[x] = map.mapfg[x].slice(4);
            }
            newMap();
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "newmap", alpha: 1, ri: true,
        onClick(args) {
            map.map.shift();
            map.mapbg2.shift();
            map.mapfg.shift();
            updateTiles = true;
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
            if (this.alpha == 1) {
                protect();
                this.snip[0] = 32;
                pad = "up";
            }
        },
        onClick(args) {
            protect();
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Middle
        anchor: [.1, .9], offset: [0, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [64, 0, 32, 32],
        isPressed: false,
        onDown(args) {
            if (this.alpha == 1) {
                protect();
                pad = "";
            }
        },
        onClick(args) {
            protect();
        }
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.1, .9], offset: [0, -walkPadSize], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 64, 32, 32],
        isPressed: false,
        onDown(args) {
            if (this.alpha == 1) {
                protect();
                this.snip[0] = 32;
                pad = "down";
            }
        },
        onClick(args) {
            protect();
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Left
        anchor: [.1, .9], offset: [-walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 96, 32, 32],
        isPressed: false,
        onDown(args) {
            if (this.alpha == 1) {
                protect();
                this.snip[0] = 32;
                pad = "left";
            }
        },
        onClick(args) {
            protect();
            this.snip[0] = 0;
            pad = "";
        }
    }));
    walkPad.push(controls.image({ // Right
        anchor: [.1, .9], offset: [walkPadSize, -walkPadSize * 2], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 32, 32, 32],
        isPressed: false,
        onDown(args) {
            if (this.alpha == 1) {
                protect();
                this.snip[0] = 32;
                pad = "right";
            }
        },
        onClick(args) {
            protect();
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

    let toggleMapInfoButton = controls.button({
        anchor: [0.02, 0.85], sizeAnchor: [0.05, 0.045],
        text: "(i)",
        onClick(args) {
            protect();
            if (mapInfoControls[0].alpha == 0) {
                for (w in walkPad) {
                    walkPad[w].alpha = 0;
                }
                for (mi in mapInfoControls) {
                    mapInfoControls[mi].alpha = 1;
                }
            }
            else if (mapInfoControls[0].alpha == 1) {
                for (mi in mapInfoControls) {
                    mapInfoControls[mi].alpha = 0;
                }
                for (w in walkPad) {
                    walkPad[w].alpha = 1;
                }
            }
        },
        alpha: 1,
    });

    mapInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.6],
        fill: colors.buttonbottompressed, alpha: 0,
    }));
    mapInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.6], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontoppressed, alpha: 0,
    }));
    mapInfoControls.push(controls.label({
        anchor: [0.5, 0.15],
        text: "Map Info / Details", alpha: 0,
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.2], sizeAnchor: [0.2, 0.1],
        text: "Map name: " + map.name, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newName = prompt("New map name?");
                map.name = newName;
                this.text = "Map name: " + newName;
                currentMap = newName;
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Music intro: " + map.intro, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newIntro = prompt("New map music intro?");
                map.intro = newIntro;
                this.text = "Music intro: " + newIntro;
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Music loop: " + map.music, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newLoop = prompt("New map music loop?");
                map.music = newLoop;
                this.text = "Music loop: " + newLoop;
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.2], sizeAnchor: [0.2, 0.1],
        text: "Weather: " + map.weather, alpha: 0, i: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let weathers = ["none", "fog", "rain", "dust"];
                let newWeather = this.i < weathers.length - 1 ? weathers[this.i + 1] : weathers[0];
                this.i += 1;
                if (this.i >= weathers.length) this.i = 0;

                map.weather = newWeather;
                this.text = "Weather: " + newWeather;
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Weather Strength: " + map.weather, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newWeather = prompt("New weather strength? (default is 1)");
                map.weatherStrength = newWeather;
                this.text = "Weather Strength: " + newWeather;
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Worldmode: OFF", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (this.text == "Worldmode: OFF") {
                    this.text = "Worldmode: ON";
                    map.worldmode = true;
                }
                else {
                    this.text = "Worldmode: OFF";
                    map.worldmode = false;
                }
            }
        }
    }));

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

    function postUndoLog(x, y, layer, prevContent) {
        undoLog.unshift([x, y, layer, prevContent])

        if(undoLog.length > 25) undoLog.pop();
    }

    function postRedoLog(x, y, layer, prevContent) {
        redoLog.unshift([x, y, layer, prevContent])

        if (undoLog.length > 25) redoLog.pop();
    }

    function saveFile(type) {
        let toExport;

        if(type == "sotrm") toExport = JSON.stringify(map);
        if (type == "js") toExport = 'maps["' + currentMap + '"] = ' + JSON.stringify(map);

        var blob = new Blob([toExport], { type: "text/plain" });
        var anchor = document.createElement("a");
        if (type == "sotrm") anchor.download = currentMap + ".sotrm";
        if (type == "js") anchor.download = currentMap + ".js";
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = "_blank";
        anchor.style.display = "none"; // just to be safe!
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    function toggleCreateTileButtons() {
        if (createTileButtons[0].alpha == 0) {
            for (i in createTileButtons) {
                createTileButtons[i].offset = [0, -600];
                createTileButtons[i].alpha = 1;
            }
            addAnimator(function (t) {
                for (i in createTileButtons) {
                    createTileButtons[i].offset[1] = -600 + t;
                }
                if (t > 599) {
                    for (i in createTileButtons) {
                        createTileButtons[i].offset[1] = 0;
                    }
                    return true;
                }
                return false;
            })
        }
        else {
            for (i in createTileButtons) {
                createTileButtons[i].offset = [0, 0];
            }
            addAnimator(function (t) {
                for (i in createTileButtons) {
                    createTileButtons[i].offset[1] = -t;
                }
                if (t > 599) {
                    for (i in createTileButtons) {
                        createTileButtons[i].offset[1] = -600;
                        createTileButtons[i].alpha = 0;
                    }
                    return true;
                }
                return false;
            })
        }
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
        modeButtons[5].alpha = 0;
        modeButtons[6].alpha = 1;
        modeButtons[7].alpha = 1;
        modeButtons[8].alpha = 1;
    }

    function placeMode() {
        mode = "place";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        modeButtons[5].alpha = 1;
        modeButtons[6].alpha = 0;
        modeButtons[7].alpha = 1;
        modeButtons[8].alpha = 1;
    }

    function eraseMode() {
        mode = "erase";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        modeButtons[5].alpha = 1;
        modeButtons[6].alpha = 1;
        modeButtons[7].alpha = 0;
        modeButtons[8].alpha = 1;
    }

    function moveAndPlaceMode() {
        mode = "moveandplace";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        modeButtons[5].alpha = 1;
        modeButtons[6].alpha = 1;
        modeButtons[7].alpha = 1;
        modeButtons[8].alpha = 0;
    }

    function openTilesMenu() {
        let red = isLs() ? 2 : 1;

        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 1;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
        }
        for (t = 0; t < 25; t++) {
            if (tilesMenuTiles[t].offset[0] / red <= width * scale * 0.9) pageWidth = t;
        }
        for (r = 0; r < 4; r++) {
            if (tilesMenuTiles[r * 25].offset[1] / red <= height * 0.4) pageSize = pageWidth * (r + 1);
        }
        let nr = 0;
        let til;
        let grb;
        let i = 0;

        while (i < pageSize) {
            if ((nr % 25) % pageWidth == 0 && nr > 0) nr += (25 - pageWidth);
            if (tileSource == "common") {
                til = Object.keys(commontiles)[i];
                grb = commontiles[til];
            }
            if (tileSource == "map") {
                til = Object.keys(map.tiles)[i];
                grb = map.tiles[til];
            }

            if (til != undefined && (map.tiles[til] == undefined || tileSource == "map")) {
                if (til != "empty") {
                    if (grb.set != undefined) {
                        tilesMenuTiles[nr].source = "tilesets/" + grb.set;
                        tilesMenuTiles[nr].snip = [grb.snip[0] * 32, grb.snip[1] * 32, 32, 32];
                    }
                    else {
                        tilesMenuTiles[nr].source = "tiles/" + grb.sprite;
                        tilesMenuTiles[nr].snip = false;
                    }
                    tilesMenuTiles[nr].tile = grb;
                    tilesMenuTiles[nr].tileid = til;
                    tilesMenuTiles[nr].alpha = 1;
                    nr += 1;
                }
            }
            i += 1;
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

    function protect() {
        if (mode == "moveandplace") {
            prot = true;
            prott = 100;
        }
    }

    function placeTile(x, y, layer, tileToPlace="none", umode="default") {
        if (x < 0 || y < 0) {
            return false;
        }

        let mp = map[layer][y];
        let def = "---";


        //if (layer == "map") def = "002";

        if (mode == "place" || mode == "moveandplace") {
            if (tileToPlace == "none") {
                tileToPlace = ttp;
            }

            if (mp == undefined) {
                while (mp == undefined) {
                    map[layer].push(def);
                    mp = map[layer][y];
                }
                map[layer][y] = tileToPlace;
            }
            if (x * 4 > mp.length + 4) {
                while (x * 4 > mp.length + 4) {
                    map[layer][y] = mp + " " + def;
                    mp = map[layer][y];
                }
            }

            if (umode == "default") {
                postUndoLog(x, y, layer, mp.substr(x * 4, 3));
            }
            if (umode == "undo") {
                postRedoLog(x, y, layer, mp.substr(x * 4, 3));
            }

            if (x * 4 > mp.length) map[layer][y] = mp + " " + tileToPlace;
            else map[layer][y] = mp.substr(0, x * 4) + tileToPlace + " " + mp.substr((1 + x) * 4);
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

            if (undoLog.length == 0) undoButtons[0].alpha = 0;
            else undoButtons[0].alpha = 1;

            if (redoLog.length == 0) undoButtons[1].alpha = 0;
            else undoButtons[1].alpha = 1;

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


            if (!kofs[2] && canMove == true && (mode == "move" || mode == "moveandplace")) {
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
                            if (getTile(map, x, y).set != undefined) {
                                tiles_bg[b].source = "tilesets/" + getTile(map, x, y).set;
                                tiles_bg[b].snip = [getTile(map, x, y).snip[0] * 32, getTile(map, x, y).snip[1] * 32, 32, 32];
                            }
                            else {
                                tiles_bg[b].source = "tiles/" + getTile(map, x, y).sprite;
                                tiles_bg[b].snip = false;
                            }
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
                            if (getTile(map, x, y, 2).set != undefined) {
                                tiles_bg2[b2].source = "tilesets/" + getTile(map, x, y, 2).set;
                                tiles_bg2[b2].snip = [getTile(map, x, y, 2).snip[0] * 32, getTile(map, x, y, 2).snip[1] * 32, 32, 32];
                            }
                            else {
                                tiles_bg2[b2].source = "tiles/" + getTile(map, x, y, 2).sprite;
                                tiles_bg2[b2].snip = false;
                            }
                            tiles_bg2[b2].alpha = 1;
                        }
                    }

                    t += 1;
                    tiles_fg[t].offset = [(zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2))) - ((width * scale) / 2), (zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7)) - (height / 2)];
                    tiles_fg[t].sizeOffset = [zoom * scale, zoom * scale];
                    tiles_fg[t].pos = [x, y];
                    if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                        if (map.mapfg[y][(x * 4) + 2] != "-") {
                            if (getTile(map, x, y, 3).set != undefined) {
                                tiles_fg[t].source = "tilesets/" + getTile(map, x, y, 3).set;
                                tiles_fg[t].snip = [getTile(map, x, y, 3).snip[0] * 32, getTile(map, x, y, 3).snip[1] * 32, 32, 32];
                            }
                            else {
                                tiles_fg[t].source = "tiles/" + getTile(map, x, y, 3).sprite;
                                tiles_fg[t].snip = false;
                            }
                            tiles_fg[t].alpha = 1;
                        }
                    }
                }
            }

            expandMapButtons[0].sizeOffset = [zoom * scale, zoom * scale];
            expandMapButtons[0].offset = [(zoom * scale * (-2 - ofsX) - ((zoom - 1) * scale * (width / 2))), (zoom * scale * (-1 - ofsY) - ((zoom - 1) * scale * 7))];

            expandMapButtons[1].sizeOffset = [zoom * scale, zoom * scale];
            expandMapButtons[1].offset = [(zoom * scale * (-1 - ofsX) - ((zoom - 1) * scale * (width / 2))), (zoom * scale * (-2 - ofsY) - ((zoom - 1) * scale * 7))];

            expandMapButtons[2].sizeOffset = [zoom * scale, zoom * scale];
            expandMapButtons[2].offset = [(zoom * scale * (-4 - ofsX) - ((zoom - 1) * scale * (width / 2))), (zoom * scale * (-1 - ofsY) - ((zoom - 1) * scale * 7))];

            expandMapButtons[3].sizeOffset = [zoom * scale, zoom * scale];
            expandMapButtons[3].offset = [(zoom * scale * (-1 - ofsX) - ((zoom - 1) * scale * (width / 2))), (zoom * scale * (-4 - ofsY) - ((zoom - 1) * scale * 7))];

            middlei.sizeOffset = [zoom * scale, zoom * scale];
            middlei.offset = [-zoom * scale / 2, (zoom * scale * 7.5 - ((zoom - 1) * scale * 7)) - (height / 2)];
        },
        // Controls
        controls: [
            ...tiles_bg, ...tiles_bg2, ...titems, ...tnpcs, ...tiles_fg, ...expandMapButtons,
            ...walkPad, middlei, currentMapText, backButton, toggleMapInfoButton, ...modeButtons,
            ...tilesMenuControls, ...undoButtons, ...loadMapButtons, ...createTileButtons, ...tilesMenuTiles, ...mapInfoControls,
        ],
        name: "mapmaker"
    }
}