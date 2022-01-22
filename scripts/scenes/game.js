scenes.game = () => {
    let kofs = [0, 0, 0];
    let head = 0;
    let walkTime = 0;
    let pad = "";

    let walkPad = [];
    walkPad.push(controls.image({ // Up
        anchor: [.25, .75], offset: [0, 0], sizeOffset: [25, 25],
        fontSize: 16, source: "arrowup",
        onClick(args) {
            pad = "up";
        }
    }));
    walkPad.push(controls.image({ // Middle
        anchor: [.25, .75], offset: [0, 25], sizeOffset: [25, 25],
        fontSize: 16, source: "arrowmiddle",
    }));
    walkPad.push(controls.image({ // Down
        anchor: [.25, .75], offset: [0, 50], sizeOffset: [25, 25],
        fontSize: 16, source: "arrowdown",
        onClick(args) {
            pad = "down";
        }
    }));
    walkPad.push(controls.image({ // Left
        anchor: [.25, .75], offset: [-25, 25], sizeOffset: [25, 25],
        fontSize: 16, source: "arrowleft",
        onClick(args) {
            pad = "left";
        }
    }));
    walkPad.push(controls.image({ // Right
        anchor: [.25, .75], offset: [25, 25], sizeOffset: [25, 25],
        fontSize: 16, source: "arrowright",
        onClick(args) {
            pad = "right";
        }
    }));

    // Function to check if a tile is, well, walkable
    // Define if a tile (e. g. water) is walkable in the sprites dict
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
                if ((currentKeys["w"] || currentKeys["arrowup"] || pad == "up") && isWalkable(map, game.position[0], game.position[1] - 1)) {
                    kofs = [0, -1, 1];
                    game.position[1]--;
                    head = 3;
                } else if ((currentKeys["s"] || currentKeys["arrowdown"] || pad == "down") && isWalkable(map, game.position[0], game.position[1] + 1)) {
                    kofs = [0, 1, 1];
                    game.position[1]++;
                    head = 0;
                } else if ((currentKeys["a"] || currentKeys["arrowleft"] || pad == "left") && isWalkable(map, game.position[0] - 1, game.position[1])) {
                    kofs = [-1, 0, 1];
                    game.position[0]--;
                    head = 1;
                } else if ((currentKeys["d"] || currentKeys["arrowright"] || pad == "right") && isWalkable(map, game.position[0] + 1, game.position[1])) {
                    kofs = [1, 0, 1];
                    game.position[0]++;
                    head = 2;
                }
                pad = "";
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
                        scale * (x - ofsX), scale * (y - ofsY), scale+1, scale+1);
                } else if (map.tiles.empty) {
                    ctx.drawImage(images["tiles/" + map.tiles.empty.sprite],
                        scale * (x - ofsX), scale * (y - ofsY), scale+1, scale+1);
                }
            }

            ctx.drawImage(images["bleu"], 32 * Math.floor(walkTime), 32 * head, 32, 32, 
                scale * (game.position[0] - kofs[0] * kofs[2] - ofsX), 
                scale * (game.position[1] - kofs[1] * kofs[2] - ofsY), scale, scale)
            ctx.imageSmoothingEnabled = true;
        },
        controls: [
            ...walkPad
        ],
    }
}

// TBD - to be developed