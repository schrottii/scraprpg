function init() {
    mainCanvas.addEventListener("mouseup", onCanvasClick);


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
            controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                clickthrough: true,
                onClick() { 
                    setScene(scenes.title());
                }
            })
        ],
    });
    loadAllResources();
    loop();
}

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
    delta = Date.now() - time;
    time = Date.now();

    mainCanvas.style.width = (mainCanvas.width = window.innerWidth) + "px";
    mainCanvas.style.height = (mainCanvas.height = window.innerHeight) + "px";

    let ctx = mainCanvas.getContext("2d");
    scene.preRender(ctx, delta);
    for (let control of scene.controls) {
        control.render(ctx);
    }
    ctx.font = "12px NotoSans, sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText((1000 / delta).toFixed(0) + "fps " + delta + "ms", 2, 12);

    updateAnimators(delta);

    requestAnimationFrame(loop);
}