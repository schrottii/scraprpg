scenes.mapmaker = () => {

    var activenpcs = [];
    var currentMap = "test";
    var map = maps[currentMap];

    game.position = [4, 4];

    function loadNPCs() {
        activenpcs = [];
        for (i in Object.keys(npcs)) {
            j = Object.keys(npcs)[i];
            let npc = npcs[j]();
            if (npc.alpha > 0 && npc.map == currentMap) {
                activenpcs.push(npcs[j]());
            }
        }
    }

    let backButton = controls.button({
        anchor: [0.02, 0.925], sizeAnchor: [0.05, 0.045],
        text: "<",
        onClick(args) {
            setScene(scenes.pretitle());
        },
        alpha: 1,
    });

    let currentMapText = controls.label({
        anchor: [0.075, 0.95],
        text: "ERROR",
        align: "left", fontSize: 32, fill: "black",
        alpha: 1,
    });

    loadNPCs();
    fadeIn(250, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;

            currentMapText.text = "Current Map: " + currentMap;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;

            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;

            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.map[y] && map.map[y][(x * 4) + 2]) {
                    ctx.drawImage(images["tiles/" + getTile(map, x, y).sprite],
                        ((zoom * scale) * (x - ofsX)) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                } else if (map.tiles.empty) {
                    ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                        (zoom * scale) * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), (zoom * scale) * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                }
            }
            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapbg2[y] && map.mapbg2[y][(x * 4) + 2]) {
                    if (map.mapbg2[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 2).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale + 1, zoom * scale + 1);
                    }
                }
            }

            if (map.items != undefined) {
                for (let item of map.items) {
                    if (item[4] == true) {
                        if (images["items/" + items[item[2]]().source] != undefined) ctx.drawImage(images["items/" + items[item[2]]().source],
                            ((zoom * scale) * (item[0] + kofs[0] * kofs[2] - (game.position[0] - width / 2 + 0.5))) - ((zoom - 1) * scale * (width / 2)),
                            (zoom * scale) * (item[1] + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                            zoom * scale, zoom * scale)
                    }
                }
            }

            let wm = 1;

            if (map.worldmode == true) {
                wm = 2;
            }
            zswm = (zoom * scale) / wm;

            for (i in activenpcs) {
                if (activenpcs[i].alpha > 0) {
                    ctx.globalAlpha = activenpcs[i].alpha;
                    activenpcs[i].render(ctx);
                }
            }

            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.mapfg[y] && map.mapfg[y][(x * 4) + 2]) {
                    if (map.mapfg[y][(x * 4) + 2] != "-") {
                        ctx.drawImage(images["tiles/" + getTile(map, x, y, 3).sprite],
                            zoom * scale * (x - ofsX) - ((zoom - 1) * scale * (width / 2)), zoom * scale * (y - ofsY) - ((zoom - 1) * scale * 7), zoom * scale, zoom * scale);
                    }
                }
            }
        },
        // Controls
        controls: [
            currentMapText, backButton
        ],
        name: "mapmaker"
    }
}