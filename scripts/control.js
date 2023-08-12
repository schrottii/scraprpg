let controls = {
    base(args) {
        return {
            offset: [0, 0],
            anchor: [0.5, 0.5],
            sizeOffset: [0, 0],
            sizeAnchor: [0, 0],
            clickthrough: false,
            blend: false,
            glow: 0,
            glowColor: "black",

            alpha: 1,

            render(ctx) { },

            onClick(args) { },

            ...args || {},
        }
    },
    image(args) {
        return {
            ...controls.base(),
            source: null,
            snip: false,
            ri: false,
            render(ctx) {
                let red = 1;
                if (isLs() == true && !this.ri) red = 2;

                let w = this.sizeOffset[0] / red + this.sizeAnchor[0] * ctx.canvas.width;
                let h = this.sizeOffset[1] / red + this.sizeAnchor[1] * ctx.canvas.height;

                if (this.blend != false) setBlend(this.blend);
                else clearBlend();

                if (this.glow != 0) {
                    ctx.shadowBlur = this.glow;
                    ctx.shadowColor = this.glowColor;
                }

                if (w > 0 && h > 0 && this.snip != false) ctx.drawImage(images[this.source],
                    this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height, w, h);
                else if (w > 0 && h > 0) ctx.drawImage(images[this.source],
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height, w, h);
                else ctx.drawImage(images[this.source],
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height);

                if (this.glow) ctx.shadowBlur = 0;
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
                else ctx.fillRect(
                    this.offset[0] / red + this.anchor[0] * ctx.canvas.width,
                    this.offset[1] / red + this.anchor[1] * ctx.canvas.height);

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
            pmSetting: false,
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

                if(this.isPressed) ctx.fillStyle = this.pressedTop;
                else ctx.fillStyle = this.fillTop;
                ctx.fillRect(x, y, w, h / 2 + 0.25);

                if(this.isPressed) ctx.fillStyle = this.pressedBottom;
                else ctx.fillStyle = this.fillBottom;
                ctx.fillRect(x, y + h / 2, w, h / 2);

                ctx.font = (this.fontSize / red) + "px " + this.font + ", sans-serif";
                ctx.fillStyle = this.fillText;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, x + w / 2, y + h / 2, w);
                /*
                if (this.pmSetting) {
                    // pm = plus minus + -

                    x = this.offset[0] / red + this.anchor[0] * ctx.canvas.width - (0.05 * ctx.canvas.width);
                    w = w / 5;

                    if (this.isPressed) ctx.fillStyle = this.pressedTop;
                    else ctx.fillStyle = this.fillTop;
                    ctx.fillRect(x, y, w, h / 2 + 0.25);

                    if (this.isPressed) ctx.fillStyle = this.pressedBottom;
                    else ctx.fillStyle = this.fillBottom;
                    ctx.fillRect(x, y + h / 2, w, h / 2);

                    ctx.fillStyle = this.fillText;
                    ctx.fillText("-", x + w / 2, y + h / 2, w);



                    x = this.offset[0] / red + this.anchor[0] * ctx.canvas.width + (0.05 * ctx.canvas.width);

                    if (this.isPressed) ctx.fillStyle = this.pressedTop;
                    else ctx.fillStyle = this.fillTop;
                    ctx.fillRect(x, y, w, h / 2 + 0.25);

                    if (this.isPressed) ctx.fillStyle = this.pressedBottom;
                    else ctx.fillStyle = this.fillBottom;
                    ctx.fillRect(x, y + h / 2, w, h / 2);

                    ctx.fillStyle = this.fillText;
                    ctx.fillText("+", x + w / 2, y + h / 2, w);
                }*/
            },
            ...args || {},
        }
    },
}
