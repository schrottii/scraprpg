var npcmaker = {
    // source
    source: "",
    alpha: 1,

    // movement
    position: [0, 0],
    walkingSpeed: 1,
    walkingInterval: 0.5,
    movementType: 0,
    path: [],

    // special
    dialogue: "",
    condition: "",
    conditionInverted: false
};

var npcmaker_default = Object.assign({}, npcmaker);
for (let i in npcmaker) {
    if (typeof (npcmaker[i]) == "object" && npcmaker[i].length != undefined) {
        npcmaker_default[i] = Object.assign([], npcmaker[i]);
    }
}

function newnpcValid(key, defaultOkay = true) {
    // checks if a part of the NPC is valid, when creating
    // basic checks for non existant values
    if (tilemaker[key] === undefined || tilemaker[key] === "") return false;

    // if it's not permitted to have the default value, they get compared here
    if (defaultOkay == false) {
        if (npcmaker_default[key].length != undefined) {
            // array, go through all
            let allTheSame = true;
            for (let key2 of npcmaker_default[key]) {
                if (npcmaker[key][key2] === undefined) continue;
                if (npcmaker_default[key][key2] !== npcmaker[key][key2]) {
                    allTheSame = false;
                    break;
                }
            }
            if (allTheSame == true) return false;
        }
        else {
            // single value
            if (npcmaker[key] === npcmaker_default[key]) return false;
        }
    }

    // all checks passed
    return true;
}

function npcmaker_newNPC() {
    let newID;

    // create new
    let p = prompt('New ID / name? (e. g. endte)');
    if (isValid(p)) newID = p;
    else return false;

    // no auto ID or verification for 3 length needed
    mapmaker.npcMakerID = newID;

    tilemaker_uTexts();
}

function npcmaker_clearNPC() {
    npcmaker = Object.assign({}, npcmaker_default);
    tilemaker_uTexts();
}

function npcmaker_loadNPC(newnpc) {
    // clear the debris of what we had before
    npcmaker_clearNPC();
    console.log(newnpc);

    // first things first
    npcmaker.source = newnpc.source;

    // second things second
    if (isValid(newnpc.alpha)) npcmaker.alpha = newnpc.alpha;

    if (isValid(newnpc.position)) npcmaker.position = newnpc.position;
    if (isValid(newnpc.walkingSpeed)) npcmaker.walkingSpeed = newnpc.walkingSpeed;
    if (isValid(newnpc.walkingInterval)) npcmaker.walkingInterval = newnpc.walkingInterval;
    if (isValid(newnpc.movementType)) npcmaker.movementType = newnpc.movement;
    if (isValid(newnpc.path)) npcmaker.path = newnpc.path;

    if (isValid(newnpc.dialogue)) npcmaker.dialogue = newnpc.dialogue;
    if (isValid(newnpc.condition)) npcmaker.condition = newnpc.condition;
    if (isValid(newnpc.conditionInverted)) npcmaker.conditionInverted = newnpc.conditionInverted;

    tilemaker_uTexts();
    return true;
}

function npcmaker_createNPC(createType = "map") {
    if (images[npcmaker.source] == undefined) {
        alert("You have to set a valid sprite!");
        return false;
    }
    if (mapmaker.npcMakerID == "") {
        alert("You have to set an ID!");
        return false;
    }

    // here we create the NPC (newnpc = npc to create) 
    // with the names required by the game's internals, such as "ani" for animation
    // last second error catching and the like can be done here
    try {
        // set the required basic stuff that is the same for everyone
        let newnpc = {
            head: 0,
            kofs: [0, 0, 0],
            talk: false,
            pathProgress: 0,
            movementTime: 0
        };

        // adjust and process variables
        newnpc.source = npcmaker.source;

        //if (ttcValid("alpha", true)) newnpc.alpha = npcmaker.alpha;
        newnpc.alpha = npcmaker.alpha;
        if (createType == "map") newnpc.map = mm_map.id;

        newnpc.position = npcmaker.position;
        newnpc.walkingSpeed = npcmaker.walkingSpeed;
        newnpc.walkingInterval = npcmaker.walkingInterval;
        newnpc.movement = npcmaker.movementType;
        newnpc.path = npcmaker.path.length == 0 ? false : npcmaker.path;

        newnpc.dialogue = npcmaker.dialogue;

        if (ttcValid("condition", false)) {
            newnpc.condition = npcmaker.condition;
            if (ttcValid("conditionInverted", false)) newnpc.condinv = npcmaker.conditionInverted;
        }

        // create the actual NPC
        if (createType == "map") {
            // CREATE button
            mm_map.npcs[mapmaker.npcMakerID] = newnpc;
        }
        if (createType == "copy") {
            // Copy button
            let copyText = '"' + mapmaker.npcMakerID + '": ' + JSON.stringify(newnpc);
            navigator.clipboard.writeText(copyText);
            return copyText;
        }
    }
    catch (e) {
        alert("An error occured!\n" + e);
    }
}

