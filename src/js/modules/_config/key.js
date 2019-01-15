/*
  ACIM: Transcript keys
  - first item starts with 1, not 0
  - a numeric value that represents a specific transcript and represents
    a specific logical ordering.

  - The integer part of the key represent a transcript and the decimal part
    a paragraph within the transcript.
  - The paragraphId is increased by 1 and divided by 1000

  key format: ssbuuuu.ppp
  where: ss: source Id
          b: book Id
       uuuu: unit Id
        ppp: paragraph number - not positional

  NOTE: This module is used by code running in the browser and Node so the 
        common.js module system is used
*/

//import indexOf from "lodash/indexOf";
const sprintf = require("sprintf-js").sprintf;

//length of pageKey excluding decimal portion
const keyLength = 7;

//Source Id, this must be a unique two digit number
const sourceId = 12;

//list the books, these correspond to collection names defined in _config.yml
// * order according to how search results and bookmarks should appear
const books = ["preface", "text", "workbook", "manual"];
const bookIds = ["xxx", ...books];

//list the chapters or parts that make up each book, set the first item to 'xxx'
const preface = ["xxx", "preface"];

const workbook = ["xxx", "introp1", "l001", "l002", "l003", "l004", "l005", "l006", "l007", "l008", "l009",
  "l010", "l011", "l012", "l013", "l014", "l015", "l016", "l017", "l018", "l019", "l020", "l021",
  "l022", "l023", "l024", "l025", "l026", "l027", "l028", "l029", "l030", "l031", "l032", "l033",
  "l034", "l035", "l036", "l037", "l038", "l039", "l040", "l041", "l042", "l043", "l044", "l045",
  "l046", "l047", "l048", "l049", "l050", "review1", "l051", "l052", "l053", "l054", "l055", "l056",
  "l057", "l058", "l059", "l060", "l061", "l062", "l063", "l064", "l065", "l066", "l067", "l068",
  "l069", "l070", "l071", "l072", "l073", "l074", "l075", "l076", "l077", "l078", "l079", "l080",
  "review2", "l081", "l082", "l083", "l084", "l085", "l086", "l087", "l088", "l089", "l090", "l091",
  "l092", "l093", "l094", "l095", "l096", "l097", "l098", "l099", "l100", "l101", "l102", "l103", "l104",
  "l105", "l106", "l107", "l108", "l109", "l110", "review3", "l111", "l112", "l113", "l114", "l115",
  "l116", "l117", "l118", "l119", "l120", "l121", "l122", "l123", "l124", "l125", "l126", "l127", "l128",
  "l129", "l130", "l131", "l132", "l133", "l134", "l135", "l136", "l137", "l138", "l139", "l140", "review4",
  "l141", "l142", "l143", "l144", "l145", "l146", "l147", "l148", "l149", "l150", "l151", "l152", "l153",
  "l154", "l155", "l156", "l157", "l158", "l159", "l160", "l161", "l162", "l163", "l164", "l165", "l166",
  "l167", "l168", "l169", "l170", "review5", "l171", "l172", "l173", "l174", "l175", "l176", "l177", "l178",
  "l179", "l180", "intro181", "l181", "l182", "l183", "l184", "l185", "l186", "l187", "l188", "l189",
  "l190", "l191", "l192", "l193", "l194", "l195", "l196", "l197", "l198", "l199", "l200", "review6", "l201",
  "l202", "l203", "l204", "l205", "l206", "l207", "l208", "l209", "l210", "l211", "l212", "l213", "l214",
  "l215", "l216", "l217", "l218", "l219", "l220", "introp2", "forgiveness", "l221", "l222", "l223", "l224",
  "l225", "l226", "l227", "l228", "l229", "l230", "salvation", "l231", "l232", "l233", "l234", "l235",
  "l236", "l237", "l238", "l239", "l240", "world", "l241", "l242", "l243", "l244", "l245", "l246", "l247",
  "l248", "l249", "l250", "sin", "l251", "l252", "l253", "l254", "l255", "l256", "l257", "l258", "l259",
  "l260", "body", "l261", "l262", "l263", "l264", "l265", "l266", "l267", "l268", "l269", "l270", "christ",
  "l271", "l272", "l273", "l274", "l275", "l276", "l277", "l278", "l279", "l280", "holyspirit", "l281",
  "l282", "l283", "l284", "l285", "l286", "l287", "l288", "l289", "l290", "realworld", "l291", "l292",
  "l293", "l294", "l295", "l296", "l297", "l298", "l299", "l300", "secondcoming", "l301", "l302", "l303",
  "l304", "l305", "l306", "l307", "l308", "l309", "l310", "lastjudgement", "l311", "l312", "l313",
  "l314", "l315", "l316", "l317", "l318", "l319", "l320", "creation", "l321", "l322", "l323", "l324",
  "l325", "l326", "l327", "l328", "l329", "l330", "ego", "l331", "l332", "l333", "l334", "l335",
  "l336", "l337", "l338", "l339", "l340", "miracle", "l341", "l342", "l343", "l344", "l345", "l346",
  "l347", "l348", "l349", "l350", "whatami", "l351", "l352", "l353", "l354", "l355", "l356", "l357",
  "l358", "l359", "l360", "final", "l361", "epilog"];

