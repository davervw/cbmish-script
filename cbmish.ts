const C64colors: number[][] = [
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

class CbmishConsole {
    dirtyx = 0;
    dirtyy = 0;
    dirtywidth = 0;
    dirtyheight = 0;
    fg = 14;

    row = 0;
    col = 0;

    rows = 24;
    cols = 40;

    canvas: any = document.getElementById("screen");
    ctx = this.canvas?.getContext("2d");
    imgData = this.ctx.getImageData(0, 0, 320, 200);
    bitmap = this.imgData.data;
    bgcells: number[] = [];

    CbmishConsole() {
        this.clear();
    }

    public init() {
        this.border(14);
        this.background(6);
        this.foreground(14);
	    this.clear();
        this.out('\r    **** HTML/CSS/TYPESCRIPT ****\r\r');
        this.out('1GB RAM SYSTEM  1073741824 BYTES FREE\r\r');
        this.out('READY.\r');    
    }

    public out(obj: any) {
        const s = obj.toString();
        for (var i = 0; i < s.length; ++i)
            this.outChar(s.charAt(i)); 
    }

    outChar(s: string) {
        if (s.length != 1) throw "expected string of exactly one character";
        const c = s.charCodeAt(0);
        if (s == '\r') {
            this.newLine();
            return;
        }
        if (c == 19) {
            this.home();
            return;
        }
        if (c == 147) {
            this.clear();
            return;
        }
        if (c < 32 || c >= 127)
            return;

        const i = this.ascii_to_petscii(c)*8;

        const chardata = [
            c64_char_rom[i], 
            c64_char_rom[i+1],
            c64_char_rom[i+2],
            c64_char_rom[i+3],
            c64_char_rom[i+4],
            c64_char_rom[i+5],
            c64_char_rom[i+6],
            c64_char_rom[i+7],
        ];

        this.drawC64Char(chardata, this.col*8, this.row*8, this.fg);
        
        if (++this.col >= this.cols) {
            this.col = 0;
            if (++this.row >= this.rows)
                this.row = 0;
        }
    }

    newLine() {
        if (++this.row >= this.rows)
            this.row = 0;
        this.col = 0;
    }

    clear() {
        this.home();
	    for (let i=0; i<1000; ++i)
	        this.out(' ');
	    this.row = 0;
    }

    home() {
        this.row = 0;
        this.col = 0;
    }

    ascii_to_petscii(c: number): number {
        if (c < 32) return 32;
        if (c > 127) return 32;
        if (c >= 32 && c <= 63) return c;
        if (c >= 64 && c <= 64+30) return c-64; // @ABC...Z[\]_
        if (c >= 97 && c <= 96+26) return c-96; // TODO: lowercase
        return 32;        
    }

    poke(address: number, value: number) {

        if (address < 1024 || address >= 2024)
            return;
        if (value < 0 || value > 255)
            throw "expected value 0 to 255";

        const i = value*8;

        let col = (address - 1024) % this.cols;
        let row = Math.floor((address - 1024) / this.cols);

        const chardata = [
            c64_char_rom[i], 
            c64_char_rom[i+1],
            c64_char_rom[i+2],
            c64_char_rom[i+3],
            c64_char_rom[i+4],
            c64_char_rom[i+5],
            c64_char_rom[i+6],
            c64_char_rom[i+7],
        ];

        this.drawC64Char(chardata, col*8, row*8, this.fg);
    }

    drawC64Char(chardata: number[], x: number, y: number, fg: number) {
        let b: number;
        let r: number;
      
        fg = fg & 0xF;
      
        for (r = 0; r < 8; ++r) {
          for (b = 0; b < 8; ++b) {
            var j = (x+(7-b) + (y+r)*320)*4;
            if ((chardata[r] & (1 << b)) != 0) {
              this.bitmap[j + 0] = C64colors[fg][0];
              this.bitmap[j + 1] = C64colors[fg][1];
              this.bitmap[j + 2] = C64colors[fg][2];
              this.bitmap[j + 3] = C64colors[fg][3];
            }
            else
              this.bitmap[j + 3] = 0; // set alpha component to transparent
          }
        }
      
        requestAnimationFrame(() => this.animationCallback());
      
        if (this.dirtywidth == 0 && this.dirtyheight == 0)
        {
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
      
    animationCallback() {
        if (this.dirtywidth == 0 || this.dirtyheight == 0)
          return;
        this.ctx.putImageData(this.imgData, 0, 0, this.dirtyx, this.dirtyy, this.dirtywidth, this.dirtyheight);
        this.dirtyx = 0;
        this.dirtyy = 0;
        this.dirtywidth = 0;
        this.dirtyheight = 0;
    }      

    foreground(fg: number) {
        this.fg = fg;
    }

    background(bg: number) {
        const canvas = document.getElementsByTagName('canvas');
        canvas[1].outerHTML = `<canvas class="background background${(bg & 0xF)}"></canvas>`
    }

    border(color: number) {
        const canvas = document.getElementsByTagName('canvas');
        canvas[0].outerHTML = `<canvas class="border border${(color & 0xF)}"></canvas>`
    }
}
