// cbmish.ts
// Console (display output) that has features resembling an 8-bit classic system
// Copyright (c) 2022 by David R. Van Wagner
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
    private row = 0;
    private col = 0;
    lowercase: boolean = true;
    reverse: boolean = false;
    private cursorBlinking: boolean = false;
    private cursorShown: boolean = false;
    private cursorSaveColor: number;
    private cursorIntervalId: number | undefined;
    private repeatIntervalId: number | undefined;
    private escapePressed: boolean = false;
    private tabPressed: boolean = false;

    private canvas: any = document.getElementById("screen");
    private rows = Math.floor(this.canvas.getAttribute('height') / 8);
    private cols = Math.floor(this.canvas.getAttribute('width') / 8);   
    private ctx = this.canvas?.getContext("2d");
    private imgData = this.ctx.getImageData(0, 0, this.cols*8, this.rows*8);
    private bitmap = this.imgData.data;

    private charCells: number[] = [];
    private colorCells: number[] = [];

    private buttons: any[] = [];

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

    cbmGraphicsKeys = [
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
        this.init();
        window.addEventListener('keypress', (event: KeyboardEvent) => { this.keypress(event); });
        window.addEventListener('keydown', (event: KeyboardEvent) => { if (this.keydown(event.key, event.shiftKey, event.ctrlKey, event.altKey)) event.preventDefault(); });
        window.addEventListener('keyup', (event: KeyboardEvent) => { this.keyup(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
        this.canvas.addEventListener('click', (event: MouseEvent) => this.onclickcanvas(event), false);
        this.canvas.addEventListener('mousemove', (event: MouseEvent) => this.onmousemovecanvas(event), false);
        this.canvas.addEventListener('mouseleave', (event: MouseEvent) => this.onmouseleavecanvas(event), false);
    }

    public init() {
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
        if (s.length != 1) throw "expected string of exactly one character";
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

        this.drawC64Char(chardata, this.col*8, this.row*8, this.fg);

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
        if (this.buttons.length > 0)
            this.eraseButtons();
        
        this.homeScreen();
        const limit = this.rows * this.cols - 1; // one less to avoid scroll
	    for (let i=0; i<limit; ++i)
	        this.out(' ');
        this.poke(1024 + limit, 32);
        this.poke(13.5 * 4096 + limit, this.fg);
	    this.homeScreen();
        
        if (this.buttons.length> 0)
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

        this.drawC64Char(chardata, col*8, row*8, this.colorCells[address - 1024]);
    }

    drawC64Char(chardata: number[], x: number, y: number, fg: number) {
        fg = fg & 0xF;

        for (let r = 0; r < 8; ++r) {
          for (let b = 0; b < 8; ++b) {
            const j = (x+(7-b) + (y+r)*this.cols*8)*4;
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
    
    scrollScreen() {
        if (this.buttons.length > 0)
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

        if (this.buttons.length > 0)
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
        const canvas = document.getElementsByTagName('canvas');
        canvas[1].outerHTML = `<canvas class="background background${(bg & 0xF)}"></canvas>`
        this.bg = bg;
    }

    public getBackground() {
        return this.bg;
    }

    public border(color: number) {
        const canvas = document.getElementsByTagName('canvas');
        canvas[0].outerHTML = `<canvas class="border border${(color & 0xF)}"></canvas>`
        this.bd = color;
    }

    public getBorder() {
        return this.bd;
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
            this.cursorIntervalId = setInterval(() => this.blinkCursor(), 500);
            this.cursorBlinking = true;
        }
        this.cursorBlinking = true;
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
        //console.log(`keydown: ${key} ${shiftKey} ${ctrlKey} ${altKey}`);
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
        } else if (key == 'Enter')
            this.newLine();
        else if ((key == 'Backspace' || key == 'Delete') 
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
        } else if (key >= '1' && key <= '8' && !shiftKey && (ctrlKey || altKey) && !this.tabPressed) {
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
        } else if (key.length == 1 && (ctrlKey || altKey) && !this.tabPressed) {
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

    onclickcanvas(event: MouseEvent) {
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

    onmousemovecanvas(event: MouseEvent) {
        const x = Math.floor(event.offsetX / 8);
        const y = Math.floor(event.offsetY / 8);
        //console.log(`mousemove ${x},${y}`)
        for (let button of this.buttons)
            button.checkMove(x, y);
    }

    onmouseleavecanvas(event: MouseEvent) {
        const x = Math.floor(event.offsetX / 8);
        const y = Math.floor(event.offsetY / 8);
        //console.log(`mouseleave ${x},${y}`)
        for (let button of this.buttons)
            button.checkLeave();
    }

    public addButton(text: string, context: any = undefined, rounded: boolean = true): any {
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
                _cbm.out(hover); 
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
                _cbm.out(normal); 
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
                    _cbm.out(normal);
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

    public findButton(text: string): any {
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
            
            _cbm.locate(1, fore.top+1);
            _cbm.out(_cbm.chr$((setter === setForeground) ? 0x71 : 0x77));
            _cbm.locate(fore.right+1, fore.top+1);
            _cbm.out(fore.color + ' ');

            _cbm.locate(1, back.top+1);
            _cbm.out(_cbm.chr$((setter === setBackground) ? 0x71 : 0x77));
            _cbm.locate(back.right+1, back.top+1);
            _cbm.out(_cbm.getBackground() + ' ');
            
            _cbm.locate(1, bord.top+1);
            _cbm.out(_cbm.chr$((setter === setBorder) ? 0x71 : 0x77));
            _cbm.locate(bord.right+1, bord.top+1);
            _cbm.out(_cbm.getBorder() + ' ');
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
            _cbm.locate(fore.left, fore.top);
            _cbm.out(fore.normal);

            back.color = value;
            _cbm.locate(back.left, back.top);
            _cbm.out(back.normal);

            bord.color = value;
            _cbm.locate(bord.left, bord.top);
            _cbm.out(bord.normal);
        };

        let setBackground = function(value: number) {
            _cbm.background(value);
        }

        let setBorder = function(value: number) {
            _cbm.border(value);
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
}
