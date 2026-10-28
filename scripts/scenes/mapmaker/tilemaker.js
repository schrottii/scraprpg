var tilemaker = {
    // source
    spritetype: "set",
    source: "",
    snip: [0, 0],
    tilesetWidth: 1024,
    tilesetHeight: 1024,
    animation: [1, 1],

    // auto layer
    recommendedLayer: "none",

    // appearance
    rotate: 0,

    // movement
    occupied: false,
    occupiedDirections: [],
    swim: false,
    teleport: ["", 0, 0],

    // special
    dialogue: "",
    condition: "",
    conditionInverted: false
};

var tilemaker_default = Object.assign({}, tilemaker);
for (let i in tilemaker) {
    if (typeof (tilemaker[i]) == "object" && tilemaker[i].length != undefined) {
        console.log(tilemaker[i]);
        tilemaker_default[i] = Object.assign([], tilemaker[i]);
    }
}

function ttcValid(key, defaultOkay = true) {
    // checks if a part of the tile is valid, when creating
    // basic checks for non existant values
    if (tilemaker[key] === undefined || tilemaker[key] === "") return false;

    // if it's not permitted to have the default value, they get compared here
    if (defaultOkay == false) {
        if (tilemaker_default[key].length != undefined) {
            // array, go through all
            let allTheSame = true;
            for (let key2 of tilemaker_default[key]) {
                if (tilemaker[key][key2] === undefined) continue;
                if (tilemaker_default[key][key2] !== tilemaker[key][key2]) {
                    allTheSame = false;
                    break;
                }
            }
            if (allTheSame == true) return false;
        }
        else {
            // single value
            if (tilemaker[key] === tilemaker_default[key]) return false;
        }
    }

    // all checks passed
    return true;
}

function tilemaker_autoID() {
    let inputMI;
    while (mapmaker.tileMakerIdentifier == "") {
        inputMI = prompt("new (map) identifier? one char");
        if (isValid(inputMI) && inputMI.length == 1) {
            mapmaker.tileMakerIdentifier = inputMI.toString();
        }
    }

    // ascii conform characters, more than 10 to handle large tilesets
    let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    let cordX = parseInt(tilemaker.snip[0]);
    let cordY = parseInt(tilemaker.snip[1]);

    let tempName = mapmaker.tileMakerIdentifier + chars[cordY] + "" + chars[cordX];

    //if (tempName.length == 1) return "0" + tempName;  <--- ??
    return tempName.substr(0, 3);
}

function tilemaker_newTile() {
    let newTileID;

    // create new
    let p = prompt('New map tile ID? (e. g. 001) ... a = AutoID');
    if (isValid(p)) newTileID = p;
    else return false;

    if (newTileID.toLowerCase() === "a") {
        // AutoID
        newTileID = tilemaker_autoID();
    }
    if (newTileID.length != 3) {
        alert("Tile ID needs to be 3 long! (e. g. R31)");
        return;
    }

    mapmaker.tileMakerTileID = newTileID;

    //tilemaker_clearTile();
    tilemaker_uTexts();
}

function tilemaker_clearTile() {
    tilemaker = Object.assign({}, tilemaker_default);
    tilemaker_uTexts();
}

function tilemaker_loadTile(ttl) {
    // clear the debris of what we had before
    tilemaker_clearTile();
    console.log(ttl);

    // first things first
    if (ttl.sprite != undefined) {
        tilemaker.spritetype = "sprite";
        tilemaker.source = ttl.sprite;
    }
    else if (ttl.set != undefined) {
        tilemaker.spritetype = "set";
        tilemaker.source = ttl.set;
        tilemaker.snip = ttl.snip;
    }
    else return false;

    // second things second
    if (ttl.occupied !== false && ttl.occupied !== true) {
        tilemaker.occupiedDirections = ttl.occupied.split(".");
    }
    else if (isValid(ttl.occupied)) tilemaker.occupied = ttl.occupied.toString();

    // third things third
    if (isValid(ttl.ani)) tilemaker.animation = ttl.ani;
    if (isValid(ttl.teleport)) tilemaker.teleport = ttl.teleport;
    if (isValid(ttl.dialogue)) tilemaker.dialogue = ttl.dialogue;
    if (isValid(ttl.swim)) tilemaker.swim = ttl.swim;
    if (isValid(ttl.condition)) tilemaker.condition = ttl.condition;
    if (isValid(ttl.condinv)) tilemaker.conditionInverted = ttl.condinv;

    tilemaker_uTexts();
    return true;
}

