var Pweek = Pweek || {};

LINES = 12;
COLUMNS = 6;

Pweek.Piece = function(logic) {
    this.logic = logic;
    this.coords = new Array(2);

    var coul1 = 1 + Math.floor(Math.random() * logic.n_colors);
    var coul2 = 1 + Math.floor(Math.random() * logic.n_colors);
    this.rot = Math.floor(Math.random() * 4);

    switch (this.rot) {
    case 0:
        this.coords[0] = [LINES - 1, COLUMNS / 2, coul1];
        this.coords[1] = [LINES, COLUMNS / 2, coul2];
        break;
    case 1:
        this.coords[0] = [LINES, COLUMNS / 2, coul1];
        this.coords[1] = [LINES, COLUMNS / 2 + 1, coul2];
        break;
    case 2:
        this.coords[0] = [LINES, COLUMNS / 2, coul1];
        this.coords[1] = [LINES - 1, COLUMNS / 2, coul2];
        break;
    case 3:
        this.coords[0] = [LINES, COLUMNS / 2 + 1, coul1];
        this.coords[1] = [LINES, COLUMNS / 2, coul2];
        break;
    }

};


Pweek.Piece.prototype.updatePosition = function() {
    this.logic.game.updatePositionPiece();
};

Pweek.Piece.prototype.drop = function(grid) {
    var ok = true;
    while (ok) {
        for (var i = 0; i < 2; i++) {
            if (this.coords[i][0] <= 0 ||
                    grid[this.coords[i][0] - 1][this.coords[i][1]] > 0) {
                ok = false;
            }
        }
        if (ok) {
            for (var i = 0; i < 2; i++) {
                this.coords[i][0]--;
            }
        }
    }
    this.updatePosition();
};


Pweek.Piece.prototype.moveDown = function(grid) {
    var ok = true;
    for (var i = 0; i < 2; i++) {
        if (this.coords[i][0] <= 0 ||
                grid[this.coords[i][0] - 1][this.coords[i][1]] > 0) {
            ok = false;
        }
    }
    if (ok) {
        for (var i = 0; i < 2; i++) {
            this.coords[i][0]--;
        }
        this.updatePosition();
    }
    return ok;
};

Pweek.Piece.prototype.moveLeft = function(grid) {
    var ok = true;
    for (var i = 0; i < 2; i++) {
        if (this.coords[i][1] <= 0 ||
                grid[this.coords[i][0]][this.coords[i][1] - 1] > 0) {
            ok = false;
        }
    }
    if (ok) {
        for (var i = 0; i < 2; i++) {
            this.coords[i][1]--;
        }
        this.updatePosition();
    }
};

Pweek.Piece.prototype.moveRight = function(grid) {
    var ok = true;
    for (var i = 0; i < 2; i++) {
        if (this.coords[i][1] >= COLUMNS - 1 ||
                grid[this.coords[i][0]][this.coords[i][1] + 1] > 0) {
            ok = false;
        }
    }
    if (ok) {
        for (var i = 0; i < 2; i++) {
            this.coords[i][1]++;
        }
        this.updatePosition();
    }
};

Pweek.Piece.prototype.rotateLeft = function(grid) {
    newPiece = new Array(2);
    newPiece[0] = this.coords[0].slice(0);
    newPiece[1] = this.coords[1].slice(0);
    var decL = 0;
    var decC = 0;
    switch (this.rot) {
        case 0:
            decL = -1;
            decC = -1;
            break;
        case 1:
            decL = 1;
            decC = -1;
            break;
        case 2:
            decL = 1;
            decC = 1;
            break;
        case 3:
            decL = -1;
            decC = 1;
            break;
    }
    newPiece[1][1] += decC;
    newPiece[1][0] += decL;
    if (newPiece[1][1] < 0) {
        newPiece[1][1]++;
        newPiece[0][1]++;
    }
    if (newPiece[1][1] >= COLUMNS) {
        newPiece[1][1]--;
        newPiece[0][1]--;
    }
    if (newPiece[1][0] < 0) {
        newPiece[1][0]++;
        newPiece[0][0]++;
    }
    if (grid[newPiece[0][0]][newPiece[0][1]] == 0 &&
            grid[newPiece[1][0]][newPiece[1][1]] == 0) {
        this.coords[0] = newPiece[0];
        this.coords[1] = newPiece[1];
        this.rot = (this.rot + 3) % 4;
    }

    this.updatePosition();
};


