var tileProperties = ["sprite", "set", "snip", "occupied", "ani", "teleport", "rotate", "dialogue", "swim", "layer", "condition"];

function tileInfo(x, y, layer, selected = "none") {
    // not an UI function, this is for handling the tile mode :p
    tileInfoWindowGenerate();
    mapmaker.tileInfoPos = [x, y, layer];

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

        selectedTile = getTile(mm_map, x, y, l);

        if (selectedTile == undefined) selectedTile = mm_map.tiles.empty;
        selectedTileID = "empty";
        if (mm_map[layer][y] != undefined) selectedTileID = mm_map[layer][y].substr(x * 4, 3);
    }
    else {
        selectedTile = mm_map.tiles[selected] != undefined ? mm_map.tiles[selected] : commontiles[selected];
        selectedTileID = selected;
    }

    // Item display, find out if there is an item/chest here [x, y, type]
    mapmaker.tileInfoItem = undefined;
    for (let i in mm_map.items) {
        if (mm_map.items[i][0] == x && mm_map.items[i][1] == y) mapmaker.tileInfoItem = [mm_map.items[i][2], mm_map.items[i][3], "ground"];
    }
    if (mapmaker.tileInfoItem == undefined) {
        for (let i in mm_map.chests) {
            if (mm_map.chests[i][0] == x && mm_map.chests[i][1] == y) mapmaker.tileInfoItem = [mm_map.chests[i][3], mm_map.chests[i][4], "chest"];
        }
    }

    tileInfoWindowShow();
    tileInfoWindowRender(selectedTileID, selectedTile);
}

function tileInfo_auto() {
    tileInfo(mapmaker.tileInfoPos[0], mapmaker.tileInfoPos[1], mapmaker.tileInfoPos[2]);
}

// tileInfo : just the list of attributes, for usage in the tile picker AND tileInfoWindow
function tileInfoGenerate() {
    createImage("currentTilePreview", 0.675, 0.15, 0, 0, "gear", { sizeOffset: [128, 128], power: false });
    createText("selectedTileName", 0.8, 0.15, "", { size: 40, color: "black", align: "left", offset: [0, 64] });

    createSmartText("selectedTileProperties", 0.675, 0.33, "", { size: 32, color: "black", align: "left" });
    createSmartText("selectedTileProperties2", 0.775, 0.33, "", { size: 32, color: "black", align: "left" });
}