const manual = ["xxx", "chap01", "chap02", "chap03", "chap04", "chap05", "chap06", "chap07", "chap08", "chap09",
  "chap10", "chap11", "chap12", "chap13", "chap14", "chap15", "chap16", "chap17", "chap18", "chap19",
  "chap20", "chap21", "chap22", "chap23", "chap24", "chap25", "chap26", "chap27", "chap28", "chap29",
  "chap30", "chap31"];

/*
  The unitId is the sequential value of a logical ordering of units in a book,
  except for the 'Text' where it is given by the pattern "CCSS" where 
  CC is the chapter Number and SS is the Section Number. The Introduction is 00.
*/
function getUnitId(bid, unit, section) {
  let chapter = 0;
  switch(bid) {
    case "preface":
      return preface.indexOf(unit);
    case "text":
      chapter = parseInt(section.substr(4), 10);
      return chapter;
    case "workbook":
      return workbook.indexOf(unit);
    case "manual":
      return manual.indexOf(unit);
    default:
      throw new Error(`unexpected bookId: ${bid}`);
  }
}

function splitUrl(url) {
  let u = url;

  //remove leading and trailing "/"
  u = url.substr(1);
  u = u.substr(0, u.length - 1);

  return u.split("/");
}

function getSourceId() {
  return sourceId;
}

function getKeyInfo() {
  return {
    sourceId: sourceId,
    keyLength: keyLength
  };
}

/*
  parse bookmarkId into pageKey and paragraphId
  - pid=0 indicates no paragraph id
*/
function parseKey(key) {
  const keyInfo = getKeyInfo();
  let keyString = key;
  let pid = 0;

  if (typeof keyString === "number") {
    keyString = key.toString(10);
  }

  let decimalPos = keyString.indexOf(".");

  //if no decimal key doesn't include paragraph id
  if (decimalPos > -1) {
    let decimalPart = keyString.substr(decimalPos + 1);

    //append 0's if decimal part < 3
    switch(decimalPart.length) {
      case 1:
        decimalPart = `${decimalPart}00`;
        break;
      case 2:
        decimalPart = `${decimalPart}0`;
        break;
    }
    pid = parseInt(decimalPart, 10);
  }
  let pageKey = parseInt(keyString.substr(0, keyInfo.keyLength), 10);

  return {pid, pageKey};
}

/*
  Convert url into key
  returns -1 for non-transcript url

  key format: ssbuuIqq.ppp
  where: ss: source Id
          b: book Id
       uuuu: unit Id
        ppp: paragraph number - not positional
*/
function genPageKey(url = location.pathname) {
  let key = {
    sid: sourceId,
    bid: 0,
    uid: 0
  };

  let parts = splitUrl(url);

  //make sure we have a valid book
  key.bid = bookIds.indexOf(parts[0]);
  if (key.bid === -1) {
    return -1;
  }

  //get the unitId of the page, return if invalid
  key.uid = getUnitId(...parts);
  if (key.uid === -1) {
    return -1;
  }

  let compositeKey = sprintf("%02s%01s%04s", key.sid, key.bid, key.uid);
  let numericKey = parseInt(compositeKey, 10);

  return numericKey;
}

