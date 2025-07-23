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
        if (noid) {
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

var map;

scenes.mapmaker = () => {

    let walkPad = [];
    let walkPadSize = Math.max(32, 64 * settings.walkPadSize);
    let pad;
    let modeButtons = [];
    let updateTiles = false;

    let tilesMenuControls = [];
    let tilesMenuTiles = [];
    let recentlyUsedTiles = [];
    let recentlyUsedTilesList = [];
    let tilesMenuIcons = [];

    let createTileButtons = [];
    let createTileBG = [];
    let makerInfo = [];
    let makerInfoText = [];
    let createTileInfoPage = 0;
    let createTileInfoPageLength = 1;
    let createTileInfoprevM = "t";

    let createDialogueButtons = [];
    let createDialogueLabels = [];

    let createNPCButtons = [];
    let createNPCLabels = [];

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
    let visibleCollision = false;

    let curDia = ""; // current dialogue
    let curLine = 0; // current dialogue

    let curNPC = ""; // current dialogue

    var activenpcs = [];
    var currentMap = "newMap";
    map = maps[currentMap];
    map.tiles = Object.assign({}, map.tiles, loadPacks(map));

    let loadFromAutoSave = localStorage.getItem("SRPGMM");
    if (loadFromAutoSave != undefined && loadFromAutoSave != "empty") {
        map = JSON.parse(loadFromAutoSave);
        map.tiles = Object.assign({}, map.tiles, loadPacks(map));
        currentMap = map.id;
    }

    let autoSaveTime = 0;

    var mode = "moveandplace";
    var prevmode = "moveandplace";
    var fillToolActive = false;
    var tilesFilled = 0;

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
    let tileDia = "";
    let tileSwim = "";
    let tileOccupied = "";
    var mapIdentifier = "";

    let layerVisi = [1, 1, 1];
    let enableAnimations = false;

    var undoLog = [];
    var redoLog = [];

    game.position = [4, 4];
    let prePos = [-3483493, 934030];
    let currInfo = [0, 0, 1];

    let autoSaveText = controls.label({
        anchor: [.025, .98], offset: [12, -12],
        fontSize: 16, text: "Game saved!", alpha: 0,
    });

    // ------------------------------------------
    // MODE BUTTONS - move+place, eraser, tile picker, undo, etc.
    // all the stuff on the left side
    // ------------------------------------------
    modeButtons.push(controls.rect({ // the big bg rect
        anchor: [0, 0], sizeAnchor: [0, 1], sizeOffset: [72 * 6, 0],
        fill: "brown", alpha: 0.8,
        onClick(args) {
            if (!prot && this.alpha > 0) protect();
        }
    }));

    undoButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 1, 72 * 2],
        source: "undo", alpha: 0,
        onClick(args) {
            if (undoLog.length == 0) this.alpha = 0;
            else if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
                let shifterCoords = [undoLog[0][0], undoLog[0][1], undoLog[0][2], undoLog[0][3]];
                while (undoLog[0][0] == shifterCoords[0]
                    && undoLog[0][1] == shifterCoords[1]
                    && undoLog[0][2] == shifterCoords[2]
                    && undoLog[0][3] == shifterCoords[3]) {
                    placeTile(undoLog[0][0], undoLog[0][1], undoLog[0][2], undoLog[0][3], "undo");
                    undoLog.shift();
                }
                if (undoLog[0][0] == shifterCoords[0]
                    && undoLog[0][1] == shifterCoords[1]
                    && undoLog[0][2] == shifterCoords[2]) {
                    placeTile(undoLog[0][0], undoLog[0][1], undoLog[0][2], undoLog[0][3], "undo");
                    undoLog.shift();
                }
                if (undoLog.length == 0) this.alpha = 0;
            }
        }
    }));
    undoButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 2, 72 * 2],
        source: "redo", alpha: 0,
        onClick(args) {
            if (redoLog.length == 0) this.alpha = 0;
            else if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
                let shifterCoords = [redoLog[0][0], redoLog[0][1], redoLog[0][2], redoLog[0][3]];
                while (redoLog[0][0] == shifterCoords[0]
                    && redoLog[0][1] == shifterCoords[1]
                    && redoLog[0][2] == shifterCoords[2]
                    && redoLog[0][3] == shifterCoords[3]) {
                    placeTile(redoLog[0][0], redoLog[0][1], redoLog[0][2], redoLog[0][3]);
                    redoLog.shift();
                }
                if (redoLog[0][0] == shifterCoords[0]
                    && redoLog[0][1] == shifterCoords[1]
                    && redoLog[0][2] == shifterCoords[2]) {
                    placeTile(redoLog[0][0], redoLog[0][1], redoLog[0][2], redoLog[0][3]);
                    redoLog.shift();
                }
                if (redoLog.length == 0) this.alpha = 0;
            }
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [0, 72 * 2],
        source: "mmzoom", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
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
    for (i = 0; i < 3; i++) {
        modeButtons.push(controls.image({
            anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * i, 0],
            source: "layerbuttons", snip: [32 * i, 0, 32, 32], alpha: 1, i: i, glowColor: "white",
            onClick(args) {
                if (this.alpha == 1 && !prot) {
                    editingLayer = this.i;
                    modeButtons[2].glow = 0;
                    modeButtons[4].glow = 0;
                    modeButtons[6].glow = 0;
                    this.glow = 10;
                }
            }
        }));
        modeButtons.push(controls.image({
            anchor: [0, 0.025], sizeOffset: [48, 48], offset: [8 + 72 * i, 64],
            source: "eye", alpha: 1, i: i,
            onClick(args) {
                if (this.alpha >= 0.3 && !prot) {
                    layerVisi[this.i] = layerVisi[this.i] == 0 ? 1 : 0;
                    this.alpha = layerVisi[this.i] == 0 ? 0.3 : 1;
                    updateTiles = true;
                }
            }
        }));
    }
    modeButtons[2].glow = 10;

    // modes (move, erase, etc.)
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 0, 72 * 3],
        source: "move", alpha: 0, setmode: "move",
        onClick(args) {
            if (this.alpha == 1 && !prot) moveMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 1, 72 * 3],
        source: "place", alpha: 1, setmode: "place",
        onClick(args) {
            if (this.alpha == 1 && !prot) placeMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 2, 72 * 3],
        source: "erase", alpha: 1, setmode: "erase",
        onClick(args) {
            if (this.alpha == 1 && !prot) eraseMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 72 * 3],
        source: "movenplace", alpha: 1, setmode: "moveandplace",
        onClick(args) {
            if (this.alpha == 1 && !prot) moveAndPlaceMode();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 72 * 3],
        source: "tilemode", alpha: 1, setmode: "tile",
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                if (tilesMenuControls[0].alpha == 1) {
                    tileInfo(0, 0, 0, ttp);
                }
                else {
                    tileMode();
                }
            }
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 72 * 1],
        source: "tilesmenu", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
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

    // this is now load + save + delete in 1
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 72 * 1],
        source: "loadmap", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                toggleLoadButtons();
            }
        }
    }));

    // the maker buttons
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 72 * 0],
        source: "tilemaker", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) toggleCreateTileButtons();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 72 * 0],
        source: "dialoguemaker", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) toggleCreateDialogueButtons();
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 72 * 0],
        source: "npcmaker", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) toggleCreateNPCButtons();
        }
    }));

    // copy, paste, fill
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 3, 72 * 2],
        source: "copy", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                let my = map[["map", "mapbg2", "mapfg"][editingLayer]][game.position[1]];
                let x = game.position[0];

                if (my == undefined) return false;
                updateTTP(my[x * 4] + my[(x * 4) + 1] + my[(x * 4) + 2]);
            }
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 4, 72 * 2],
        source: "paste", alpha: 1,
        onClick(args) {
            if (this.alpha == 1 && !prot) placeTile(game.position[0], game.position[1], ["map", "mapbg2", "mapfg"][editingLayer], ttp, "copy");
        }
    }));
    modeButtons.push(controls.image({
        anchor: [0, 0.025], sizeOffset: [64, 64], offset: [72 * 5, 72 * 2],
        source: "fill", alpha: 1, glow: 0, glowColor: "white",
        onClick(args) {
            if (this.alpha == 1 && !prot) {
                tilesFilled = 0;
                if (fillToolActive) {
                    fillToolActive = false;
                    this.glow = 0;
                }
                else {
                    fillToolActive = true;
                    this.glow = 10;
                }
            }
        }
    }));

    // white lines
    modeButtons.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [0, 1], sizeOffset: [2, 0], offset: [72 * 6, 0],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.rect({
        anchor: [0, 0.025], sizeOffset: [72 * 6, 2], offset: [0, 72 * 4],
        fill: "white", alpha: 0.8,
    }));
    modeButtons.push(controls.rect({
        anchor: [0, 0.025], sizeOffset: [72 * 6, 2], offset: [0, 72 * 8],
        fill: "white", alpha: 0.8,
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

    makerInfo.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.2, 0.7],
        fill: colors.buttonbottom, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) protect();
        }
    }));
    makerInfo.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.2, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    makerInfo.push(controls.label({
        anchor: [0.15, 0.15],
        text: "Maker Info", alpha: 0,
    }));

    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 0],
        text: "Tiles", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("t");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 1],
        text: "Tilesets", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("ts");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 2],
        text: "Tile IDs", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("id");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 3],
        text: "Maps", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("m");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 4],
        text: "Enemies", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("e");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 5],
        text: "Enemy Spawns", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("es");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 6],
        text: "Dialogues", alpha: 0, align: "right",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("d");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 7],
        text: "Portraits", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("p");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.05, 0.15], sizeOffset: [96, 56], offset: [-64, 64 * 8],
        text: "NPCs", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                renderInfo("npcs");
            }
        }
    }));

    makerInfo.push(controls.button({
        anchor: [0.25, 0.85], sizeOffset: [64, 56], offset: [-144, -32],
        text: "P-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && createTileInfoPage > 0) {
                protect();
                createTileInfoPage -= 1;
                renderInfo("auto");
            }
        }
    }));
    makerInfo.push(controls.button({
        anchor: [0.25, 0.85], sizeOffset: [64, 56], offset: [-64, -32],
        text: "P+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                createTileInfoPage += 1;
                renderInfo("auto");
            }
        }
    }));

    for (i = 0; i < 30; i++) {
        makerInfoText.push(controls.label({
            anchor: [0.15, 0.2], offset: [0, 26 * i], fontSize: 24,
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

                if (map.tiles[tileID] != undefined || commontiles[tileID] != undefined) {
                    let thisTile;
                    if (map.tiles[tileID] != undefined) thisTile = map.tiles[tileID];
                    if (commontiles[tileID] != undefined) thisTile = commontiles[tileID];

                    if (thisTile.sprite != undefined) tileSprite = thisTile.sprite;
                    if (thisTile.occupied != undefined) tileOccupied = thisTile.occupied.toString();
                    if (thisTile.set != undefined) tileSet = thisTile.set;
                    if (thisTile.snip != undefined) tileSetSnip = thisTile.snip.toString().replace(",", ".");
                    if (thisTile.ani != undefined) tileAni = thisTile.ani.toString().replace(",", ".");
                    if (thisTile.teleport != undefined) tileTele = thisTile.teleport.toString().replace(",", ".").toString().replace(",", ".");
                    if (thisTile.dialogue != undefined) tileDia = thisTile.dialogue;
                    if (thisTile.swim != undefined) tileSwim = thisTile.swim.toString();
                }
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Sprite", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                tileSprite = prompt('New map tile sprite? (e. g. water - must be the name from resources)');
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Tile Occupied", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileOccupied = prompt('New map tile occupied? YES / NO / up.right.left.down');
                updateTileLabels();
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
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Set Snip", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSetSnip = prompt('New map tile set snip? X.Y (e. g. 1.2  - 0.0 for top left)');

                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Animation", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileAni = prompt('New map tile animation? amount.distance (e. g. 1.1)');
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.75, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Teleport", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileTele = prompt('Teleport to? map.x.y (e. g. original.7.8 or map2.0.0)');
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.75, 0.45], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Dialogue", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileDia = prompt('Dialogue?');
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.75, 0.575], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Swim", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSwim = prompt('Swim? (YES / NO)');
                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.image({
        anchor: [0.25, 0.325], sizeOffset: [64, 64], offset: [72 * 16 - 32, -632],
        source: "gear", alpha: 0,
    }));
    createTileButtons.push(controls.image({
        anchor: [0.7, 0], sizeAnchor: [0.3, 0.3],
        source: "gear", alpha: 0,
    }));
    createTileButtons.push(controls.button({
        anchor: [0.3, 0.7], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "CREATE!", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                createTile("map");
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.7], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Copy", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "") {
                createTile("copy");
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.75, 0.7], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "AutoID C00", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "") {
                if (mapIdentifier == "") {
                    let inputMI = prompt("new map identifier?");
                    if (inputMI != undefined && inputMI != null && inputMI != "") {
                        mapIdentifier = inputMI.toString();
                    }
                }

                let cordX = parseInt(tileSetSnip.split(".")[0]);
                let cordY = parseInt(tileSetSnip.split(".")[1]);

                let tempName = cordX + (cordY * 10);
                tempName = tempName.toString();

                if (tempName.length == 1) tileID = mapIdentifier + "0" + tempName;
                else tileID = mapIdentifier + tempName.substr(0, 2);

                // console.log(cordX, cordY, tempName, tileID);

                updateTileLabels();
            }
        }
    }));
    createTileButtons.push(controls.button({
        anchor: [0.25, 0.2], sizeAnchor: [0.05, 0.1], offset: [72 * 16, -600],
        text: "DEL", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                clearTile();

                updateTileLabels();
            }
        }
    }));

    // X-
    createTileButtons.push(controls.button({
        anchor: [0.525, 0.575], sizeAnchor: [0.05, 0.1], offset: [72 * 16, -600],
        text: "X-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "" && tileSetSnip.split(".")[0] > 0) {
                tileSetSnip = (parseInt(tileSetSnip.split(".")[0]) - 1) + "." + tileSetSnip.split(".")[1];
                updateTileLabels();
            }
        }
    }));
    // X+
    createTileButtons.push(controls.button({
        anchor: [0.575, 0.575], sizeAnchor: [0.05, 0.1], offset: [72 * 16, -600],
        text: "X+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "") {
                tileSetSnip = (parseInt(tileSetSnip.split(".")[0]) + 1) + "." + tileSetSnip.split(".")[1];
                updateTileLabels();
            }
        }
    }));
    // Y-
    createTileButtons.push(controls.button({
        anchor: [0.625, 0.575], sizeAnchor: [0.05, 0.1], offset: [72 * 16, -600],
        text: "Y-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "" && tileSetSnip.split(".")[1] > 0) {
                tileSetSnip = tileSetSnip.split(".")[0] + "." + (parseInt(tileSetSnip.split(".")[1]) - 1);
                updateTileLabels();
            }
        }
    }));
    // Y+
    createTileButtons.push(controls.button({
        anchor: [0.675, 0.575], sizeAnchor: [0.05, 0.1], offset: [72 * 16, -600],
        text: "Y+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && tileSetSnip != "") {
                tileSetSnip = tileSetSnip.split(".")[0] + "." + (parseInt(tileSetSnip.split(".")[1]) + 1);
                updateTileLabels();
            }
        }
    }));

    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.1], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from file...", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                showSelect();
            }
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.25], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Load from name...", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                let newMapn = prompt("Map name? (e. g. test)");
                if (maps[newMapn] != undefined) {
                    currentMap = newMapn;
                    map = maps[currentMap];
                }
                if (loadMapButtons[0].alpha == 1) toggleLoadButtons();
                hideInfo();
                newMap();
            }
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.4], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Play", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let toPos = [game.position[0], game.position[1]];

                saveNR = 0;
                loadGame();
                loadSettings();

                maps[currentMap] = map;

                game.map = currentMap;
                game.map.tiles = Object.assign({}, game.map.tiles, loadPacks());
                game.position = toPos;

                canMove = true;
                isMapTestingMode = true;
                setScene(scenes.game());
            }
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.55], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Save as .sotrm", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                saveFile("sotrm");
            }
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.7], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Save as .js", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                saveFile("js");
            }
        }
    }));
    loadMapButtons.push(controls.button({
        anchor: [0.3, 0.85], sizeAnchor: [0.2, 0.1], offset: [72 * 11, -600],
        text: "Delete", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                if (confirm("Do you really want to create a new map?") == true) {
                    createNewMap("newMap");
                }
            }
        }
    }));

    function createNewMap(mapName) {
        currentMap = mapName;
        map = { // CREATE NEW MAP
            id: mapName,
            tiles: {
                empty: {
                    sprite: "empty"
                },
            },
            map: ["---"],
            mapbg2: ["---"],
            mapfg: ["---"],

            // useful default values
            name: "newMap",
            maxEnemies: 8,
            weather: "none",
            weatherStrength: 1,
            worldmode: false
        }
        newMap();
    }

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

    // Create Dialogue
    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Create New / Load", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                curDia = prompt('Dialogue ID? (e. g. 1)');
                if (map.dialogues == undefined) {
                    map.dialogues = {};
                }
                if (map.dialogues[curDia] == undefined) {
                    map.dialogues[curDia] = {
                        "type": "normal", "lines": [{
                            "text": "",
                            "portrait": "Portraits_Bleu",
                            "emotion": "neutral",
                            "name": "Bleu",
                            "voice": false
                        }]
                    };
                }
                curLine = 0;
                this.text = "Dialogue: " + curDia;
                toggleCreateDialogueButtons(true);
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.525, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Type: Normal", alpha: 0,
        fillTop: "red", fillBottom: "darkred",
        onClick(args) {
            if (this.alpha == 1) {
                switch (map.dialogues[curDia].type) {
                    case "normal":
                        map.dialogues[curDia].type = "invis";
                        this.text = "Type: Invisible";
                        break;
                    case "invis":
                        map.dialogues[curDia].type = "narrator";
                        this.text = "Type: Narrator";
                        break;
                    case "narrator":
                        map.dialogues[curDia].type = "cinematic";
                        this.text = "Type: Cinematic";
                        break;
                    case "cinematic":
                        map.dialogues[curDia].type = "normal";
                        this.text = "Type: Normal";
                        break;
                }
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Add line", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                map.dialogues[curDia].lines.push(
                    {
                        "text": "",
                        "portrait": "Portraits_Bleu",
                        "emotion": "neutral",
                        "name": "Bleu",
                        "voice": false
                    });
                curLine = map.dialogues[curDia].lines.length - 1;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.75, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Remove this line", alpha: 0,
        onClick(args) {
            if (this.alpha == 1 && curLine >= 0) {
                map.dialogues[curDia].lines.splice(curLine, 1);
                if (curLine >= 0) curLine -= 1;
                if (curLine == -1) {
                    map.dialogues[curDia].lines.push(
                        {
                            "text": "",
                            "portrait": "Portraits_Bleu",
                            "emotion": "neutral",
                            "name": "Bleu",
                            "voice": false
                        });
                    curLine = 0;
                }
                updateDialogueLabels();

            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.525, 0.325], sizeAnchor: [0.075, 0.1], offset: [72 * 16, -600],
        text: "Prev.", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (curLine > 0) curLine -= 1;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.65, 0.325], sizeAnchor: [0.075, 0.1], offset: [72 * 16, -600],
        text: "Next", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (curLine < map.dialogues[curDia].lines.length - 1) curLine += 1;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueLabels.push(controls.label({
        anchor: [0.625, 0.375], offset: [0, -600],
        text: "0",
        fontSize: 32, fill: "white", align: "center",
        alpha: 0,
    }));

    for (i = 0; i < 6; i++) {
        createDialogueLabels.push(controls.label({
            anchor: [0.375, 0.475 + (0.06 * i)], offset: [0, -600],
            text: "...",
            fontSize: 32, fill: "white", align: "left",
            alpha: 0,
        }));
    }

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.45], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Text", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New text?");
                if (newText != undefined) map.dialogues[curDia].lines[curLine].text = newText;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.51], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Portrait", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New portrait? (e. g. Portraits_Bleu)");
                if (newText != undefined) map.dialogues[curDia].lines[curLine].portrait = newText;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.58], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Emotion", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newEmo;
                switch (map.dialogues[curDia].lines[curLine].emotion) {
                    case "neutral":
                        newEmo = "happy";
                        break;
                    case "happy":
                        newEmo = "love";
                        break;
                    case "love":
                        newEmo = "disappointed";
                        break;
                    case "disappointed":
                        newEmo = "sad";
                        break;
                    case "sad":
                        newEmo = "angry";
                        break;
                    case "angry":
                        newEmo = "neutral";
                        break;
                }
                map.dialogues[curDia].lines[curLine].emotion = newEmo;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.64], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Name", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New name? (e. g. Bleu)");
                if (newText != undefined) map.dialogues[curDia].lines[curLine].name = newText;
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.7], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Voice", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let voices = [false, "male_young", "male_grown", "female_young", "female_grown"];

                if (map.dialogues[curDia].lines[curLine].voice == voices[voices.length - 1]) map.dialogues[curDia].lines[curLine].voice = voices[0];
                else map.dialogues[curDia].lines[curLine].voice = voices[voices.indexOf(map.dialogues[curDia].lines[curLine].voice) + 1];

                /*
                let newText = prompt("New voice? (leave it empty for default voice)");
                if (newText != undefined) map.dialogues[curDia].lines[curLine].voice = newText;
                else map.dialogues[curDia].lines[curLine].voice = false;
                */
                updateDialogueLabels();
            }
        }
    }));

    createDialogueButtons.push(controls.button({
        anchor: [0.3, 0.76], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Script", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New script? (advanced)");
                if (newText != undefined) map.dialogues[curDia].lines[curLine].script = newText;
                updateDialogueLabels();
            }
        }
    }));

    // Create NPC
    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Create New / Load", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                curNPC = prompt('NPC ID? (e. g. mrbeast)');
                if (map.npcs == undefined) {
                    map.npcs = {};
                }
                if (map.npcs[curNPC] == undefined) {
                    map.npcs[curNPC] = {
                        position: [4, 4],
                        map: currentMap,
                    }
                }
                for (j in npcs.default) {
                    if (map.npcs[curNPC][j] == undefined) map.npcs[curNPC][j] = npcs.default[j];
                }
                this.text = "NPC: " + curNPC;
                toggleCreateNPCButtons(true);
                updateNPCLabels();
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.55, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Dialogue", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("Dialogue name?");

                if (map.dialogues[newText] != undefined) {
                    if (newText != undefined) map.npcs[curNPC].dialogues["1"] = newText;
                    this.text = "Dialogue: " + newText;
                    updateNPCLabels();
                }
                else {
                    alert("Does not exist!");
                }
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.8, 0.2], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Movement Type: No", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let npc = map.npcs[curNPC];
                switch (npc.movement) {
                    case 0:
                        npc.movement = 1;
                        this.text = "Movement Type: Random";
                        break;
                    case 1:
                        npc.movement = 2;
                        this.text = "Movement Type: Path";
                        break;
                    case 2:
                        npc.movement = 0;
                        this.text = "Movement Type: No";
                        break;
                }
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.8, 0.325], sizeAnchor: [0.2, 0.1], offset: [72 * 16, -600],
        text: "Path", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("Path? 0 down 1 left 2 right 3 up (e. g. 0.1.2.2.2.3.2.1)");
                if (newText != undefined) {
                    newText = newText.split(".");
                    for (i in newText) {
                        newText[i] = parseInt(newText[i]);
                    }
                    this.text = newText;
                    map.npcs[curNPC].path = newText;
                }
                updateNPCLabels();
            }
        }
    }));

    for (i = 0; i < 5; i++) {
        createNPCLabels.push(controls.label({
            anchor: [0.375, 0.35 + (0.06 * i)], offset: [0, -600],
            text: "...",
            fontSize: 32, fill: "white", align: "left",
            alpha: 0,
        }));
    }

    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.325], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Position", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New position? (e. g. 4.4)");
                if (newText != undefined) map.npcs[curNPC].position = [parseInt(newText.split(".")[0]), parseInt(newText.split(".")[1])];
                updateNPCLabels();
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.385], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Alpha", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New alpha? (0 - 1)");
                if (newText != undefined) map.npcs[curNPC].alpha = newText;
                updateNPCLabels();
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.445], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Skin", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New skin?");
                if (newText != undefined && images[newText] != undefined) map.npcs[curNPC].source = newText;
                updateNPCLabels();
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.505], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Walking Interval", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New interval? (default: 0.5)");
                if (newText != undefined) map.npcs[curNPC].walkingInterval = newText;
                updateNPCLabels();
            }
        }
    }));

    createNPCButtons.push(controls.button({
        anchor: [0.3, 0.565], sizeAnchor: [0.05, 0.05], offset: [72 * 16, -600],
        text: "Walking Speed", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newText = prompt("New speed? (default: 1, in seconds)");
                if (newText != undefined) map.npcs[curNPC].walkingSpeed = newText;
                updateNPCLabels();
            }
        }
    }));

    // Tiles menu ahahyahahaaaa
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.7],
        fill: colors.buttonbottom, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) protect();
        }
    }));
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    tilesMenuControls.push(controls.button({
        anchor: [0.05, 0.15], sizeAnchor: [0.15, 0.05],
        text: "Common",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                protect();
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
                protect();
                tileSource = "map";
                openTilesMenu();
            }
        }
    }));
    tilesMenuControls.push(controls.label({
        anchor: [0.5, 0.15],
        text: "Tile Picker", alpha: 0,
    }));

    for (t = 0; t < 200; t++) {
        tilesMenuTiles.push(controls.image({
            anchor: [0.05, 0.2], offset: [32 + (72 * (t % 25)), 32 + (72 * Math.floor(t / 25))], sizeOffset: [64, 64],
            source: "gear", alpha: 0, glowColor: "white", glow: 0,
            // tile: the tile, with sprite, occupied, etc.
            // tileid: 001, 002, etc.
            onClick(args) {
                if (this.alpha == 1) {
                    updateTTP(this.tileid);

                    for (t in tilesMenuTiles) {
                        tilesMenuTiles[t].glow = 0;
                    }
                    this.glow = 25;
                }
            }
        }));
        for (t2 = 0; t2 < 4; t2++) {
            tilesMenuIcons.push(controls.image({
                anchor: [0.05, 0.2], offset: [32 + (72 * (t % 25)) + (16 * t2), 84 + (72 * Math.floor(t / 25))], sizeOffset: [16, 16],
                source: "tilepickerinfoicons", snip: [8 * t2, 0, 8, 8], alpha: 0,
            }));
        }
    }

    for (t = 0; t < 24; t++) {
        recentlyUsedTiles.push(controls.image({
            anchor: [0, 0.025], offset: [72 * (t % 6), 72 * Math.floor(t / 6) + 72 * 4 + 4], sizeOffset: [64, 64],
            source: "gear", alpha: 1, glowColor: "white", glow: 0,
            // tile: the tile, with sprite, occupied, etc.
            // tileid: 001, 002, etc.
            onClick(args) {
                if (this.alpha == 1 && this.source != "gear") {
                    updateTTP(this.tileid, false);

                    for (t in recentlyUsedTiles) {
                        recentlyUsedTiles[t].glow = 0;
                    }
                    this.glow = 25;
                }
            }
        }));
    }
    function generateRecentlyUsed() {
        recentlyUsedTilesList = [];

        for (t = 0; t < 24; t++) {
            recentlyUsedTilesList.push(["gear", "gear", [0, 0, 64, 64]]);
            recentlyUsedTiles[t].source = "gear";
            recentlyUsedTiles[t].snip = [0, 0, 64, 64];
        }
    }

    generateRecentlyUsed();

    walkPad.push(controls.image({ // Up
        anchor: [.1, .9], offset: [0, -walkPadSize * 3], sizeOffset: [walkPadSize, walkPadSize],
        fontSize: 16, source: "mapbuttons", snip: [0, 0, 32, 32],
        isPressed: false,
        onDown(args) {
            if (this.alpha == 1 && prot == false) {
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
            if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
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
            if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
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
            if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
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
            if (this.alpha == 1 && tilesMenuControls[0].alpha == 0) {
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

    // bottom left, leave map maker
    let backButton = controls.button({
        anchor: [0, 0.96], sizeAnchor: [0.05, 0.045],
        text: "<",
        onClick(args) {
            if (this.alpha == 1) {
                if (confirm("Do you really want to leave Map Maker?")) setScene(scenes.pretitle());
            }
        },
        alpha: 1,
    });

    // bottom left, very important, show map info, spawns, etc.
    let toggleMapInfoButton = controls.button({
        anchor: [0, 0.9], sizeAnchor: [0.05, 0.045],
        text: "(i)",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                toggleMapInfoButtons();
            }
        },
        alpha: 1,
    });

    // bottom left, toggle animations on or off (visual only)
    let toggleAnimate = controls.button({
        anchor: [0, 0.84], sizeAnchor: [0.05, 0.045],
        text: "ani:off",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
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

    // bottom left, hide/show UI
    let eyeButton = controls.image({
        anchor: [0, 0.7], sizeAnchor: [0.05, 0.045],
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

    // bottom left, show/hide collisions
    let collisionButton = controls.image({
        anchor: [0, 0.655], sizeAnchor: [0.05, 0.045],
        source: "eye",
        onClick(args) {
            protect();
            visibleCollision = !visibleCollision;
            if (visibleCollision) this.alpha = 0.3;
            else this.alpha = 1;
            updateTiles = true;
        },
        alpha: 1,
    });

    // bottom left, the current tile you got
    let currentTile = controls.image({
        anchor: [0, 0.775], sizeOffset: [64, 64], offset: [0, -16],
        source: "tiles/sand1", glow: 5, glowColor: "yellow",
        alpha: 1,
    });

    // bottom right, maker info
    let toggleMakerInfo = controls.button({
        anchor: [0.95, 0.955], sizeAnchor: [0.05, 0.045],
        text: "info",
        onClick(args) {
            if (this.alpha == 1) {
                protect();
                if (this.text == "info") {
                    showInfo();
                    this.text = "X";
                }
                else {
                    hideInfo();
                    this.text = "info";
                }
                updateTiles = true;
            }
        },
        alpha: 1,
    });

    mapInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.7],
        fill: colors.buttonbottompressed, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) protect();
        }
    }));
    mapInfoControls.push(controls.rect({
        anchor: [0.05, 0.15], sizeAnchor: [0.9, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
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
                this.uText();
            }
        },
        uText() {
            this.text = "Map name: " + map.name;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Map ID: " + map.name, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newName = prompt("New map ID?");
                map.id = newName;
                currentMap = newName;
                this.uText();
            }
        },
        uText() {
            this.text = "Map ID: " + map.id;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Music intro: " + map.intro, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newIntro = prompt("New map music intro?");
                if (newIntro != undefined) map.intro = newIntro;
                this.uText();
            }
        },
        uText() {
            this.text = "Music intro: " + map.intro;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.1, 0.575], sizeAnchor: [0.2, 0.1],
        text: "Music loop: " + map.music, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newLoop = prompt("New map music loop?");
                if (newLoop != undefined) map.music = newLoop;
                this.uText();
            }
        },
        uText() {
            this.text = "Music loop: " + map.music;
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
                this.uText();
            }
        },
        uText() {
            this.text = "Weather: " + map.weather;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Weather Strength: " + map.weatherStrength, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newWeather = prompt("New weather strength? (default is 1)");
                if (newWeather != undefined) map.weatherStrength = parseInt(newWeather);
                this.uText();
            }
        },
        uText() {
            this.text = "Weather Strength: " + map.weatherStrength;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Worldmode: OFF", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (map.worldmode != true) {
                    map.worldmode = true;
                }
                else {
                    map.worldmode = false;
                    game.position[0] = Math.ceil(game.position[0]);
                    game.position[1] = Math.ceil(game.position[1]);
                }
                this.uText();
            }
        },
        uText() {
            this.text = "Worldmode: " + (map.worldmode ? "ON" : "OFF");
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.4, 0.65], sizeAnchor: [0.2, 0.1],
        text: "Add map pack", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (map.packs == undefined) {
                    map.packs = [];
                }
                let newPack = prompt("Name? (e. g. castle)");
                map.packs.push(newPack);
                map.tiles = Object.assign({}, map.tiles, loadPacks({ packs: [newPack] }));
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.2], sizeAnchor: [0.2, 0.1],
        text: "Empty sprite: " + map.tiles.empty.sprite, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newSprite = prompt("New empty sprite? (e. g. water)");
                if (images["tiles/" + newSprite] != undefined) {
                    map.tiles.empty.sprite = newSprite;
                    updateTiles = true;
                    this.uText();
                }
                else {
                    alert("Error: Does not exist!")
                }
            }
        },
        uText() {
            this.text = "Empty sprite: " + map.tiles.empty.sprite;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.325], sizeAnchor: [0.2, 0.1],
        text: "Max. enemies: " + map.maxEnemies, alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (this.alpha == 1) {
                    map.maxEnemies = Math.max(0, Math.round(prompt("New max.? (e. g. 8)")));

                    this.uText();
                }
            }
        },
        uText() {
            this.text = "Max. enemies: " + map.maxEnemies;
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.45], sizeAnchor: [0.2, 0.1],
        text: "Show/Hide Info", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (makerInfoText[0].alpha == 0) {
                    showInfo();
                    renderInfo("es");
                }
                else {
                    hideInfo();
                }
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.575], sizeAnchor: [0.2, 0.1],
        text: "Add spawn", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let newSpawn = prompt("Name?");
                let newSpawn2 = prompt("Chance? (e. g. 10)");
                if (newSpawn != undefined && newSpawn2 != undefined) {
                    if (map.spawns == undefined) map.spawns = {};
                    map.spawns[newSpawn] = newSpawn2;
                    renderInfo("es");
                }
            }
        }
    }));
    mapInfoControls.push(controls.button({
        anchor: [0.7, 0.7], sizeAnchor: [0.2, 0.1],
        text: "Remove spawn", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let killThis = prompt("KILL who?");

                if (map.spawns[killThis] != undefined) {
                    delete map.spawns[killThis];
                    renderInfo("es");
                }
            }
        }
    }));

    let currentMapText = controls.label({
        anchor: [0.075, 0.95],
        text: "ERROR",
        align: "left", fontSize: 33, fill: "black",
        outline: "white", outlineSize: 13,
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
        source: "tiles/water", alpha: 0,
    }));
    tileInfoControls.push(controls.label({
        anchor: [0.5, 0.15], offset: [0, 80],
        text: "water", alpha: 0,
    }));
    for (t = 0; t < 8; t++) {
        tileInfoControls.push(controls.label({
            anchor: [0.5, 0.2 + (0.05 * t)], offset: [0, 80],
            text: "ERROR", alpha: 0,
        }));
    }
    tileInfoControls.push(controls.image({
        anchor: [0.05, 0.5], sizeOffset: [64, 64], offset: [40, 40],
        source: "tiles/water", alpha: 0,
    }));
    tileInfoControls.push(controls.image({
        anchor: [0.05, 0.35], sizeOffset: [64, 64], offset: [40, 40],
        source: "tilesets/teleport", alpha: 0, snip: [0, 0, 32, 32],
        pos: [0, 0, 0],
        onClick(args) {
            if (this.alpha == 1) {
                let selectedTile = getTile(map, this.pos[0], this.pos[1], this.pos[2]);
                if (selectedTile != undefined) {
                    if (selectedTile.teleport != undefined) {
                        if (confirm("Do you really want to teleport? Unsaved changes are lost!")) {
                            currentMap = selectedTile.teleport[0];
                            map = maps[currentMap];
                            game.position = [selectedTile.teleport[1], selectedTile.teleport[2]];
                            newMap();

                            for (tic in tileInfoControls) {
                                tileInfoControls[tic].alpha = 0;
                            }
                        }
                    }
                }
            }
        }
    }));

    tileInfoControls.push(controls.button({
        anchor: [0.2, 0.625], sizeAnchor: [0.2, 0.1],
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
    tileInfoControls.push(controls.button({
        anchor: [0.6, 0.625], sizeAnchor: [0.2, 0.1],
        text: "Remove item", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                let thisOne = -1;
                if (map.items == undefined) return false;
                for (i = 0; i < map.items.length; i++) {
                    if (map.items[i][0] == currInfo[0] && map.items[i][1] == currInfo[1]) {
                        // Same coords
                        thisOne = i;
                    }
                }

                if (thisOne != -1) {
                    map.items.splice(thisOne, 1);
                    // Update
                    tileInfo(currInfo[0], currInfo[1], ["map", "mapbg2", "mapfg"][currInfo[2] - 1]);
                    updateTiles = true;
                }
            }
        }
    }));

    function createTile(createType) {
        if (images["tiles/" + tileSprite] == undefined && images["tilesets/" + tileSet] == undefined) {
            alert("You have to set a valid sprite or a set!");
            return false;
        }
        if (tileID == "") {
            alert("You have to set an ID!");
            return false;
        }
        try {
            let ttc = {};
            if (tileSet == "") {
                ttc = {
                    "sprite": tileSprite
                }
            }
            else {
                if (tileSetSnip == "") tileSetSnip = "0.0";
                ttc = {
                    "set": tileSet,
                    "snip": [parseInt(tileSetSnip.split(".")[0]), parseInt(tileSetSnip.split(".")[1])],
                }
            }

            // adjust and process variables
            if (tileOccupied.toLowerCase().substr(0, 1) == "y" || tileOccupied.toLowerCase() == "true") ttc.occupied = true;
            else if (tileOccupied.toLowerCase().substr(0, 1) == "n" || tileOccupied.toLowerCase() == "false") ttc.occupied = false;
            else if (tileOccupied.toLowerCase() != "" && tileOccupied != undefined) ttc.occupied = tileOccupied.split(".");

            if (tileAni != "") ttc.ani = [parseInt(tileAni.split(".")[0]), parseInt(tileAni.split(".")[1])];

            if (tileTele != "") ttc.teleport = [tileTele.split(".")[0], parseInt(tileTele.split(".")[1]), parseInt(tileTele.split(".")[2])];

            if (tileDia != "") ttc.dialogue = tileDia;

            if (tileSwim.toLowerCase() == "yes" || tileSwim.toLowerCase() == "true") ttc.swim = true;

            // create the actual tile
            if (createType == "map") {
                // CREATE button
                map.tiles[tileID] = ttc;
            }
            if (createType == "copy") {
                // Copy button
                navigator.clipboard.writeText('"' + tileID + '": ' + JSON.stringify(ttc));
            }

            // clearTile();
        }
        catch (e) {
            alert("An error occured!\n" + e);
        }
        toggleCreateTileButtons();
    }

    function clearTile() {
        tileID = "";
        tileSprite = "";
        tileOccupied = "";
        tileSet = "";
        tileSetSnip = "";
        tileAni = "";
        tileTele = "";
        tileDia = "";
        tileSwim = "";

        mapIdentifier = "";

        createTileButtons[0].text = "Tile ID";
        createTileButtons[1].text = "Tile Sprite";
        createTileButtons[2].text = "Tile Occupied";
        createTileButtons[3].text = "Tile Set";
        createTileButtons[4].text = "Set Snip";
        createTileButtons[5].text = "Animation";
        createTileButtons[6].text = "Teleport";
        createTileButtons[7].text = "Dialogue";
        createTileButtons[8].text = "Swim";

        createTileButtons[9].source = "gear";
        createTileButtons[10].source = "gear";
    }

    function loadNPCs() {
        activenpcs = [];
        for (i in npcs) {
            if (npcs[i].alpha != 0 && npcs[i].map == currentMap) {
                activenpcs.push(npcs[i]);
            }
        }
        if (map.npcs != undefined) {
            for (i in map.npcs) {
                if (map.npcs[i].alpha != 0) {
                    activenpcs.push(map.npcs[i]);
                }
            }
        }
        for (i in activenpcs) {
            for (j in npcs.default) {
                if (activenpcs[i][j] == undefined) activenpcs[i][j] = npcs.default[j];
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

        map.tiles = Object.assign({}, map.tiles, loadPacks(map));

        generateRecentlyUsed();
        updateTiles = true;
    }

    function updateTTP(newTTP, updateRecent = true) {
        // TTP = tile to place
        let newSource = "";
        let newSnip = [0, 0, 32, 32];

        // Change the tile to place, and the current tile selected display
        ttp = newTTP;

        // Display
        if (map.tiles[ttp] != undefined) {
            if (map.tiles[ttp].sprite != undefined) {
                newSource = "tiles/" + map.tiles[ttp].sprite;
                newSnip = false;
            }
            else {
                newSource = "tilesets/" + map.tiles[ttp].set;
                newSnip = [map.tiles[ttp].snip[0] * 32, map.tiles[ttp].snip[1] * 32, 32, 32];
            }
        }
        else if (commontiles[ttp] != undefined) {
            if (commontiles[ttp].sprite != undefined) {
                newSource = "tiles/" + commontiles[ttp].sprite;
                newSnip = false;
            }
            else {
                newSource = "tilesets/" + commontiles[ttp].set;
                newSnip = [commontiles[ttp].snip[0] * 32, commontiles[ttp].snip[1] * 32, 32, 32];
            }
        }

        currentTile.source = newSource;
        currentTile.snip = newSnip;

        // update recently used tiles (left)
        if (updateRecent) {
            recentlyUsedTilesList.unshift([newSource, newTTP, newSnip]);
            if (recentlyUsedTilesList.length > 24) recentlyUsedTilesList.pop();
            for (t = 0; t < recentlyUsedTilesList.length; t++) {
                recentlyUsedTiles[t].source = recentlyUsedTilesList[t][0];
                recentlyUsedTiles[t].tileid = recentlyUsedTilesList[t][1];
                recentlyUsedTiles[t].snip = recentlyUsedTilesList[t][2];
            }
        }
    }

    function postUndoLog(x, y, layer, prevContent) {
        // Add something to the undo log
        undoLog.unshift([x, y, layer, prevContent])
        undoButtons[0].alpha = 1;
        if (undoLog.length > 2048) undoLog.pop();
        //console.log(undoLog.length, undoLog);
    }

    function postRedoLog(x, y, layer, prevContent) {
        // Add something to the redo log
        redoLog.unshift([x, y, layer, prevContent])
        undoButtons[1].alpha = 1;
        if (undoLog.length > 2048) redoLog.pop();
        //console.log(undoLog.length, undoLog);
    }

    function saveFile(type) {
        let toExport;

        /*
        for (let tilesetTile in map.tiles) {
            if (map.tiles[tilesetTile].set != undefined) {
                delete map.tiles[tilesetTile];
            }
        }
        */

        if (type == "sotrm") toExport = JSON.stringify(map);
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

    function toggleCreateTileButtons(musthide) {
        if (createTileButtons[0].alpha == 0 && !musthide) {
            closeAllMenus(4);
            for (i in createTileButtons) {
                createTileButtons[i].offset = [0, -600];
                createTileButtons[i].alpha = 1;
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 1;
            }
            createTileBG[2].text = "Tile Maker";

            createTileInfoPageLength = 0;

            showInfo();
            renderInfo("t");

            for (i in createTileButtons) {
                createTileButtons[i].offset[1] = 0;
            }
        }
        else {
            for (i in createTileButtons) {
                createTileButtons[i].offset = [0, 0];
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 0;
            }
            hideInfo();

            for (i in createTileButtons) {
                createTileButtons[i].offset[1] = -600;
                createTileButtons[i].alpha = 0;
            }
        }
    }

    function toggleCreateDialogueButtons(mustShow = false) {
        if (createDialogueButtons[0].alpha == 0 || mustShow) {
            closeAllMenus(5);
            if (curDia != "") {
                for (i in createDialogueButtons) {
                    createDialogueButtons[i].offset = [0, -600];
                    createDialogueButtons[i].alpha = 1;
                }
                for (i in createDialogueLabels) {
                    createDialogueLabels[i].alpha = 1;
                }
            }
            else {
                createDialogueButtons[0].offset = [0, 0];
                createDialogueButtons[0].alpha = 1;
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 1;
            }
            createTileBG[2].text = "Dialogue Maker";

            createTileInfoPageLength = 0;

            showInfo();
            renderInfo("d");

            if (curDia != "") {
                for (i in createDialogueButtons) {
                    createDialogueButtons[i].offset[1] = 0;
                }
                for (i in createDialogueLabels) {
                    createDialogueLabels[i].offset[1] = 0;
                }
            }
        }
        else {
            for (i in createDialogueButtons) {
                createDialogueButtons[i].offset = [0, 0];
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 0;
            }
            for (i in createDialogueLabels) {
                createDialogueLabels[i].alpha = 0;
            }
            hideInfo();

            for (i in createDialogueButtons) {
                createDialogueButtons[i].offset[1] = -600;
                createDialogueButtons[i].alpha = 0;
            }
        }
    }

    function toggleCreateNPCButtons(mustShow = false) {
        if (createNPCButtons[0].alpha == 0 || mustShow) {
            closeAllMenus(6);
            if (curNPC != "") {
                for (i in createNPCButtons) {
                    createNPCButtons[i].offset = [0, -600];
                    createNPCButtons[i].alpha = 1;
                }
                for (i in createNPCLabels) {
                    createNPCLabels[i].alpha = 1;
                }
            }
            else {
                createNPCButtons[0].offset = [0, 0];
                createNPCButtons[0].alpha = 1;
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 1;
            }
            createTileBG[2].text = "NPC Maker";

            createTileInfoPageLength = 0;

            showInfo();
            renderInfo("d");

            if (curNPC != "") {
                for (i in createNPCButtons) {
                    createNPCButtons[i].offset[1] = 0;
                }
                for (i in createNPCLabels) {
                    createNPCLabels[i].offset[1] = 0;
                }
            }
        }
        else {
            for (i in createNPCButtons) {
                createNPCButtons[i].offset = [0, 0];
            }
            for (i in createNPCLabels) {
                createNPCLabels[i].offset = [0, 0];
            }
            for (i in createTileBG) {
                createTileBG[i].alpha = 0;
            }
            hideInfo();

            for (i in createNPCButtons) {
                createNPCButtons[i].offset[1] = -600;
                createNPCButtons[i].alpha = 0;
            }
            for (i in createNPCLabels) {
                createNPCLabels[i].offset[1] = -600;
                createNPCLabels[i].alpha = 0;
            }
        }
    }

    function updateTileLabels() {
        createTileButtons[0].text = "Tile ID: " + tileID;
        createTileButtons[1].text = "Tile Sprite: " + tileSprite
        createTileButtons[2].text = "Tile Occ: " + tileOccupied;
        createTileButtons[3].text = "Tile Set: " + tileSet;
        createTileButtons[4].text = "Set Snip: " + tileSetSnip;
        createTileButtons[5].text = "Animation: " + tileAni;
        createTileButtons[6].text = "Teleport: " + tileTele;
        createTileButtons[7].text = "Dialogue: " + tileDia;
        createTileButtons[8].text = "Swim: " + tileSwim;
        createTileButtons[13].text = "AutoID " + mapIdentifier + "00";

        if (images["tilesets/" + tileSet] != undefined) createTileButtons[9].snip = [parseInt(tileSetSnip.split(".")[0]) * 32, parseInt(tileSetSnip.split(".")[1]) * 32, 32, 32];

        if (tileSprite != "") {
            if (images["tiles/" + tileSprite] != undefined) createTileButtons[9].source = "tiles/" + tileSprite;
            else createTileButtons[9].source = "gear";

            tileSet = "";
            createTileButtons[3].text = "Tile Set";
            createTileButtons[3].fillTop = "darkgray";
            createTileButtons[3].fillBottom = "gray";
            this.fillTop = "red";
            this.fillBottom = "darkred";
        }
        if (tileSet != "") {
            if (images["tilesets/" + tileSet] != undefined) {
                createTileButtons[9].source = "tilesets/" + tileSet;
                createTileButtons[10].source = "tilesets/" + tileSet;
            }
            else createTileButtons[9].source = "gear";

            tileSprite = "";
            createTileButtons[1].text = "Tile Sprite";
            createTileButtons[1].fillTop = "darkgray";
            createTileButtons[1].fillBottom = "gray";
            this.fillTop = "red";
            this.fillBottom = "darkred";
        }
    }

    function updateDialogueLabels() {
        createDialogueLabels[0].text = (curLine + 1) + "/" + Object.keys(map.dialogues[curDia].lines).length;
        createDialogueLabels[1].text = map.dialogues[curDia].lines[curLine].text;
        createDialogueLabels[2].text = map.dialogues[curDia].lines[curLine].portrait;
        createDialogueLabels[3].text = map.dialogues[curDia].lines[curLine].emotion;
        createDialogueLabels[4].text = map.dialogues[curDia].lines[curLine].name;
        createDialogueLabels[5].text = map.dialogues[curDia].lines[curLine].voice;
        createDialogueLabels[6].text = map.dialogues[curDia].lines[curLine].script;
    }

    function updateNPCLabels() {
        createNPCLabels[0].text = map.npcs[curNPC].position;
        createNPCLabels[1].text = map.npcs[curNPC].alpha;
        createNPCLabels[2].text = map.npcs[curNPC].source;
        createNPCLabels[3].text = map.npcs[curNPC].walkingInterval;
        createNPCLabels[4].text = map.npcs[curNPC].walkingSpeed;

        loadNPCs();
        updateTiles = true;
    }

    function toggleMapInfoButtons(mustclose = false) {
        closeAllMenus(7);

        if (mapInfoControls[0].alpha == 0 && !mustclose) {
            for (u in undoButtons) {
                undoButtons[u].al = undoButtons[u].alpha;
                undoButtons[u].alpha = 0;
            }

            for (w in walkPad) {
                walkPad[w].alpha = 0;
            }
            // update their texts and show
            for (mi in mapInfoControls) {
                if (mapInfoControls[mi].uText != undefined) mapInfoControls[mi].uText();
                mapInfoControls[mi].alpha = 1;
            }
        }
        else if (mapInfoControls[0].alpha == 1) {
            if (!mustclose) closeAllMenus(7);

            for (u in undoButtons) {
                undoButtons[u].alpha = undoButtons[u].al;
            }

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

    function showInfo() {
        let red = 1;
        if (isLs()) red = 2;

        for (u in undoButtons) {
            undoButtons[u].al = undoButtons[u].alpha;
            undoButtons[u].alpha = 0;
        }

        for (i in makerInfo) {
            makerInfo[i].alpha = 1;
        }
        for (i in makerInfoText) {
            if (height * 0.6 * red > i * 20) {
                createTileInfoPageLength += 1;
                makerInfoText[i].alpha = 1;
            }
        }
    }

    function hideInfo() {
        for (u in undoButtons) {
            undoButtons[u].alpha = undoButtons[u].al;
        }

        for (i in makerInfo) {
            makerInfo[i].alpha = 0;
        }
        for (i in makerInfoText) {
            makerInfoText[i].alpha = 0;
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
            case "e":
                grabFrom = Object.keys(mapenemies);
                break;
            case "es":
                if (map.spawns != undefined) {
                    let j = 0;
                    for (i in map.spawns) {
                        grabFrom.push(Object.keys(map.spawns)[j] + " | " + map.spawns[i]);
                        j += 1;
                    }
                }
                break;
            case "d":
                if (map.dialogues != undefined) grabFrom = Object.keys(map.dialogues);
                else grabFrom = [];
                break;
            case "p":
                for (i in Object.keys(images)) {
                    if (Object.keys(images)[i].substr(0, 10) == "Portraits_") grabFrom.push(Object.keys(images)[i]);
                }
                break;
            case "npcs":
                if (map.npcs != undefined) {
                    for (let n in map.npcs) {
                        grabFrom.push(n);
                    }
                }
                break;
        }
        for (g = 0; g < 30; g++) {
            if (grabFrom[g + (createTileInfoPage * createTileInfoPageLength)] != undefined) {
                makerInfoText[g].text = grabFrom[g + (createTileInfoPage * createTileInfoPageLength)];
            }
            else {
                makerInfoText[g].text = "";
            }
        }
    }

    function toggleLoadButtons(mustclose = false) {
        if (loadMapButtons[0].offset[1] != -600 && loadMapButtons[0].offset[1] != 0) {
            animationOverlap = true;
            return false;
        }
        if (loadMapButtons[0].alpha == 0 && !mustclose) {
            // Open
            closeAllMenus(2);
            renderInfo("m");
            showInfo();

            for (i in loadMapButtons) {
                loadMapButtons[i].offset = [0, -600];
                loadMapButtons[i].alpha = 1;
            }
            for (i in loadMapButtons) {
                loadMapButtons[i].offset[1] = 0;
            }
        }
        else {
            // Close
            hideInfo();

            for (i in loadMapButtons) {
                loadMapButtons[i].offset = [0, 0];
            }
            hideInfo();
            for (i in loadMapButtons) {
                loadMapButtons[i].offset[1] = -600;
                loadMapButtons[i].alpha = 0;
            }
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
        closeAllMenus(0);

        let red = isLs() ? 2 : 1;

        for (u in undoButtons) {
            undoButtons[u].al = undoButtons[u].alpha;
            undoButtons[u].alpha = 0;
        }

        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 1;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
            tilesMenuTiles[t].glow = 0;
        }
        for (t in tilesMenuIcons) {
            tilesMenuIcons[t].alpha = 0;
        }
        for (t = 0; t < 25; t++) {
            if (tilesMenuTiles[t].offset[0] / red <= width * scale * 0.9) pageWidth = t;
        }
        for (r = 0; r < 8; r++) {
            if (tilesMenuTiles[r * 25].offset[1] / red <= height * 0.6) pageSize = pageWidth * (r + 1);
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
                    else {
                        if (images["tiles/" + grb.sprite] != undefined) tilesMenuTiles[nr].source = "tiles/" + grb.sprite;
                        else tilesMenuTiles[nr].source = "gear";
                        tilesMenuTiles[nr].snip = false;
                    }
                    tilesMenuTiles[nr].tile = grb;
                    tilesMenuTiles[nr].tileid = til;
                    tilesMenuTiles[nr].alpha = 1;

                    let nr2 = (nr * 4);
                    if (grb.occupied != undefined && grb.occupied != false) tilesMenuIcons[nr2].alpha = 1;
                    if (grb.ani != undefined) tilesMenuIcons[nr2 + 1].alpha = 1;
                    if (grb.teleport != undefined) tilesMenuIcons[nr2 + 2].alpha = 1;
                    if (grb.dialogue != undefined || grb.action != undefined) tilesMenuIcons[nr2 + 3].alpha = 1;
                    nr += 1;
                }
            }
            i += 1;
        }
    }

    function closeTilesMenu() {
        for (u in undoButtons) {
            undoButtons[u].alpha = undoButtons[u].al;
        }

        for (t in tilesMenuControls) {
            tilesMenuControls[t].alpha = 0;
        }
        for (t in tilesMenuTiles) {
            tilesMenuTiles[t].alpha = 0;
        }
        for (t in tilesMenuIcons) {
            tilesMenuIcons[t].alpha = 0;
        }
    }

    function closeAllMenus(i) {
        // Tile Menu
        if (i != 0) closeTilesMenu();

        // Tile Info
        if (i != 1) {
            for (tic in tileInfoControls) {
                tileInfoControls[tic].alpha = 0;
            }
        }

        // Load
        if (i != 2) toggleLoadButtons(true);

        // Save
        //if (i != 3) toggleSaveButtons(true);

        // Tile Maker
        if (i != 4) {
            toggleCreateTileButtons(true);
        }

        // Dialogue Maker
        if (i != 5) {
            for (tic in createDialogueButtons) {
                createDialogueButtons[tic].alpha = 0;
            }
            for (tic in createDialogueLabels) {
                createDialogueLabels[tic].alpha = 0;
            }
        }

        // NPC Maker
        if (i != 6) {
            for (tic in createNPCButtons) {
                createNPCButtons[tic].alpha = 0;
            }
            for (tic in createNPCLabels) {
                createNPCLabels[tic].alpha = 0;
            }
        }

        // Map Info
        if (i != 7) toggleMapInfoButtons(true);

        // Info
        hideInfo();
    }

    function protect() {
        prot = true;
        prott = 100;
    }

    function placeTile(x, y, layer, tileToPlace = "none", umode = "default") {
        if (x < 0 || y < 0) {
            return false;
        }

        if (map[layer][y] == undefined) map[layer][y] = "---"; // jesus line
        let mp = map[layer][y];
        let def = "---";

        if (mode == "place" || mode == "moveandplace" || umode == "undo" || umode == "copy") {
            if (tileToPlace == "none") {
                tileToPlace = ttp;
            }

            let rePlaced;
            if (fillToolActive) rePlaced = mp.substr(x * 4, 3);

            if (mp == undefined) {
                while (mp == undefined) {
                    map[layer].push(def);
                    mp = map[layer][y];
                }
            }

            map[layer][y] = map[layer][y].replace(/\s{2,}/g, ' '); // remove double spaces
            mp = map[layer][y];

            if (x * 4 > mp.length) {
                while (x * 4 > mp.length) {
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

            map[layer][y] = map[layer][y].replace(/  /gi, " ");
            mp = map[layer][y];

            // Fill thing
            if (fillToolActive && tilesFilled == 0) {
                // Fill ON - multiple tiles
                let temp = [x, y];

                replaceY("+", mp, x, y, layer, rePlaced, tileToPlace, temp);
                x = temp[0];
                y = temp[1];

                replaceY("-", mp, x, y, layer, rePlaced, tileToPlace, temp);
                x = temp[0];
                y = temp[1];

                tilesFilled = 0; // done, reset back
            }
            else {
                // FILL OFF - single tile
                if (x * 4 > mp.length) {
                    // Expand map!
                    map[layer][y] = mp + " " + tileToPlace;
                }
                else {
                    // Somewhere in the middle of the map
                    map[layer][y] = mp.substr(0, x * 4) + tileToPlace + " " + mp.substr((1 + x) * 4);
                }
            }

            map[layer][y] = map[layer][y].replace(/  /gi, " ");
            updateTiles = true;
        }
    }

    function replaceY(pom, mp, x, y, layer, rePlaced, tileToPlace, temp) {
        if (rePlaced == "") return false;
        let startX = 0;
        let startY = y;

        while (map[layer][y] != undefined && y - 100 < startY && tilesFilled < 5000) { // start row must exist, and max. 100 tiles in that direction
            //console.log(tilesFilled);
            if (mp.substr(x * 4, 3) != rePlaced) {
                // Nope (limit Y)
                console.log("y limiter");
                break;
            }

            // go to the left
            startX = x;
            while (mp.substr(0, x * 4) != undefined && x > startX - 100) {
                if (mp.substr(x * 4, 3) == rePlaced) {
                    map[layer][y] = mp.substr(0, x * 4) + tileToPlace + " " + mp.substr((1 + x) * 4);
                    tilesFilled++;
                }
                else break;
                mp = map[layer][y];
                x -= 1;
            }

            x = temp[0] + 1;
            mp = map[layer][y];

            // go to the right
            startX = x;
            while (mp.substr(0, x * 4) != undefined && x - 100 < startX) {
                if (mp.substr(x * 4, 3) == rePlaced) {
                    map[layer][y] = mp.substr(0, x * 4) + tileToPlace + " " + mp.substr((1 + x) * 4);
                    tilesFilled++;
                }
                else break;
                mp = map[layer][y];
                x += 1;
            }

            // adjust the y
            // pom = plus or minus
            if (pom == "-") y -= 1;
            if (pom == "+") y += 1;
            mp = map[layer][y];
            x = temp[0];
        }
        console.log("fill while, end");
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

    function tileInfo(x, y, layer, selected = "none") {
        closeAllMenus(1);

        let selectedTile;
        let selectedTileID;
        let l = 1;

        if (selected == "none") {
            if (x < 0 || y < 0) {
                return false;
            }

            if (layer == "mapbg2") l = 2;
            if (layer == "mapfg") l = 3;

            currInfo = [x, y, l];

            selectedTile = getTile(map, x, y, l);

            if (selectedTile == undefined) selectedTile = map.tiles.empty;
            selectedTileID = "empty";
            if (map[layer][y] != undefined) selectedTileID = map[layer][y].substr(x * 4, 3);
        }
        else {
            selectedTile = map.tiles[selected] != undefined ? map.tiles[selected] : commontiles[selected];
            selectedTileID = selected;
        }

        tileInfoControls[15].pos = currInfo;

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
        if (thisTilesItem != undefined) tileInfoControls[14].source = "items/" + items[map.items[i][2]]().source;
        else tileInfoControls[14].source = "gear";

        tileInfoControls[13].text = "Dialogue: " + (selectedTile.dialogue == undefined ? "not" : selectedTile.dialogue);

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

            if (lmresult != "none") {
                if (loadMapButtons[0].alpha == 1) toggleLoadButtons();
                hideInfo();
                if (lmresult != "justhide") {
                    if (typeof (lmresult) == "string" && lmresult.id != undefined) {
                        // The map you have loaded already exists :)
                        currentMap = lmresult.id;
                        map = maps[lmresult];

                        console.log("loaded: " + currentMap);
                        newMap();
                    }
                    else {
                        // It does not exist, create a new empty map
                        createNewMap(eval(lmresult));
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

            // Update scaling
            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;

            // Update location/status text
            currentMapText.text = "Map: " + currentMap + "   |   Pos: x" + game.position[0] + " y" + game.position[1] + " z" + editingLayer + "   |   Mode: " + mode;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;

            if (map == undefined) return false;

            let wm = map.worldmode == true ? 2 : 1;
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
                        tnpcs[np].source = npc.source;
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
                            if (getTile(map, x, y) != undefined) {
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
                                if (visibleCollision && !getTile(map, x, y).occupied) {
                                    tiles_bg[b].alpha -= 0.6;
                                }
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
                            if (getTile(map, x, y, 2) != undefined) {
                                if (getTile(map, x, y, 2).set != undefined) {
                                    tiles_bg2[b2].source = "tilesets/" + getTile(map, x, y, 2).set;
                                    tiles_bg2[b2].snip = [getTile(map, x, y, 2).snip[0] * 32, getTile(map, x, y, 2).snip[1] * 32, 32, 32];
                                }
                                else {
                                    tiles_bg2[b2].source = "tiles/" + getTile(map, x, y, 2).sprite;
                                    tiles_bg2[b2].snip = false;
                                }
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
                            if (visibleCollision && !getTile(map, x, y, 2).occupied) {
                                tiles_bg2[b2].alpha -= 0.6;
                            }
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
                            if (visibleCollision && !getTile(map, x, y, 3).occupied) {
                                tiles_fg[t].alpha -= 0.6;
                            }
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

            autoSaveTime += 1 / delta;
            if (autoSaveTime >= 12) {
                autoSaveTime = 0;
                localStorage.setItem("SRPGMM", JSON.stringify(map));
                addAnimator(function (t) {
                    autoSaveText.alpha = 1 - (1 / 500) * t;
                    if (t > 500) {
                        autoSaveTime = 0;
                        autoSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
            }
        },
        // Controls
        controls: [
            ...tiles_bg, ...tiles_bg2, ...titems, ...tnpcs, ...tiles_fg, ...expandMapButtons, // tiles / map

            ...modeButtons, ...undoButtons, ...walkPad, middlei, currentMapText,
            backButton, toggleMapInfoButton, eyeButton, collisionButton, toggleAnimate, currentTile, ...recentlyUsedTiles, // left side stuff, UI

            // v various menus
            ...loadMapButtons, ...mapInfoControls,
            ...tilesMenuControls, ...tilesMenuTiles, ...tilesMenuIcons,
            ...createTileBG, ...createTileButtons,
            ...createDialogueButtons, ...createDialogueLabels, ...createNPCButtons, ...createNPCLabels,
            toggleMakerInfo, ...makerInfo, ...makerInfoText,
            ...tileInfoControls, autoSaveText
        ],
        name: "mapmaker"
    }
}