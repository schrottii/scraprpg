let controls = {
    base(args) {
        return {
            offset: [0, 0],
            anchor: [0.5, 0.5],
            sizeOffset: [0, 0],
            sizeAnchor: [0, 0],
            clickthrough: false, // this means, if true, you click THROUGH IT (onClick stops working)
            clickstop: true, // this should have been added way earlier... makes it so that no click can be triggered after it (breaks)
            blend: false,
            glow: 0,
            glowColor: "black",

            alpha: 1,

            render(ctx) { },

            onClick(args) { },
            onHold(args) { },

            ...args || {},
        }
    },
    image(args) {
        return {
            ...controls.base(),
            source: null,
            snip: false,
            ri: false,
            rotate: false,
            render(ctx) {
                let red = 1;
                if (isLs() == true && !this.ri) red = 2;
                if (images[this.source] == undefined) {
                    console.log("| ⚠️ | Image undefined: " + this.source);
                    return false;
                }

                let x = this.offset[0] / red + this.anchor[0] * ctx.canvas.width;
                let y = this.offset[1] / red + this.anchor[1] * ctx.canvas.height;

                let w = this.sizeOffset[0] / red + this.sizeAnchor[0] * ctx.canvas.width;
                let h = this.sizeOffset[1] / red + this.sizeAnchor[1] * ctx.canvas.height;

                if (settings.blend) {
                    if (this.blend != false) setBlend(this.blend);
                    else clearBlend();
                }

                if (this.glow != 0 && settings.glow) {
                    ctx.shadowBlur = this.glow;
                    ctx.shadowColor = this.glowColor;
                }

                if (isValid(this.rotate)) {
                    ctx.save();
                    ctx.translate(x + w / 2, y + h / 2);
                    ctx.rotate(this.rotate * Math.PI / 180);

                    if (w > 0 && h > 0 && this.snip != false) {
                        ctx.drawImage(images[this.source],
                            this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                            -w / 2, -h / 2, w, h);
                    } else if (w > 0 && h > 0) {
                        ctx.drawImage(images[this.source],
                            -w / 2, -h / 2, w, h);
                    } else {
                        ctx.drawImage(images[this.source],
                            -w / 2, -h / 2);
                    }

                    ctx.restore();
                }
                else {
                    if (w > 0 && h > 0 && this.snip != false) ctx.drawImage(images[this.source],
                        this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                        x,
                        y, w, h);
                    else if (w > 0 && h > 0) ctx.drawImage(images[this.source],
                        x,
                        y, w, h);
                    else ctx.drawImage(images[this.source],
                        x,
                        y);
                }

                if (this.glow && settings.glow) ctx.shadowBlur = 0;
            },
            ...args || {},
        }
    },
    rect(args) {
        return {
            ...controls.base(),
            fill: "#000000",
            render(ctx) {

                let red = 1;
                if (isLs() == true) red = 2;

                let w = this.sizeOffset[0] / red + this.sizeAnchor[0] * ctx.canvas.width;
                let h = this.sizeOffset[1] / red + this.sizeAnchor[1] * ctx.canvas.height;

                if (this.blend != false) setBlend(this.blend);
                else clearBlend();

                ctx.fillStyle = this.fill;

                if (w > 0 && h > 0) ctx.fillRect(
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height, w, h);

            },
            ...args || {},
        }
    },
    label(args) {
        return {
            ...controls.base(),
            text: "Sample Text",
            fill: "white",
            font: "DePixelKlein",
            fontSize: 30,
            fontAnchor: false,
            align: "center",
            baseline: "middle",
            outline: "none",
            outlineSize: 0,
            outlineAnchor: false,
            render(ctx) {
                ctx.fillStyle = this.fill;
                ctx.textAlign = this.align;
                ctx.textBaseline = this.baseline;

                let red = 1;
                if (isLs() == true) red = 2;

                // fontSize - size in pixels
                // fontAnchor - size relative to the screen size, like sizeAnchor for rects, buttons, etc.
                // fontAnchor is OPTIONAL! If you use it, fontSize will be ignored. If not, fontSize will be used.
                // Same thing with outlineAnchor.

                if (this.fontAnchor == false) ctx.font = (this.fontSize / red) + "px " + this.font + ", sans-serif";
                else ctx.font = Math.ceil((this.fontAnchor * ctx.canvas.width) / red) + "px " + this.font + ", sans-serif";

                if (this.blend != false) setBlend(this.blend);
                else clearBlend();

                if (this.outline != "none") {
                    ctx.strokeStyle = this.outline;
                    if (this.outlineAnchor == false) ctx.lineWidth = this.outlineSize / red;
                    else ctx.lineWidth = (this.outlineAnchor * ctx.canvas.width) / red;
                    ctx.strokeText(this.text,
                        this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / red + this.anchor[1] * ctx.canvas.height);
                }
                ctx.fillText(this.text,
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height);

            },
            ...args || {},
        }
    },
    button(args) {
        return {
            ...controls.base(),
            text: "Sample Text",
            font: "DePixelKlein",
            fillTop: colors.buttontop,
            fillBottom: colors.buttonbottom,
            isPressed: false,
            pressedTop: colors.buttontoppressed,
            pressedBottom: colors.buttonbottompressed,
            fillText: "black",
            fontSize: 30,
            render(ctx) {
                let x, y, w, h;

                let red = 1;
                if (isLs() == true) red = 2;

                x = this.offset[0] / red + this.anchor[0] * ctx.canvas.width;
                y = this.offset[1] / red + this.anchor[1] * ctx.canvas.height;
                w = this.sizeOffset[0] / red + this.sizeAnchor[0] * ctx.canvas.width;
                h = this.sizeOffset[1] / red + this.sizeAnchor[1] * ctx.canvas.height;

                if (this.blend != false) setBlend(this.blend);
                else clearBlend();

                if (this.isPressed) ctx.fillStyle = this.pressedTop;
                else ctx.fillStyle = this.fillTop;
                ctx.fillRect(x, y, w, h / 2 + 0.25);

                if (this.isPressed) ctx.fillStyle = this.pressedBottom;
                else ctx.fillStyle = this.fillBottom;
                ctx.fillRect(x, y + h / 2, w, h / 2);

                ctx.font = (this.fontSize / red) + "px " + this.font + ", sans-serif";
                ctx.fillStyle = this.fillText;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, x + w / 2, y + h / 2, w);
            },
            ...args || {},
        }
    },
}



