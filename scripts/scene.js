var scene = {};
var previousScene;


function setScene(args) {
    previousScene = args.name;
    scene = {
        preRender: (ctx) => {},
        controls: [],
        ...args || {},
    }
}