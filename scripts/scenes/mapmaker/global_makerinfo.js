// maker info 3.0
const MAKER_INFO_SELBTN_ITEMS = 32;
var makerInfoSelbtnItems = 0;

var selectedInfo = "";
var selectedInfoType = "";

var makerInfoCategories = [
    ["Maps", "m"],
    ["Tile IDs", "id"],
    ["Map Packs", "mapPacks"],
    ["> Spawns", "spawns"],
    ["> Dialogues", "dialogues"],
    ["> NPCs", "npcs"],
    ["Tile pics", "t"],
    ["Tileset pics", "ts"],
    ["Character pics", "characterImages"],
    ["Items", "items"],
    ["Map Enemies", "mapEnemies"],
    ["Music", "music"],
    ["Scripts", "scripts"],
    ["Quests", "quests"],
    ["Shops", "shops"],
    ["Protagonists", "protagonists"],
];

function makerInfoGenerate() {
    // background and general objects
    createButton("makerInfo_bg1", 0, 0, 0.3, 1, colors.buttonbottom, () => { }, { sizeOffset: [64, 0], power: false, clickthrough: false });
    objects["makerInfo_bg1"].onHold = () => { }; // anti clickthrough
    createSquare("makerInfo_bg2", 0.1, 0, 0.2, 1, colors.buttontop, { offset: [8, 8], sizeOffset: [48, -16], power: false });

    createText("makerInfo_title", 0.2, 0.037, "Maker Info 3.0", { offset: [32, 0], size: 32, color: "black", align: "center", textBaseline: "bottom", power: false });
    createSquare("makerInfo_bg3", 0.1, 0.034, 0.2, 0, colors.buttonbottom, { sizeOffset: [64, 4], offset: [0, 8], power: false }); // behind categories
    createButton("makerInfo_close", 0.3, 0.034, 0, 0, "button",
        () => { makerInfoHide(); },
        {
            offset: [32 - 16 + 8, -8 - 16], sizeOffset: [32, 32],
            aText: { text: "X", size: 24, color: "black", power: false }
        });

    createText("makerInfo_length", 0.1, 0.96, "", { size: 16, color: "black", align: "right", power: false });
    createText("makerInfo_selected", 0.1, 0.98, "", { size: 16, color: "black", align: "right", power: false });

    // new page buttons, using wggj scroll now
    createButton("makerInfo_pageReset", 0.3125, 0.85, 0.0275, 0.05, "button", () => {
        objects["makerInfo_sels"].scrolledY = 0;
    }, { aText: { text: "P0", size: 24, color: "black", align: "center" } });
    createButton("makerInfo_pageDown", 0.3125, 0.9, 0.0275, 0.05, "button", () => {
        objects["makerInfo_sels"].scrolledY += 0.5 * wggj.canvas.h;
        objects["makerInfo_sels"].scrolledY = Math.min(0, objects["makerInfo_sels"].scrolledY);
    }, { aText: { text: "P-", size: 24, color: "black", align: "center" } });
    createButton("makerInfo_pageUp", 0.3125, 0.95, 0.0275, 0.05, "button", () => {
        objects["makerInfo_sels"].scrolledY -= 0.5 * wggj.canvas.h;
    }, { aText: { text: "P+", size: 24, color: "black", align: "center" } });

    createGroup("makerInfo", [
        "makerInfo_bg1", "makerInfo_bg2",
        "makerInfo_title", "makerInfo_bg3", "makerInfo_close",
        "makerInfo_length", "makerInfo_selected",
        "makerInfo_pageUp", "makerInfo_pageDown"
    ]);

    // categories (on the left)
    let iCat = 0;
    let y = 0.91 / makerInfoCategories.length;
    let h = y * 0.95; // leaves some space on top/bottom, x0.95 for gaps
    for (let cat of makerInfoCategories) {
        createButton("makerInfo_category_" + cat[1], 0, 0.02 + (y * iCat), 0.1, h, "button", (c) => {
            mapmaker.makerInfoScroll[selectedInfoType] = objects["makerInfo_sels"].scrolledY;
            renderMakerInfo(objects[c].cat);
            objects["makerInfo_sels"].scrolledY = mapmaker.makerInfoScroll[objects[c].cat] != undefined ? mapmaker.makerInfoScroll[objects[c].cat] : 0;
        },
            {
                clickthrough: false, power: false,
                aText: { text: cat[0], size: 20, align: "center", maxW: 0.1, power: false }
            });
        objects["makerInfo_category_" + cat[1]].cat = cat[1];
        groups["makerInfo"].addChild("makerInfo_category_" + cat[1]);
        groups["makerInfo"].addChild("makerInfo_category_" + cat[1] + ":text");
        iCat++;
    }

    // scrollable container & groups
    createContainer("makerInfo_sels", 0.1, 0.05, 0.225, 0.925, {
        YScroll: true, YLimit: [0.000001, 0]
    }, []);

    createGroup("makerInfo_selbtns", []);
    createGroup("makerInfo_selbtn_images", []);

    // the buttons (used to be text, now buttons) in the maker info
    makerInfoGenerateMoreButtons(MAKER_INFO_SELBTN_ITEMS);
}

