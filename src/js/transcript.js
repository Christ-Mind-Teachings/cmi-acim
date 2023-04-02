/* eslint no-console: off */
import {SourceStore, storeInit} from "www/modules/_util/store";
import search from "www/modules/_search/search";

//common modules
import {showParagraph} from "www/modules/_util/url";
import auth from "www/modules/_user/netlify";
import fb from "www/modules/_util/facebook";
import {initTranscriptPage} from "www/modules/_page/startup";

import {loadConfig} from "./modules/_config/config";
import {bookmarkStart} from "./modules/_bookmark/start";
import { searchInit } from "./modules/_search/search";
import toc, {getBookId} from "./modules/_contents/toc";
import audio from "./modules/_audio/audio";
import about from "./modules/_about/about";

import {setLanguage} from "www/modules/_language/lang";
import constants from "./constants";

$(document).ready(() => {
  const store = new SourceStore(constants);
  storeInit(constants);
  setLanguage(constants);

  auth.initialize();
  initTranscriptPage("pnDisplay");
  fb.initialize();
  about.initialize();

  //load config file and do initializations that depend on a loaded config file
  loadConfig(getBookId()).then((result) => {
    search.initialize(searchInit(store));

    //no contents when result is false
    if (result) {
      toc.initialize("transcript");
      audio.initialize();
    }
    showParagraph();
    bookmarkStart("transcript");

    //The workbook lessons contain links to review pages that are broken, There
    //are many of these so we intercept a click here and correct the href.
    $(".transcript.workbook a.hide-review").on("click", function(e) {
      e.preventDefault();

      let href = $(this).attr("href");
      if (!href.startsWith("/t/acim")) {
        location.href = `/t/acim${href}`;
      }
    });

    $(".transcript.workbook > p.cmiTranPara > a").on("click", function(e) {
      e.preventDefault();

      let href = $(this).attr("href");
      if (!href.startsWith("/t/acim")) {
        location.href = `/t/acim${href}`;
      }
    });

  }).catch((error) => {
    console.error(error);
  });
});
