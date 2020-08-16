/*
  Teaching specific data
*/

const keyInfo = require("./modules/_config/key");
import {getPageInfo} from "./modules/_config/config";

export default {
  sid: "acim",
  env: "integration",                      //sa or prod, sa=standalone
  lang: "en",
  url_prefix: "/t/acim",                  //navigator
  getPageInfo: getPageInfo,              //list
  keyInfo: keyInfo,                      //list, bmnet
  store: {
    bmList: "bm.list",
    bmCreation: "bm.creation",
    bmTopics: "bm.topics",
    bmModal: "bm.modal",
    srchResults: "srch.results",
    srchtextflat: "srch.text.flat",
    srchworkbookflat: "srch.workbook.flat",
    srchmanualflat: "srch.manual.flat",
    srchprefaceflat: "srch.preface.flat",
    pnDisplay: "pn.display",
    cfgacq: "cfg.acq",
    cfgtext: "cfg.text",
    cfgworkbook: "cfg.workbook",
    cfgmanual: "cfg.manual",
    cfgpreface: "cfg.preface"
  }
};
