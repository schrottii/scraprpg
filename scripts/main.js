var currentKeys = {};
var autoSaveTime = 0;
var canMove = true;
var isMapTestingMode = false;

var textProgress = -1;
var isHolding = false;

var playAfterIntro = "none";
var globalSelectedCharacter = "";

let pointerActive = false;
let pointerPos = [0, 0];

let delta = 0;
let time = Date.now();

var animationtime = -1;
var animation;
var animationspeed = 100;

let scale = 1080 / 16;// window.innerHeight / 16;
let width = 1920 / scale;// window.innerWidth / scale;

// electron
if (document == undefined) {
    const { app, BrowserWindow } = require('electron');

    const createWindow = () => {
        const win = new BrowserWindow({
            width: 1920,
            height: 1080,
            icon: "data/images/ico.ico",
        })

        win.setMenuBarVisibility(false);
        win.loadFile('index.html');
    }

    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
    /*
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    */
}

// init
function init() {
    // Button detection
    mainCanvas.addEventListener("pointerdown", onCanvasPointerDown);
    mainCanvas.addEventListener("pointermove", onCanvasPointerMove);
    mainCanvas.addEventListener("pointerup", onCanvasPointerUp);
    window.addEventListener("keydown", (e) => currentKeys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", (e) => currentKeys[e.key.toLowerCase()] = false);



    // the load scene
    setScene({
        // Pre-render function
        preRender(ctx, delta) {
            if (scene.controls[4].alpha == 1) scene.controls[3].onClick();
        },
        controls: [
            // BG
            controls.rect({
                anchor: [0, 0], sizeAnchor: [1, 1],
                fill: "rgb(0, 0, 0)"
            }),

            controls.label({
                anchor: [0.02, 0.9], offset: [5, -12],
                align: "left", baseline: "alphabetic", fontSize: 32,
                text: "",
            }),
            controls.label({
                anchor: [0.98, .98], offset: [-5, -12],
                align: "right", baseline: "alphabetic", fontSize: 32, fill: "#7f7f7f",
                text: "",
            }),

            controls.rect({
                anchor: [0, 0], sizeAnchor: [1, 1],
                clickthrough: true, alpha: 0,
                onClick() {
                    musicPlayer.loop = true;
                    setScene(scenes.pretitle());
                }
            }),

            controls.label({
                anchor: [0.5, 0.5],
                align: "center", baseline: "alphabetic", fontSize: 16, fill: "white",
                text: "Press A to start", alpha: 0,
            }),

            // loading bar
            controls.rect({
                anchor: [0.2, 0.4], sizeAnchor: [0.6, 0.2],
                fill: "rgb(0, 37, 6)"
            }),
            controls.rect({
                anchor: [0.22, 0.42], sizeAnchor: [0.56, 0.16],
                fill: "rgb(13, 62, 21)"
            }),
            controls.rect({
                anchor: [0.22, 0.42], sizeAnchor: [0.56, 0.16],
                fill: "rgb(113, 255, 42)"
            }),

        ],
        name: "main"
    });
    loadAllResources();
    defFilter();
    loop();
}

// pointer handlers
function onCanvasPointerDown(e) {
    isHolding = true;

    pointerActive = true;
    pointerPos = [e.clientX, e.clientY];
    for (let a = scene.controls.length - 1; a >= 0; a--) {

        if (scene.controls[a].fillTop == undefined && scene.controls[a].isPressed == undefined) continue;

        let con = scene.controls[a];
        if (con == undefined) return;
        let offsetX, offsetY, sizeX, sizeY;
        let red = 1;
        //if (con.offset == undefined) console.trace();

        if (isLs() && !scene.controls[a].ri) red = 2;

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

    if (isHolding && scene.name == "mapmaker") {
        onCanvasPointerUp(e, true);
    }
}

function onCanvasPointerUp(e, keepHold = false) {
    if (!keepHold) isHolding = false;

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

        if (isLs() && !scene.controls[a].ri) red = 2;

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
            (keepHold ? scene.controls[a].onHold() : scene.controls[a].onClick())) { // triggers the click
            return;
        }
        else {
            // particles
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

// FUNCTIONS
function isLs() {
    // Somewhat
    if (scale < 32) return true;
    return false;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isValid(vVar) {
    // is this var valid? 
    return vVar != undefined && vVar != null && vVar != "" && vVar != false;
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

    // this sets ctx to the canvas, just the usual stuff
    let ctx = mainCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;

    // pre-render the canvas (big one)
    scene.preRender(ctx, delta);

    // Render every element that exists (Buttons, labels, images, everything)
    for (let control of scene.controls) {
        if (control.alpha > 0 && (control.lifeMode == undefined || settings.particles)) { // If their alpha is above 0, "draw" them, with their alpha value
            // Alpha 1 = Max (100% opacity)
            // Alpha 0.1 = Barely visible              Alpha 0 = Invisible
            // Alpha 255 (or anything above 1 really) does not work anymore!
            ctx.globalAlpha = control.alpha;
            control.render(ctx);
        }
    }

    introToLoop();

    // Debug black bar
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width * ((game.stats.playTime / 15) % 1) * 0.1, ctx.canvas.height * 0.01);

    // Draw FPS
    ctx.fillStyle = "white";
    ctx.font = "12px DePixelKlein, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.globalAlpha = 1; //or else it's a bit transparent
    ctx.fillText((1000 / delta).toFixed(0) + "fps   | w: " + width.toFixed(1) + "  scale: " + scale.toFixed(1) + "   h: " + height + (isLs() ? "  ls" : "  p"), 2, 12);

    // Auto Save
    if (settings != undefined) {
        if (settings.autosave == true) {
            autoSaveTime += delta;
        }
    }

    updateImageAnimation(delta);
    updateAnimators(delta);
    timeTicker(delta);

    requestAnimationFrame(loop);
}

// main end