var Pweek = Pweek || {};

Pweek.Preload = function() {};

//setting game configuration and loading the assets for the loading screen
Pweek.Preload.prototype = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX,
            this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('background', 'assets/background.png');

    this.load.image('pweek', 'assets/menu/pweek.png');
    this.load.image('quit', 'assets/menu/quit.png');
    this.load.image('solo', 'assets/menu/solo.png');
    this.load.image('chrono', 'assets/menu/chrono.png');
    this.load.image('touchtostart', 'assets/menu/touchtostart.png');
    this.load.image('gameover', 'assets/menu/gameover.png');
    this.load.image('retry', 'assets/menu/retry.png');
    this.load.image('continue', 'assets/menu/continue.png');

    // panels
    this.load.image('main-panel', 'assets/panels/main-panel.png');
    this.load.image('top-panel', 'assets/panels/top-panel.png');
    this.load.image('left-panel', 'assets/panels/left-panel.png');

    // puyos
    this.load.image('white', 'assets/puyos/white-48.png');

    this.load.spritesheet('yellow', 'assets/puyos/yellow.png', 48, 48, 3);
    this.load.spritesheet('red', 'assets/puyos/red.png', 48, 48, 3);
    this.load.spritesheet('blue', 'assets/puyos/blue.png', 48, 48, 3);
    this.load.spritesheet('green', 'assets/puyos/green.png', 48, 48, 3);
    this.load.spritesheet('ninja', 'assets/puyos/ninja.png', 48, 48, 3);

    this.load.spritesheet('horizontal', 'assets/puyos/horizontal.png', 48, 48, 6);
    this.load.spritesheet('vertical', 'assets/puyos/vertical.png', 48, 48, 6);

    // buttons
    this.load.image('pause_button', 'assets/buttons/pause_button.png');

  },
  create: function() {
    this.state.start('MainMenu');
  }
};
