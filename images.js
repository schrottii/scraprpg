function loadImage(path, onload) {
    let img = new Image();
    img.src = path;
    if (onload) {
        img.onload = onload;
    }
    return img;
}

var images =
{
    gear: loadImage("Images/gear.png"),
    paper: loadImage("Images/paper.png"),
    inventory: loadImage("Images/inventory.png"),
    mainmenu_bg: loadImage("Images/mainmenu_bg.png"),
    gameicon: loadImage("Images/gameicon.png"),
    arrowmiddle: loadImage("Images/arrowdot.png"),
    arrowdown: loadImage("Images/arrowdown.png"),
    arrowup: loadImage("Images/arrowup.png"),
    arrowleft: loadImage("Images/arrowleft.png"),
    arrowright: loadImage("Images/arrowright.png")
};

var tiles =
{
    grass1: loadImage("Images/tile_grass1.png"),
    grass2: loadImage("Images/tile_grass2.png"),
    sand1: loadImage("Images/tile_sand1.png"),
    sand2: loadImage("Images/tile_sand2.png"),
    water1: loadImage("Images/tile_water1.png"),
    water2: loadImage("Images/tile_water2.png")
};

var colors =
{
    top: "rgb(212, 159, 82)",
    bottom: "rgb(181, 133, 66)",
    top_pressed: "rgb(202, 98, 0)",
    bottom_pressed: "rgb(140, 54, 0)"
};