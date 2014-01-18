var WeaponType = {
    SIMPLE: 0,
    LASER: 1
};
var SimpleShot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, owner) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = 0;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', this.move);
        logiOsciGame.game.rootScene.addChild(this);
        this.owner = owner;
        this.addEventListener('enterframe', function () {
            for (var i in logiOsciGame.enemies) {
                if (logiOsciGame.enemies[i].intersect(this) &&
                    logiOsciGame.enemies[i].isAlive) {
                    this.remove();
                    logiOsciGame.enemies[i].killed();
                    logiOsciGame.game.score += 100;
                }
            }
        });
    },
    move: function() {
        this.x += this.moveSpeed * Math.cos(this.direction);
        this.y += this.moveSpeed * Math.sin(this.direction);
        if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function() {
        var self = this;
        this.owner.shots.some(function(v, i){
            if (v == self) {
                self.owner.shots.splice(i, 1);
            }
        });
        console.log(self.owner.shots);
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});

var Laser = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, owner) {
        enchant.Sprite.call(this, 1, 10);
        this.owner = owner;
        this.moveSpeed = 10;
        this.height = 10;
        this.surface = new Surface(logiOsciGame.screenWidth, this.height);
        this.surface.context.fillStyle = this.COLORS[4];
        this.surface.context.fillRect(10,
                                      Math.floor(this.height / 2 + 2),
                                      logiOsciGame.screenWidth,
                                      1);
        this.image = this.surface;
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.moveSpeed = 20;
        this.laserWidth = 0;
        console.log(this);
        this.state = Laser.STATE.INIT;
        this.addEventListener('enterframe', this.move);
        logiOsciGame.game.rootScene.addChild(this);
    },
    COLORS: ['white', 'red', 'blue', 'green', 'yellow'],
    move: function() {
        switch (this.state) {
        case Laser.STATE.INIT:
            if (this.owner.touchStatus == Player.TouchStatus.TOUCHING) {
                this.state = Laser.STATE.OPEN;
            }
            break;
        case Laser.STATE.OPEN:
            if (this.owner.touchStatus == Player.TouchStatus.TOUCHING) {
                this.x = this.owner.x;
            } else {
                this.state = Laser.STATE.CLOSE;
            }
            this.laserWidth += this.moveSpeed;
            break;
        case Laser.STATE.CLOSE:
            this.x += this.moveSpeed;
            break;
        }
        this.width = this.laserWidth;

        this.y = this.owner.y;
        for (var i in logiOsciGame.enemies) {
            if (logiOsciGame.enemies[i].intersect(this) &&
                logiOsciGame.enemies[i].isAlive) {
                //this.remove();
                logiOsciGame.enemies[i].killed();
                logiOsciGame.game.score += 100;
            }
        }
        if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function() {
        var self = this;
        this.owner.shots.some(function(v, i){
            if (v == self) {
                self.owner.shots.splice(i, 1);
            }
        });
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});

Laser.STATE = {
    INIT: 0,
    OPEN: 1,
    CLOSE: 2
};