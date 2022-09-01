var zoom = 1;
var zswm = 1;
var kofs = [0, 0, 0];
var walkTime = 0;
var direction = "none";
var inDialogue = false;
var currentDialogue;
var dialogueProgress = 1;
var dialogueType;
var dialogueEmotion = "neutral";
var overWorldStatsScroll = 0;

// Function used to create enemies
function createEnemy(type) {
    if (currentEnemies.length < 9) {
        currentEnemies.push([type, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]);
    }
}

function causeEffect(i, effect, rounds) {
    // Immune?
    for (j in getPlayer(i + 1).equipment) {
        if (getPlayer(i + 1).equipment[j] != "none") {
            if (items[getPlayer(i + 1).equipment[j]]().stats.immune != undefined) {
                for (e in items[getPlayer(i + 1).equipment[j]]().stats.immune) {
                    if (items[getPlayer(i + 1).equipment[j]]().stats.immune[e] == effect) {
                        return false;
                    }
                }
            }
        }
    }

    // Not immune!
    getPlayer(i + 1).effect = [effect, rounds];
}

function startFight(type = "default", enemies = "default") {
    defeatType = type;

    if (enemies != "default") {
        clearCurrentEnemies();
        currentEnemies = enemies;
    }

    if (type == "nogameover") playMusic("bgm/boss");
    else playMusic("bgm/fight");
    setScene(scenes.fight());
}

function clearCurrentEnemies() {
    currentEnemies = [];
}

function checkLevelUps() {
    for (i in game.chars) {
        let I = game.chars[i];
        while (game.characters[I].EXP > 24) {
            game.characters[I].EXP -= 25;
            game.characters[I].level += 1;

            game.characters[I].HP = getStat(I, "maxHP");
        }
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
        case "love":
            return [0, 128, 64, 64];
            break;
        case "disappointed":
            return [0, 192, 64, 64];
            break;
        case "sad":
            return [0, 256, 64, 64];
            break;
        case "angry":
            return [0, 320, 64, 64];
            break;
        default:
            return [0, 0, 64, 64];
            break;
    }
}

