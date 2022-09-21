/* Particles by Schrottii */


function Particles(args) {
    return {
        ...controls.base(), // offset, anchor, sizeOffset, sizeAnchor, clickthrough, blend, alpha

        /* Position, size and basic appearance stuff
        anchor: pos in screen
        offset: pos in pixels
        sizeAnchor: size in screen
        sizeOffset: size in pixels
        clickthrough: ?
        blend: blend effect
        alpha: opacity (0 - 1)
        */

        // Image particle stuff
        type: "rect", // rect or img
        source: false,
        snip: false,

        fill: "none",

        movable: false,
        direction: 0,// 0 Down, 1 Left, 2 Right, 3 Up
        speedAnchor: 0,
        speedOffset: 0,
        speedMulti: 1,
        moveRandom: 0, // higher = more random
        acc: 1,

        movable2: false, // 2 directions
        direction2: 0,// 0 Down, 1 Left, 2 Right, 3 Up
        speedAnchor2: 0,
        speedOffset2: 0,
        speedMulti2: 1,
        moveRandom2: 0, // higher = more random
        acc2: 1,

        amount: 1,
        p: [],
        spreadAnchor: [0, 0],
        spreadOffset: [0, 0],
        sizeAnchorVary: [0, 0],
        sizeOffsetVary: [0, 0],

        lifespan: 4,
        life: 0,
        lifeTickIdle: false,
        dead: false,
        repeatMode: false,

        onDeath(args) { },

        render(ctx) {
            if (this.dead) return false;
            if (this.p.length == 0) {
                for (i = 0; i < this.amount; i++) {
                    this.p.push([[this.anchor[0] + (this.spreadAnchor[0] * Math.random()), this.anchor[1] + (this.spreadAnchor[1] * Math.random())],
                        [this.offset[0] + (1 + (this.spreadOffset[0] * Math.random())), this.offset[1] + (1 + (this.spreadOffset[1] * Math.random()))],
                        [this.sizeAnchor[0] * (1 + (this.sizeAnchorVary[0] * Math.random())), this.sizeAnchor[1] * (1 + (this.sizeAnchorVary[1] * Math.random()))],
                        [this.sizeOffset[0] * (1 + (this.sizeOffsetVary[0] * Math.random())), this.sizeOffset[1] * (1 + (this.sizeOffsetVary[1] * Math.random()))]]);
                }
            }

            if (this.life >= this.lifespan && this.lifespan != 0) {
                if(!this.repeatMode) this.dead = true;
                this.onDeath(args);
                if (this.repeatMode) {
                    this.life = 0;
                    let red = 1;
                    if (isLs() == true) red = 2;
                    for (p in this.p) {
                        let w = this.p[p][3][0] / red + this.p[p][2][0] * ctx.canvas.width;
                        let h = this.p[p][3][1] / red + this.p[p][2][1] * ctx.canvas.height;

                        if (w < 0 || h < 0) this.p.pop(p);
                    }
                    for (i = 0; i < this.amount; i++) {
                        this.p.push([[this.anchor[0] + (this.spreadAnchor[0] * Math.random()), this.anchor[1] + (this.spreadAnchor[1] * Math.random())],
                        [this.offset[0] + (1 + (this.spreadOffset[0] * Math.random())), this.offset[1] + (1 + (this.spreadOffset[1] * Math.random()))],
                        [this.sizeAnchor[0] * (1 + (this.sizeAnchorVary[0] * Math.random())), this.sizeAnchor[1] * (1 + (this.sizeAnchorVary[1] * Math.random()))],
                        [this.sizeOffset[0] * (1 + (this.sizeOffsetVary[0] * Math.random())), this.sizeOffset[1] * (1 + (this.sizeOffsetVary[1] * Math.random()))]]);
                    }
                }
            }
            if(this.lifeTickIdle || this.movable) this.life += (delta / 1000);

            let red = 1;
            if (isLs() == true) red = 2;

            if (this.blend != false) setBlend(this.blend);
            else clearBlend();

            if (this.movable) if (this.acc != 1) this.acc = this.acc + (0.1 * this.acc / delta);
            if (this.movable2) if (this.acc2 != 1) this.acc2 = this.acc2 + (0.1 * this.acc2 / delta);

            if (this.fill != "none") ctx.fillStyle = this.fill;

            for (p in this.p) {
                let w = this.p[p][3][0] / red + this.p[p][2][0] * ctx.canvas.width;
                let h = this.p[p][3][1] / red + this.p[p][2][1] * ctx.canvas.height;

                // Move
                if (this.movable) {

                    let rndm = 1;
                    if (this.moveRandom > 0) {
                        if (Math.random() > 0.499) rndm = this.moveRandom * Math.random();
                        else rndm = -1 * this.moveRandom * Math.random();
                    }
                    switch (this.direction) {
                        case 0: // Down
                            this.p[p][0][1] += (this.speedAnchor * rndm / delta) * this.speedMulti * this.acc;
                            this.p[p][1][1] += (this.speedOffset * rndm / delta) * this.speedMulti * this.acc;
                            break;
                        case 1: // Left
                            this.p[p][0][0] -= (this.speedAnchor * rndm / delta) * this.speedMulti * this.acc;
                            this.p[p][1][0] -= (this.speedOffset * rndm / delta) * this.speedMulti * this.acc;
                            break;
                        case 2: // Right
                            this.p[p][0][0] += (this.speedAnchor * rndm / delta) * this.speedMulti * this.acc;
                            this.p[p][1][0] += (this.speedOffset * rndm / delta) * this.speedMulti * this.acc;
                            break;
                        case 3: // Up
                            this.p[p][0][1] -= (this.speedAnchor * rndm / delta) * this.speedMulti * this.acc;
                            this.p[p][1][1] -= (this.speedOffset * rndm / delta) * this.speedMulti * this.acc;
                            break;

                    }
                }
                if (this.movable2) {
                    let rndm = 1;
                    if (this.moveRandom2 > 0) {
                        if (Math.random() > 0.499) rndm = this.moveRandom2 * Math.random();
                        else rndm = -1 * this.moveRandom2 * Math.random();
                    }
                    switch (this.direction2) {
                        case 0: // Down
                            this.p[p][0][1] += (this.speedAnchor2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            this.p[p][1][1] += (this.speedOffset2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            break;
                        case 1: // Left
                            this.p[p][0][0] -= (this.speedAnchor2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            this.p[p][1][0] -= (this.speedOffset2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            break;
                        case 2: // Right
                            this.p[p][0][0] += (this.speedAnchor2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            this.p[p][1][0] += (this.speedOffset2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            break;
                        case 3: // Up
                            this.p[p][0][1] -= (this.speedAnchor2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            this.p[p][1][1] -= (this.speedOffset2 * rndm / delta) * this.speedMulti2 * this.acc2;
                            break;

                    }
                }

                // Show me
                if (this.type == "rect") {
                    ctx.fillRect(
                        this.p[p][1][0] / red + this.p[p][0][0] * ctx.canvas.width,
                        this.p[p][1][1] / red + this.p[p][0][1] * ctx.canvas.height, w, h);

                }
                if (this.type == "img") {
                    if (w > 0 && h > 0 && this.snip != false) ctx.drawImage(images[this.source],
                        this.snip[0], this.snip[1], this.snip[2], this.snip[3],
                        this.p[p][1][0] / red + this.p[p][0][0] * ctx.canvas.width,
                        this.p[p][1][1] / red + this.p[p][0][1] * ctx.canvas.height, w, h);
                    else if (w > 0 && h > 0) ctx.drawImage(images[this.source],
                        this.p[p][1][0] / red + this.p[p][0][0] * ctx.canvas.width,
                        this.p[p][1][1] / red + this.p[p][0][1] * ctx.canvas.height, w, h);
                    else ctx.drawImage(images[this.source],
                        this.p[p][1][0] / red + this.p[p][0][0] * ctx.canvas.width,
                        this.p[p][1][1] / red + this.p[p][0][1] * ctx.canvas.height);
                }
            }
        },
        ...args || {},
    }
}