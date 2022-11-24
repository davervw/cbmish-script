var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.out('\rClick on screen...');

const canvas: HTMLElement = cbm.canvas;
canvas.addEventListener('click', onclickcanvas, false);

cbm.hideCursor();

function onclickcanvas(event: MouseEvent) {
    const x = Math.floor(event.offsetX / 8);
    const y = Math.floor(event.offsetY / 8);
    if (x <= cbm.cols || y <= cbm.rows)
    {
        cbm.locate(x, y);
        cbm.out('\x12 ');
    }
    event.preventDefault();
}