Pweek.GameLogic = function(game) {
    this.state = 'move';
    this.score = 0;
    this.game = game;

    if (game.mode == 'solo') {
        this.n_colors = 3;
        this.speed = 500;
    } else {
        this.n_colors = 4;
        this.speed = 400;
    }

    this.timeLevel = 0;


    this.sum = 0;
    this.level = 1;

    this.grid = new Array(LINES * 2);
    for (var l = 0; l < LINES * 2; l++) {
        this.grid[l] = new Array(COLUMNS);
        for (var c = 0; c < COLUMNS; c++) {
            this.grid[l][c] = 0;
        }
    }

    this.nextPiece = new Pweek.Piece(this);
};

Pweek.GameLogic.prototype.init = function() {
    this.generate();
};

Pweek.GameLogic.prototype.addScore = function(x, y, score) {
    this.score += score;
    this.game.addScore(x, y, score);
};

Pweek.GameLogic.prototype.barycenter = function(r) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < r.length; i++) {
        x += r[i][0];
        y += r[i][1];
    }
    x /= r.length;
    y /= r.length;
    return this.game.convertPosition(x, y);
};

Pweek.GameLogic.prototype.update = function(delta) {


    /*if (level >= 5 && timeGarbage > 12.0f / (level - 4)) {
        gameLogic.sendGarbage(1);
        timeGarbage = 0;
    } else {
        timeGarbage += delta;
    }*/
    if (this.game.mode == 'solo') {
        if (this.score >= this.level * 1000 || this.timeLevel > 120000) {
            if (this.level < 10) {
                this.level++;
            }
            switch (this.level) {
                case 2:
                    this.n_colors = 4;
                    break;
                case 3:
                    this.speed = 400;
                    break;
                case 4:
                    this.n_colors = 5;
                    break;
                case 6:
                    this.speed = 300;
                    break;
                case 8:
                    this.speed = 250;
                    break;
                case 10:
                    this.speed = 200;
            }
            this.timeLevel = 0;
            this.game.updateLevel(this.level);
        } else {
            this.timeLevel += delta;
        }
    }


    this.sum += delta;
    if (this.state == 'move') {
        if (this.sum > this.speed) {
            if (!this.moveDown()) {
                this.state = 'pose';
            }
            this.sum = 0;
        }
    } else if (this.state == 'pose') {
        if (this.sum > this.speed) {
            this.putDown();
            this.state = 'gravity';
            this.sum = 0;
        }
    } else if (this.state == 'gravity') {
        if (this.sum == delta) {
            this.gravity();
        }
        if (this.sum > 500) {
            this.state = 'resolve';
            this.sum = 0;
        }
    } else if (this.state == 'resolve') {
        if (this.sum == delta) {
            this.removes = this.resolve();
            for (var i = 0; i < this.removes.length; i++) {
                r = this.removes[i];
                var b = this.barycenter(r);
                this.addScore(b[0], b[1],
                        r.length * 10 * (r.length - 3 + this.combo));
            }

            //XXX
            this.game.updateLinks();
        }
        if (this.sum > 300) {
            if (this.removes.length > 0) {
                this.state = 'gravity';
                if (this.combo == 0) {
                    this.combo = 8;
                } else {
                    this.combo *= 2;
                }
            } else {
                if (this.generate()) {
                    this.state = 'move';
                } else {
                    this.state = 'lost';
                    this.game.gameover();
                }
            }

            this.sum = 0;
        }
    }
};

