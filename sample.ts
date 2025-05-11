// sample.ts - Demo code simulating an 8-bit classic system
// Copyright (c) 2022-2023 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com

var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.removeButtons();

const mainMenu = function() {
    cbm.init();
    cbm.hideCursor();

    const x=15;
    let y=6;
    cbm.locate(x, y);
    cbm.fg = 7;
    const b1 = cbm.addButton("Colors  ");
    b1.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.init(); 
                addexit();
                cbm.locate(0, 7);
                cbm.colorPicker(false);
            }, 250);
    }

    cbm.locate(b1.right+2, y);
    cbm.fg = 8;
    const b7 = cbm.addButton("Dissolve ");
    b7.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addexit();
                dissolve();
            }, 250);
    }

    cbm.locate(x, y+=3);
    cbm.fg = 1;
    const b2 = cbm.addButton("chr$()s ");
    b2.onclick = () => {
        setTimeout(
            () => { 
                cbm.removeButtons(); 
                cbm.init();
                addexit();
                cbm.petsciiChr$Chart(); 
            }, 250);
    }

    cbm.locate(b2.left-10, y);
    cbm.fg = 3;
    const b13 = cbm.addButton("22x23 ");
    b13.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.resize({ cols: 22, rows: 23 })
                addexit();
                screenVic();
            }, 250);
    }

    cbm.locate(b2.right+2, y);
    cbm.fg = 3;
    const b3 = cbm.addButton("Petscii  ");
    b3.onclick = () => {
        setTimeout(
            () => { 
                cbm.removeButtons(); 
                cbm.init();
                addexit();
                cbm.petsciiPokesChart(); 
            }, 250);
    }

    cbm.locate(x, y+=3);
    cbm.fg = 10;
    const b4 = cbm.addButton("Maze"+cbm.chr$(110)+cbm.chr$(109)+cbm.chr$(110)+cbm.chr$(109));
    b4.onclick = () => {
        setTimeout(
            () => { 
                cbm.removeButtons();
                cbm.init();
                addexit();
                cbm.locate(0, 6);
                cbm.maze(cbm.getRows()-6); 
            }, 250);
    }

    cbm.locate(b4.left-10, y);
    cbm.fg = 0;
    const b14 = cbm.addButton("80x25 ");
    b14.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.resize({cols: 80, rows: 25})
                addexit();
                screenVdc();
            }, 250);
    }

    cbm.locate(b4.right+2, y);
    cbm.fg = 12;
    const b8 = cbm.addButton("Low res  ");
    b8.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addexit();
                loresPlotDemo();
            }, 250);
    }

    cbm.locate(x, y+=3);
    cbm.fg = 13;
    const b5 = cbm.addButton("Keyboard");
    b5.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.fg = 1;
                addexit();
                cbm.keyboardChart();
                cbm.redrawButtons();
            }, 250);
    }

    cbm.locate(b5.left-10, y);
    cbm.fg = 5;
    const b15 = cbm.addButton("80x25 ");
    b15.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.resize({cols: 80, rows: 25})
                addexit();
                screenPet();
            }, 250);
    }

    cbm.locate(b5.right+2, y);
    cbm.fg = 5;
    const b9 = cbm.addButton("Sine Wave");
    b9.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addexit();
                loresSineWave();
            }, 250);
    }

    cbm.locate(b9.left, y+3);
    cbm.fg = 7;
    const b18 = cbm.addButton("Snake    ");
    b18.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                snakeDemo();
            }, 250);
    } 

    cbm.locate(36, 21);
    cbm.fg = 1;
    const b10 = cbm.addButton(cbm.chr$(123));
    b10.onclick = () => {
        setTimeout(
            () => {
                cbm.toggleFullScreen();
            }, 250);
    }

    cbm.locate(x, y+=3);
    cbm.fg = 0;
    const b11 = cbm.addButton("Knight  ");
    b11.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addexit();
                dragonDemo();
            }, 250);
    } 

    cbm.locate(b11.left-10, y);
    cbm.fg = 1;
    const b16 = cbm.addButton("80x50 ");
    b16.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.resize({cols: 80, rows: 50})
                addexit();
                screenBig();
            }, 250);
    }

    cbm.locate(x, y+=3);
    cbm.fg = 15;
    const b6 = cbm.addButton("About   ");
    b6.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.fg = 1;
                cbm.aboutCbmish();
                addexit();
            }, 250);
    }

    cbm.locate(b11.left-10, y);
    cbm.fg = 14;
    const b17 = cbm.addButton("40x25 ");
    b17.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.resize({cols: 40, rows: 25})
                addexit();
                screenC64();
            }, 250);
    }

    cbm.locate(b6.right+2, y);
    cbm.fg = 2;
    const b12 = cbm.addButton("Dots   ");
    b12.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.fg = 1;
                dots();
                addexit();
            }, 250);
    }

    cbm.locate(0, 7);
    cbm.foreground(14);
    cbm.blinkCursor();
}