scenes["npcmaker"] = new Scene(
    () => {
        // Init
        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "NPC Maker", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            loadScene("mapmaker");
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // top buttons
        createText("top_new_header", 0.2 + 0.15 / 2, 0.033, "New NPC", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_new", 0.2, 0.05, 0.07, 0.05, "button", () => {
            npcmaker_newNPC();
        }, { aText: { textBaseline: "alphabetic", text: "New ID", size: 24, color: "black" } });
        createButton("top_btn_erase", 0.285, 0.05, 0.07, 0.05, "button", () => {
            npcmaker_clearNPC();
        }, { aText: { textBaseline: "alphabetic", text: "Erase", size: 24, color: "black" } });

        createText("top_load_header", 0.4 + 0.15 / 2, 0.033, "Load NPC", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_load", 0.4, 0.05, 0.07, 0.05, "button", () => {
            if (isValid(selectedInfo) && selectedInfoType == "npcs") {
                mapmaker.npcMakerID = selectedInfo;
                let thisNPC;
                if (isValid(mm_map.npcs[mapmaker.npcMakerID])) thisNPC = mm_map.npcs[mapmaker.npcMakerID];
                if (isValid(npcs[mapmaker.npcMakerID])) thisNPC = npcs[mapmaker.npcMakerID];

                if (thisNPC != undefined) {
                    npcmaker_loadNPC(thisNPC);
                }

                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("npcs");
            }
        }, { aText: { textBaseline: "alphabetic", text: "Load", size: 24, color: "black" } });
        createButton("top_btn_paste", 0.485, 0.05, 0.07, 0.05, "button", () => {
            let loaderLoad = prompt("Paste here:");
            if (loaderLoad === "" || loaderLoad === null) return;
            try {
                if (loaderLoad.includes(": {")) {
                    mapmaker.npcMakerID = loaderLoad.split(": {")[0].split(`"`)[1].substr(0, 3);
                    loaderLoad = "{" + loaderLoad.split(": {")[1];
                }
                loaderLoad = JSON.parse(loaderLoad);
                npcmaker_loadNPC(loaderLoad);
            }
            catch (e) {
                alert("An error occured!\n" + e);
            }
        }, { aText: { textBaseline: "alphabetic", text: "Paste", size: 24, color: "black" } });
        // 0.4, 0.01, 0.15, 0.09

        createText("top_save_header", 0.6 + 0.15 / 2, 0.033, "Save NPC", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_save", 0.6, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = npcmaker_createNPC("map");
            if (result !== false) alert("NPC added/updated to the map's own NPCs!");
        }, { aText: { textBaseline: "alphabetic", text: "This Map", size: 24, color: "black" } });
        createButton("top_btn_copy", 0.685, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = npcmaker_createNPC("copy");
            if (result === false || result === true) alert("Something went wrong");
            else alert("Copied to clipboard: " + result);
        }, { aText: { textBaseline: "alphabetic", text: "Copy", size: 24, color: "black" } });

        createText("loadedTileID", 0.32, 0.18, "", { size: 32, color: "black", align: "left" });



        // CONTENTS
        // source
        createText("section_source", 0.05, 0.2, "Source", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_source_line", 0.06, 0.22, 0.2, 0.004, colors.buttonbottom);

        // source
        createButton("source_source", 0.05, 0.25, 0.14, 0.08, "button", (c) => {
            if (images[selectedInfo] != undefined) {
                npcmaker.source = selectedInfo;

                selectedInfo = "";
                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("characterImages");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Source", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_source"].uText = (c) => { c.text = "Source: " + npcmaker.source };
        createImage("source_source_icon", 0.05, 0.25, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });

        // alpha
        createButton("source_alpha", 0.2, 0.25, 0.14, 0.08, "button", (c) => {
            let newAlpha = prompt("Set alpha to what? (0 - 1)");
            if (isNaN(newAlpha) && !newAlpha.includes(".")) return;
            newAlpha = parseFloat(newAlpha);
            if (newAlpha < 0) newAlpha = 0;
            if (newAlpha > 1) newAlpha = 1;

            npcmaker.alpha = newAlpha;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Alpha", color: "black", size: 20, textBaseline: "bottom" } });
        objects["source_alpha"].uText = (c) => { c.text = "Alpha:" + npcmaker.alpha; };
        createImage("source_alpha_icon", 0.2, 0.25, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });



        // movement
        createText("section_movement", 0.05, 0.4, "Movement", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_movement_line", 0.06, 0.42, 0.2, 0.004, colors.buttonbottom);

        // position
        createButton("movement_position", 0.05, 0.45, 0.14, 0.08, "button", (c) => {
            let newText = prompt("New position? (e. g. 4.4)");
            if (isValid(newText) && newText.split(".").length == 2 && newText.split(".")[0] != "" && newText.split(".")[1] != "") {
                newText = [parseInt(newText.split(".")[0]), parseInt(newText.split(".")[1])];
                npcmaker.position = newText;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Position", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_position"].uText = (c) => { c.text = "Position: " + npcmaker.position[0] + ", " + npcmaker.position[1]; };
        createImage("movement_position_icon", 0.05, 0.45, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        // speed
        createButton("movement_speed", 0.2, 0.45, 0.14, 0.08, "button", (c) => {
            let newText = prompt("New speed? (default: 1 | secs it takes to walk from one tile to another)");
            if (isValid(newText)) npcmaker.walkingSpeed = newText;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Position", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_speed"].uText = (c) => { c.text = "Speed: " + npcmaker.walkingSpeed; };
        createImage("movement_speed_icon", 0.2, 0.45, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        // interval
        createButton("movement_interval", 0.35, 0.45, 0.14, 0.08, "button", (c) => {
            let newText = prompt("New interval? (default: 0.5 | secs between walks)");
            if (isValid(newText)) npcmaker.walkingInterval = newText;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Position", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_interval"].uText = (c) => { c.text = "Interval: " + npcmaker.walkingInterval; };
        createImage("movement_interval_icon", 0.35, 0.45, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        // movement type
        createButton("movement_type", 0.5, 0.45, 0.14, 0.08, "button", (c) => {
            npcmaker.movementType = (npcmaker.movementType + 1) % 3;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Position", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_type"].uText = (c) => { c.text = "Movement Type: " + ["No", "Random", "Path"][npcmaker.movementType]; };
        createImage("movement_type_icon", 0.5, 0.45, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        // path
        createButton("movement_path", 0.65, 0.45, 0.14, 0.08, "button", (c) => {
            let newText = prompt("Path? 0 down 1 left 2 right 3 up (e. g. 0.1.2.2.2.3.2.1)");
            if (isValid(newText)) {
                newText = newText.split(".");
                for (let i in newText) {
                    newText[i] = parseInt(newText[i]);
                }
                npcmaker.path = newText;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Path", color: "black", size: 20, textBaseline: "bottom" } });
        objects["movement_path"].uText = (c) => { c.text = "Path: " + npcmaker.path; };
        createImage("movement_path_icon", 0.65, 0.45, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });



        // special
        createText("section_movement", 0.05, 0.6, "Movement", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_movement_line", 0.06, 0.62, 0.2, 0.004, colors.buttonbottom);

        // dialogue
        createButton("special_dialogue", 0.05, 0.65, 0.14, 0.08, "button", (c) => {
            if (selectedInfoType == "dialogues" && isValid(selectedInfo)) {
                if (mm_map.dialogues[selectedInfo] != undefined && isValid(selectedInfo)) {
                    npcmaker.dialogue = selectedInfo;
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
        }, { alpha: 0.5, aText: { text: "Dialogue", color: "black", size: 20, textBaseline: "bottom" } });
        objects["special_dialogue"].uText = (c) => { c.text = "Dialogue: " + npcmaker.dialogue; };
        createImage("special_dialogue_icon", 0.05, 0.65, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });

        // condition
        createButton("special_condition", 0.2, 0.65, 0.14, 0.08, "button", (c) => {
            let cond = prompt("Condition? Write code... (no () =>)");
            if (!isValid(cond)) return;

            let inv = confirm("Inverted?");
            if (!isValid(inv)) inv = false;

            tilemaker.condition = cond;
            tilemaker.conditionInverted = inv;

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Condition", color: "black", size: 20, textBaseline: "bottom" } });
        objects["special_condition"].uText = (c) => { c.text = npcmaker.condition != "" ? "Has Condition" + (npcmaker.conditionInverted === true ? " (Inverted)" : "") : "No Condition"; };
        createImage("special_condition_icon", 0.2, 0.65, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });



        // init - set all texts as far as ye can
        tilemaker_uTexts();
    },
    (tick) => {
        // Loop

        // hotkeys
        if (mapmaker.hotkeyBlocker > 0) mapmaker.hotkeyBlocker -= 1 / delta;
        
        if (mapmaker.hotkeyBlocker <= 0) {
            if (currentKeys["escape"]) loadScene("mapmaker");
            if (currentKeys["t"]) makerInfoToggle();

            mapmaker.hotkeyBlocker = 0.3;
        }
    }
);