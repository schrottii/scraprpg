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
    gear: loadImage("Images/gear.png")
};

var colors =
{
    top: "rgb(212, 159, 82)",
    bottom: "rgb(181, 133, 66)",
    top_pressed: "rgb(202, 98, 0)",
    bottom_pressed: "rgb(140, 54, 0)"
};