const resSpeed = .10;

function resourceBuild(game, x, y) {
    this.game = game;
    this.img = null;
    this.bWidth = 2;
    this.bHeight = 2;
    this.openAnim = null;
    this.closedAnim = null;
    this.currAnim = null;
    this.renderX = 0;
    this.renderY = 0;
    this.numEmployed = 0;
    this.numEmpNeeded = null;
    this.placeCost = null;
    this.resType = "";
    this.prodTime = 0;
    this.fireResist = 0.1;
    this.buffer = { x: x - 1, y: y - 1, width: this.bWidth + 1, height: this.bHeight + 1 };
    this.roadTiles = [];
    Entity.call(this, game, x, y);
}

resourceBuild.prototype = Object.create(Entity.prototype);
resourceBuild.prototype.constructor = resourceBuild;

resourceBuild.prototype.update = function () {
    this.roadTiles = findRoad(this.buffer);

    if (this.numEmployed < this.numEmpNeeded) {
        this.currAnim = this.closedAnim;
        this.numEmployed = 0;

    } else {
        this.currAnim = this.openAnim;
        if (this.game.timer.gameTime - this.workTime >= this.prodTime) {
            this.workTime = this.game.timer.gameTime;
            if (this instanceof goldMine) {
                //skip genWalker-- generateWalker with goldmine road tiles and palace road tiles, if it works just make the walker
                var canWalk = generateWalker(this.roadTiles, this.game.gameWorld.palace.roadTiles);
                if (canWalk != null) this.pushBoi(canWalk, this.game.gameWorld.palace);
            } else if (this instanceof huntLodge) {
                if (this.roadTiles.length > 0) {
                    //console.log(walkerMap);
                    let huntah = new Hunter(this.game, ASSET_MANAGER.getAsset("./img/Hunter1.5.png"),
                        ASSET_MANAGER.getAsset("./img/Hunter2.png"), walkerMap, this.x, this.y, this);
                    huntah.destX = 48;//FOR TESTING, NEEDS A FOREST COORD
                    huntah.destY = 49;
                    this.game.addWalker(huntah);
                }

            } else { // instance of clay pit
                this.genWalker(this.game.yards);

            }
        }
    }
    Entity.prototype.update.call(this);
}

resourceBuild.prototype.draw = function (ctx) {
    pt1 = this.game.twodtoisoX(this.x, this.y) - this.renderX;
    pt2 = this.game.twodtoisoY(this.x, this.y) - this.renderY;
    this.currAnim.drawFrame(this.game.clockTick, ctx, pt1, pt2);
    Entity.prototype.draw.call(this);
}

resourceBuild.prototype.genWalker = function (destBuild) {
    found = false;
    for (let i = 0; i < destBuild.length; i++) {
        let indie = destBuild[i];
        //WADDUP BETCH
        let canWalk = generateWalker(this.roadTiles, indie.roadTiles);
        if (canWalk != null) {
            found = true;
            this.pushBoi(canWalk, indie);

        }
        if (found) break;
    }
}

resourceBuild.prototype.pushBoi = function (canWalk, bRef) {
    if (this instanceof clayPit) {
        var ccm = new cCartMan(this.game, ASSET_MANAGER.getAsset("./img/clayCartMan.png"), walkerMap, canWalk[0], canWalk[1], bRef);
        ccm.loadCount = 100;
        ccm.destX = canWalk[2];
        ccm.destY = canWalk[3];
        this.game.addWalker(ccm);
    } else if (this instanceof huntLodge) {
        var mcm = new mCartMan(this.game, ASSET_MANAGER.getAsset("./img/meatCartMan.png"), walkerMap, canWalk[0], canWalk[1], bRef);
        mcm.loadCount = 100;
        mcm.destX = canWalk[2];
        mcm.destY = canWalk[3];
        this.game.addWalker(mcm);
    } else if (this instanceof goldMine) {
        var glcm = new glCartMan(this.game, ASSET_MANAGER.getAsset("./img/goldCartMan.png"), walkerMap, canWalk[0], canWalk[1], bRef);
        glcm.loadCount = 100;
        glcm.destX = canWalk[2];
        glcm.destY = canWalk[3];
        this.game.addWalker(glcm);
    }

}
resourceBuild.prototype.toStringStats = function() {
    str = "Employed: " + this.numEmployed + "\nEmployees Needed: " + this.numEmpNeeded +
            "\n";
    return str;
}
function goldMine(game, x, y) {
    resourceBuild.call(this, game, x, y);
    this.img = ASSET_MANAGER.getAsset('./img/GoldMine.png');
    this.workTime = game.timer.gameTime;
    this.closedAnim = new Animation(this.img, 0, 0, 118, 63, 1, resSpeed, 1, true);
    this.openAnim = new Animation(this.img, 0, 1, 118, 63, 9, resSpeed, 17, true);
    this.currAnim = this.closedAnim;
    this.resType = "gold";
    this.prodTime = 30;
    this.numEmpNeeded = 16;
    this.renderX = 30;
    this.renderY = 3;
    this.placeCost = 100;
}

goldMine.prototype = Object.create(resourceBuild.prototype);
goldMine.prototype.constructor = goldMine;

function clayPit(game, x, y) {
    resourceBuild.call(this, game, x, y);
    this.img = ASSET_MANAGER.getAsset('./img/ClayThingy.png');
    this.workTime = game.timer.gameTime;
    this.closedAnim = new Animation(this.img, 0, 0, 118, 77, 1, resSpeed, 1, true);
    this.openAnim = new Animation(this.img, 0, 1, 118, 77, 8, resSpeed, 24, true);
    this.currAnim = this.closedAnim;
    this.resType = "clay";
    this.prodTime = 10;
    this.numEmpNeeded = 14;
    this.renderX = 29;
    this.renderY = 8;
    this.placeCost = 20;
}

clayPit.prototype = Object.create(resourceBuild.prototype);
clayPit.prototype.constructor = clayPit;

//Possibly Hunting Lodge? Extend the update behavior to deal with returning hunters.
function huntLodge(game, x, y) {
    resourceBuild.call(this, game, x, y);
    this.img = ASSET_MANAGER.getAsset("./img/HuntingLodge.png");
    this.workTime = game.timer.gameTime;
    this.closedAnim = new Animation(this.img, 0, 0, 118, 111, 1, resSpeed, 1, true);
    this.openAnim = new Animation(this.img, 0, 1, 118, 111, 9, resSpeed, 18, true);
    this.currAnim = this.closedAnim;
    this.resType = "meat";
    this.prodTime = 15;
    this.numEmpNeeded = 18;
    this.renderX = 28;
    this.renderY = 50;
    this.placeCost = 35;
    this.foodStore = 0;
}

huntLodge.prototype = Object.create(resourceBuild.prototype);
huntLodge.prototype.constructor = huntLodge;

huntLodge.prototype.update = function () {
    resourceBuild.prototype.update.apply(this);
    for (var i = 0; i < this.game.walkers.length; i++) {
        if (arrived(this.buffer, this.game.walkers[i].x, this.game.walkers[i].y)) {
            if (this.game.walkers[i] instanceof Hunter && this.game.walkers[i].hunted) {
                this.foodStore += 100;
                this.game.walkers[i].removeFromWorld = true;
                //console.log(this.foodStore);
            }
        }
    }
    if (this.foodStore > 100) {
        this.foodStore -= 100;
        this.genWalker(this.game.granaries);
    }


}
