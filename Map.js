function Map(gameEngine) {
    this.game = gameEngine;
    this.mapList = [];
    // Note: not needed when you give mapData.

}
Map.prototype.constructor = Map;

//adds a reference to an entity to a given tile.
Map.prototype.addThing = function (thing, list) {
    if (!thing || !this.isInMapBoundaries(thing) || !this.canAddToMap(thing)) {
        return false;
    }
    this.addToLists(thing, list);
    this.addToMaps(thing);
    return true;
}

// replaces a given building with a fire animation
// which is removed from the map after 20 seconds
Map.prototype.alight = function (thing) {
  let x = parseInt(thing.x);
  let y = parseInt(thing.y);
  let width = parseInt(thing.bWidth);
  let height = parseInt(thing.bHeight);
  this.game.removeBuilding(x, y);
  this.clearWalkers(thing);
  this.addFire(x, y, width, height);
  this.removeFire(x, y, width, height);
}

// runs through gameEngine's list of walkers and removes them from the game
// if any have a reference to this building
Map.prototype.clearWalkers = function(thing) {
  for(let i = 0; i < this.game.walkers.length; i++) {
    if(this.game.walkers[i] === thing) {
      this.game.walkers[i].removeFromWorld = true;
    }
  }
}
// adds a fire animation to the tiles on the map in a given location coresponding to
// the coordinates coresponding to the original bHeight and bWidth
// of the building caught on fire
Map.prototype.addFire = function(x, y, width, height) {
  for (let i = x; i < x + width; i+= 1) {
      for (let j = y; j < y + height; j+= 1) {
          var fire = new Fire(this.game, i, j);
          this.addToLists(fire, null);
          this.addToMaps(fire);
      }
  }
}

// removes fire animation from the map after an interval of 20 seconds
// iterates through the coordinates coresponding to the original bHeight and bWidth
// of the building caught on fire
Map.prototype.removeFire = function(x, y, width, height) {
  var that = this;
  setTimeout(function(){
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
          that.game.removeBuilding(i, j);
        }
    }}, 20000);
}

// reads in map tiles from a given 2d array of integers
// creating tile objects with corresponding types (grass = 0, road = 1, buildings = 2, trees = 3)
// each tile object is stored in a new 2d array this.maplist
Map.prototype.readMap = function (mapData) {

    for (i = 0; i < mapData.length; i++) {
        this.mapList[i] = new Array(mapData.length);
        for (j = 0; j < mapData[i].length; j++) {
            x = j;
            y = i;
            tileType = mapData[i][j];
            var tile = new Tile(this.game, tileType, x, y);
            this.mapList[i][j] = tile;
        }
    }
    this.game.initcamera();
}

Map.prototype.isInMapBoundaries = function (thing) {
    let x = thing.x;
    let y = thing.y;
    if (x < 0 || y < 0 || x > this.mapList.length || y > this.mapList.length) {
        return false;
    }
    return true;
};
//Can't add on 1- existing road, 2- existing building, or if
Map.prototype.canAddToMap = function (thing) {
    for (i = thing.x; i < thing.x + thing.bWidth; i++) {
        for (j = thing.y; j < thing.y + thing.bHeight; j++) {
            if (this.mapList[j][i].tileType != 0 || this.mapList[j][i].thing != null) {
                return false;
            }
        }
    }
    return true;
};

Map.prototype.addToLists = function (thing, list) {
    if (list) {
        list.push(thing);
    }
    this.game.entities.push(thing);
};

Map.prototype.addToMaps = function (thing) {
    for (i = thing.x; i < thing.x + thing.bWidth; i++) {
        for (j = thing.y; j < thing.y + thing.bHeight; j++) {
            walkerMap[j][i] = 2;
            this.mapList[j][i].thing = thing;
        }
    }
};

// tiling going down
function Tile(game, tileType, x, y) {
    this.gfxString = '';
    this.grassImage = "./img/grass.png";
    this.roadImage = "./img/FloodPlain_00091.png";
    this.treeImage = "./img/Trees_00012.png";

    if (tileType === 0) {
        this.gfxString = this.grassImage;
    } else if (tileType === 1) {
        this.gfxString = this.roadImage;//road img
    } else if (tileType === 3) {
        this.gfxString = this.treeImage;
    }
    this.thing = null;
    this.image = new Image();
    this.image.src = this.gfxString;
    this.game = game;
    this.x = x;
    this.y = y;
    this.tileType = tileType;
}
Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.getThing = function () {
    return this.thing;
}
Tile.prototype.draw = function (ctx) {
    ctx.drawImage(
        this.image,
        this.game.twodtoisoX(this.x, this.y),
        this.game.twodtoisoY(this.x, this.y)
    );
}
