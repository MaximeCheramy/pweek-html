var Pweek = Pweek || {};

Pweek.MainMenu = function() {};

//setting game configuration and loading the assets for the loading screen
Pweek.MainMenu.prototype = {
  create: function() {
    this.game.add.image(0, 0, 'background');
    var t = this.game.add.image(this.game.width / 2, 150, 'pweek');
    t.anchor.set(.5, .5);

    t = this.game.add.button(this.game.width / 2, 350, 'solo',
            this.start_game, {game: this.game, mode: 'solo'});
    t.anchor.set(.5, .5);

    t = this.game.add.button(this.game.width / 2, 550, 'chrono',
            this.start_game, {game: this.game, mode: 'chrono'});
    t.anchor.set(.5, .5);
  },
  start_game: function() {
    this.game.state.states['Game'].mode = this.mode;
    this.game.state.start('Game');
  }
};
