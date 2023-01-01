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
                addleave();
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
                addleave();
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
                addleave();
                cbm.petsciiChr$Chart(); 
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
                addleave();
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
                addleave();
                cbm.locate(0, 6);
                cbm.maze(19); 
            }, 250);
    }

    cbm.locate(b4.right+2, y);
    cbm.fg = 12;
    const b8 = cbm.addButton("Low res  ");
    b8.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addleave();
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
                addleave();
                cbm.keyboardChart();
                cbm.redrawButtons();
            }, 250);
    }

    cbm.locate(b5.right+2, y);
    cbm.fg = 5;
    const b9 = cbm.addButton("Sine Wave");
    b9.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                addleave();
                loresSineWave();
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

    cbm.locate(x, y+=6);
    cbm.fg = 15;
    const b6 = cbm.addButton("About   ");
    b6.onclick = () => {
        setTimeout(
            () => {
                cbm.removeButtons();
                cbm.fg = 1;
                cbm.aboutCbmish();
                addleave();
            }, 250);
    }

    cbm.locate(0, 7);
    cbm.foreground(14);
    cbm.blinkCursor();
}

const addleave = function () {
    const saveColor = cbm.fg;
    cbm.foreground(1);
    const saveRowCol = cbm.locate(37, 0);
    const leave = cbm.addButton("X");
    leave.onclick = () => { 
        let _cbm:any = cbm; 
        _cbm.escapePressed=true; 
        onleave(); 
    }
    cbm.fg = saveColor;
    cbm.locate(saveRowCol[1], saveRowCol[0]);
}

const onleave = function () {
    setTimeout(() => {
        cbm.removeButtons();
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
            if (y < 6 && x >= 74)
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
    let n = Math.ceil(4*Math.PI/0.03) + 1;
    let i = 0;
    cbm.repeat( () => {
        let p=Math.cos(i/2);
        let x=39*p*Math.cos(i)+40;
        let y=24*p*Math.sin(i)+25;
        cbm.loresPlot(x, y);
        i += 0.03;
    }, n, 5);
}

const loresSineWave = function () {
    cbm.clear();
    cbm.newLine();
    cbm.foreground(7);
    cbm.largeText('HELLO');
    cbm.largeText('CBM!');
    cbm.foreground(0);
    for (let x=0; x<80; ++x)
        cbm.loresPlot(x, 25); // centered horizontal line
    for (let y=0; y<50; ++y)
        cbm.loresPlot(40, y); // centered vertical line
    cbm.foreground(1);
    let x=0;
    cbm.repeat( () => {
        let y=25*Math.sin(x/10)+25;
        cbm.loresPlot(x, y);
        if (++x == 80) {
            cbm.locate(0, 19);
            cbm.foreground(14);
            cbm.out('READY');
            cbm.newLine();
        };
    }, 80);
}

mainMenu();
