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
        quadraticVary: false,

        lifespan: 4,
        life: 0,
        spawnTime: 0,
        spawnTimeTick: 0,
        lifeTickIdle: false,
        dead: false,
        repeatMode: false,
        lifeMode: true,

        alphaChange: 0,
        anchorChange: [0, 0],
        offsetChange: [0, 0],

        onDeath(args) { },
        onClick(args) { },
        onParticleClick(args) { },

        generate(ctx) {
            let avary = this.sizeAnchorVary[0] * Math.random();
            let avary2 = this.sizeAnchorVary[1] * Math.random();
            let ovary = this.sizeOffsetVary[0] * Math.random();
            let ovary2 = this.sizeOffsetVary[1] * Math.random();

            if (this.quadraticVary) {
                avary2 = avary;
                ovary2 = ovary;
            }

            this.p.push([[this.anchor[0] + (this.spreadAnchor[0] * Math.random()), this.anchor[1] + (this.spreadAnchor[1] * Math.random())],
            [this.offset[0] + (1 + (this.spreadOffset[0] * Math.random())), this.offset[1] + (1 + (this.spreadOffset[1] * Math.random()))],
            [this.sizeAnchor[0] * (1 + avary), this.sizeAnchor[1] * (1 + avary2)],
            [this.sizeOffset[0] * (1 + ovary), this.sizeOffset[1] * (1 + ovary2)], 0, this.alpha]);
        },

        render(ctx) {
            if (this.dead) return false;
            this.spawnTimeTick += (delta / 1000);
            if (this.p.length < this.p.amount && this.spawnTime == 0) {
                for (i = 0; i < this.amount; i++) {
                    this.generate(ctx);
                }
            }
            else if (this.spawnTimeTick >= this.spawnTime){
                this.spawnTimeTick = 0;
                this.generate(ctx);
            }

            if (this.life >= this.lifespan && this.lifespan != 0 && !this.lifeMode) {
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
                        this.generate(ctx);
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
                if (this.p[p][4] >= this.lifespan && this.lifespan != 0 && this.lifeMode) {
                    this.onDeath(args);
                    if (this.repeatMode) {
                        this.life = 0;
                        this.generate(ctx);
                    }
                    this.p.pop(p);
                    continue;
                }
                if (this.lifeTickIdle || this.movable) this.p[p][4] += (delta / 1000);

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

                if (this.alphaChange != 0) {
                    this.p[p][5] -= this.alphaChange / delta;
                    if (this.p[p][5] < 0) this.p[p][5] = 0;
                    ctx.globalAlpha = this.p[p][5];
                }

                if (this.anchorChange[0] != 0) this.p[p][2][0] -= Math.max(0, this.anchorChange[0] / delta);
                if (this.anchorChange[1] != 0) this.p[p][2][1] -= Math.max(0, this.anchorChange[1] / delta);
                if (this.offsetChange[0] != 0) this.p[p][3][0] -= Math.max(0, this.offsetChange[0] / delta);
                if (this.offsetChange[1] != 0) this.p[p][3][1] -= Math.max(0, this.offsetChange[1] / delta);

                let w = this.p[p][3][0] / red + this.p[p][2][0] * ctx.canvas.width;
                let h = this.p[p][3][1] / red + this.p[p][2][1] * ctx.canvas.height;

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

const commonParticles = {
    falling: {
        anchor: [0, -0.1], spreadAnchor: [1, 0], sizeOffset: [64, 64], spreadOffset: [0, -256], sizeOffsetVary: [1.5, 1.5], quadraticVary: true,
        type: "img", source: "items/brickyleaf",
        direction: 0, speedAnchor: 0.04,
        direction2: 1, speedOffset2: 10, moveRandom2: 5,
        offsetChange: [3, 3],
        movable: true, movable2: true, lifespan: 80, alpha: 1, amount: 8, spawnTime: 1, alphaChange: 0.04,
        onParticleClick(n) {
            this.p[n][3][0] *= 1.2;
            this.p[n][3][1] *= 1.2;
            this.p[n][4] -= 3;
            this.p[n][5] = 1;
        }
    }
}



function addParticle(type, args = {}) {
    scene.controls.push(new Particles(Object.assign({}, commonParticles[type], args)));
}