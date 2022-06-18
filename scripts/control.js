let controls = {
    base(args) {
        return {
            offset: [0, 0],
            anchor: [0.5, 0.5],
            sizeOffset: [0, 0],
            sizeAnchor: [0, 0],
            clickthrough: false,

            alpha: 1,

            render(ctx) {},

            onClick(args) {},
    
            ...args || {},
        }
    },
    image(args) {
        return {
            ...controls.base(),
            source: null,
            snip: false,
            render(ctx) {
                if (isLs() == true) {
                    let w = this.sizeOffset[0] / 2 + this.sizeAnchor[0] * ctx.canvas.width;
                    let h = this.sizeOffset[1] / 2+ this.sizeAnchor[1] * ctx.canvas.height;

                    if (w > 0 && h > 0 && this.snip != false) ctx.drawImage(images[this.source],
                        this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height, w, h);
                    else if (w > 0 && h > 0) ctx.drawImage(images[this.source],
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height, w, h);
                    else ctx.drawImage(images[this.source],
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height);
                }
                else {
                    let w = this.sizeOffset[0] + this.sizeAnchor[0] * ctx.canvas.width;
                    let h = this.sizeOffset[1] + this.sizeAnchor[1] * ctx.canvas.height;

                    if (w > 0 && h > 0 && this.snip != false) ctx.drawImage(images[this.source],
                        this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height, w, h);
                    else if (w > 0 && h > 0) ctx.drawImage(images[this.source],
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height, w, h);
                    else ctx.drawImage(images[this.source],
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height);
                }
            },
            ...args || {},
        }
    },
    rect(args) {
        return {
            ...controls.base(),
            fill: "#000000",
            render(ctx) {

                if (isLs() == true) {
                    let w = this.sizeOffset[0] / 2 + this.sizeAnchor[0] * ctx.canvas.width;
                    let h = this.sizeOffset[1] / 2 + this.sizeAnchor[1] * ctx.canvas.height;

                    ctx.fillStyle = this.fill;

                    if (w > 0 && h > 0) ctx.fillRect(
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height, w, h);
                    else ctx.fillRect(
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height);
                }
                else {
                    let w = this.sizeOffset[0] + this.sizeAnchor[0] * ctx.canvas.width;
                    let h = this.sizeOffset[1] + this.sizeAnchor[1] * ctx.canvas.height;

                    ctx.fillStyle = this.fill;

                    if (w > 0 && h > 0) ctx.fillRect(
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height, w, h);
                    else ctx.fillRect(
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height);
                }
            },
            ...args || {},
        }
    },
    label(args) {
        return {
            ...controls.base(),
            text: "Sample Text",
            fill: "white",
            fontSize: 30,
            align: "center",
            baseline: "middle",
            outline: "none",
            outlineSize: 0,
            render(ctx) {
                ctx.fillStyle = this.fill;
                ctx.textAlign = this.align;
                ctx.textBaseline = this.baseline;
                if (isLs() == true) {
                    ctx.font = (this.fontSize / 2) + "px NotoSans, sans-serif";
                    if (this.outline != "none") {
                        ctx.strokeStyle = this.outline;
                        ctx.lineWidth = this.outlineSize;
                        ctx.strokeText(this.text,
                            this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                            this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height);
                    ctx.fillText(this.text,
                        this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height);
                    }
                }
                else {
                    ctx.font = this.fontSize + "px NotoSans, sans-serif";
                    if (this.outline != "none") {
                        ctx.strokeStyle = this.outline;
                        ctx.lineWidth = this.outlineSize;
                        ctx.strokeText(this.text,
                            this.offset[0] + this.anchor[0] * ctx.canvas.width,
                            this.offset[1] + this.anchor[1] * ctx.canvas.height);
                    }
                    ctx.fillText(this.text,
                        this.offset[0] + this.anchor[0] * ctx.canvas.width,
                        this.offset[1] + this.anchor[1] * ctx.canvas.height);
                }
            },
            ...args || {},
        }
    },
    button(args) {
        return {
            ...controls.base(),
            text: "Sample Text",
            fillTop: "#d49f52",
            fillBottom: "#b58542",
            fillText: "black",
            fontSize: 30,
            render(ctx) {

                let x, y, w, h;
                if (isLs() == true) {
                    x = this.offset[0] / 2 + this.anchor[0] * ctx.canvas.width;
                    y = this.offset[1] / 2 + this.anchor[1] * ctx.canvas.height;
                    w = this.sizeOffset[0] / 2 + this.sizeAnchor[0] * ctx.canvas.width;
                    h = this.sizeOffset[1] / 2 + this.sizeAnchor[1] * ctx.canvas.height;
                }
                else {
                    x = this.offset[0] + this.anchor[0] * ctx.canvas.width;
                    y = this.offset[1] + this.anchor[1] * ctx.canvas.height;
                    w = this.sizeOffset[0] + this.sizeAnchor[0] * ctx.canvas.width;
                    h = this.sizeOffset[1] + this.sizeAnchor[1] * ctx.canvas.height;
                }

                ctx.fillStyle = this.fillTop;
                ctx.fillRect(x, y, w, h / 2 + 0.25);
                ctx.fillStyle = this.fillBottom;
                ctx.fillRect(x, y + h / 2, w, h / 2);

                if (isLs() == false) ctx.font = this.fontSize + "px NotoSans, sans-serif";
                if (isLs() == true) ctx.font = (this.fontSize / 2) + "px NotoSans, sans-serif";
                ctx.fillStyle = this.fillText;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, x + w / 2, y + h / 2, w);
            },
            ...args || {},
        }
    },
}