function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop) {
    this.spriteSheet = spriteSheet;
    this.startX = startX * frameWidth;
    this.startY = startY * frameHeight;
    this.frameWidth = frameWidth;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }

    var colIndex = this.currentFrame() % this.sheetWidth
    var rowIndex = Math.floor(this.currentFrame() / this.sheetWidth);

    if ((colIndex + 1) * this.frameWidth > this.spriteSheet.width) {
        rowIndex++;
    }
  
    ctx.drawImage(this.spriteSheet, colIndex * this.frameWidth + this.startX,
        rowIndex * this.frameHeight + this.startY, this.frameWidth,
        this.frameHeight, x, y, this.frameWidth, this.frameHeight);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}



// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/Weaver.png");
ASSET_MANAGER.queueDownload("./img/ArchBuild-1.png");
ASSET_MANAGER.queueDownload("./img/Bazaar.png");
ASSET_MANAGER.queueDownload("./img/COPS-1.png");
ASSET_MANAGER.queueDownload("./img/Brewery.png");
ASSET_MANAGER.queueDownload("./img/Firehouse-1.png");
ASSET_MANAGER.queueDownload("./img/GoldMine.png");
ASSET_MANAGER.queueDownload("./img/HousingAlone.png");
ASSET_MANAGER.queueDownload("./img/HuntingLodge.png");
ASSET_MANAGER.queueDownload("./img/Mansion.png");
ASSET_MANAGER.queueDownload("./img/Potter.png");
ASSET_MANAGER.queueDownload("./img/farm1.png");
ASSET_MANAGER.queueDownload("./img/taxHouse.png");
ASSET_MANAGER.queueDownload("./img/palace.png");
ASSET_MANAGER.queueDownload("./img/FarmPlots.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var weaver = new Weaver(gameEngine, ASSET_MANAGER.getAsset("./img/Weaver.png"));
    var archbuild = new ArchBuild(gameEngine, ASSET_MANAGER.getAsset("./img/ArchBuild-1.png"));
    var bazaar = new Bazaar(gameEngine, ASSET_MANAGER.getAsset("./img/Bazaar.png"));
    var copstore = new CopStore(gameEngine, ASSET_MANAGER.getAsset("./img/COPS-1.png"));
    var brewery = new Brewery(gameEngine, ASSET_MANAGER.getAsset("./img/Brewery.png"));
    var firehouse = new Firehouse(gameEngine, ASSET_MANAGER.getAsset("./img/Firehouse-1.png"));
    var goldmine = new Goldmine(gameEngine, ASSET_MANAGER.getAsset("./img/GoldMine.png"));
    var housingalone = new Housing(gameEngine, ASSET_MANAGER.getAsset("./img/HousingAlone.png"));
    var huntinglodge = new HuntingLodge(gameEngine, ASSET_MANAGER.getAsset("./img/HuntingLodge.png"));
    var mansion = new Mansion(gameEngine, ASSET_MANAGER.getAsset("./img/Mansion.png"));
    var potter = new Potter(gameEngine, ASSET_MANAGER.getAsset("./img/Potter.png"));
    var workcamp = new WorkCamp(gameEngine, ASSET_MANAGER.getAsset("./img/farm1.png"));
    var taxhouse = new TaxHouse(gameEngine, ASSET_MANAGER.getAsset("./img/taxHouse.png"));
    var palace = new Palace(gameEngine, ASSET_MANAGER.getAsset("./img/palace.png"));
    var barley = new Barley(gameEngine, ASSET_MANAGER.getAsset("./img/FarmPlots.png"));


    gameEngine.addEntity(bg);
    gameEngine.addEntity(weaver);
    gameEngine.addEntity(archbuild);
    gameEngine.addEntity(bazaar);
    gameEngine.addEntity(copstore);
    gameEngine.addEntity(brewery);
    gameEngine.addEntity(firehouse);
    gameEngine.addEntity(goldmine);
    gameEngine.addEntity(housingalone);
    gameEngine.addEntity(huntinglodge);
    gameEngine.addEntity(mansion);
    gameEngine.addEntity(potter);
    gameEngine.addEntity(workcamp);
    gameEngine.addEntity(taxhouse);
    gameEngine.addEntity(palace);
    gameEngine.addEntity(barley);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
