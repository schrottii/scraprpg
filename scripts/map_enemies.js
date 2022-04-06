// var zoom = 1;

// Enemies
let mapenemies = {
    default(args) {
        return {
            position: [6, 6],
            map: "",
            alpha: 255,

            render(ctx) {

                let tileX = this.position[0] - game.position[0];
                let tileY = this.position[1] - game.position[1];

                let xAdjust = game.position[0] - width / 2 + 0.5;

                ctx.drawImage(images["gear"],
                    ((zoom * scale) * (tileX - xAdjust)) - ((zoom - 1) * scale * (width / 2)),
                    (zoom * scale) * (tileY - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                    zoom * scale, zoom * scale)
            },

            ...args || {},
        }
    }
};