// tileInfoWindow : the tile info mode
function tileInfoWindowGenerate() {
    //createSquare("tileInfoWindow_bg", 0.65, 0.05, 0.325, 0.9, colors.bottomcolor);
    createSquare("tileInfoWindow_bg", 0.65, 0.025, 0.325, 0.95, colors.bottomcolor, { clickthrough: false });
    objects["tileInfoWindow_bg"].onHold = () => { };
    createSquare("tileInfoWindow_bg2", 0.65, 0.05, 0.325, 0.9, colors.bottomcolor, { offset: [4, 4], sizeOffset: [-8, -8] });
    createText("tileInfoWindow_header", 0.675, 0.06, "Tile Info", { size: 32, color: "white", align: "left" });

    tileInfoGenerate();

    createText("selectedTile_Item", 0.675, 0.8, "", { size: 32, color: "black", align: "left" });
    createText("selectedTile_Dialogue", 0.675, 0.8, "", { size: 32, color: "black", align: "left", offset: [0, 64] });

    // top buttons
    createButton("tileInfoWindow_Warp", 0.825 - 0.01, 0.025, 0.05, 0.05, "button", (c) => {
        let selectedTile = objects[c].tile; // we only need tp info here
        console.log(selectedTile);

        if (selectedTile != undefined) {
            if (confirm("Do you really want to teleport to "
                + selectedTile[0] + " (" + selectedTile[1] + "/" + selectedTile[2]
                + ")?\nUnsaved changes are lost!")) {

                currentMap = selectedTile[0]; // teleporting to a map
                mm_map = maps[currentMap];
                game.position = [selectedTile[1], selectedTile[2]];
                newMap();

                mapmaker.placeBlocker = 1;
                tileInfoWindowHide();
            }
        }
    }, { aText: { text: "Warp", size: 24, color: "black" } });

    createButton("tileInfoWindow_GO", 0.875 - 0.005, 0.025, 0.05, 0.05, "button", () => {
        // jumps to this selected tile, useful for getting to an exact tile when other movement is too fast
        // aka spiderman
        let myTile = mapmaker.tileInfoPos;
        if (myTile[0] == -1 && myTile[1] == -1) return;
        game.position[0] = myTile[0];
        game.position[1] = myTile[1];

        mapmaker.placeBlocker = 1;
        mapmaker.updateTiles = true;
        tileInfoWindowHide();
    }, { aText: { text: "GO", size: 24, color: "black" } });

    createButton("tileInfoWindow_close", 0.925, 0.025, 0.05, 0.05, "button", () => {
        mapmaker.placeBlocker = 1;
        tileInfoWindowHide();
    }, { aText: { text: "X", size: 24, color: "black" } });

    // switch layers
    for (let i = 0; i < 3; i++) {
        createButton("tileInfoWindow_layer" + i, 0.925, 0.08 + (0.055 * i), 0.05, 0.05, "button", (c) => {
            mapmaker.tileInfoPos[2] = ["map", "mapbg2", "mapfg"][objects[c].layer];
            tileInfo_auto();
        }, { aText: { text: ["BG", "BG2", "FG"][i], size: 24, color: "black" } });
        objects["tileInfoWindow_layer" + i].layer = i;
    }

    // bottom buttons
    createButton("tileInfoWindow_btmbtn_PlaceItem", 0.65, 0.925, 0.325 / 4 * 0.95, 0.05, "button", () => {
        if (mm_map.items == undefined) mm_map.items = [];
        if (selectedInfoType == "items" && isValid(selectedInfo)) {
            let amount = prompt("Desired item amount? (e. g. 1)");
            if (!isValid(amount)) amount = 1;
            amount = parseInt(amount);

            mm_map.items.push([currInfo[0], currInfo[1], selectedInfo, amount, true]);

            tileInfo_auto();
            mapmaker.updateTiles = true;
            makerInfoHide();
        }
        else {
            makerInfoShow();
            renderMakerInfo("items");
        }
    }, { aText: { text: "Place Item", size: 24, color: "black" } });

    createButton("tileInfoWindow_btmbtn_PlaceChest", 0.65 + (0.325 / 4) * 1, 0.925, 0.325 / 4 * 0.95, 0.05, "button", () => {
        if (selectedInfoType == "items" && isValid(selectedInfo)) {
            let amount = prompt("How many?");
            if (!isValid(amount)) amount = 1;
            amount = parseInt(amount);

            if (mm_map.chests == undefined) mm_map.chests = [];
            mm_map.chests.push([currInfo[0], currInfo[1], ["map", "mapbg2", "mapfg"][currInfo[2] - 1], selectedInfo, amount]);

            makerInfoHide();
        }
        else {
            makerInfoShow();
            renderMakerInfo("items");
        }
    }, { aText: { text: "Place Chest", size: 24, color: "black" } });

    createButton("tileInfoWindow_btmbtn_RemoveItem", 0.65 + (0.325 / 4) * 2, 0.925, 0.325 / 4 * 0.95, 0.05, "button", () => {
        let thisOne = -1;
        // not optimal?
        if (mm_map.items != undefined) {
            for (i = 0; i < mm_map.items.length; i++) {
                if (mm_map.items[i][0] == currInfo[0] && mm_map.items[i][1] == currInfo[1]) {
                    // Same coords
                    thisOne = i;
                }
            }

            if (thisOne != -1) {
                mm_map.items.splice(thisOne, 1);
                // Update
                tileInfo_auto();
                updateTiles = true;
            }
        }

        if (mm_map.chests != undefined) {
            for (let c in mm_map.chests) {
                if (mm_map.chests[c][0] == currInfo[0] && mm_map.chests[c][1] == currInfo[1]) {
                    mm_map.chests.splice(c, 1);
                    tileInfo_auto();
                    break;
                }
            }
        }
    }, { aText: { text: "Remove Item", size: 24, color: "black" } });

    createButton("tileInfoWindow_btmbtn_GetCoords", 0.65 + (0.325 / 4) * 3.05, 0.925, 0.325 / 4 * 0.95, 0.05, "button", () => {
        let theString = mm_map.id + "." + mapmaker.tileInfoPos[0] + "." + mapmaker.tileInfoPos[1];
        navigator.clipboard.writeText(theString);
        //alert("Copied: " + theString);
    }, { aText: { text: "Get Coords", size: 24, color: "black" } });

    createGroup("tileInfoWindow", [
        "currentTilePreview", "selectedTileName",
        "selectedTileProperties", "selectedTileProperties2",
        // new ones
        "tileInfoWindow_bg", "tileInfoWindow_bg2", "tileInfoWindow_header",
        "selectedTile_Item", "selectedTile_Dialogue",
        "tileInfoWindow_Warp", "tileInfoWindow_GO", "tileInfoWindow_close",
        "tileInfoWindow_layer0", "tileInfoWindow_layer1", "tileInfoWindow_layer2",
        "tileInfoWindow_btmbtn_PlaceItem", "tileInfoWindow_btmbtn_PlaceChest", "tileInfoWindow_btmbtn_RemoveItem", "tileInfoWindow_btmbtn_GetCoords"
    ]);
}

function tileInfoRender(tileID, tile = undefined) {
    let txt = "";
    let txt2 = "";

    if (tile == undefined) {
        if (mm_map.tiles[tileID]) tile = mm_map.tiles[tileID];
        else if (commontiles[tileID]) tile = commontiles[tileID];
        else {
            console.log("tileInfoRender: " + tileID + " does not exist anywhere");
            return;
        }
    }

    for (let prop of tileProperties) {
        txt += prop.substr(0, 1).toUpperCase() + prop.substr(1) + ":\n";// + " ".repeat(30 - (prop.length * 2)) + tile[prop] + "\n";
        txt2 += (tile[prop] != undefined ? tile[prop] : "-") + "\n"
    }

    objects["selectedTileProperties"].text = txt;
    objects["selectedTileProperties2"].text = txt2;

    // update image and main name
    objects["currentTilePreview"].power = true;

    objects["selectedTileName"].text = tileID;

    return [tileID, tile];
}

