import indexOf from "lodash/indexOf";

import {fetchConfiguration} from "common/modules/_ajax/config";

import {status} from "./status";
const transcript = require("./key");

let g_sourceInfo;
let config; //the current configuration, initially null, assigned by getConfig()

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
  let url = `${g_sourceInfo.configUrl}/${book}.json`;

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
  let url = `${g_sourceInfo.configUrl}/${book}.json`;

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
  let info = {pageKey: pageKey, source: g_sourceInfo.title, bookId: decodedKey.bookId};

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

          /*
           * Big Question here: 4/24/23, why do url's below omitt "/t"?
           * - I'm going to change it and see if there are problems.
           */
          switch(decodedKey.bookId) {
            case "preface":
              info.title = "Use of Terms";
              info.url = "/t/acim/preface/preface/";
              break;
            case "manual":
              info.title = data.contents[decodedKey.uid - 1].title;
              info.url = `/t/acim/${decodedKey.bookId}${data.contents[decodedKey.uid - 1].url}`;
              break;
            case "workbook":
              flat = g_sourceInfo.getValue(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                g_sourceInfo.setValue(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];

              info.title = `${unit.lesson?unit.lesson + ". ":""}${unit.title}`;
              info.url = `/t/acim/${decodedKey.bookId}/${unit.url}`;
              break;
            case "text":
              flat = g_sourceInfo.getValue(flat_store_id);
              if (!flat) {
                flat = flatten(data);
                g_sourceInfo.setValue(flat_store_id, flat);
              }
              unit = flat[decodedKey.uid - 1];
              chapter = unit.url.substr(4,2);

              info.title = `${unit.title}`;
              info.url = `/t/acim/${decodedKey.bookId}/${chapter}/${unit.url}`;
              break;
            default:
              info.title = data.contents[decodedKey.uid - 1].title;
              info.url = `/t/acim/${decodedKey.bookId}${data.contents[decodedKey.uid - 1].url}`;
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

export function setEnv(si) {
  g_sourceInfo = si;
}