const addexit = function () {
    const saveColor = cbm.fg;
    cbm.foreground(1);
    const saveRowCol = cbm.locate(cbm.getCols()-3, 0);
    const leave = cbm.addButton("X");
    leave.onclick = () => { 
        let _cbm:any = cbm; 
        _cbm.escapePressed=true;
        if (cbm.getCols() < 40) {
            cbm.resize();
            addDoubleClickToggleCursorHandler();
        }
        onleave(); 
    }
    cbm.fg = saveColor;
    cbm.locate(saveRowCol[1], saveRowCol[0]);
}

const onleave = function () {
    setTimeout(() => {
        cbm.removeButtons();
        cbm.hideSprites();
        mainMenu();
        let _cbm:any = cbm;
        _cbm.escapePressed=false;
    }, 250);
};

const dissolve = function () {
    cbm.clear(); 
    let a=[]; 
    for (let i=0; i<4000; ++i) 
    a[i]=i; 
    for (let i=0; i<4000; ++i) { 
        let j=Math.floor(Math.random()*4000); 
        [ a[i], a[j] ] = [ a[j], a[i] ]; 
    } 
    let i=0; 
    cbm.repeat(() => {
         for (let j=1; j<=10 ; ++j) {
            let offset = a[i++ % 4000];
            let y = Math.floor(offset / 80);
            let x = offset % 80;
            if (y < 6 && x >= cbm.getCols()*2-6)
                continue;
            if (i <= 4000) {
                let fg = Math.floor(y / 12) * 4 + Math.floor(x / 20);
                if (fg > 15)
                    fg -= 4;
                cbm.foreground(fg);
                cbm.loresPlot(x, y);
            } else
                cbm.loresUnPlot(x, y);
            if (i == 8000) {
                let closeButton = cbm.findButton("X");
                closeButton.onclick();
            }
        } 
    }, 800, 0);
}

const loresPlotDemo = function () {
    cbm.clear();
    
    const link_text = 'link: blog entry';
    const link_url = 'https://techwithdave.davevw.com/2021/04/low-resolution-graphics-for-commodore.html';
    cbm.locate((cbm.getCols() - link_text.length) / 2, cbm.getRows() - 2);
    cbm.addLink(link_text, link_url);

    let n = Math.ceil(4*Math.PI/0.03) + 1;
    let i = 0;
    cbm.repeat( () => {
        let p = Math.cos(i / 2);
        let x = (cbm.getCols() - 1) * p * Math.cos(i) + cbm.getCols();
        let y = (cbm.getRows() - 1) * p * Math.sin(i) + cbm.getRows();
        cbm.loresPlot(x, y);
        i += 0.03;
    }, n, 5);
}

