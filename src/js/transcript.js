/* eslint no-console: off */

import {SourceStore, storeInit} from "common/modules/_util/store";
import search from "common/modules/_search/search";
import {showParagraph} from "common/modules/_util/url";
import {initTranscriptPage} from "common/modules/_page/startup";

import {setEnv, loadConfig} from "./modules/_config/config";
import toc, {getBookId} from "./modules/_contents/toc";

import constants from "./constants";

$(document).ready(() => {
  const store = new SourceStore(constants);
  storeInit(constants);

  setEnv(store);

  //load config file and do initializations that depend on a loaded config file
  loadConfig(getBookId()).then((result) => {
    initTranscriptPage(store);
    search.initialize(store);
    toc.initialize("transcript");
    showParagraph();

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
