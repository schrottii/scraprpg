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
}