const loresSineWave = function () {
    cbm.hideCursor();
    cbm.clear();
    cbm.newLine();
    cbm.foreground(7);
    cbm.largeText('HELLO');
    cbm.largeText('CBM!');

    cbm.foreground(0);
    const textDimensions = {width: cbm.getCols(), height: cbm.getRows()};
    const loresDimensions = {width: textDimensions.width*2, height: textDimensions.height*2};
    for (let x = 0; x < loresDimensions.width; ++x)
        cbm.loresPlot(x, loresDimensions.height/2); // centered horizontal line
    for (let y = 0; y < loresDimensions.height; ++y)
        cbm.loresPlot(loresDimensions.width/2, y); // centered vertical line
    cbm.foreground(1);
    let x=0;
    cbm.repeat( () => {
        let y=loresDimensions.height/2*Math.sin(x/10)+loresDimensions.height/2;
        cbm.loresPlot(x, y);
        if (++x == loresDimensions.width) {
            cbm.foreground(14);
            const link_text = 'link: tweet';
            const link_url = 'https://twitter.com/DaveRVW/status/1547040376367636480';
            cbm.locate(cbm.getCols() * 0.55, cbm.getRows() - 3);
            cbm.addLink(link_text, link_url);
                    cbm.locate(0, 19);
            cbm.out('READY');
            cbm.newLine();
            cbm.blinkCursor();
        };
    }, loresDimensions.width);
}

const dragonDemo = function () {
    const dragonChars = [
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

    const dragonColor = [
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

    const knightImage = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0xc0, 0x00, 0x00, 0xa2, 0x00, 0x00, 0x92, 0x00, 0x00, 0x8a, 0x00, 0x00, 0xfa, 0x00, 0x00, 0x22,
        0x00, 0x00, 0x27, 0x00, 0x00, 0xfe, 0x00, 0x00, 0x20, 0x00, 0x00, 0x50, 0x00, 0x00, 0x88, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];

    const dragonImage = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0x80, 0x00, 0x1f,
        0xc0, 0x00, 0xbf, 0x00, 0x07, 0xbc, 0x00, 0x3d, 0xff, 0xc0, 0x3f, 0xff, 0xe0, 0x00, 0xc6, 0x70,
        0x01, 0xce, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];

    cbm.foreground(14);
    cbm.background(13);
    cbm.border(3);
    cbm.clear();
    const cols = cbm.getCols();
    for (let y=0; y<25; ++y) {
        for (let x=0; x<40; ++x) {
            const src = x+y*40;
            const dest = x+y*cols;
            cbm.poke(13.5*4096+dest, dragonColor[src]);
            cbm.poke(1024+dest, dragonChars[src]);
        }
    }
    cbm.findButton('X').color = 0;
    cbm.redrawButtons();
    cbm.hideCursor();
    cbm.locate(2, 23);
    cbm.addLink('link: orig. knight/dragon blog entry', 'https://techwithdave.davevw.com/2022/08/knight-vs-dragon-prototype-on-commodore.html');
    cbm.homeScreen();

    let knight = cbm.sprites[0];
    let dragon = cbm.sprites[1];

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

    const random0to4 = () => { return Math.floor(Math.random()*5); }

    let collisions: number[] = [];

    cbm.onSpriteCollision = (collisionSprites: number[], collisionBackground: number[]) => {
        collisions = collisionSprites;
    }

    cbm.repeat( () => {
        collisions = [];

        switch (random0to4()) {
            case 1: 
                if (knight._x > 0) 
                    knight.move(knight._x-5, knight._y); 
                break;
            case 2:
                if (knight._x < 180)
                    knight.move(knight._x+5, knight._y);
                break;
            case 3:
                if (knight._y > 120)
                    knight.move(knight._x, knight._y-5);
                break;
            case 4:
                if (knight._y < 200)
                    knight.move(knight._x, knight._y+5);
        }
        switch (random0to4()) {
            case 1: 
                if (dragon._x > 0) 
                    dragon.move(dragon._x-5, dragon._y); 
                break;
            case 2:
                if (dragon._x < 180)
                    dragon.move(dragon._x+5, dragon._y);
                break;
            case 3:
                if (dragon._y > 120)
                    dragon.move(dragon._x, dragon._y-5);
                break;
            case 4:
                if (dragon._y < 200)
                    dragon.move(dragon._x, dragon._y+5);
                break;
        }

        if (collisions.length == 2)
            cbm.border(2);
        else
            cbm.border(3);

    }, null, 100);
}

let dotsVectors = [
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
    { xd: 0, yd: 0},
]