Pweek.GameLogic.prototype.floodfill = function(l, c, coul, list) {
    if (l < 0 || c < 0 || l >= LINES || c >= COLUMNS ||
            this.grid[l][c] != coul || this.gridFF[l][c]) {
        return 0;
    }
    this.gridFF[l][c] = true;
    list.push([l, c]);
    return 1 + this.floodfill(l + 1, c, coul, list) +
        this.floodfill(l - 1, c, coul, list) +
        this.floodfill(l, c + 1, coul, list) +
        this.floodfill(l, c - 1, coul, list);
};

Pweek.GameLogic.prototype.resolve = function() {
    this.gridFF = new Array(LINES);
    for (var l = 0; l < LINES; l++) {
        this.gridFF[l] = new Array(COLUMNS);
    }

    var remove = [];

    for (l = 0; l < LINES; l++) {
        for (c = 0; c < COLUMNS; c++) {
            if (this.grid[l][c] > 0) {
                var list = [];
                if (this.floodfill(l, c, this.grid[l][c], list) >= 4) {
                    remove.push(list);
                    for (var i = 0; i < list.length; i++) {
                        this.grid[list[i][0]][list[i][1]] = 0;
                    }
                    this.game.removeSprites(list);
                }
            }
        }
    }

    return remove;
};

Pweek.GameLogic.prototype.gravity = function() {
    var sums = new Array(COLUMNS);
    for (var c = 0; c < COLUMNS; c++) sums[c] = 0;

    for (var l = 0; l < LINES * 2; l++) {
        for (var c = 0; c < COLUMNS; c++) {
            if (this.grid[l][c] == 0) {
                sums[c]++;
            } else if (sums[c] > 0) {
                this.grid[l - sums[c]][c] = this.grid[l][c];
                this.game.gridSprites[l - sums[c]][c] = this.game.gridSprites[l][c];
                this.grid[l][c] = 0;
                this.game.gridSprites[l][c] = null;
            }
        }
    }

    this.game.gravity();
};

Pweek.GameLogic.prototype.generate = function() {
    this.combo = 0;
    this.piece = this.nextPiece;
    this.nextPiece = new Pweek.Piece(this);
    this.game.createPiece();
    this.game.dispPiece();

    var p1 = this.piece.coords[0];
    var p2 = this.piece.coords[1];
    return this.grid[p1[0]][p1[1]] == 0 && this.grid[p2[0]][p2[1]] == 0;
};

Pweek.GameLogic.prototype.rotateLeft = function() {
    if (this.piece && this.state == 'move') {
        this.piece.rotateLeft(this.grid);
    }
};

Pweek.GameLogic.prototype.moveLeft = function() {
    if (this.piece && this.state == 'move') {
        this.piece.moveLeft(this.grid);
    }
};

Pweek.GameLogic.prototype.moveRight = function() {
    if (this.piece && this.state == 'move') {
        this.piece.moveRight(this.grid);
    }
};

Pweek.GameLogic.prototype.moveDown = function() {
    if (this.piece && this.state == 'move') {
        return this.piece.moveDown(this.grid);
    }
};

Pweek.GameLogic.prototype.moveDownAndPut = function() {
    if (this.piece && this.state == 'move') {
        this.game.s1.frame = 1;
        this.game.s2.frame = 1;
        this.piece.drop(this.grid);
        this.piece.updatePosition(true);
        this.state = 'pose';
        this.sum = 0;
    }
};

Pweek.GameLogic.prototype.putDown = function() {
    var p1 = this.piece.coords[0];
    var p2 = this.piece.coords[1];
    this.grid[p1[0]][p1[1]] = p1[2];
    this.grid[p2[0]][p2[1]] = p2[2];

    this.game.putDown();
    this.piece = null;
};

