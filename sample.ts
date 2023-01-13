// sample.ts - Demo code simulating an 8-bit classic system
// Copyright (c) 2022-2023 by David R. Van Wagner
// github.com/davervw/cbmish-script
// davevw.com

var cbm = new CbmishConsole();
cbm.CbmishConsole();
cbm.foreground(7);
cbm.out("2^5000");
cbm.foreground(3);
cbm.out(" = ");
cbm.foreground(1);
cbm.out(`${BigInt(2) ** BigInt(5000)}`);
