var dialoguemaker = {
    // dialogue settings
    type: "normal",

    // non-definable
    lineRectangles: 0,
    selectedLine: 0,
    forceAdjustLines: false,
    selectedInfo: "",

    // lines
    lines: []
};

var dialoguemaker_default = Object.assign({}, dialoguemaker);
for (let i in dialoguemaker) {
    if (typeof (dialoguemaker[i]) == "object" && dialoguemaker[i].length != undefined) {
        dialoguemaker_default[i] = Object.assign([], dialoguemaker[i]);
    }
}

function dialoguemaker_newDialogue() {
    let newID;

    // create new
    let p = prompt('New ID / name? (e. g. endte)');
    if (isValid(p)) newID = p;
    else return false;

    // no auto ID or verification for 3 length needed
    mapmaker.dialogueMakerID = newID;

    tilemaker_uTexts();
}

function dialoguemaker_clearDialogue() {
    dialoguemaker = Object.assign({}, dialoguemaker_default);
    tilemaker_uTexts();
}

function dialoguemaker_loadDialogue(newdia) {
    // clear the debris of what we had before
    dialoguemaker_clearDialogue();
    console.log(newdia);

    // first things first
    dialoguemaker.type = newdia.type;

    // second things second
    dialoguemaker.lines = JSON.parse(JSON.stringify(newdia.lines));

    tilemaker_uTexts();
    return true;
}

function dialoguemaker_createDialogue(createType = "map") {
    if (mapmaker.dialogueMakerID == "") {
        alert("You have to set an ID!");
        return false;
    }

    // here we create the dialogue (newdia = dialogue to create) 
    // with the names required by the game's internals, such as "ani" for animation
    // last second error catching and the like can be done here
    try {
        // set the required basic stuff that is the same for everyone
        let newdia = {
            
        };

        // adjust and process variables
        newdia.lines = JSON.parse(JSON.stringify(dialoguemaker.lines));

        newdia.type = dialoguemaker.type;

        // create the actual dialogue
        if (createType == "map") {
            // CREATE button
            mm_map.dialogues[mapmaker.dialogueMakerID] = newdia;
        }
        if (createType == "copy") {
            // Copy button
            let copyText = '"' + mapmaker.dialogueMakerID + '": ' + JSON.stringify(newdia);
            navigator.clipboard.writeText(copyText);
            return copyText;
        }
    }
    catch (e) {
        alert("An error occured!\n" + e);
    }
}

function currentLine() {
    if (dialoguemaker.lines.length == 0) {
        return {}; // works well enough
    }

    return dialoguemaker.lines[dialoguemaker.selectedLine];
}

