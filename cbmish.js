// cbmish.ts
// Console (display output) that has features resembling an 8-bit classic system
// Copyright (c) 2022 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com
var CbmishConsole = /** @class */ (function () {
    function CbmishConsole() {
        var _a;
        this.dirtyx = 0;
        this.dirtyy = 0;
        this.dirtywidth = 0;
        this.dirtyheight = 0;
        this.fg = 14;
        this.bg = 6;
        this.bd = 14;
        this.row = 0;
        this.col = 0;
        this.lowercase = true;
        this.reverse = false;
        this.cursorBlinking = false;
        this.cursorShown = false;
        this.escapePressed = false;
        this.canvas = document.getElementById("screen");
        this.rows = Math.floor(this.canvas.getAttribute('height') / 8);
        this.cols = Math.floor(this.canvas.getAttribute('width') / 8);
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        this.imgData = this.ctx.getImageData(0, 0, this.cols * 8, this.rows * 8);
        this.bitmap = this.imgData.data;
        this.charCells = [];
        this.colorCells = [];
        this.buttons = [];
        this.palette = [
            [0, 0, 0, 255],
            [255, 255, 255, 255],
            [192, 0, 0, 255],
            [0, 255, 255, 255],
            [160, 32, 160, 255],
            [32, 160, 32, 255],
            [64, 64, 192, 255],
            [255, 255, 128, 255],
            [255, 128, 0, 255],
            [128, 64, 0, 255],
            [192, 32, 32, 255],
            [64, 64, 64, 255],
            [128, 128, 128, 255],
            [160, 255, 160, 255],
            [96, 128, 240, 255],
            [192, 192, 192, 255],
        ];
    }
    CbmishConsole.prototype.CbmishConsole = function () {
        var _this = this;
        this.init();
        window.addEventListener('keypress', function (event) { _this.keypress(event); });
        window.addEventListener('keydown', function (event) { _this.keydown(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
        window.addEventListener('keyup', function (event) { _this.keyup(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
        this.canvas.addEventListener('click', function (event) { return _this.onclickcanvas(event); }, false);
        this.canvas.addEventListener('mousemove', function (event) { return _this.onmousemovecanvas(event); }, false);
        this.canvas.addEventListener('mouseleave', function (event) { return _this.onmouseleavecanvas(event); }, false);
    };
    CbmishConsole.prototype.init = function () {
        this.buttons = [];
        this.hideCursor();
        this.reverse = false;
        this.lowercase = true;
        this.border(14);
        this.background(6);
        this.foreground(14);
        this.clear();
        this.out('\r    **** HTML/CSS/TYPESCRIPT ****\r');
        this.out('   github.com/davervw/cbmish-script\r\r');
        this.out(' 1GB RAM SYSTEM  1073741824 BYTES FREE\r\r');
        this.out('READY.\r');
        this.blinkCursor();
        this.foreground(1);
    };
    CbmishConsole.prototype.out = function (obj) {
        if (obj == null)
            return;
        var wasBlinking = this.hideCursor();
        var s = obj.toString();
        for (var i = 0; i < s.length; ++i)
            this.outChar(s.charAt(i));
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.outChar = function (s) {
        if (s.length != 1)
            throw "expected string of exactly one character";
        var c = s.charCodeAt(0);
        var petscii = null;
        if (c >= 0xee00 && c <= 0xefff) {
            petscii = c & 511;
        }
        else {
            if (s == '\r') {
                this.newLine();
                return;
            }
            if (c == 14) {
                this.lowercase = true;
                return;
            }
            if (c == 142) {
                this.lowercase = false;
                return;
            }
            if (c == 18) {
                this.reverse = true;
                return;
            }
            if (c == 146) {
                this.reverse = false;
                return;
            }
            if (c == 19) {
                this.homeScreen();
                return;
            }
            if (c == 29) {
                this.right();
                return;
            }
            if (c == 157) {
                this.left();
                return;
            }
            if (c == 17) {
                this.down();
                return;
            }
            if (c == 145) {
                this.up();
                return;
            }
            if (c == 20) {
                this["delete"](false);
                return;
            }
            if (c == 148) {
                this.insert();
                return;
            }
            if (c == 147) {
                this.clear();
                return;
            }
            if (c < 32 || c >= 126)
                return;
            if (c == 96 || c == '|'.charCodeAt(0))
                return;
            petscii = this.ascii_to_petscii(c);
        }
        if (this.reverse)
            petscii += 128;
        var i = petscii * 8;
        this.charCells[this.col + this.row * this.cols] = petscii;
        this.colorCells[this.col + this.row * this.cols] = this.fg;
        var chardata = c64_char_rom.slice(i, i + 8);
        this.drawC64Char(chardata, this.col * 8, this.row * 8, this.fg);
        if (++this.col >= this.cols) {
            this.col = 0;
            if (++this.row >= this.rows) {
                this.row = this.rows - 1;
                this.scrollScreen();
            }
        }
    };
    CbmishConsole.prototype.newLine = function () {
        var wasBlinking = this.hideCursor();
        if (++this.row >= this.rows) {
            this.row = this.rows - 1;
            this.scrollScreen();
        }
        this.col = 0;
        this.reverse = false;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype["delete"] = function (deleteInto) {
        var wasBlinking = this.hideCursor();
        try {
            if (!deleteInto) {
                var save = this.col;
                this.left();
                var noMove = (this.col == save);
                if (noMove)
                    return;
            }
            var offset = this.row * this.cols;
            var dest = this.col;
            for (var i = dest; i < this.cols - 1; ++i) {
                this.colorCells[offset + i] = this.colorCells[offset + i + 1];
                this.pokeScreen(1024 + offset + i, this.charCells[offset + i + 1]);
            }
            this.colorCells[offset + this.cols - 1] = this.fg;
            this.pokeScreen(1024 + offset + this.cols - 1, 32);
        }
        finally {
            if (wasBlinking)
                this.blinkCursor();
        }
    };
    CbmishConsole.prototype.insert = function () {
        if (this.col == this.cols - 1)
            return;
        var wasBlinking = this.hideCursor();
        var offset = this.row * this.cols;
        for (var i = this.cols - 1; i > this.col; --i) {
            this.colorCells[offset + i] = this.colorCells[offset + i - 1];
            this.pokeScreen(1024 + offset + i, this.charCells[offset + i - 1]);
        }
        this.colorCells[offset + this.col] = this.fg;
        this.pokeScreen(1024 + offset + this.col, 32);
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.clear = function () {
        var wasBlinking = this.hideCursor();
        this.homeScreen();
        var limit = this.rows * this.cols - 1; // one less to avoid scroll
        for (var i = 0; i < limit; ++i)
            this.out(' ');
        this.poke(1024 + limit, 32);
        this.poke(13.5 * 4096 + limit, this.fg);
        this.homeScreen();
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.homeScreen = function () {
        var wasBlinking = this.hideCursor();
        this.row = 0;
        this.col = 0;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.homeLine = function () {
        var wasBlinking = this.hideCursor();
        this.col = 0;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.endLine = function () {
        var wasBlinking = this.hideCursor();
        this.col = this.cols - 1;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.endScreen = function () {
        var wasBlinking = this.hideCursor();
        this.col = this.cols - 1;
        this.row = this.rows - 1;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.left = function () {
        var wasBlinking = this.hideCursor();
        if (this.col > 0 || this.row > 0) {
            if (--this.col < 0) {
                this.col = this.cols - 1;
                --this.row;
            }
        }
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.topLine = function () {
        var wasBlinking = this.hideCursor();
        this.row = 0;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.bottomLine = function () {
        var wasBlinking = this.hideCursor();
        this.row = this.rows - 1;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.right = function () {
        var wasBlinking = this.hideCursor();
        if (++this.col >= this.cols) {
            this.col = 0;
            this.down();
        }
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.up = function () {
        var wasBlinking = this.hideCursor();
        if (this.row > 0)
            --this.row;
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.down = function () {
        var wasBlinking = this.hideCursor();
        if (++this.row >= this.rows) {
            this.scrollScreen();
            this.row = this.rows - 1;
        }
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.ascii_to_petscii = function (c) {
        if (c < 32)
            return 32;
        if (c > 127)
            return 32;
        if (c >= 32 && c <= 63)
            return c;
        if (this.lowercase) {
            if (c >= 64 && c <= 95)
                return c - 64; // @ABC...Z[\]_
            if (c >= 97 && c <= 96 + 26)
                return c - 96 + 256;
        }
        else {
            if (c >= 64 && c <= 95)
                return c - 64; // @ABC...Z[\]_
            if (c >= 97 && c <= 96 + 26)
                return c - 96; // TODO: graphics
        }
        return 32;
    };
    CbmishConsole.prototype.poke = function (address, value) {
        var wasBlinking = this.hideCursor();
        if (address >= 1024 && address < 1024 + this.rows * this.cols)
            this.pokeScreen(address, value);
        else if (address >= 13.5 * 4096 && address < 13.5 * 4096 + this.rows * this.cols) {
            this.colorCells[address - 13.5 * 4096] = value & 0xF;
            var c = this.charCells[address - 13.5 * 4096];
            this.pokeScreen(address - 13.5 * 4096 + 1024, c);
        }
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.pokeScreen = function (address, value) {
        if (address < 1024 || address >= 2024)
            return;
        if (value < 0 || value > 511)
            throw "expected value 0 to 511";
        var i = value * 8;
        this.charCells[address - 1024] = value;
        var col = (address - 1024) % this.cols;
        var row = Math.floor((address - 1024) / this.cols);
        var chardata = c64_char_rom.slice(i, i + 8);
        this.drawC64Char(chardata, col * 8, row * 8, this.colorCells[address - 1024]);
    };
    CbmishConsole.prototype.drawC64Char = function (chardata, x, y, fg) {
        var _this = this;
        fg = fg & 0xF;
        for (var r = 0; r < 8; ++r) {
            for (var b = 0; b < 8; ++b) {
                var j = (x + (7 - b) + (y + r) * this.cols * 8) * 4;
                if ((chardata[r] & (1 << b)) != 0) {
                    this.bitmap[j + 0] = this.palette[fg][0];
                    this.bitmap[j + 1] = this.palette[fg][1];
                    this.bitmap[j + 2] = this.palette[fg][2];
                    this.bitmap[j + 3] = this.palette[fg][3];
                }
                else
                    this.bitmap[j + 3] = 0; // set alpha component to transparent
            }
        }
        requestAnimationFrame(function () { return _this.animationCallback(); });
        if (this.dirtywidth == 0 && this.dirtyheight == 0) {
            this.dirtyx = x;
            this.dirtyy = y;
            this.dirtywidth = 8;
            this.dirtyheight = 8;
            return;
        }
        if (x < this.dirtyx) {
            this.dirtywidth += this.dirtyx - x;
            this.dirtyx = x;
        }
        else if (x + 8 > this.dirtyx + this.dirtywidth)
            this.dirtywidth += (x + 8 - (this.dirtyx + this.dirtywidth));
        if (y < this.dirtyy) {
            this.dirtyheight += this.dirtyy - y;
            this.dirtyy = y;
        }
        else if (y + 8 > this.dirtyy + this.dirtyheight)
            this.dirtyheight += (y + 8 - (this.dirtyy + this.dirtyheight));
    };
    CbmishConsole.prototype.scrollScreen = function () {
        // remove top line of screen from memory
        this.charCells.splice(0, this.cols);
        this.colorCells.splice(0, this.cols);
        // add back empty last line in memory
        for (var i = 0; i < this.cols; ++i) {
            this.charCells.push(32);
            this.colorCells.push(this.fg);
        }
        // redraw from char/color cells memory
        this.redraw();
    };
    CbmishConsole.prototype.redraw = function () {
        var wasBlinking = this.hideCursor();
        var limit = this.rows * this.cols;
        for (var i = 0; i < limit; ++i)
            this.poke(13.5 * 4096 + i, this.colorCells[i]);
        if (wasBlinking)
            this.blinkCursor();
    };
    CbmishConsole.prototype.animationCallback = function () {
        if (this.dirtywidth == 0 || this.dirtyheight == 0)
            return;
        this.ctx.putImageData(this.imgData, 0, 0, this.dirtyx, this.dirtyy, this.dirtywidth, this.dirtyheight);
        this.dirtyx = 0;
        this.dirtyy = 0;
        this.dirtywidth = 0;
        this.dirtyheight = 0;
    };
    CbmishConsole.prototype.foreground = function (fg) {
        this.fg = fg;
    };
    CbmishConsole.prototype.background = function (bg) {
        var canvas = document.getElementsByTagName('canvas');
        canvas[1].outerHTML = "<canvas class=\"background background" + (bg & 0xF) + "\"></canvas>";
        this.bg = bg;
    };
    CbmishConsole.prototype.getBackground = function () {
        return this.bg;
    };
    CbmishConsole.prototype.border = function (color) {
        var canvas = document.getElementsByTagName('canvas');
        canvas[0].outerHTML = "<canvas class=\"border border" + (color & 0xF) + "\"></canvas>";
        this.bd = color;
    };
    CbmishConsole.prototype.getBorder = function () {
        return this.bd;
    };
    CbmishConsole.prototype.hideCursor = function () {
        var wasBlinking = this.cursorBlinking;
        if (this.cursorShown)
            this.blinkCursor();
        if (this.cursorBlinking) {
            clearInterval(this.cursorIntervalId);
            this.cursorIntervalId = undefined;
            this.cursorBlinking = false;
        }
        return wasBlinking;
    };
    CbmishConsole.prototype.blinkCursor = function () {
        var _this = this;
        if (!this.cursorBlinking) {
            this.cursorIntervalId = setInterval(function () { return _this.blinkCursor(); }, 500);
            this.cursorBlinking = true;
        }
        this.cursorBlinking = true;
        var offset = this.col + this.row * this.cols;
        if (this.cursorShown) {
            this.colorCells[offset] = this.cursorSaveColor;
            this.cursorShown = false;
        }
        else {
            this.cursorSaveColor = this.colorCells[offset];
            this.colorCells[offset] = this.fg;
            this.cursorShown = true;
        }
        this.pokeScreen(1024 + offset, this.charCells[offset] ^ 128);
    };
    CbmishConsole.prototype.keypress = function (event) {
        var key = event.key;
        if (key.length == 1)
            this.out(key);
    };
    CbmishConsole.prototype.keydown = function (key, shiftKey, ctrlKey, altKey) {
        if (key == 'Home' && !altKey) {
            if (shiftKey && !ctrlKey)
                this.clear();
            else if (!shiftKey) // and any ctrlKey or not
                this.homeScreen();
        }
        else if (key == 'End' && !shiftKey && !altKey) {
            if (ctrlKey)
                this.endScreen();
            else
                this.endLine();
        }
        else if (key == 'ArrowUp' && !altKey) {
            if (ctrlKey)
                this.topLine();
            else
                this.up();
        }
        else if (key == 'ArrowDown' && !altKey) {
            if (ctrlKey)
                this.bottomLine();
            else
                this.down();
        }
        else if (key == 'ArrowLeft' && !altKey) {
            if (ctrlKey)
                this.homeLine();
            else
                this.left();
        }
        else if (key == 'ArrowRight' && !altKey) {
            if (ctrlKey)
                this.endLine();
            else
                this.right();
        }
        else if (key == 'Enter')
            this.newLine();
        else if ((key == 'Backspace' || key == 'Delete')
            && !shiftKey && !ctrlKey && !altKey)
            this["delete"](key == 'Delete');
        else if (key == 'Insert' && !ctrlKey && !altKey
            || (key == 'Backspace' || key == 'Delete') && shiftKey && !ctrlKey && !altKey)
            this.insert();
        else if (key == 'Escape' && !shiftKey && !ctrlKey && !altKey)
            this.escapePressed = true;
        else if (key == 'PageUp' && !shiftKey && !ctrlKey && !altKey && this.escapePressed)
            this.init();
        else if (key == 'Cancel' && !shiftKey && ctrlKey && !altKey)
            this.init();
    };
    CbmishConsole.prototype.keyup = function (key, shiftKey, ctrlKey, altKey) {
        if (key == 'Escape' && !shiftKey && !ctrlKey && !altKey)
            this.escapePressed = false;
    };
    CbmishConsole.prototype.repeat = function (fn, count, delayms) {
        var _this = this;
        if (count === void 0) { count = undefined; }
        if (delayms === void 0) { delayms = 5; }
        if (this.repeatIntervalId != null)
            throw "repeat is already busy";
        var wasBlinking = this.hideCursor();
        var i = 0;
        this.repeatIntervalId = setInterval(function () {
            if (!_this.escapePressed && (count == null || i++ < count))
                fn();
            else {
                clearInterval(_this.repeatIntervalId);
                _this.repeatIntervalId = undefined;
                if (wasBlinking)
                    _this.blinkCursor();
            }
            if (_this.escapePressed)
                _this.out('\rBREAK\rREADY.\r');
        }, delayms);
        return this.repeatIntervalId;
    };
    CbmishConsole.prototype.chr$ = function (value) {
        if (value >= 0 && value <= 31)
            return String.fromCharCode(value); // control codes        
        if (value >= 128 && value <= 159)
            return String.fromCharCode(value); // shift control codes
        if (this.lowercase && value >= 'A'.charCodeAt(0) && value <= 'Z'.charCodeAt(0))
            return String.fromCharCode(value - 'A'.charCodeAt(0) + 'a'.charCodeAt(0));
        if (this.lowercase && value >= 'a'.charCodeAt(0) && value <= 'z'.charCodeAt(0))
            return String.fromCharCode(value - 'a'.charCodeAt(0) + 'A'.charCodeAt(0));
        if (value >= 32 && value <= 95)
            return String.fromCharCode(value);
        if (value >= 96 && value <= 127)
            return String.fromCharCode(0xee00 + value - 32 + (this.lowercase ? 256 : 0));
        if (value >= 160 && value <= 191)
            return String.fromCharCode(0xee00 + value - 64 + (this.lowercase ? 256 : 0));
        if (value >= 192 && value <= 254)
            return String.fromCharCode(0xee00 + value - 128 + (this.lowercase ? 256 : 0));
        if (value == 255)
            return String.fromCharCode(0xee5e + (this.lowercase ? 256 : 0)); // pi special case
        return undefined;
    };
    CbmishConsole.prototype.locate = function (x, y) {
        var oldx = this.row;
        var oldy = this.col;
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
            throw "invalid position";
        var wasBlinking = this.hideCursor();
        this.col = x;
        this.row = y;
        if (wasBlinking)
            this.blinkCursor();
        return [oldx, oldy];
    };
    CbmishConsole.prototype.petsciiPokesChart = function () {
        this.reverse = false;
        for (var row = 0; row < 16; ++row) {
            for (var col = 0; col < 16; ++col) {
                this.poke(1024 + col + (row + 8) * 40 + 4, col + row * 16);
                this.poke(1024 + col + (row + 8) * 40 + 21, col + row * 16 + 256);
            }
        }
        for (var i = 7 * 40; i < 1000; ++i)
            this.poke(13.5 * 4096 + i, 1);
        this.foreground(14);
        for (var i = 0; i < 16; ++i) {
            this.locate(3, 8 + i);
            if (i < 10)
                this.out(i);
            else
                this.out(String.fromCharCode(65 + i - 10));
        }
        this.out('\r');
        this.right();
        this.right();
        this.right();
        this.right();
        this.out('0123456789ABCDEF 0123456789ABCDEF');
    };
    CbmishConsole.prototype.petsciiChr$Chart = function () {
        for (var row = 0; row < 16; ++row) {
            for (var col = 0; col < 16; ++col) {
                var i = row * 16 + col;
                this.lowercase = false;
                this.locate(col + 4, row + 8);
                if ((i & 127) > 32)
                    this.out(this.chr$(i));
                else
                    this.out(' ');
                this.lowercase = true;
                this.locate(col + 21, row + 8);
                if ((i & 127) > 32)
                    this.out(this.chr$(i));
                else
                    this.out(' ');
            }
        }
        for (var i = 7 * 40; i < 1000; ++i)
            this.poke(13.5 * 4096 + i, 1);
        this.foreground(14);
        for (var i = 0; i < 16; ++i) {
            this.locate(3, 8 + i);
            if (i < 10)
                this.out(i);
            else
                this.out(String.fromCharCode(65 + i - 10));
        }
        this.out('\r');
        this.right();
        this.right();
        this.right();
        this.right();
        this.out('0123456789ABCDEF 0123456789ABCDEF');
    };
    CbmishConsole.prototype.maze = function (rows) {
        var _this = this;
        if (rows === void 0) { rows = this.rows; }
        this.lowercase = false;
        this.newLine();
        this.up();
        this.repeat(function () { return _this.out(_this.chr$(109.5 + Math.random())); }, this.cols * rows - 1, 0);
    };
    CbmishConsole.prototype.onclickcanvas = function (event) {
        var x = Math.floor(event.offsetX / 8);
        var y = Math.floor(event.offsetY / 8);
        //console.log(`click ${x},${y}`)
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.checkClick(x, y);
        }
        event.preventDefault();
    };
    CbmishConsole.prototype.onmousemovecanvas = function (event) {
        var x = Math.floor(event.offsetX / 8);
        var y = Math.floor(event.offsetY / 8);
        //console.log(`mousemove ${x},${y}`)
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.checkMove(x, y);
        }
    };
    CbmishConsole.prototype.onmouseleavecanvas = function (event) {
        var x = Math.floor(event.offsetX / 8);
        var y = Math.floor(event.offsetY / 8);
        //console.log(`mouseleave ${x},${y}`)
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.checkLeave();
        }
    };
    CbmishConsole.prototype.addButton = function (text, context) {
        var _this = this;
        if (context === void 0) { context = undefined; }
        this.lowercase = false;
        var normal = '\x8E' + this.chr$(0x75);
        for (var i = 1; i <= text.length; ++i)
            normal += this.chr$(0x60);
        normal += this.chr$(0x69) + '\x11';
        for (var i = 1; i <= text.length + 2; ++i)
            normal += '\x9D';
        normal += this.chr$(0x62) + '\x0E' + text + '\x8E' + this.chr$(0x62) + '\x11';
        for (var i = 1; i <= text.length + 2; ++i)
            normal += '\x9D';
        normal += '\x8E' + this.chr$(0x6A);
        for (var i = 1; i <= text.length; ++i)
            normal += this.chr$(0x60);
        normal += this.chr$(0x6B) + '\x91\x91';
        for (var i = 1; i <= text.length + 2; ++i)
            normal += '\x9D';
        var hover = '\x8E' + this.chr$(0xEC);
        for (var i = 1; i <= text.length; ++i)
            hover += this.chr$(0xA2);
        hover += this.chr$(0xFB) + '\x11';
        for (var i = 1; i <= text.length + 2; ++i)
            hover += '\x9D';
        hover += '\x12' + this.chr$(0xA1) + '\x0E' + text + '\x8E\x92' + this.chr$(0xA1) + '\x11';
        for (var i = 1; i <= text.length + 2; ++i)
            hover += '\x9D';
        hover += '\x8E' + this.chr$(0xFC) + '\x12';
        for (var i = 1; i <= text.length; ++i)
            hover += this.chr$(0xA2);
        hover += '\x92' + this.chr$(0xBE) + '\x91\x91';
        for (var i = 1; i <= text.length + 2; ++i)
            hover += '\x9D';
        this.out(normal);
        var _cbm = this;
        var button = {
            "text": text,
            "context": context,
            "color": this.fg,
            "hovered": false,
            "normal": normal,
            "hover": hover,
            "top": this.row,
            "left": this.col,
            "bottom": this.row + 3,
            "right": this.col + text.length + 2,
            "checkBounds": function (x, y) {
                return (x >= button.left && x < button.right && y >= button.top && y < button.bottom);
            },
            "onHover": function () {
                var wasBlinking = _cbm.hideCursor();
                button.hovered = true;
                var saveColor = _this.fg;
                _this.fg = button.color;
                var oldRowCol = _cbm.locate(button.left, button.top);
                _cbm.out(hover);
                _this.fg = saveColor;
                _this.row = oldRowCol[0], _this.col = oldRowCol[1];
                if (wasBlinking)
                    _cbm.blinkCursor();
            },
            "onLeave": function () {
                var wasBlinking = _cbm.hideCursor();
                button.hovered = false;
                var saveColor = _this.fg;
                _this.fg = button.color;
                var oldRowCol = _cbm.locate(button.left, button.top);
                _cbm.out(normal);
                _this.fg = saveColor;
                _this.row = oldRowCol[0], _this.col = oldRowCol[1];
                if (wasBlinking)
                    _cbm.blinkCursor();
            },
            "checkClick": function (x, y) {
                if (button.checkBounds(x, y)) {
                    var wasBlinking = _cbm.hideCursor();
                    var saveColor = _this.fg;
                    _this.fg = button.color;
                    var oldRowCol = _cbm.locate(button.left, button.top);
                    _cbm.out(normal);
                    _this.fg = saveColor;
                    if (button.onclick != null)
                        button.onclick();
                    _this.row = oldRowCol[0], _this.col = oldRowCol[1];
                    if (wasBlinking)
                        _cbm.blinkCursor();
                    setTimeout(function () { return button.onHover(); }, 50);
                }
            },
            "checkMove": function (x, y) {
                if (button.hovered) {
                    if (!button.checkBounds(x, y))
                        button.onLeave();
                }
                else {
                    if (button.checkBounds(x, y))
                        button.onHover();
                }
            },
            "checkLeave": function () {
                if (button.hovered)
                    button.onLeave();
            },
            "onclick": function () {
                console.log("onClick: " + button.text);
            }
        };
        this.buttons.push(button);
        return button;
    };
    CbmishConsole.prototype.findButton = function (text) {
        var i = 0;
        while (i < this.buttons.length && this.buttons[i].text !== text)
            ++i;
        if (i < this.buttons.length)
            return this.buttons[i];
        return undefined;
    };
    CbmishConsole.prototype.removeButton = function (button) {
        var i = 0;
        while (i < this.buttons.length && this.buttons[i] !== button)
            ++i;
        if (i < this.buttons.length) {
            // remove from screen
            var saveColor = this.fg;
            this.fg = button.fg;
            for (var y = button.top; y < button.bottom; ++y) {
                for (var x = button.left; x < button.right; ++x) {
                    var offset = x + y * this.cols;
                    this.pokeScreen(1024 + offset, 32);
                }
            }
            this.fg = saveColor;
            // remove from collection
            this.buttons.splice(i, 1);
        }
    };
    CbmishConsole.prototype.colorPicker = function () {
        var _cbm = this;
        this.init();
        var saveRowCol = [this.row, this.col];
        var saveColor = this.fg;
        var setter = function (value) { };
        var colorFn = function (value) {
            setter(value);
            redrawRadioButtons();
        };
        for (var i = 0; i < 2; ++i) {
            var _loop_1 = function (j) {
                var color = i * 8 + j;
                var x = j * 5;
                var y = i * 3 + 8;
                this_1.foreground(color);
                this_1.locate(x, y);
                var button = this_1.addButton(color.toString());
                button.onclick = function () { colorFn(color); };
            };
            var this_1 = this;
            for (var j = 0; j < 8; ++j) {
                _loop_1(j);
            }
        }
        this.fg = saveColor;
        this.locate(3, 15);
        var fore = this.addButton("Foreground");
        fore.onclick = function () {
            setter = setForeground;
            redrawRadioButtons();
        };
        this.locate(3, 18);
        var back = this.addButton("Background");
        back.onclick = function () {
            setter = setBackground;
            redrawRadioButtons();
        };
        this.locate(3, 21);
        var bord = this.addButton("  Border  ");
        bord.onclick = function () {
            setter = setBorder;
            redrawRadioButtons();
        };
        var redrawRadioButtons = function () {
            _cbm.lowercase = false;
            _cbm.locate(1, fore.top + 1);
            _cbm.out(_cbm.chr$((setter === setForeground) ? 0x71 : 0x77));
            _cbm.locate(fore.right + 1, fore.top + 1);
            _cbm.out(fore.color + ' ');
            _cbm.locate(1, back.top + 1);
            _cbm.out(_cbm.chr$((setter === setBackground) ? 0x71 : 0x77));
            _cbm.locate(back.right + 1, back.top + 1);
            _cbm.out(_cbm.getBackground() + ' ');
            _cbm.locate(1, bord.top + 1);
            _cbm.out(_cbm.chr$((setter === setBorder) ? 0x71 : 0x77));
            _cbm.locate(bord.right + 1, bord.top + 1);
            _cbm.out(_cbm.getBorder() + ' ');
        };
        var eraseRadioButtons = function () {
            _cbm.locate(1, fore.top + 1);
            _cbm.out(' ');
            _cbm.locate(fore.right + 1, fore.top + 1);
            _cbm.out('  ');
            _cbm.locate(1, back.top + 1);
            _cbm.out(' ');
            _cbm.locate(back.right + 1, back.top + 1);
            _cbm.out('  ');
            _cbm.locate(1, bord.top + 1);
            _cbm.out(' ');
            _cbm.locate(bord.right + 1, bord.top + 1);
            _cbm.out('  ');
        };
        redrawRadioButtons();
        var setForeground = function (value) {
            _cbm.foreground(value);
            fore.color = value;
            _cbm.locate(fore.left, fore.top);
            _cbm.out(fore.normal);
            back.color = value;
            _cbm.locate(back.left, back.top);
            _cbm.out(back.normal);
            bord.color = value;
            _cbm.locate(bord.left, bord.top);
            _cbm.out(bord.normal);
        };
        var setBackground = function (value) {
            _cbm.background(value);
        };
        var setBorder = function (value) {
            _cbm.border(value);
        };
        this.locate(37, 0);
        var leave = this.addButton("X");
        leave.onclick = function () {
            setTimeout(function () {
                eraseRadioButtons();
                while (_cbm.buttons.length > 0)
                    _cbm.removeButton(_cbm.buttons[0]);
                for (var i = 0; i < _cbm.rows * _cbm.cols; ++i)
                    _cbm.poke(13.5 * 4096 + i, _cbm.fg);
                _cbm.row = saveRowCol[0], _cbm.col = saveRowCol[1];
                _cbm.blinkCursor();
            }, 250);
        };
        this.hideCursor();
    };
    return CbmishConsole;
}());
