var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.removeButtons();
var mainMenu = function () {
    cbm.init();
    cbm.hideCursor();
    var x = 15;
    var y = 6;
    cbm.locate(x, y);
    cbm.fg = 7;
    var b1 = cbm.addButton("Colors  ");
    b1.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.locate(0, 7);
            cbm.colorPicker(false);
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 1;
    var b2 = cbm.addButton("chr$()s ");
    b2.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.petsciiChr$Chart();
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 3;
    var b3 = cbm.addButton("Petscii ");
    b3.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.petsciiPokesChart();
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 10;
    var b4 = cbm.addButton("Maze" + cbm.chr$(110) + cbm.chr$(109) + cbm.chr$(110) + cbm.chr$(109));
    b4.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.locate(0, 6);
            cbm.maze(19);
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 13;
    var b5 = cbm.addButton("Keyboard");
    b5.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.fg = 1;
            addleave();
            cbm.keyboardChart();
            cbm.redrawButtons();
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 15;
    var b6 = cbm.addButton("About   ");
    b6.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.fg = 1;
            cbm.aboutCbmish();
            addleave();
        }, 250);
    };
    cbm.locate(0, 7);
    cbm.foreground(14);
    cbm.blinkCursor();
};
var addleave = function () {
    var saveColor = cbm.fg;
    cbm.foreground(1);
    var saveRowCol = cbm.locate(37, 0);
    var leave = cbm.addButton("X");
    leave.onclick = function () {
        var _cbm = cbm;
        _cbm.escapePressed = true;
        onleave();
    };
    cbm.fg = saveColor;
    cbm.locate(saveRowCol[1], saveRowCol[0]);
};
var onleave = function () {
    setTimeout(function () {
        cbm.removeButtons();
        mainMenu();
        var _cbm = cbm;
        _cbm.escapePressed = false;
    }, 250);
};
mainMenu();