/* 
  genParagraphKey(paragraphId, key: url || pageKey) 

  args:
    pid: a string representing a transcript paragraph, starts as "p0"..."pnnn"
         - it's converted to number and incremented by 1 then divided by 1000
        pid can also be a number so then we just increment it and divide by 1000

    key: either a url or pageKey returned from genPageKey(), if key
   is a string it is assumed to be a url
*/
function genParagraphKey(pid, key = location.pathname) {
  let numericKey = key;
  let pKey;

  if (typeof pid === "string") {
    pKey = (parseInt(pid.substr(1), 10) + 1) / 1000;
  }
  else {
    pKey = (pid + 1)/1000;
  }

  //if key is a string it represents a url
  if (typeof key === "string") {
    numericKey = genPageKey(key);
  }

  let paragraphKey = numericKey + pKey;

  return paragraphKey;
}

/*
  key format: ssbuuuu.ppp
  where: ss: source Id
          b: book Id
       uuuu: unit Id
        ppp: paragraph number - not positional
*/
function decodeKey(key) {
  let {pid, pageKey} = parseKey(key);
  let pageKeyString = pageKey.toString(10);
  let decodedKey = {
    error: false,
    message: "ok",
    sid: 0,
    bookId: "",
    uid: 0,
    pid: pid - 1
  };

  //error, invalid key length
  if (pageKeyString.length !== keyLength) {
    decodedKey.error = true;
    decodedKey.message = `Integer portion of key should have a length of ${keyLength}, key is: ${pageKeyString}`;
    return decodedKey;
  }

  //check for valid sourceId
  decodedKey.sid = parseInt(pageKeyString.substr(0,2), 10);
  if (decodedKey.sid !== sourceId) {
    decodedKey.error = true;
    decodedKey.message = `Invalid sourceId: ${decodedKey.sid}, expecting: ${sourceId}`;
    return decodedKey;
  }

  let bid = parseInt(pageKeyString.substr(2,1), 10);
  decodedKey.bookId = bookIds[bid];

  //substract 1 from key value to get index
  decodedKey.uid = parseInt(pageKeyString.substr(3,4), 10);

  return decodedKey;
}

function getUrl(key) {
  let decodedKey = decodeKey(key);
  let unit = "invalid";
  let chapter;

  if (decodedKey.error) {
    return "";
  }

  switch(decodedKey.bookId) {
    case "text":
      unit = sprintf("%04s", decodedKey.uid);
      chapter = unit.substr(0,2);
      unit = `${chapter}/chap${unit}`;
      break;
    case "workbook":
      unit = workbook[decodedKey.uid];
      break;
    case "manual":
      unit = manual[decodedKey.uid];
      break;
    case "preface":
      unit = preface[decodedKey.uid];
      break;
  }

  return `/${decodedKey.bookId}/${unit}/`;
}

function getBooks() {
  return books;
}

module.exports = {
  getBooks: getBooks,
  getSourceId: getSourceId,
  getKeyInfo: getKeyInfo,
  parseKey: parseKey,
  genPageKey: genPageKey,
  genParagraphKey: genParagraphKey,
  decodeKey: decodeKey,
  getUrl: getUrl
};

/*
function testIt(what, url) {
  let parts = splitUrl(url);

  console.log("url: %s", url);
  console.log("%s: %s", what, getUnitId(...parts));

  let pKey = genPageKey(url);
  console.log("pageKey: %s", pKey);

  let paraKey = genParagraphKey(23, url);
  console.log("paraKey: %s", paraKey);

  let dkey = decodeKey(paraKey);
  console.log("decoded key: %o", dkey);
  console.log("url: %s", getUrl(paraKey));
  console.log("-------------------------");
}

let textUrl = "/text/02/chap0204/";
let prefaceUrl = "/preface/preface/";
let workbookUrl = "/workbook/l156/";
let manualUrl = "/manual/chap21/";

testIt("preface", prefaceUrl);
testIt("text", textUrl);
testIt("workbook", workbookUrl);
testIt("manual", manualUrl);
*/
