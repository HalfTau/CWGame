
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
var walkerMap = new MapData().testMap;

function updateMapData(x, y, xDim, yDim, type) {
  for (i = x; i < x + xDim && x + xDim < walkerMap.length; i++) {
    for(j = y; j < y + yDim && y + yDim < walkerMap[i].length; j++) {
      walkerMap[i][j] = type;
      console.log(walkerMap);
    }
  }
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

function getTileInfo(x, y, game) {
    return game.map.mapList[x][y];
}


function getNeighbors(x, y, game) {
    neighbors = [];
    neighbors["above"] = game.map.mapList[x - 1][y];
    neighbors["below"] = game.map.mapList[x + 1][y];
    neighbors["left"] = game.map.mapList[x][y - 1];
    neighbors["right"] = game.map.mapList[x][y + 1];
    return neighbors;
}
//need an instance at start. we can adjust values as needed.
function GameWorld() {
    this.palace = null; 
    this.prosperity = 0;
    this.population = 0;
    this.workForce = 0;
    this.taxRev = .10;
    this.funds = 1000;
    this.goals = [];
}

GameWorld.prototype.addPop = function (num) {
    this.population += num;
}

GameWorld.prototype.remPop = function (num) {
    this.population -= num;
}

GameWorld.prototype.getWorkForce = function () {
    return Math.floor(this.population * .40); //40% population is work force, change how I'm doing it??
}
GameWorld.prototype.toStringStats = function() {

}

GameWorld.prototype.addFunds = function (amt) {
    this.funds += amt;
    console.log("Added " + amt + " to the treasury. Funds: " + this.funds);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();
var walkerMap = new mapData().testMap;

ASSET_MANAGER.queueDownload("./img/grass.png");
ASSET_MANAGER.queueDownload("./img/Land1a_00002.png");
ASSET_MANAGER.queueDownload("./img/emptyCartMan.png");
ASSET_MANAGER.queueDownload("./img/barleyCartMan.png");
ASSET_MANAGER.queueDownload("./img/beerCartMan.png");
ASSET_MANAGER.queueDownload("./img/clayCartMan.png");
ASSET_MANAGER.queueDownload("./img/flaxCartMan.png");
ASSET_MANAGER.queueDownload("./img/goldCartMan.png");
ASSET_MANAGER.queueDownload("./img/grainCartMan.png");
ASSET_MANAGER.queueDownload("./img/linenCartMan.png");
ASSET_MANAGER.queueDownload("./img/meatCartMan.png");
ASSET_MANAGER.queueDownload("./img/potsCartMan.png");
ASSET_MANAGER.queueDownload("./img/WatahMan.png");
ASSET_MANAGER.queueDownload("./img/Weaver.png");
ASSET_MANAGER.queueDownload("./img/ArchBuild-1.png");
ASSET_MANAGER.queueDownload("./img/Bazaar.png");
ASSET_MANAGER.queueDownload("./img/COPS-1.png");
ASSET_MANAGER.queueDownload("./img/Brewery.png");
ASSET_MANAGER.queueDownload("./img/Firehouse-1.png");
ASSET_MANAGER.queueDownload("./img/GoldMine.png");
ASSET_MANAGER.queueDownload("./img/HousingAlone.png");
ASSET_MANAGER.queueDownload("./img/HuntingLodge.png");
ASSET_MANAGER.queueDownload("./img/mansion.png");
ASSET_MANAGER.queueDownload("./img/Potter.png");
ASSET_MANAGER.queueDownload("./img/farm1.png");
ASSET_MANAGER.queueDownload("./img/taxHouse.png");
ASSET_MANAGER.queueDownload("./img/DONUTSTEAL.png");
ASSET_MANAGER.queueDownload("./img/FarmPlots.png");
ASSET_MANAGER.queueDownload("./img/bazaarLady 22x42.png");
ASSET_MANAGER.queueDownload("./img/FireDude1.png")
ASSET_MANAGER.queueDownload("./img/Firedude2.png");
ASSET_MANAGER.queueDownload("./img/Hunter1.5.png");
ASSET_MANAGER.queueDownload("./img/Hunter2.png");
ASSET_MANAGER.queueDownload("./img/immig.png");
ASSET_MANAGER.queueDownload("./img/ClayThingy.png");
ASSET_MANAGER.queueDownload("./img/smallWell.png");
ASSET_MANAGER.queueDownload("./img/bigWell.png"); 
ASSET_MANAGER.queueDownload("./img/Granary.png");
ASSET_MANAGER.queueDownload("./img/StoreYard.png");

//TODO: add in imgs for fixed walkers

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    gameEngine.gameWorld = new GameWorld();
    //gameEngine.gameWorld.palace = new Palace(gameEngine, 10, 6);

    gameEngine.map = new Map(gameEngine);
    gameEngine.init(ctx);
    gameEngine.map.readMap(new mapData().testMap);

    //var ecm = new eCartMan(gameEngine, ASSET_MANAGER.getAsset("./img/emptyCartMan.png"), walkerMap, 0, 1);
    //ecm.destX = 6;
    //ecm.destY = 18;
    //var ccm = new cCartMan(gameEngine, ASSET_MANAGER.getAsset("./img/clayCartMan.png"), walkerMap, 5, 1);
    //ccm.destX = 6;
    //ccm.destY = 18;
    //var becm = new beCartMan(gameEngine, ASSET_MANAGER.getAsset("./img/beerCartMan.png"), walkerMap, 9, 5);
    //becm.destX = 6;
    //becm.destY = 18;
    //gameEngine.addWalker(ecm);
    //gameEngine.addWalker(ccm);
    //gameEngine.addWalker(becm);
    //var baz = new bazLad(gameEngine, ASSET_MANAGER.getAsset("./img/bazaarLady 22x42.png"), walkerMap, 0, 1, 100, "pottery");
    //baz.destX = 16;
    //baz.destY = 11;
    //gameEngine.addWalker(baz);

    //var fiyah = new FireMan(gameEngine, ASSET_MANAGER.getAsset("./img/FireDude1.png"), ASSET_MANAGER.getAsset("./img/Firedude2.png"), walkerMap, 0, 1);
    //fiyah.destX = 9;
    //fiyah.destY = 18;
    //gameEngine.addWalker(fiyah);

    //var huntah = new Hunter(gameEngine, ASSET_MANAGER.getAsset("./img/Hunter1.5.png"), ASSET_MANAGER.getAsset("./img/Hunter2.png"), walkerMap, 0, 1);
    //huntah.destX = 12;
    //huntah.destY = 18;
    //gameEngine.addWalker(huntah);

    //var peeps = new Migrant(gameEngine, ASSET_MANAGER.getAsset("./img/immig.png"), walkerMap, 0, 1);
    //peeps.destX = 6;
    //peeps.destY = 18;
    //gameEngine.addWalker(peeps);

    //var gF = new grainFarm(gameEngine, 10, 7);
    //gameEngine.addEntity(gF);

    //var weaver = new Weaver(ASSET_MANAGER.getAsset("./img/Weaver.png"), gameEngine, 3, 11, 2, 2);
    ////gameEngine.addIndustry(weaver);

    //var hunt = new huntLodge(gameEngine, 3, 2);
    //gameEngine.addEntity(hunt);
    /*var potter = new Bazaar(gameEngine, 14, 11);
    gameEngine.addIndustry(potter);

    var well = new Housing(gameEngine, 10, 7); 
    gameEngine.addHousing(well);

    var granary = new WaterSupply(gameEngine, 12, 8);
    gameEngine.addGranary(granary);*/

    //var mine = new goldMine(gameEngine, 3, 11);
    //var pit = new clayPit(gameEngine, 3, 2);
    //gameEngine.addEntity(mine);
    //gameEngine.addEntity(pit);
    //var yard = new StoreYard(gameEngine, 10, 7);
    //var yard2 = new StoreYard(gameEngine, 6, 2);
    //gameEngine.addYard(yard);
    //gameEngine.addYard(yard2);

    gameEngine.start();
    var walkerMap = new MapData().testMap;
    var mapData = new MapData().testMap;//THIS IS THE ORIGINAL MAP- NOT CHANGED
    ASSET_MANAGER.assetQueueDownloads();// found in assetmanager.js

    $(function() {
        $('#StartButton').click(function (){
            $('#SplashScreen').remove();
            $('.game-container').show();
            ASSET_MANAGER.downloadAll(function () {
                console.log("starting up da sheild");
                var canvas = document.getElementById('gameWorld');
                var ctx = canvas.getContext('2d');
                var gameEngine = new GameEngine();
                gameEngine.gameWorld = new GameWorld();
                gameEngine.map = new Map(gameEngine);
                gameEngine.init(ctx);
                gameEngine.map.readMap(new MapData().testMap);
                
                gameEngine.start();
                console.log(walkerMap);
                updateMapData(0, 0, 1);
            });

        })
    });
}

