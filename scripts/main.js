function init() {
    // Button detection
    mainCanvas.addEventListener("mouseup", onCanvasClick);
    window.addEventListener("keydown", (e) => currentKeys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", (e) => currentKeys[e.key.toLowerCase()] = false);

    setScene({
        controls: [
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
            controls.button({
                anchor: [.5, .5], offset: [-100, -55], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Start with Sound",
                onClick() { 
                    setScene(scenes.title());
                }
            }),
            controls.button({
                anchor: [.5, .5], offset: [-100, 5], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Start Muted",
                onClick() {
                    musicPlayer.muted = true;
                    setScene(scenes.title());
                }
            }),
            controls.button({
                anchor: [.5, .5], offset: [-100, 65], sizeOffset: [200, 50],
                clickthrough: true, fontSize: 16, alpha: 0,
                text: "Dev Mode",
                onClick() {
                    musicPlayer.muted = true;
                    loadGame(0);
                    setScene(scenes.fight());
                }
            }),
        ],
    });
    loadAllResources();
    loop();
}

var currentKeys = {};
var autoSaveTime = 0;
var moveEnemiesTime = 0;

var canMove = true;

function onCanvasClick(e) {
    for (let a = scene.controls.length - 1; a >= 0; a--) {
        let con = scene.controls[a];
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        //console.log("   X: " + mouseX + " Y: " + mouseY);

        // offset - Get the position where the element starts. size - How big. Combine them to define the clickable area!
        let offsetX = con.offset[0] + con.anchor[0] * mainCanvas.width;
        let offsetY = con.offset[1] + con.anchor[1] * mainCanvas.height;
        let sizeX = con.sizeOffset[0] + con.sizeAnchor[0] * mainCanvas.width;
        let sizeY = con.sizeOffset[1] + con.sizeAnchor[1] * mainCanvas.height;

        if (!scene.controls[a].clickthrough && scene.controls[a].onClick && 
            mouseX >= offsetX && mouseX < offsetX + sizeX && 
            mouseY >= offsetY && mouseY < offsetY + sizeY && 
            scene.controls[a].onClick()) return;
    }
}


let delta = 0;
let time = Date.now();

var animationtime = -1;
var animation;
var animationspeed = 100;

let scale = window.innerHeight / 16;
let width = window.innerWidth / scale;

function image_animation(image, pos, speed=100) {
    animationtime = 0;
    animation = [image, pos];
    animationspeed = speed;
    canMove = false;
    let ctx = mainCanvas.getContext("2d");
    for (i = 0; i < pos.length / 4; i++) {
        setTimeout(() => { ctx.drawImage(image, pos[i], pos[i+1], pos[i+2], pos[i+3], 0, 0, width, scale); }, i * 100);
    }
}

function getPlayer(character=1) {
    if (character == 2) {
        return game.characters[game.char2];
    }
    return game.characters[game.char1];
}

function isMobile() {
    // Somewhat
    if (width < 24) return true;
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

    let ctx = mainCanvas.getContext("2d");
    ctx.globalAlpha = 1;
    scene.preRender(ctx, delta);
    for (let control of scene.controls) {
        if (control.alpha > 0) {
            ctx.globalAlpha = control.alpha;
            control.render(ctx);
        }
    }
    ctx.globalAlpha = 1;

    // Draw FPS
    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText((1000 / delta).toFixed(0) + "fps " + delta + "ms  | w: " + width + "  scale: " + scale + "   h: " + height + " mob: " + isMobile(), 2, 12);

    // Auto Save
    if (autoSaveTime > -1) {
        autoSaveTime += delta;
    }

    if (animationtime > -1) {
        let i = Math.floor(animationtime / animationspeed)*4;
        if (animation[1][i + 3] != undefined) {
            ctx.drawImage(animation[0], animation[1][i], animation[1][i + 1], animation[1][i + 2], animation[1][i + 3], 0, 0, width * scale, height);
            animationtime += delta;
        }
        else {
            // Finished
            canMove = true;
            animationtime = -1;
        }
    }

    moveEnemiesTime += delta;

    updateAnimators(delta);

    requestAnimationFrame(loop);
}

// I copied these almost 1:1 from legacy.
// Got a problem with that? Huh?

var saveNR = 0;

function load(x, altx) {
    return x !== undefined ? x : altx;
}

function saveGame() {
    let saveCopy = JSON.parse(JSON.stringify(game));
    localStorage.setItem("SRPG" + saveNR, JSON.stringify(saveCopy));
}

function loadGame() {
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

        game = saveCopy;
    }
    else {
        saveGame();
    }
}