var Pweek = Pweek || {};

/*
var w = window.innerWidth * window.devicePixelRatio,
h = window.innerHeight * window.devicePixelRatio,
width = (h > w) ? h : w,
height = (h > w) ? w : h;

// Hack to avoid iPad Retina and large Android devices. Tell it to scale up.
if (window.innerWidth >= 1024 && window.devicePixelRatio >= 2)
{
	width = Math.round(width / 2);
	height = Math.round(height / 2);
}
// reduce screen size by one 3rd on devices like Nexus 5
if (window.devicePixelRatio === 3)
{
	width = Math.round(width / 3) * 2;
	height = Math.round(height / 3) * 2;
}*/
width = 480;
height = 800;

Pweek.game = new Phaser.Game(width, height, Phaser.AUTO, '');

Pweek.game.state.add('Boot', Pweek.Boot, true);
Pweek.game.state.add('Preload', Pweek.Preload);
Pweek.game.state.add('MainMenu', Pweek.MainMenu);
Pweek.game.state.add('Game', Pweek.Game);

