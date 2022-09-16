// Filters by the wizard

// The canvas filters are extremely slow (easily bringing me from 60+ fps to 8 fps), so
// I had to implement a workaround & a couple of functions and stuff

var bod;

var filters = {
    "blur": 0,
    "gray": 0,
    "sepia": 0,
}

// Enables this - no need to re-run this
function defFilter(){
    bod = document.body.style;
}

// Clears current filter (single or multi)
function clearFilter() {
    bod.filter = "none";
    for (i in filters) filters[i] = 0;
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

// Sets one filter then renders, allows for multiple
// use clearFilter to get rid of it
function setFilter(name, amount) {
    filters[name] = amount;

    let s = "";
    if (filters["blur"] != 0) s = s + " blur(" + filters["blur"] + "px)";
    if (filters["gray"] != 0) s = s + " grayscale(" + filters["gray"] + "%)";
    if (filters["sepia"] != 0) s = s + " sepia(" + filters["sepia"] + "%)";
    if (s == "") s = "none";
    bod.filter = s;
}