function emotionAnimation(char, emotion) { // Epic rhyme
    // This function returns, well, emotion animation pics (laughing, victory, etc.)
    let file = char + "_ani";
    if (images[file] == undefined) return false;
    let snip = [];
    let size = 32;
    let amount = 1;
    switch (emotion) {
        case "disappointed":
            snip = [0, 0, size, size];
            break;
        case "love":
            snip = [size, 0, size, size];
            break;
        case "crying":
            snip = [size * 2, 0, size, size];
            break;
        case "laugh":
            snip = [0, size, size, size];
            amount = 2;
            break;
        case "victory":
            snip = [size * 2, size, size, size];
            amount = 2;
            break;
        case "anger":
            snip = [size * 4, size, size, size];
            break;
    }
    return [file, snip, amount];
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

    var menuItems = [];
    var menuItemsImages = [];
    var menuItemsAmounts = [];
    var menuItemsStoryOnly = false;
    var areaNameBox = [];
    
    var weatherControls = [];
    var cloudControls = [];
    var dustControls = [];
    var fogopa = 2;

    var tokenRunning = false;

    /* let walkPad = [];
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
    })); */

    let padActive = false;
    let padAlpha = 0;
    let padPosition = [0, 0];
    let padThumbPosition = [0, 0];


    let nightEffect = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0, fill: "white",
    });
    let nightEffect2 = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0, fill: "white",
    });
    let weatherEffect = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        source: "vignette", alpha: 0,
    });

        // Alright, alright, we need comments, so let me comment this
        // This is for the map's display. In the BOTTOM RIGHT. No idea what else to call it.
    let mapDisplay = controls.button({
        anchor: [1, 0], offset: [-96, 0], sizeOffset: [96, 96],
        alpha: 1,
        text: "",
        onClick(args) {
            setScene(scenes.inventory());
        }
    });
    let mapIcon = controls.image({
        anchor: [1, 0], offset: [-96, 0], sizeOffset: [96, 96],
        alpha: 1,
        source: "inventory",
    });

    // The top bg rect
    //mapDisplay.push(controls.rect({
    //    anchor: [.9925, .68], offset: [-220, 0], sizeOffset: [250, 250],
    //    fill: colors.buttonbottom,
    //}));



    let poisonBlack = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 0,
        fill: "black",
    }); 

    // Names, stats, etc
    /*
    mapDisplay.push(controls.label({
        anchor: [.99, .68], offset: [-200, 20],
        alpha: 1,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer().name,
    }));
    let mapDisplayStats1 = controls.label({
        anchor: [.99, .705], offset: [-200, 20],
        alpha: 1,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer().HP + "/" + getStat(1, "maxHP") + "   EP: " + getPlayer().EP + "/" + getPlayer().maxEP,
    });
    let mapDisplayLevel1 = controls.label({
        anchor: [.99, .73], offset: [-200, 20],
        alpha: 1,
        align: "left", fontSize: 14, fill: "yellow",
        text: "Level: " + getPlayer().level,
    }); 

    mapDisplay.push(controls.label({
        anchor: [.99, .76], offset: [-200, 20],
        alpha: 1,
        align: "left", fontSize: 18, fill: "#000000",
        text: getPlayer(2).name,
    }));
    let mapDisplayStats2 = controls.label({
        anchor: [.99, .785], offset: [-200, 20],
        alpha: 1,
        align: "left", fontSize: 14, fill: "green",
        text: "HP: " + getPlayer(2).HP + "/" + getStat(2, "maxHP") + "   EP: " + getPlayer(2).EP + "/" + getPlayer(2).maxEP,
    });
    let mapDisplayLevel2 = controls.label({
        anchor: [.99, .81], offset: [-200, 20],
        alpha: 1,
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
        alpha: 1,
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
        alpha: 1,
    }));
    */

    let dialogueNormalComponents = [];
    let dialogueInvisComponents = [];
    let dialogueNarratorComponents = [];

    dialogueNormalComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -200], sizeAnchor: [1, 0], sizeOffset: [0, 200],
        clickthrough: false,
        fill: colors.buttonbottom,
        onClick(args) {
            if (this.alpha == 1) {
                dialogueProgress += 1;
                if (dialogueProgress >= currentDialogue.length || currentDialogue[dialogueProgress] == undefined) {
                    // Dialogue end
                    inDialogue = false;
                    currentDialogue = false;
                    dialogueEmotion = "neutral";
                    dialogueProgress = 1;
                    canMove = true;
                    actionButton.alpha = 1;
                }
                else if (currentDialogue[dialogueProgress][4] != undefined) {
                    currentDialogue[dialogueProgress][4]();
                }

            }
        },
        alpha: 0, 
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -200], sizeOffset: [136, 136],
        clickthrough: false,
        fill: colors.buttontop,
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -54], sizeOffset: [128, 32],
        clickthrough: false,
        fill: colors.buttontop,
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.label({
        anchor: [0.01, 1.01], offset: [64, -34],
        align: "center", fontSize: 20, fill: "black",
        text: "Bleu",
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [164, -200], sizeOffset: [0, 178], sizeAnchor: [0.8, 0],
        clickthrough: false,
        fill: colors.buttontop,
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.01, 1.01], offset: [0, -192], sizeOffset: [128, 128], snip: [0, 0, 64, 64],
        source: "Portraits_Bleu",
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.label({ // 6
        anchor: [0, 1], offset: [196, -168],
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0,
    }));
    dialogueNormalComponents.push(controls.image({
        anchor: [0.81, 1], sizeOffset: [64, 64], offset: [100, -96],
        source: "star",
        alpha: 0,
    }));

    dialogueInvisComponents.push(controls.rect({
        anchor: [0, 1], offset: [0, -200], sizeAnchor: [1, 0], sizeOffset: [0, 200],
        clickthrough: false,
        fill: colors.buttonbottom,
        onClick(args) {
            if (this.alpha == 1) {
                dialogueProgress += 1;
                if (dialogueProgress >= currentDialogue.length || currentDialogue[dialogueProgress] == undefined) {
                    // Dialogue end
                    inDialogue = false;
                    currentDialogue = false;
                    dialogueEmotion = "neutral";
                    dialogueProgress = 1;
                    canMove = true;
                    actionButton.alpha = 1;
                }
                else if (currentDialogue[dialogueProgress][4] != undefined) {
                    currentDialogue[dialogueProgress][4]();
                }

            }
        },
        alpha: 0,
    }));
    dialogueInvisComponents.push(controls.rect({
        anchor: [0.01, 1.01], offset: [0, -200], sizeOffset: [0, 180], sizeAnchor: [0.98, 0],
        clickthrough: false,
        fill: colors.buttontop,
        alpha: 0,
    }));
    dialogueInvisComponents.push(controls.label({ // 2
        anchor: [0.02, 1], offset: [0, -168],
        align: "left", fontSize: 16, fill: "black",
        text: "...",
        alpha: 0,
    }));
    dialogueInvisComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96],
        source: "star",
        alpha: 0,
    }));


    dialogueNarratorComponents.push(controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        clickthrough: false,
        source: "narratorbg",
        onClick(args) {
            if (this.alpha == 1 || dialogueType == "cinematic") {
                dialogueProgress += 1;
                if (dialogueProgress >= currentDialogue.length || currentDialogue[dialogueProgress] == undefined) {
                    // Dialogue end
                    inDialogue = false;
                    currentDialogue = false;
                    dialogueEmotion = "neutral";
                    dialogueProgress = 1;
                    canMove = true;
                    actionButton.alpha = 1;
                }
                else if (currentDialogue[dialogueProgress][4] != undefined) {
                    currentDialogue[dialogueProgress][4]();
                }

            }
        },
        alpha: 0,
    }));
    dialogueNarratorComponents.push(controls.label({ // 1
        anchor: [0.5, 0.5],
        align: "center", fontSize: 16, fill: "white",
        text: "...",
        alpha: 0,
    }));
    dialogueNarratorComponents.push(controls.image({
        anchor: [0.8, 1], sizeOffset: [64, 64], offset: [0, -96],
        source: "star",
        alpha: 0,
    }));

    let actionButton = controls.image({
        anchor: [1, 0.8], sizeOffset: [128, 128], offset: [-256, 0],
        alpha: 1,
        source: "actionbutton",
        onClick(args) {
            // Look at how amazingly optimized this is now YAY (xo & yo, more like that's awesome yo)
            let xo = 0;
            let yo = 0;
            if (head == 0) yo = 1; // Down
            if (head == 1) xo = -1; // Left
            if (head == 2) xo = 1; // Right
            if (head == 3) yo = -1; // Up

            let xpos = Math.floor(game.position[0]);
            let ypos = Math.floor(game.position[1]);

            if (inDialogue == false) {
                let map = maps[game.map];
                if (getTile(map, xpos + xo, ypos + yo) != undefined) {
                    if (getTile(map, xpos + xo, ypos + yo).action != undefined) {
                        getTile(map, xpos + xo, ypos + yo).action();
                    }
                }
                if (getTile(map, xpos + xo, ypos + yo, 2) != undefined) {
                    if (getTile(map, xpos + xo, ypos + yo, 2).action != undefined) {
                        getTile(map, xpos + xo, ypos + yo, 2).action();
                    }
                }
                for (i in activenpcs) {
                    if (activenpcs[i].position[0] == game.position[0] + xo && activenpcs[i].position[1] == game.position[1] + yo) {
                        startDialogue(activenpcs[i].dialogues[1]);
                    }
                }

            }
        }
    });

    // Buttons, then images over them
    /*
    for (i = 0; i < 3; i++) {
        mapDisplay.push(controls.button({
            anchor: [.9925, .875], offset: [-220 + (i * 75), 0], sizeOffset: [75, 75],
            alpha: 1,
            text: "",
            onClick(args) {
                playSound("buttonClickSound");
                if (this.offset[0] == -220 && canMove == true) { // Spawn enemy placeholder
                    enemies.push(mapenemies.ntf({
                        position: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 15)], map: game.map,
                    }));
                }
                if (this.offset[0] == -145 && canMove == true) {
                    hideMapDisplay();
                    showMenuItems(menuItemsStoryOnly);
                }
                if (this.offset[0] == -70 && canMove == true) {
                    if (this.alpha == 1) {
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
            alpha: 1,
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
            mapDisplay[i].alpha = 1;
        }
        mapDisplayStats1.alpha = 1;
        mapDisplayStats2.alpha = 1;
        mapDisplayLevel1.alpha = 1;
        mapDisplayLevel2.alpha = 1;
    }
    */ /*
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
    } */

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
            menuItems[i].alpha = 1;
        }
        for (i = 0; i < menuItemsImages.length; i++) {
            if (menuItemsImages[i + j] != undefined) {
                if (Object.keys(game.inventory)[i] != undefined) {
                    if (storyonly == false && items[Object.keys(game.inventory)[i]]().story == false) {
                        menuItemsImages[i + j].source = "items/" + items[Object.keys(game.inventory)[i]]().source;
                        menuItemsImages[i + j].item = Object.keys(game.inventory)[i];
                        menuItemsImages[i + j].alpha = 1;
                    }
                    else {
                        if (storyonly == true && items[Object.keys(game.inventory)[i]]().story == true) {
                            menuItemsImages[i + j].source = "items/" + items[Object.keys(game.inventory)[i]]().source;
                            menuItemsImages[i + j].item = undefined; // can't use it
                            menuItemsImages[i + j].alpha = 1;
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
                        menuItemsAmounts[i + j].alpha = 1;
                    }
                    else { 
                        if (storyonly == true && items[Object.keys(game.inventory)[i]]().story == true) {
                            menuItemsAmounts[i + j].text = "x" + game.inventory[Object.keys(game.inventory)[i]];
                            menuItemsAmounts[i + j].alpha = 1;
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
                    if (this.alpha == 1) {
                        playSound("buttonClickSound");
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
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                showMapDisplay();
                hideMenuItems();
            }
        }
    }));
    menuItems.push(controls.button({
        anchor: [0.675, 0.85], sizeAnchor: [0.1, 0.075],
        text: "Sort by", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
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

    let areaTeleportFade = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "black", alpha: 0
    })

    areaNameBox.push(controls.rect({
        anchor: [0.3, 0.2], sizeAnchor: [0.4, 0.2],
        fill: "purple", alpha: 0
    }))
    areaNameBox.push(controls.rect({
        anchor: [0.3, 0.2], sizeAnchor: [0.4, 0.2], sizeOffset: [-16, -16], offset: [8, 8],
        fill: "lightblue", alpha: 0
    }))
    areaNameBox.push(controls.label({
        anchor: [0.5, 0.3],
        align: "center", fontSize: 32, fill: "black",
        text: "AREA UNDEFINED", alpha: 0,
    }))

    // Weather time thing
    function setNightEffet(color, al = 0.5, type = "none") {
        //console.log(nightEffect.fill, color, al, type);
        let transitionDuration = 30000; // Roughly how long it lasts. 1000 = 1 sec
        let fogOpacityChangeIntensity = 10; // How much the opacity during fog changes. Higher number = less
        // Speed in preRender

        if (type == "instant" || nightEffect.fill == "white") {
            nightEffect.alpha = al;
            nightEffect2.alpha = 0;
            nightEffect.fill = color;
            return true;
        }

        if (type == "fog") {
            if (fogopa >= 1) al += (fogopa - 1) / fogOpacityChangeIntensity;
            else al -= ((fogopa) / fogOpacityChangeIntensity) - (1 / fogOpacityChangeIntensity);
            if (al > 1) al = 1;
            if (al <= 0) al = 0.01;
            nightEffect.alpha = al;
        }

        if (color == "none") {
            nightEffect.alpha = 0;
            nightEffect2.alpha = 0;
        }
        else if (nightEffect.fill != color) {
            nightEffect2.fill = nightEffect.fill;
            nightEffect.fill = color;
            nightEffect2.alpha = al;
            nightEffect.alpha = 0;

            addAnimator(function (t) {
                nightEffect.alpha = 0 + t / transitionDuration;
                nightEffect2.alpha = al - t / transitionDuration;

                if (t > (al * transitionDuration) - 1) {
                    nightEffect2.alpha = 0;
                    nightEffect.alpha = al;
                    return true;
                }
                return false;
            });
        }
    }

    // Function used to grab tiles
    function getTile(map, x, y, l = 1) {
        if (y < 0) return undefined;
        x = Math.floor(x);
        y = Math.floor(y);
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

    // Function used to figure out if anyone (player, npcs, enemies, Ed Sheeran) is on a tile
    function creaturesOnTile(map, x, y, player = true) {
        // Set player to false if you want to ignore the player
        // This functions returns true if anyone is there - false if nobody is there
        // do !creaturesOnTile(...) to check if nobody is there

        if (game.position[0] == x && game.position[1] == y && player == true) {
            return true;
        }
        for (cot in enemies) {
            if (enemies[cot].position[0] == x && enemies[cot].position[1] == y) {
                return true;
            }
        }
        for (cot in activenpcs) {
            if (activenpcs[cot].position[0] == x && activenpcs[cot].position[1] == y) {
                return true;
            }
        }
        // Nobody there
        return false;
    }

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
    function isWalkable(map, x, y, l = 1) {
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
            let nmapname = maps[themap.teleport[0]].name;

            canMove = false;
            playSound("teleport");
            areaTeleportFade.fill = "black";
            addAnimator(function (t) { // Area enter effect part 1
                areaTeleportFade.alpha = 0 + (t / 500);
                if (t > 499) {
                    areaTeleportFade.alpha = 1;
                    return true;
                }
                return false;
            });

            setTimeout(() => {
                if (nmapname != undefined) { // The box stuff. Only if the map has a name
                    areaNameBox[2].text = nmapname;
                    for (i in areaNameBox) {
                        areaNameBox[i].alpha = 1;
                    }

                    setTimeout(() => { // Box disappear
                        addAnimator(function (t) {
                            for (i in areaNameBox) {
                                areaNameBox[i].alpha = 1 - (t / 500);
                            }
                            if (t > 499) {
                                for (i in areaNameBox) {
                                    areaNameBox[i].alpha = 0;
                                }
                                return true;
                            }
                            return false;
                        });
                    }, 1000);

                }


                addAnimator(function (t) { // part 2
                    areaTeleportFade.alpha = 1 - (t / 500);
                    if (t > 499) {
                        areaTeleportFade.alpha = 0;
                        canMove = true;
                        return true;
                    }
                    return false;
                });

                game.map = themap.teleport[0];
                for (i in weatherControls) {
                    weatherControls[i].alpha = 0;
                }
                for (i in dustControls) {
                    dustControls[i].alpha = 0;
                }
                loadNPCs();
                loadAreaMusic(previousmap);
                game.position[0] = themap.teleport[1];
                game.position[1] = themap.teleport[2];
            }, 1000);
        }
    }

    function check_EnemyCollision(i) {
        if (game.position[0] == enemies[i].position[0] &&
            game.position[1] == enemies[i].position[1] &&
            enemies[i].map == game.map && canMove == true && tokenRunning == false) {
            // Fight !!!
            canMove = false;
            tokenRunning = true;
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

            playSound("encounter");
            image_animation(images.tokenattack, 4, 5, 100);
            defeatType = "default";

            areaTeleportFade.fill = "white";
            areaTeleportFade.alpha = 0;

            let previouszoom = zoom;
                addAnimator(function (t) {
                    zoom = 1 + (t / 500);
                    if (t > 1799 && t < 2500) {
                        areaTeleportFade.alpha = 0 + Math.min(((Math.min(t - 1800, 400)) / 400), 1);
                    }
                    if (t > 2499 && t < 2755) {
                        areaTeleportFade.fill = "rgb(" + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + "," + (255 - (t - 2500)) + ")";
                    }
                    if (t > 2999) {
                        startFight();
                        
                        zoom = previouszoom;
                        tokenRunning = false;
                        return true;
                    }
                    return false;
                });
            
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
            if (getPlayer(i + 1).effect[0] == "poison" && getPlayer(i + 1).HP > 0) {
                getPlayer(i + 1).HP -= 1;
                if (poisonBlack.alpha == 0) {
                    poisonBlack.alpha = 1;
                    poisonBlack.fill = "black";
                    addAnimator(function (t) {
                        poisonBlack.fill = "rgb(" + (0 + (t / 3)) + "," + (0 + (t / 3)) + "," + (0 + (t / 3)) + ")";
                        if (t > 400) {
                            poisonBlack.fill = "black";
                            poisonBlack.alpha = 0.1;
                        }
                        if (t > 700) {
                            poisonBlack.alpha = 0;
                            return true;
                        }
                    })
                }
            }
        }

        // Leader dead?
        if (game.characters[game.leader].HP < 1) {
            let highest = 0;
            let who = "";
            for (i in game.characters) {
                if (game.characters[i].HP > highest) {
                    highest = game.characters[i].HP;
                    who = game.characters[i].name.toLowerCase();
                }
            }
            if (highest == 0 || who == "") {
                setScene(scenes.title());
            }
            else {
                game.leader = who;
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
                            position: [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)], map: game.map,
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
            startDialogue(map.dialogues[getTile(map, game.position[0], game.position[1]).dialogue]);
        }
    }

    function startDialogue(cd) {
        inDialogue = true;
        currentDialogue = cd;
        dialogueProgress = 1;
        dialogueEmotion = currentDialogue[dialogueProgress][1];
        dialogueType = currentDialogue[0];
        canMove = false;
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



    function spawnRaindrop() {
        let thisOne = 499;
        for (i in weatherControls) {
            if (weatherControls[i].alpha == 0) {
                thisOne = i;
                break;
            }
        }
        if (thisOne != 499) {
            weatherControls[thisOne].source = "rain";
            weatherControls[thisOne].sizeOffset = [64, 64];
            weatherControls[thisOne].anchor = [Math.random(), -0.2];
            weatherControls[thisOne].alpha = 1;
        }
    }

    function spawnFogcloud() {
        let thisOne = 499;
        for (i in weatherControls) {
            if (weatherControls[i].alpha == 0) {
                thisOne = i;
                break;
            }
        }
        if (thisOne != 499) {
            if (Math.random() > 0.49) weatherControls[thisOne].source = "fog";
            else weatherControls[thisOne].source = "fog2";
            weatherControls[thisOne].sizeOffset = [128, 64];
            weatherControls[thisOne].anchor = [-0.2, Math.random()];
            weatherControls[thisOne].alpha = 0.75;
        }
    }

    function spawnDarkcloud() {
        let thisOne = 499;
        for (i in cloudControls) {
            if (cloudControls[i].alpha == 0) {
                thisOne = i;
                break;
            }
        }
        if (thisOne != 499) {
            if (Math.random() > 0.49) cloudControls[thisOne].source = "cloudshadow1";
            if (Math.random() > 0.49) cloudControls[thisOne].source = "cloudshadow2";
            else cloudControls[thisOne].source = "cloudshadow3";
            cloudControls[thisOne].sizeOffset = [128, 64];
            cloudControls[thisOne].anchor = [0.8 + (0.6 * Math.random()), -0.4 + (0.2 * Math.random())];
            cloudControls[thisOne].alpha = 0.75;
        }
    }

    function spawnDust() {
        let thisOne = 499;
        for (i in dustControls) {
            if (dustControls[i].alpha == 0) {
                thisOne = i;
                break;
            }
        }
        if (thisOne != 499) {
            dustControls[thisOne].anchor = [-0.2, Math.random()];
            dustControls[thisOne].alpha = 1;
        }
    }

    for (i = 0; i < 100; i++) {
        weatherControls.push(controls.image({
            anchor: [Math.random(), -0.2], sizeAnchor: [0, 0], sizeOffset: [64, 64],
            source: "rain", alpha: 0,
        }))
        cloudControls.push(controls.image({
            anchor: [Math.random(), -0.2], sizeAnchor: [0, 0], sizeOffset: [64, 64],
            source: "cloudshadow1", alpha: 0,
        }))
    }
    for (i = 0; i < 400; i++) {
        dustControls.push(controls.rect({
            anchor: [-0.2, Math.random()], sizeOffset: [4, 4],
            fill: "yellow",
            alpha: 0,
        }))
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
            if (map.music == undefined) return false;
            playMusic(map.music);
        }
    }

    loadNPCs();
    loadAreaMusic();

    // Default black fade transition
    let blackFadeTransition = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1], // (fullscreen)
        fill: "black",
        alpha: 1
    })
    addAnimator(function (t) {
        blackFadeTransition.alpha = 1 - (t / 200);
        if (t > 499) {
            blackFadeTransition.alpha = 0;
            return true;
        }
        return false;
    })
    // black fade transition end

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

            // Weather
            if (map.worldmode) {
                if (Math.random() > 0.92) spawnDarkcloud();
                for (i in cloudControls) {
                    if (cloudControls[i].alpha > 0) {
                        cloudControls[i].anchor[0] -= 0.0001 * delta;
                        cloudControls[i].anchor[1] += 0.0001 * delta;

                        if (cloudControls[i].anchor[0] < 0) cloudControls[i].alpha = 0;
                    }
                }
            }

            if (map.weather != undefined) {
                if (map.weather == "rain") {
                    spawnRaindrop();
                    spawnRaindrop();
                    for (i in weatherControls) {
                        if (weatherControls[i].alpha > 0) {
                            if (map.weatherStrength != undefined) weatherControls[i].anchor[1] += 0.002 * delta * map.weatherStrength;
                            else weatherControls[i].anchor[1] += 0.002 * delta;
                            if (weatherControls[i].anchor[1] > 1.1) weatherControls[i].alpha = 0;
                        }
                    }
                }
                if (map.weather == "fog") {
                    if (Math.random() > 0.92) spawnFogcloud();
                    fogopa -= 0.0003 * delta; // Adjust how quickly the fog opacity changes here! Lower = slower
                    if (fogopa < 0) fogopa = 2;
                    for (i in weatherControls) {
                        if (weatherControls[i].alpha > 0) {
                            if (map.weatherStrength != undefined) weatherControls[i].anchor[0] += 0.0001 * delta * map.weatherStrength;
                            else weatherControls[i].anchor[0] += 0.0001 * delta;

                            if (weatherControls[i].anchor[0] > 1.1) weatherControls[i].alpha = 0;
                        }
                    }
                }
                if (map.weather == "dust") {
                    spawnDust();
                    spawnDust();
                    spawnDust();
                    spawnDust();
                    for (i in dustControls) {
                        if (dustControls[i].alpha > 0) {
                            if (map.weatherStrength != undefined) dustControls[i].anchor[0] += 0.001 * delta * map.weatherStrength;
                            else dustControls[i].anchor[0] += 0.001 * delta;
                            if (dustControls[i].anchor[0] > 1.1) dustControls[i].alpha = 0;

                            if (Math.random() > 0.9) { // Down
                                if (map.weatherStrength != undefined) dustControls[i].anchor[1] += 0.001 * delta * map.weatherStrength;
                                else dustControls[i].anchor[1] += 0.001 * delta;
                            }
                            if (Math.random() > 0.9) { // Up
                                if (map.weatherStrength != undefined) dustControls[i].anchor[1] -= 0.001 * delta * map.weatherStrength;
                                else dustControls[i].anchor[1] -= 0.001 * delta;
                            }
                        }
                    }
                }
            }


            if (map.weather == "none" || map.weather == undefined) {
                if (isNoon()) setNightEffet("none", 0.35);
                else if (isDusk()) setNightEffet("#ff8c1a", 0.35);
                else if (isNight()) setNightEffet("#481365", 0.35);
                else if (isDawn()) setNightEffet("#d92200", 0.35);
            }
            if (map.weather == "rain") {
                if (isNoon()) setNightEffet("#cccccc", 0.5);
                else if (isDusk()) setNightEffet("#bf854c", 0.5);
                else if (isNight()) setNightEffet("#37293f", 0.5);
                else if (isDawn()) setNightEffet("#894337", 0.5);
            }
            if (map.weather == "fog" || map.weather == "dust") {
                if (isNoon()) setNightEffet("#b2b2b2", 0.6, "fog");
                else if (isDusk()) setNightEffet("#998572", 0.6, "fog");
                else if (isNight()) setNightEffet("#221c26", 0.6, "fog");
                else if (isDawn()) setNightEffet("#4c4241", 0.6, "fog");
            }

            // Check if it's time for enemies to mov�
            if (canMove == true) {
                for (i = 0; i < activenpcs.length; i++) {
                    activenpcs[i].movementTime += delta;
                    if (activenpcs[i].movement == 1 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingInterval * 1000 && !activenpcs[i].kofs[2]) {
                        activenpcs[i].movementTime = 0;
                        // Random moving
                        let xo;
                        let yo;
                        let head;

                        if (Math.random() > 0.40) { // Down
                            xo = 0;
                            yo = 1;
                            head = 0;
                        }
                        else if (Math.random() > 0.40) { // Left
                            xo = -1;
                            yo = 0;
                            head = 1;
                        }
                        else if (Math.random() > 0.40) { // Right
                            xo = 1;
                            yo = 0;
                            head = 2;
                        }
                        else if (Math.random() > 0.40) { // Up
                            xo = 0;
                            yo = -1;
                            head = 3;
                        }

                        if (xo != undefined) {
                            if (map.map[activenpcs[i].position[1] + yo] != undefined) {
                                if (map.map[activenpcs[i].position[1] + yo][activenpcs[i].position[0] + xo] != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) != undefined) {
                                        if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).occupied != true) {
                                            if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 2) == undefined || (map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 2).occupied != true) {
                                                if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 3) == undefined || (map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo, 3).occupied != true) {
                                                    if (!creaturesOnTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo)) {
                                                        // "all layers" for getTile would be nice - remind me to add it later
                                                        activenpcs[i].position[0] += xo;
                                                        activenpcs[i].position[1] += yo;
                                                        activenpcs[i].head = head;
                                                        activenpcs[i].kofs = [xo, yo, activenpcs[i].walkingSpeed];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }

                    if (activenpcs[i].movement == 2 && activenpcs[i].talk == false && activenpcs[i].movementTime > activenpcs[i].walkingInterval * 1000) {
                        activenpcs[i].movementTime = 0;
                        if (activenpcs[i].pathProgress > activenpcs[i].path.length) {
                            activenpcs[i].pathProgress = 0;
                        }

                        // Look at how amazingly optimized this is now YAY (xo & yo, more like that's awesome yo)
                        let xo = 0;
                        let yo = 0;
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 0) yo = 1; // Down
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 1) xo = -1; // Left
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 2) xo = 1; // Right
                        if (activenpcs[i].path[activenpcs[i].pathProgress] == 3) yo = -1; // Up


                        if (map.map[activenpcs[i].position[1]] != undefined) {
                            if (map.map[activenpcs[i].position[1]][activenpcs[i].position[0] + xo] != undefined) {
                                if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) != undefined) {
                                    if (getTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo).occupied != true) {
                                        if (!creaturesOnTile(map, activenpcs[i].position[0] + xo, activenpcs[i].position[1] + yo) || xo == 0 && yo == 0) {
                                            activenpcs[i].position[0] += xo;
                                            activenpcs[i].position[1] += yo;
                                            activenpcs[i].pathProgress += 1; // only increase it if something happens. lol
                                            if (activenpcs[i].path[activenpcs[i].pathProgress] != undefined) activenpcs[i].head = activenpcs[i].path[activenpcs[i].pathProgress];
                                            else activenpcs[i].head = activenpcs[i].path[activenpcs[i].pathProgress - 1];
                                            activenpcs[i].kofs = [xo, yo, activenpcs[i].walkingSpeed];
                                        }
                                    }
                                    else {
                                        activenpcs[i].pathProgress += 1; // or when you run against smth
                                    }
                                }
                            }
                        }

                    }
                }
                for (i = 0; i < enemies.length; i++) { 
                    enemies[i].movementTime += delta;
                    if (enemies[i].movementTime > enemies[i].walkingInterval * 1000 && !enemies[i].kofs[2]) {
                        enemies[i].movementTime = 0;

                        if (enemies[i].spawntime > 899) {
                            // Random moving
                            let xo;
                            let yo;
                            let headTo;
                            if (Math.random() > 0.40) { // Down
                                xo = 0;
                                yo = 1;
                                headTo = 0;
                            }
                            if (Math.random() > 0.40) { // Left
                                xo = -1;
                                yo = 0;
                                headTo = 1;
                            }
                            if (Math.random() > 0.40) { // Right
                                xo = 1;
                                yo = 0;
                                headTo = 2;
                            }
                            if (Math.random() > 0.40) { // Up
                                xo = 0;
                                yo = -1;
                                headTo = 3;
                            }
                            if (map.map[enemies[i].position[1] + xo] != undefined && xo != undefined) {
                                if (map.map[enemies[i].position[1] + xo][enemies[i].position[0] + yo] != undefined) {
                                    if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo) != undefined) {
                                        if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo).occupied != true) {
                                            if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 2) == undefined || getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 2).occupied != true) {
                                                if (getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 3) == undefined || getTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, 3).occupied != true) {
                                                    if (!creaturesOnTile(map, enemies[i].position[0] + xo, enemies[i].position[1] + yo, false)) {
                                                        enemies[i].position[0] += xo;
                                                        enemies[i].position[1] += yo;
                                                        enemies[i].head = headTo;
                                                        enemies[i].kofs = [xo, yo, enemies[i].walkingSpeed];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // Respawn if on ocean or occupied
                        if (map.map[enemies[i].position[1]] != undefined) {
                            if (getTile(map, enemies[i].position[0], enemies[i].position[1]) == undefined) { // Undefined
                                enemies[i].alpha = 0;
                                enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                            }
                            else {
                                if (getTile(map, enemies[i].position[0], enemies[i].position[1]).occupied == true) { // occupied
                                    enemies[i].alpha = 0;
                                    enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                                }
                                else {
                                    enemies[i].alpha = enemies[i].opacity;
                                }
                            }
                        }
                        else { // Undefined
                            enemies[i].alpha = 0;
                            enemies[i].position = [Math.floor(Math.random() * maps[game.map].map[0].length), Math.floor(Math.random() * maps[game.map].map.length)];
                        }

                        // Don't put this in a for loop. lol
                        check_EnemyCollision(i);
                    }
                }
            }

            // This is literally walking
            if (!kofs[2] && canMove == true) {
                let xo;
                let yo;
                let pass = false;

                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up")) {
                    head = 3;
                    direction = "up";
                    xo = 0;
                    yo = -1;
                    if (map.worldmode == true) if (game.position[1] % 1 == 0.5) pass = true;
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down")) {
                    head = 0;
                    direction = "down";
                    xo = 0;
                    yo = 1;
                    if (map.worldmode == true) if (game.position[1] % 1 == 0) pass = true;
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left")) {
                    head = 1;
                    direction = "left";
                    xo = -1;
                    yo = 0;
                    if (map.worldmode == true) if (game.position[0] % 1 == 0.5) pass = true;
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right")) {
                    head = 2;
                    direction = "right";
                    xo = 1;
                    yo = 0;
                    if (map.worldmode == true) if (game.position[0] % 1 == 0) pass = true;
                }
                // Optimized code pog
                if (xo != undefined) {
                    actionButton.source = "actionbutton"
                    if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.source = "actionbutton_active"
                    else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.source = "actionbutton_active"

                    for (i in activenpcs) {
                        activenpcs[i].talk = false;
                        if (activenpcs[i].position[0] == Math.floor(game.position[0]) + xo && activenpcs[i].position[1] == Math.floor(game.position[1]) + yo) {
                            actionButton.source = "actionbutton_active";
                            activenpcs[i].talk = true;
                        }
                    }


                    if (pass || isWalkable(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo)
                        && isWalkable(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2)) { //Direction-change-against-wall
                        let step = 1;
                        if (map.worldmode == true) step = 0.5;

                        kofs = [xo * step, yo * step, 1];
                        game.position[0] += xo * step;
                        game.position[1] += yo * step;

                        ActionsOnMove();
                        tryTeleport(map, Math.floor(game.position[0]), Math.floor(game.position[1]));

                        actionButton.source = "actionbutton"
                        if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo).action != undefined) actionButton.source = "actionbutton_active"
                        else if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2) != undefined) if (getTile(map, Math.floor(game.position[0]) + xo, Math.floor(game.position[1]) + yo, 2).action != undefined) actionButton.source = "actionbutton_active"

                        for (i in activenpcs) {
                            if (activenpcs[i].position[0] == Math.floor(game.position[0]) + xo && activenpcs[i].position[1] == Math.floor(game.position[1]) + yo) actionButton.source = "actionbutton_active";
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

            if (map.items != undefined) {
                for (let item of map.items) {
                    if (item[4] == true) {
                        ctx.drawImage(images["items/" + items[item[2]]().source],
                            ((zoom * scale) * (item[0] + kofs[0] * kofs[2] - (game.position[0] - width / 2 + 0.5))) - ((zoom - 1) * scale * (width / 2)),
                            (zoom * scale) * (item[1] + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                            zoom * scale, zoom * scale)
                    }
                }
            }


            let wm = 1;

            if (map.worldmode == true) {
                wm = 2;
            }
            zswm = (zoom * scale) / wm;

            for (i in activenpcs) {
                if (activenpcs[i].alpha > 0) {
                    ctx.globalAlpha = activenpcs[i].alpha;
                    activenpcs[i].render(ctx);
                }
            }

            for (let enemy of enemies) {
                if (enemy.alpha > 0) {
                    ctx.globalAlpha = enemy.alpha;
                    enemy.render(ctx);
                }
            }

            if (map.worldmode != true || images["wm" + game.leader] == undefined) {
                ctx.drawImage(images[game.leader], 32 * Math.floor(walkTime), 32 * head, 32, 32,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zswm, zswm)
                ctx.imageSmoothingEnabled = false;
            }
            else {
                ctx.drawImage(images["wm" + game.leader], 16 * Math.floor(walkTime), 16 * head, 16, 16,
                    scale * (game.position[0] - kofs[0] * kofs[2] - ofsX - ((zoom - 1) * 0.5)),
                    scale * (game.position[1] - kofs[1] * kofs[2] - ofsY + ((zoom - 1) / 2)), zswm, zswm)
                ctx.imageSmoothingEnabled = false;
            }

            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                    if (map.mapfg[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 3).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale, zoom * scale);
                    }
                }
            }

            // Joystick

            if (pointerActive && canMove) {
                if (padActive) {
                    padThumbPosition = pointerPos;
                    let offset = [padThumbPosition[0] - padPosition[0], padThumbPosition[1] - padPosition[1]]
                    let dist = Math.sqrt(offset[0] ** 2 + offset[1] ** 2);
                    if (dist > scale * 1.5 && !kofs[2]) {
                        if (Math.abs(offset[0]) > Math.abs(offset[1])) {
                            pad = offset[0] > 0 ? "right" : "left";
                        } else {
                            pad = offset[1] > 0 ? "down" : "up";
                        }
                    }
                    if (dist > scale * 2.5) {
                        padPosition = [
                            padPosition[0] + offset[0] / dist * (dist - scale * 2.5),
                            padPosition[1] + offset[1] / dist * (dist - scale * 2.5),
                        ]
                    }
                } else {
                    padPosition = padThumbPosition = pointerPos;
                }
                padAlpha = Math.min(padAlpha + delta * .01, 1);
                padActive = true;
            } else {
                let lerp = 1 - (0.98 ** delta);
                padThumbPosition = [
                    padThumbPosition[0] + (padPosition[0] - padThumbPosition[0]) * lerp,
                    padThumbPosition[1] + (padPosition[1] - padThumbPosition[1]) * lerp,
                ]
                padAlpha = Math.max(padAlpha - delta * .005, 0);
                padActive = false;
            }

            ctx.globalAlpha = padAlpha;
            ctx.beginPath();
            ctx.arc(padPosition[0], padPosition[1], scale * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#000000af";
            ctx.fill();
            if (pad || kofs[2]) {
                let ang = { up: -0.75, right: -0.25, down: 0.25, left: 0.75 }[direction]
                ctx.beginPath();
                ctx.arc(padPosition[0], padPosition[1], scale * 2.5, Math.PI * ang, Math.PI * (ang + .5));
                ctx.arc(padPosition[0], padPosition[1], scale * 1, Math.PI * (ang + .5), Math.PI * ang, true);
                ctx.fillStyle = "#ffffff1f";
                ctx.fill();
            }

            ctx.globalAlpha = padAlpha * 2;
            ctx.beginPath();
            ctx.arc(padThumbPosition[0], padThumbPosition[1], scale + 2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffae38";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(padThumbPosition[0], padThumbPosition[1], scale, 0, Math.PI * 2);
            ctx.fillStyle = "#d18822";
            ctx.fill();


            if (inDialogue == true && dialogueType == "normal") {
                for (i = 0; i < dialogueNormalComponents.length; i++) {
                    dialogueNormalComponents[i].alpha = 1;
                }
                if (map.dialogues != undefined) {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueNormalComponents[6].text = currentDialogue[dialogueProgress][0];
                    else dialogueNormalComponents[6].text = currentDialogue[dialogueProgress][0]();

                    if (currentDialogue[dialogueProgress][3] != undefined) dialogueNormalComponents[3].text = currentDialogue[dialogueProgress][3];
                    dialogueEmotion = currentDialogue[dialogueProgress][2];
                    dialogueNormalComponents[5].source = currentDialogue[dialogueProgress][1];
                    dialogueNormalComponents[5].snip = getEmotion(dialogueEmotion);

                    if (currentDialogue[dialogueProgress + 1] == undefined) dialogueNormalComponents[7].alpha = 0; // Star
                    actionButton.alpha = 0;
                }
            }
            else if (dialogueNormalComponents[0].alpha != 0) {
                for (i = 0; i < dialogueNormalComponents.length; i++) {
                    dialogueNormalComponents[i].alpha = 0;
                }
            }
            if (inDialogue == true && dialogueType == "invis") {
                for (i = 0; i < dialogueInvisComponents.length; i++) {
                    dialogueInvisComponents[i].alpha = 1;
                }
                if (map.dialogues != undefined) {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueInvisComponents[2].text = currentDialogue[dialogueProgress][0];
                    else dialogueInvisComponents[2].text = currentDialogue[dialogueProgress][0]();

                    if (currentDialogue[dialogueProgress + 1] == undefined) dialogueInvisComponents[3].alpha = 0; // Star
                    actionButton.alpha = 0;
                }
            }
            else if (dialogueInvisComponents[0].alpha != 0) {
                for (i = 0; i < dialogueInvisComponents.length; i++) {
                    dialogueInvisComponents[i].alpha = 0;
                }
            }
            if (inDialogue == true && dialogueType == "narrator") {
                for (i = 0; i < dialogueNarratorComponents.length; i++) {
                    dialogueNarratorComponents[i].alpha = 1;
                }
                if (map.dialogues != undefined) {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueNarratorComponents[1].text = currentDialogue[dialogueProgress][0];
                    else dialogueNarratorComponents[1].text = currentDialogue[dialogueProgress][0]();

                    if (currentDialogue[dialogueProgress + 1] == undefined) dialogueNarratorComponents[2].alpha = 0; // Star
                    actionButton.alpha = 0;
                }
            }
            else if (inDialogue == true && dialogueType == "cinematic") {
                dialogueNarratorComponents[1].alpha = 1;
                dialogueNarratorComponents[2].alpha = 1;
                if (map.dialogues != undefined) {
                    if (typeof (currentDialogue[dialogueProgress][0]) == "string") dialogueNarratorComponents[1].text = currentDialogue[dialogueProgress][0];
                    else dialogueNarratorComponents[1].text = currentDialogue[dialogueProgress][0]();

                    if (currentDialogue[dialogueProgress + 1] == undefined) dialogueNarratorComponents[2].alpha = 0; // Star
                    actionButton.alpha = 0;
                }
            }
            else if (dialogueNarratorComponents[1].alpha != 0) {
                for (i = 0; i < dialogueNarratorComponents.length; i++) {
                    dialogueNarratorComponents[i].alpha = 0;
                }
            }



            // ...leave?
            if (currentKeys["q"]) {
                setScene(scenes.title());
            }
        },
        controls: [
            ...weatherControls, ...cloudControls, ...dustControls, poisonBlack, nightEffect, nightEffect2, //weatherEffect,
            /*...walkPad,*/ mapDisplay, mapIcon, actionButton,
            ...menuItems, ...menuItemsImages, ...menuItemsAmounts,
            ...dialogueNormalComponents, ...dialogueInvisComponents, ...dialogueNarratorComponents,
            autoSaveText, /*settingsSaveText,*/ ...areaNameBox, areaTeleportFade,
            blackFadeTransition
        ],
    }
}

// TBD - to be developed
