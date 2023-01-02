// cbmish.ts
// Console (display output) that has features resembling an 8-bit classic system
// Copyright (c) 2022-2023 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com

class CbmishConsole {
    private dirtyx = 0;
    private dirtyy = 0;
    private dirtywidth = 0;
    private dirtyheight = 0;
    fg = 14;
    private bg = 6;
    private bd = 14;
    private ul = this.fg;
    private row = 0;
    private col = 0;
    lowercase: boolean = true;
    reverse: boolean = false;
    underlined: boolean = false;
    private cursorBlinking: boolean = false;
    private cursorShown: boolean = false;
    private cursorSaveColor: number;
    private cursorIntervalId: number | undefined;
    private repeatIntervalId: number | undefined;
    private escapePressed: boolean = false;
    private tabPressed: boolean = false;
    private fullScreen: boolean = false;
    private scale = 1;

    private rows = 25;
    private cols = 40;
    private ctx: CanvasRenderingContext2D;
    private imgData: ImageData;
    private bitmap: Uint8ClampedArray;

    private charCells: number[] = [];
    private colorCells: number[] = [];

    private buttons: any[] = [];
    
    public sprites = [];

    palette: number[][] = [
        [0, 0, 0, 255],       // [0] black
        [255, 255, 255, 255], // [1] white
        [192, 0, 0, 255],     // [2] red
        [0, 255, 255, 255],   // [3] cyan
        [160, 32, 160, 255],  // [4] purple
        [32, 160, 32, 255],   // [5] green
        [64, 64, 192, 255],   // [6] blue
        [255, 255, 128, 255], // [7] yellow
        [240, 128, 0, 255],   // [8] orange
        [128, 64, 0, 255],    // [9] brown
        [255, 128, 128, 255], // [10] lt red
        [64, 64, 64, 255],    // [11] dk gray
        [128, 128, 128, 255], // [12] med gray
        [160, 255, 160, 255], // [13] lt green
        [96, 128, 240, 255],  // [14] lt blue
        [192, 192, 192, 255], // [15] lt gray
    ];

    private cbmGraphicsKeys = [
        { 'key': 'a', 'code': 176 },
        { 'key': 'b', 'code': 191 },
        { 'key': 'c', 'code': 188 },
        { 'key': 'd', 'code': 172 },
        { 'key': 'e', 'code': 177 },
        { 'key': 'f', 'code': 187 },
        { 'key': 'g', 'code': 165 },
        { 'key': 'h', 'code': 180 },
        { 'key': 'i', 'code': 162 },
        { 'key': 'j', 'code': 181 },
        { 'key': 'k', 'code': 161 },
        { 'key': 'l', 'code': 182 },
        { 'key': 'm', 'code': 167 },
        { 'key': 'n', 'code': 170 },
        { 'key': 'o', 'code': 185 },
        { 'key': 'p', 'code': 175 },
        { 'key': 'q', 'code': 171 },
        { 'key': 'r', 'code': 178 },
        { 'key': 's', 'code': 174 },
        { 'key': 't', 'code': 163 },
        { 'key': 'u', 'code': 184 },
        { 'key': 'v', 'code': 190 },
        { 'key': 'w', 'code': 179 },
        { 'key': 'x', 'code': 189 },
        { 'key': 'y', 'code': 183 },
        { 'key': 'z', 'code': 173 },
        { 'key': '\\', 'code': 168 },
        { 'key': '^', 'code': 126 },
        { 'key': '@', 'code': 164 },
        { 'key': '-', 'code': 220 },
        { 'key': '=', 'code': 166 },
    ];

