import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { getEnglishPassage } from "../netlify/functions/web-passage.js";
const dir = new URL("../netlify/functions/web-bible/", import.meta.url);
const files = readdirSync(dir).filter(f=>f.endsWith(".json"));
assert.equal(files.length,66);
let chapters=0, verses=0;
for (const file of files) { const book=JSON.parse(readFileSync(new URL(file,dir),"utf8")); chapters+=Object.keys(book).length; for(const chapter of Object.values(book)){for(const verse of Object.values(chapter)){assert.equal(typeof verse,"string"); assert.ok(verse.trim()); verses++;}} }
assert.equal(chapters,1189); assert.equal(verses,31098);
const matt=JSON.parse(readFileSync(new URL("Matt.json",dir),"utf8"));
const gal=JSON.parse(readFileSync(new URL("Gal.json",dir),"utf8"));
assert.equal(getEnglishPassage("Matthew 13:54-58").text,[54,55,56,57,58].map(v=>matt[13][v].trim()).join(" "));
assert.equal(getEnglishPassage("Galatians 3:23-29").text,[23,24,25,26,27,28,29].map(v=>gal[3][v].trim()).join(" "));
assert.equal(getEnglishPassage("Matthew 13:58-14:2").text,[matt[13][58],matt[14][1],matt[14][2]].map(v=>v.trim()).join(" "));
assert.throws(()=>getEnglishPassage("Matthew 13:59"));
assert.throws(()=>getEnglishPassage("Matthew 13:58-54"));
assert.throws(()=>getEnglishPassage("Unknown 1:1"));
console.log("Validated local WEB: "+files.length+" books, "+chapters+" chapters, "+verses+" verses; today's exact passages and invalid references.");
