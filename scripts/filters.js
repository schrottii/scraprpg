// Filters by the wizard

// The canvas filters are extremely slow (easily bringing me from 60+ fps to 8 fps), so
// I had to implement a workaround & a couple of functions and stuff

var bod;
var inFade = false;

var filters = {
    "blur": 0,
    "gray": 0,
    "sepia": 0,
    "invert": 0,
    "brightness": 100,
}

// Enables this - no need to re-run this
function defFilter(){
    bod = document.body.style;
}

// Clears current filter (single or multi)
function clearFilter() {
    bod.filter = "none";
    for (i in filters) filters[i] = 0;
    filters[4] = 100;
}

// sets single filter blur
function filterBlur(amount) {
    bod.filter = "blur(" + amount + "px)";
}

// sets single filter gray
function filterGray(amount) {
    bod.filter = "grayscale(" + amount + "%)";
}

// sets single filter sepia
function filterSepia(amount) {
    bod.filter = "sepia(" + amount + "%)";
}

// sets single filter invert
function filterInverted(amount) {
    bod.filter = "invert(" + amount + "%)";
}

// sets single filter brightness
function filterBrightness(amount) {
    bod.filter = "brightness(" + amount + "%)";
}

function fadeOut(dur, keep = true, onFinish = false) {
    if (inFade) return false;
    inFade = true;

    let prev = filters["brightness"];

    setFilter("brightness", prev);

    addAnimator(function (t) {
        setFilter("brightness", Math.max(0, prev - ((t / dur) * prev)));
        if (t >= dur) {
            inFade = false;
            if (onFinish != false) onFinish(); // such as setScene
            t += 450;
        }
        if (t >= dur + 500) {
            if (keep) {
                setFilter("brightness", 0);
            }
            else {
                setFilter("brightness", prev);
            }
            return true;
        }
        return false;
    })
}

function fadeIn(dur, keep = true, onFinish = false) {
    if (inFade) return false;
    inFade = true;

    let prev = filters["brightness"];

    setFilter("brightness", prev);

    addAnimator(function (t) {
        setFilter("brightness", Math.min(100, ((t / dur) * 100)));
        if (t >= dur) {
            inFade = false;
            if (onFinish != false) onFinish(); // such as setScene
            t += 450;
        }
        if (t >= dur + 500) {
            if (keep) {
                setFilter("brightness", 100);
            }
            else {
                setFilter("brightness", prev);
            }
            return true;
        }
        return false;
    })
}

// Sets one filter then renders, allows for multiple
// use clearFilter to get rid of it
function setFilter(name, amount) {
    filters[name] = amount;

    let s = "";
    if (filters["blur"] != 0) s = s + " blur(" + filters["blur"] + "px)";
    if (filters["gray"] != 0) s = s + " grayscale(" + filters["gray"] + "%)";
    if (filters["sepia"] != 0) s = s + " sepia(" + filters["sepia"] + "%)";
    if (filters["invert"] != 0) s = s + " invert(" + filters["invert"] + "%)";
    if (filters["brightness"] != 100) s = s + " brightness(" + filters["brightness"] + "%)";
    if (s == "") s = "none";
    bod.filter = s;
}