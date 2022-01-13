scenes.game = () => {
    let kofs = [0, 0, 0];
    let head = 0;
    let walkTime = 0;

    function isWalkable(map, x, y) {
        if (map.map[y] && map.map[y][x]) {
            return !map.tiles[map.map[y][x]].occupied;
        } else return false;
    }

    return {
        preRender(ctx, delta) {
            let scale = window.innerHeight / 16;
            let width = window.innerWidth / scale;
            let map = maps["test"];
            
            if (!kofs[2]) {
                if (currentKeys["w"] && isWalkable(map, game.position[0], game.position[1] - 1)) {
                    kofs = [0, -1, 1];
                    game.position[1]--;
                    head = 3;
                } else if (currentKeys["s"] && isWalkable(map, game.position[0], game.position[1] + 1)) {
                    kofs = [0, 1, 1];
                    game.position[1]++;
                    head = 0;
                } else if (currentKeys["a"] && isWalkable(map, game.position[0] - 1, game.position[1])) {
                    kofs = [-1, 0, 1];
                    game.position[0]--;
                    head = 1;
                } else if (currentKeys["d"] && isWalkable(map, game.position[0] + 1, game.position[1])) {
                    kofs = [1, 0, 1];
                    game.position[0]++;
                    head = 2;
                }
            }
            kofs[2] = Math.max(kofs[2] - delta / 166, 0);
            walkTime = (walkTime + delta * (kofs[2] ? 5 : 1) / 1000) % 2;

            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = 1;
            let ofsX = game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5;
            let ofsY = game.position[1] - kofs[1] * kofs[2] - 7.5;

            for (let y = Math.floor(ofsY); y < ofsY + 16; y++) for (let x = Math.floor(ofsX); x < ofsX + width; x++) {
                if (map.map[y] && map.map[y][x]) {
                    ctx.drawImage(images["tiles/" + map.tiles[map.map[y][x]].sprite],
                        scale * (x - ofsX), scale * (y - ofsY), scale, scale);
                } else if (map.tiles.empty) {
                    ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                        scale * (x - ofsX), scale * (y - ofsY), scale, scale);
                }
            }

            ctx.drawImage(images["bleu"], 32 * Math.floor(walkTime), 32 * head, 32, 32, 
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX), 
                scale * (game.position[1] - kofs[1] * kofs[2] - ofsY), scale, scale)
            ctx.imageSmoothingEnabled = true;
        },
        controls: [

        ],
    }
}

// TBD - to be developed