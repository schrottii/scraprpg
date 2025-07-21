var scene = {};
var previousScene;

function setScene(args) {
    previousScene = scene.name;

    scene = {
        preRender: (ctx) => { },
        controls: [],
        ...args || {},
    }

    document.title = "ScrapRPG (" + scene.name + ")";
}