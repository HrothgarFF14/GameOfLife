var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    console.log(parseInt(document.getElementById("speed").value));

    if (!ctx) {
        console.error("Failed to initialize canvas context");
        return;
    }

    gameEngine.init(ctx);

    gameEngine.addEntity(new Automata(gameEngine));

    gameEngine.start();
});
