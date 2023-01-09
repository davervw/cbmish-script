// sample.ts - Demo code simulating an 8-bit classic system
// Copyright (c) 2022-2023 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    cbm.locate(36, 21);
    cbm.fg = 1;
    var b10 = cbm.addButton(cbm.chr$(123));
    b10.onclick = function () {
        setTimeout(function () {
            cbm.toggleFullScreen();
        }, 250);
    };
    cbm.locate(x, y += 3);
    cbm.fg = 0;
    var b11 = cbm.addButton("Knight Dragon Scene  ");
    b11.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            addleave();
            dragonDemo();
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
    cbm.locate(b6.right + 2, y);
    cbm.fg = 4;
    var b12 = cbm.addButton("Dots   ");
    b12.onclick = function () {
        setTimeout(function () {
            cbm.removeButtons();
            cbm.fg = 1;
            dots();
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
        cbm.hideSprites();
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
    cbm.locate(15, 23);
    cbm.addLink('link: blog entry', 'https://techwithdave.davevw.com/2021/04/low-resolution-graphics-for-commodore.html');
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
    cbm.foreground(14);
    cbm.locate(22, 22);
    cbm.addLink('link: tweet', 'https://twitter.com/DaveRVW/status/1547040376367636480');
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
var dragonDemo = function () {
    var dragonChars = [
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0,
        0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0,
        0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0xa0, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa0, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
        0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f,
    ];
    var dragonColor = [
        0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d,
        0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3e, 0x3e, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3a, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36,
        0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3a, 0x3a, 0x3a, 0x3d, 0x3d, 0x38, 0x38, 0x31, 0x31, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36,
        0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d,
        0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x39, 0x39, 0x30, 0x30, 0x39, 0x39, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x3a, 0x3a, 0x3a,
        0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36,
        0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36,
        0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36,
        0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3f, 0x3f, 0x36, 0x36, 0x36, 0x3f, 0x3f, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36,
        0x3a, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x36, 0x36, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3a, 0x3a, 0x3a, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d,
        0x36, 0x36, 0x3f, 0x3f, 0x3f, 0x39, 0x3f, 0x3f, 0x3f, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d,
        0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3a, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d,
        0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x30, 0x30, 0x30, 0x3a, 0x3a, 0x3a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x30, 0x30, 0x30, 0x30, 0x39, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
        0x30, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d,
        0x3d, 0x3d, 0x3d, 0x3d, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x3d, 0x3d, 0x3d, 0x3d, 0x39, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x3d, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x3d, 0x3d, 0x3d, 0x31, 0x31,
        0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x3a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
    ];
    var knightImage = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0xc0, 0x00, 0x00, 0xa2, 0x00, 0x00, 0x92, 0x00, 0x00, 0x8a, 0x00, 0x00, 0xfa, 0x00, 0x00, 0x22,
        0x00, 0x00, 0x27, 0x00, 0x00, 0xfe, 0x00, 0x00, 0x20, 0x00, 0x00, 0x50, 0x00, 0x00, 0x88, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];
    var dragonImage = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0x80, 0x00, 0x1f,
        0xc0, 0x00, 0xbf, 0x00, 0x07, 0xbc, 0x00, 0x3d, 0xff, 0xc0, 0x3f, 0xff, 0xe0, 0x00, 0xc6, 0x70,
        0x01, 0xce, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];
    cbm.foreground(14);
    cbm.background(13);
    cbm.border(3);
    cbm.clear();
    for (var i = 0; i < 1000; ++i) {
        cbm.poke(13.5 * 4096 + i, dragonColor[i]);
        cbm.poke(1024 + i, dragonChars[i]);
    }
    cbm.findButton('X').color = 0;
    cbm.redrawButtons();
    cbm.hideCursor();
    cbm.locate(2, 23);
    cbm.addLink('link: orig. knight/dragon blog entry', 'https://techwithdave.davevw.com/2022/08/knight-vs-dragon-prototype-on-commodore.html');
    cbm.homeScreen();
    var knight = cbm.sprites[0];
    var dragon = cbm.sprites[1];
    knight.image(knightImage);
    dragon.image(dragonImage);
    knight.size(true, true);
    dragon.size(true, true);
    knight.color(11);
    dragon.color(5);
    knight.move(50, 180);
    dragon.move(160, 180);
    knight.show();
    dragon.show();
    var random0to4 = function () { return Math.floor(Math.random() * 5); };
    var collisions = [];
    cbm.onSpriteCollision = function (collisionSprites, collisionBackground) {
        collisions = collisionSprites;
    };
    cbm.repeat(function () {
        collisions = [];
        switch (random0to4()) {
            case 1:
                if (knight._x > 0)
                    knight.move(knight._x - 5, knight._y);
                break;
            case 2:
                if (knight._x < 180)
                    knight.move(knight._x + 5, knight._y);
                break;
            case 3:
                if (knight._y > 120)
                    knight.move(knight._x, knight._y - 5);
                break;
            case 4:
                if (knight._y < 200)
                    knight.move(knight._x, knight._y + 5);
        }
        switch (random0to4()) {
            case 1:
                if (dragon._x > 0)
                    dragon.move(dragon._x - 5, dragon._y);
                break;
            case 2:
                if (dragon._x < 180)
                    dragon.move(dragon._x + 5, dragon._y);
                break;
            case 3:
                if (dragon._y > 120)
                    dragon.move(dragon._x, dragon._y - 5);
                break;
            case 4:
                if (dragon._y < 200)
                    dragon.move(dragon._x, dragon._y + 5);
                break;
        }
        if (collisions.length == 2)
            cbm.border(2);
        else
            cbm.border(3);
    }, null, 100);
};
var dotsVectors = [
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
    { xd: 0, yd: 0 },
];
var dots = function () {
    cbm.clear();
    dotsForegroundText();
    dotsCreateSprites();
    dotsMoveLoop();
};
var dotsForegroundText = function () {
    var promotion = false;
    if (promotion) {
        cbm.newLine();
        cbm.newLine();
        cbm.newLine();
        cbm.foreground(3);
        cbm.out(cbm.chr$(14)); // upper/lowercase
        cbm.largeText('Simulating');
        cbm.newLine();
        cbm.foreground(7);
        cbm.out('  ');
        cbm.largeText(' Sprites');
        cbm.newLine();
        cbm.foreground(1);
        cbm.largeText('    in');
        cbm.newLine();
        cbm.foreground(10);
        cbm.largeText('TypeScript');
        cbm.newLine();
        cbm.locate(1, 23);
        cbm.foreground(15);
        cbm.out("".concat(cbm.chr$(18), "ONLY").concat(cbm.chr$(146), " LOOKS like a C64 "));
        cbm.foreground(14);
        cbm.underline(3);
        cbm.addLink('github: cbmish', 'https://github.com/davervw/cbmish-script');
        cbm.homeScreen();
    }
    else {
        cbm.foreground(15);
        cbm.out(cbm.chr$(18));
        for (var y = 8; y < 16; ++y) {
            cbm.locate(20, y);
            cbm.out("".concat(cbm.chr$(18), " "));
        }
        cbm.out(cbm.chr$(146));
    }
};
var dotsCollision = [];
var dotsMoveLoop = function () {
    cbm.onSpriteCollision = function (collisionSprites, collisionBackground) {
        var collisionSet = new Set(__spreadArray(__spreadArray([], collisionSprites, true), collisionBackground, true));
        dotsCollision = Array.from(collisionSet);
    };
    cbm.repeat(function () { dotsMove(); }, undefined, 20);
};
var dotsMove = function () {
    var origin = { x: 24, y: 50 };
    for (var i = 0; i < cbm.sprites.length; ++i) {
        var sprite = cbm.sprites[i];
        var oldPosition = { x: sprite._x, y: sprite._y };
        // calculate new position
        var x = sprite._x + dotsVectors[i].xd;
        var y = sprite._y + dotsVectors[i].yd;
        // check off screen
        if (x < origin.x || x >= origin.x + 320 - 24) {
            dotsVectors[i].xd = -dotsVectors[i].xd;
            x = sprite._x + dotsVectors[i].xd;
        }
        if (y < origin.y || y >= origin.y + 200 - 21) {
            dotsVectors[i].yd = -dotsVectors[i].yd;
            y = sprite._y + dotsVectors[i].yd;
        }
        // move and test collision
        dotsCollision = [];
        sprite.move(x, y);
        if (dotsCollision.includes(i)) {
            sprite.move(oldPosition.x, oldPosition.y);
            // randomize vectors so sprites go somewhere else
            for (var _i = 0, dotsCollision_1 = dotsCollision; _i < dotsCollision_1.length; _i++) {
                var j = dotsCollision_1[_i];
                do {
                    dotsVectors[j] = {
                        xd: Math.floor(Math.random() * 11 - 5),
                        yd: Math.floor(Math.random() * 11 - 5)
                    };
                    cbm.sprites[j]._color = sprite._color;
                } while (dotsVectors[j].xd == 0 && dotsVectors[j].yd == 0);
            }
            dotsCheckResetColors();
        }
    }
};
var dotsResetId = undefined;
var dotsCheckResetColors = function () {
    var _this = this;
    if (this.dotsResetId != null)
        return; // already set to reset, wait
    var colors = new Set();
    cbm.sprites.forEach(function (sprite) { return colors.add(sprite._color); });
    if (colors.size > 1)
        return; // multiple colors so don't reset yet
    // if got here, then all dots are the same color
    this.dotsResetId = setTimeout(function () {
        // reset colors
        var color = 0;
        cbm.sprites.forEach(function (sprite) {
            if (color == cbm.getBackground())
                color = (color + 1) & 15;
            sprite.color(color);
            color = (color + 1) & 15;
        });
        _this.dotsResetId = null;
    }, 3000);
};
var dotsCreateSprites = function () {
    var origin = { x: 24, y: 50 };
    cbm.hideSprites();
    var circle = dotSpriteImage();
    var color = 0;
    var _loop_1 = function (i) {
        var sprite = cbm.sprites[i];
        var image = spriteXorWithNumber(circle, i);
        sprite.image(image);
        if (color == cbm.getBackground())
            ++color;
        sprite.color(color);
        color = (color + 1) & 15;
        sprite.size(false, false);
        cbm.onSpriteCollision = function (_1, _2) {
            var x = origin.x + Math.random() * (320 - 24);
            var y = origin.y + Math.random() * (200 - 21);
            sprite.move(x, y);
        };
        var x = origin.x + Math.random() * (320 - 24);
        var y = origin.y + Math.random() * (200 - 21);
        sprite.move(x, y);
        do {
            dotsVectors[i] = {
                xd: Math.floor(Math.random() * 11 - 5),
                yd: Math.floor(Math.random() * 11 - 5)
            };
        } while (dotsVectors[i].xd == 0 || dotsVectors[i].yd == 0);
        if ((i & 1) == 1)
            sprite.sendToBack();
        sprite.show();
    };
    for (var i = 0; i < cbm.sprites.length; ++i) {
        _loop_1(i);
    }
    cbm.onSpriteCollision = function (_1, _2) { return null; };
};
var dotSpriteImage = function () {
    var width = 24;
    var height = 21;
    var radius = height / 2;
    var image = [];
    for (var i = 0; i < height; i += 1) {
        var y = i - radius;
        var angle = Math.asin(y / radius);
        var x = Math.floor(radius * Math.cos(angle));
        var s = "00";
        for (var j = 0; j < Math.floor(radius - x); ++j)
            s += '0';
        for (var j = 0; j < x; ++j)
            s += '11';
        while (s.length < width)
            s += '0';
        image.push(Number.parseInt(s.slice(0, 8), 2));
        image.push(Number.parseInt(s.slice(8, 16), 2));
        image.push(Number.parseInt(s.slice(16, 24), 2));
    }
    return image;
};
var spriteXorWithNumber = function (image, n) {
    image = __spreadArray([], image, true); // make copy for modification
    var s = "".concat(n);
    if (/^[0-9]$/.test(s)) { // one digit
        var iFont = s.charCodeAt(0) * 8;
        for (var i = 0; i < 8; ++i)
            image[(8 + i) * 3 + 1] ^= c64_char_rom[iFont + i];
    }
    else if (/^[0-9][0-9]$/.test(s)) { // two digits
        var iFont0 = s.charCodeAt(0) * 8;
        var iFont1 = s.charCodeAt(1) * 8;
        for (var i = 0; i < 8; ++i) {
            image[(8 + i) * 3 + 0] ^= c64_char_rom[iFont0 + i] >> 4;
            image[(8 + i) * 3 + 1] ^= ((c64_char_rom[iFont0 + i] & 15) << 4) | (c64_char_rom[iFont1 + i] >> 4);
            image[(8 + i) * 3 + 2] ^= (c64_char_rom[iFont1 + i] & 15) << 4;
        }
    }
    else
        throw "expected one or two digit number, not ".concat(n);
    return image;
};
mainMenu();
//# sourceMappingURL=sample.js.map