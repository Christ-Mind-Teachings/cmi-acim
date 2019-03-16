import store from "store";
import axios from "axios";
import indexOf from "lodash/indexOf";
import {status} from "./status";

//import {decodeKey, parseKey, genKey} from "./key";
const transcript = require("./key");

//change these values to reflect transcript info
const AWS_BUCKET = "assets.christmind.info";
const SOURCE_ID = "acim";

//mp3 and audio timing base directories
const audioBase = `https://s3.amazonaws.com/${AWS_BUCKET}/${SOURCE_ID}/audio`;
const timingBase = "/acim/public/timing";

//location of configuration files
const configUrl = "/acim/public/config";
const configStore = "config.acim.";

//the current configuration, initially null, assigned by getConfig()
let config;

/*
  The status constains the save date for each config file. We compare that to the saveDate
  in the locally stored config file. If it's different or doesn't exist we need to get
  a new version.

  return: true - get a new version
          false - use the one we've got
*/
function refreshNeeded(cfg) {
  let saveDate = status[cfg.bid];

  if (!cfg.saveDate) {
    cfg.saveDate = saveDate;

    //we don't use this anymore
    if (cfg.lastFetchDate) {
      delete cfg.lastFetchDate;
    }
    console.log("%s needs to be refreshed", cfg.bid);
    return true; //refresh needed
  }

  if (cfg.saveDate === saveDate) {
    //no refresh needed
    return false;
  }
  else {
    //config file has changed, refresh needed
    cfg.saveDate = saveDate;
    console.log("%s needs to be refreshed", cfg.bid);
    return true;
  }
}

function requestConfiguration(url) {
  return axios.get(url);
}

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

/*
  We use book level configuration that is loaded by request via AJAX. Once
  loaded the config is persisted in local storage. A check is made for
  configuration data loaded from storage to determine if the data needs to
  be reloaded. This is indicated using Define-webpack-plugin to set the timestamp
  of configurations that have changed.

  args:
    book: the book identifier, woh, wot, etc
    assign: when true, assign global variable 'config' to retrieved data
*/
export function getConfig(book, assign = true) {
  return new Promise((resolve, reject) => {
    let cfg = store.get(`${configStore}${book}`);
    let url;

    //if config in local storage check if we need to get a fresh copy
    if (cfg && !refreshNeeded(cfg)) {
      if (assign) {
        config = cfg;
      }
      resolve(cfg);
      return;
    }

    //get config from server
    url = `${configUrl}/${book}.json`;
    requestConfiguration(url)
      .then((response) => {
        //add save date before storing
        response.data.saveDate = status[response.data.bid];
        store.set(`${configStore}${book}`, response.data);
        if (assign) {
          config = response.data;
        }
        resolve(response.data);
      })
      .catch(() => {
        config = null;
        reject(`Config file: ${url} is not valid JSON`);
      });
  });
}

/*
  For transcript pages; load the configuration file.
  For non-transcript pages; configuration is loaded by getConfig()

  This is the same as getConfig() except it doesn't resolve passing the data
  but a message indicating source of the configuration file

  loadConfig resolves with:
    0: no ${book}.json file found
    1: config loaded from local store
    2: config loaded from server

*/
export function loadConfig(book) {
  return new Promise((resolve, reject) => {
    if (typeof book === "undefined") {
      resolve(0);
      return;
    }
    let cfg = store.get(`${configStore}${book}`);
    let url;

    //if config in local storage check if we need to get a fresh copy
    if (cfg && !refreshNeeded(cfg)) {
      config = cfg;
      resolve(1);
      return;
    }

    //get config from server
    url = `${configUrl}/${book}.json`;
    requestConfiguration(url)
      .then((response) => {
        //add save date before storing
        response.data.saveDate = status[response.data.bid];
        store.set(`${configStore}${book}`, response.data);
        config = response.data;
        resolve(2);
      })
      .catch((error) => {
        config = null;
        reject(`Config file: ${url} is not valid JSON: ${error}`);
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
  if (config.bid !== idx[1]) {
    throw new Error(`Unexpected config file loaded; expecting ${idx[1]} but ${config.bid} is loaded.`);
  }

  let audioInfo = {};
  let cIdx;
  let lookup = [];

  switch(idx[1]) {
    //no audio
    case "text":
    case "workbook":
    case "manual":
      break;
    default:
      cIdx = parseInt(idx[2].substr(1), 10) - 1;
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
  let info = {pageKey: pageKey, bookId: decodedKey.bookId};

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
              //console.log("info.data prop: %s", prop);
              //console.log(info.data[prop][0].selectedText);
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
          let flat_store_id = `search.acim.${decodedKey.bookId}.flat`;

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
              flat = store.get(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                store.set(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];

              info.title = `${unit.lesson?unit.lesson + ". ":""}${unit.title}`;
              info.url = `/acim/${decodedKey.bookId}/${unit.url}`;
              break;
            case "text":
              flat = store.get(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                store.set(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];
              chapter = unit.url.substr(4,2);

              info.title = `${unit.title}`;
              info.url = `/acim/${decodedKey.bookId}/${chapter}/${unit.url}`;
              break;
            default:
              info.title = data.contents[decodedKey.uid].title;
              info.url = `/acim/${decodedKey.bookId}${data.contents[decodedKey.uid].url}`;
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
