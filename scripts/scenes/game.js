var zoom = 1;
var kofs = [0, 0, 0];
var walkTime = 0;
var direction = "none";
var inDialogue = false;
var currentDialogue;
var dialogueProgress = 0;
var dialogueEmotion = "neutral";
var overWorldStatsScroll = 0;

// This is ALL protagonists in the game. Not only the ones you have equipped right now.
const characters = ["bleu", "corelle", "gau"];

// Function used to create enemies
function createEnemy(type) {
    if (currentEnemies.length < 9) {
        currentEnemies.push([type, Math.ceil(Math.random() * 2), Math.ceil(Math.random() * 2)]);
    }
}

function clearCurrentEnemies() {
    currentEnemies = [];
}

function checkLevelUps() {
    if (game.characters.bleu.EXP > 24) {
        game.characters.bleu.EXP -= 25;
        game.characters.bleu.level += 1;

        game.characters.bleu.strength = 3 + game.characters.bleu.level;
        game.characters.bleu.maxHP = 18 + (game.characters.bleu.level*2);

        game.characters.bleu.HP = game.characters.bleu.maxHP;
    }
    if (game.characters.corelle.EXP > 24) {
        game.characters.corelle.EXP -= 25;
        game.characters.corelle.level += 1;

        game.characters.corelle.strength = 2 + game.characters.corelle.level;
        game.characters.corelle.maxHP = 14 + (game.characters.corelle.level * 2);

        game.characters.corelle.HP = game.characters.corelle.maxHP;
    }
    if (game.characters.gau.EXP > 24) {
        game.characters.gau.EXP -= 25;
        game.characters.gau.level += 1;

        game.characters.gau.strength = 6 + game.characters.gau.level;
        game.characters.gau.maxHP = 8 + (game.characters.gau.level * 2);

        game.characters.gau.HP = game.characters.gau.maxHP;
    }
}

function getEmotion(emotion) { //How do you spell portrait?
    switch (emotion) {
        case "neutral":
            return [0, 0, 64, 64];
            break;
        case "happy":
            return [0, 64, 64, 64];
            break;
        case "disappointed":
            return [0, 128, 64, 64];
            break;
        case "sad":
            return [0, 192, 64, 64];
            break;
        case "angry":
            return [0, 256, 64, 64];
            break;
        default:
            return [0, 0, 64, 64];
            break;
    }
}

function addItem(name, amount = 1) {
    if (game.inventory[name] == undefined) {
        game.inventory[name] = 0;
    }
    if (game.inventory[name] >= items[name]().max) {
        return false;
    }
    if (game.inventory[name] + amount < items[name]().max) {
        game.inventory[name] += amount;
        return true;
    }
    else {
        game.inventory[name] = items[name]().max;
        return true;
    }
}

function removeItem(name, amount = 1) {
    game.inventory[name] -= amount;
    if (game.inventory[name] < 1 || game.inventory[name] == undefined) {
        delete game.inventory[name];
    }
}

let autoSaveText = controls.label({
    anchor: [.025, .98], offset: [12, -12],
    fontSize: 16, text: "Game saved!", alpha: 0,
});

