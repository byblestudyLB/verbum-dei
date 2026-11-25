// Local public-domain WEB data; never calls a remote Bible API.
import { readFileSync } from "node:fs";
const books = {
  "genesis": "Gen",
  "exodus": "Exod",
  "leviticus": "Lev",
  "numbers": "Num",
  "deuteronomy": "Deut",
  "joshua": "Josh",
  "judges": "Judg",
  "ruth": "Ruth",
  "1 samuel": "1Sam",
  "2 samuel": "2Sam",
  "1 kings": "1Kgs",
  "2 kings": "2Kgs",
  "1 chronicles": "1Chr",
  "2 chronicles": "2Chr",
  "ezra": "Ezra",
  "nehemiah": "Neh",
  "esther": "Esth",
  "job": "Job",
  "psalms": "Ps",
  "proverbs": "Prov",
  "ecclesiastes": "Eccl",
  "song of solomon": "Song",
  "isaiah": "Isa",
  "jeremiah": "Jer",
  "lamentations": "Lam",
  "ezekiel": "Ezek",
  "daniel": "Dan",
  "hosea": "Hos",
  "joel": "Joel",
  "amos": "Amos",
  "obadiah": "Obad",
  "jonah": "Jonah",
  "micah": "Mic",
  "nahum": "Nah",
  "habakkuk": "Hab",
  "zephaniah": "Zeph",
  "haggai": "Hag",
  "zechariah": "Zech",
  "malachi": "Mal",
  "matthew": "Matt",
  "mark": "Mark",
  "luke": "Luke",
  "john": "John",
  "acts": "Acts",
  "romans": "Rom",
  "1 corinthians": "1Cor",
  "2 corinthians": "2Cor",
  "galatians": "Gal",
  "ephesians": "Eph",
  "philippians": "Phil",
  "colossians": "Col",
  "1 thessalonians": "1Thess",
  "2 thessalonians": "2Thess",
  "1 timothy": "1Tim",
  "2 timothy": "2Tim",
  "titus": "Titus",
  "philemon": "Phlm",
  "hebrews": "Heb",
  "james": "Jas",
  "1 peter": "1Pet",
  "2 peter": "2Pet",
  "1 john": "1John",
  "2 john": "2John",
  "3 john": "3John",
  "jude": "Jude",
  "revelation": "Rev",
  "psalm": "Ps",
  "song of songs": "Song"
};
const cache = new Map();
function loadBook(code) {
  if (!cache.has(code)) cache.set(code, JSON.parse(readFileSync(new URL("./web-bible/" + code + ".json", import.meta.url), "utf8")));
  return cache.get(code);
}
function lookupPassage(reference,loadBook,books){
  const match=String(reference).trim().match(/^(.+?)\s+(\d+):(\d+(?:\s*[-–]\s*(?:\d+:)?\d+)?(?:\s*[,;]\s*(?:\d+:)?\d+(?:\s*[-–]\s*(?:\d+:)?\d+)?)*)$/);
  if(!match)throw new Error("Unsupported WEB reference: "+reference);
  const code=books[match[1].toLowerCase().replace(/\s+/g," ")];
  if(!code)throw new Error("Unknown or unavailable WEB book: "+match[1]);
  const book=loadBook(code);
  let chapter=Number(match[2]);
  const result=[];
  for(const segment of match[3].split(/[,;]/)){
    const range=segment.trim().match(/^(?:(\d+):)?(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/);
    if(!range)throw new Error("Invalid WEB verse range: "+reference);
    const firstChapter=range[1]?Number(range[1]):chapter;
    const firstVerse=Number(range[2]);
    const lastChapter=range[3]?Number(range[3]):firstChapter;
    const lastVerse=range[4]?Number(range[4]):firstVerse;
    if(firstChapter<1||firstVerse<1||lastVerse<1||lastChapter<firstChapter||lastChapter-firstChapter>20)throw new Error("Invalid WEB range: "+reference);
    for(let c=firstChapter;c<=lastChapter;c++){
      const verses=book[c];
      if(!verses)throw new Error("Missing WEB chapter: "+code+" "+c);
      const start=c===firstChapter?firstVerse:1;
      const end=c===lastChapter?lastVerse:Math.max(...Object.keys(verses).map(Number));
      if(end<start||end-start>200)throw new Error("Invalid WEB verse bounds: "+reference);
      for(let v=start;v<=end;v++){
        const text=verses[v];
        if(typeof text!=="string"||!text.trim())throw new Error("Missing WEB verse: "+code+" "+c+":"+v);
        result.push(text.trim());
      }
    }
    chapter=lastChapter;
  }
  if(!result.length)throw new Error("Empty WEB passage: "+reference);
  return {text:result.join(" "),version:"World English Bible"};
}
export function getEnglishPassage(reference) { return lookupPassage(reference, loadBook, books); }
