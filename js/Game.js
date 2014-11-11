var Pweek = Pweek || {};

Pweek.Game = function() {};

spriteName = ['', 'yellow', 'red', 'green', 'blue', 'ninja'];

//setting game configuration and loading the assets for the loading screen
Pweek.Game.prototype = {
  create: function() {
    this.started = false;

    // Background
    var bg = this.game.add.image(0, 0, 'background');
    this.game.add.image(150, 80, 'main-panel');
    this.game.add.image(200, 0, 'top-panel');
    this.game.add.image(12, 245, 'top-panel');
    this.game.add.image(20, 80, 'left-panel');
    this.white = Pweek.game.add.sprite(-100, -100, 'white');
    this.white.anchor.x = .5;
    this.white.anchor.y = .5;

    this.scoreText = this.game.add.text(296, 20, '0',
            {'font': '26px arial', 'fill': '#FFFFFF'});
    this.scoreText.anchor.x = 1;
    if (this.mode == 'solo') {
        this.levelText = this.game.add.text(40, 270, 'Level 1',
                {'font': '20px arial', 'fill': '#FFFFFF'});
    }

    this.linkSpritesH = new Array(LINES);
    for (var l = 0; l < LINES; l++) {
        this.linkSpritesH[l] = new Array(COLUMNS - 1);
        for (var c = 0; c < COLUMNS - 1; c++) {
            var coord = this.convertPosition(c, l);
            this.linkSpritesH[l][c] = this.game.add.sprite(coord[0] + 24, coord[1], 'horizontal');
            this.linkSpritesH[l][c].anchor.x = .5;
            this.linkSpritesH[l][c].anchor.y = .5;
        }
    }
    this.linkSpritesV = new Array(LINES - 1);
    for (var l = 0; l < LINES - 1; l++) {
        this.linkSpritesV[l] = new Array(COLUMNS);
        for (var c = 0; c < COLUMNS; c++) {
            var coord = this.convertPosition(c, l);
            this.linkSpritesV[l][c] = this.game.add.sprite(coord[0], coord[1] - 24, 'vertical');
            this.linkSpritesV[l][c].anchor.x = .5;
            this.linkSpritesV[l][c].anchor.y = .5;
        }
    }



    this.gridSprites = new Array(LINES * 2);
    for (var l = 0; l < LINES * 2; l++) {
        this.gridSprites[l] = new Array(COLUMNS);
    }

    this.ns1 = null;
    this.ns2 = null;

    var startbtn = this.game.add.image(this.game.width / 2,
            this.game.height / 2, 'touchtostart');
    startbtn.anchor.x = .5;
    startbtn.anchor.y = .5;

    var pausebtn = this.game.add.button(10, 10, 'pause_button', this.showPauseMenu, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Key callbacks.
    var key = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    key.onDown.add(function(key)
    {
        this.logic.rotateLeft();
    }, this);
    var key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    key.onDown.add(function(key)
    {
        this.logic.moveLeft();
    }, this);
    var key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    key.onDown.add(function(key)
    {
        this.logic.moveRight();
    }, this);
    var key = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    key.onDown.add(function(key)
    {
        this.logic.moveDownAndPut();
    }, this);

    bg.inputEnabled = true;
    bg.input.priorityID = 0;
    bg.events.onInputDown.add(function(img, pointer) {
        this.startPointX = pointer.position.x;
        this.startPointY = pointer.position.y;
        this.pointer = pointer;
    }, this);

    bg.events.onInputUp.add(function(img, pointer) {
        if (this.started) {
            var dx = Math.abs(pointer.positionUp.x - pointer.positionDown.x);
            var dy = Math.abs(pointer.positionUp.y - pointer.positionDown.y);
            var duration = pointer.timeUp - pointer.timeDown;
            if (this.logic.state == 'move' &&
                    duration < 150 && duration > 2 &&
                    dx < 10 && dy < 10) {
                this.logic.rotateLeft();
            }
        } else {
            this.start(startbtn);
        }
        this.pointer = null;
    }, this);

  },
  update: function() {
      if (this.started) {
          this.logic.update(this.game.time.elapsed);
          if (this.pointer && this.logic.state == 'move') {
                var dx = this.pointer.position.x - this.startPointX;
                var dy = this.pointer.position.y - this.startPointY;
                if (dx > 48) {
                    this.logic.moveRight();
                    this.startPointX = this.pointer.position.x;
                    this.startPointY = this.pointer.position.y;
                } else if (dx < -48) {
                    this.logic.moveLeft();
                    this.startPointX = this.pointer.position.x;
                    this.startPointY = this.pointer.position.y;
                } else if (dy > 100) {
                    this.logic.moveDownAndPut();
                }
          }
      }
  },
  start: function(b) {
    this.logic = new Pweek.GameLogic(this);
    this.createPiece();
    this.logic.init();
    this.started = true;
    b.kill();
  },
  updateLevel: function(level) {
    this.levelText.setText('Level ' + level);
  },
  home: function() {
    this.state.start('MainMenu');
  },
  restart: function() {
    this.state.start('Game');
  },
  convertPosition: function(x, y) {
    var xconv = 176 + x * 52;
    var yconv = 652 - y * 50;
    return [xconv, yconv];
  },
  positionNextPiece: function(x, y) {
    var xconv = 46 + x * 52;
    var yconv = 140 - y * 50;
    return [xconv, yconv];
  },
  updatePositionPiece: function() {
    var c1 = this.convertPosition(
            this.logic.piece.coords[0][1], this.logic.piece.coords[0][0]);
    var c2 = this.convertPosition(
            this.logic.piece.coords[1][1], this.logic.piece.coords[1][0]);
    Pweek.game.add.tween(this.white).to({y: c1[1]}, 200,
            Phaser.Easing.Linear.NONE, true);
    Pweek.game.add.tween(this.white).to({x: c1[0]}, 100,
            Phaser.Easing.Linear.NONE, true);

    Pweek.game.add.tween(this.s1).to({y: c1[1]}, 200,
            Phaser.Easing.Linear.NONE, true);
    Pweek.game.add.tween(this.s1).to({x: c1[0]}, 100,
            Phaser.Easing.Linear.NONE, true);
    Pweek.game.add.tween(this.s2).to({y: c2[1]}, 200,
            Phaser.Easing.Linear.NONE, true);
    Pweek.game.add.tween(this.s2).to({x: c2[0]}, 100,
            Phaser.Easing.Linear.NONE, true);
  },
  createPiece: function() {
    this.s1 = this.ns1;
    this.s2 = this.ns2;
    var nc1 = this.positionNextPiece(
            this.logic.nextPiece.coords[0][1] - COLUMNS / 2,
            this.logic.nextPiece.coords[0][0] - LINES);
    var nc2 = this.positionNextPiece(
            this.logic.nextPiece.coords[1][1] - COLUMNS / 2,
            this.logic.nextPiece.coords[1][0] - LINES);

    this.ns1 = Pweek.game.add.sprite(nc1[0], nc1[1],
            spriteName[this.logic.nextPiece.coords[0][2]]);
    this.ns2 = Pweek.game.add.sprite(nc2[0], nc2[1],
            spriteName[this.logic.nextPiece.coords[1][2]]);
    this.ns1.anchor.x = this.ns1.anchor.y = .5;
    this.ns2.anchor.x = this.ns2.anchor.y = .5;
  },
  dispPiece: function() {
    var c1 = this.logic.game.convertPosition(this.logic.piece.coords[0][1],
                                             this.logic.piece.coords[0][0]);
    var c2 = this.logic.game.convertPosition(this.logic.piece.coords[1][1],
                                             this.logic.piece.coords[1][0]);
    this.logic.game.white.position.x = c1[0];
    this.logic.game.white.position.y = c1[1];
    this.logic.game.s1.position.x = c1[0];
    this.logic.game.s1.position.y = c1[1];
    this.logic.game.s2.position.x = c2[0];
    this.logic.game.s2.position.y = c2[1];
  },
  removeSprites: function(list) {
      for (var i = 0; i < list.length; i++) {
            // Explode sprite.
            var s = this.gridSprites[list[i][0]][list[i][1]];
            var dx = Math.floor((Math.random() * 200) - 200 + 200 * (i % 2));
            var x = s.position.x + dx;
            var angle = Math.floor((Math.random() * 360)) * (dx > 0 ? 1 : -1);
            this.game.add.tween(s)
                .to({x: x}, 500, Phaser.Easing.Linear.NONE, true);
            this.game.add.tween(s)
                .to({y: 1000}, 500, Phaser.Easing.Back.In, true);
            this.game.add.tween(s)
                .to({angle: angle}, 500, Phaser.Easing.Cubic.Out, true)
                .onComplete.add(function() {
                    this.kill();
                }, s);
            this.gridSprites[list[i][0]][list[i][1]] = null;
      }
  },
  addScore: function(x, y, score) {
    var t = this.game.add.text(x, y, score,
                {'font': '26px arial', 'fill': '#FFFFFF'});
    t.anchor.x = 1;
    this.game.add.tween(t)
        .to({x: this.scoreText.position.x}, 500,
                Phaser.Easing.Linear.None, true)
        .onComplete.add(function() {
            this.scoreText.setText(this.logic.score);
        }, this);

    this.game.add.tween(t)
        .to({y: this.scoreText.position.y}, 500,
                Phaser.Easing.Exponential.Out, true)
        .onComplete.add(function() { this.destroy(); }, t);
  },
  putDown: function() {
    var p1 = this.logic.piece.coords[0];
    var p2 = this.logic.piece.coords[1];

    this.gridSprites[p1[0]][p1[1]] = this.s1;
    this.gridSprites[p2[0]][p2[1]] = this.s2;
    this.s1.frame = 2;
    this.s2.frame = 2;
    this.white.position.x = -100;
    this.white.position.y = -100;
  },
  gravity: function() {
      for (var l = 0; l < LINES * 2; l++) {
          for (var c = 0; c < COLUMNS; c++) {
              var s = this.gridSprites[l][c];
              var y = this.convertPosition(0, l)[1];
              if (s && s.position.y != y) {
                  s.frame = 1;
                  this.game.add.tween(s)
                      .to({y: y}, 3 * (y - s.position.y),
                              Phaser.Easing.Bounce.Out, true)
                      .onComplete.add(function() {
                          this.frame = 2;
                      }, s);
              }

              // XXX
              if (l < LINES) {
                this.cleanLinks(l, c);
              }
          }
      }
      var t = this.game.time.create();
      t.add(500, this.updateLinks, this);
      t.start();
  },
  cleanLinks: function(l, c) {
    if (c > 0) {
        this.linkSpritesH[l][c - 1].frame = 0;
    }
    if (c < COLUMNS - 1) {
        this.linkSpritesH[l][c].frame = 0;
    }
    if (l > 0) {
        this.linkSpritesV[l - 1][c].frame = 0;
    }
    if (l < LINES - 1) {
        this.linkSpritesV[l][c].frame = 0;
    }
  },
  updateLinks: function() {
      for (var l = 0; l < LINES - 1; l++) {
          for (var c = 0; c < COLUMNS; c++) {
              if (this.logic.grid[l][c] == this.logic.grid[l + 1][c]) {
                this.linkSpritesV[l][c].frame = this.logic.grid[l][c];
              } else {
                this.linkSpritesV[l][c].frame = 0;
              }
          }
      }

      for (var l = 0; l < LINES; l++) {
          for (var c = 0; c < COLUMNS - 1; c++) {
              if (this.logic.grid[l][c] == this.logic.grid[l][c + 1]) {
                this.linkSpritesH[l][c].frame = this.logic.grid[l][c];
              } else {
                this.linkSpritesH[l][c].frame = 0;
              }
          }
      }
  },
  gameover: function() {
      var gameover = this.game.add.image(this.game.width / 2,
              200, 'gameover');
      gameover.anchor.x = .5;
      gameover.anchor.y = .5;

    var t = this.game.add.button(this.game.width / 2, 450, 'retry',
                this.replay, this);
    t.anchor.set(.5, .5);
	this.game.add.tween(t).from({y: 450 + 500}, 800,
            Phaser.Easing.Back.Out, true);

    t = this.game.add.button(this.game.width / 2, 650, 'quit',
            this.quit, this);
    t.anchor.set(.5, .5);
	this.game.add.tween(t).from({y: 650 + 500}, 800,
            Phaser.Easing.Back.Out, true);
  },
  showPauseMenu: function() {
      if (this.started == false) {
        return;
      }
    this.started = false;


    var t2 = this.game.add.button(this.game.width / 2, 650, 'quit',
            this.quit, this);
    t2.anchor.set(.5, .5);
	this.game.add.tween(t2).from({y: 650 + 500}, 800,
            Phaser.Easing.Back.Out, true);

    var t = this.game.add.button(this.game.width / 2, 450, 'continue',
                function() {
                    t2.kill();
                    t.kill();
                    this.showGrid();
                    this.started = true;
                }, this);
    t.anchor.set(.5, .5);
	this.game.add.tween(t).from({y: 450 + 500}, 800,
            Phaser.Easing.Back.Out, true);

    this.hideGrid();
  },
  showGrid: function() {
    // TODO
  },
  hideGrid: function() {
    // TODO
  },
  replay: function() {
    this.game.state.start('Game');
  },
  quit: function() {
    this.game.state.start('MainMenu');
  }
};