function tileInfoWindowRender(tileID, tile = undefined) {
    [tileID, tile] = tileInfoRender(tileID, tile);

    if (tile.set) objects["currentTilePreview"].image = "tilesets/" + tile.set;
    else if (tile.sprite) objects["currentTilePreview"].image = "tiles/" + tile.sprite;
    objects["currentTilePreview"].snip = tile.snip ? [tile.snip[0] * 32, tile.snip[1] * 32, 32, 32] : undefined;

    // item and dialogue
    objects["selectedTile_Item"].text = "Item: " + (mapmaker.tileInfoItem == undefined ? "not" : mapmaker.tileInfoItem[0] + " x" + mapmaker.tileInfoItem[1] + " (" + mapmaker.tileInfoItem[2] + ")");
    if (mapmaker.tileInfoItem != undefined) objects["selectedTile_Item"].image = "items/" + items[mapmaker.tileInfoItem[0]]().source;
    else objects["selectedTile_Item"].image = "gear";

    objects["selectedTile_Dialogue"].text = "Dialogue: " + (tile.dialogue == undefined ? "not" : tile.dialogue);

    objects["tileInfoWindow_Warp"].power = tile.teleport != undefined;
    objects["tileInfoWindow_Warp"].tile = tile.teleport;

    // bottom buttons
    objects["tileInfoWindow_btmbtn_PlaceItem:text"].text = (mapmaker.tileInfoItem == undefined || mapmaker.tileInfoItem[2] == "chest") ? "Place Item" : "Change Item";
    objects["tileInfoWindow_btmbtn_PlaceChest:text"].text = (mapmaker.tileInfoItem == undefined || mapmaker.tileInfoItem[2] == "ground") ? "Place Chest" : "Change Chest";
    objects["tileInfoWindow_btmbtn_RemoveItem"].power = mapmaker.tileInfoItem != undefined;
    if (mapmaker.tileInfoItem != undefined) objects["tileInfoWindow_btmbtn_RemoveItem:text"].text = (mapmaker.tileInfoItem[2] == "ground") ? "Remove Item" : "Remove Chest";

    // layers
    for (let i = 0; i < 3; i++) {
        objects["tileInfoWindow_layer" + i].power = getTileName(mm_map, mapmaker.tileInfoPos[0], mapmaker.tileInfoPos[1], i + 1) !== "" && getTileName(mm_map, mapmaker.tileInfoPos[0], mapmaker.tileInfoPos[1], i + 1) !== "---";
        objects["tileInfoWindow_layer" + i].alpha = (i == ["map", "mapbg2", "mapfg"].indexOf(mapmaker.tileInfoPos[2])) ? 1 : 0.5;
    }
}

function tileInfoWindowShow() {
    if (objects["tileInfoWindow_bg"] == undefined) tileInfoWindowGenerate();
    groups["tileInfoWindow"].set("power", true);

    // due to it being re-used in the mm scene, it has to be moved and adjusted
    objects["currentTilePreview"].x = 0.675;
    objects["currentTilePreview"].y = 0.15;
    objects["currentTilePreview"].offset = [0, 0];
    objects["currentTilePreview"].sizeOffset = [128, 128];
    objects["currentTilePreview"].config.foreground = true;

    // highlighter thing exactly on the tile
    objects["tileInfoSelectedTile"].x = 0.5
    objects["tileInfoSelectedTile"].y = 0.5
    objects["tileInfoSelectedTile"].offset = [(mapmaker.tileInfoPos[0] - game.position[0]) * zswm - (zswm / 2), (zoom * scale * (mapmaker.tileInfoPos[1] - game.position[1] + 7.5) - ((zoom - 1) * scale * (mapmaker.tileInfoPos[1] - game.position[1] + 7.5))) - (wggj.canvas.h / 2)];
    objects["tileInfoSelectedTile"].sizeOffset = [zswm, zswm];
    objects["tileInfoSelectedTile"].power = true;
}

function tileInfoWindowHide() {
    if (objects["tileInfoWindow_bg"] == undefined) tileInfoWindowGenerate();
    groups["tileInfoWindow"].set("power", false);

    // move it back
    objects["currentTilePreview"].x = 0;
    objects["currentTilePreview"].y = 0.64;
    objects["currentTilePreview"].offset = [256 + 96, 48];
    objects["currentTilePreview"].sizeOffset = [64, 64];
    objects["currentTilePreview"].config.foreground = false;

    objects["tileInfoSelectedTile"].power = false;
}

function tileInfoWindowToggle() {
    if (objects["tileInfoWindow_bg"] == undefined) tileInfoWindowGenerate();

    if (objects["tileInfoWindow_bg"].power == false) tileInfoWindowShow();
    else tileInfoWindowHide();
}