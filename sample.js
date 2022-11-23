var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.lowercase = false;
var id = cbm.repeat(function () { return cbm.out(cbm.chr$(109.5 + Math.random())); }, 40 * 18 - 1, 0);
