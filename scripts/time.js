//   Day: 6:00 - 17:59 (12 hours)
//  ----> Dawn: 6:00 - 8:59
//  ----> Noon: 9:00 - 14:59
//  ----> Dusk: 15:00 - 17:59
// Night: 18:00 - 5:59 (12 hours)

function getTime(ti = game.time, am = 16.667, di = 1000, sc = false) {
    let hours = Math.floor(ti / di);
    let minutes = Math.floor((ti % di) / am);

    let seconds = "";
    if (sc == true) seconds = ":" + Math.floor(ti % 60);
    if (sc == true && seconds.length == 2) seconds = ":0" + seconds.slice(1, 2);

    if (minutes == 60) return hours + 1 + ":00" + seconds;
    if (minutes < 10) return hours + ":0" + minutes + seconds;
    return hours + ":" + minutes + seconds;
}

function timeTicker(delta){
    // ticking the playTime stat and the ingame clock
    game.playTime += (delta / 1000); // 1 = 1 sec
    game.time += (delta / 60);
    if (game.time >= 24000) { // 1000 = 1 hour in-game.
        game.time = 0;
    }

    if (textProgress != -1) {
        textProgress += delta / 1000;
    }
}

function isDay() {
    if (game.time > 5999 && game.time < 18000) {
        return true;
    }
    return false;
}

function isDawn() {
    if (game.time > 5999 && game.time < 9000) {
        return true;
    }
    return false;
}
function isNoon() {
    if (game.time > 8999 && game.time < 15000) {
        return true;
    }
    return false;
}
function isDusk() {
    if (game.time > 14999 && game.time < 18000) {
        return true;
    }
    return false;
}

function isNight() {
    if (game.time > 17999 || game.time < 6000) {
        return true;
    }
    return false;
}