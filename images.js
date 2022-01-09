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
    fight_bg: loadImage("Images/fight_bg.png"),
    gameicon: loadImage("Images/gameicon.png"),
    arrowmiddle: loadImage("Images/arrowdot.png"),
    arrowdown: loadImage("Images/arrowdown.png"),
    arrowup: loadImage("Images/arrowup.png"),
    arrowleft: loadImage("Images/arrowleft.png"),
    arrowright: loadImage("Images/arrowright.png"),
    cutscene_fade: loadImage("Images/cutscene_fade.png"),
    placeholder: loadImage("Images/cutscene_map.png"),
    tokenattack: loadImage("Images/tokenattack.png"),
    actions: loadImage("Images/actions.png"),
    techniques: loadImage("Images/techniques.png"),
    switch: loadImage("Images/switch.png"),
    flee: loadImage("Images/flee.png"),
    gameover: loadImage("Images/gameover.png"),
    selected32: loadImage("Images/selected.png"),
    attack_bleu: loadImage("Images/bleu_attack.png")
};

var items =
{
    potion: loadImage("Images/Items/potion.png"),
    bigpotion: loadImage("Images/Items/potion.png")
}

var sprites =
{
    bleu: loadImage("Images/Map_Bleu.png"),
    evil: loadImage("Images/Map_Evil.png")
};

var portraits =
{
    bleu: loadImage("Images/p_bleu.png"),
    corelle: loadImage("Images/p_corelle.png")
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