const dots = function() {
    cbm.clear();
    dotsForegroundText();
    dotsCreateSprites();
    dotsMoveLoop();
}

const dotsForegroundText = function() {
    const promotion = false;
    if (promotion) {
        cbm.newLine();
        cbm.newLine();
        cbm.newLine();
        cbm.foreground(3);
        cbm.out(cbm.chr$(14)); // upper/lowercase
        cbm.largeText('Simulating')
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
        cbm.out(`${cbm.chr$(18)}ONLY${cbm.chr$(146)} LOOKS like a C64 `);
        cbm.foreground(14);
        cbm.underline(3);
        cbm.addLink('github: cbmish', 'https://github.com/davervw/cbmish-script');
        cbm.homeScreen();
    } else {
        cbm.foreground(15);
        cbm.out(cbm.chr$(18));
        const y0 = Math.floor(cbm.getRows() / 3);
        const y1 = y0*2;
        for (let y=y0; y<y1; ++y) {
            cbm.locate(Math.floor(cbm.getCols() / 2), y);
            cbm.out(`${cbm.chr$(18)} `);
        }
        cbm.out(cbm.chr$(146));
    }
}

let dotsCollision: number[] = [];

const dotsMoveLoop = function() {
    cbm.onSpriteCollision = (collisionSprites: number[], collisionBackground: number[]) => {
        const collisionSet = new Set([...collisionSprites, ...collisionBackground]);
        dotsCollision = Array.from(collisionSet);
    }
    cbm.repeat( () => { dotsMove() }, undefined, 20 );
}

const dotsMove = function() {
    let origin = { x: 24, y: 50}
    let screen = { width: cbm.getWidth(), height: cbm.getHeight() };
    for (let i=0; i<cbm.sprites.length; ++i) {
        let sprite = cbm.sprites[i];
        
        let oldPosition = { x: sprite._x, y: sprite._y };
        
        // calculate new position
        let x = sprite._x + dotsVectors[i].xd;
        let y = sprite._y + dotsVectors[i].yd;

        // check off screen
        if (x < origin.x || x >= origin.x + screen.width-24*((sprite._doubleX)?2:1)) {
            dotsVectors[i].xd = -dotsVectors[i].xd;
            x = sprite._x + dotsVectors[i].xd;
        }
        if (y < origin.y || y >= origin.y + screen.height-21*((sprite._doubleY)?2:1)) {
            dotsVectors[i].yd = -dotsVectors[i].yd;
            y = sprite._y + dotsVectors[i].yd;
        }

        // move and test collision
        dotsCollision = [];
        sprite.move(x, y);
        
        if (dotsCollision.includes(i)) {
            sprite.move(oldPosition.x, oldPosition.y);

            // randomize vectors so sprites go somewhere else
            for (let j of dotsCollision) {
                do {
                    dotsVectors[j] = {
                        xd: Math.floor(Math.random() * 11 - 5),
                        yd: Math.floor(Math.random() * 11 - 5),
                    };
                    cbm.sprites[j]._color = sprite._color;
                } while (dotsVectors[j].xd == 0 && dotsVectors[j].yd == 0);
            }
            dotsCheckResetColors();
        }
    }
}

let dotsResetId = undefined;

const dotsCheckResetColors = function() {
    if (this.dotsResetId != null)
        return; // already set to reset, wait

    const colors = new Set();
    cbm.sprites.forEach((sprite) => colors.add(sprite._color) );
    if (colors.size > 1)
        return; // multiple colors so don't reset yet

    // if got here, then all dots are the same color

    this.dotsResetId = setTimeout(() => {
        // reset colors
        let color = 0;
        cbm.sprites.forEach((sprite) => {
            if (color == cbm.getBackground())
                color = (color + 1) & 15;
            sprite.color(color);
            color = (color + 1) & 15;
        });
        this.dotsResetId = null;
    }, 3000);
}

