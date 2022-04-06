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

                ctx.drawImage(images["gear"],
                    scale * tileX + (3 * (zoom - 1)) + 16,
                    scale * (tileY + ((zoom - 1) / 2)) + 16, zoom * scale, zoom * scale)
            },

            ...args || {},
        }
    }
};