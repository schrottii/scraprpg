scenes["tilepicker"] = new Scene(
    () => {
        // Init
        let tileProperties =["sprite", "set", "snip", "occupied", "ani", "teleport", "rotate", "dialogue", "swim", "layer", "condition"];

        function generateTiles() {
            if (objects["tile0"].tileid != undefined) {
                // we already generated before, so gotta be-empty ye first
                objects["tiles_list"].set("glow", 0);
                objects["tiles_list"].set("power", false);
            }

            // calculate width
            let pageWidth;
            for (let t = 0; t < 25; t++) {
                if (objects["tile" + t].offset[0] <= width * scale * 0.64) pageWidth = t;
            }

            let nr = 0; // like index but for the UI elements, don't count up if none were changed
            let tileName;
            let tileGrab;
            //let starti = 0 + Math.ceil(tileMenuPage * pageSize / 2);
            let i = 0;//starti;
            let pageSize = 200; // temp, not used anymore
            //let pageLines = 1;

            let commontiles_keys = Object.keys(commontiles);
            let maptiles_keys = Object.keys(mm_map.tiles);

            // actual generation inside the tile picker!
            while (i < pageSize /*+ starti*/) {
                if ((nr % 25) % pageWidth == 0 && nr > 0) {
                    nr += (25 - pageWidth);
                    //pageLines += 1;
                }

                if (mapmaker.tileSource == "common") {
                    tileName = commontiles_keys[i];
                    tileGrab = commontiles[tileName];
                }
                if (mapmaker.tileSource == "map") {
                    tileName = maptiles_keys[i];
                    tileGrab = mm_map.tiles[tileName];
                }

                if (tileName != undefined && (mm_map.tiles[tileName] == undefined || mapmaker.tileSource == "map")) {
                    if (tileName != "empty") {
                        // getting the right image
                        if (tileGrab.set != undefined) {
                            if (images["tilesets/" + tileGrab.set] != undefined) objects["tile" + nr].image = "tilesets/" + tileGrab.set;
                            else objects["tile" + nr].image = "gear";
                            objects["tile" + nr].snip = [tileGrab.snip[0] * 32, tileGrab.snip[1] * 32, 32, 32];
                        }
                        else {
                            if (images["tiles/" + tileGrab.sprite] != undefined) objects["tile" + nr].image = "tiles/" + tileGrab.sprite;
                            else objects["tile" + nr].image = "gear";
                            objects["tile" + nr].snip = false;
                        }

                        // letting us grab the tile on a click
                        objects["tile" + nr].tile = tileGrab;
                        objects["tile" + nr].tileid = tileName;
                        objects["tile" + nr].power = true;

                        // small icons
                        /*
                        let nr2 = (nr * 4);
                        if (tileGrab.occupied != undefined && tileGrab.occupied != false) tilesMenuIcons[nr2].alpha = 1;
                        if (tileGrab.ani != undefined) tilesMenuIcons[nr2 + 1].alpha = 1;
                        if (tileGrab.teleport != undefined) tilesMenuIcons[nr2 + 2].alpha = 1;
                        if (tileGrab.dialogue != undefined || tileGrab.action != undefined) tilesMenuIcons[nr2 + 3].alpha = 1;
                        */

                        nr += 1;
                    }
                }
                i += 1;
            }

            objects["tiles_list"].YLimit[1] = -0.6 + objects["tile" + nr].offset[1] / wggj.canvas.h;
        }

        function resizeTiles() {
            let sizes = [/*16, */32, 48, 64, 80, 96, 120];

            //offset: [72 * (t % 25), 32 + (72 * Math.floor(t / 25))], sizeOffset: [64, 64]
            objects["tiles_list"].set("offset", (c) => [sizes[mapmaker.tilePickerZoom] * 1.125 * (c.t % 25), 32 + (sizes[mapmaker.tilePickerZoom] * 1.125 * Math.floor(c.t / 25))]);
            objects["tiles_list"].set("sizeOffset", (c) => [sizes[mapmaker.tilePickerZoom], sizes[mapmaker.tilePickerZoom]]);
        }

        function updateCurrentTileInfo(tile, tileID) {
            // update properties texts
            //console.log(tile);
            let txt = "";
            let txt2 = "";
            for (let prop of tileProperties) {
                txt += prop + ":\n";// + " ".repeat(30 - (prop.length * 2)) + tile[prop] + "\n";
                txt2 += (tile[prop] != undefined ? tile[prop] : "-") + "\n"
            }

            objects["selectedTileProperties"].text = txt;
            objects["selectedTileProperties2"].text = txt2;

            // update image and main name
            //objects["selectedTileIMG"].image = image;
            //objects["selectedTileIMG"].snip = snip;
            objects["currentTilePreview"].power = true;

            objects["selectedTileName"].text = tileID;

            // update prepicker preview
            updatePrePickerPreview();
        }

        function updateGlowingTiles() {
            objects["tiles_list"].set("glow", 0);
            objects["tiles_list"].set("glow", 10, (c2) => {
                for (let rec of recentlyUsedTilesList) {
                    if (rec != undefined && rec[1] == c2.tileid) return true;
                }
                return false;
            });
        }

        function updatePrePickerPreview() {
            let prePickerLength = 0;
            for (let t = 0; t < 25; t++) {
                if (recentlyUsedTilesList[t] != undefined && recentlyUsedTilesList[t][0] != "gear") {
                    if (t < 9) {
                        objects["recentlyUsedTilesPreview" + t].image = recentlyUsedTilesList[t][0];
                        objects["recentlyUsedTilesPreview" + t].snip = recentlyUsedTilesList[t][2];
                        objects["recentlyUsedTilesPreview" + t].alpha = 1;
                    }
                    prePickerLength++;
                }
                else {
                    if (t < 9) objects["recentlyUsedTilesPreview" + t].alpha = 0;
                }
            }
            objects["recentTilesPreview"].text = "Prepicker Preview (" + prePickerLength + "/24)";
        }

        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Tile Picker", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            loadScene("mapmaker");
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // the separator
        createSquare("the_separator", 0.65, 0.15, 0.005, 0.8, colors.bottomcolor);

        // type shi
        createButton("top_btn_commontiles", 0.2, 0.01, 0.15, 0.09, "button", () => {
            mapmaker.tileSource = "common";
            generateTiles();
        }, { aText: { textBaseline: "alphabetic", text: "Common Tiles", size: 24, color: "black" } });
        createButton("top_btn_maptiles", 0.4, 0.01, 0.15, 0.09, "button", () => {
            mapmaker.tileSource = "map";
            generateTiles();
        }, { aText: { textBaseline: "alphabetic", text: "Map Tiles", size: 24, color: "black" } });
        createButton("top_btn_zoom", 0.6, 0.01, 0.15, 0.09, "button", () => {
            mapmaker.tilePickerZoom = (mapmaker.tilePickerZoom + 1) % 5;
            resizeTiles();
            generateTiles();
            updateGlowingTiles();
        }, { aText: { textBaseline: "alphabetic", text: "Zoom", size: 24, color: "black" } });

        // the tilies :)
        createContainer("tiles_list", 0, 0.1, 0.65, 0.9, { YScroll: true, YScrollMod: 2, limitEffect: true, YLimit: [0.000001, 0] }, []);

        for (let t = 0; t < 200; t++) {
            createButton("tile" + t, 0.02, 0.1, 0, 0, "gear", (c) => {
                changeTileToPlace(objects[c].tileid);

                updateCurrentTileInfo(objects[c].tile, objects[c].tileid);

                // update local glow
                updateGlowingTiles();
                objects[c].glow = 30;
            }, {
                //offset: [72 * (t % 25), 32 + (72 * Math.floor(t / 25))], sizeOffset: [64, 64],
                power: false, glowColor: "white", glow: 0
            });
            objects["tile" + t].t = t;
            objects["tiles_list"].addChild("tile" + t);
            /*
            for (t2 = 0; t2 < 4; t2++) {
                tilesMenuIcons.push(controls.image({ // the smol images
                    anchor: [0.05, 0.2], offset: [32 + (72 * (t % 25)) + (16 * t2), 84 + (72 * Math.floor(t / 25))], sizeOffset: [16, 16],
                    source: "tilepickerinfoicons", snip: [8 * t2, 0, 8, 8], alpha: 0,
                }));
            }
                */
        }

        // right side - info about current tile
        createImage("currentTilePreview", 0.675, 0.15, 0, 0, "gear", { sizeOffset: [128, 128], power: false });
        createText("selectedTileName", 0.8, 0.15, "", { size: 40, color: "black", align: "left", offset: [0, 64] });

        createSmartText("selectedTileProperties", 0.675, 0.33, "", { size: 32, color: "black", align: "left" });
        createSmartText("selectedTileProperties2", 0.775, 0.33, "", { size: 32, color: "black", align: "left" });

        // right side - recent tiles preview
        createText("recentTilesPreview", 0.675, 0.8, "Prepicker Preview", { size: 40, color: "black", align: "left", offset: [0, 64] });
        for (let t = 0; t < 9; t++) {
            createImage("recentlyUsedTilesPreview" + t, 0.65, 0.85, 0, 0, "gear", {
                offset: [72 * (t % 60) + 32, 72 * Math.floor(t / 60) + 32], sizeOffset: [64, 64],
                alpha: 0
            });
        }

        // go go go
        resizeTiles();
        generateTiles();
        updateGlowingTiles();

        updatePrePickerPreview();
    },
    (tick) => {
        // Loop

    }
);