const dotsCreateSprites = function() {
    let origin = { x: 24, y: 50}
    let screen = { width: cbm.getWidth(), height: cbm.getHeight() };
    let doubleSize = { x: false, y: false };
    cbm.hideSprites();
    const circle = dotSpriteImage();
    let color = 0;
    for (let i=0; i<cbm.sprites.length; ++i) {
        let sprite = cbm.sprites[i];
        const image = spriteXorWithNumber(circle, i);
        sprite.image(image);
        if (color == cbm.getBackground())
            ++color;
        sprite.color(color);
        color = (color + 1) & 15;
        sprite.size(doubleSize.x, doubleSize.y);
        cbm.onSpriteCollision = (_1, _2) => {
            let x = origin.x+Math.random()*(screen.width-24);
            let y = origin.y+Math.random()*(screen.height-21);
            sprite.move(x,y);
        }
        let x = origin.x+Math.random()*(screen.width-24);
        let y = origin.y+Math.random()*(screen.height-21);
        sprite.move(x,y);
        do {
            dotsVectors[i] = {
                xd: Math.floor(Math.random() * 11 - 5),
                yd: Math.floor(Math.random() * 11 - 5),
            };
        } while (dotsVectors[i].xd == 0 || dotsVectors[i].yd == 0);
        if ((i & 1) == 1)
            sprite.sendToBack();
        sprite.show();
    }
    cbm.onSpriteCollision = (_1, _2) => null;
}

const dotSpriteImage = function () {
    const width = 24;
    const height = 21;
    const radius = height / 2;
    let image: number[] = [];
    for (let i = 0; i < height; i += 1) {
        const y = i - radius;
        const angle = Math.asin(y / radius);
        const x = Math.floor(radius * Math.cos(angle));
        let s = "00";
        for (let j = 0; j < Math.floor(radius - x); ++j)
            s += '0'
        for (let j = 0; j < x; ++j)
            s += '11';
        while (s.length < width)
            s += '0';
        image.push(Number.parseInt(s.slice(0, 8), 2));
        image.push(Number.parseInt(s.slice(8, 16), 2));
        image.push(Number.parseInt(s.slice(16, 24), 2));
    }
    return image;
}

const spriteXorWithNumber = function(image: number[], n: number): number[] {
    image = [...image]; // make copy for modification
    const s = `${n}`;
    if (/^[0-9]$/.test(s)) { // one digit
        const iFont = s.charCodeAt(0) * 8;
        for (let i=0; i<8; ++i)
            image[(8+i)*3+1] ^= c64_char_rom[iFont+i];
    } else if (/^[0-9][0-9]$/.test(s)) { // two digits
        const iFont0 = s.charCodeAt(0) * 8;
        const iFont1 = s.charCodeAt(1) * 8;
        for (let i=0; i<8; ++i) {
            image[(8+i)*3+0] ^= c64_char_rom[iFont0+i] >> 4;
            image[(8+i)*3+1] ^= ((c64_char_rom[iFont0+i] & 15) << 4) | (c64_char_rom[iFont1+i] >> 4);
            image[(8+i)*3+2] ^= (c64_char_rom[iFont1+i] & 15) << 4;
        }
    } else
        throw `expected one or two digit number, not ${n}`;
    return image;
}

const addDoubleClickToggleCursorHandler = () => {
    const consoleElement = document.getElementsByTagName('console')[0];
    const topCanvas = consoleElement.getElementsByClassName("sprites")[0] as HTMLCanvasElement;
    topCanvas.removeEventListener('dblclick', toggleBlinkingCursor, false);
    topCanvas.addEventListener('dblclick', toggleBlinkingCursor, false);
}

const removeDoubleClickToggleCursorHandler = () => {
    const consoleElement = document.getElementsByTagName('console')[0];
    const topCanvas = consoleElement.getElementsByClassName("sprites")[0] as HTMLCanvasElement;
    topCanvas.removeEventListener('dblclick', toggleBlinkingCursor, false);
}

const toggleBlinkingCursor = function() {
    const blink = !cbm.hideCursor();
    if (blink)
        cbm.blinkCursor();
}

