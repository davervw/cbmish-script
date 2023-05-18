// example of accessing Bible text from JSON via JavaScript

import { bible } from "./bible.js"
const books = getBooks();

// MIT LICENSE
// bible.js Copyright 2023 by David Van Wagner dave@davevw.com
//
// Permission is hereby granted, free of charge, to any person 
// obtaining a copy of this software and associated documentation files 
// (the “Software”), to deal in the Software without restriction, 
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, 
// and to permit persons to whom the Software is furnished to do so, 
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

function getBooks() {
  return bible.filter(x => x.chapter == 1 && x.verse == 1).map(x => x.book);
}

function findVerse(book, chapter, verse) {
  return bible.find(x => x.book == book && x.chapter == chapter && x.verse == verse);
}

function countBooks() {
  return books.length;
}

function countChapters(book) {
  return bible.filter(x => x.book == book && x.verse == 1).length;
}

function countVerses(book, chapter) {
  return bible.filter(x => x.book == book && x.chapter == chapter).length;
}

function findText(text) {
  text = text.toLowerCase();
  return bible.filter(x => x.text.toLowerCase().includes(text));
}

const diagDiv = document.getElementById('diag');

function refreshVerse() {
  const textDiv = document.getElementById('text');
  const book = books[document.getElementById('books').selectedIndex];
  const chapter = document.getElementById('chapter').selectedIndex+1;
  const verse = document.getElementById('verse').selectedIndex+1;
  const match = findVerse(book, chapter, verse);
  textDiv.innerHTML = `<p><b>${match.text}</b></p>`
}

function fillSelectBooks() {
  const selectBooks = document.getElementById('books');
  let booknum = 0
  selectBooks.innerHTML = "";
  books.map(book => {
    selectBooks.innerHTML += `<option value="${booknum}">${book}</option>`;
    booknum++;
  })
}

function fillChapters() {
  const selectChapter = document.getElementById('chapter');
  const book = books[document.getElementById('books').selectedIndex];
  selectChapter.innerHTML = "";
  bible.filter(x => x.book == book && x.verse == 1).map(x => {
    selectChapter.innerHTML += `<option value="${x.chapter}">${x.chapter}</option>`;
  })
}
  
function fillVerses() {
  const selectVerse = document.getElementById('verse');       
  const book = books[document.getElementById('books').selectedIndex];
  const chapter = document.getElementById('chapter').selectedIndex+1;
  selectVerse.innerHTML = "";
  bible.filter(x => x.book == book && x.chapter == chapter).map(x => {
    selectVerse.innerHTML += `<option value="${x.verse}">${x.verse}</option>`;
  })
}

////////////////////////////////////////////////////////////////////////

fillSelectBooks();
fillChapters();
fillVerses();
refreshVerse();

document.getElementById('books').onchange = function() {
  document.getElementById('chapter').selectedIndex = 0;
  document.getElementById('verse').selectedIndex = 0;
  fillChapters();
  fillVerses();
  refreshVerse();
}
document.getElementById('chapter').onchange = function() {
  document.getElementById('verse').selectedIndex = 0;
  fillVerses();
  refreshVerse();
}
document.getElementById('verse').onchange = function() {
  refreshVerse();
}

diagDiv.innerHTML += `<p>${bible.length} verses</p>`;
let bytes = 0;
bible.map(x => bytes += x.text.length+1); // add text and newline
diagDiv.innerHTML += `<p>${bytes} bytes text</p>`;
diagDiv.innerHTML += `<p>${countBooks()} books</p>`;
diagDiv.innerHTML += `<p>${countChapters("GENESIS")} chapters in Genesis</p>`;
diagDiv.innerHTML += `<p>${countVerses("GENESIS", 1)} verses in Genesis 1</p>`;
diagDiv.innerHTML += `<p>${countChapters("PSALMS")} chapters in Psalms</p>`;
diagDiv.innerHTML += `<p>${countVerses("PSALMS", 139)} verses in Psalms 139</p>`;
diagDiv.innerHTML += `<p>${countChapters("MATTHEW")} chapters in Matthew</p>`;
diagDiv.innerHTML += `<p>${countVerses("MATTHEW", 1)} verses in Matthew 1</p>`;
diagDiv.innerHTML += `<p>${countChapters("REVELATION")} chapters in Revelation</p>`;
diagDiv.innerHTML += `<p>${countVerses("REVELATION", 22)} verses in Relevation 22</p>`;
diagDiv.innerHTML += "<hr>"

const searchText = "great fish"
let count = 0;
let matches = findText(searchText)
diagDiv.innerHTML += `<p>${searchText} mentioned ${matches.length} times`
matches.map(x => {
  if (++count < 100)
  {
    diagDiv.innerHTML += `<p>${x.book} ${x.chapter}:${x.verse}`
    diagDiv.innerHTML += `<p>${x.text}</p>`
  }
});