/*
function openTilesMenu() {
            ////////////////////////////////////////
            // NOT CONVERTED YET
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
            pageSize += 1;

            let nr = 0;
            let til;
            let grb;
            let starti = 0 + Math.ceil(tileMenuPage * pageSize / 2);
            let i = starti;

            // actual generation inside the tile picker!
            while (i < pageSize + starti) {
                if ((nr % 25) % pageWidth == 0 && nr > 0) nr += (25 - pageWidth);
                if (tileSource == "common") {
                    til = Object.keys(commontiles)[i];
                    grb = commontiles[til];
                }
                if (tileSource == "map") {
                    til = Object.keys(mm_map.tiles)[i];
                    grb = mm_map.tiles[til];
                }

                if (til != undefined && (mm_map.tiles[til] == undefined || tileSource == "map")) {
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
            ////////////////////////////////////////
            // NOT CONVERTED YET
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


    // Tiles menu ahahyahahaaaa
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.7],
        fill: colors.buttonbottom, alpha: 0
    }));
    tilesMenuControls.push(controls.rect({
        anchor: [0.05, 0.2], sizeAnchor: [0.9, 0.7], offset: [8, 8], sizeOffset: [-16, -16],
        fill: colors.buttontop, alpha: 0,
    }));
    tilesMenuControls.push(controls.button({
        anchor: [0.05, 0.15], sizeAnchor: [0.3, 0.05],
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
        anchor: [0.65, 0.15], sizeAnchor: [0.3, 0.05],
        text: "Map",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileSource = "map";
                openTilesMenu();
            }
        }
    }));
    tilesMenuControls.push(controls.label({
        anchor: [0.5, 0.15],
        text: "Tile Picker", alpha: 0,
    }));

    // pages
    var tileMenuPage = 0;
    tilesMenuControls.push(controls.button({
        anchor: [0.05, 0.9], sizeAnchor: [0.15, 0.05],
        text: "<--",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (tileMenuPage > 0) tileMenuPage--;
                openTilesMenu();
            }
        }
    }));
    tilesMenuControls.push(controls.button({
        anchor: [0.8, 0.9], sizeAnchor: [0.15, 0.05],
        text: "-->",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                tileMenuPage++;
                openTilesMenu();
            }
        }
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
            tilesMenuIcons.push(controls.image({ // the smol images
                anchor: [0.05, 0.2], offset: [32 + (72 * (t % 25)) + (16 * t2), 84 + (72 * Math.floor(t / 25))], sizeOffset: [16, 16],
                source: "tilepickerinfoicons", snip: [8 * t2, 0, 8, 8], alpha: 0,
            }));
        }
    }

    */