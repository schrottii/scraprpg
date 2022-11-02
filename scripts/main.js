function init() {
    // Button detection
    mainCanvas.addEventListener("pointerdown", onCanvasPointerDown);
    mainCanvas.addEventListener("pointermove", onCanvasPointerMove);
    mainCanvas.addEventListener("pointerup", onCanvasPointerUp);
    window.addEventListener("keydown", (e) => currentKeys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", (e) => currentKeys[e.key.toLowerCase()] = false);

    let cancel = false;
    let tokenStay = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        source: "tttanimation", snip: [3200, 9000, 800, 450],
        alpha: 0,
    });

    setScene({
        controls: [
            tokenStay,
            controls.label({
                anchor: [.02, .98], offset: [5, -12],
                align: "left", baseline: "alphabetic", fontSize: 16,
                text: "",
            }),
            controls.label({
                anchor: [.98, .98], offset: [-5, -12],
                align: "right", baseline: "alphabetic", fontSize: 16, fill: "#7f7f7f",
                text: "",
            }),
            
    /*
            controls.button({
                anchor: [.5, .5], offset: [-100, -55], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Start with Sound",
                onClick() {
                    playSound("buttonClickSound");
                    musicPlayer.loop = true;
                    setScene(scenes.title());
                }
            }),
            controls.button({
                anchor: [.5, .5], offset: [-100, 5], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Start Muted",
                onClick() {
                    playSound("buttonClickSound");
                    musicPlayer.muted = true;
                    soundPlayer.muted = true;
                    setScene(scenes.title());
                }
            }),
            */
            controls.button({
                anchor: [.9, .8], sizeOffset: [50, 25],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Dev Mode",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    //playMusic("bgm/boss", "bgm/placeholder");
                    //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                    saveNR = 3;
                    loadGame();
                    loadSettings();
                    setScene(scenes.game());
                    openShop("placeholder");
                }
            }),
            controls.button({
                anchor: [.9, .9], sizeOffset: [50, 25],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Fight",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    //playMusic("bgm/boss", "bgm/placeholder");
                    //^intro example - remove comment ^ there, add comment to setscene few lines below, set musicplayer muted to false above
                    saveNR = 3;
                    loadGame();
                    loadSettings();
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    createEnemy("weakhelter");
                    setScene(scenes.fight());
                }
            }),
            controls.button({
                anchor: [.9, .6], sizeOffset: [50, 25],
                clickthrough: false, fontSize: 16, alpha: 1,
                text: "Map Maker",
                onClick() {
                    cancel = true;
                    musicPlayer.muted = true; // false?
                    soundPlayer.muted = false;

                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    stopMusic();
                    setScene(scenes.mapmaker());
                    openShop("placeholder");
                }
            }),
            
        ],
        name: "main"
    });
    loadAllResources();
    defFilter();
    loop();


    image_animation(images.schrottgamesanimation, 5, 15, 2000, 3375, 55);
    setTimeout(() => {
        if (!cancel) image_animation(images.tttanimation, 5, 21, 4000, 9450, 25)
    }, 2500);
    setTimeout(() => {
        tokenStay.alpha = 1;
        addAnimator(function (t) {
            tokenStay.alpha = 1 - Math.max(0, ((t / 500) - 1));

            if (t > 1499) {
                tokenStay.alpha = 0;
                return true;
            }
            return false;
        })
    }, 2500 + 2625);
    setTimeout(() => {
        if (!cancel) {
            musicPlayer.loop = true;
            setScene(scenes.title());
        }
    }, 4000 + 2625);
}

var currentKeys = {};
var autoSaveTime = 0;
var canMove = true;

var textProgress = -1;

//   Day: 6:00 - 17:59 (12 hours)
//  ----> Dawn: 6:00 - 8:59
//  ----> Noon: 9:00 - 14:59
//  ----> Dusk: 15:00 - 17:59
// Night: 18:00 - 5:59 (12 hours)

function getTime(ti = game.time, am=16.667, di=1000, sc=false) {
    let hours = Math.floor(ti / di);
    let minutes = Math.floor((ti % di) / am);

    let seconds = "";
    if (sc == true) seconds = ":" + Math.floor(ti % 60);
    if (sc == true && seconds.length == 2) seconds = ":0" + seconds.slice(1, 2);

    if (minutes == 60) return hours + 1 + ":00" + seconds;
    if (minutes < 10) return hours + ":0" + minutes + seconds;
    return hours + ":" + minutes + seconds;
}

function isDay() {
    if (game.time > 5999 && game.time < 18000) {
        return true;
    }
    return false;
}