// pointer handlers
function onCanvasPointerDown(e) {
    isHolding = true;

    pointerActive = true;
    pointerPos = [e.clientX, e.clientY];

    let canDowned;

    // check onDown for all, go in inverse order (foreground first)
    for (let a = scene.controls.length - 1; a >= 0; a--) {
        canDowned = true;
        if (scene.controls[a].fillTop == undefined && scene.controls[a].isPressed == undefined) canDowned = false;

        let con = scene.controls[a];
        if (con == undefined) return;
        let offsetX, offsetY, sizeX, sizeY;
        let red = 1;
        if (isLs() && !scene.controls[a].ri) red = 2;
        if (con.offset == undefined) console.trace();

        offsetX = con.offset[0] / red + con.anchor[0] * mainCanvas.width;
        offsetY = con.offset[1] / red + con.anchor[1] * mainCanvas.height;
        sizeX = con.sizeOffset[0] / red + con.sizeAnchor[0] * mainCanvas.width;
        sizeY = con.sizeOffset[1] / red + con.sizeAnchor[1] * mainCanvas.height;

        // Make buttons go pressed color
        if (!scene.controls[a].clickthrough &&
            pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
            pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY) {
            if (canDowned) scene.controls[a].isPressed = true;

            if (scene.controls[a].onDown) scene.controls[a].onDown();
            if (scene.controls[a] != undefined && scene.controls[a].alpha > 0 && scene.controls[a].clickstop == true) return;
        }
        else if (canDowned) {
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

    // check onClick and onHold for all, go in inverse order (foreground first)
    for (let a = scene.controls.length - 1; a >= 0; a--) {
        let con = scene.controls[a];
        if (con == undefined) return;

        // calculations
        let offsetX, offsetY, sizeX, sizeY
        let red = 1;
        if (isLs() && !scene.controls[a].ri) red = 2;
        if (con.offset == undefined) console.trace();

        offsetX = con.offset[0] / red + con.anchor[0] * mainCanvas.width;
        offsetY = con.offset[1] / red + con.anchor[1] * mainCanvas.height;
        sizeX = con.sizeOffset[0] / red + con.sizeAnchor[0] * mainCanvas.width;
        sizeY = con.sizeOffset[1] / red + con.sizeAnchor[1] * mainCanvas.height;

        // Makes button go unpressed color after you stop clicking it, without this you'd have to click somewhere else to "unclick" it
        if (scene.controls[a].fillTop != undefined) scene.controls[a].isPressed = false;

        // handle the events on a click
        if (!con.clickthrough &&
            pointerPos[0] >= offsetX && pointerPos[0] < offsetX + sizeX &&
            pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY) {
            // triggers the click
            if (keepHold) {
                if (scene.controls[a].onHold) scene.controls[a].onHold();
            }
            else {
                if (scene.controls[a].onClick) scene.controls[a].onClick();
            }
            if (scene.controls[a] != undefined && scene.controls[a].alpha > 0 && scene.controls[a].clickstop == true) return;
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
                        pointerPos[1] >= offsetY && pointerPos[1] < offsetY + sizeY) {
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