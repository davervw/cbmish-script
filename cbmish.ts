// cbmish.ts
// Console (display output) that has features resembling an 8-bit classic system
// Copyright (c) 2022 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com

class CbmishConsole {
    dirtyx = 0;
    dirtyy = 0;
    dirtywidth = 0;
    dirtyheight = 0;
    fg = 14;
    row = 0;
    col = 0;
    lowercase: boolean = true;
    reverse: boolean = false;
    cursorBlinking: boolean = false;
    cursorShown: boolean = false;
    cursorSaveColor: number;
    cursorIntervalId: number | undefined;
    escapePressed: boolean = false;

    canvas: any = document.getElementById("screen");
    rows = Math.floor(this.canvas.getAttribute('height') / 8);
    cols = Math.floor(this.canvas.getAttribute('width') / 8);   
    ctx = this.canvas?.getContext("2d");
    imgData = this.ctx.getImageData(0, 0, this.cols*8, this.rows*8);
    bitmap = this.imgData.data;

    charCells: number[] = [];
    colorCells: number[] = [];

    palette: number[][] = [
        [0, 0, 0, 255],       // [0] black
        [255, 255, 255, 255], // [1] white
        [192, 0, 0, 255],     // [2] red
        [0, 255, 255, 255],   // [3] cyan
        [160, 32, 160, 255],  // [4] purple
        [32, 160, 32, 255],   // [5] green
        [64, 64, 192, 255],   // [6] blue
        [255, 255, 128, 255], // [7] yellow
        [255, 128, 0, 255],   // [8] orange
        [128, 64, 0, 255],    // [9] brown  
        [192, 32, 32, 255],   // [10] lt red
        [64, 64, 64, 255],    // [11] dk gray
        [128, 128, 128, 255], // [12] med gray
        [160, 255, 160, 255], // [13] lt green
        [96, 128, 240, 255],  // [14] lt blue
        [192, 192, 192, 255], // [15] lt gray
    ];

    public CbmishConsole() {
        this.init();
        this.blinkCursor();
        window.addEventListener('keypress', (event: KeyboardEvent) => { this.keypress(event); });
        window.addEventListener('keydown', (event: KeyboardEvent) => { this.keydown(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
        window.addEventListener('keyup', (event: KeyboardEvent) => { this.keyup(event.key, event.shiftKey, event.ctrlKey, event.altKey); });
    }

    public init() {
        this.lowercase = true;
        this.border(14);
        this.background(6);
        this.foreground(14);
	    this.clear();
        this.out('\r    **** HTML/CSS/TYPESCRIPT ****\r');
        this.out('   github.com/davervw/cbmish-script\r\r');
        this.out(' 1GB RAM SYSTEM  1073741824 BYTES FREE\r\r');
        this.out('READY.\r');    
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
        
        this.homeScreen();
        const limit = this.rows * this.cols - 1; // one less to avoid scroll
	    for (let i=0; i<limit; ++i)
	        this.out(' ');
        this.poke(1024 + limit, 32);
        this.poke(13.5 * 4096 + limit, this.fg);
	    this.homeScreen();
        
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
        }
        
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
    }

    public border(color: number) {
        const canvas = document.getElementsByTagName('canvas');
        canvas[0].outerHTML = `<canvas class="border border${(color & 0xF)}"></canvas>`
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

    public keypress(event: KeyboardEvent) {
        const key = event.key;
        if (key.length == 1)
            this.out(key);
    }

    public keydown(key: string, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) {
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
        else if (key == 'Escape' && !shiftKey && !ctrlKey && !altKey)
            this.escapePressed = true;
        else if (key == 'PageUp' && !shiftKey && !ctrlKey && !altKey && this.escapePressed)
            this.init();
        else if (key == 'Cancel' && !shiftKey && ctrlKey && !altKey)
            this.init();
    }

    public keyup(key: string, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) {
        if (key == 'Escape' && !shiftKey && !ctrlKey && !altKey)
            this.escapePressed = false;
    }

    public repeat(fn : () => void, count: number|undefined = undefined, delayms = 5) {
        let i=0;
        const id=setInterval( () => {
            if (!this.escapePressed && (count == null || i++ < count))
                fn();
            else
                clearInterval(id);
            if (this.escapePressed)
                this.out('\rBREAK\rREADY.\r');
        }, delayms);
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
}
