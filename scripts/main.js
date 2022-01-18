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
        ],
    });
    loadAllResources();
    loop();
}

var currentKeys = {};

function onCanvasClick(e) {
    for (let a = scene.controls.length - 1; a >= 0; a--) {
        let con = scene.controls[a];
        let mouseX = e.clientX;
        let mouseY = e.clientY;
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

function loop() {
    // Tick time
    delta = Date.now() - time;
    time = Date.now();

    // Resize the canvas
    mainCanvas.style.width = (mainCanvas.width = window.innerWidth) + "px";
    mainCanvas.style.height = (mainCanvas.height = window.innerHeight) + "px";

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
    ctx.fillText((1000 / delta).toFixed(0) + "fps " + delta + "ms", 2, 12);

    updateAnimators(delta);

    requestAnimationFrame(loop);
}