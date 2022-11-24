var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.out('\rClick on screen...');
var canvas = cbm.canvas;
canvas.addEventListener('click', onclickcanvas, false);
cbm.hideCursor();
function onclickcanvas(event) {
    var x = Math.floor(event.offsetX / 8);
    var y = Math.floor(event.offsetY / 8);
    if (x <= cbm.cols || y <= cbm.rows) {
        cbm.locate(x, y);
        cbm.out('\x12 ');
    }
    event.preventDefault();
}
