var scene = {};
var previousScene;
var currentScene;

function setScene(args) {
    if (args.name != "loading" && scenes[args.name] == undefined) {
        console.log("| ⚠️ | Scene undefined: " + args.name);
        return false;
    }

    previousScene = scene.name;

    scene = {
        preRender: (ctx) => { },
        controls: [],
        ...args || {},
    }

    currentScene = scene.name;
    document.title = "ScrapRPG (" + scene.name.substr(0, 1).toUpperCase() + scene.name.substr(1) + ")";
}