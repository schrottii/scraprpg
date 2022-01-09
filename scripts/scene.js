var scene = {};

function setScene(args) {
    scene = {
        preRender: (ctx) => {},
        controls: [],
        ...args || {},
    }
}