function tilemaker_createTile(createType = "map") {
    if (images["tiles/" + tilemaker.source] == undefined && images["tilesets/" + tilemaker.source] == undefined) {
        alert("You have to set a valid sprite or a set!");
        return false;
    }
    if (mapmaker.tileMakerTileID == "") {
        alert("You have to set an ID!");
        return false;
    }

    // here we create the tile (ttc = tile to create) 
    // with the names required by the game's internals, such as "ani" for animation
    // last second error catching and the like can be done here
    try {
        // sprite / set
        let ttc = {};
        if (tilemaker.spritetype == "sprite") ttc.sprite = tilemaker.source;
        else {
            ttc.set = tilemaker.source;
            ttc.snip = tilemaker.snip;
        }

        // adjust and process variables
        /*
        if (tileOccupied.toLowerCase().substr(0, 1) == "y" || tileOccupied.toLowerCase() == "true") ttc.occupied = true;
        else if (tileOccupied.toLowerCase().substr(0, 1) == "n" || tileOccupied.toLowerCase() == "false") ttc.occupied = false;
        else if (tileOccupied.toLowerCase() != "" && tileOccupied != undefined) ttc.occupied = tileOccupied.split(".");
        */

        if (ttcValid("occupiedDirections", true)) {
            ttc.occupied = tilemaker.occupiedDirections;
        }
        else if (ttcValid("occupied", true)) ttc.occupied = tilemaker.occupied;

        if (ttcValid("animation", false)) ttc.ani = tilemaker.animation;
        if (ttcValid("teleport", false)) ttc.teleport = tilemaker.teleport;
        if (ttcValid("rotate", false)) ttc.rotate = tilemaker.rotate;
        if (ttcValid("dialogue", false)) ttc.dialogue = tilemaker.dialogue;
        if (ttcValid("swim", false)) ttc.swim = true;
        if (ttcValid("recommendedLayer", true)) ttc.layer = tilemaker.recommendedLayer; // "none" is indeed valid and desired!

        if (ttcValid("condition", false)) {
            ttc.condition = tilemaker.condition;
            if (ttcValid("conditionInverted", false)) ttc.condinv = tilemaker.conditionInverted;
        }

        // create the actual tile
        if (createType == "map") {
            // CREATE button
            mm_map.tiles[mapmaker.tileMakerTileID] = ttc;
        }
        if (createType == "copy") {
            // Copy button
            let copyText = '"' + mapmaker.tileMakerTileID + '": ' + JSON.stringify(ttc);
            navigator.clipboard.writeText(copyText);
            return copyText;
        }
    }
    catch (e) {
        alert("An error occured!\n" + e);
    }
}

function tilemaker_occupyDirection(direction) {
    if (tilemaker.occupiedDirections.length == undefined) tilemaker.occupiedDirections = [];
    if (tilemaker.occupiedDirections.includes(direction)) tilemaker.occupiedDirections.splice(tilemaker.occupiedDirections.indexOf(direction), 1);
    else tilemaker.occupiedDirections.push(direction);
    tilemaker_uTexts();
}

function tilemaker_uTexts() {
    for (let o in objects) {
        if (objects[o].uText != undefined) {
            objects[o].uText(objects[o + ":text"]);
        }
    }
}

