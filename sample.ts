var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.foreground(1);
cbm.lowercase=false; 
let id = cbm.repeat(() => cbm.out(cbm.chr$(109.5+Math.random())), 40*18-1, 0);
