var resCount = 0;
var resLoad = 0;
var resSpecifics;

function finishedLoadingResources() {
    resLoad++;
    scene.controls[1].text = "Loading resources...";
    scene.controls[7].sizeAnchor[0] = 0.56 * (1 - resLoad / resCount);
    scene.controls[7].anchor[0] = 0.22 + 0.56 * (resLoad / resCount);

    if (resLoad == resCount) {
        scene.controls[1].text = "Everything good to go!";
        scene.controls[3].clickthrough = false;
        scene.controls[1].alpha = scene.controls[2].alpha = scene.controls[4].alpha = 1;
    }
}

function postResSpecifics() {
    console.log(resSpecifics);
    setTimeout(() => {
        if (resLoad != resCount) postResSpecifics();
    }, 5000);
}

function loadAllResources() {
    resSpecifics = {
        images: Object.keys(images).length,
            scenes: Object.keys(scenes).length,
                audio: Object.keys(audio).length,
                    maps: Object.keys(maps).length
    };
    postResSpecifics();

    for (let image in images) {
        let img = new Image();
        img.src = images[image];
        img.onload = () => {
            scene.controls[2].text = "images/" + image + " " + resLoad + "/" + resCount;
            resSpecifics.images--;
            finishedLoadingResources();
        }
        images[image] = img;
        resCount++;
    }
    for (let scn in scenes) {
        let scr = document.createElement("script");
        scr.src = scenes[scn];
        scr.onload = () => {
            scene.controls[2].text = "scenes/" + scn + " " + resLoad + "/" + resCount;
            resSpecifics.scenes--;
            finishedLoadingResources();
        }
        scenes[scn] = scr;
        document.head.appendChild(scr);
        resCount++;
    }
    for (let snd in audio) {
        let aud = new Audio(audio[snd]);
        aud.onloadeddata = () => {
            scene.controls[2].text = "audio/" + snd + " " + resLoad + "/" + resCount;
            resSpecifics.audio--;
            finishedLoadingResources();
        }
        audio[snd] = aud;
        resCount++;
    }
    for (let map in maps) {
        let mp = document.createElement("script");
        mp.src = maps[map];
        mp.onload = () => {
            scene.controls[2].text = "maps/" + map + " " + resLoad + "/" + resCount;
            resSpecifics.maps--;
            finishedLoadingResources();
        }
        maps[map] = mp;
        document.head.appendChild(mp);
        resCount++;
    }
}
