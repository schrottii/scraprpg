// Simple blend system

// usage: clearBlend() to remove and setBlend(type) to set blend

// Used by controls (img, rect, etc.)
// To use, just add            blend: "xor",

var isClear = true;

function clearBlend() {
    if (!isClear) {
        isClear = true;

        let ctx = wggjCanvas.getContext("2d");
        wggjCTX.globalCompositeOperation = 'source-over';
    }
}

function setBlend(type) {
    if (settings.blend == false) return false;

    let ctx = wggjCanvas.getContext("2d");

    isClear = false;

    // Aliases
    switch (type) {
        case "add":
            wggjCTX.globalCompositeOperation = 'lighter';
            break;
        case "mul":
            wggjCTX.globalCompositeOperation = 'multiply';
            break;
        case "overlap":
            wggjCTX.globalCompositeOperation = 'source-in';
            break;
    }

    // Set to name by default
    wggjCTX.globalCompositeOperation = type;
}