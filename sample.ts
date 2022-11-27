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

    cbm.locate(x, y+=3);
    cbm.fg = 3;
    const b3 = cbm.addButton("Petscii ");
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

    cbm.locate(x, y+=3);
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

mainMenu();