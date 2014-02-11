var LogiOsciGame = enchant.Class.create(Game, {
    initialize: function(width, height) {
        Game.call(this, width, height);
        this.bgm = 'sounds/esot_bgm.mp3';
        this.fps = 24;
        this.score = 0;
        this.preload('images/graphic.png');
        this.preload('images/kazurebo_01.png');
        this.preload('sounds/esot_bgm.mp3');

        this.onload = function () {
            enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = true;
            this.items = new Array();
            this.enemies = new Array();

            this.createFirstStage();
        };
        this.onerror = function(e) {
            console.log('sorry. something wrong:' + e.message);
        };
        this.onstart = function() {
            this.startBGM();
        };
        this.onclear = function() {
            this.stop();
            setTimeout(function() {
                alert('Congratulations! Thank you for playing.');
            }, 10);
        };
    },
    createFirstStage: function() {
        this.stage = FirstStage;
        this.spaceBg = new SpaceBg(this.width, this.height);
        this.scoreLabel = new ScoreLabel(8, 8);
        this.timeLabel = new TimeLabel(this.width - 180, 8);
        this.lifeLabel = new LifeLabel(8,
                                       this.height - 20,
                                       Player.LIFE_MAX);
        this.player = new Player(this, 0, 152);
        this.player.addEventListener(
            Player.EVENT.DAMAGED,
            function() {
                this.game.lifeLabel.life = this.lifePoint;
            });
        this.lifeLabel.life = this.player.lifePoint;

        this.rootScene.addChild(this.spaceBg);
        this.rootScene.backgroundColor = 'black';
        this.addEventListener('enterframe', function () {
            this.scoreLabel.score = this.score;
            this.spaceBg.scroll(this.frame);
            this.process();
        });
        this.rootScene.addChild(this.scoreLabel);
        this.rootScene.addChild(this.timeLabel);
        this.rootScene.addChild(this.lifeLabel);
        this.rootScene.addChild(this.player);
    },
    process: function() {
        var time = this.frame / this.fps;
        var e = this.stage.enemies;
        for (var i = 0; i < e.length; i++) {
            if (time == e[i].time) {
                var omega = e[i].y < this.height / 2 ? 0.01 : -0.01;
                var enemy = new EnemyType[e[i].type](
                    this,
                    e[i].x != null ? e[i].x : this.width,
                    e[i].y,
                    omega,
                    Item.Type[e[i].item]);
            }
        }
        if (this.stage.boss.time == time) {
            var boss = new Boss(this);
        }
    },
    startBGM: function() {
        var sound = new enchant.DOMSound.load(
            this.bgm,
            'audio/mpeg',
            function() {
                sound.play();
                sound._element.loop = true;
            });
    }
});
