var playAfterIntro = "none";

// music
function playMusic(name, intro = "none") {
    // prevention if it does not exist
    if (audio[name] == undefined || audio[name].src == undefined) {
        console.log("| ⚠️ | Music undefined: " + name);
        return false;
    }

    musicPlayer.volume = settings.musicVolume;

    // play in the music channel (there is only one)
    if (musicPlayer.volume > 0 && musicPlayer.volume <= 1) {
        if (audio[name].src != musicPlayer.src) {
            if (intro == "none") {
                musicPlayer.src = audio[name].src;
            }
            else {
                playAfterIntro = name;
                musicPlayer.src = audio[intro].src;
                musicPlayer.loop = false;
            }
        }
        musicPlayer.play();
    }
}

function introToLoop() {
    if (playAfterIntro == "none" || playAfterIntro == undefined) return false;

    // prevention if it does not exist
    if (audio[playAfterIntro] == undefined || audio[playAfterIntro].src == undefined) {
        console.log("| ⚠️ | Intro2Loop undefined: " + playAfterIntro);
        return false;
    }

    // transition from an intro track to a loop track
    if (musicPlayer.currentTime >= musicPlayer.duration) {
        musicPlayer.src = audio[playAfterIntro].src;
        playAfterIntro = "none";

        musicPlayer.loop = true;
        musicPlayer.play();
    }

}

function stopMusic() {
    musicPlayer.pause();
}



// audio
// Generate 16 sound channels
var soundPlayer = {};

for (s = 1; s < 17; s++) {
    soundPlayer["soundPlayer" + s] = new Audio();
    let srcSoundPlayer = document.createElement("source");
    srcSoundPlayer.type = "audio/mpeg";
    srcSoundPlayer.preload = "auto";
    srcSoundPlayer.src = audio.no;
    soundPlayer["soundPlayer" + s].appendChild(srcSoundPlayer);
}

// play a sound - now supports sound channels!
function playSound(name) {
    // prevention if it does not exist
    if (audio[name] == undefined || audio[name].src == undefined) {
        console.log("| ⚠️ | Sound undefined: " + name);
        return false;
    }

    let s = 1;
    while (s < 17) { // If all 16 are occupied, it won't play any sound
        if (soundPlayer["soundPlayer" + s].currentTime >= soundPlayer["soundPlayer" + s].duration || soundPlayer["soundPlayer" + s].src == "") {
            if (soundPlayer["soundPlayer" + s].volume > 0 && soundPlayer["soundPlayer" + s].volume <= 1) {
                soundPlayer["soundPlayer" + s].src = audio[name].src;
                soundPlayer["soundPlayer" + s].play();
                return true;
            }
        }
        else { // Channel is occupied. (Angry sound channel sounds)
            s += 1;
        }
    }
}

function changeSoundVolume(vol) {
    if (vol <= 0) {
        for (s = 1; s < 17; s++) {
            soundPlayer["soundPlayer" + s].muted = true;
        }
        return;
    }
    if (vol > 1) return false;
    for (s = 1; s < 17; s++) {
        soundPlayer["soundPlayer" + s].muted = false;
        soundPlayer["soundPlayer" + s].volume = vol;
    }
}