    public CbmishConsole() {
        const consoleElement = document.getElementsByTagName('console')[0];
        consoleElement.innerHTML = '<canvas class="border"></canvas><canvas class="background"></canvas><canvas class="foreground" width="320" height="200"></canvas><canvas class="sprites" width="320" height="200"></canvas>';
        const foregroundCanvas = consoleElement.getElementsByClassName("foreground")[0] as HTMLCanvasElement; 
        const topCanvas = consoleElement.getElementsByClassName("sprites")[0] as HTMLCanvasElement;
        const height = Number.parseInt(topCanvas.getAttribute('height'));
        const width = Number.parseInt(topCanvas.getAttribute('width'));
        this.rows = Math.floor(height / 8);
        this.cols = Math.floor(width / 8);
        this.ctx = foregroundCanvas.getContext("2d");
        this.imgData = this.ctx.getImageData(0, 0, this.cols*8, this.rows*8);
        this.bitmap = this.imgData.data;
        this.init();        
        window.addEventListener('keypress', (event: KeyboardEvent) => { this.keypress(event); });
        window.addEventListener('keydown', (event: KeyboardEvent) => { if (this.keydown(event.key, event.shiftKey, event.ctrlKey, event.altKey)) event.preventDefault(); });
        window.addEventListener('keyup', (event: KeyboardEvent) => { this.keyup(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
        topCanvas.addEventListener('click', (event: MouseEvent) => this.onclickcanvas(event), false);
        topCanvas.addEventListener('mousemove', (event: MouseEvent) => this.onmousemovecanvas(event), false);
        topCanvas.addEventListener('mouseleave', (event: MouseEvent) => this.onmouseleavecanvas(event), false);
        this.checkStartupButton();
        this.checkFullScreen();
        for (let i=0; i<8; ++i)
            this.sprites.push(this.spriteFactory(i));
    }

    public init() {
        this.hideCursor();
        this.reverse = false;
        this.lowercase = true;
        this.underlined = false;
        this.border(14);
        this.background(6);
        this.foreground(14);
	    this.clear();
        this.out('\r    **** HTML/CSS/TYPESCRIPT ****\r');
        this.out('   ');
        const link = 'github.com/davervw/cbmish-script';
        this.ul = 15;
        this.addLink(link, 'https://'+link);
        this.out('\r\r');
        this.out(' 1GB RAM SYSTEM  1073741824 BYTES FREE\r\r');
        this.out('READY.\r');
        this.blinkCursor();
        this.foreground(1);
    }

    public out(obj: any) {
        if (obj == null)
            return;

        let wasBlinking = this.hideCursor();

        const s = obj.toString();
        for (let i = 0; i < s.length; ++i)
            this.outChar(s.charAt(i));

        if (wasBlinking)
            this.blinkCursor();
    }

    private outChar(s: string) {
        if (s.length != 1)
            throw "expected string of exactly one character";

        const c = s.charCodeAt(0);
        let petscii: number|null = null;

        if (c >= 0xee00 && c <= 0xefff) {
            petscii = c & 511;
        } else {
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
            if (c == 2) {
                this.underlined = true;
                return;
            }
            if (c == 130) {
                this.underlined = false;
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
                this.delete(false);
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
        const i = petscii*8;

        this.charCells[this.col + this.row * this.cols] = petscii;
        this.colorCells[this.col + this.row * this.cols] = this.fg;

        const chardata = c64_char_rom.slice(i, i+8);

        this.drawChar(chardata, this.col, this.row, this.fg, this.underlined && !this.reverse, this.ul);

        if (++this.col >= this.cols) {
            this.col = 0;
            if (++this.row >= this.rows) {
                this.row = this.rows-1;
                this.scrollScreen();
            }
        }
    }

    public newLine() {
        let wasBlinking = this.hideCursor();

        if (++this.row >= this.rows) {
            this.row = this.rows-1;
            this.scrollScreen();
        }
        this.col = 0;
        this.reverse = false;
        this.underlined = false;

        if (wasBlinking)
            this.blinkCursor();
    }

    public delete(deleteInto: boolean) {
        let wasBlinking = this.hideCursor();
        try {
            if (!deleteInto) {
                let save = this.col;
                this.left();
                let noMove = (this.col == save);
                if (noMove)
                    return;
            }

            let offset = this.row * this.cols;
            let dest = this.col;
            for (let i=dest; i<this.cols-1; ++i) {
                this.colorCells[offset + i] = this.colorCells[offset + i + 1];
                this.pokeScreen(1024 + offset + i, this.charCells[offset + i + 1]);
            }
            this.colorCells[offset + this.cols - 1] = this.fg;
            this.pokeScreen(1024 + offset + this.cols - 1, 32);

        } finally {
            if (wasBlinking)
                this.blinkCursor();
        }
    }

    public insert() {
        if (this.col == this.cols - 1)
            return;

        let wasBlinking = this.hideCursor();

        let offset = this.row * this.cols;
        for (let i=this.cols-1; i>this.col; --i) {
            this.colorCells[offset + i] = this.colorCells[offset + i - 1];
            this.pokeScreen(1024 + offset + i, this.charCells[offset + i - 1]);
        }
        this.colorCells[offset + this.col] = this.fg;
        this.pokeScreen(1024 + offset + this.col, 32);

        if (wasBlinking)
            this.blinkCursor();
    }

    public clear() {
        let wasBlinking = this.hideCursor();
        this.eraseButtons();

        this.homeScreen();
        const limit = this.rows * this.cols - 1; // one less to avoid scroll
	    for (let i=0; i<limit; ++i)
	        this.out(' ');
        this.poke(1024 + limit, 32);
        this.poke(13.5 * 4096 + limit, this.fg);
	    this.homeScreen();

        this.redrawButtons();
        if (wasBlinking)
            this.blinkCursor();
    }

    public homeScreen() {
        let wasBlinking = this.hideCursor();

        this.row = 0;
        this.col = 0;

        if (wasBlinking)
            this.blinkCursor();
    }

    public homeLine() {
        let wasBlinking = this.hideCursor();

        this.col = 0;

        if (wasBlinking)
            this.blinkCursor();
    }

    public endLine() {
        let wasBlinking = this.hideCursor();

        this.col = this.cols - 1;

        if (wasBlinking)
            this.blinkCursor();
    }

    public endScreen() {
        let wasBlinking = this.hideCursor();

        this.col = this.cols - 1;
        this.row = this.rows - 1;

        if (wasBlinking)
            this.blinkCursor();
    }

    public left() {
        let wasBlinking = this.hideCursor();

        if (this.col > 0 || this.row > 0) {
            if (--this.col < 0) {
                this.col = this.cols-1;
                --this.row;
            }
        }

        if (wasBlinking)
            this.blinkCursor();
    }

    public topLine() {
        let wasBlinking = this.hideCursor();

        this.row = 0;

        if (wasBlinking)
            this.blinkCursor();
    }

    public bottomLine() {
        let wasBlinking = this.hideCursor();

        this.row = this.rows - 1;

        if (wasBlinking)
            this.blinkCursor();
    }

    public right() {
        let wasBlinking = this.hideCursor();

        if (++this.col >= this.cols) {
            this.col = 0;
            this.down();
        }

        if (wasBlinking)
            this.blinkCursor();
    }

    public up() {
        let wasBlinking = this.hideCursor();

        if (this.row > 0)
            --this.row;

        if (wasBlinking)
            this.blinkCursor();
    }

    public down() {
        let wasBlinking = this.hideCursor();

        if (++this.row >= this.rows) {
            this.scrollScreen();
            this.row = this.rows - 1;
        }

        if (wasBlinking)
            this.blinkCursor();
    }

    private ascii_to_petscii(c: number): number {
        if (c < 32) return 32;
        if (c > 127) return 32;
        if (c >= 32 && c <= 63) return c;
        if (this.lowercase) {
            if (c >= 64 && c <= 95) return c-64; // @ABC...Z[\]_
            if (c >= 97 && c <= 96+26) return c-96+256;
        } else {
            if (c >= 64 && c <= 95) return c-64; // @ABC...Z[\]_
            if (c >= 97 && c <= 96+26) return c-96; // TODO: graphics
        }
        return 32;
    }

    public poke(address: number, value: number) {
        let wasBlinking = this.hideCursor();

        if (address >= 1024 && address < 1024+this.rows*this.cols)
            this.pokeScreen(address, value);
        else if (address >= 13.5*4096 && address < 13.5*4096+this.rows*this.cols) {
            this.colorCells[address - 13.5*4096] = value & 0xF;
            let c = this.charCells[address - 13.5*4096];
            this.pokeScreen(address - 13.5*4096 + 1024, c);
        } else if (address == 646)
            this.fg = value & 15;
        else if (address = 53280)
            this.border(value & 15);
        else if (address = 53281)
            this.background(value & 15);

        if (wasBlinking)
            this.blinkCursor();
    }

    private pokeScreen(address: number, value: number) {
        if (address < 1024 || address >= 2024)
            return;
        if (value < 0 || value > 511)
            throw "expected value 0 to 511";

        let i = value*8;

        this.charCells[address-1024] = value;

        const col = (address - 1024) % this.cols;
        const row = Math.floor((address - 1024) / this.cols);

        const chardata = c64_char_rom.slice(i, i+8);

        this.drawChar(chardata, col, row, this.colorCells[address - 1024], false, 0);
    }

    public drawChar(chardata: number[], col: number, row: number, fg: number, underlined: boolean, ul: number) {
        fg = fg & 0xF;
        const x = col*8;
        const y = row*8;

        for (let r = 0; r < 8; ++r) {
          for (let b = 0; b < 8; ++b) {
            const j = (x+(7-b) + (y+r)*this.cols*8)*4;
            if ((chardata[r] & (1 << b)) != 0) {
              this.bitmap[j + 0] = this.palette[fg][0];
              this.bitmap[j + 1] = this.palette[fg][1];
              this.bitmap[j + 2] = this.palette[fg][2];
              this.bitmap[j + 3] = this.palette[fg][3];
            }
            else if (underlined && r == 7) {
                this.bitmap[j + 0] = this.palette[ul][0];
                this.bitmap[j + 1] = this.palette[ul][1];
                this.bitmap[j + 2] = this.palette[ul][2];
                this.bitmap[j + 3] = this.palette[ul][3];
              } else
                this.bitmap[j + 3] = 0; // set alpha component to transparent
          }
        }

        requestAnimationFrame(() => this.animationCallback());

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
        } else if (x+8 > this.dirtyx + this.dirtywidth)
          this.dirtywidth += (x+8 - (this.dirtyx + this.dirtywidth));
        if (y < this.dirtyy) {
          this.dirtyheight += this.dirtyy - y;
          this.dirtyy = y;
        } else if (y+8 > this.dirtyy + this.dirtyheight)
          this.dirtyheight += (y+8 - (this.dirtyy + this.dirtyheight));
    }

    private scrollScreen() {
        this.eraseButtons();

        // remove top line of screen from memory
        this.charCells.splice(0, this.cols);
        this.colorCells.splice(0, this.cols);

        // add back empty last line in memory
        for (let i=0; i<this.cols; ++i) {
            this.charCells.push(32);
            this.colorCells.push(this.fg);
        }

        // redraw from char/color cells memory
        this.redraw();

        this.redrawButtons();
    }

    redraw() { // redraw screen by applying color to each cell
        let wasBlinking = this.hideCursor();
        const limit = this.rows*this.cols;
        for (let i=0; i<limit; ++i)
            this.poke(13.5*4096 + i, this.colorCells[i]);
        if (wasBlinking)
            this.blinkCursor();
    }

    animationCallback() {
        if (this.dirtywidth == 0 || this.dirtyheight == 0)
          return;
        this.ctx.putImageData(this.imgData, 0, 0, this.dirtyx, this.dirtyy, this.dirtywidth, this.dirtyheight);
        this.dirtyx = 0;
        this.dirtyy = 0;
        this.dirtywidth = 0;
        this.dirtyheight = 0;
    }

    public foreground(fg: number) {
        this.fg = fg;
    }

    public background(bg: number) {
        const backgroundCanvas = document.getElementsByTagName('console')[0].getElementsByClassName('background')[0] as HTMLCanvasElement;
        backgroundCanvas.style.backgroundColor = this.colorToRgbString(bg);
        this.bg = bg;
    }

    public getBackground() {
        return this.bg;
    }

    public border(color: number) {
        const borderCanvas = document.getElementsByTagName('console')[0].getElementsByClassName('border')[0] as HTMLCanvasElement;
        borderCanvas.style.backgroundColor = this.colorToRgbString(color);
        this.bd = color;
    }

    public getBorder() {
        return this.bd;
    }

    public underline(color: number) {
        this.ul = color;
    }

    public getUnderline() {
        return this.ul;
    }

    public hideCursor(): boolean {
        let wasBlinking = this.cursorBlinking;
        if (this.cursorShown)
            this.blinkCursor();
        if (this.cursorBlinking) {
            clearInterval(this.cursorIntervalId);
            this.cursorIntervalId = undefined;
            this.cursorBlinking = false;
        }
        return wasBlinking;
    }

    public blinkCursor() {
        if (!this.cursorBlinking) {
            this.cursorIntervalId = setInterval(() => this.blinkCursor(), 333);
            this.cursorBlinking = true;
        }
        const offset = this.col + this.row * this.cols;
        if (this.cursorShown) {
            this.colorCells[offset] = this.cursorSaveColor;
            this.cursorShown = false;
        } else {
            this.cursorSaveColor = this.colorCells[offset];
            this.colorCells[offset] = this.fg;
            this.cursorShown = true;
        }
        this.pokeScreen(1024 + offset, this.charCells[offset] ^ 128);
    }

    private keypress(event: KeyboardEvent) {
        //console.log(`keypress: ${event.key}`);
        let key = event.key;
        if (key.length != 1)
            return;
        if (!this.lowercase && key >= 'A' && key <= 'Z')
            key = this.chr$(key.charCodeAt(0)-'A'.charCodeAt(0)+'a'.charCodeAt(0)) ?? '';
        else if (key == '|')
            key = this.chr$(0x62) ?? '';
        this.out(key);
    }

    private keydown(key: string, shiftKey: boolean, ctrlKey: boolean, altKey: boolean): boolean {
        if (key == 'Home' && !altKey) {
            if (shiftKey && !ctrlKey)
                this.clear()
            else if (!shiftKey) // and any ctrlKey or not
                this.homeScreen();
        } else if (key == 'End' && !shiftKey && !altKey) {
            if (ctrlKey)
                this.endScreen();
            else
                this.endLine();
        } else if (key == 'ArrowUp' && !altKey) {
            if (ctrlKey)
                this.topLine();
            else
                this.up();
        } else if (key == 'ArrowDown' && !altKey) {
            if (ctrlKey)
                this.bottomLine();
            else
                this.down();
        } else if (key == 'ArrowLeft' && !altKey) {
            if (ctrlKey)
                this.homeLine();
            else
                this.left();
        } else if (key == 'ArrowRight' && !altKey) {
            if (ctrlKey)
                this.endLine();
            else
                this.right();
        } else if (key == 'Enter') {
            if (!shiftKey && ctrlKey && altKey && !this.tabPressed)
                this.toggleFullScreen();
            else
                this.newLine();
        } else if ((key == 'Backspace' || key == 'Delete')
                && !shiftKey && !ctrlKey && !altKey)
            this.delete(key == 'Delete');
        else if (key == 'Insert' && !ctrlKey && !altKey
                || (key == 'Backspace' || key == 'Delete') && shiftKey && !ctrlKey && !altKey)
            this.insert();
        else if (key == 'Escape') {
            this.escapePressed = true;
            return true;
        } else if (key == 'Tab') {
            this.tabPressed = true;
            return true;
        } else if (key == 'PageUp' && !shiftKey && !ctrlKey && !altKey && this.escapePressed
                || key == 'Cancel' && !shiftKey && ctrlKey && !altKey) {
            this.removeButtons();
            this.hideSprites();
            this.init();
        } else if (key >= '1' && key <= '8' && !shiftKey && !ctrlKey && !altKey && this.tabPressed) {
            this.fg = key.charCodeAt(0)-'0'.charCodeAt(0)-1;
            if (this.hideCursor())
                this.blinkCursor();
            return true;
        } else if (key == '9' && !shiftKey && !ctrlKey && !altKey && this.tabPressed) {
            this.reverse = true;
            if (this.hideCursor())
                this.blinkCursor();
            return true;
        } else if (key == '0' && !shiftKey && !ctrlKey && !altKey && this.tabPressed) {
            this.reverse = false;
            if (this.hideCursor())
                this.blinkCursor();
            return true;
        } else if (key >= '1' && key <= '8' && !shiftKey && altKey && !this.tabPressed) {
            this.fg = key.charCodeAt(0)-'0'.charCodeAt(0)+7;
            if (this.hideCursor())
                this.blinkCursor();
            return true;
        } else if (key == '@' && ctrlKey && altKey && !this.tabPressed)
            this.out(this.chr$(186));
        else if (key == '+' && ctrlKey && altKey && !this.tabPressed)
            this.out(this.chr$(0x7B));
        else if (key.length == 1 && key >= 'a' && key <= 'z' && !ctrlKey && !altKey && this.tabPressed) {
            this.out(String.fromCharCode(key.charCodeAt(0)-'a'.charCodeAt(0)+1));
            return true;
        } else if (key.length == 1 && key >= 'A' && key <= 'Z' && !ctrlKey && !altKey && this.tabPressed) {
            this.out(String.fromCharCode(key.charCodeAt(0)-'A'.charCodeAt(0)+129));
            return true;
        } else if (key == ',' && ctrlKey && !altKey && !this.tabPressed && this.scale > 1 && !this.fullScreen) {
            --this.scale;
            this.rescale();
        } else if (key == '.' && ctrlKey && !altKey && !this.tabPressed && this.scale < 5 && !this.fullScreen) {
            ++this.scale;
            this.rescale();
        } else if (key.length == 1 && (ctrlKey || altKey) && !this.tabPressed) {
            if ((key=='-' || key=='=') && ctrlKey && !altKey)
                return false;
            let code = this.cbmGraphicsKeys.find(x => x.key == key)?.code;
            if (code != null) {
                this.out(this.chr$(code));
                return true;
            }
        }
        return false;
    }

    private keyup(key: string, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) {
        if (key == 'Escape')
            this.escapePressed = false;
        else if (key == 'Tab')
            this.tabPressed = false;
    }

    public repeat(fn:() => void, count: number|undefined = undefined, delayms = 5) {
        if (this.repeatIntervalId != null)
            throw "repeat is already busy";
        let wasBlinking = this.hideCursor();
        let i = 0;
        this.repeatIntervalId=setInterval( () => {
            if (!this.escapePressed && (count == null || i++ < count))
                fn();
            else {
                clearInterval(this.repeatIntervalId);
                this.repeatIntervalId = undefined;
                if (wasBlinking)
                    this.blinkCursor();
            }
            if (this.escapePressed)
                this.out('\rBREAK\rREADY.\r');
        }, delayms);
        return this.repeatIntervalId;
    }

    public chr$(value: number): string|undefined {
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
    }

    public locate(x: number, y: number): [number, number] {
        const oldx = this.row;
        const oldy = this.col;
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
            throw "invalid position";
        const wasBlinking = this.hideCursor();
        this.col = x;
        this.row = y;
        if (wasBlinking)
            this.blinkCursor();
        return [oldx, oldy];
    }

    public petsciiPokesChart() {
        this.reverse=false;
        for (let row = 0; row < 16; ++row) {
            for (let col = 0; col < 16; ++col) {
                this.poke(1024 + col + (row + 8) * 40 + 4, col + row * 16);
                this.poke(1024 + col + (row + 8) * 40 + 21, col + row * 16 + 256);
            }
        }
        for (let i = 7 * 40; i < 1000; ++i)
            this.poke(13.5 * 4096 + i, 1);

        this.foreground(14);
        for (let i = 0; i < 16; ++i) {
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
        this.locate(0, 7);
        this.blinkCursor();
    }

    public petsciiChr$Chart() {
        for (let row = 0; row < 16; ++row) {
            for (let col = 0; col < 16; ++col) {
                let i = row * 16 + col;
                this.lowercase = false;
                this.locate(col + 4, row + 8);
                if ((i & 127) >= 32)
                    this.out(this.chr$(i));
                else
                    this.out(this.chr$(18)+this.chr$(64+i)+this.chr$(146));
                this.lowercase = true;
                this.locate(col + 21, row + 8);
                if ((i & 127) >= 32)
                    this.out(this.chr$(i));
                else
                    this.out(this.chr$(18)+this.chr$(64+i)+this.chr$(146));
            }
        }
        for (let i = 7 * 40; i < 1000; ++i)
            this.poke(13.5 * 4096 + i, 1);

        this.foreground(14);
        for (let i = 0; i < 16; ++i) {
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
        this.locate(0, 7);
        this.blinkCursor();
    }

    public maze(rows: number = this.rows) {
        this.lowercase = false;
        this.newLine();
        this.up();
        this.repeat(() => this.out(this.chr$(109.5+Math.random())), this.cols*rows-1, 0);
    }

    private onclickcanvas(event: MouseEvent) {
        const x = Math.floor(event.offsetX / 8);
        const y = Math.floor(event.offsetY / 8);
        //console.log(`click ${x},${y}`)
        let found = false;
        for (let button of this.buttons)
            if (button.checkClick(x, y))
                found = true;
        if (!found)
            this.locate(x, y);
        event.preventDefault();
    }

    private onmousemovecanvas(event: MouseEvent) {
        const x = Math.floor(event.offsetX / 8);
        const y = Math.floor(event.offsetY / 8);
        //console.log(`mousemove ${x},${y}`)
        for (let button of this.buttons)
            button.checkMove(x, y);
    }

    private onmouseleavecanvas(event: MouseEvent) {
        const x = Math.floor(event.offsetX / 8);
        const y = Math.floor(event.offsetY / 8);
        //console.log(`mouseleave ${x},${y}`)
        for (let button of this.buttons)
            button.checkLeave();
    }

    public addButton(text: string, context: any = undefined, rounded: boolean = true, draw: boolean = true): any {
        this.lowercase = false;

        const normalCorners = (rounded)
            ? ''+this.chr$(0x75)+this.chr$(0x69)+this.chr$(0x6A)+this.chr$(0x6B)
            : ''+this.chr$(0xB0)+this.chr$(0xAE)+this.chr$(0xAD)+this.chr$(0xBD);

        let normal = '\x8E' + normalCorners[0];
        for (let i=1; i<=text.length; ++i)
            normal += this.chr$(0x60);
        normal += normalCorners[1]+'\x11';
        for (let i=1; i<=text.length+2; ++i)
            normal += '\x9D';
        normal += this.chr$(0x62)+'\x0E'+text+'\x8E'+this.chr$(0x62)+'\x11';
        for (let i=1; i<=text.length+2; ++i)
            normal += '\x9D';
        normal += '\x8E' + normalCorners[2];
        for (let i=1; i<=text.length; ++i)
            normal += this.chr$(0x60);
        normal += normalCorners[3]+'\x91\x91';
        for (let i=1; i<=text.length+2; ++i)
            normal += '\x9D';

        let hover = '\x8E' + this.chr$(0xEC);
        for (let i=1; i<=text.length; ++i)
            hover += this.chr$(0xA2);
        hover += this.chr$(0xFB)+'\x11';
        for (let i=1; i<=text.length+2; ++i)
            hover += '\x9D';
        hover += '\x12'+this.chr$(0xA1)+'\x0E'+text+'\x8E\x92'+this.chr$(0xA1)+'\x11';
        for (let i=1; i<=text.length+2; ++i)
            hover += '\x9D';
        hover += '\x8E'+this.chr$(0xFC)+'\x12';
        for (let i=1; i<=text.length; ++i)
            hover += this.chr$(0xA2);
        hover += '\x92'+this.chr$(0xBE)+'\x91\x91';
        for (let i=1; i<=text.length+2; ++i)
            hover += '\x9D';

        if (draw)
            this.out(normal);

        let _cbm = this;

        const button = {
            "text": text,
            "context": context,
            "color": this.fg,
            "hovered": false,
            "normal": normal,
            "hover": hover,
            "top": this.row,
            "left": this.col,
            "bottom": this.row+3,
            "right": this.col+text.length+2,
            "checkBounds": (x:number, y:number) =>
                (x >= button.left && x < button.right && y >= button.top && y < button.bottom),
            "onHover": () => {
                const wasBlinking = _cbm.hideCursor();
                button.hovered = true;
                let saveColor = this.fg;
                this.fg = button.color;
                const oldRowCol = _cbm.locate(button.left, button.top);
                _cbm.out(button.hover);
                this.fg = saveColor;
                [this.row, this.col] = oldRowCol;
                if (wasBlinking)
                    _cbm.blinkCursor();
            },
            "onLeave": () => {
                const wasBlinking = _cbm.hideCursor();
                button.hovered = false;
                let saveColor = this.fg;
                this.fg = button.color;
                const oldRowCol = _cbm.locate(button.left, button.top);
                _cbm.out(button.normal);
                this.fg = saveColor;
                [this.row, this.col] = oldRowCol;
                if (wasBlinking)
                    _cbm.blinkCursor();
            },
            "checkClick": (x:number, y:number): boolean => {
                if (button.checkBounds(x, y)) {
                    const wasBlinking = _cbm.hideCursor();
                    let saveColor = this.fg;
                    this.fg = button.color;
                    const oldRowCol = _cbm.locate(button.left, button.top);
                    _cbm.out(button.normal);
                    this.fg = saveColor;

                    if (button.onclick != null)
                        button.onclick();

                    [this.row, this.col] = oldRowCol;
                    if (wasBlinking)
                        _cbm.blinkCursor();

                    setTimeout(() => button.onHover(), 50);
                    return true;
                }
                return false;
            },
            "checkMove": (x:number, y:number) => {
                if (button.hovered) {
                    if (!button.checkBounds(x, y))
                        button.onLeave();
                } else {
                    if (button.checkBounds(x, y))
                        button.onHover();
                }
            },
            "checkLeave": () => {
                if (button.hovered)
                    button.onLeave();
            },
            "onclick": () => {
                console.log(`onClick: ${button.text}`);
            }
        };

        this.buttons.push(button);

        return button;
    }

    public addLink(text: string, link: string) {
        const button = this.addButton(text, link, false, false);
        button.bottom = button.top+1;
        button.right = button.left + text.length;
        button.normal = this.chr$(14)+this.chr$(2)+text+this.chr$(130);
        this.out(button.normal);
        button.hover = this.chr$(14)+this.chr$(18)+text+this.chr$(146);
        button.onclick = () => window.open(button.context);
        return button;
    }

    public findButton(text: string, contains: boolean = false): any {
        if (contains)
            return this.buttons.find(button => button.text.indexOf(text) >= 0);

        return this.buttons.find(button => button.text == text);
    }

    public removeButton(button: any) {
        let i = this.buttons.findIndex(x => x === button);
        if (i >= 0) {
            // remove from screen
            for (let y = button.top; y < button.bottom; ++y) {
                for (let x = button.left; x < button.right; ++x) {
                    const offset = x + y*this.cols;
                    this.pokeScreen(1024+offset, 32);
                }
            }

            // remove from collection
            this.buttons.splice(i, 1);
        }
    }

    public removeButtons() {
        while (this.buttons.length > 0)
            this.removeButton(this.buttons[0]);
    }

    public eraseButtons() {
        for (let button of this.buttons) {
            for (let y = button.top; y < button.bottom; ++y) {
                for (let x = button.left; x < button.right; ++x) {
                    const offset = x + y * this.cols;
                    this.pokeScreen(1024 + offset, 32);
                }
            }
        }
    }

    public redrawButtons() {
        if (this.buttons.length == 0)
            return;
        const wasBlinking = this.hideCursor();
        const saveRowCol = this.locate(0, 0);
        const saveColor = this.fg;
        for (let button of this.buttons) {
            this.fg = button.color;
            this.locate(button.left, button.top);
            if (button.hovered)
                this.out(button.hover);
            else
                this.out(button.normal);
        }
        this.fg = saveColor;
        [this.row, this.col] = saveRowCol;
        if (wasBlinking)
            this.blinkCursor();
    }

    public colorPicker(showExit: boolean = true) {
        const _cbm = this;
        let saveRowCol = [this.row, this.col];
        const saveColor = this.fg;

        let setter = function(value: number) {}

        const colorFn = (value: number) => {
            setter(value);
            redrawRadioButtons();
        }

        for (let i=0; i<2; ++i) {
            for (let j=0; j<8; ++j) {
                const color = i*8 + j;
                const x = j*5;
                const y = i*3 + 8;
                this.foreground(color);
                this.locate(x, y);
                const button = this.addButton(color.toString());
                button.onclick = () => { colorFn(color) };
            }
        }

        this.fg = saveColor;

        this.locate(3, 15);
        const fore = this.addButton("Foreground");
        fore.onclick = () => {
            setter = setForeground;
            redrawRadioButtons();
        }

        this.locate(24, 15);
        const under = this.addButton("Underline");
        under.onclick = () => {
            setter = setUnderline;
            redrawRadioButtons();
        }

        this.locate(3, 18);
        const back = this.addButton("Background");
        back.onclick = () => {
            setter = setBackground;
            redrawRadioButtons();
        }

        this.locate(3, 21);
        const bord = this.addButton("  Border  ");
        bord.onclick = () => {
            setter = setBorder;
            redrawRadioButtons();
        }

        let redrawRadioButtons = () => {
            _cbm.lowercase = false;

            for (let row = 0; row < 7; ++row) {
                for (let col = 0; col < _cbm.cols; ++col) {
                    if (col < 37 || row > 2) {
                        const offset = col + row * _cbm.cols;
                        _cbm.poke(13.5*4096 + offset, _cbm.fg);
                    }
                }
            }
            this.redrawButtons();

            _cbm.locate(fore.left-2, fore.top+1);
            _cbm.out(_cbm.chr$((setter === setForeground) ? 0x71 : 0x77));
            _cbm.locate(fore.right+1, fore.top+1);
            _cbm.out(fore.color + ' ');

            _cbm.locate(back.left-2, back.top+1);
            _cbm.out(_cbm.chr$((setter === setBackground) ? 0x71 : 0x77));
            _cbm.locate(back.right+1, back.top+1);
            _cbm.out(_cbm.getBackground() + ' ');

            _cbm.locate(bord.left-2, bord.top+1);
            _cbm.out(_cbm.chr$((setter === setBorder) ? 0x71 : 0x77));
            _cbm.locate(bord.right+1, bord.top+1);
            _cbm.out(_cbm.getBorder() + ' ');

            _cbm.locate(under.left-2, under.top+1);
            _cbm.out(_cbm.chr$((setter === setUnderline) ? 0x71 : 0x77));
            _cbm.locate(under.right+1, under.top+1);
            _cbm.out(_cbm.getUnderline() + ' ');
        };

        let eraseRadioButtons = () => {
            _cbm.locate(1, fore.top+1);
            _cbm.out(' ');
            _cbm.locate(fore.right+1, fore.top+1);
            _cbm.out('  ');

            _cbm.locate(1, back.top+1);
            _cbm.out(' ');
            _cbm.locate(back.right+1, back.top+1);
            _cbm.out('  ');

            _cbm.locate(1, bord.top+1);
            _cbm.out(' ');
            _cbm.locate(bord.right+1, bord.top+1);
            _cbm.out('  ');
        };

        let setForeground = function(value: number) {
            _cbm.foreground(value);

            fore.color = value;
            back.color = value;
            bord.color = value;
            under.color = value;
        };

        let setBackground = function(value: number) {
            _cbm.background(value);
        }

        let setBorder = function(value: number) {
            _cbm.border(value);
        }

        let setUnderline = function(value: number) {
            _cbm.underline(value);
        }

        setter = setForeground;
        redrawRadioButtons();

        if (showExit) {
            this.locate(37, 0);
            const leave = this.addButton("X");
            leave.onclick = () => {
                setTimeout( () => {
                    eraseRadioButtons();
                    while (_cbm.buttons.length > 0)
                        _cbm.removeButton(_cbm.buttons[0]);
                    for (let i=0; i<_cbm.rows*_cbm.cols; ++i)
                        _cbm.poke(13.5*4096+i, _cbm.fg);
                    [_cbm.row, _cbm.col] = saveRowCol;
                    _cbm.blinkCursor();
                }, 250);
            };
        }

        this.locate(0, 7);
        this.blinkCursor();
    }

    public keyboardChart() {
        const wasBlinking = this.hideCursor();
        const screenCodes = JSON.parse('[27,20,257,258,29,27,14,29,61,268,271,279,261,274,259,257,275,261,47,277,272,272,261,274,259,257,275,261,32,32,32,32,32,32,32,32,32,85,64,73,27,20,257,258,29,27,19,264,265,262,276,29,27,14,29,61,277,272,272,261,274,259,257,275,261,47,263,274,257,272,264,265,259,275,32,32,32,66,24,66,27,20,257,258,29,47,27,3,61,29,43,27,49,45,56,29,61,259,271,268,271,274,275,32,57,47,48,61,18,278,275,47,15,262,262,32,32,74,64,75,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,114,67,67,32,66,49,33,66,50,0,66,51,35,66,52,36,66,53,37,66,54,30,66,55,38,66,56,42,66,57,40,66,48,41,66,45,31,66,61,43,66,2,257,32,66,32,32,66,100,122,378,32,32,66,32,32,66,32,32,66,32,94,350,32,32,66,32,32,66,32,32,66,32,32,66,92,32,66,102,91,66,259,267,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,3,66,273,17,66,279,23,66,261,5,66,274,18,66,276,20,66,281,25,66,277,21,66,265,9,66,271,15,66,272,16,66,27,32,66,29,32,66,28,66,271,66,107,81,66,371,87,66,369,69,66,370,82,66,355,84,66,375,89,66,376,85,66,354,73,66,377,79,66,367,80,66,32,32,66,32,32,66,104,32,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,113,64,64,32,66,257,1,66,275,19,66,260,4,66,262,6,66,263,7,66,264,8,66,266,10,66,267,11,66,268,12,66,59,58,66,39,34,66,5,270,276,261,274,32,66,368,65,66,366,83,66,364,68,66,379,70,66,357,71,66,372,72,66,373,74,66,353,75,66,374,76,66,32,32,66,32,32,66,32,32,32,32,32,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,91,64,64,113,64,64,64,64,64,19,66,282,26,66,280,24,66,259,3,66,278,22,66,258,2,66,270,14,66,269,13,66,44,60,66,46,62,66,47,63,66,32,32,32,19,264,265,262,276,264,66,365,90,66,381,88,66,380,67,66,382,86,66,383,66,66,362,78,66,359,77,66,32,32,66,32,32,66,32,32,66,32,32,32,32,32,32,32,32,64,113,64,114,113,64,64,91,64,64,113,64,64,113,64,64,113,64,64,113,64,64,113,64,64,113,64,64,91,64,64,113,114,64,64,64,114,64,64,64,3,61,32,66,3,61,32,66,32,32,32,19,32,32,16,32,32,1,32,32,3,32,32,5,32,32,32,32,66,3,61,32,66,32,32,32,66,3,61,32,32,32,32,66,32,32,32,66,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,66,32,32,32,66,32,32,32,66,32,32,32,67,67,67,113,64,64,64,113,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,113,64,64,64,113,64,64,64,113,64,64,64,3,61,27,1,268,276,29,272,274,261,262,261,274,274,261,260,44,27,3,276,274,268,29,275,271,269,261,32,3,271,270,276,274,271,268,27,20,257,258,29,19,20,15,16,27,5,275,259,29,18,5,19,20,15,18,5,27,16,263,21,272,29,32,271,274,32,27,3,276,274,268,29,27,2,274,261,257,267,29,32,14,261,279,32,27,3,276,274,268,29,43,27,21,272,47,4,271,279,270,47,12,261,262,276,47,18,265,263,264,276,47,8,271,269,261,47,5,270,260,29,6,277,268,268,32,19,259,274,261,261,270,32,27,3,276,274,268,29,27,1,268,276,29,27,5,270,276,261,274,29,32,276,271,263,263,268,261,32,32,32,19,259,257,268,261,32,27,3,276,274,268,29,27,60,29,32,271,274,32,27,62,29,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,160,387,386,397,393,403,392,160,395,389,409,386,399,385,402,388,160,402,389,390,389,402,389,398,387,389,160,32]');
        const colorCells = JSON.parse('[15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,1,1,1,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,1,1,1,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,1,1,1,1,1,1,1,1,15,15,15,15,15,1,1,1,1,15,15,15,15,15,1,1,1,1,1,1,1,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15]');
        this.clear();
        for (let y=0; y<25; ++y) {
            for (let x=0; x<40; ++x) {
                const src = x+y*40;
                const dest = x+y*this.cols;
                this.charCells[dest] = screenCodes[src];
                this.poke(13.5*4096+dest, colorCells[src]);
            }
        }
        if (wasBlinking)
            this.blinkCursor();
    }

    public aboutCbmish() {
        this.lowercase = true;
        this.hideCursor();
        this.border(0);
        this.background(11);
        this.foreground(15);
        this.clear();
        this.foreground(1);
        this.out('cbmish-script');
        this.foreground(15);
        this.out(' is a TypeScript module\r'
            + 'for displaying content that looks\r'
            + 'like a famous 8-bit console we love\r'
            + 'by displaying the PETSCII characters in\r'
            + 'familiar colors and patterns\r'
            + '\r'
            + 'The purpose is to be able to render\r'
            + 'various web content with this look &\r'
            + 'feel to retain the retro vibe, yet also\r'
            + 'enable modern programming languages like'
            + 'TypeScript.\r'
            + '\r'
            + 'Open source:\r');
        this.out('  ');
        this.foreground(14);
        const link = 'github.com/davervw/cbmish-script';
        this.ul = 15;
        this.addLink(link, 'https://'+link);
        this.out('\r');
        this.out('\r');
        this.out('  ')
        const link2 = 'https://github.com/davervw?tab=repositories&q=64&type=&language=&sort=';
        this.addLink('other C64 repositories', link2);
        this.out('\r');
        this.out('\r');
        this.out('\r');
        this.foreground(15);
        this.out('Blog:  ')
        this.foreground(14);
        this.addLink('davevw.com', 'http://www.davevw.com');
        this.newLine();
        this.newLine();
        this.addLink('twitter.com/davervw', 'https://twitter.com/DaveRVW');
        this.foreground(15);
        this.locate(this.cols - 1, this.rows - 1);
        this.blinkCursor();
    }

    colorToRgbString(color: number): string {
        color = color & 15;
        return '#'
          +this.palette[color][0].toString(16).padStart(2, '0')
          +this.palette[color][1].toString(16).padStart(2, '0')
          +this.palette[color][2].toString(16).padStart(2, '0')
          +this.palette[color][3].toString(16).padStart(2, '0');
    }

    private rescaleId : number;

    toggleFullScreen() {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen) {
            let element: any = document.getElementsByTagName('html')[0];
            element.requestFullscreen().then( 
                this.rescaleId = setInterval( () => this.rescaleFullScreen(), 200) // TODO: handle resize event instead of 200ms delay
            )
        } else {
            document.exitFullscreen().then( () => this.rescale() );
        }
    }

    rescale() {
        let element: any = document.getElementsByTagName('body')[0];
        element.style = `transform: scale(${this.scale});`;
    }

    rescaleFullScreen() {
        clearInterval(this.rescaleId);
        this.rescaleId = undefined;
        let scaleX = window.screen.availWidth / 380;
        let scaleY = window.screen.availHeight / 250;
        let scale = Math.min(scaleX, scaleY);
        let element: any = document.getElementsByTagName('body')[0];
        element.style = `transform: scale(${scale}) !important;`
    }

    private loresChars = [ 32, 126, 124, 226, 123, 97, 255, 236,
        108, 127, 225, 251, 98, 252, 254, 160 ];

    loresPlot(x: number, y: number) {
        let i = 1 << ((x & 1)+2*(y & 1)); 
        let offset = Math.floor(x/2) + this.cols*Math.floor(y/2);
        i |= Math.max(this.loresChars.indexOf(this.charCells[offset]), 0);
        this.poke(1024 + offset, this.loresChars[i]);
        this.poke(13.5*4096 + offset, this.fg);
    }

    loresUnPlot(x: number, y: number) {
        let i = 1 << ((x & 1)+2*(y & 1)); 
        let mask = ~i;
        let offset = Math.floor(x/2) + this.cols*Math.floor(y/2);
        let j = Math.max(this.loresChars.indexOf(this.charCells[offset]), 0);
        this.poke(1024 + offset, this.loresChars[j & mask]);
    }

    largeText(s : string) {
        let isBlinking = this.hideCursor();
        while (this.row + 4 >= this.rows) {
            --this.row;
            this.scrollScreen();
        }
        for (let row = 0; row < 8; ++row) {
            for (let col = 0; col < s.length * 8 && this.col + col/2 < this.cols; ++col) {
                if ((row % 2) == 0 && (col % 2) == 0) {
                    let offset = (this.row + row/2)*this.cols+this.col + col/2;
                    this.pokeScreen(1024+offset, 32);
                    this.poke(13.5*4096+offset, this.fg);
                }
                let code = this.ascii_to_petscii(s.charCodeAt(col / 8));
                let byte = c64_char_rom[code*8 + row];
                let nbit = 7-(col % 8);
                let x = this.col * 2 + col;
                let y = this.row * 2 + row;
                if ((byte & (1 << nbit)) != 0)
                    this.loresPlot(x, y);
            }
        }
        this.locate(0, this.row + 4);
        if (isBlinking)
            this.blinkCursor();
    }

    private checkStartupIntervalId = -1;
    private checkStartupButton() {
        let params = new URLSearchParams(window.location.search);
        let buttonName = params.get('button');
        if (buttonName)
            this.checkStartupIntervalId = setInterval(() => {
                clearInterval(this.checkStartupIntervalId);
                this.checkStartupIntervalId = -1;
                let button = this.findButton(buttonName, true);
                if (button)
                    button.onclick();
            }, 250);        
    }

    private checkFullScreen() {
        let params = new URLSearchParams(window.location.search);
        let value = params.get('fullScreen');
        if (value == 'true')
            this.toggleFullScreen();
    }

    private spriteFactory(n: number) {
        let s = {
            _image: null,
            _color: 0,
            _doubleX: false,
            _doubleY: false,
            _x: 0,
            _y: 0,
            color: null,
            image: null,
            move: null,
            show: null,
            hide: null,
            size: null,
            visible: false
        };
        s.color = (c: number) => { 
            s._color = c; 
            if (s.visible)
                this.drawSprites();
        }
        s.image = (imageSource: number[]) => {
            s._image = imageSource;
            if (s.visible)
                this.drawSprites();
        }
        s.move = (x: number, y: number) => {
            s._x = x;
            s._y = y;
            this.drawSprites();
        }
        s.show = () => {
            if (s.visible)
                return;
            s.visible = true;
            this.drawSprites();
        }
        s.hide = () => {
            if (!s.visible)
                return;
            s.visible = false;
            this.drawSprites();
        }
        s.size = (doubleX: boolean, doubleY: boolean) => {
            s._doubleX = doubleX;
            s._doubleY = doubleY;
            if (s.visible)
                this.drawSprites();
        }
        return s;
    }

    public hideSprites() {
        for (let sprite of this.sprites) {
            if (sprite.visible)
                sprite.hide();
        }
    }

    public drawSprites() {
        const canvas = document.getElementsByClassName("sprites")[0] as HTMLCanvasElement;
        if (canvas == null)
            return;
                    
        const canvasWidth = Number.parseInt(canvas.getAttribute('width'));
        const canvasHeight = Number.parseInt(canvas.getAttribute('height'));
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const attrs = ctx.getContextAttributes();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const bitmap = imgData.data;
        let collisionBitmap = new Map();
        let collisionSprites = [];
        //let collisionBackground = [];

        const originX = 25;
        const originY = 51;

        for (let i=this.sprites.length-1; i>=0; --i) {
            const sprite = this.sprites[i];

            const spriteWidth = 24 * (sprite._doubleX ? 2 : 1);
            const spriteHeight = 21 * (sprite._doubleY ? 2 : 1);

            for (let x = 0; x < spriteWidth; ++x) {
                for (let y = 0; y < spriteHeight; ++y) {
                    let srcX = (sprite._doubleX) ? (x >> 1) : x;
                    let srcY = (sprite._doubleY) ? (y >> 1) : y;                    
                    const src = srcY * 3 + (srcX >> 3);
                    const mask = 1 << (7 - (srcX & 7));
                    let destX = (sprite._x - originX + x);
                    let destY = (sprite._y - originY + y);
                    if (destX < 0 || destX >= canvasWidth || destY < 0 || destY >= canvasHeight)
                        continue;
                    const dest = (destX + destY * canvasWidth) * 4;
                    if (sprite.visible && sprite._image != null && (sprite._image[src] & mask) != 0) {
                        bitmap[dest + 0] = this.palette[sprite._color][0];
                        bitmap[dest + 1] = this.palette[sprite._color][1];
                        bitmap[dest + 2] = this.palette[sprite._color][2];
                        bitmap[dest + 3] = 255;

                        const point = `${destX},${destY}`;
                        if (collisionBitmap.has(point)) {
                            let pointCollisions = collisionBitmap.get(point);
                            if (pointCollisions.length == 1) {
                                if (collisionSprites.indexOf(pointCollisions[0]) < 0)
                                    collisionSprites.push(pointCollisions[0]);
                            } else if (pointCollisions.indexOf(i) < 0) {
                                pointCollisions.push(i);
                                collisionBitmap.set(point, pointCollisions);
                            }
                            if (collisionSprites.indexOf(i) < 0)
                                collisionSprites.push(i);
                        } else {
                            collisionBitmap.set(point, [i]);
                        }
                    }
                }
            }
        }
        ctx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, canvasHeight);
        if (collisionSprites.length != 0)
            this.onSpriteCollision(collisionSprites.sort());
    }

    public onSpriteCollision = (collisionSprites: number[]) => {
        //console.log(`onSpriteCollision(${JSON.stringify(collisionSprites)})`);
    }
}