const screenVic = () => {
    cbm.font = vic20_char_rom;
    cbm.background(1)
    cbm.foreground(6);
    cbm.border(3);
    cbm.clear();
    cbm.out("*** TYPESCRIPT ***\r");
    cbm.newLine();
    cbm.addLink("CBMISH", 'https://github.com/davervw/cbmish-script');
    cbm.out(" 1GB FREE\r");
    cbm.newLine();
    cbm.out("READY.\r");
    cbm.findButton("X").color = 0;
    cbm.redrawButtons();
    addDoubleClickToggleCursorHandler();
}

const screenVdc = () => {
    cbm.init({background: 0, border: 0, foreground: 3});
    addDoubleClickToggleCursorHandler();
}

const screenPet = () => {
    cbm.init({background: 0, border: 0, foreground: 5});
    addDoubleClickToggleCursorHandler();
}

const screenBig = () => {
    cbm.init({background: 6, border: 14, foreground: 15});
    cbm.foreground(1);
    cbm.hideCursor();
    cbm.blinkCursor();
    addDoubleClickToggleCursorHandler();
}

const screenC64 = () => {
    cbm.font = c64_char_rom;
    cbm.init();
    cbm.foreground(1);
    cbm.hideCursor();
    cbm.blinkCursor();
    addDoubleClickToggleCursorHandler();
}

