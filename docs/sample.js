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
    cbm.locate(b1.right + 2, y);
    cbm.fg = 8;
    var b7 = cbm.addButton("Dissolve ");
    b7.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            addleave();
            dissolve();
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
    cbm.locate(b2.right + 2, y);
    cbm.fg = 3;
    var b3 = cbm.addButton("Petscii  ");
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
    cbm.locate(b4.right + 2, y);
    cbm.fg = 12;
    var b8 = cbm.addButton("Low res  ");
    b8.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            addleave();
            loresPlotDemo();
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
    cbm.locate(b5.right + 2, y);
    cbm.fg = 5;
    var b9 = cbm.addButton("Sine Wave");
    b9.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            addleave();
            loresSineWave();
        }, 250);
    };
    cbm.locate(x, y += 6);
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
var dissolve = function () {
    var _a;
    cbm.clear();
    var a = [];
    for (var i_1 = 0; i_1 < 4000; ++i_1)
        a[i_1] = i_1;
    for (var i_2 = 0; i_2 < 4000; ++i_2) {
        var j = Math.floor(Math.random() * 4000);
        _a = [a[j], a[i_2]], a[i_2] = _a[0], a[j] = _a[1];
    }
    var i = 0;
    cbm.repeat(function () {
        for (var j = 1; j <= 10; ++j) {
            var offset = a[i++ % 4000];
            var y = Math.floor(offset / 80);
            var x = offset % 80;
            if (y < 6 && x >= 74)
                continue;
            if (i <= 4000) {
                var fg = Math.floor(y / 12) * 4 + Math.floor(x / 20);
                if (fg > 15)
                    fg -= 4;
                cbm.foreground(fg);
                cbm.loresPlot(x, y);
            }
            else
                cbm.loresUnPlot(x, y);
            if (i == 8000) {
                var closeButton = cbm.findButton("X");
                closeButton.onclick();
            }
        }
    }, 800, 0);
};
var loresPlotDemo = function () {
    cbm.clear();
    var n = Math.ceil(4 * Math.PI / 0.03) + 1;
    var i = 0;
    cbm.repeat(function () {
        var p = Math.cos(i / 2);
        var x = 39 * p * Math.cos(i) + 40;
        var y = 24 * p * Math.sin(i) + 25;
        cbm.loresPlot(x, y);
        i += 0.03;
    }, n, 5);
};
var loresSineWave = function () {
    cbm.clear();
    cbm.newLine();
    cbm.foreground(7);
    cbm.largeText('HELLO');
    cbm.largeText('CBM!');
    cbm.foreground(0);
    for (var x_1 = 0; x_1 < 80; ++x_1)
        cbm.loresPlot(x_1, 25); // centered horizontal line
    for (var y = 0; y < 50; ++y)
        cbm.loresPlot(40, y); // centered vertical line
    cbm.foreground(1);
    var x = 0;
    cbm.repeat(function () {
        var y = 25 * Math.sin(x / 10) + 25;
        cbm.loresPlot(x, y);
        if (++x == 80) {
            cbm.locate(0, 19);
            cbm.foreground(14);
            cbm.out('READY');
            cbm.newLine();
        }
        ;
    }, 80);
};
mainMenu();
//# sourceMappingURL=sample.js.map