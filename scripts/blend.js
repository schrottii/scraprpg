// Simple blend system

// usage: clearBlend() to remove and setBlend(type) to set blend

// Used by controls (img, rect, etc.)
// To use, just add            blend: "xor",

var isClear = true;

function clearBlend() {
    if (!isClear) {
        isClear = true;

        let ctx = mainCanvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
    }
}

function setBlend(type) {
    let ctx = mainCanvas.getContext("2d");

    isClear = false;

    // Aliases
    switch (type) {
        case "add":
            ctx.globalCompositeOperation = 'lighter';
            break;
        case "mul":
            ctx.globalCompositeOperation = 'multiply';
            break;
        case "overlap":
            ctx.globalCompositeOperation = 'source-in';
            break;
    }

    // Set to name by default
    ctx.globalCompositeOperation = type;
}