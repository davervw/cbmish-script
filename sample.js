var cbm = new CbmishConsole();
cbm.CbmishConsole();
var mainMenu = function () {
    cbm.init();
    cbm.hideCursor();
    var x = 15;
    var y = 10;
    cbm.locate(x, y);
    var b1 = cbm.addButton("Colors ");
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
    var b2 = cbm.addButton("chr$()s");
    b2.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.petsciiChr$Chart();
        }, 250);
    };
    cbm.locate(x, y += 3);
    var b3 = cbm.addButton("Petscii");
    b3.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.petsciiPokesChart();
        }, 250);
    };
    cbm.locate(x, y += 3);
    var b4 = cbm.addButton("Maze" + cbm.chr$(109) + cbm.chr$(110) + cbm.chr$(109));
    b4.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.init();
            addleave();
            cbm.locate(0, 6);
            cbm.maze(19);
        }, 250);
    };
    cbm.locate(0, 7);
    cbm.foreground(14);
    cbm.blinkCursor();
};
var addleave = function () {
    cbm.foreground(1);
    cbm.locate(37, 0);
    var leave = cbm.addButton("X");
    leave.onclick = function () {
        var _cbm = cbm;
        _cbm.escapePressed = true;
        onleave();
    };
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