function makerInfoGenerateMoreButtons(amount) {
    if (amount <= makerInfoSelbtnItems) return;
    for (let i = makerInfoSelbtnItems; i < amount; i++) {
        // button
        createButton("makerInfo_selbtn" + i, 0.1, 0.05, 0.2, 0, "button", (c) => {
            selectedInfo = objects[c].g;
            objects["makerInfo_selected"].text = selectedInfo;

            groups["makerInfo_selbtns"].set("image", "button");
            objects[c].image = "buttondark";
        }, {
            sizeOffset: [0, 30], offset: [8, 32 * i], power: false,
            aText: { text: "", align: "left", offset: [-0.033 * wggj.canvas.w, 0], size: 24, color: "black", power: false }
        });
        objects["makerInfo_selbtn" + i].g = ""; // data carrier
        groups["makerInfo_selbtns"].addChild("makerInfo_selbtn" + i);
        objects["makerInfo_sels"].addChild("makerInfo_selbtn" + i);

        // preview image if applicable
        createImage("makerInfo_selbtn_image" + i, 0.1, 0.05, 0, 0, "gear", {
            sizeOffset: [32, 32], offset: [8, 32 * i], power: false
        });
        groups["makerInfo_selbtn_images"].addChild("makerInfo_selbtn_image" + i);
        objects["makerInfo_sels"].addChild("makerInfo_selbtn_image" + i);

        makerInfoSelbtnItems++;
    }
}

function makerInfoShow() {
    if (objects["makerInfo_bg1"] == undefined) makerInfoGenerate();
    groups["makerInfo"].set("power", true);
}

function makerInfoHide() {
    if (groups["makerInfo"] != undefined) groups["makerInfo"].set("power", false);
    if (groups["makerInfo_selbtns"] != undefined) groups["makerInfo_selbtns"].set("power", false);
    if (groups["makerInfo_selbtn_images"] != undefined) groups["makerInfo_selbtn_images"].set("power", false);
    mapmaker.placeBlocker = 0.3;

    selectedInfo = "";
    selectedInfoType = "";
}

function makerInfoToggle() {
    if (objects["makerInfo_bg1"] == undefined) makerInfoGenerate();

    if (objects["makerInfo_bg1"].power == false) makerInfoShow();
    else makerInfoHide();
}

