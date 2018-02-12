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

function twodtoisoX(x, y) {
    return ((((x - y))+ 15) * 29);
}
function twodtoisoY(x, y) {
    return (((x + y)) * 15);
}
function isototwodX(x, y) {
    return ((x + y) / 29);
}
function isototwodY(x, y) {
    return (((x - y)) / 15);
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

// tiling going down
function Tile(game, tileType, x, y) {
  //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/grass.png"), 0, 0, 58, 30, 1, .15, 1, true);
  this.gfxString = '';
  if (tileType === 0) {
      this.gfxString = "./img/grass.png";
  } else {
      this.gfxString = "./img/Land1a_00002.png";
  }
  this.thing;
  this.image = new Image();
  this.image.src = this.gfxString;
  this.game = game;
  this.x = x;
  this.y = y;
  this.tileType = tileType;
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.addThing = function(thing) {
    this.thing = thing;
    thing.x = this.x;
    thing.y = this.y;
    arrX = Math.floor(isototwodX(this.x, this.y));
    arrY = Math.floor(isototwodY(this.x, this.y))
    this.origin = 1;
    this.game.addEntity(thing);

}

Tile.prototype.draw = function(ctx) {
    //this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
          //Entity.prototype.draw.call(this);
      //this.thing.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
      //Entity.prototype.draw.call(this);
      ctx.drawImage(this.image, twodtoisoX(this.x, this.y), twodtoisoY(this.x, this.y));
}

function Map(gameEngine) {
    this.game = gameEngine;
    this.mapList = [];
    // Note: not needed when you give mapData.
    this.mapArray = Array(30).fill(Array(30).fill(0));
}
Map.prototype.constructor = Map;

Map.prototype.readMap = function(mapData) {

    for (i = 0; i < mapData.length; i++) {
        this.mapList[i] = new Array(mapData.length);
        for (j = 0; j < mapData[i].length; j++) {

            x = j;
            y = i;
            tileType = mapData[i][j];
            //console.log(mapData[i][j]);
            //console.log(twodtoisoX(x, y) + ' '+ twodtoisoY(x, y));
            var tile = new Tile(this.game, tileType, x, y);
            //this.game.addEntity(tile);
            this.mapList[i][j] = tile;
            //if (x % 2 == 0 && y % 2 == 0) {
            //    var copstore = new ArchBuild(this.game, ASSET_MANAGER.getAsset("./img/ArchBuild-1.png"));
            //    this.mapList[i][j].addThing(copstore);
            //}


        }
    }
}

//need an instance at start. we can adjust values as needed.
function GameWorld() {
    this.prosperity = 0;
    this.population = 0;
    this.workForce = 0;
    this.taxRev = .10;
    this.funds = 0;
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

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/Weaver.png");
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
ASSET_MANAGER.queueDownload("./img/palace.png");
ASSET_MANAGER.queueDownload("./img/FarmPlots.png");
ASSET_MANAGER.queueDownload("./img/bazaarLady 22x42.png");
ASSET_MANAGER.queueDownload("./img/FireDude1.png")
ASSET_MANAGER.queueDownload("./img/Firedude2.png");

//TODO: add in imgs for fixed walkers

//var easyStar = new EasyStar.js();

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.map = new Map(gameEngine);
    gameEngine.init(ctx);
    gameEngine.map.readMap(new mapData().testMap);
    //var gameWorld = new gameWorld();
    var walkerMap = new mapData().testMap

    //var weaver = new Weaver(ASSET_MANAGER.getAsset("./img/Weaver.png"), gameEngine, gameEngine.timer, 9, 9, 2, 2);
    //gameEngine.addEntity(weaver);
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

    var fiyah = new FireMan(gameEngine, ASSET_MANAGER.getAsset("./img/FireDude1.png"), ASSET_MANAGER.getAsset("./img/Firedude2.png"), walkerMap, 0, 1);
    fiyah.destX = 6;
    fiyah.destY = 18;
    gameEngine.addWalker(fiyah);


    var weaver = new Weaver(ASSET_MANAGER.getAsset("./img/Weaver.png"), gameEngine, 3, 11, 2, 2);
    gameEngine.addIndustry(weaver);

    var brewery = new Brewery(ASSET_MANAGER.getAsset("./img/Brewery.png"), gameEngine, 1, 2, 2, 2);
    //gameEngine.addIndustry(brewery);

    var potter = new Potter(ASSET_MANAGER.getAsset("./img/Potter.png"), gameEngine, 14, 11, 2, 2);
    gameEngine.addIndustry(potter);
    gameEngine.start();
});

