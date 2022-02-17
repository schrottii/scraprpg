let images = {
    gear: "data/images/gear.png",
    paper: "data/images/paper.png",
    inventory: "data/images/inventory.png",
    mainmenu_bg: "data/images/mainmenu_bg.png",
    fight_bg: "data/images/fight_bg.png",
    gameicon: "data/images/gameicon.png",
    arrowmiddle: "data/images/arrowdot.png",
    arrowdown: "data/images/arrowdown.png",
    arrowup: "data/images/arrowup.png",
    arrowleft: "data/images/arrowleft.png",
    arrowright: "data/images/arrowright.png",
    cutscene_fade: "data/images/cutscene_fade.png",
    placeholder: "data/images/cutscene_map.png",
    tokenattack: "data/images/tokenattack.png",
    actions: "data/images/actions.png",
    techniques: "data/images/techniques.png",
    switch: "data/images/switch.png",
    flee: "data/images/flee.png",
    gameover: "data/images/gameover.png",
    selected32: "data/images/selected.png",
    potion: "data/images/Items/potion.png",
    bleu: "data/images/Map_Bleu.png",
    evil: "data/images/Map_Evil.png",

    "tiles/grass1": "data/images/tiles/grass1.png",
    "tiles/grass2": "data/images/tiles/grass2.png",
    "tiles/sand1": "data/images/tiles/sand1.png",
    "tiles/sand2": "data/images/tiles/sand2.png",
    "tiles/water1": "data/images/tiles/water1.png",
    "tiles/water2": "data/images/tiles/water2.png",
    "tiles/relief1": "data/images/tiles/water1.png",
    "tiles/relief2": "data/images/tiles/water2.png",
    //"tiles/relief1": "data/images/tiles/relief1.png",
    //"tiles/relief2": "data/images/tiles/relief2.png",
}

var scenes = {
    title: "scripts/scenes/title.js",
    game: "scripts/scenes/game.js",
};

var audio = {
    "bgm/vaporlim": "data/bgm/Vaporlim_OST.mp3",
};

var maps = {
    "test": "scripts/maps/test.js",
};


var resCount = 0;
var resLoad = 0;

function loadAllResources() {
    for (let image in images) {
        let img = new Image();
        img.src = images[image];
        img.onload = () => {
            resLoad++;
            scene.controls[0].text = "Loading resources...";
            scene.controls[1].text = "images/" + image + " " + resLoad + "/" + resCount;
            if (resLoad == resCount) {
                scene.controls[0].text = "Everything good to go!";
                scene.controls[2].clickthrough = scene.controls[3].clickthrough = false;
                scene.controls[2].alpha = scene.controls[3].alpha = 1;
            }
        }
        images[image] = img;
        resCount++;
    }
    for (let scn in scenes) {
        let scr = document.createElement("script");
        scr.src = scenes[scn];
        scr.onload = () => {
            resLoad++;
            scene.controls[0].text = "Loading resources...";
            scene.controls[1].text = "scenes/" + scn + " " + resLoad + "/" + resCount;
            if (resLoad == resCount) {
                scene.controls[0].text = "Everything good to go!";
                scene.controls[2].clickthrough = scene.controls[3].clickthrough = false;
                scene.controls[2].alpha = scene.controls[3].alpha = 1;
            }
        }
        scenes[scn] = scr;
        document.head.appendChild(scr);
        resCount++;
    }
    for (let snd in audio) {
        let aud = new Audio(audio[snd]);
        aud.onloadeddata = () => {
            resLoad++;
            scene.controls[0].text = "Loading resources...";
            scene.controls[1].text = "audio/" + snd + " " + resLoad + "/" + resCount;
            if (resLoad == resCount) {
                scene.controls[0].text = "Everything good to go!";
                scene.controls[2].clickthrough = scene.controls[3].clickthrough = false;
                scene.controls[2].alpha = scene.controls[3].alpha = 1;
            }
        }
        audio[snd] = aud;
        resCount++;
    }
    for (let map in maps) {
        let mp = document.createElement("script");
        mp.src = maps[map];
        mp.onload = () => {
            resLoad++;
            scene.controls[0].text = "Loading resources...";
            scene.controls[1].text = "maps/" + map + " " + resLoad + "/" + resCount;
            if (resLoad == resCount) {
                scene.controls[0].text = "Everything good to go!";
                scene.controls[2].clickthrough = scene.controls[3].clickthrough = false;
                scene.controls[2].alpha = scene.controls[3].alpha = 1;
            }
        }
        maps[map] = mp;
        document.head.appendChild(mp);
        resCount++;
    }
}