function isDawn() {
    if (game.time > 5999 && game.time < 9000) {
        return true;
    }
    return false;
}
function isNoon() {
    if (game.time > 8999 && game.time < 15000) {
        return true;
    }
    return false;
}
function isDusk() {
    if (game.time > 14999 && game.time < 18000) {
        return true;
    }
    return false;
}

function isNight() {
    if (game.time > 17999 || game.time < 6000) {
        return true;
    }
    return false;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var playAfterIntro = "none";

function playMusic(name, intro = "none") {
    if (musicPlayer.volume > 0 && musicPlayer.volume <= 1) {
        if (audio[name].src != musicPlayer.src) {
            if (intro == "none") musicPlayer.src = audio[name].src;
            else {
                playAfterIntro = name;
                musicPlayer.src = audio[intro].src;
                musicPlayer.loop = false;
            }
        }
        musicPlayer.play();
    }
}

function stopMusic() {
    musicPlayer.pause();
}

// Generate 16 sound channels
var soundPlayer = {};

for (s = 1; s < 17; s++) {
    soundPlayer["soundPlayer" + s] = new Audio();
    let srcSoundPlayer = document.createElement("source");
    srcSoundPlayer.type = "audio/mpeg";
    srcSoundPlayer.preload = "auto";
    srcSoundPlayer.src = audio.no;
    soundPlayer["soundPlayer" + s].appendChild(srcSoundPlayer);
}

// play a sound - now supports sound channels!
function playSound(name) {
    let s = 1;
    while (s < 17) { // If all 16 are occupied, it won't play any sound
        if (soundPlayer["soundPlayer" + s].currentTime >= soundPlayer["soundPlayer" + s].duration || soundPlayer["soundPlayer" + s].src == "") {
            if (soundPlayer["soundPlayer" + s].volume > 0 && soundPlayer["soundPlayer" + s].volume <= 1) {
                //console.log(s);
                soundPlayer["soundPlayer" + s].src = audio[name].src;
                soundPlayer["soundPlayer" + s].play();
                return true;
            }
        }
        else { // Channel is occupied. (Angry sound channel sounds)
            s += 1;
        }
    }
}

function changeSoundVolume(vol) {
    if (vol <= 0) {
        for (s = 1; s < 17; s++) {
            soundPlayer["soundPlayer" + s].muted = true;
        }
        return;
    }
    if (vol > 1) return false;
    for (s = 1; s < 17; s++) {
        soundPlayer["soundPlayer" + s].muted = false;
        soundPlayer["soundPlayer" + s].volume = vol;
    }
}

let pointerActive = false;
let pointerPos = [0, 0];

function onCanvasPointerDown(e) {
    pointerActive = true;
    pointerPos = [e.clientX, e.clientY];
    for (let a = scene.controls.length - 1; a >= 0; a--) {

        if (scene.controls[a].fillTop == undefined && scene.controls[a].isPressed == undefined) continue;

        let con = scene.controls[a];
        if (con == undefined) return;
        let offsetX, offsetY, sizeX, sizeY;
        let red = 1;
        //if (con.offset == undefined) console.trace();

        if (isLs()) red = 2;

        offsetX = con.offset[0] / red + con.anchor[0] * mainCanvas.width;
        offsetY = con.offset[1] / red + con.anchor[1] * mainCanvas.height;
        sizeX = con.sizeOffset[0] / red + con.sizeAnchor[0] * mainCanvas.width;
        sizeY = con.sizeOffset[1] / red + con.sizeAnchor[1] * mainCanvas.height;



        // Make buttons go pressed color
        if (!scene.controls[a].clickthrough &&
            pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
            pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY) {
            scene.controls[a].isPressed = true;
            if (scene.controls[a].onDown) scene.controls[a].onDown();
        }
        else {
            scene.controls[a].isPressed = false;
        }
    }
}

function onCanvasPointerMove(e) {
    pointerPos = [e.clientX, e.clientY];
}

function onCanvasPointerUp(e) {
    pointerActive = false;
    pointerPos = [e.clientX, e.clientY];
    for (let a = scene.controls.length - 1; a >= 0; a--) {
        let con = scene.controls[a];
        if (con == undefined) return;
        //console.log("   X: " + mouseX + " Y: " + mouseY);

        // offset - Get the position where the element starts. size - How big. Combine them to define the clickable area!

        let offsetX, offsetY, sizeX, sizeY
        let red = 1;
        if (con.offset == undefined) console.trace();

        if (isLs()) red = 2;

        offsetX = con.offset[0] / red + con.anchor[0] * mainCanvas.width;
        offsetY = con.offset[1] / red + con.anchor[1] * mainCanvas.height;
        sizeX = con.sizeOffset[0] / red + con.sizeAnchor[0] * mainCanvas.width;
        sizeY = con.sizeOffset[1] / red + con.sizeAnchor[1] * mainCanvas.height;
        

        // Makes button go unpressed color after you stop clicking it
        // Without this you'd have to click somewhere else to "unclick" it
        if (scene.controls[a].fillTop != undefined) scene.controls[a].isPressed = false;


        if (!scene.controls[a].clickthrough && scene.controls[a].onClick &&
            pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
            pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY &&
            scene.controls[a].onClick()) {
            return;
        }
        else {
            if (!scene.controls[a].clickthrough && scene.controls[a].p != undefined && scene.controls[a].p != 0) {
                for (n in scene.controls[a].p) {
                    let p = scene.controls[a].p[n];
                    offsetX = p[1][0] / red + p[0][0] * mainCanvas.width;
                    offsetY = p[1][1] / red + p[0][1] * mainCanvas.height;
                    sizeX = p[3][0] / red + p[2][0] * mainCanvas.width;
                    sizeY = p[3][1] / red + p[2][1] * mainCanvas.height;
                    if (pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
                        pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY &&
                        scene.controls[a].onClick()) {
                        return;
                    }
                    if (pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
                        pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY &&
                        scene.controls[a].onParticleClick(n)) {
                        return;
                    }
                }
            }
        }
    }
}


let delta = 0;
let time = Date.now();

var animationtime = -1;
var animation;
var animationspeed = 100;

let scale = window.innerHeight / 16;
let width = window.innerWidth / scale;

function image_animation(image, columns, rows, sizex, sizey, speed=100) {
    animationtime = 0;
    animation = [image, columns - 1, rows - 1, sizex / columns, sizey / rows];
    animationspeed = speed;
    canMove = false;
}

function getPlayer(character = 1, src = game) {
    if (character > characters.length) character = 1;
    return src.characters[game.chars[character - 1]];
}

function isLs() {
    // Somewhat
    if (scale < 32) return true;
    return false;
}

function loop() {
    // Tick time
    delta = Date.now() - time;
    time = Date.now();
    // Resize the canvas
    mainCanvas.style.width = (mainCanvas.width = window.innerWidth) + "px";
    mainCanvas.style.height = (mainCanvas.height = window.innerHeight) + "px";

    height = window.innerHeight;
    scale = height / 16;
    width = window.innerWidth / scale;

    // Finally, after 200 --years-- commits, this part is documented (by Schrottii)
    // this sets ctx to the canvas, just the usual stuff
    let ctx = mainCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    // pre-render the canvas
    scene.preRender(ctx, delta);
    // Load every element that exists (Buttons, labels, images, everything)
    for (let control of scene.controls) {
        if (control.alpha > 0) { // If their alpha is above 0, "draw" them, with their alpha value
            // Alpha 1 = Max (100% opacity)
            // Alpha 0.1 = Barely visible              Alpha 0 = Invisible
            // Alpha 255 (or anything above 1 really) does not work anymore!
            ctx.globalAlpha = control.alpha;
            control.render(ctx);
        }
    }

    if (playAfterIntro != "none") {
        if (musicPlayer.currentTime >= musicPlayer.duration) {
            musicPlayer.src = audio[playAfterIntro].src;
            playAfterIntro = "none";
            musicPlayer.loop = true;
            musicPlayer.play();
        }
    }

    // Draw FPS
    ctx.font = "12px DePixelKlein, sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.globalAlpha = 1; //or else it's a bit transparent
    ctx.fillText((1000 / delta).toFixed(0) + "fps " + delta + "ms  | w: " + width + "  scale: " + scale + "   h: " + height + " ls: " + isLs(), 2, 12);

    // Auto Save
    if (settings != undefined) {
        if (settings.autosave == true) {
            autoSaveTime += delta;
        }
    }

    if (animationtime > -1) {
        let prog = Math.floor(animationtime / animationspeed);
        let i = Math.floor(prog % (animation[1] + 1));
        let j = Math.floor(prog / (animation[1] + 1));
        if (i + (j * animation[1]) != animation[1] * (animation[2] + 1) + 2) {
            ctx.drawImage(animation[0], animation[3] * i, animation[4] * j, animation[3], animation[4], 0, 0, width * scale, height);
            animationtime += delta;
        }
        else {
            // Finished
            canMove = true;
            animationtime = -1;
        }
    }
    if (textProgress != -1) {
        textProgress += delta / 1000;
    }

    game.playTime += (delta/1000); // 1 = 1 sec
    game.time += (delta/60);
    if (game.time >= 24000) { // 1000 = 1 hour in-game.
        game.time = 0;
    }

    updateAnimators(delta);

    requestAnimationFrame(loop);
}

function animatedText(text, speed = 20) { // 8, 20, 24
    if (textProgress == -1) textProgress = 0;
    let prog = Math.floor(textProgress * speed);
    if (prog < text.length) {
        if (currentDialogue[dialogueProgress].voice == false) playSound("female_young");
        else playSound(currentDialogue[dialogueProgress].voice);
    }
    return text.slice(0, prog);
}

function addWrenches(amount = 0) {
    if (game.wrenches != undefined) {
        game.wrenches = Math.min(game.wrenches + amount, 999999999);
    }
}

function addBricks(amount = 0) {
    // only from boss fights and enemies from the "Scorched Planet"(Scrap Planet after Platinschrott Volcano eruption)
    if (game.bricks != undefined) {
        game.bricks = Math.min(game.bricks + amount, 999999);
    }
}

// I copied these almost 1:1 from legacy.
// Got a problem with that? Huh?

var saveNR = 0;

function load(x, altx) {
    return x !== undefined ? x : altx;
}

function saveGame(auto = false) {
    let saveCopy = JSON.parse(JSON.stringify(game));
    if (!auto) localStorage.setItem("SRPG" + saveNR, JSON.stringify(saveCopy));
    else localStorage.setItem("SRPG3", JSON.stringify(saveCopy));
}

function saveSettings() {
    let settingsCopy = JSON.parse(JSON.stringify(settings));
    localStorage.setItem("SRPGSETTINGS", JSON.stringify(settingsCopy));
}

function loadSettings() {
    // Load settings
    let settingsCopy;
    settingsCopy = localStorage.getItem("SRPGSETTINGS");
    if (settingsCopy !== null && settingsCopy !== "null") {
        try {
            settingsCopy = JSON.parse(settingsCopy);
        }

        catch (e) {
            alert("Error (Settings)");
            return;
        }
        for (i in settings) {
            if (settingsCopy[i] == undefined) settingsCopy[i] = settings[i];
        }
        settings = settingsCopy;
    }
}

function loadGame() {
    // Load saves
    let saveCopy;
    saveCopy = localStorage.getItem("SRPG" + saveNR);
    if (saveCopy !== null && saveCopy !== "null") {
        try {
            saveCopy = JSON.parse(saveCopy);
        }

        catch (e) {
            alert("Error");
            return;
        }

        if (saveCopy.characters == undefined) saveCopy.characters = game.characters;
        for (i in characters) {
            if (saveCopy.characters[characters[i]] == undefined) {
                saveCopy.characters[characters[i]] = game.characters[characters[i]];
            }
        }
        if (saveCopy.chars == undefined) saveCopy.chars = [saveCopy.char1, saveCopy.char2];
        if (saveCopy.characters.skro == undefined) saveCopy.characters.skro = game.characters.skro;
        if (saveCopy.chars.length == 2) saveCopy.chars.push("gau");
        if (saveCopy.chars.length == 3) saveCopy.chars.push("skro");
        if (saveCopy.chars.length == 4) saveCopy.chars.push("kokitozi");
        if (saveCopy.characters.bleu.pos == undefined) {
            saveCopy.characters.bleu.pos = [0, 0];
            saveCopy.characters.corelle.pos = [0, 1];
            saveCopy.characters.gau.pos = [2, 2];
            saveCopy.characters.koki.pos = [2, 1];
        }
        for (i in saveCopy.characters) {
            saveCopy.characters[i].effect = ["none", 0];
        }
        if (saveCopy.time == undefined) saveCopy.time = 0;
        if (saveCopy.playTime == undefined) saveCopy.playTime = 0;
        if (saveCopy.leader == undefined) saveCopy.leader = "bleu";
        if (saveCopy.wrenches == undefined) saveCopy.wrenches = 0;
        if (saveCopy.bricks == undefined) saveCopy.bricks = 0;
        if (saveCopy.inventory == undefined) saveCopy.inventory = { "brickyleaf": 5, "potion": 3 };

        if (saveCopy.characters.bleu.equipment == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].equipment = {
                "head" : "none",
                "body" : "none",
                "lhand" : "none",
                "rhand" : "none",
                "acc1" : "none",
                "acc2" : "none",
                }
            }
        }

        if (saveCopy.characters.bleu.macro == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].macro = "attack";
            }
        }
        if (saveCopy.characters.bleu.magic == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].magic = ["cuyua", "cutema", "fisina"];
            }
        }
        game = saveCopy;

        checkOverMax();
    }
    else {
        saveGame();
    }


}
