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
        let name = result.split('id":')[1];
        let name2 = result.split('id:')[1];
        let noid = false;
        if (name != undefined || name2 != undefined) {
            if (name2 != undefined) name = name2;
            let finalname = name.split(",");
            finalname = finalname[0].replace(' "', '');
            finalname = finalname.replace('"', '');
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
            let toRemove = result.split('"] =')[0];
            result = result.replace(toRemove + '"] =', "");

            if (toRemove != undefined) {
                try {
                    let mapobj = JSON.parse(result);
                    try {
                        lmresult = JSON.parse(mapobj);
                    }
                    catch {
                        lmresult = mapobj;
                    }
                }
                catch {
                    lmresult = result;
                }
            }
            else {
                // has no ] =
                lmresult = result;
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

    let createTileButtons = [];
    let createTileBG = [];
    let createTileInfo = [];
    let createTileInfoPage = 0;
    let createTileInfoPageLength = 1;
    let createTileInfoprevM = "t";

    let loadMapButtons = [];
    let expandMapButtons = [];
    let undoButtons = [];
    let mapInfoControls = [];
    let tileInfoControls = [];

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
    let tileTele = "";
    let tileOccupied = "";

    let layerVisi = [1, 1, 1];
    let enableAnimations = false;

    var undoLog = [];
    var redoLog = [];

    game.position = [4, 4];
    let prePos = [-3483493, 934030];
    let currInfo = [0, 0, 1];

    modeButtons.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 0], sizeOffset: [0, 96],
        fill: "brown", alpha: 0.8,
        onClick(args) {
            protect();
        }
    }));
    modeButtons.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [0.015, 0], sizeOffset: [72 * 3 - 5, 32], offset: [0, 96],
        fill: "brown", alpha: 0.8,
        onClick(args) {
            protect();
        }
    }));
    for (i = 0; i < 3; i++) {
        modeButtons.push(controls.image({
            anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * i, 0],
            source: "layerbuttons", snip: [32 * i, 0, 32, 32], alpha: 1, i: i,
            onClick(args) {
                if (this.alpha == 1) {
                    editingLayer = this.i;
                }
            }
        }));
        modeButtons.push(controls.image({
            anchor: [0.015, 0.025], sizeOffset: [32, 32], offset: [16 + 72 * i, 72],
            source: "eye", alpha: 1, i: i,
            onClick(args) {
                if (this.alpha >= 0.5) {
                    layerVisi[this.i] = layerVisi[this.i] == 0 ? 1 : 0;
                    this.alpha = (layerVisi[this.i] / 2) + 0.5;
                    updateTiles = true;
                }
            }
        }));
    }
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 3 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 0],
        source: "move", alpha: 0, setmode: "move",
        onClick(args) {
            if (this.alpha == 1) moveMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 0],
        source: "place", alpha: 1, setmode: "place",
        onClick(args) {
            if (this.alpha == 1) placeMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 0],
        source: "erase", alpha: 1, setmode: "erase",
        onClick(args) {
            if (this.alpha == 1) eraseMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 6, 0],
        source: "movenplace", alpha: 1, setmode: "moveandplace",
        onClick(args) {
            if (this.alpha == 1) moveAndPlaceMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 7, 0],
        source: "tilemode", alpha: 1, setmode: "tile",
        onClick(args) {
            if (this.alpha == 1) tileMode();
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
            if (this.alpha == 1) {
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
            if (this.alpha == 1) toggleLoadButtons();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 10, 0],
        source: "savemap", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) saveFile("sotrm");
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 11, 0],
        source: "savemap", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) saveFile("js");
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 12, 0],
        source: "newmap", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
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
            if (this.alpha == 1) {
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
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 14, 0],
        source: "senza", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) toggleCreateTileButtons();
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
    modeButtons.push(controls.rect({
        anchor: [0.015, 0], sizeOffset: [2, 96], offset: [72 * 17 - 5, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 17, 0],
        source: "copy", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                let my = map[["map", "mapbg2", "mapfg"][editingLayer]][game.position[1]];
                let x = game.position[0];

                ttp = thetile = my[x * 4] + my[(x * 4) + 1] + my[(x * 4) + 2];
            }
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0.015, 0.025], sizeOffset: [64, 64], offset: [72 * 18, 0],
        source: "paste", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) placeTile(game.position[0], game.position[1], ["map", "mapbg2", "mapfg"][editingLayer], ttp, "copy");
        }
    }));

    createTileBG.push(controls.rect({
        anchor: [0.25, 0.15], sizeAnchor: [0.725, 0.7],
        fill: colors.buttonbottom, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) protect();
        }
    }));
    createTileBG.push(controls.rect({
        anchor: [0.25, 0.15], sizeAnchor: [0.725, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    createTileBG.push(controls.label({
        anchor: [0.6125, 0.15],
        text: "Tile Maker", alpha: 0,
    }));

    createTileBG.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.2, 0.7],
        fill: colors.buttonbottom, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) protect();
        }
    }));
    createTileBG.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.2, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    createTileBG.push(controls.label({
        anchor: [0.15, 0.15],
        text: "Info", alpha: 0,
    }));

    createTileBG.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [32, 32],
        text: "T", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) renderInfo("t");
        }
    }));
    createTileBG.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [32, 32], offset: [0, 48 * 1],
        text: "TS", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) renderInfo("ts");
        }
    }));
    createTileBG.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [32, 32], offset: [0, 48 * 2],
        text: "ID", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) renderInfo("id");
        }
    }));
    createTileBG.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [32, 32], offset: [0, 48 * 3],
        text: "M", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) renderInfo("m");
        }
    }));

    createTileBG.push(controls.button({
        anchor: [0.25, 0.85], sizeOffset: [32, 32], offset: [-80, -32],
        text: "P-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && createTileInfoPage > 0) createTileInfoPage -= 1;
            renderInfo("auto");
        }
    }));
    createTileBG.push(controls.button({
        anchor: [0.25, 0.85], sizeOffset: [32, 32], offset: [-32, -32],
        text: "P+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) createTileInfoPage += 1;
            renderInfo("auto");
        }
    }));

    for (i = 0; i < 40; i++) {
        createTileInfo.push(controls.label({
            anchor: [0.15, 0.2], offset: [0, 20 * i], fontSize: 18,
            text: "", alpha: 0,
        }));
    }

    createTileButtons.push(controls.button({
        anchor: [0.3, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile ID", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                tileID = prompt('New map tile ID? (e. g. 001)');
                this.text = "Tile ID: " + tileID;
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Sprite", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                tileSprite = prompt('New map tile sprite? (e. g. water1 - must be the name from resources)');
                this.text = "Tile Sprite: " + tileSprite;

                if (images["tiles/" + tileSprite] != undefined) createTileButtons[7].source = "tiles/" + tileSprite;
                else createTileButtons[7].source = "gear";

                tileSet = "";
                createTileButtons[3].text = "Tile Set";
                createTileButtons[3].fillTop = "darkgray";
                createTileButtons[3].fillBottom = "gray";
                this.fillTop = "red";
                this.fillBottom = "darkred";
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Occupied", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileOccupied = prompt('New map tile occupied? YES / NO / up.right.left.down');
                this.text = "Tile Occ: " + tileOccupied;
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Set", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                tileSet = prompt('New map tile set? (e. g. castle - must be the name from resources)');
                this.text = "Tile Set: " + tileSet;

                if (images["tilesets/" + tileSet] != undefined) createTileButtons[7].source = "tilesets/" + tileSet;
                else createTileButtons[7].source = "gear";

                tileSprite = "";
                createTileButtons[1].text = "Tile Sprite";
                createTileButtons[1].fillTop = "darkgray";
                createTileButtons[1].fillBottom = "gray";
                this.fillTop = "red";
                this.fillBottom = "darkred";
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Set Snip", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSetSnip = prompt('New map tile set snip? X.Y (e. g. 1.2  - 0.0 for top left)');
                this.text = "Set Snip: " + tileSetSnip;

                if (images["tilesets/" + tileSet] != undefined) createTileButtons[7].snip = [parseInt(tileSetSnip.split(".")[0]) * 32, parseInt(tileSetSnip.split(".")[1]) * 32, 32, 32];
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Animation", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileAni = prompt('New map tile set snip? X.Y (e. g. 1.1)');
                this.text = "Animation: " + tileAni;
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.75, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Teleport", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileTele = prompt('Teleport to? map.x.y (e. g. original.7.8 or map2.0.0)');
                this.text = "Teleport: " + tileTele;
            }
        }
    }));
    createTileButtons.push(controls.image({
        anchor: [0.25, 0.325], sizeOffset: [64, 64], offset: [72 * 16 -32, -632],
        source: "gear",
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "CREATE!", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                if (images["tiles/" + tileSprite] == undefined && images["tilesets/" + tileSet] == undefined) {
                    alert("You have to set a valid sprite or a set!");
                    return false;
                }
                if (tileID == "" || map.tiles[tileID] != undefined) {
                    alert("You have to set an ID that does not exist yet!");
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

                    if (tileTele != "") map.tiles[tileID].teleport = [tileTele.split(".")[0], parseInt(tileTele.split(".")[1]), parseInt(tileTele.split(".")[2])];

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
                    createTileButtons[4].text = "Set Snip";
                    createTileButtons[5].text = "Animation";
                    createTileButtons[6].text = "Teleport";

                    createTileButtons[7].source = "gear";
                }
                catch {
                    alert("An error occured!");
                }
                toggleCreateTileButtons();
            }
        }
    }));


    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from file...", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) showSelect();
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.35], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from name...", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newMapn = prompt("Map name? (e. g. test)");
                if (maps[newMapn] != undefined) currentMap = newMapn;
                map = maps[currentMap];
                if (loadMapButtons[0].alpha == 1) toggleLoadButtons();
                newMap();
            }
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "senza", alpha: 1, ri: true,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
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
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "senza", alpha: 1, ri: true,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                map.map.unshift("---");
                map.mapbg2.unshift("---");
                map.mapfg.unshift("---");
                updateTiles = true;
                newMap();
            }
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "senza", alpha: 1, ri: true,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
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
        }
    }));

    expandMapButtons.push(controls.image({
        anchor: [0, 0], sizeOffset: [64, 64], offset: [0, 0],
        source: "senza", alpha: 1, ri: true,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                map.map.shift();
                map.mapbg2.shift();
                map.mapfg.shift();
                updateTiles = true;
                newMap();
            }
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
            source: "gear", alpha: 0, glowColor: "white", glow: 0,
            // tile: the tile, with sprite, occupied, etc.
            // tileid: 001, 002, etc.
            onClick(args) {
                if (this.alpha == 1) {
                    ttp = this.tileid;
                    for (t in tilesMenuTiles) {
                        tilesMenuTiles[t].glow = 0;
                    }
                    this.glow = 25;
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
            if (this.alpha == 1) {
            protect();
            this.snip[0] = 0;
                pad = "";
            }
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
            if (this.alpha == 1) {
                protect();
            }
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
            if (this.alpha == 1) {
            protect();
            this.snip[0] = 0;
                pad = "";
            }
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
            if (this.alpha == 1) {
            protect();
            this.snip[0] = 0;
                pad = "";
            }
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
            if (this.alpha == 1) {
                protect();
                this.snip[0] = 0;
                pad = "";
            }
        }
    }));

    let backButton = controls.button({
        anchor: [0.02, 0.925], sizeAnchor: [0.05, 0.045],
        text: "<",
        onClick(args) {
            if (this.alpha == 1) {
                setScene(scenes.pretitle());
            }
        },
        alpha: 1,
    });

    let toggleMapInfoButton = controls.button({
        anchor: [0.02, 0.85], sizeAnchor: [0.05, 0.045],
        text: "(i)",
        onClick(args) {
            if (this.alpha == 1) {
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
                    if (mode == "move" || mode == "moveandplace") {
                        for (w in walkPad) {
                            walkPad[w].alpha = 1;
                        }
                    }
                }
            }
        },
        alpha: 1,
    });

    let eyeButton = controls.image({
        anchor: [0.02, 0.775], sizeAnchor: [0.05, 0.045],
        source: "eye",
        onClick(args) {
            protect();
            if (this.alpha == 1) {
                for (m in modeButtons) {
                    modeButtons[m].va = modeButtons[m].alpha;
                    modeButtons[m].alpha = 0;
                }
                for (w in walkPad) {
                    walkPad[w].alpha = 0;
                }
                for (u in undoButtons) {
                    undoButtons[u].alpha = 0;
                }
                currentMapText.alpha = 0;
                toggleMapInfoButton.alpha = 0;
                backButton.alpha = 0;
                toggleAnimate.alpha = 0;
                this.alpha = 0.5;
            }
            else {
                for (m in modeButtons) {
                    modeButtons[m].alpha = modeButtons[m].va;
                }
                for (w in walkPad) {
                    walkPad[w].alpha = 1;
                }
                for (u in undoButtons) {
                    undoButtons[u].alpha = 1;
                }
                currentMapText.alpha = 1;
                toggleMapInfoButton.alpha = 1;
                backButton.alpha = 1;
                toggleAnimate.alpha = 1;
                this.alpha = 1;
            }
        },
        alpha: 1,
    });

    let toggleAnimate = controls.button({
        anchor: [0.02, 0.7], sizeAnchor: [0.05, 0.045],
        text: "ani:off",
        onClick(args) {
            if (this.alpha == 1) {
                if (this.text == "ani:off") {
                    enableAnimations = true;
                    this.text = "ani:on";
                }
                else {
                    enableAnimations = false;
                    this.text = "ani:off";
                }
                updateTiles = true;
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
        text: "Map Info / Settings", alpha: 0,
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
        text: "Weather Strength: " + map.weatherStrength, alpha: 0,
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
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Empty sprite: " + map.tiles.empty.sprite, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newSprite = prompt("New empty sprite? (e. g. water1)");
                if (images["tiles/" + newSprite] != undefined) {
                    map.tiles.empty.sprite = newSprite;
                    this.text = "Empty sprite: " + newSprite;
                    updateTiles = true;
                }
                else {
                    alert("Error: Does not exist!")
                }
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Max. enemies: " + map.maxEnemies, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                map.maxEnemies = Math.max(0, Math.round(prompt("New max.? (e. g. 8)")));
                this.text = "Max. enemies: " + map.maxEnemies;
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
        ri: true,
        source: "selectedtile",
        alpha: 1,
    });

    tileInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.6],
        fill: colors.buttonbottompressed, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
            }
        }
    }));
    tileInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.6], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontoppressed, alpha: 0,
    }));
    tileInfoControls.push(controls.button({
        anchor: [0.95, 0.15], sizeOffset: [64, 40], offset: [-64, 0],
        text: "X", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                for (tic in tileInfoControls) {
                    tileInfoControls[tic].alpha = 0;
                }
            }
        }
    }));
    tileInfoControls.push(controls.label({
        anchor: [0.5, 0.15],
        text: "Tile Info", alpha: 0,
    }));

    tileInfoControls.push(controls.image({
        anchor: [0.05, 0.15], sizeOffset: [64, 64], offset: [40, 40],
        source: "tiles/water1", alpha: 0,
    }));
    tileInfoControls.push(controls.label({
        anchor: [0.5, 0.15], offset: [0, 80],
        text: "water1", alpha: 0,
    }));
    for (t = 0; t < 7; t++) {
        tileInfoControls.push(controls.label({
            anchor: [0.5, 0.2 + (0.05 * t)], offset: [0, 80],
            text: "ERROR", alpha: 0,
        }));
    }
    tileInfoControls.push(controls.image({
        anchor: [0.05, 0.5], sizeOffset: [64, 64], offset: [40, 40],
        source: "tiles/water1", alpha: 0,
    }));

    tileInfoControls.push(controls.button({
        anchor: [0.4, 0.625], sizeAnchor: [0.2, 0.1],
        text: "Place item here", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let itemToPlace = prompt("Desired item name? (the one defined in items, e. g. revive)");
                let amount = prompt("Desired item amount? (e. g. 1)");
                if (items[itemToPlace] == undefined) {
                    alert("Does not exist!");
                }
                else {
                    if (amount == "") amount = 1;
                    if (map.items == undefined) {
                        map.items = [];
                    }
                    map.items.push([currInfo[0], currInfo[1], itemToPlace, parseInt(amount), true]);
                    // Update
                    tileInfo(currInfo[0], currInfo[1], ["map", "mapbg2", "mapfg"][currInfo[2] - 1]);
                    updateTiles = true;
                }
            }
        }
    }));

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
            for (i in createTileBG) {
                createTileBG[i].alpha = 1;
            }

            createTileInfoPageLength = 0;

            let red = 1;
            if (isLs()) red = 2;

            for (i in createTileInfo) {
                if (height * 0.6 * red > i * 20) {
                    createTileInfoPageLength += 1;
                    createTileInfo[i].alpha = 1;
                }
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
            for (i in createTileBG) {
                createTileBG[i].alpha = 0;
            }
            for (i in createTileInfo) {
                createTileInfo[i].alpha = 0;
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

    function renderInfo(type) {
        let grabFrom = [];

        if (type == "auto") type = createTileInfoprevM;
        else createTileInfoprevM = type;

        switch (type) {
            case "t":
                for (i in Object.keys(images)) {
                    if (Object.keys(images)[i].substr(0, 6) == "tiles/") grabFrom.push(Object.keys(images)[i].substr(6));
                }
                break;
            case "ts":
                for (i in Object.keys(images)) {
                    if (Object.keys(images)[i].substr(0, 9) == "tilesets/") grabFrom.push(Object.keys(images)[i].substr(9));
                }
                break;
            case "id":
                grabFrom = Object.keys(Object.assign({}, map.tiles, commontiles));
                break;
            case "m":
                grabFrom = Object.keys(maps);
                break;
        }
        for (g = 0; g < 40; g++) {
            if (grabFrom[g + (createTileInfoPage * createTileInfoPageLength)] != undefined) {
                createTileInfo[g].text = grabFrom[g + (createTileInfoPage * createTileInfoPageLength)];
            }
            else {
                createTileInfo[g].text = "";
            }
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

    function hideOtherModes(thisMode) {
        for (m in modeButtons) {
            if ((modeButtons[m].setmode == undefined || modeButtons[m].setmode != thisMode) && (modeButtons[m].alpha == 0 || modeButtons[m].alpha == 1)) modeButtons[m].alpha = 1;
            else if (modeButtons[m].alpha == 0 || modeButtons[m].alpha == 1) modeButtons[m].alpha = 0;
        }
    }

    function moveMode() {
        mode = "move";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        hideOtherModes("move");
    }

    function placeMode() {
        mode = "place";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        hideOtherModes("place");
    }

    function eraseMode() {
        mode = "erase";
        for (w in walkPad) {
            walkPad[w].alpha = 0;
        }
        hideOtherModes("erase");
    }

    function moveAndPlaceMode() {
        mode = "moveandplace";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        hideOtherModes("moveandplace");
    }

    function tileMode() {
        mode = "tile";
        for (w in walkPad) {
            walkPad[w].alpha = 1;
        }
        hideOtherModes("tile");
    }

    function openTilesMenu() {
        let red = isLs() ? 2 : 1;

        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 1;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
            tilesMenuTiles[t].glow = 0;
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
                        if (images["tilesets/" + grb.set] != undefined) tilesMenuTiles[nr].source = "tilesets/" + grb.set;
                        else tilesMenuTiles[nr].source = "gear";
                        tilesMenuTiles[nr].snip = [grb.snip[0] * 32, grb.snip[1] * 32, 32, 32];
                    }
                    else{
                        if (images["tiles/" + grb.sprite] != undefined) tilesMenuTiles[nr].source = "tiles/" + grb.sprite;
                        else tilesMenuTiles[nr].source = "gear";
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
        prot = true;
        prott = 100;
    }

    function placeTile(x, y, layer, tileToPlace="none", umode="default") {
        if (x < 0 || y < 0) {
            return false;
        }

        let mp = map[layer][y];
        let def = "---";

        //if (layer == "map") def = "002";

        if (mode == "place" || mode == "moveandplace" || umode == "undo" || umode == "copy") {
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
            map[layer][y] = mp.substr(0, x * 4) + "--- " + mp.substr((1 + x) * 4);
            map[layer][y] = map[layer][y].replace(/  /gi, " ");
            updateTiles = true;
        }
    }

    function tileInfo(x, y, layer) {
        if (x < 0 || y < 0) {
            return false;
        }

        let l = 1;
        if (layer == "mapbg2") l = 2;
        if (layer == "mapfg") l = 3;

        currInfo = [x, y, l];

        let selectedTile = getTile(map, x, y, l);
        if (selectedTile == undefined) selectedTile = map.tiles.empty;
        let selectedTileID = "empty";
        if (map[layer][y] != undefined) selectedTileID = map[layer][y].substr(x * 4, 3);

        if (selectedTile.set != undefined) {
            tileInfoControls[4].source = "tilesets/" + selectedTile.set;
            tileInfoControls[4].snip = [selectedTile.snip[0] * 32, selectedTile.snip[1] * 32, 32, 32];
            tileInfoControls[5].text = "Set: " + selectedTile.set;
        }
        else {
            tileInfoControls[4].source = "tiles/" + selectedTile.sprite;
            tileInfoControls[4].snip = [0, 0, 32, 32];
            tileInfoControls[5].text = "Sprite: " + selectedTile.sprite;
        }
        tileInfoControls[6].text = "ID: " + selectedTileID;
        tileInfoControls[7].text = "Layer: " + layer + " (" + l + "/3)";
        tileInfoControls[8].text = "Occupied: " + (selectedTile.occupied == undefined ? "not" : selectedTile.occupied);
        tileInfoControls[9].text = "Animated: " + (selectedTile.ani == undefined ? "not" : selectedTile.ani);
        tileInfoControls[10].text = "Teleport: " + (selectedTile.teleport == undefined ? "not" : selectedTile.teleport);
        tileInfoControls[11].text = "Swim: " + (selectedTile.swim == undefined ? "not" : selectedTile.swim);

        // Item display
        let thisTilesItem;
        for (i in map.items) {
            if (map.items[i][0] == x && map.items[i][1] == y) thisTilesItem = map.items[i];
        }
        tileInfoControls[12].text = "Item: " + (thisTilesItem == undefined ? "not" : map.items[i][2] + " x" + map.items[i][3]);
        if (thisTilesItem != undefined) tileInfoControls[13].source = "items/" + items[map.items[i][2]]().source;
        else tileInfoControls[13].source = "gear";

        // Show it all
        for (tic in tileInfoControls) {
            tileInfoControls[tic].alpha = 1;
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
                        else if (mode == "tile") tileInfo(this.pos[0], this.pos[1], "map");
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
                        else if (mode == "tile") tileInfo(this.pos[0], this.pos[1], "mapbg2");
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
                        else if (mode == "tile") tileInfo(this.pos[0], this.pos[1], "mapfg");
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
                        currentMap = lmresult.id;
                        map = maps[lmresult];
                        newMap();
                    }
                    else {
                        // It does not hmm
                        map = lmresult;
                        if (map.map == undefined) {
                            map.map = ["--- --- 001 001 001", "--- --- 001 001 001", "--- --- 001 001 001"];
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


            if (!kofs[2] && canMove == true && (mode == "move" || mode == "moveandplace" || mode == "tile")) {
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

            if (enableAnimations) {
                animateTime = (animateTime + delta / 1000) % 2;

                for (ti in tiles_fg) {
                    if (tiles_bg[ti].ani != undefined) {
                        tiles_bg[ti].snip = [Math.floor(tiles_bg[ti].ani[0] * (animateTime / 2)) * (32 * tiles_bg[ti].ani[1]) + tiles_bg[ti].isnip[0], tiles_bg[ti].isnip[1], 32, 32];
                    }
                    if (tiles_bg2[ti].ani != undefined) {
                        tiles_bg2[ti].snip = [Math.floor(tiles_bg2[ti].ani[0] * (animateTime / 2)) * (32 * tiles_bg2[ti].ani[1]) + tiles_bg2[ti].isnip[0], tiles_bg2[ti].isnip[1], 32, 32];
                    }
                    if (tiles_fg[ti].ani != undefined) {
                        tiles_fg[ti].snip = [Math.floor(tiles_fg[ti].ani[0] * (animateTime / 2)) * (32 * tiles_fg[ti].ani[1]) + tiles_fg[ti].isnip[0], tiles_fg[ti].isnip[1], 32, 32];
                    }
                }
            }

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
                    tiles_bg[b].alpha = layerVisi[0];
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
                            // Animate stuff
                            if (getTile(map, x, y).ani != undefined && enableAnimations) {
                                tiles_bg[b].isnip = [getTile(map, x, y).snip[0] * 32, getTile(map, x, y).snip[1] * 32, 32, 32];
                                tiles_bg[b].ani = getTile(map, x, y).ani;
                            }
                            else {
                                tiles_bg[b].ani = undefined;
                            }
                        }
                        else {
                            tiles_bg[b].source = "tiles/" + map.tiles.empty.sprite;
                            tiles_bg[b].snip = false;
                            tiles_bg[b].ani = undefined;
                            tiles_bg[b].alpha = 1;
                        }
                    }
                    else if (map.tiles.empty) {
                        if (x == -1) tiles_bg[b].source = "tiles/border";
                        else if (y == -1) tiles_bg[b].source = "tiles/border2";
                        else tiles_bg[b].source = "tiles/" + map.tiles.empty.sprite;
                        tiles_bg[b].snip = false;
                        tiles_bg[b].ani = undefined;
                        tiles_bg[b].alpha = 1;
                    }
                    tiles_bg[b].pos = [x, y];

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
                            // Animate stuff
                            if (getTile(map, x, y, 2).ani != undefined && enableAnimations) {
                                tiles_bg2[b2].isnip = [getTile(map, x, y, 2).snip[0] * 32, getTile(map, x, y, 2).snip[1] * 32, 32, 32];
                                tiles_bg2[b2].ani = getTile(map, x, y, 2).ani;
                            }
                            else {
                                tiles_bg2[b2].ani = undefined;
                            }
                            tiles_bg2[b2].alpha = layerVisi[1];
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
                            // Animate stuff
                            if (getTile(map, x, y, 3).ani != undefined && enableAnimations) {
                                tiles_fg[t].isnip = [getTile(map, x, y, 3).snip[0] * 32, getTile(map, x, y, 3).snip[1] * 32, 32, 32];
                                tiles_fg[t].ani = getTile(map, x, y, 3).ani;
                            }
                            else {
                                tiles_fg[t].ani = undefined;
                            }
                            tiles_fg[t].alpha = layerVisi[2];
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
            ...walkPad, middlei, currentMapText, backButton, toggleMapInfoButton, eyeButton, toggleAnimate, ...modeButtons,
            ...tilesMenuControls, ...undoButtons, ...loadMapButtons, ...createTileBG, ...createTileInfo, ...createTileButtons, ...tilesMenuTiles, ...mapInfoControls, ...tileInfoControls,
        ],
        name: "mapmaker"
    }
}