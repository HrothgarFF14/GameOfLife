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
    var automata = new Automata(gameEngine);
    gameEngine.addEntity(automata);
});