scenes["dialoguemaker"] = new Scene(
    () => {
        // Init
        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Dialogue Maker", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            loadScene("mapmaker");
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // top buttons
        createText("top_new_header", 0.2 + 0.15 / 2, 0.033, "New Dia.", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_new", 0.2, 0.05, 0.07, 0.05, "button", () => {
            dialoguemaker_newDialogue();
        }, { aText: { textBaseline: "alphabetic", text: "New ID", size: 24, color: "black" } });
        createButton("top_btn_erase", 0.285, 0.05, 0.07, 0.05, "button", () => {
            if (confirm("Do you really want to delete this dialogue?!")) dialoguemaker_clearDialogue();
        }, { aText: { textBaseline: "alphabetic", text: "Erase", size: 24, color: "black" } });

        createText("top_load_header", 0.4 + 0.15 / 2, 0.033, "Load Dia.", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_load", 0.4, 0.05, 0.07, 0.05, "button", () => {
            if (isValid(selectedInfo) && selectedInfoType == "dialogues") {
                mapmaker.dialogueMakerID = selectedInfo;
                let thisDia;
                if (isValid(mm_map.dialogues[mapmaker.dialogueMakerID])) thisDia = mm_map.dialogues[mapmaker.dialogueMakerID];
                //if (isValid(dialogues[mapmaker.dialogueMakerID])) thisDia = dialogues[mapmaker.dialogueMakerID];

                if (thisDia != undefined) {
                    dialoguemaker_loadDialogue(thisDia);
                }

                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("dialogues");
            }
        }, { aText: { textBaseline: "alphabetic", text: "Load", size: 24, color: "black" } });
        createButton("top_btn_paste", 0.485, 0.05, 0.07, 0.05, "button", () => {
            let loaderLoad = prompt("Paste here:");
            if (loaderLoad === "" || loaderLoad === null) return;
            try {
                if (loaderLoad.includes(": {")) {
                    mapmaker.dialogueMakerID = loaderLoad.split(": {")[0].split(`"`)[1].substr(0, 3);
                    loaderLoad = "{" + loaderLoad.split(": {")[1];
                }
                loaderLoad = JSON.parse(loaderLoad);
                dialoguemaker_loadDialogue(loaderLoad);
            }
            catch (e) {
                alert("An error occured!\n" + e);
            }
        }, { aText: { textBaseline: "alphabetic", text: "Paste", size: 24, color: "black" } });
        // 0.4, 0.01, 0.15, 0.09

        createText("top_save_header", 0.6 + 0.15 / 2, 0.033, "Save Dia.", { align: "center", color: colors.buttonbottompressed, size: 24 });
        createButton("top_btn_save", 0.6, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = dialoguemaker_createDialogue("map");
            if (result !== false) alert("Dialogue added/updated to the map's own dialogues!");
        }, { aText: { textBaseline: "alphabetic", text: "This Map", size: 24, color: "black" } });
        createButton("top_btn_copy", 0.685, 0.05, 0.07, 0.05, "button", () => {
            // save the created tile
            let result = dialoguemaker_createDialogue("copy");
            if (result === false || result === true) alert("Something went wrong");
            else alert("Copied to clipboard: " + result);
        }, { aText: { textBaseline: "alphabetic", text: "Copy", size: 24, color: "black" } });

        createText("loadedTileID", 0.32, 0.18, "", { size: 32, color: "black", align: "left" });



        // CONTENTS
        // dialogue settings
        createText("section_dialogue", 0.05, 0.2, "Dialogue Settings", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_dialogue_line", 0.06, 0.22, 0.2, 0.004, colors.buttonbottom);

        // type
        createButton("dialogue_type", 0.05, 0.25, 0.14, 0.08, "button", (c) => {
            switch (dialoguemaker.type) {
                case "normal":
                    dialoguemaker.type = "invis";
                    break;
                case "invis":
                    dialoguemaker.type = "narrator";
                    break;
                case "narrator":
                    dialoguemaker.type = "cinematic";
                    break;
                case "cinematic":
                    dialoguemaker.type = "normal";
                    break;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "Type", color: "black", size: 20, textBaseline: "bottom" } });
        objects["dialogue_type"].uText = (c) => { c.text = "Type: " + dialoguemaker.type };
        createImage("dialogue_type_icon", 0.05, 0.25, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        // preview
        createButton("dialogue_preview", 0.8, 0.25, 0.14, 0.08, "button", (c) => {
            if (dialoguemaker.lines.length == 0) return;
            createDialogueObjects();
            startDialogue({
                type: dialoguemaker.type,
                lines:  dialoguemaker.lines
            }, true);
        }, { alpha: 0.5, aText: { text: "Preview", color: "black", size: 20, textBaseline: "bottom" } });



        // line navigator
        createText("section_lines", 0.05, 0.4, "Line Navigator", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_lines_line", 0.06, 0.42, 0.72, 0.004, colors.buttonbottom);
        createSquare("section_lines_line2", 0.06, 0.54 /* arbitrary */, 0.72, 0.004, colors.buttonbottom);

        createButton("lines_previous", 0.05, 0.45, 0.06, 0.08, "button", (c) => {
            if (dialoguemaker.selectedLine > 0) dialoguemaker.selectedLine--;
            tilemaker_uTexts();
        }, { alpha: 0.5, aText: { text: "<-", color: "black", size: 20, textBaseline: "bottom" } });

        createGroup("lineRectangles", []);
        groups["lineRectangles"].children = [];
        dialoguemaker.lineRectangles = 0;
        dialoguemaker.forceAdjustLines = true;

        createButton("lines_next", 0.65, 0.45, 0.06, 0.08, "button", (c) => {
            if (dialoguemaker.selectedLine < dialoguemaker.lineRectangles - 1) dialoguemaker.selectedLine++;
            tilemaker_uTexts();
        }, { alpha: 0.5, aText: { text: "->", color: "black", size: 20, textBaseline: "bottom" } });

        createButton("lines_add", 0.74, 0.45, 0.08, 0.08, "button", (c) => {
            dialoguemaker.lines.splice(dialoguemaker.selectedLine, 0,
                {
                    "text": "",
                    "portrait": "Portraits_NAN",
                    "emotion": "neutral",
                    "name": "",
                    "voice": false
                });
            tilemaker_uTexts();
        }, { alpha: 0.5, aText: { text: "+ NEW", color: "black", size: 20, textBaseline: "bottom" } });

        createButton("lines_del", 0.85, 0.45, 0.08, 0.08, "button", (c) => {
            if (dialoguemaker.selectedLine > 0) dialoguemaker.selectedLine -= 1; // to avoid undefined line crashes
            groups["lineRectangles"].children.pop(); // remove from group
            dialoguemaker.lineRectangles--; // reduce counter
            objects["lineRectangles_" + dialoguemaker.lineRectangles].power = false; // hide last line object
            dialoguemaker.lines.splice(dialoguemaker.selectedLine, 1); // here the actual line gets deleted
            dialoguemaker.forceAdjustLines = true; // force resizing
            tilemaker_uTexts();
        }, { alpha: 0.5, aText: { text: "- DEL", color: "black", size: 20, textBaseline: "bottom" } });



        // appearance
        createText("section_appearance", 0.05, 0.6, "Line Appearance", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_appearance_line", 0.06, 0.62, 0.2, 0.004, colors.buttonbottom);

        // text : the main part of the dialogue, it's what the guy says to you
        createButton("appearance_text", 0.05, 0.65, 0.14, 0.08, "button", (c) => {
            let newText = prompt("New text?");
            if (newText != undefined && newText != "") {
                dialoguemaker.lines[dialoguemaker.selectedLine].text = newText;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_text"].uText = (c) => { c.text = "Text:"; objects["appearance_text_full"].text = currentLine().text; };
        createImage("appearance_text_icon", 0.05, 0.65, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        createText("appearance_text_full", 0.05, 0.777, "", { color: "black", size: 20, textBaseline: "bottom", align: "left" });

        // name : name of the guy who's talking in this line
        createButton("appearance_name", 0.2, 0.65, 0.14, 0.08, "button", (c) => {
            let newText = prompt("New name?");
            if (newText != undefined && newText != "") {
                dialoguemaker.lines[dialoguemaker.selectedLine].name = newText;
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_name"].uText = (c) => { c.text = "Name: " + currentLine().name };
        createImage("appearance_name_icon", 0.2, 0.65, 0, 0, "place", { sizeOffset: [32, 32], offset: [-16, -16] });

        // portrait : what the guy looks like
        createButton("appearance_portrait", 0.35, 0.65, 0.14, 0.08, "button", (c) => {
            if (selectedInfoType == "portraits" && isValid(selectedInfo)) {
                dialoguemaker.lines[dialoguemaker.selectedLine].portrait = selectedInfo;

                // update name too
                if (dialoguemaker.lines[dialoguemaker.selectedLine].name == "" && selectedInfo != "Portraits_NAN") {
                    dialoguemaker.lines[dialoguemaker.selectedLine].name = selectedInfo.split("Portraits_")[1];
                }
                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("portraits");
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_portrait"].uText = (c) => { c.text = "Portrait: " + currentLine().portrait };
        createImage("appearance_portrait_icon", 0.35, 0.65, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });

        // emotion : affects the snip of the portrait
        createButton("appearance_emotion", 0.5, 0.65, 0.14, 0.08, "button", (c) => {
            let newEmo;
            switch (dialoguemaker.lines[dialoguemaker.selectedLine].emotion) {
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
            dialoguemaker.lines[dialoguemaker.selectedLine].emotion = newEmo;
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_emotion"].uText = (c) => { c.text = "Emotion: " + currentLine().emotion };
        createImage("appearance_emotion_icon", 0.5, 0.65, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });

        // voice : optional, beep boop sounds
        createButton("appearance_voice", 0.65, 0.65, 0.14, 0.08, "button", (c) => {
            let voices = [false, "male_young", "male_grown", "female_young", "female_grown"];

            if (dialoguemaker.lines[dialoguemaker.selectedLine].voice == voices[voices.length - 1]) dialoguemaker.lines[dialoguemaker.selectedLine].voice = voices[0];
            else dialoguemaker.lines[dialoguemaker.selectedLine].voice = voices[voices.indexOf(dialoguemaker.lines[dialoguemaker.selectedLine].voice) + 1];

            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["appearance_voice"].uText = (c) => { c.text = "Voice: " + currentLine().voice };
        createImage("appearance_voice_icon", 0.65, 0.65, 0, 0, "redo", { sizeOffset: [32, 32], offset: [-16, -16] });



        // special
        createText("section_special", 0.05, 0.8, "Line Special", { size: 24, color: colors.buttonbottompressed, align: "left" });
        createSquare("section_special_line", 0.06, 0.82, 0.2, 0.004, colors.buttonbottom);

        // script : yuo duo shituo
        createButton("special_script", 0.05, 0.85, 0.14, 0.08, "button", (c) => {
            if ((selectedInfoType == "scripts" || dialoguemaker.selectedInfo != "") && isValid(selectedInfo)) {
                let result;

                // this.selected is for the first selection, selectedInfo for the second
                if (dialoguemaker.selectedInfo == "") dialoguemaker.selectedInfo = selectedInfo;

                switch (dialoguemaker.selectedInfo) {
                    case "Add Quest":
                        if (selectedInfoType == "quests" && isValid(selectedInfo)) {
                            result = "addQuest('" + selectedInfo + "')";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("quests");
                            return;
                        }
                        break;
                    case "Claim Quest":
                        if (selectedInfoType == "quests" && isValid(selectedInfo)) {
                            result = "claimQuest('" + selectedInfo + "')";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("quests");
                            return;
                        }
                        break;
                    case "Talk Quest Progress":
                        let talkID = prompt("talk ID for the progress event?");
                        if (!isValid(talkID)) talkID = curDia;
                        result = "questProgress('talk', '" + talkID + "')";
                        break;
                    case "Give Item":
                        if (selectedInfoType == "items" && isValid(selectedInfo)) {
                            let amount = prompt("How many?");
                            if (!isValid(amount)) amount = 1;
                            result = "addItem('" + selectedInfo + "', " + amount + ")";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("items");
                            return;
                        }
                        break;
                    case "Teleport":
                        let tpTo = prompt("Where? (map.x.y)");
                        if (!isValid(tpTo) || !tpTo.includes(".")) return;

                        tpTo = tpTo.split(".");

                        result = "teleportPlayer('" + tpTo[0] + "', " + tpTo[1] + ", " + tpTo[2] + ")";
                        break;
                    case "Open Shop":
                        if (selectedInfoType == "shops" && isValid(selectedInfo)) {
                            result = "openShop('" + selectedInfo + "')";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("shops");
                            return;
                        }
                        break;
                    case "Add Protagonist":
                        if (selectedInfoType == "protagonists" && isValid(selectedInfo)) {
                            result = "addProtagonist('" + selectedInfo.toLowerCase() + "')";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("protagonists");
                            return;
                        }
                        break;
                    case "Rem Protagonist":
                        if (selectedInfoType == "protagonists" && isValid(selectedInfo)) {
                            result = "removeProtagonist('" + selectedInfo.toLowerCase() + "')";
                        }
                        else {
                            makerInfoShow();
                            renderMakerInfo("protagonists");
                            return;
                        }
                        break;
                    case "Inn":
                        result = "INN()";
                        break;
                }

                dialoguemaker.selectedInfo = "";
                dialoguemaker.lines[dialoguemaker.selectedLine].script = result;
                makerInfoHide();
            }
            else {
                makerInfoShow();
                renderMakerInfo("scripts");
                groups["makerInfo"].add("x", 0.65);
                groups["makerInfo_selbtns"].add("x", 0.65);
            }
            objects[c].uText(objects[c + ":text"]);
        }, { alpha: 0.5, aText: { text: "", color: "black", size: 20, textBaseline: "bottom" } });
        objects["special_script"].uText = (c) => { c.text = "Script: " + currentLine().script };
        createImage("special_script_icon", 0.05, 0.85, 0, 0, "paste", { sizeOffset: [32, 32], offset: [-16, -16] });



        // init - set all texts as far as ye can
        tilemaker_uTexts();
    },
    (tick) => {
        // Loop
        if (dialoguemaker.lines.length > dialoguemaker.lineRectangles || dialoguemaker.forceAdjustLines) {
            dialoguemaker.forceAdjustLines = false;

            // create new
            createSquare("lineRectangles_" + dialoguemaker.lineRectangles, 0.13, 0.46, 0, 0.06, "black");
            groups["lineRectangles"].addChild("lineRectangles_" + dialoguemaker.lineRectangles);
            if (dialoguemaker.lines.length > dialoguemaker.lineRectangles) dialoguemaker.lineRectangles++;

            // adjust 'em all
            for (let r = 0; r < dialoguemaker.lineRectangles; r++) {
                objects["lineRectangles_" + r].w = 0.5 / dialoguemaker.lineRectangles * 0.9;
                objects["lineRectangles_" + r].x = 0.13 + (0.5 / dialoguemaker.lineRectangles) * r;
                objects["lineRectangles_" + r].power = true;
                objects["lineRectangles_" + r].i = r;
            }
        }

        if (dialoguemaker.lineRectangles > 0) {
            groups["lineRectangles"].set("color", "black");
            groups["lineRectangles"].set("color", "darkgreen", (o) => dialoguemaker.lines[o.i] != undefined && dialoguemaker.lines[o.i].text != "");
            if (objects["lineRectangles_" + dialoguemaker.selectedLine] != undefined) objects["lineRectangles_" + dialoguemaker.selectedLine].color = "red";
        }

        renderDialogue();

        // hotkeys
        if (mapmaker.hotkeyBlocker > 0) mapmaker.hotkeyBlocker -= 1 / delta;
        
        if (mapmaker.hotkeyBlocker <= 0) {
            if (currentKeys["escape"]) loadScene("mapmaker");
            if (currentKeys["t"]) makerInfoToggle();

            mapmaker.hotkeyBlocker = 0.3;
        }
    }
);