function renderMakerInfo(type) {
    if (objects["makerInfo_bg1"] == undefined) makerInfoGenerate();

    let grabFrom;
    let grabImage = [];
    let imageSnip = 0;
    let ikeys; // imo unnecessary to create it here, even if unused, but VS Code insists
    if (type != "auto") selectedInfoType = type;

    //if (type == "auto") type = createTileInfoprevM;
    //else createTileInfoprevM = type;

    switch (type) {
        case "t":
            grabFrom = [];
            ikeys = Object.keys(images);
            for (i in ikeys) {
                if (ikeys[i].substr(0, 6) == "tiles/") {
                    grabFrom.push(ikeys[i].substr(6));
                    grabImage.push(ikeys[i]);
                }
            }
            break;
        case "ts":
            grabFrom = [];
            ikeys = Object.keys(images);
            for (i in ikeys) {
                if (ikeys[i].substr(0, 9) == "tilesets/") {
                    grabFrom.push(ikeys[i].substr(9));
                    grabImage.push(ikeys[i]);
                }
            }
            break;
        case "id":
            grabFrom = Object.keys(Object.assign({}, mm_map.tiles, commontiles));
            break;
        case "m":
            grabFrom = Object.keys(maps);
            break;
        case "mapEnemies":
            grabFrom = Object.keys(mapenemies);
            for (let m in mapenemies) {
                if (mapenemies[m]().source == "gen") grabImage.push("gear");
                else grabImage.push(mapenemies[m]().source);
            }
            imageSnip = 32;
            break;
        case "spawns":
            grabFrom = [];
            if (mm_map.spawns != undefined) {
                let j = 0;
                ikeys = Object.keys(mm_map.spawns); // spawn chances
                for (i in mm_map.spawns) {
                    grabFrom.push(ikeys[j] + " | " + mm_map.spawns[i]); // chance | name
                    if (mapenemies[i]().source == "gen") grabImage.push("gear");
                    else grabImage.push(mapenemies[i]().source);
                    j += 1;
                }
                imageSnip = 32;
            }
            break;
        case "dialogues":
            if (mm_map.dialogues != undefined) grabFrom = Object.keys(mm_map.dialogues);
            else grabFrom = [];
            break;
        case "portraits":
            grabFrom = [];
            ikeys = Object.keys(images);
            for (i in ikeys) {
                if (ikeys[i].substr(0, 10) == "Portraits_") {
                    grabFrom.push(ikeys[i]);
                    grabImage.push(ikeys[i]);
                }
            }
            break;
        case "npcs":
            grabFrom = [];
            if (mm_map.npcs != undefined) {
                for (let n in mm_map.npcs) {
                    grabFrom.push(n);
                    grabImage.push(mm_map.npcs[n].source);
                }
            }
            imageSnip = 32;
            break;
        case "music":
            // for selecting the music in map info (est 2025)
            grabFrom = [];
            for (let m in audio) {
                if (m.substr(0, 4) == "bgm/" && !m.includes("intro")) grabFrom.push(m); // exclude intro, we auto pick that later
            }
            break;
        case "mapPacks":
            grabFrom = [];
            for (let p in packs) {
                grabFrom.push(p);
            }
            break;
        case "characterImages":
            grabFrom = [];
            for (let im in images) {
                if (im.substr(0, 8) == "enemies/" || im.substr(0, 5) == "npcs/" || characters.includes(im)) {
                    grabFrom.push(im);
                    grabImage.push(im);
                }
            }
            imageSnip = 32;
            break;
        case "items":
            grabFrom = [];
            for (let it in items) {
                if (it != "default") {
                    grabFrom.push(it);
                    grabImage.push("items/" + items[it]().source);
                }
            }
            break;
        case "scripts":
            // I am clinically insane
            grabFrom = [];
            for (let sc in dialogueScriptTypes) {
                grabFrom.push(dialogueScriptTypes[sc]);
            }
            break;
        case "quests":
            grabFrom = [];
            for (let q in quests) {
                grabFrom.push(q);
            }
            break;
        case "shops":
            grabFrom = [];
            for (let q in shops) {
                grabFrom.push(q);
            }
            break;
        case "protagonists":
            grabFrom = [];
            for (let q in characters) {
                grabFrom.push(characters[q]);
            }
            break;
    }

    if (grabFrom == undefined) {
        console.log(type, grabFrom);
        return false;
    }

    objects["makerInfo_length"].text = grabFrom.length;
    makerInfoGenerateMoreButtons(grabFrom.length);

    //let pageAdd = createTileInfoPage * createTileInfoPageLength;
    for (let g = 0; g < makerInfoSelbtnItems; g++) {
        objects["makerInfo_selbtn" + g].image = "button";

        if (grabFrom[g] != undefined) {
            objects["makerInfo_selbtn" + g + ":text"].text = grabFrom[g];
            objects["makerInfo_selbtn" + g].g = grabFrom[g];
            objects["makerInfo_selbtn" + g].power = true;

            if (grabImage.length > 0) {
                objects["makerInfo_selbtn_image" + g].power = true;
                objects["makerInfo_selbtn_image" + g].image = grabImage[g];

                if (imageSnip == 0) objects["makerInfo_selbtn_image" + g].snip = undefined;
                else objects["makerInfo_selbtn_image" + g].snip = [0, 0, imageSnip, imageSnip];
            }
            else objects["makerInfo_selbtn_image" + g].power = false;
        }
        else {
            objects["makerInfo_selbtn" + g + ":text"].text = "";
            objects["makerInfo_selbtn" + g].power = false;
            objects["makerInfo_selbtn_image" + g].power = false;
        }
    }
}