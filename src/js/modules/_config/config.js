import {storeSet, storeGet} from "www/modules/_util/store";
//import {fetchConfiguration} from "www/modules/_util/cmi";
import {fetchConfiguration} from "www/modules/_ajax/config";
import axios from "axios";
import indexOf from "lodash/indexOf";
import {status} from "./status";

//import {decodeKey, parseKey, genKey} from "./key";
const transcript = require("./key");

//change these values to reflect transcript info
const AWS_BUCKET = "assets.christmind.info";
const SOURCE_ID = "acim";
const SOURCE = "A Course In Miracles";

//mp3 and audio timing base directories
const audioBase = `https://s3.amazonaws.com/${AWS_BUCKET}/${SOURCE_ID}/audio`;
const timingBase = "/t/acim/public/timing";

//location of configuration files
const configUrl = "/t/acim/public/config";

//the current configuration, initially null, assigned by getConfig()
let config;

/*
  Fetch audio timing data
*/
export function fetchTimingData(url) {
  return new Promise((resolve, reject) => {
    axios.get(`${timingBase}${url}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Get the configuration file for 'book'. If it's not found in
 * the cache (local storage) then get it from the server and 
 * save it in cache.
 *
 * @param {string} book - the book identifier
 * @param {boolean} assign - true if the config is to be assigned to global config variable
 * @returns {promise}
 */
export function getConfig(book, assign = true) {
  let lsKey = `cfg${book}`;
  let url = `${configUrl}/${book}.json`;

  return new Promise((resolve, reject) => {
    fetchConfiguration(url, lsKey, status).then((resp) => {
      if (assign) {
        config = resp;
      }
      resolve(resp);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Load the configuration file for 'book'. If it's not found in
 * the cache (local storage) then get it from the server and 
 * save it in cache.
 *
 * @param {string} book - the book identifier
 * @returns {promise}
 */
export function loadConfig(book) {
  let lsKey = `cfg${book}`;
  let url = `${configUrl}/${book}.json`;

  //"book" is a single page, no configuration
  // - this is the case for ACIM Preface
  if (!book) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    fetchConfiguration(url, lsKey, status)
      .then((resp) => {
        config = resp;
        resolve(true);
      })
      .catch((error) => {
        config = null;
        console.error(error);
        reject(error);
      });
  });
}

/*
  get audio info from config file
*/
function _getAudioInfo(idx, cIdx) {
  let audioInfo;

  if (idx.length === 4) {
    let qIdx = parseInt(idx[3].substr(1), 10) - 1;
    audioInfo = config.contents[cIdx].questions[qIdx];
  }
  else {
    audioInfo = config.contents[cIdx];
  }
  return audioInfo ? audioInfo: {};
}

export function getAudioInfo(url) {
  //check that config has been initialized
  if (!config) {
    throw new Error("Configuration has not been initialized");
  }

  //remove leading and trailing "/"
  url = url.substr(1);
  url = url.substr(0, url.length - 1);

  let idx = url.split("/");

  //check the correct configuration file is loaded
  if (config.bid !== idx[2]) {
    throw new Error(`Unexpected config file loaded; expecting ${idx[2]} but ${config.bid} is loaded.`);
  }

  let audioInfo = {};
  let cIdx;
  let lookup = [];

  switch(idx[2]) {
    //no audio
    case "text":
    case "workbook":
    case "manual":
    case "acq":
      break;
    default:
      cIdx = parseInt(idx[3].substr(1), 10) - 1;
      audioInfo = _getAudioInfo(idx, cIdx);
      break;
  }

  audioInfo.audioBase = audioBase;
  return audioInfo;
}

/*
 * get timer info for the current page
 */
export function getReservation(url) {
  let audioInfo = getAudioInfo(url);

  if (audioInfo.timer) {
    return audioInfo.timer;
  }

  return null;
}

/*
  Needed for workbook.json and text.json since they have multiple levels
  workbook: content > section > page
  text: contents > sections

  Flatten config file so we can use key.uid to lookup title and url for a given key
  This is necessary for config files that contain more than one level.
*/
function flatten(data) {
  let flat = [];
  if (data.bid === "workbook") {
    for (let content of data.contents) {
      for (let section of content.section) {
        for (let page of section.page) {
          flat.push(page);
        }
      }
    }
  }
  else if (data.bid === "text") {
    for (let content of data.contents) {
      for (let section of content.sections) {
        flat.push(section);
      }
    }
  }
  return flat;
}

/*
  Given a page key, return data from a config file
  returns: book title, page title, url.

  args:
    pageKey: a key uniuely identifying a transcript page
    data: optional, data that will be added to the result, used for convenience

      data is passed when building a list of bookmarks for the bookmark modal
*/
export function getPageInfo(pageKey, data = false) {
  let decodedKey = transcript.decodeKey(pageKey);
  let info = {pageKey: pageKey, source: SOURCE, bookId: decodedKey.bookId};

  if (data) {
    info.data = data;
  }

  return new Promise((resolve, reject) => {
    //get configuration data specific to the bookId
    getConfig(decodedKey.bookId, false)
      .then((data) => {
        info.bookTitle = data.title;

        /*
          This is called to get title and url when bookmarks are loaded, we get this from 
          the annotation.
        */
        if (info.data) {
          for (let prop in info.data) {
            if (info.data.hasOwnProperty(prop)) {
              if (info.data[prop].length > 0) {
                //not all bookmarks have selectedText
                if (info.data[prop][0].selectedText) {
                  info.title = info.data[prop][0].selectedText.title;
                  info.url = info.data[prop][0].selectedText.url;
                }
                else {
                  if (info.data[prop][0].bookTitle) {
                    info.title = info.data[prop][0].bookTitle;
                  }
                  else {
                    info.title = "Don't know the title, sorry!";
                  }
                  info.url = transcript.getUrl(info.pageKey);
                }
                break;
              }
            }
          }
          resolve(info);
          return;
        }
        else {
          /*
            This is called to get title and url for search results
          */
          let flat = [];
          let unit;
          let chapter;
          let flat_store_id = `srch${decodedKey.bookId}flat`;

          switch(decodedKey.bookId) {
            case "preface":
              info.title = "Use of Terms";
              info.url = "/acim/preface/preface/";
              break;
            case "manual":
              info.title = data.contents[decodedKey.uid - 1].title;
              info.url = `/acim/${decodedKey.bookId}${data.contents[decodedKey.uid - 1].url}`;
              break;
            case "workbook":
              flat = storeGet(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                storeSet(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];

              info.title = `${unit.lesson?unit.lesson + ". ":""}${unit.title}`;
              info.url = `/acim/${decodedKey.bookId}/${unit.url}`;
              break;
            case "text":
              flat = storeGet(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                storeSet(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];
              chapter = unit.url.substr(4,2);

              info.title = `${unit.title}`;
              info.url = `/acim/${decodedKey.bookId}/${chapter}/${unit.url}`;
              break;
            default:
              info.title = data.contents[decodedKey.uid - 1].title;
              info.url = `/acim/${decodedKey.bookId}${data.contents[decodedKey.uid - 1].url}`;
              break;
          }

          resolve(info);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

}
