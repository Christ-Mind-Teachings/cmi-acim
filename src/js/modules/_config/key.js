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
const books = ["preface", "text", "workbook", "manual", "acq"];
const bookIds = ["xxx", ...books];

//list the chapters or parts that make up each book, set the first item to 'xxx'
const acq = ["xxx", "welcome", "acim", "web", "raj"];
const preface = ["xxx", "preface"];

const text = [ "xxx", "chap0100", "chap0101", "chap0102", "chap0200", "chap0201", "chap0202", "chap0203", "chap0204",
  "chap0205", "chap0300", "chap0301", "chap0302", "chap0303", "chap0304", "chap0305", "chap0306",
  "chap0307", "chap0308", "chap0400", "chap0401", "chap0402", "chap0403", "chap0404", "chap0405",
  "chap0406", "chap0407", "chap0408", "chap0500", "chap0501", "chap0502", "chap0503", "chap0504",
  "chap0505", "chap0506", "chap0507", "chap0508", "chap0600", "chap0601", "chap0602", "chap0603",
  "chap0604", "chap0700", "chap0701", "chap0702", "chap0703", "chap0704", "chap0705", "chap0706",
  "chap0707", "chap0708", "chap0709", "chap0710", "chap0711", "chap0800", "chap0801", "chap0802",
  "chap0803", "chap0804", "chap0805", "chap0806", "chap0807", "chap0808", "chap0809", "chap0810",
  "chap0900", "chap0901", "chap0902", "chap0903", "chap0904", "chap0905", "chap0906", "chap0907",
  "chap0908", "chap0909", "chap0910", "chap1000", "chap1001", "chap1002", "chap1003", "chap1004",
  "chap1005", "chap1006", "chap1007", "chap1100", "chap1101", "chap1102", "chap1103", "chap1104",
  "chap1105", "chap1106", "chap1107", "chap1108", "chap1109", "chap1200", "chap1201", "chap1202",
  "chap1203", "chap1204", "chap1205", "chap1206", "chap1300", "chap1301", "chap1302", "chap1303",
  "chap1304", "chap1305", "chap1306", "chap1307", "chap1308", "chap1400", "chap1401", "chap1402",
  "chap1403", "chap1404", "chap1405", "chap1406", "chap1500", "chap1501", "chap1502", "chap1503",
  "chap1504", "chap1505", "chap1506", "chap1507", "chap1508", "chap1509", "chap1510", "chap1600",
  "chap1601", "chap1602", "chap1603", "chap1604", "chap1605", "chap1606", "chap1607", "chap1700",
  "chap1701", "chap1702", "chap1703", "chap1704", "chap1705", "chap1706", "chap1707", "chap1708",
  "chap1800", "chap1801", "chap1802", "chap1803", "chap1804", "chap1805", "chap1806", "chap1807",
  "chap1808", "chap1809", "chap1810", "chap1900", "chap1901", "chap1902", "chap1903", "chap1904",
  "chap1905", "chap1906", "chap1907", "chap1908", "chap1909", "chap1910", "chap1911", "chap2000",
  "chap2001", "chap2002", "chap2003", "chap2004", "chap2005", "chap2006", "chap2007", "chap2008",
  "chap2100", "chap2101", "chap2102", "chap2103", "chap2104", "chap2105", "chap2106", "chap2107",
  "chap2108", "chap2200", "chap2201", "chap2202", "chap2203", "chap2204", "chap2205", "chap2206",
  "chap2300", "chap2301", "chap2302", "chap2303", "chap2304", "chap2400", "chap2401", "chap2402",
  "chap2403", "chap2404", "chap2405", "chap2406", "chap2407", "chap2500", "chap2501", "chap2502",
  "chap2503", "chap2504", "chap2505", "chap2506", "chap2507", "chap2508", "chap2509", "chap2600",
  "chap2601", "chap2602", "chap2603", "chap2604", "chap2605", "chap2606", "chap2607", "chap2608",
  "chap2609", "chap2610", "chap2700", "chap2701", "chap2702", "chap2703", "chap2704", "chap2705",
  "chap2706", "chap2707", "chap2708", "chap2800", "chap2801", "chap2802", "chap2803", "chap2804",
  "chap2805", "chap2806", "chap2807", "chap2900", "chap2901", "chap2902", "chap2903", "chap2904",
  "chap2905", "chap2906", "chap2907", "chap2908", "chap2909", "chap3000", "chap3001", "chap3002",
  "chap3003", "chap3004", "chap3005", "chap3006", "chap3007", "chap3008", "chap3100", "chap3101",
  "chap3102", "chap3103", "chap3104", "chap3105", "chap3106", "chap3107" ];

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

const contents = {
  acq: acq,
  preface: preface,
  text: text,
  workbook: workbook,
  manual: manual
};

/*
  return the position of unit in the bid array
    arg: section is passed when bid = text
*/
function getUnitId(t, source, bid, unit, section) {
  if (section) {
    unit = section;
  }

  if (contents[bid]) {
    return contents[bid].indexOf(unit);
  }
  else {
    throw new Error(`unexpected bookId: ${bid}`);
  }
}

/*
  Return the number of chapters in the book (bid). 
  Subtract one from length because of 'xxx' (fake chapter)
*/
function getNumberOfUnits(bid) {
  if (contents[bid]) {
    return contents[bid].length - 1;
  }
  else {
    throw new Error(`getNumberOfUnits() unexpected bookId: ${bid}`);
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
  key.bid = bookIds.indexOf(parts[2]);
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

  //subtract 1 from key value to get index
  decodedKey.uid = parseInt(pageKeyString.substr(3,4), 10);

  return decodedKey;
}

/*
 * Convert page key to url
 */
function getUrl(key) {
  let decodedKey = decodeKey(key);
  let unit = "invalid";

  if (decodedKey.error) {
    return "/invalid/key/";
  }

  if (contents[decodedKey.bookId]) {
    unit = contents[decodedKey.bookId][decodedKey.uid];

    if (decodedKey.bookId === "text") {
      let chapter = unit.substr(4,2);
      unit = `${chapter}/${unit}`;
    }
  }

  return `/${decodedKey.bookId}/${unit}/`;
}

/*
function getUrl(key) {
  let decodedKey = decodeKey(key);
  let unit = "invalid";
  let chapter;

  if (decodedKey.error) {
    return "";
  }

  switch(decodedKey.bookId) {
    case "text":
      unit = text[decodedKey.uid];
      chapter = unit.substr(4,2);
      unit = `${chapter}/${unit}`;
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
    case "acq":
      unit = acq[decodedKey.uid];
      break;
  }

  return `/${decodedKey.bookId}/${unit}/`;
}
*/

function getBooks() {
  return books;
}

module.exports = {
  getNumberOfUnits: getNumberOfUnits,
  getBooks: getBooks,
  getSourceId: getSourceId,
  getKeyInfo: getKeyInfo,
  parseKey: parseKey,
  genPageKey: genPageKey,
  genParagraphKey: genParagraphKey,
  decodeKey: decodeKey,
  getUrl: getUrl
};

