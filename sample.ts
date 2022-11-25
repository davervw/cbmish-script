var cbm = new CbmishConsole();
cbm.CbmishConsole();

const mainMenu = function() {
    cbm.init();
    cbm.hideCursor();

    const x=15;
    let y=10; 
    cbm.locate(x, y);
    const b1 = cbm.addButton("Colors ");
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
    const b2 = cbm.addButton("chr$()s");
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
    const b3 = cbm.addButton("Petscii");
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
    const b4 = cbm.addButton("Maze"+cbm.chr$(109)+cbm.chr$(110)+cbm.chr$(109));
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

    cbm.locate(0, 7);
    cbm.foreground(14);
    cbm.blinkCursor();
}

const addleave = function () {
    cbm.foreground(1);
    cbm.locate(37, 0);
    const leave = cbm.addButton("X");
    leave.onclick = () => { 
        let _cbm:any = cbm; 
        _cbm.escapePressed=true; 
        onleave(); 
    }
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