scenes["tilemaker"] = new Scene(
    () => {
        // Init
        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Tile Maker", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            loadScene("mapmaker");
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // top buttons
        createText("top_new_header", 0.2 + 0.15 / 2, 0.033, "New tile", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_new", 0.2, 0.05, 0.07, 0.05, "button", () => {
            tilemaker_newTile();
        }, { aText: { textBaseline: "alphabetic", text: "New ID", size: 24, color: "black" } });
        createButton("top_btn_erase", 0.285, 0.05, 0.07, 0.05, "button", () => {
            tilemaker_clearTile();
        }, { aText: { textBaseline: "alphabetic", text: "Erase", size: 24, color: "black" } });

        createText("top_load_header", 0.4 + 0.15 / 2, 0.033, "Load tile", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_load", 0.4, 0.05, 0.07, 0.05, "button", () => {
            if (isValid(selectedInfo) && selectedInfoType == "id" && selectedInfo.length == 3) {
                mapmaker.tileMakerTileID = selectedInfo;
                let thisTile;
                if (isValid(mm_map.tiles[mapmaker.tileMakerTileID])) thisTile = mm_map.tiles[mapmaker.tileMakerTileID];
                if (isValid(commontiles[mapmaker.tileMakerTileID])) thisTile = commontiles[mapmaker.tileMakerTileID];

                if (thisTile != undefined) {
                    tilemaker_loadTile(thisTile);
                }

                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("id");
            }
        }, { aText: { textBaseline: "alphabetic", text: "Load", size: 24, color: "black" } });
        createButton("top_btn_paste", 0.485, 0.05, 0.07, 0.05, "button", () => {
            let loaderLoad = prompt("Paste here:");
            if (loaderLoad === "" || loaderLoad === null) return;
            try {
                if (loaderLoad.includes(": {")) {
                    mapmaker.tileMakerTileID = loaderLoad.split(": {")[0].split(`"`)[1].substr(0, 3);
                    loaderLoad = "{" + loaderLoad.split(": {")[1];
                }
                loaderLoad = JSON.parse(loaderLoad);
                tilemaker_loadTile(loaderLoad);
            }
            catch (e) {
                alert("An error occured!\n" + e);
            }
        }, { aText: { textBaseline: "alphabetic", text: "Paste", size: 24, color: "black" } });
        // 0.4, 0.01, 0.15, 0.09

        createText("top_save_header", 0.6 + 0.15 / 2, 0.033, "Save tile", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_save", 0.6, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = tilemaker_createTile("map");
            if (result !== false) alert("Tile added/updated to the map's own tiles!");
        }, { aText: { textBaseline: "alphabetic", text: "This Map", size: 24, color: "black" } });
        createButton("top_btn_copy", 0.685, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = tilemaker_createTile("copy");
            if (result === false || result === true) alert("Something went wrong");
            else alert("Copied to clipboard: " + result);
        }, { aText: { textBaseline: "alphabetic", text: "Copy", size: 24, color: "black" } });

        createText("loadedTileID", 0.32, 0.18, "", { size: 32, color: "black", align: "left" });



        // CONTENTS
        // source
        createText("section_source", 0.05, 0.2, "Source", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_source_line", 0.06, 0.22, 0.2, 0.004, colors.buttonbottom);

        // spritetype : sprite or tileset?
        createButton("source_spritetype", 0.05, 0.25, 0.14, 0.08, "button", (c) => {
            if (tilemaker.spritetype == "sprite") {
                tilemaker.spritetype = "set";
                groups["tileset_objects"].set("power", true);
            }
            else {
                tilemaker.spritetype = "sprite";
                groups["tileset_objects"].set("power", false);
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Sprite or set", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_spritetype"].uText = (c) => { c.text = tilemaker.spritetype == "sprite" ? "Sprite" : "Tileset"; };
        createImage("source_spritetype_icon", 0.05, 0.25, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        // source : name of the sprite or tileset
        createButton("source_source", 0.2, 0.25, 0.14, 0.08, "button", (c) => {
            if (images["tilesets/" + selectedInfo] != undefined || images["tiles/" + selectedInfo] != undefined) {
                tilemaker.source = selectedInfo;
                if (tilemaker.spritetype == "set") {
                    tilemaker.tilesetWidth = images["tilesets/" + selectedInfo].width / 32;
                    tilemaker.tilesetHeight = images["tilesets/" + selectedInfo].height / 32;
                }
                selectedInfo = "";
                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo(tilemaker.spritetype == "sprite" ? "t" : "ts");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "source", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_source"].uText = (c) => { c.text = "Source: " + tilemaker.source; };
        createImage("source_source_icon", 0.2, 0.25, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });

        // snip : if tileset, where in it?
        createButton("source_snip", 0.35, 0.25, 0.14, 0.08, "button", (c) => {
            let input = prompt('New map tile set snip? X.Y (e. g. 1.2  ... 0.0 for top left)');
            if (tilemaker.snip == undefined || tilemaker.snip[0] < 0 || tilemaker.snip[1] < 0) tilemaker.snip = [0, 0];
            if (input === null || input === "") return;
            if (!input.includes(".")) return;

            input = input.split(".");
            tilemaker.snip = input;

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Snip", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_snip"].uText = (c) => { c.text = "Snip: " + tilemaker.snip[0] + ", " + tilemaker.snip[1]; };
        createImage("source_snip_icon", 0.35, 0.25, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        createButton("source_snip_X-", 0.35, 0.34, 0.035, 0.03, "button", (c) => {
            if (tilemaker.snip[0] > 0) tilemaker.snip[0] -= 1;
            objects["source_snip"].uText(objects["source_snip:text"]);
        }, { alpha: 0.5, aText: { text: "X-", color: "black", size: 16, textBaseline: "bottom" } });

        createButton("source_snip_X+", 0.35 + 0.035, 0.34, 0.035, 0.03, "button", (c) => {
            if (tilemaker.snip[0] < tilemaker.tilesetWidth - 1) tilemaker.snip[0] += 1;
            objects["source_snip"].uText(objects["source_snip:text"]);
        }, { alpha: 0.5, aText: { text: "X+", color: "black", size: 16, textBaseline: "bottom" } });

        createButton("source_snip_Y-", 0.35 + 0.035 * 2, 0.34, 0.035, 0.03, "button", (c) => {
            if (tilemaker.snip[1] > 0) tilemaker.snip[1] -= 1;
            objects["source_snip"].uText(objects["source_snip:text"]);
        }, { alpha: 0.5, aText: { text: "Y-", color: "black", size: 16, textBaseline: "bottom" } });

        createButton("source_snip_Y+", 0.35 + 0.035 * 3, 0.34, 0.035, 0.03, "button", (c) => {
            if (tilemaker.snip[1] < tilemaker.tilesetHeight - 1) tilemaker.snip[1] += 1;
            objects["source_snip"].uText(objects["source_snip:text"]);
        }, { alpha: 0.5, aText: { text: "Y+", color: "black", size: 16, textBaseline: "bottom" } });

        // animation : automatically snipping to the right
        createButton("source_animation", 0.5, 0.25, 0.14, 0.08, "button", (c) => {
            let input = prompt('New map tile animation? amount.distance (e. g. 3.1 ... distance 1 = no skips)');
            if (tilemaker.animation == undefined || tilemaker.animation[0] < 0 || tilemaker.animation[1] < 0) tilemaker.animation = [0, 0];
            if (input === null || input === "") return;
            if (!input.includes(".")) return;

            input = input.split(".");
            tilemaker.animation = input;

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Animation", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_animation"].uText = (c) => { c.text = "Animation: " + tilemaker.animation[0] + ", " + tilemaker.animation[1]; };
        createImage("source_animation_icon", 0.5, 0.25, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        // preview :3
        createSquare("source_tile_preview_bg", 0.24, 0.15, 0.06 / 16 * 9, 0.06, colors.bottomcolor, { alpha: 1, quadratic: true });
        createImage("source_tile_preview", 0.24, 0.15, 0.06, 0.06, "gear", { alpha: 0, quadratic: true });

        createSquare("source_tileset_preview_bg", 0.75, 0.2, 0.2048, 0.2048, colors.bottomcolor, { quadratic: false });
        createImage("source_tileset_preview", 0.75, 0.2, 0.2048, 0.2048, "gear", { alpha: 0, quadratic: false });
        createImage("source_tileset_preview_selected", 0.75, 0.2, 0, 0, "selected", { alpha: 0, quadratic: false, glow: 5 });
        createImage("source_tileset_preview_animationselector", 0.75, 0.2, 0, 0, "selected", { quadratic: false });

        createGroup("tileset_objects", [
            "source_snip", "source_snip_icon",
            "source_snip_X-", "source_snip_X+", "source_snip_Y-", "source_snip_Y+",
            "source_tileset_preview_bg", "source_tileset_preview", "source_tileset_preview_selected", "source_tileset_preview_animationselector"
        ]);



        // layer
        createText("section_layer", 0.05, 0.4, "Auto Layer", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_layer_line", 0.06, 0.42, 0.2, 0.004, colors.buttonbottom);

        // autolayer : which one gets recommended
        for (let i = 0; i < 4; i++) {
            createButton("layer_autolayer" + i, 0.05, 0.45, 0, 0, "layerbuttons", (c) => {
                tilemaker.recommendedLayer = ["map", "mapbg2", "mapfg", "none"][objects[c].i];

                objects["layer_autolayer0"].glow = 0;
                objects["layer_autolayer1"].glow = 0;
                objects["layer_autolayer2"].glow = 0;
                objects["layer_autolayer3"].glow = 0;
                objects[c].glow = 10;
            },
                {
                    sizeOffset: [64, 64], offset: [72 * i, 0], snip: [32 * i, 0, 32, 32],
                    glowColor: "white", glow: i == 3 ? 10 : 0
                });
            objects["layer_autolayer" + i].i = i;
        }



        // appearance
        createText("section_appearance", 0.45, 0.4, "Appearance", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_appearance_line", 0.46, 0.42, 0.2, 0.004, colors.buttonbottom);

        createButton("appearance_rotate", 0.45, 0.45, 0.14, 0.08, "button", (c) => {
            tilemaker.rotate = (tilemaker.rotate + 90) % 360;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Rotate", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_rotate"].uText = (c) => { c.text = "Rotate: " + tilemaker.rotate + "deg"; };
        createImage("appearance_rotate_icon", 0.45, 0.45, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });



        // movement
        createText("section_movement", 0.05, 0.6, "Movement", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_movement_line", 0.06, 0.62, 0.2, 0.004, colors.buttonbottom);

        // occupied : whether you can go on it or nah
        createButton("movement_walkable", 0.05, 0.65, 0.14, 0.08, "button", (c) => {
            tilemaker.occupied = !tilemaker.occupied;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Walkable", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_walkable"].uText = (c) => {
            c.text = tilemaker.occupied ? "Blocked" : "Walkable";

            groups["occupied_cross"].set("power", tilemaker.occupied ? true : false);

            objects["occupied_fromtop"].glow = tilemaker.occupiedDirections.includes("up") ? 0 : 10;
            objects["occupied_fromright"].glow = tilemaker.occupiedDirections.includes("left") ? 0 : 10;
            objects["occupied_frombottom"].glow = tilemaker.occupiedDirections.includes("down") ? 0 : 10;
            objects["occupied_fromleft"].glow = tilemaker.occupiedDirections.includes("right") ? 0 : 10;
        };
        createImage("movement_walkable_icon", 0.05, 0.65, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        createButton("occupied_fromtop", 0.03, 0.7, 0.03, 0.03, "layerbuttons", () => tilemaker_occupyDirection("up"), { snip: [96, 0, 32, 32], quadratic: true, rotate: 180 });
        createButton("occupied_fromright", 0.04, 0.72, 0.03, 0.03, "layerbuttons", () => tilemaker_occupyDirection("left"), { snip: [96, 0, 32, 32], quadratic: true, rotate: 270 });
        createButton("occupied_frombottom", 0.03, 0.74, 0.03, 0.03, "layerbuttons", () => tilemaker_occupyDirection("down"), { snip: [96, 0, 32, 32], quadratic: true, rotate: 0 });
        createButton("occupied_fromleft", 0.02, 0.72, 0.03, 0.03, "layerbuttons", () => tilemaker_occupyDirection("right"), { snip: [96, 0, 32, 32], quadratic: true, rotate: 90 });
        createGroup("occupied_cross", ["occupied_fromtop", "occupied_fromright", "occupied_frombottom", "occupied_fromleft"]);

        // swim : can you swim here? (if no, normal movement)
        createButton("movement_swim", 0.2, 0.65, 0.14, 0.08, "button", (c) => {
            tilemaker.swim = !tilemaker.swim;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Swim", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_swim"].uText = (c) => { c.text = tilemaker.swim ? "Can Swim" : "No Swim"; };
        createImage("movement_swim_icon", 0.2, 0.65, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        // teleport: map and xy to teleport to, when you move onto this tile
        createButton("movement_teleport", 0.35, 0.65, 0.14, 0.08, "button", (c) => {
            let input = prompt('Teleport to? map.x.y (e. g. original.7.8 or map2.0.0)');
            if (tilemaker.teleport == undefined || tilemaker.teleport[1] < 0 || tilemaker.teleport[2] < 0) tilemaker.teleport = [tilemaker.teleport[0], 0, 0];
            if (input === null || input === "") return;
            if (!input.includes(".")) return;

            input = input.split(".");
            tilemaker.teleport = input;

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "No Teleport", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_teleport"].uText = (c) => { c.text = tilemaker.teleport[0] != "" ? (tilemaker.teleport[0] + " [" + tilemaker.teleport[1] + ", " + tilemaker.teleport[2] + "]") : "No Teleport"; };
        createImage("movement_teleport_icon", 0.35, 0.65, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });



        // special
        createText("section_special", 0.55, 0.6, "Special", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_special_line", 0.56, 0.62, 0.2, 0.004, colors.buttonbottom);

        // dialogue : when you step on me, I talk to you
        createButton("special_dialogue", 0.55, 0.65, 0.14, 0.08, "button", (c) => {
            if (selectedInfoType == "dialogues" && isValid(selectedInfo)) {
                if (mm_map.dialogues[selectedInfo] != undefined && isValid(selectedInfo)) {
                    tilemaker.dialogue = selectedInfo;
                    makerInfoHide();
                }
                else {
                    alert("Does not exist!");
                }
            }
            else {
                makerInfoShow();
                renderMakerInfo("dialogues");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "No Dialogue", color: "black", size: 20, textBaseline: "bottom" } });
        objects["special_dialogue"].uText = (c) => { c.text = tilemaker.dialogue != "" ? "Dialogue: " + tilemaker.dialogue : "No Dialogue"; };
        createImage("special_dialogue_icon", 0.55, 0.65, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });

        // dialogue : when you step on me, I talk to you
        createButton("special_condition", 0.7, 0.65, 0.14, 0.08, "button", (c) => {
            let cond = prompt("Condition? Write code... (no () =>)");
            if (!isValid(cond)) return;

            let inv = confirm("Inverted?");
            if (!isValid(inv)) inv = false;

            tilemaker.condition = cond;
            tilemaker.conditionInverted = inv;

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "No Condition", color: "black", size: 20, textBaseline: "bottom" } });
        objects["special_condition"].uText = (c) => {
            c.text = tilemaker.condition != "" ? "Has Condition" + (tilemaker.conditionInverted === true ? " (Inverted)" : "") : "No Condition";
            objects["fullCondition"].text = tilemaker.condition;
        };
        createImage("special_condition_icon", 0.7, 0.65, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        createText("fullCondition", 0.84, 0.75, "", { align: "right", size: 16, color: "black" });


        
        // init - set all texts as far as ye can
        tilemaker_uTexts();
    },
    (tick) => {
        // Loop
        objects["loadedTileID"].text = "ID: " + mapmaker.tileMakerTileID;

        if (tilemaker.spritetype == "set") {
            objects["source_tileset_preview"].image = tilemaker.source != "" ? "tilesets/" + tilemaker.source : "gear";
            objects["source_tileset_preview"].alpha = tilemaker.source != "" ? 1 : 0;
            objects["source_tileset_preview_selected"].alpha = tilemaker.source != "" ? 1 : 0;
            objects["source_tileset_preview_selected"].x = 0.75 + tilemaker.snip[0] * 0.2048 / tilemaker.tilesetWidth;
            objects["source_tileset_preview_selected"].y = 0.2 + tilemaker.snip[1] * 0.2048 / tilemaker.tilesetHeight;
            objects["source_tileset_preview_selected"].w = 0.2048 / tilemaker.tilesetWidth * ((tilemaker.animation[1] * (tilemaker.animation[0] - 1)) + 1); // the -1+1 thing is to have the correct amount (width), and not leftovers to the right
            objects["source_tileset_preview_selected"].h = 0.2048 / tilemaker.tilesetHeight;

            if (tilemaker.animation[0] != 1) {
                objects["source_tileset_preview_animationselector"].power = true;
                mapmaker.animateTime = (mapmaker.animateTime + delta / 1000) % tilemaker.animation[0];

                objects["source_tileset_preview_animationselector"].x = 0.75 + (tilemaker.snip[0] + Math.floor(mapmaker.animateTime) * tilemaker.animation[1]) * 0.2048 / tilemaker.tilesetWidth;
                objects["source_tileset_preview_animationselector"].y = 0.2 + tilemaker.snip[1] * 0.2048 / tilemaker.tilesetHeight;
                objects["source_tileset_preview_animationselector"].w = 0.2048 / tilemaker.tilesetWidth;
                objects["source_tileset_preview_animationselector"].h = 0.2048 / tilemaker.tilesetHeight;
            }
            else objects["source_tileset_preview_animationselector"].power = false;
        }
        else objects["source_tileset_preview"].alpha = 0;

        objects["source_tile_preview"].alpha = tilemaker.source != "" ? 1 : 0;
        if (tilemaker.source != "") {
            if (tilemaker.spritetype == "sprite") {
                objects["source_tile_preview"].image = "tiles/" + tilemaker.source;
                objects["source_tile_preview"].snip = undefined;
            }
            if (tilemaker.spritetype == "set") {
                objects["source_tile_preview"].image = "tilesets/" + tilemaker.source;
                if (tilemaker.animation[0] == 1) objects["source_tile_preview"].snip = [tilemaker.snip[0] * 32, tilemaker.snip[1] * 32, 32, 32];
                else objects["source_tile_preview"].snip = [(tilemaker.snip[0] + Math.floor(mapmaker.animateTime) * tilemaker.animation[1]) * 32, tilemaker.snip[1] * 32, 32, 32];
            }
            objects["source_tile_preview"].rotate = tilemaker.rotate;
        }

        // hotkeys
        if (mapmaker.hotkeyBlocker > 0) mapmaker.hotkeyBlocker -= 1 / delta;
        
        if (mapmaker.hotkeyBlocker <= 0) {
            if (currentKeys["escape"]) loadScene("mapmaker");
            if (currentKeys["t"]) makerInfoToggle();

            mapmaker.hotkeyBlocker = 0.3;
        }
    }
);