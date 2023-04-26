/*
  Teaching specific data
*/

const keyInfo = require("./modules/_config/key");
import {getReservation, getAudioInfo, getPageInfo} from "./modules/_config/config";

const env = "integration";
const sid = "acim";
const lang = "en";
const title = "A Course In Miracles";
const HOME_URI = `/t/${sid}`;

export default {
  sid: sid,
  env: env,
  lang: lang,
  title: title,
  url_prefix: HOME_URI,
  configUrl: `${HOME_URI}/public/config`,
  sourceId: 12,
  quoteManagerId: "05399539cca9ac38db6db36f5c770ff1",
  quoteManagerName: "CMI",
  getPageInfo: getPageInfo,
  keyInfo: keyInfo,
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
    cfgraj: "cfg.raj",
    cfgtext: "cfg.text",
    cfgworkbook: "cfg.workbook",
    cfgmanual: "cfg.manual",
    cfgpreface: "cfg.preface"
  }
};