scenes.game = () => {
    
    let head = 0;
    let pad = "";

    var scale;

    var enemies = [];
    var activenpcs = [];

    var menuSettings = [];
    var settingsCategory = "none";
    var menuSettingsGameplay = [];
    var menuSettingsGraphics = [];
    var menuSettingsAudio = [];
    var menuItems = [];
    var menuItemsImages = [];
    var menuItemsAmounts = [];
    var menuItemsStoryOnly = false;

    let walkPad = [];
    walkPad.push(controls.image({ // Up
        anchor: [.1, .75], offset: [0, 0], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowup",
        onClick(args) {
            pad = "up";
        }
    }));
    walkPad.push(controls.image({ // Middle
        anchor: [.1, .75], offset: [0, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowmiddle",
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.1, .75], offset: [0, 80], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowdown",
        onClick(args) {
            pad = "down";
        }
    }));
    walkPad.push(controls.image({ // Left
        anchor: [.1, .75], offset: [-40, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowleft",
        onClick(args) {
            pad = "left";
        }
    }));
    walkPad.push(controls.image({ // Right
        anchor: [.1, .75], offset: [40, 40], sizeOffset: [40, 40],
        fontSize: 16, source: "arrowright",
        onClick(args) {
            pad = "right";
        }
    }));




    let nightEffect = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1], snip: [0, 0, 8, 8],
        source: "nighteffect", alpha: 255,
    });

        // Alright, alright, we need comments, so let me comment this
        // This is for the map's display. In the BOTTOM RIGHT. No idea what else to call it.
        let mapDisplay = [];

    // The top bg rect
    mapDisplay.push(controls.rect({
        anchor: [.9925, .68], offset: [-220, 0], sizeOffset: [250, 250],
        fill: "#B58542",
    }));



    let poisonBlack = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0,
        fill: "black",
    }); 

    // Names, stats, etc.
    mapDisplay.push(controls.label({
        anchor: [.99, .68], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer().name,
    }));
    let mapDisplayStats1 = controls.label({
        anchor: [.99, .705], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer().HP + "/" + getPlayer().maxHP + "   EP: " + getPlayer().EP + "/" + getPlayer().maxEP,
    });
    let mapDisplayLevel1 = controls.label({
        anchor: [.99, .73], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + getPlayer().level,
    }); 

    mapDisplay.push(controls.label({
        anchor: [.99, .76], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer(2).name,
    }));
    let mapDisplayStats2 = controls.label({
        anchor: [.99, .785], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer(2).HP + "/" + getPlayer(2).maxHP + "   EP: " + getPlayer(2).EP + "/" + getPlayer(2).maxEP,
    });
    let mapDisplayLevel2 = controls.label({
        anchor: [.99, .81], offset: [-200, 20],
        alpha: 255,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + getPlayer(2).level,
    });

    mapDisplay.push(controls.image({
        anchor: [.99, .82], offset: [-200, 20], sizeOffset: [24, 23],
        source: "arrowup",
        onClick(args) {
            overWorldStatsScroll -= 1;
            if (overWorldStatsScroll < 0) overWorldStatsScroll = 0;
            mapDisplay[1].text = getPlayer(1 + overWorldStatsScroll).name;
            mapDisplay[2].text = getPlayer(2 + overWorldStatsScroll).name;
        },
        alpha: 255,
    }));

    mapDisplay.push(controls.image({
        anchor: [.99, .82], offset: [-174, 20], sizeOffset: [24, 23],
        source: "arrowdown",
        onClick(args) {
            overWorldStatsScroll += 1;
            if (overWorldStatsScroll > game.chars.length - 2) overWorldStatsScroll = 0;
            mapDisplay[1].text = getPlayer(1 + overWorldStatsScroll).name;
            mapDisplay[2].text = getPlayer(2 + overWorldStatsScroll).name;
        },
        alpha: 255,
    }));


    let dialogueComponents = []
    dialogueComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -200], sizeAnchor: [1, 0], sizeOffset: [0, 200],
        clickthrough: false,
        fill: "#B58542",
        onClick(args) {
            if (this.alpha == 255) {
                dialogueProgress += 1;
                if (dialogueProgress >= currentDialogue.length || currentDialogue[dialogueProgress] == undefined) {
                    inDialogue = false;
                    currentDialogue = false;
                    dialogueEmotion = "neutral";
                    dialogueProgress = 0;
                    canMove = true;
                }
                else if (currentDialogue[dialogueProgress][4] != undefined) {
                    currentDialogue[dialogueProgress][4]();
                }

            }
        },
        alpha: 0, 
    }));
    dialogueComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -200], sizeOffset: [136, 136],
        clickthrough: false,
        fill: "#D49F52",
        alpha: 0,
    }));
    dialogueComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -54], sizeOffset: [128, 32],
        clickthrough: false,
        fill: "#D49F52",
        alpha: 0,
    }));
    dialogueComponents.push(controls.label({
        anchor: [0.01, 1.01], offset: [64, -34],
        align: "center", fontSize: 20, fill: "black",
        text: "Bleu",
        alpha: 0,
    }));
    dialogueComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [164, -200], sizeOffset: [0, 178], sizeAnchor: [0.8, 0],
        clickthrough: false,
        fill: "#D49F52",
        alpha: 0,
    }));
    dialogueComponents.push(controls.image({
        anchor: [0.01, 1.01], offset: [0, -192], sizeOffset: [128, 128], snip: [0, 0, 64, 64],
        source: "Portraits_Bleu",
        alpha: 0,
    }));
    dialogueComponents.push(controls.label({ // 6
        anchor: [0, 1], offset: [196, -168],
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0,
    }));



    let actionButton = controls.image({
        anchor: [0.75, 0.8], sizeOffset: [96, 96],
        alpha: 255,
        source: "actionbutton",
        onClick(args) {
            let map = maps[game.map];
            if (head == 0) { // Down
                if (getTile(map, game.position[0], game.position[1] + 1) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) {
                        getTile(map, game.position[0], game.position[1] + 1).action();
                    }
                }
                if (getTile(map, game.position[0], game.position[1] + 1, 2) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] + 1, 2).action != undefined) {
                        getTile(map, game.position[0], game.position[1] + 1, 2).action();
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] + 1) {
                        inDialogue = true;
                        currentDialogue = activenpcs[i].dialogues[1];
                        dialogueProgress = 0;
                        dialogueEmotion = currentDialogue[dialogueProgress][1];
                        canMove = false;
                    }
                }
            }
            else if (head == 1) { // Left
                if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) {
                    if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) {
                        getTile(map, game.position[0] - 1, game.position[1]).action();
                    }
                }
                if (getTile(map, game.position[0] - 1, game.position[1], 2) != undefined) {
                    if (getTile(map, game.position[0] - 1, game.position[1], 2).action != undefined) {
                        getTile(map, game.position[0] - 1, game.position[1], 2).action();
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == game.position[0] - 1 && activenpcs[i].position[1] == game.position[1]) {
                        inDialogue = true;
                        currentDialogue = activenpcs[i].dialogues[1];
                        dialogueProgress = 0;
                        dialogueEmotion = currentDialogue[dialogueProgress][1];
                        canMove = false;
                    }
                }
            }
            else if (head == 2) { // Right
                if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) {
                    if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) {
                        getTile(map, game.position[0] + 1, game.position[1]).action();
                    }
                }
                if (getTile(map, game.position[0] + 1, game.position[1], 2) != undefined) {
                    if (getTile(map, game.position[0] + 1, game.position[1], 2).action != undefined) {
                        getTile(map, game.position[0] + 1, game.position[1], 2).action();
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == game.position[0] + 1 && activenpcs[i].position[1] == game.position[1]) {
                        inDialogue = true;
                        currentDialogue = activenpcs[i].dialogues[1];
                        dialogueProgress = 0;
                        dialogueEmotion = currentDialogue[dialogueProgress][1];
                        canMove = false;
                    }
                }
            }
            else if (head == 3) { // Up
                if (getTile(map, game.position[0], game.position[1] - 1) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) {
                        getTile(map, game.position[0], game.position[1] - 1).action();
                    }
                }
                if (getTile(map, game.position[0], game.position[1] - 1, 2) != undefined) {
                    if (getTile(map, game.position[0], game.position[1] - 1, 2).action != undefined) {
                        getTile(map, game.position[0], game.position[1] - 1, 2).action();
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] - 1) {
                        inDialogue = true;
                        currentDialogue = activenpcs[i].dialogues[1];
                        dialogueProgress = 0;
                        dialogueEmotion = currentDialogue[dialogueProgress][1];
                        canMove = false;
                    }
                }
            }   
        }
    });

    // Buttons, then images over them
    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.button({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 255,
            text: "",
            onClick(args) {
                if (this.offset[0] == -220 && canMove == true) {
                    enemies.push(mapenemies.itsalivemap({
                        position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                    }));
                    console.log(enemies);
                }
                if (this.offset[0] == -145 && canMove == true) {
                    hideMapDisplay();
                    showMenuItems(menuItemsStoryOnly);
                }
                if (this.offset[0] == -70 && canMove == true) {
                    if (this.alpha == 255) {
                        hideMapDisplay();
                        showMenuSettings();
                    }
                }
            }
        }));
    }

    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.image({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 255,
            source: ["paper", "inventory", "gear"][i],
        }));
    }

    function hideMapDisplay() {
        for (i = 0; i < mapDisplay.length; i++) {
            mapDisplay[i].alpha = 0;
        }
        mapDisplayStats1.alpha = 0;
        mapDisplayStats2.alpha = 0;
        mapDisplayLevel1.alpha = 0;
        mapDisplayLevel2.alpha = 0;
    }

    function showMapDisplay() {
        for (i = 0; i < mapDisplay.length; i++) {
            mapDisplay[i].alpha = 255;
        }
        mapDisplayStats1.alpha = 255;
        mapDisplayStats2.alpha = 255;
        mapDisplayLevel1.alpha = 255;
        mapDisplayLevel2.alpha = 255;
    }

    function hideMenuSettings() {
        canMove = true;
        for (i = 0; i < menuSettings.length; i++) {
            menuSettings[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsGameplay.length; i++) {
            menuSettingsGameplay[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsGraphics.length; i++) {
            menuSettingsGraphics[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsAudio.length; i++) {
            menuSettingsAudio[i].alpha = 0;
        }
    }

    function showMenuSettings() {
        canMove = false;
        menuSettingsAudio[0].text = "Music Volume: " + Math.round(settings.musicVolume * 100) + "%";
        menuSettingsAudio[3].text = "Sound Volume: " + Math.round(settings.soundVolume * 100) + "%";

        for (i = 0; i < menuSettings.length; i++) {
            menuSettings[i].alpha = 255;
        }
        if (settingsCategory == "gameplay") {
            if (settings.autosave == true) {
                menuSettingsGameplay[0].text = "Autosave: ON";
            }
            else {
                menuSettingsGameplay[0].text = "Autosave: OFF";
            }
            for (i = 0; i < menuSettingsGameplay.length; i++) {
                menuSettingsGameplay[i].alpha = 255;
            }
        }
        else {
            for (i = 0; i < menuSettingsGameplay.length; i++) {
                menuSettingsGameplay[i].alpha = 0;
            }
        }
        if (settingsCategory == "graphics") {
            if (settings.grid == true) {
                menuSettingsGraphics[0].text = "Grid: ON";
            }
            else {
                menuSettingsGraphics[0].text = "Grid: OFF";
            }
            for (i = 0; i < menuSettingsGraphics.length; i++) {
                menuSettingsGraphics[i].alpha = 255;
            }
        }
        else {
            for (i = 0; i < menuSettingsGraphics.length; i++) {
                menuSettingsGraphics[i].alpha = 0;
            }
        }
        if (settingsCategory == "audio") {
            for (i = 0; i < menuSettingsAudio.length; i++) {
                menuSettingsAudio[i].alpha = 255;
            }
        }
        else {
            for (i = 0; i < menuSettingsAudio.length; i++) {
                menuSettingsAudio[i].alpha = 0;
            }
        }
    }

    function hideMenuItems() {
        canMove = true;
        for (i = 0; i < menuItems.length; i++) {
            menuItems[i].alpha = 0;
        }
        for (i = 0; i < menuItemsImages.length; i++) {
            menuItemsImages[i].alpha = 0;
        }
        for (i = 0; i < menuItemsAmounts.length; i++) {
            menuItemsAmounts[i].alpha = 0;
        }
    }

    function showMenuItems(storyonly = false) {
        canMove = false;
        let j = 0;

        if (storyonly == false) menuItems[2].text = "Items Case";
        if (storyonly == true) menuItems[2].text = "Story Items";

        for (i = 0; i < menuItems.length; i++) {
            menuItems[i].alpha = 255;
        }
        for (i = 0; i < menuItemsImages.length; i++) {
            if (menuItemsImages[i + j] != undefined) {
                if (Object.keys(game.inventory)[i] != undefined) {
                    if (storyonly == false && items[Object.keys(game.inventory)[i]]().story == false) {
                        menuItemsImages[i + j].source = "items/" + items[Object.keys(game.inventory)[i]]().source;
                        menuItemsImages[i + j].item = Object.keys(game.inventory)[i];
                        menuItemsImages[i + j].alpha = 255;
                    }
                    else {
                        if (storyonly == true && items[Object.keys(game.inventory)[i]]().story == true) {
                            menuItemsImages[i + j].source = "items/" + items[Object.keys(game.inventory)[i]]().source;
                            menuItemsImages[i + j].item = undefined; // can't use it
                            menuItemsImages[i + j].alpha = 255;
                        }
                        else {
                            menuItemsImages[i + j].item = undefined;
                            menuItemsImages[i + j].alpha = 0;
                            j -= 1;
                        }
                    }
                }
                else {
                    menuItemsImages[i + j].item = undefined;
                    menuItemsImages[i + j].alpha = 0;
                    j -= 1;
                }
            }
        }
        j = 0;
        for (i = 0; i < menuItemsAmounts.length; i++) {
            if (menuItemsAmounts[i + j] != undefined) {
                if (Object.keys(game.inventory)[i] != undefined) {
                    if (storyonly == false && items[Object.keys(game.inventory)[i]]().story == false) {
                        menuItemsAmounts[i + j].text = "x" + game.inventory[Object.keys(game.inventory)[i]];
                        menuItemsAmounts[i + j].alpha = 255;
                    }
                    else { 
                        if (storyonly == true && items[Object.keys(game.inventory)[i]]().story == true) {
                            menuItemsAmounts[i + j].text = "x" + game.inventory[Object.keys(game.inventory)[i]];
                            menuItemsAmounts[i + j].alpha = 255;
                        }
                        else {
                            menuItemsAmounts[i + j].text = "";
                            menuItemsAmounts[i + j].alpha = 0;
                            j -= 1;
                        }
                    }
                }
                else {
                    menuItemsAmounts[i + j].text = "";
                    menuItemsAmounts[i + j].alpha = 0;
                    j -= 1;
                }
            }
        }
    }

    // BOTTOM RIGHT MENU STUFF

    // Settings

    let settingsSaveText = controls.label({
        anchor: [.04, .98], offset: [12, -12],
        fontSize: 16, text: "Settings saved!", alpha: 0,
    });

    menuSettings.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.9, 0.9],
        fill: "#B58543", alpha: 0,
    }));

    menuSettings.push(controls.rect({
        anchor: [0.075, 0.075], sizeAnchor: [0.85, 0.85],
        fill: "#D49F53", alpha: 0,
    }));

    menuSettings.push(controls.rect({
        anchor: [0.375, 0.05], sizeAnchor: [0.02, 0.9],
        fill: "#B58543", alpha: 0,
    }));

    menuSettings.push(controls.label({
        anchor: [0.225, 0.1],
        align: "center", fontSize: 48, fill: "black",
        text: "Settings", alpha: 0,
    }));

    menuSettings.push(controls.button({
        anchor: [0.1, 0.25], sizeAnchor: [0.25, 0.1],
        text: "Gameplay", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                settingsCategory = "gameplay";
                showMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.375], sizeAnchor: [0.25, 0.1],
        text: "Graphics", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                settingsCategory = "graphics";
                showMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.5], sizeAnchor: [0.25, 0.1],
        text: "Controls", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                settingsCategory = "controls";
                showMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.625], sizeAnchor: [0.25, 0.1],
        text: "Audio", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                settingsCategory = "audio";
                showMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.175, 0.85], sizeAnchor: [0.1, 0.075],
        text: "Back", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                showMapDisplay();
                hideMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.675, 0.85], sizeAnchor: [0.1, 0.075],
        text: "Save Changes", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                saveSettings();
                addAnimator(function (t) {
                    settingsSaveText.alpha = t / 10;
                    if (t > 2500) {
                        settingsSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
            }
        }
    }));

    // Gameplay

    menuSettingsGameplay.push(controls.button({
        anchor: [0.5, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Autosave: ON", alpha: 0,
        onClick(args) {
            if (settings.autosave == true) {
                settings.autosave = false;
            }
            else {
                settings.autosave = true;
            }
            showMenuSettings();
        }
    }));

    // Graphics

    menuSettingsGraphics.push(controls.button({
        anchor: [0.5, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Grid: ON", alpha: 0,
        onClick(args) {
            if (settings.grid == true) {
                settings.grid = false;
            }
            else {
                settings.grid = true;
            }
            showMenuSettings();
        }
    }));

    // Audio

    menuSettingsAudio.push(controls.button({
        anchor: [0.5, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Music Volume: 50%", alpha: 0,
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.45, 0.25], sizeAnchor: [0.04, 0.1],
        text: "-", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                if (settings.musicVolume > 0.01) {
                    settings.musicVolume = settings.musicVolume - 0.05;
                    if (settings.musicVolume < 0) settings.musicVolume = 0;
                    musicPlayer.volume = settings.musicVolume;
                    showMenuSettings(); //Update
                }
            }
        }
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.71, 0.25], sizeAnchor: [0.04, 0.1],
        text: "+", alpha: 0,
        onClick(args) {
            if (settings.musicVolume < 0.99) {
                settings.musicVolume = settings.musicVolume + 0.05;
                if (settings.musicVolume > 1) settings.musicVolume = 1;
                musicPlayer.volume = settings.musicVolume;
                showMenuSettings(); //Update
            }
        }
    }));

    menuSettingsAudio.push(controls.button({
        anchor: [0.5, 0.375], sizeAnchor: [0.2, 0.1],
        text: "Sound Volume: 50%", alpha: 0,
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.45, 0.375], sizeAnchor: [0.04, 0.1],
        text: "-", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                if (settings.soundVolume > 0.01) {
                    settings.soundVolume = settings.soundVolume - 0.05;
                    if (settings.soundVolume < 0) settings.soundVolume = 0;
                    soundPlayer.volume = settings.soundVolume;
                    showMenuSettings(); //Update
                }
            }
        }
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.71, 0.375], sizeAnchor: [0.04, 0.1],
        text: "+", alpha: 0,
        onClick(args) {
            if (settings.soundVolume < 0.99) {
                settings.soundVolume = settings.soundVolume + 0.05;
                if (settings.soundVolume > 1) settings.soundVolume = 1;
                soundPlayer.volume = settings.soundVolume;
                showMenuSettings(); //Update
            }
        }
    }));



    // Items

    menuItems.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.9, 0.9],
        fill: "#B58543", alpha: 0,
    }));

    menuItems.push(controls.rect({
        anchor: [0.075, 0.075], sizeAnchor: [0.85, 0.85],
        fill: "#D49F53", alpha: 0,
    }));

    menuItems.push(controls.label({
        anchor: [0.5, 0.1],
        align: "center", fontSize: 48, fill: "black",
        text: "Items Case", alpha: 0,
    }));

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 8; i++) {
            menuItems.push(controls.button({
                anchor: [0.1 + (i * 0.1), 0.2 + (j * 0.2)], sizeAnchor: [0.075, 0.15],
                text: "", alpha: 0, nr: i + (j*8),
                onClick(args) {
                    if (this.alpha == 255) {
                        let imageNumber = this.nr;
                        let item = menuItemsImages[imageNumber].item;
                        if (items[item] != undefined) {
                            if (items[item]().story != true) {
                                if (game.inventory[item] > 0) {
                                    items[item]({ player: game.characters.bleu }).effect();
                                    removeItem(item, 1);
                                    showMenuItems(menuItemsStoryOnly);
                                }
                            }
                        }
                    }
                }
            }));
            
            menuItemsImages.push(controls.image({
                anchor: [0.1 + (i * 0.1), 0.2 + (j * 0.2)], sizeAnchor: [0.075, 0.15],
                source: "gear", alpha: 0, item: "",
            }));

            menuItemsAmounts.push(controls.label({
                anchor: [0.1375 + (i * 0.1), 0.375 + (j * 0.2)],
                align: "center", fontSize: 16, fill: "black",
                text: "x0", alpha: 0,
            }));
        }
    }

    menuItems.push(controls.button({
        anchor: [0.175, 0.85], sizeAnchor: [0.1, 0.075],
        text: "Back", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                showMapDisplay();
                hideMenuItems();
            }
        }
    }));
    menuItems.push(controls.button({
        anchor: [0.675, 0.85], sizeAnchor: [0.1, 0.075],
        text: "Sort by", alpha: 0,
        onClick(args) {
            if (this.alpha == 255) {
                if (menuItemsStoryOnly == false) {
                    menuItemsStoryOnly = true;
                }
                else {
                    menuItemsStoryOnly = false;
                }
                showMenuItems(menuItemsStoryOnly);
            }
        }
    }));

    // Function used to grab tiles
    function getTile(map, x, y, l = 1) {
        if (y < 0) return undefined;
        if (l == 1) {
            if (map.map[y] != undefined) {
                let thetile = map.map[y][x * 4] + map.map[y][(x * 4) + 1] + map.map[y][(x * 4) + 2];
                if (map.tiles[thetile] == undefined) return commontiles[thetile];
                return map.tiles[thetile];
            }
        }
        if (l == 2) {
            if (map.mapbg2[y] != undefined) {
                let thetile = map.mapbg2[y][x * 4] + map.mapbg2[y][(x * 4) + 1] + map.mapbg2[y][(x * 4) + 2];
                if (map.tiles[thetile] == undefined) return commontiles[thetile];
                return map.tiles[thetile];
            }
        }
        if (l == 3) {
            if (map.mapfg[y] != undefined) {
                let thetile = map.mapfg[y][x * 4] + map.mapfg[y][(x * 4) + 1] + map.mapfg[y][(x * 4) + 2];
                if (map.tiles[thetile] == undefined) return commontiles[thetile];
                return map.tiles[thetile];
            }
        }
    }

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
    function isWalkable(map, x, y, l=1) {
        if (map.map[y] && getTile(map, x, y, l)) { //Check if tile exists
            for (i = 0; i < activenpcs.length; i++) {
                if (activenpcs[i].position[0] == x && activenpcs[i].position[1] == y) return false;
            }
            if (getTile(map, x, y, l).occupied != undefined) { //Check if occupied exists
                if (typeof (getTile(map, x, y, l).occupied) == "object") { // Config exists?
                    if (direction == "up" && getTile(map, x, y, l).occupied.includes("up")) {
                        return true;
                    }
                    else if (direction == "left" && getTile(map, x, y, l).occupied.includes("left")) {
                        return true;
                    }
                    else if (direction == "down" && getTile(map, x, y, l).occupied.includes("down")) {
                        return true;
                    }
                    else if (direction == "right" && getTile(map, x, y, l).occupied.includes("right")) {
                        return true;
                    }
                    else { // Config denies passing
                        return false;
                    }
                }
                return !getTile(map, x, y, l).occupied // No config, is it occupied?
            }
            // Unoccupied, you can pass!
            return true;
        } else {
            if (l == 1) return false;
            return true;
        }
    }

    function isTeleport(map, x, y) {
        if (map.map[y] && map.map[y][(x * 3) + 2]) { //Check if tile exists
            if (getTile(map, x, y).teleport != undefined) { //Check if occupied exists
                //It exists! A miracle
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    function tryTeleport(map, x, y) {
        if (isTeleport(map, x, y)) {
            let themap = getTile(map, x, y);
            let previousmap = game.map;
            // Set map and pos
            game.map = themap.teleport[0];
            loadNPCs();
            loadAreaMusic(previousmap);
            game.position[0] = themap.teleport[1];
            game.position[1] = themap.teleport[2];
            playSound("teleport");
        }
    }

    function check_EnemyCollision(i) {
        if (game.position[0] == enemies[i].position[0] &&
            game.position[1] == enemies[i].position[1] &&
            enemies[i].map == game.map && canMove == true) {
            // Fight !!!
            canMove = false;
            clearCurrentEnemies();

            // It automatically grabs the enemies that can appear in the fight
            // based on what is defined in the enemies dict of the map enemy
            // change in map_enemies.js
            while (currentEnemies.length < 1) {
                for (k = 0; k < 8; k++) {
                    for (j in enemies[i].enemies) {
                        if (enemies[i].enemies[j] > (Math.random() * 100)) {
                            createEnemy(j);
                        }
                    }
                }
            }

            image_animation(images.tokenattack, 4, 5, 100);

            let previouszoom = zoom;
            setTimeout(() => { zoom = 1.5; }, 250);
            setTimeout(() => { zoom = 2; }, 500);
            setTimeout(() => { zoom = 2.5; }, 750);
            setTimeout(() => { zoom = 3; }, 1000);
            setTimeout(() => { zoom = 4; }, 1250);
            setTimeout(() => { setScene(scenes.fight()); }, 2000);
            setTimeout(() => { zoom = previouszoom; }, 2200);
        }
    }

    function check_ItemCollision(i) {
        let map = maps[game.map];
        if (game.position[0] == map.items[i][0] &&
            game.position[1] == map.items[i][1]) {
            // Collision!

            map.items[i][4] = !addItem(map.items[i][2], map.items[i][3]);
        }
    }

    function ActionsOnMove() {
        let map = maps[game.map];
        // Everything performed when the player moves successfully

        // Calculate how many enemies can still be spawned.
        // The limit is now 8/map. This calculates how many are on the current map
        let maxEnemies = map.maxEnemies;
        let enemiesOnThisMap = 0;
        for (i in enemies) {
            if (enemies[i].map == game.map) {
                enemiesOnThisMap += 1;
            }
        }

        // Poison
        for (i = 0; i < game.chars.length; i++) {
            if (getPlayer(i + 1).effect[0] == "poison") {
                getPlayer(i + 1).HP -= 1;
                poisonBlack.alpha = 255;
                poisonBlack.fill = "black";
                addAnimator(function (t){
                    poisonBlack.fill = "rgb(" + (0 + (t/3)) + "," + (0 + (t/3)) + "," + (0 + (t/3)) + ")";
                    if (t > 200) {
                        poisonBlack.alpha = 0;
                        return true;
                    }
                })
            }
        }

        // Spawn enemies (sometimes)
        if (enemiesOnThisMap < maxEnemies) {
            for (possibleSpawns in map.spawns) {
                if (map.spawns[possibleSpawns] > Math.random() * 100) { // For the stupid: Somewhat unlikely
                    if (mapenemies[possibleSpawns] != undefined) {
                        if (mapenemies[possibleSpawns]().time == "day" && !isDay()) return false;
                        if (mapenemies[possibleSpawns]().time == "dawn" && !isDawn()) return false;
                        if (mapenemies[possibleSpawns]().time == "noon" && !isNoon()) return false;
                        if (mapenemies[possibleSpawns]().time == "dusk" && !isDusk()) return false;
                        if (mapenemies[possibleSpawns]().time == "night" && !isNight()) return false;
                    }
                        enemies.push(mapenemies[possibleSpawns]({
                            position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                        }));
                    }
            }
        }

        for (i = 0; i < enemies.length; i++) {
            check_EnemyCollision(i);
        }

        if (map.items != undefined) {
            for (i = 0; i < map.items.length; i++) {
                check_ItemCollision(i);
            }
        }

        if (getTile(map, game.position[0], game.position[1]).dialogue != undefined) {
            inDialogue = true;
            currentDialogue = map.dialogues[getTile(map, game.position[0], game.position[1]).dialogue];
            dialogueProgress = 0;
            dialogueEmotion = currentDialogue[dialogueProgress][1];
            canMove = false;
        }
    }

    function loadNPCs() {
        activenpcs = [];
        for (i in Object.keys(npcs)) {
            j = Object.keys(npcs)[i];
            npc = npcs[j]();
            if (npc.alpha > 0 && npc.map == game.map) {
                activenpcs.push(npcs[j]());
            }
        }
    }

    function loadAreaMusic(prev = "none") {
        let map = maps[game.map];
        if (maps[prev] != undefined) {
            if (maps[prev].music != map.music) {
                stopMusic();
                if (map.music == undefined) return false;
                playMusic(map.music);
            }
        }
        else {
            stopMusic();
            if (map.music == undefined) return false;
            playMusic(map.music);
        }
    }

    loadNPCs();
    loadAreaMusic();

    return {
        preRender(ctx, delta) {
            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;
            let map = maps[game.map];

            // Auto Save & Auto Save Text
            if (autoSaveTime > 14999) {
                // Animation
                addAnimator(function (t) {
                    autoSaveText.alpha = t / 10;
                    if (t > 2500) {
                        autoSaveTime = 0;
                        autoSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
                // Saving
                saveGame(true);
                autoSaveTime = -3; // To prevent saving multiple times!
            }

            // Check if it's time for enemies to mové
            if (canMove == true) {
                for (i = 0; i < activenpcs.length; i++) {
                    activenpcs[i].movementTime += delta;
                    if (activenpcs[i].movement == 1 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingSpeed * 1000) {
                        activenpcs[i].movementTime = 0;
                        // Random moving
                        if (Math.random() > 0.40) { // Down
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] + 1] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] + 1) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] + 1).occupied != true) {
                                            activenpcs[i].position[1] += 1;
                                            activenpcs[i].head = 0;
                                            activenpcs[i].kofs = [0, 1, 1];
                                        }
                                    }
                                }
                            }
                        }
                        else if (Math.random() > 0.40) { // Left
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0]] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] - 1, activenpcs[i].position[1]) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] - 1, activenpcs[i].position[1]).occupied != true) {
                                            activenpcs[i].position[0] -= 1;
                                            activenpcs[i].head = 1;
                                            activenpcs[i].kofs = [-1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }


                        else if (Math.random() > 0.40) { // Right
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0]] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + 1, activenpcs[i].position[1]) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] + 1, activenpcs[i].position[1]).occupied != true) {
                                            activenpcs[i].position[0] += 1;
                                            activenpcs[i].head = 2;
                                            activenpcs[i].kofs = [1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Up
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] - 1] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] - 1) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] - 1).occupied != true) {
                                            activenpcs[i].position[1] -= 1;
                                            activenpcs[i].head = 3;
                                            activenpcs[i].kofs = [0, -1, 1];
                                        }
                                    }
                                }
                            }
                        }

                    }

                    if (activenpcs[i].movement == 2 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingSpeed * 1000) {
                        activenpcs[i].movementTime = 0;
                        if (activenpcs[i].pathProgress > activenpcs[i].path.length) {
                            activenpcs[i].pathProgress = 0;
                        }
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 0) { // Down
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] + 1] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] + 1) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] + 1).occupied != true) {
                                            activenpcs[i].position[1] += 1;
                                            activenpcs[i].head = 0;
                                            activenpcs[i].kofs = [0, 1, 1];
                                        }
                                    }
                                }
                            }
                        }
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 1) { // Left
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0]] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] - 1, activenpcs[i].position[1]) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] - 1, activenpcs[i].position[1]).occupied != true) {
                                            activenpcs[i].position[0] -= 1;
                                            activenpcs[i].head = 1;
                                            activenpcs[i].kofs = [-1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 2) { // Right
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0]] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + 1, activenpcs[i].position[1]) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] + 1, activenpcs[i].position[1]).occupied != true) {
                                            activenpcs[i].position[0] += 1;
                                            activenpcs[i].head = 2;
                                            activenpcs[i].kofs = [1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 3) { // Up
                            if (map.map[activenpcs[i].position[1]] != undefined) {
                                if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] - 1] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] - 1) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0], activenpcs[i].position[1] - 1).occupied != true) {
                                            activenpcs[i].position[1] -= 1;
                                            activenpcs[i].head = 3;
                                            activenpcs[i].kofs = [0, -1, 1];
                                        }
                                    }
                                }
                            }
                        }

                        activenpcs[i].pathProgress += 1;
                    }
                }
                for (i = 0; i < enemies.length; i++) { 
                    enemies[i].movementTime += delta;
                    if (enemies[i].movementTime > enemies[i].walkingSpeed * 1000) {
                        enemies[i].movementTime = 0;
                        // Random moving
                        if (Math.random() > 0.40) { // Down
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0] + 1] != undefined) {
                                    if (getTile(map, enemies[i].position[0], enemies[i].position[1] + 1) != undefined) {
                                        if (getTile(map, enemies[i].position[0], enemies[i].position[1] + 1).occupied != true) {
                                            enemies[i].position[1] += 1;
                                            enemies[i].head = 0;
                                            enemies[i].kofs = [0, 1, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Left
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] - 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] -= 1;
                                            enemies[i].head = 1;
                                            enemies[i].kofs = [-1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Right
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0]] != undefined) {
                                    if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]) != undefined) {
                                        if (getTile(map, enemies[i].position[0] + 1, enemies[i].position[1]).occupied != true) {
                                            enemies[i].position[0] += 1;
                                            enemies[i].head = 2;
                                            enemies[i].kofs = [1, 0, 1];
                                        }
                                    }
                                }
                            }
                        }

                        else if (Math.random() > 0.40) { // Up
                            if (map.map[enemies[i].position[1]] != undefined) {
                                if (map.map[enemies[i].position[1]][enemies[i].position[0] - 1] != undefined) {
                                    if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1) != undefined) {
                                        if (getTile(map, enemies[i].position[0], enemies[i].position[1] - 1).occupied != true) {
                                            enemies[i].position[1] -= 1;
                                            enemies[i].head = 3;
                                            enemies[i].kofs = [0, -1, 1];
                                        }
                                    }
                                }
                            }
                        }

                        // Respawn if on ocean or occupied
                        if (map.map[enemies[i].position[1]] != undefined) {
                            if (getTile(map, enemies[i].position[0], enemies[i].position[1]) == undefined) {
                                enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                            }
                            else {
                                if (getTile(map, enemies[i].position[0], enemies[i].position[1]).occupied == true) {
                                    enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                                }
                            }
                        }
                        else {
                            enemies[i].position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)];
                        }

                        // Don't put this in a for loop. lol
                        check_EnemyCollision(i);
                    }
                }
            }

            if (!kofs[2] && canMove == true) {
                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up")) {
                    head = 3;
                    direction = "up";

                    actionButton.source = "actionbutton"
                    if (getTile(map, game.position[0], game.position[1] - 1) != undefined) if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) actionButton.source = "actionbutton_active"
                    else if (getTile(map, game.position[0], game.position[1] - 1, 2) != undefined) if (getTile(map, game.position[0], game.position[1] - 1, 2).action != undefined) actionButton.source = "actionbutton_active"

                    for (i in activenpcs) {
                        activenpcs[i].talk = false;
                        if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] - 1) {
                            actionButton.source = "actionbutton_active";
                            activenpcs[i].talk = true;
                        }
                    }


                    if (isWalkable(map, game.position[0], game.position[1] - 1)
                        && isWalkable(map, game.position[0], game.position[1] - 1, 2)) { //Direction-change-against-wall
                        kofs = [0, -1, 1];
                        game.position[1]--;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);

                        actionButton.source = "actionbutton"
                        if (getTile(map, game.position[0], game.position[1] - 1) != undefined) if (getTile(map, game.position[0], game.position[1] - 1).action != undefined) actionButton.source = "actionbutton_active"
                        else if (getTile(map, game.position[0], game.position[1] - 1, 2) != undefined) if (getTile(map, game.position[0], game.position[1] - 1, 2).action != undefined) actionButton.source = "actionbutton_active"

                        for (i in activenpcs) {
                            if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] - 1) actionButton.source = "actionbutton_active";
                        }
                    }
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down")) {
                    head = 0;
                    direction = "down";

                    actionButton.source = "actionbutton"
                    if (getTile(map, game.position[0], game.position[1] + 1) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) actionButton.source = "actionbutton_active"
                    else if (getTile(map, game.position[0], game.position[1] + 1, 2) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined, 2) actionButton.source = "actionbutton_active"

                    for (i in activenpcs) {
                        activenpcs[i].talk = false;
                        if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] + 1) {
                            actionButton.source = "actionbutton_active";
                            activenpcs[i].talk = true;
                        }
                    }

                    if (isWalkable(map, game.position[0], game.position[1] + 1)
                        && isWalkable(map, game.position[0], game.position[1] + 1, 2)) { //Direction-change-against-wall
                        kofs = [0, 1, 1];
                        game.position[1]++;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);
                        actionButton.source = "actionbutton"
                        if (getTile(map, game.position[0], game.position[1] + 1) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined) actionButton.source = "actionbutton_active"
                        else if (getTile(map, game.position[0], game.position[1] + 1, 2) != undefined) if (getTile(map, game.position[0], game.position[1] + 1).action != undefined, 2) actionButton.source = "actionbutton_active"

                        for (i in activenpcs) {
                            if (activenpcs[i].position[0] == game.position[0] && activenpcs[i].position[1] == game.position[1] + 1) actionButton.source = "actionbutton_active";
                        }
                    }
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left")) {
                    head = 1;
                    direction = "left";

                    actionButton.source = "actionbutton"
                    if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                    else if (getTile(map, game.position[0] - 1, game.position[1], 2) != undefined) if (getTile(map, game.position[0] - 1, game.position[1], 2).action != undefined) actionButton.source = "actionbutton_active"

                    for (i in activenpcs) {
                        activenpcs[i].talk = false;
                        if (activenpcs[i].position[0] == game.position[0] - 1 && activenpcs[i].position[1] == game.position[1]) {
                            actionButton.source = "actionbutton_active";
                            activenpcs[i].talk = true;
                        }
                    }

                    if (isWalkable(map, game.position[0] - 1, game.position[1])
                        && isWalkable(map, game.position[0] - 1, game.position[1], 2)) { //Direction-change-against-wall
                        kofs = [-1, 0, 1];
                        game.position[0]--;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);

                        actionButton.source = "actionbutton"
                        if (getTile(map, game.position[0] - 1, game.position[1]) != undefined) if (getTile(map, game.position[0] - 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                        else if (getTile(map, game.position[0] - 1, game.position[1], 2) != undefined) if (getTile(map, game.position[0] - 1, game.position[1], 2).action != undefined) actionButton.source = "actionbutton_active"

                        for (i in activenpcs) {
                            if (activenpcs[i].position[0] == game.position[0] - 1 && activenpcs[i].position[1] == game.position[1]) actionButton.source = "actionbutton_active";
                        }
                    }
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right")) {
                    head = 2;
                    direction = "right";

                    actionButton.source = "actionbutton"
                    if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                    if (getTile(map, game.position[0] + 1, game.position[1], 2) != undefined) if (getTile(map, game.position[0] + 1, game.position[1], 2).action != undefined) actionButton.source = "actionbutton_active"

                    for (i in activenpcs) {
                        activenpcs[i].talk = false;
                        if (activenpcs[i].position[0] == game.position[0] + 1 && activenpcs[i].position[1] == game.position[1]) {
                            actionButton.source = "actionbutton_active";
                            activenpcs[i].talk = true;
                        }
                    }

                    if (isWalkable(map, game.position[0] + 1, game.position[1])
                        && isWalkable(map, game.position[0] + 1, game.position[1], 2)) { //Direction-change-against-wall
                        kofs = [1, 0, 1];
                        game.position[0]++;
                        ActionsOnMove();
                        tryTeleport(map, game.position[0], game.position[1]);

                        actionButton.source = "actionbutton"
                        if (getTile(map, game.position[0] + 1, game.position[1]) != undefined) if (getTile(map, game.position[0] + 1, game.position[1]).action != undefined) actionButton.source = "actionbutton_active"
                        if (getTile(map, game.position[0] + 1, game.position[1], 2) != undefined) if (getTile(map, game.position[0] + 1, game.position[1], 2).action != undefined) actionButton.source = "actionbutton_active"
                        for (i in activenpcs) {
                            if (activenpcs[i].position[0] == game.position[0] + 1 && activenpcs[i].position[1] == game.position[1]) actionButton.source = "actionbutton_active";
                        }
                    }
                }
                pad = "";
            }
            kofs[2] = Math.max(kofs[2] - delta / 166, 0);
            walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;


            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.map[y] && map.map[y][(x * 4) + 2]) {
                    ctx.drawImage(images["tiles/" + getTile(map, x, y).sprite],
                        ((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width/2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                } else if (map.tiles.empty) {
                    ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                        (zoom * scale) * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                }
            }
            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapbg2[y] && map.mapbg2[y][(x * 4) + 2]) {
                    if (map.mapbg2[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 2).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                    }
                }
            }

            for (let enemy of enemies) {
                if (enemy.alpha > 0) {
                    ctx.globalAlpha = enemy.alpha;
                    enemy.render(ctx);
                }
            }

            if (map.items != undefined) {
                for (let item of map.items) {
                    if (item[4] == true) {
                        ctx.drawImage(images["items/" + item[2]],
                            ((zoom * scale) * (item[0] + kofs[0] * kofs[2] - (game.position[0] - width / 2 + 0.5))) - ((zoom - 1) * scale * (width / 2)),
                            (zoom * scale) * (item[1] + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                            zoom * scale, zoom * scale)
                    }
                }
            }

            for (i in activenpcs) {
                if (activenpcs[i].alpha > 0) {
                    ctx.globalAlpha = activenpcs[i].alpha;
                    activenpcs[i].render(ctx);
                }
            }

            if (isDawn()) nightEffect.snip = [24, 0, 8, 8];
            else if (isNoon()) nightEffect.snip = [0, 0, 8, 8];
            else if (isDusk()) nightEffect.snip = [8, 0, 8, 8];
            else if (isNight()) nightEffect.snip = [16, 0, 8, 8];

            ctx.drawImage(images[game.chars[0]], 32 * Math.floor(walkTime), 32 * head, 32, 32,
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5) ),
                scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zoom * scale, zoom * scale)
            ctx.imageSmoothingEnabled = true;


            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                    if (map.mapfg[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 3).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                    }
                }
            }


            if (inDialogue == true) {
                for (i = 0; i < dialogueComponents.length; i++) {
                    dialogueComponents[i].alpha = 255;
                }
                if (map.dialogues != undefined) {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueComponents[6].text = currentDialogue[dialogueProgress][0];
                    else dialogueComponents[6].text = currentDialogue[dialogueProgress][0]();
                    
                    if (currentDialogue[dialogueProgress][3] != undefined) dialogueComponents[3].text = currentDialogue[dialogueProgress][3];
                    dialogueEmotion = currentDialogue[dialogueProgress][2];
                    dialogueComponents[5].source = currentDialogue[dialogueProgress][1];
                    dialogueComponents[5].snip = getEmotion(dialogueEmotion);
                }
                else {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueComponents[6].text = currentDialogue[dialogueProgress][0];
                    else dialogueComponents[6].text = currentDialogue[dialogueProgress][0]();

                    if (currentDialogue[dialogueProgress][3] != undefined) dialogueComponents[3].text = currentDialogue[dialogueProgress][3];
                    dialogueEmotion = currentDialogue[dialogueProgress][2];
                    dialogueComponents[5].source = currentDialogue[dialogueProgress][1];
                    dialogueComponents[5].snip = getEmotion(dialogueEmotion);
                }
            }

            else if (dialogueComponents[0].alpha != 0) {
                for (i = 0; i < dialogueComponents.length; i++) {
                    dialogueComponents[i].alpha = 0;
                }
            }

            // ...leave?
            if (currentKeys["q"]) {
                setScene(scenes.title());
            }


            // Update bottom right texts
            // I think this method is inefficient, but I was not able to find a better one.
            // I searched and tried several things for hours.
            mapDisplayLevel1.text = "Level: " + getPlayer(1 + overWorldStatsScroll).level + "  EXP: " + getPlayer(1 + overWorldStatsScroll).EXP + "/25";
            mapDisplayStats1.text = "HP: " + getPlayer(1 + overWorldStatsScroll).HP + "/" + getPlayer(1 + overWorldStatsScroll).maxHP + "   EP: " + getPlayer(1 + overWorldStatsScroll).EP + "/" + getPlayer(1 + overWorldStatsScroll).maxEP;
            mapDisplayLevel2.text = "Level: " + getPlayer(2 + overWorldStatsScroll).level + "  EXP: " + getPlayer(2 + overWorldStatsScroll).EXP + "/25";
            mapDisplayStats2.text = "HP: " + getPlayer(2 + overWorldStatsScroll).HP + "/" + getPlayer(2 + overWorldStatsScroll).maxHP + "   EP: " + getPlayer(2 + overWorldStatsScroll).EP + "/" + getPlayer(2 + overWorldStatsScroll).maxEP;
        },
        controls: [
            ...walkPad, ...mapDisplay, actionButton,
            mapDisplayStats1, mapDisplayStats2,
            mapDisplayLevel1, mapDisplayLevel2, ...dialogueComponents,
            poisonBlack, nightEffect,
            ...menuSettings, ...menuSettingsGameplay, ...menuSettingsAudio, ...menuSettingsGraphics, ...menuItems, ...menuItemsImages, ...menuItemsAmounts,
            autoSaveText, settingsSaveText,
        ],
    }
}

// TBD - to be developed