const snakeDemo = () => {
    const saveColor = cbm.fg;
    const saveRowCol = cbm.locate(cbm.getCols() - 3, 0);

    removeDoubleClickToggleCursorHandler();
    cbm.foreground(5);
    cbm.background(0);
    cbm.border(0);
    cbm.hideCursor();
    cbm.clear();
    const cols = cbm.getCols();
    const rows = cbm.getRows();
    cbm.out(cbm.chr$(18));
    for (let x=0; x<cols; ++x)
        cbm.out(' ');
    for (let y=1; y<rows-1; ++y) {
        cbm.locate(0, y);
        cbm.out(' ');
        cbm.locate(cols-1, y);
        cbm.out(' ');
    }
    cbm.locate(0, rows-1);
    cbm.out('  ');
    const link = cbm.addLink('SNAKE', 'https://github.com/davervw/c-snake');
    link.normal = cbm.chr$(146)+cbm.chr$(2)+'SNAKE'+cbm.chr$(130);
    link.hover = cbm.chr$(18)+'SNAKE'+cbm.chr$(146);
    cbm.locate(link.left, link.top);
    cbm.out(link.normal);
    cbm.out(cbm.chr$(18)+' Copyright (c) 2025 DAVERVW');
    while(cbm.getCol() < cols-1)
        cbm.out(' ');
    cbm.left();
    cbm.insert();
    cbm.out(' ');
    cbm.out(cbm.chr$(146));

    let snake = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        segments: [],
        food: { x: 0, y: 0 },
        speed: 1,
        dead: false,
        wait: false,
        pause: false,
        keyboardBuffer: [],
        init: () => {
            cbm.onKeyPress = (event, cbmkey) => snake.onKeyPress(event, cbmkey);
            cbm.onKeyDown = (event, cbmkey) => snake.onKeyDown(event, cbmkey);
            cbm.onClick = (x, y) => snake.onClick(x, y);
            snake.reset();
        },
        advance: () => {
            if (snake.dead)
                return;
            if (snake.pause) {
                snake.delay();
                return;
            }
            snake.processKey();
            snake.x = snake.x + snake.dx;
            snake.y = snake.y + snake.dy;
            if (snake.isCollision()) {
                snake.die();
                setTimeout(() => snake.wait = false, 1000);
                return;
            }
            snake.drawHead();
            if (snake.x == snake.food.x && snake.y == snake.food.y) {
                snake.placeFood();
                if (snake.speed > 150)
                    snake.speed -= 10;
                snake.displayScore();
            } else
                snake.eraseTail();
            snake.delay();
        },
        isCollision: (): boolean => {
            if (snake.x < 1 || snake.x >= cols - 1 || snake.y < 1 || snake.y >= rows - 1)
                return true;
            const collision = (snake.segments.find(segment => segment.x == snake.x && segment.y == snake.y));
            if (collision != null && collision != snake.segments[0])
                return true;
            return false;
        },
        die: () => {
            console.log("die");
            snake.x = snake.x - snake.dx;
            snake.y = snake.y - snake.dy;
            cbm.locate(snake.x, snake.y);
            cbm.lowercase = false;
            cbm.out(cbm.chr$(118));
            snake.dead = true;
            snake.wait = true;
            snake.keyboardBuffer = [];
        },
        delay: () => {
            setTimeout(() => snake.advance(), snake.speed);
        },
        onKeyPress: (event: KeyboardEvent, cbmkey: string) => {
            if (snake.dead && snake.wait)
                return;
            if (snake.dead) {
                snake.dead = false; // avoid multiple resets
                snake.reset();
                return;
            }
            snake.keyboardBuffer.push(cbmkey);
        },
        onKeyDown: (event: KeyboardEvent, cbmkey: string) => {
            if (snake.dead && snake.wait)
                return;
            if (snake.dead) {
                snake.dead = false; // avoid multiple resets
                snake.reset();
                return;
            }
            if (event.key == 'Escape') {
                snake.dx = 0;
                snake.dy = 0;
                snake.die();
                snake.exit();
                return;
            }
            if (event.key == 'Enter') {
                snake.pause = !snake.pause;
                if (!snake.pause)
                    snake.keyboardBuffer = [];
                return;
            }
            if (event.key.length > 1) // avoid doubling up cbmkey 
                snake.keyboardBuffer.push(event.key)
        },
        left: () => {
            if (snake.dx == 1 && snake.dy == 0) {
                snake.dx = 0;
                snake.dy = -1;
            } else if (snake.dx == 0 && snake.dy == -1) {
                snake.dx = -1;
                snake.dy = 0;
            } else if (snake.dx == -1 && snake.dy == 0) {
                snake.dx = 0;
                snake.dy = 1;
            } else if (snake.dx == 0 && snake.dy == 1) {
                snake.dx = 1;
                snake.dy = 0;
            }
        },
        right: () => {
            if (snake.dx == 1 && snake.dy == 0) {
                snake.dx = 0;
                snake.dy = 1;
            } else if (snake.dx == 0 && snake.dy == 1) {
                snake.dx = -1;
                snake.dy = 0;
            } else if (snake.dx == -1 && snake.dy == 0) {
                snake.dx = 0;
                snake.dy = -1;
            } else if (snake.dx == 0 && snake.dy == -1) {
                snake.dx = 1;
                snake.dy = 0;
            }
        },
        reset: () => {
            console.log("reset");
            snake.clear();
            cbm.locate(2,2);
            cbm.out('ARROW KEYS or CLICK to turn');
            cbm.locate(2,4);
            cbm.out('Z and / rotate snake');
            cbm.locate(2,6);
            cbm.out('ENTER or CLICK border to pause');
            // display instructions for a while, then start
            setTimeout(snake.start, 2500);
        },
        clear: () => {
            for (let y = 1; y < rows - 1; ++y) {
                cbm.locate(1, y);
                for (let x = 1; x < cols - 1; ++x)
                    cbm.out(' ');
            }            
        },
        start: () => {
            console.log("start");
            snake.x = Math.floor(cols / 2);
            snake.y = Math.floor(rows / 2);
            snake.dx = 1;
            snake.dy = 0;
            snake.clear();
            snake.segments = [];
            snake.drawHead();
            snake.placeFood();
            snake.displayScore();
            snake.dead = false;
            snake.speed = 300;
            snake.keyboardBuffer = [];
            snake.delay();
        },
        exit: () => {
            console.log("exit");
            let _cbm: any = cbm;
            _cbm.escapePressed = true;
            if (cbm.getCols() < 40) {
                cbm.resize();
                addDoubleClickToggleCursorHandler();
            }
            cbm.fg = saveColor;
            cbm.locate(saveRowCol[1], saveRowCol[0]);
            cbm.onKeyDown = null;
            cbm.onKeyPress = null;
            cbm.onClick = null;
            onleave(); 
        },
        placeFood: () => {
            while (1) {
                let x = Math.floor(Math.random() * (cols-2)) + 1;
                let y = Math.floor(Math.random() * (rows-2)) + 1;
                let found = snake.segments.find(segment => segment.x == x && segment.y == y);
                if (found == null) {
                    snake.food = { x: x, y: y };
                    cbm.locate(x, y);
                    cbm.lowercase = false;
                    cbm.out(cbm.chr$(122));
                    return;
                }
            }
        },
        drawHead: () => {
            cbm.locate(snake.x, snake.y);
            cbm.lowercase = false;
            cbm.out(cbm.chr$(119));
            snake.segments.push({ x: snake.x, y: snake.y });
            if (snake.segments.length > 1) {
                const previousSegment = snake.segments[snake.segments.length-2];
                cbm.locate(previousSegment.x, previousSegment.y);
                cbm.out(cbm.chr$(113));
            }
        },
        eraseTail: () => {
            const isHeadOnTail = (snake.segments[0].x == snake.x && snake.segments[0].y == snake.y);
            if (!isHeadOnTail) {
                cbm.locate(snake.segments[0].x, snake.segments[0].y);
                cbm.out(' ');
            }
            snake.segments.shift();
        },
        displayScore: () => {
            const score = snake.segments.length.toString().padStart(4);
            cbm.locate(cols-5, rows-1);
            cbm.out(cbm.chr$(18)+score+cbm.chr$(146));
        },
        processKey: () => {
            while (1) { // read until no key or recognize key
                if (snake.keyboardBuffer.length == 0)
                    return;
                const key = snake.keyboardBuffer.shift();
                if (key == 'ArrowUp') {
                    if (snake.dx != 0 || snake.dy != 1) {
                        snake.dx = 0;
                        snake.dy = -1;
                    }
                    return;
                } else if (key == 'ArrowDown') {
                    if (snake.dx != 0 || snake.dy != -1) {
                        snake.dx = 0;
                        snake.dy = 1;
                    }
                    return;
                } else if (key == 'ArrowLeft') {
                    if (snake.dx != 1 || snake.dy != 0) {
                        snake.dx = -1;
                        snake.dy = 0;
                    }
                    return;
                } else if (key == 'ArrowRight') {
                    if (snake.dx != -1 || snake.dy != 0) {
                        snake.dx = 1;
                        snake.dy = 0;
                    }
                    return;
                } else if (key.toLocaleLowerCase() == 'z') {
                    snake.left();
                    return;
                } else if (key == '/') {
                    snake.right();
                    return;
                }
            }
        },
        onClick: (x: number, y: number) => {
            if (snake.dead) {
                if (snake.wait)
                    return;
                snake.dead = false; // avoid multiple resets
                snake.reset();
                return;
            }
            if (x == 0 || y == 0 || x == cols-1 || y == rows-1) {
                snake.pause = !snake.pause;
                return;
            }
            if (snake.pause) {
                snake.pause = false;
                snake.keyboardBuffer = [];
            }
            const centerX = Math.floor(cols / 2);
            const centerY = Math.floor(rows / 2);
            const diffX = x - centerX;
            const diffY = y - centerY;
            const slope = diffY == 0 ? diffX : diffX / diffY;
            const slopeThreshold = centerX / centerY;
            if (diffX < 0 && diffY < 0) {
                if (slope > slopeThreshold)
                    snake.keyboardBuffer.push('ArrowLeft');
                else
                    snake.keyboardBuffer.push('ArrowUp');
            } else if (diffX < 0 && diffY >= 0) {
                if (-slope > slopeThreshold)
                    snake.keyboardBuffer.push('ArrowLeft');
                else
                    snake.keyboardBuffer.push('ArrowDown');
            } else if (diffX >= 0 && diffY < 0) {
                if (-slope > slopeThreshold)
                    snake.keyboardBuffer.push('ArrowRight');
                else
                    snake.keyboardBuffer.push('ArrowUp');
            } else if (diffX >= 0 && diffY >= 0) {
                if (slope > slopeThreshold)
                    snake.keyboardBuffer.push('ArrowRight');
                else
                    snake.keyboardBuffer.push('ArrowDown');
            }
        }
    };

    snake.init();
}

mainMenu();
addDoubleClickToggleCursorHandler();
